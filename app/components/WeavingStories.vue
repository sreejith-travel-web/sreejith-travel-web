<!-- ~/app/components/WeavingStories.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

export type ThreadPalette = 'gold' | 'blue'
export type SectionTheme = 'light' | 'dark'

const props = withDefaults(
  defineProps<{
    palette?: ThreadPalette
    homepageOnly?: boolean
  }>(),
  {
    palette: 'gold',
    homepageOnly: false
  }
)

const route = useRoute()

// ==========================================
// REACTIVE RENDER STATE
// ==========================================
const isInitialized = ref(false)
const svgWidth = ref(1440)
const svgHeight = ref(3000)

const pathA = ref('')
const pathB = ref('')
const totalLengthA = ref(0)
const totalLengthB = ref(0)
const dashOffsetA = ref(0)
const dashOffsetB = ref(0)

const activeTheme = ref<SectionTheme>('light')

const isRouteActive = computed(() => {
  if (!props.homepageOnly) return true
  return route.path === '/'
})

// ==========================================
// CACHED GEOMETRY & LUT (ZERO SCROLL READS)
// ==========================================
interface LutPoint {
  y: number
  lenA: number
  lenB: number
}

interface ThemeBand {
  top: number
  bottom: number
  theme: SectionTheme
}

let lut: LutPoint[] = []
let themeBands: ThemeBand[] = []
let startDocY = 0
let footerDocTop = 0
let cachedDocHeight = 0
let cachedVh = 0

let rafId: number | null = null
let resizeTimer: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null
let initObserver: IntersectionObserver | null = null
let hasBoundScroll = false

// ==========================================
// PURE MATH BEZIER ARC-LENGTH INTEGRATOR
// ==========================================
const cubicPoint = (p0: number, p1: number, p2: number, p3: number, t: number): number => {
  const mt = 1 - t
  return (
    mt * mt * mt * p0 +
    3 * mt * mt * t * p1 +
    3 * mt * t * t * p2 +
    t * t * t * p3
  )
}

const measureCubicSegment = (
  x0: number,
  y0: number,
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  x1: number,
  y1: number,
  steps = 16
): { length: number; samples: { y: number; dl: number }[] } => {
  let prevX = x0
  let prevY = y0
  let acc = 0
  const samples: { y: number; dl: number }[] = []

  for (let i = 1; i <= steps; i++) {
    const t = i / steps
    const nx = cubicPoint(x0, cx1, cx2, x1, t)
    const ny = cubicPoint(y0, cy1, cy2, y1, t)
    const seg = Math.hypot(nx - prevX, ny - prevY)
    acc += seg
    samples.push({ y: ny, dl: acc })
    prevX = nx
    prevY = ny
  }

  return { length: acc, samples }
}

// ==========================================
// DOUBLE-HELIX & CURSIVE FOOTER PATH BUILDER
// ==========================================
const measureAndBuild = () => {
  if (!import.meta.client || !isRouteActive.value) return

  const sectionEls = Array.from(
    document.querySelectorAll<HTMLElement>('.section-wrapper')
  ).filter((el) => el.offsetParent !== null && el.offsetHeight > 40)

  if (sectionEls.length === 0) {
    isInitialized.value = false
    return
  }

  const scrollY = window.scrollY || window.pageYOffset
  const vw = document.documentElement.clientWidth
  const vh = window.innerHeight
  const docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight
  )

  svgWidth.value = vw
  svgHeight.value = docHeight
  cachedDocHeight = docHeight
  cachedVh = vh

  // 1. Cache theme bands once (zero getBoundingClientRect during scroll)
  const themedEls = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'))
  themeBands = themedEls.map((el) => {
    const rect = el.getBoundingClientRect()
    const rawTheme = el.dataset.theme
    return {
      top: rect.top + scrollY,
      bottom: rect.bottom + scrollY,
      theme: rawTheme === 'dark' ? 'dark' : 'light'
    }
  })

  // 2. Measure section metrics in a single batched read pass
  const sections = sectionEls.map((el) => {
    const rect = el.getBoundingClientRect()
    const style = window.getComputedStyle(el)
    const padLeft = parseFloat(style.paddingLeft) || 16
    const padRight = parseFloat(style.paddingRight) || 16
    const padTop = parseFloat(style.paddingTop) || 40
    const padBottom = parseFloat(style.paddingBottom) || 40

    return {
      top: rect.top + scrollY,
      bottom: rect.bottom + scrollY,
      leftX: Math.max(3, padLeft * 0.5),
      rightX: Math.min(vw - 3, vw - padRight * 0.5),
      padTop,
      padBottom
    }
  })

  const footerEl = document.querySelector<HTMLElement>('footer')
  let footerTop = docHeight - 320
  let footerPadTop = 48
  let footerLeftX = sections[sections.length - 1]!.leftX
  let footerRightX = sections[sections.length - 1]!.rightX

  if (footerEl) {
    const fRect = footerEl.getBoundingClientRect()
    footerTop = fRect.top + scrollY
    const fInner = footerEl.querySelector<HTMLElement>('div') || footerEl
    const fStyle = window.getComputedStyle(fInner)
    footerPadTop = parseFloat(fStyle.paddingTop) || 48
  }

  footerDocTop = footerTop
  const firstSec = sections[0]!
  startDocY = firstSec.top

  // Path string & arc-length accumulators
  let dA = ''
  let dB = ''
  let lenA = 0
  let lenB = 0
  const newLut: LutPoint[] = []

  const pushLut = (y: number, lA: number, lB: number) => {
    const clampedY = Math.max(startDocY, y)
    const last = newLut[newLut.length - 1]
    if (!last || clampedY > last.y + 0.5) {
      newLut.push({ y: clampedY, lenA: lA, lenB: lB })
    } else {
      last.lenA = Math.max(last.lenA, lA)
      last.lenB = Math.max(last.lenB, lB)
    }
  }

  const addLinePair = (
    xA0: number,
    y0: number,
    xA1: number,
    y1: number,
    xB0: number,
    xB1: number
  ) => {
    dA += ` L ${xA1.toFixed(1)} ${y1.toFixed(1)}`
    dB += ` L ${xB1.toFixed(1)} ${y1.toFixed(1)}`
    lenA += Math.hypot(xA1 - xA0, y1 - y0)
    lenB += Math.hypot(xB1 - xB0, y1 - y0)
    pushLut(y1, lenA, lenB)
  }

  const addCubicPair = (
    xA0: number,
    y0: number,
    cxA1: number,
    cyA1: number,
    cxA2: number,
    cyA2: number,
    xA1: number,
    y1: number,
    xB0: number,
    cxB1: number,
    cyB1: number,
    cxB2: number,
    cyB2: number,
    xB1: number
  ) => {
    dA += ` C ${cxA1.toFixed(1)} ${cyA1.toFixed(1)}, ${cxA2.toFixed(1)} ${cyA2.toFixed(1)}, ${xA1.toFixed(1)} ${y1.toFixed(1)}`
    dB += ` C ${cxB1.toFixed(1)} ${cyB1.toFixed(1)}, ${cxB2.toFixed(1)} ${cyB2.toFixed(1)}, ${xB1.toFixed(1)} ${y1.toFixed(1)}`

    const mA = measureCubicSegment(xA0, y0, cxA1, cyA1, cxA2, cyA2, xA1, y1, 16)
    const mB = measureCubicSegment(xB0, y0, cxB1, cyB1, cxB2, cyB2, xB1, y1, 16)

    for (let i = 0; i < mA.samples.length; i++) {
      const sA = mA.samples[i]!
      const sB = mB.samples[i]!
      pushLut((sA.y + sB.y) * 0.5, lenA + sA.dl, lenB + sB.dl)
    }

    lenA += mA.length
    lenB += mB.length
  }

  // 3. Entry at top of First Section (About Section)
  let curXA = firstSec.leftX
  let curXB = firstSec.rightX
  const entryDrop = Math.min(28, firstSec.padTop * 0.65)
  let curY = firstSec.top + entryDrop

  dA = `M 0 ${firstSec.top.toFixed(1)}`
  dB = `M ${vw.toFixed(1)} ${firstSec.top.toFixed(1)}`
  pushLut(firstSec.top, 0, 0)

  addCubicPair(
    0,
    firstSec.top,
    curXA * 0.6,
    firstSec.top,
    curXA,
    firstSec.top + entryDrop * 0.4,
    curXA,
    curY,
    vw,
    vw - (vw - curXB) * 0.6,
    firstSec.top,
    curXB,
    firstSec.top + entryDrop * 0.4,
    curXB
  )

  // 4. Traverse Sections & Cross in Bottom/Top Paddings
  let isAOnLeft: boolean = true

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i]!
    const nextSec = sections[i + 1]

    const targetXA = isAOnLeft ? sec.leftX : sec.rightX
    const targetXB = isAOnLeft ? sec.rightX : sec.leftX

    if (Math.abs(targetXA - curXA) > 0.5 || Math.abs(targetXB - curXB) > 0.5) {
      const adjustY = Math.min(curY + 16, sec.bottom - sec.padBottom)
      addLinePair(curXA, curY, targetXA, adjustY, curXB, targetXB)
      curXA = targetXA
      curXB = targetXB
      curY = adjustY
    }

    // Stop vertical drop cleanly inside the bottom padding start
    const yDropEnd = Math.max(curY + 10, sec.bottom - sec.padBottom * 0.85)
    addLinePair(curXA, curY, curXA, yDropEnd, curXB, curXB)
    curY = yDropEnd

    if (nextSec) {
      // Safe horizontal S-curve zone inside section padding band
      const rawEnd = nextSec.top + nextSec.padTop * 0.85
      const yCrossEnd =
        rawEnd - yDropEnd > 180 ? sec.bottom + 44 : Math.max(yDropEnd + 36, rawEnd)

      const nextIsAOnLeft: boolean = !isAOnLeft
      const nextXA = nextIsAOnLeft ? nextSec.leftX : nextSec.rightX
      const nextXB = nextIsAOnLeft ? nextSec.rightX : nextSec.leftX

      const midX = vw * 0.5
      const midY = (yDropEnd + yCrossEnd) * 0.5
      const dyHalf = (yCrossEnd - yDropEnd) * 0.5
      // Subtle vertical separation at center so the two threads arch gracefully
      const sep = Math.min(5, dyHalf * 0.12)

      // Half 1: Vertical gutter -> Center horizontal inflection
      addCubicPair(
        curXA,
        yDropEnd,
        curXA,
        yDropEnd + dyHalf * 0.82,
        curXA + (midX - curXA) * 0.38,
        midY - sep,
        midX,
        midY - sep,
        curXB,
        curXB,
        yDropEnd + dyHalf * 0.82,
        curXB + (midX - curXB) * 0.38,
        midY + sep,
        midX
      )

      // Half 2: Center horizontal inflection -> Opposite vertical gutter
      addCubicPair(
        midX,
        midY - sep,
        midX + (nextXA - midX) * 0.62,
        midY - sep,
        nextXA,
        yCrossEnd - dyHalf * 0.82,
        nextXA,
        yCrossEnd,
        midX,
        midX + (nextXB - midX) * 0.62,
        midY + sep,
        nextXB,
        yCrossEnd - dyHalf * 0.82,
        nextXB
      )

      curXA = nextXA
      curXB = nextXB
      curY = yCrossEnd
      isAOnLeft = nextIsAOnLeft
    }
  }

  // 5. Footer Interlocking Cursive Loops & Outer Corner Rest
  const weaveStartY = curY
  const weaveEndY = Math.max(weaveStartY + 56, footerTop + footerPadTop * 0.85)
  const weaveMidY = (weaveStartY + weaveEndY) * 0.5
  const weaveSpanY = weaveEndY - weaveStartY

  const finalXA = isAOnLeft ? footerRightX : footerLeftX
  const finalXB = isAOnLeft ? footerLeftX : footerRightX

  const loops = vw < 640 ? 3 : 5
  const spanX = finalXA - curXA
  const stepX = spanX / (loops + 1)
  const loopBackX = stepX * 0.28
  const amp = Math.min(18, weaveSpanY * 0.32)

  // Lead-in from vertical gutter to horizontal wave centerline
  const firstWaveXA = curXA + stepX * 0.65
  const firstWaveXB = curXB - stepX * 0.65
  const leadY = weaveStartY + weaveSpanY * 0.35

  addCubicPair(
    curXA,
    weaveStartY,
    curXA,
    leadY,
    curXA + stepX * 0.25,
    leadY,
    firstWaveXA,
    leadY,
    curXB,
    curXB,
    leadY,
    curXB - stepX * 0.25,
    leadY,
    firstWaveXB
  )

  let wXA = firstWaveXA
  let wXB = firstWaveXB
  let wY = leadY

  // Interlocking cursive loop ribbon across footer top padding
  for (let k = 0; k < loops; k++) {
    const progress = (k + 1) / (loops + 1)
    const nextWXA = curXA + spanX * (0.15 + 0.7 * progress)
    const nextWXB = curXB - spanX * (0.15 + 0.7 * progress)
    const nextWY = weaveStartY + weaveSpanY * (0.35 + 0.3 * progress)
    const sign = k % 2 === 0 ? 1 : -1

    // Crest / Loop-over
    const peakXA = (wXA + nextWXA) * 0.5 + loopBackX
    const peakXB = (wXB + nextWXB) * 0.5 - loopBackX
    const midLoopY = (wY + nextWY) * 0.5

    addCubicPair(
      wXA,
      wY,
      wXA + stepX * 0.55,
      midLoopY - sign * amp,
      peakXA,
      midLoopY + sign * amp,
      nextWXA,
      nextWY,
      wXB,
      wXB - stepX * 0.55,
      midLoopY + sign * amp,
      peakXB,
      midLoopY - sign * amp,
      nextWXB
    )

    wXA = nextWXA
    wXB = nextWXB
    wY = nextWY
  }

  // Lead-out into opposite outer footer gutters
  addCubicPair(
    wXA,
    wY,
    finalXA - stepX * 0.25,
    wY,
    finalXA,
    weaveEndY - 12,
    finalXA,
    weaveEndY,
    wXB,
    finalXB + stepX * 0.25,
    wY,
    finalXB,
    weaveEndY - 12,
    finalXB
  )

  // Trace down both outer edges of the footer & trail off bottom corners
  const cornerStartY = Math.max(weaveEndY + 20, docHeight - 24)
  addLinePair(finalXA, weaveEndY, finalXA, cornerStartY, finalXB, finalXB)

  const cornerEdgeA = finalXA < vw * 0.5 ? 0 : vw
  const cornerEdgeB = finalXB < vw * 0.5 ? 0 : vw

  addCubicPair(
    finalXA,
    cornerStartY,
    finalXA,
    docHeight - 6,
    (finalXA + cornerEdgeA) * 0.5,
    docHeight,
    cornerEdgeA,
    docHeight,
    finalXB,
    finalXB,
    docHeight - 6,
    (finalXB + cornerEdgeB) * 0.5,
    docHeight,
    cornerEdgeB
  )

  // 6. Commit Paths & LUT
  lut = newLut
  pathA.value = dA
  pathB.value = dB
  totalLengthA.value = lenA
  totalLengthB.value = lenB
  isInitialized.value = true

  updateScrollProgress()
}

// ==========================================
// 60FPS BINARY-SEARCH SCROLL PROGRESS SYNC
// ==========================================
const lookupLengthsAtY = (targetY: number): { lA: number; lB: number } => {
  if (lut.length === 0) return { lA: 0, lB: 0 }
  if (targetY <= lut[0]!.y) return { lA: 0, lB: 0 }
  const last = lut[lut.length - 1]!
  if (targetY >= last.y) return { lA: last.lenA, lB: last.lenB }

  let low = 0
  let high = lut.length - 1

  while (low <= high) {
    const mid = (low + high) >>> 1
    if (lut[mid]!.y < targetY) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }

  const p0 = lut[Math.max(0, low - 1)]!
  const p1 = lut[Math.min(lut.length - 1, low)]!
  const span = p1.y - p0.y
  const ratio = span > 0.001 ? (targetY - p0.y) / span : 0

  return {
    lA: p0.lenA + (p1.lenA - p0.lenA) * ratio,
    lB: p0.lenB + (p1.lenB - p0.lenB) * ratio
  }
}

const updateScrollProgress = () => {
  rafId = null
  if (!isInitialized.value || lut.length === 0) return

  const scrollY = window.scrollY || window.pageYOffset
  const vh = cachedVh || window.innerHeight
  const maxScroll = Math.max(1, cachedDocHeight - vh)

  // Base needle target: 50% viewport height (eye level)
  let needleY = scrollY + vh * 0.5

  // Smooth catch-up in the footer zone so the thread finishes at 100% bottom scroll
  const catchupStartScroll = Math.max(
    startDocY,
    Math.min(footerDocTop - vh * 0.5, maxScroll - vh * 0.85)
  )
  if (scrollY > catchupStartScroll && maxScroll > catchupStartScroll) {
    const footerProgress = Math.min(
      1,
      (scrollY - catchupStartScroll) / (maxScroll - catchupStartScroll)
    )
    needleY += footerProgress * (vh * 0.5)
  }

  // Reveal only once user scrolls and needle touches the first section
  if (scrollY <= 2 || needleY <= startDocY) {
    dashOffsetA.value = totalLengthA.value
    dashOffsetB.value = totalLengthB.value
    return
  }

  const { lA, lB } = lookupLengthsAtY(needleY)
  dashOffsetA.value = Math.max(0, totalLengthA.value - lA)
  dashOffsetB.value = Math.max(0, totalLengthB.value - lB)

  // Update theme color from cached section boundaries (Zero DOM access)
  for (let i = 0; i < themeBands.length; i++) {
    const band = themeBands[i]!
    if (needleY >= band.top && needleY <= band.bottom) {
      if (activeTheme.value !== band.theme) {
        activeTheme.value = band.theme
      }
      break
    }
  }
}

const onScroll = () => {
  if (rafId === null) {
    rafId = requestAnimationFrame(updateScrollProgress)
  }
}

// ==========================================
// LAZY INITIALIZATION (PROTECTS LCP / TBT)
// ==========================================
const bootEngine = () => {
  if (hasBoundScroll) return
  hasBoundScroll = true

  window.removeEventListener('scroll', onFirstScrollTrigger)
  initObserver?.disconnect()

  requestAnimationFrame(() => {
    measureAndBuild()
    window.addEventListener('scroll', onScroll, { passive: true })

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (resizeTimer) clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => {
          requestAnimationFrame(measureAndBuild)
        }, 120)
      })
      resizeObserver.observe(document.body)
    }
  })
}

const onFirstScrollTrigger = () => {
  if (window.scrollY > 4) {
    bootEngine()
  }
}

const setupLazyTrigger = () => {
  if (!import.meta.client || !isRouteActive.value) return

  // If page is already scrolled on reload, boot on idle frame
  if (window.scrollY > 10) {
    bootEngine()
    return
  }

  window.addEventListener('scroll', onFirstScrollTrigger, { passive: true })

  const firstSec = document.querySelector('.section-wrapper')
  if (firstSec && 'IntersectionObserver' in window) {
    initObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && window.scrollY > 2) {
          bootEngine()
        }
      },
      { rootMargin: '150px' }
    )
    initObserver.observe(firstSec)
  }
}

const cleanupEngine = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (resizeTimer) clearTimeout(resizeTimer)
  window.removeEventListener('scroll', onFirstScrollTrigger)
  window.removeEventListener('scroll', onScroll)
  initObserver?.disconnect()
  resizeObserver?.disconnect()
  hasBoundScroll = false
  isInitialized.value = false
}

watch(
  () => route.fullPath,
  () => {
    cleanupEngine()
    if (import.meta.client && isRouteActive.value) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          setupLazyTrigger()
        })
      }, 150)
    }
  }
)

onMounted(() => {
  setupLazyTrigger()
})

onBeforeUnmount(() => {
  cleanupEngine()
})
</script>

<template>
  <div
    v-if="isRouteActive && isInitialized"
    class="weaving-stories-layer pointer-events-none select-none absolute top-0 left-0 w-full overflow-hidden z-30"
    :style="{ height: `${svgHeight}px` }"
    :data-palette="props.palette"
    :data-thread-theme="activeTheme"
    aria-hidden="true"
  >
    <svg
      class="w-full h-full block"
      :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Thread A: Outer 2px Base + Inner 0.5px Luminous Core -->
      <path
        :d="pathA"
        class="thread-outer"
        :stroke-dasharray="totalLengthA"
        :stroke-dashoffset="dashOffsetA"
      />
      <path
        :d="pathA"
        class="thread-inner"
        :stroke-dasharray="totalLengthA"
        :stroke-dashoffset="dashOffsetA"
      />

      <!-- Thread B: Outer 2px Base + Inner 0.5px Luminous Core -->
      <path
        :d="pathB"
        class="thread-outer"
        :stroke-dasharray="totalLengthB"
        :stroke-dashoffset="dashOffsetB"
      />
      <path
        :d="pathB"
        class="thread-inner"
        :stroke-dasharray="totalLengthB"
        :stroke-dashoffset="dashOffsetB"
      />
    </svg>
  </div>
</template>

<style scoped>
/* ==========================================
   PALETTE & THEME ADAPTATION (200ms FADE)
   ========================================== */
.weaving-stories-layer[data-palette='gold'][data-thread-theme='light'] {
  --thread-outer: var(--color-darker-gold, #946315);
  --thread-inner: var(--color-intention-gold, #d48302);
}

.weaving-stories-layer[data-palette='gold'][data-thread-theme='dark'] {
  --thread-outer: var(--color-heritage-gold, #e6a61e);
  --thread-inner: var(--color-warm-gold, #ffc15c);
}

.weaving-stories-layer[data-palette='blue'][data-thread-theme='light'] {
  --thread-outer: var(--color-intention-deep, #032352);
  --thread-inner: var(--color-action-blue, #397f9d);
}

.weaving-stories-layer[data-palette='blue'][data-thread-theme='dark'] {
  --thread-outer: var(--color-journey-blue, #79b9d2);
  --thread-inner: var(--color-soft-blue, #a8d3e2);
}

.thread-outer {
  stroke: var(--thread-outer);
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 200ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: stroke-dashoffset;
}

.thread-inner {
  stroke: var(--thread-inner);
  stroke-width: 0.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 200ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: stroke-dashoffset;
}
</style>
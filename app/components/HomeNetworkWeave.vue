<!-- ~/app/components/HomeNetworkWeave.vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'
import CtaButton from '~/components/CtaButton.vue'

export interface NetworkWeavePortraitItem {
  id: string | number
  image: string
  alt: string
  label?: string
  width?: number
  height?: number
}

export interface HomeNetworkWeaveConfig {
  eyebrow: string
  title: string
  description: string
  cta: {
    label: string
    to: string
  }
  fallbackImage?: string
  portraits?: NetworkWeavePortraitItem[]
}

interface SlotMetric {
  baseX: number
  baseY: number
  r: number
}

interface LiveNodeState {
  cx: number
  cy: number
  r: number
  dx: number
  dy: number
  isOverWeave: boolean
}

interface RimEyelet {
  x: number
  y: number
  visible: boolean
}

// Centralized choreography, Bezier wave curvature & dreamy buoyancy constants
const WEAVE_CONFIG = {
  eyebrowDelayMs: 40,
  titleDelayMs: 120,
  copyDelayMs: 200,
  ctaDelayMs: 280,
  drawDelayMs: 220,
  drawDurationMs: 3100,
  sWaveTiltDeg: 27,
  handleScale: 0.41,
  crescentDepthRatio: 0.76,
  floatAmpX: 2.3,
  floatAmpY: 3.8,
  floatSpeedRadPerSec: 0.82,
  filamentCycleSec: 8.5,
  ghostDriftPxPerSec: 9
} as const

// Grid placement classes per portrait index (0..6):
// <1024px: 3 staggered top -> protected copy row -> 4 staggered bottom
// >=1024px: clockwise 7-node orbital perimeter framing col-start-3..10 copy core
const SLOT_GRID_CLASSES: readonly string[] = [
  'col-start-1 col-span-2 row-start-1 justify-self-center self-end mt-5 sm:mt-6 lg:mt-0 lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:translate-y-4',
  'col-start-3 col-span-2 row-start-1 justify-self-center self-start -mt-1 lg:mt-0 lg:col-start-6 lg:col-span-2 lg:row-start-1 lg:-translate-y-2',
  'col-start-5 col-span-2 row-start-1 justify-self-center self-end mt-8 sm:mt-10 lg:mt-0 lg:col-start-10 lg:col-span-2 lg:row-start-1 lg:translate-y-4',
  'col-start-4 col-span-3 row-start-3 justify-self-center self-start mt-5 sm:mt-7 lg:mt-0 lg:col-start-11 lg:col-span-2 lg:row-start-2 lg:self-center lg:translate-y-2',
  'col-start-1 col-span-3 row-start-3 justify-self-center self-start mt-0.5 sm:mt-1 lg:mt-0 lg:col-start-8 lg:col-span-2 lg:row-start-3 lg:-translate-y-2',
  'col-start-1 col-span-3 row-start-4 justify-self-center self-start mt-1 sm:mt-2 lg:mt-0 lg:col-start-4 lg:col-span-2 lg:row-start-3 lg:-translate-y-1',
  'col-start-4 col-span-3 row-start-4 justify-self-center self-start mt-6 sm:mt-8 lg:mt-0 lg:col-start-1 lg:col-span-2 lg:row-start-2 lg:self-center lg:translate-y-7'
]

// Outward crescent orientation angles (deg) so the thread weaves near rims, never over faces
const DESKTOP_CRESCENT_DEG = [-125, -90, -45, 10, 68, 115, 172] as const
const MOBILE_CRESCENT_DEG = [-135, -90, -35, -25, -145, 145, 45] as const

const DEFAULT_PORTRAITS: NetworkWeavePortraitItem[] = [
  {
    id: 'weave-1',
    image: '/images/journal/journal1.webp',
    alt: 'Master handloom weaver crafting heirloom textiles in Kerala',
    label: 'Chendamangalam Handloom'
  },
  {
    id: 'weave-2',
    image: '/images/home/journey-pc1.webp',
    alt: 'Local homestead host welcoming travellers across South India',
    label: 'Heritage Homesteads'
  },
  {
    id: 'weave-3',
    image: '/images/journal/journal2.webp',
    alt: 'Oral historian sharing centuries of Malabar maritime stories',
    label: 'Oral Storytellers'
  },
  {
    id: 'weave-4',
    image: '/images/impact/impact6.webp',
    alt: 'Travel designers collaborating on bespoke regional routes',
    label: 'Collaborative Route Design'
  },
  {
    id: 'weave-5',
    image: '/images/home/forest-portrait.webp',
    alt: 'Highland naturalist tracking flora in the Western Ghats',
    label: 'Shola Naturalists'
  },
  {
    id: 'weave-6',
    image: '/images/impact/impact3.webp',
    alt: 'Artisans and cultural partners co-creating mindful experiences',
    label: 'Craft Guilds'
  },
  {
    id: 'weave-7',
    image: '/images/home/journey-mob.webp',
    alt: 'Quiet country boat gliding through palm-fringed Kerala backwaters',
    label: 'Backwater Custodians'
  }
]

const props = defineProps<{
  data: HomeNetworkWeaveConfig
}>()

const sectionRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLElement | null>(null)
const coreRef = ref<HTMLElement | null>(null)
const slotElMap = new Map<number, HTMLElement>()
const medallionElMap = new Map<number, HTMLElement>()

const canvasWidth = ref(1200)
const canvasHeight = ref(720)
const isDesktop = ref(true)
const isReady = ref(false)

const solidThreadD = ref('')
const ghostMeridianD = ref('')
const drawProgress = ref(0)
const filamentOffset = ref(1.25)
const ghostDashOffset = ref(0)
const needleTip = ref<{ x: number; y: number; visible: boolean }>({
  x: 0,
  y: 0,
  visible: false
})

const liveNodes = ref<LiveNodeState[]>([])
const rimEyelets = ref<RimEyelet[]>([])
const nodeRevealed = ref<boolean[]>(Array.from({ length: 7 }, () => false))
const nodeTriggerThresholds = ref<number[]>([0, 0.14, 0.28, 0.42, 0.57, 0.71, 0.85])

let slotMetrics: SlotMetric[] = []
let coreBounds = { right: 640, midY: 360 }

let rafId: number | null = null
let introStartTimestamp: number | null = null
let isInViewport = false
let isTabHidden = false
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let lgMediaQuery: MediaQueryList | null = null

const fallbackImgSrc = computed(
  () => props.data.fallbackImage || '/images/fallbacks/culture.webp'
)

const resolvedPortraits = computed<NetworkWeavePortraitItem[]>(() => {
  const list = props.data.portraits?.length
    ? props.data.portraits
    : DEFAULT_PORTRAITS
  return list.slice(0, 7)
})

// Odd portraits (1, 3, 5) carry the z-30 over-crescent thread pass for true over/under loom depth
const overWeaveNodes = computed(() =>
  liveNodes.value.filter((node) => node.isOverWeave)
)

const setSlotRef = (idx: number, el: unknown) => {
  if (el instanceof HTMLElement) {
    slotElMap.set(idx, el)
  } else {
    slotElMap.delete(idx)
  }
}

const setMedallionRef = (idx: number, el: unknown) => {
  if (el instanceof HTMLElement) {
    medallionElMap.set(idx, el)
  } else {
    medallionElMap.delete(idx)
  }
}

const onPortraitError = (e: Event) => {
  const img = e.target as HTMLImageElement | null
  if (img && img.src !== fallbackImgSrc.value) {
    img.src = fallbackImgSrc.value
  }
}

// =========================================================
// CUBIC-BEZIER S-WAVE LOOM SOLVER & EXACT RIM INTERSECTION
// =========================================================
interface CubicSegment {
  p0: { x: number; y: number }
  cp1: { x: number; y: number }
  cp2: { x: number; y: number }
  p1: { x: number; y: number }
  approxLen: number
}

const evalCubicPoint = (seg: CubicSegment, t: number): { x: number; y: number } => {
  const u = 1 - t
  const b0 = u * u * u
  const b1 = 3 * u * u * t
  const b2 = 3 * u * t * t
  const b3 = t * t * t
  return {
    x: b0 * seg.p0.x + b1 * seg.cp1.x + b2 * seg.cp2.x + b3 * seg.p1.x,
    y: b0 * seg.p0.y + b1 * seg.cp1.y + b2 * seg.cp2.y + b3 * seg.p1.y
  }
}

// Finds the exact sub-pixel coordinate where the incoming Bezier crosses the portrait's rim
const findRimCrossing = (
  seg: CubicSegment,
  cx: number,
  cy: number,
  targetR: number
): { x: number; y: number } => {
  let lo = 0
  let hi = 1
  for (let iter = 0; iter < 11; iter++) {
    const mid = (lo + hi) * 0.5
    const pt = evalCubicPoint(seg, mid)
    const dist = Math.hypot(pt.x - cx, pt.y - cy)
    if (dist > targetR) {
      lo = mid
    } else {
      hi = mid
    }
  }
  return evalCubicPoint(seg, (lo + hi) * 0.5)
}

const rotateVec = (vx: number, vy: number, deg: number): { x: number; y: number } => {
  const rad = (deg * Math.PI) / 180
  const c = Math.cos(rad)
  const s = Math.sin(rad)
  return { x: vx * c - vy * s, y: vx * s + vy * c }
}

const normalizeVec = (vx: number, vy: number): { x: number; y: number } => {
  const len = Math.hypot(vx, vy) || 1
  return { x: vx / len, y: vy / len }
}

const solveFlowingSpline = (
  waypoints: ReadonlyArray<{ x: number; y: number }>,
  closed: boolean,
  tiltSign: number,
  tiltDegOverride?: number
): { d: string; segments: CubicSegment[]; cumulativeRatios: number[] } => {
  const n = waypoints.length
  if (n < 2) return { d: '', segments: [], cumulativeRatios: [] }

  const tiltDeg = (tiltDegOverride ?? WEAVE_CONFIG.sWaveTiltDeg) * tiltSign
  const tangents: Array<{ x: number; y: number }> = []

  for (let i = 0; i < n; i++) {
    const prev = closed
      ? waypoints[(i - 1 + n) % n]!
      : waypoints[Math.max(0, i - 1)]!
    const next = closed
      ? waypoints[(i + 1) % n]!
      : waypoints[Math.min(n - 1, i + 1)]!

    const baseDir = normalizeVec(next.x - prev.x, next.y - prev.y)
    // Tilting node tangents consistently creates C1-smooth calligraphic S-waves across every span
    tangents.push(rotateVec(baseDir.x, baseDir.y, tiltDeg))
  }

  const segCount = closed ? n : n - 1
  const segments: CubicSegment[] = []
  let totalLen = 0
  const cumLens: number[] = [0]

  for (let i = 0; i < segCount; i++) {
    const idx0 = i
    const idx1 = (i + 1) % n
    const p0 = waypoints[idx0]!
    const p1 = waypoints[idx1]!
    const t0 = tangents[idx0]!
    const t1 = tangents[idx1]!

    const chord = Math.hypot(p1.x - p0.x, p1.y - p0.y)
    const hLen = chord * WEAVE_CONFIG.handleScale

    const cp1 = { x: p0.x + t0.x * hLen, y: p0.y + t0.y * hLen }
    const cp2 = { x: p1.x - t1.x * hLen, y: p1.y - t1.y * hLen }

    // 4-step chord approximation for accurate arc-length progress synchronization
    const seg: CubicSegment = { p0, cp1, cp2, p1, approxLen: 0 }
    let sLen = 0
    let lastPt = p0
    for (let s = 1; s <= 4; s++) {
      const nextPt = evalCubicPoint(seg, s / 4)
      sLen += Math.hypot(nextPt.x - lastPt.x, nextPt.y - lastPt.y)
      lastPt = nextPt
    }
    seg.approxLen = Math.max(1, sLen)
    totalLen += seg.approxLen
    cumLens.push(totalLen)
    segments.push(seg)
  }

  let d = `M ${segments[0]!.p0.x.toFixed(1)} ${segments[0]!.p0.y.toFixed(1)}`
  for (const seg of segments) {
    d += ` C ${seg.cp1.x.toFixed(1)} ${seg.cp1.y.toFixed(1)}, ${seg.cp2.x.toFixed(1)} ${seg.cp2.y.toFixed(1)}, ${seg.p1.x.toFixed(1)} ${seg.p1.y.toFixed(1)}`
  }
  if (closed) d += ' Z'

  const safeTotal = Math.max(1, totalLen)
  const cumulativeRatios = cumLens.map((l) => l / safeTotal)

  return { d, segments, cumulativeRatios }
}

// Rebuilds live coupled portrait positions, Bezier paths, needle tip & rim eyelets (Zero DOM reads!)
const updateLoomFrame = (elapsedSec: number, progress: number) => {
  if (!slotMetrics.length) return

  const w = canvasWidth.value
  const desktop = isDesktop.value
  const degTable = desktop ? DESKTOP_CRESCENT_DEG : MOBILE_CRESCENT_DEG

  const nodes: LiveNodeState[] = []
  const crescentPts: Array<{ x: number; y: number }> = []

  for (let i = 0; i < slotMetrics.length; i++) {
    const m = slotMetrics[i]!
    const phase = i * 1.15
    const dx =
      Math.sin(elapsedSec * WEAVE_CONFIG.floatSpeedRadPerSec + phase) *
      WEAVE_CONFIG.floatAmpX
    const dy =
      Math.cos(elapsedSec * (WEAVE_CONFIG.floatSpeedRadPerSec * 0.86) + phase * 1.3) *
      WEAVE_CONFIG.floatAmpY

    const cx = m.baseX + dx
    const cy = m.baseY + dy

    // Apply GPU transform directly to medallion wrapper for silky 120fps buoyancy
    const medEl = medallionElMap.get(i)
    if (medEl) {
      const revealed = Boolean(nodeRevealed.value[i])
      const scale = revealed ? 1 : 0.85
      medEl.style.transform = `translate3d(${dx.toFixed(2)}px, ${dy.toFixed(2)}px, 0) scale(${scale})`
      medEl.style.opacity = revealed ? '1' : '0'
    }

    nodes.push({
      cx,
      cy,
      r: m.r,
      dx,
      dy,
      isOverWeave: i % 2 === 1
    })

    const cRad = ((degTable[i] ?? -90) * Math.PI) / 180
    const depth = m.r * WEAVE_CONFIG.crescentDepthRatio
    crescentPts.push({
      x: cx + Math.cos(cRad) * depth,
      y: cy + Math.sin(cRad) * depth
    })
  }

  liveNodes.value = nodes

  if (desktop && crescentPts.length >= 7) {
    // DESKTOP: Unbroken clockwise C1 S-wave loop weaving through all 7 portraits
    const mainSpline = solveFlowingSpline(crescentPts, true, 1)
    solidThreadD.value = mainSpline.d
    nodeTriggerThresholds.value = mainSpline.cumulativeRatios.slice(0, 7)

    // Counter-braided dotted heritage meridian
    const ghostPts = crescentPts.map((pt, i) => {
      const n = nodes[i]!
      const outDir = normalizeVec(pt.x - n.cx, pt.y - n.cy)
      const offset = i % 2 === 0 ? 18 : -16
      return { x: pt.x + outDir.x * offset, y: pt.y + outDir.y * offset }
    })
    ghostMeridianD.value = solveFlowingSpline(ghostPts, true, -1, 22).d

    // Exact rim eyelets where incoming segment crosses each portrait's circle
    const segs = mainSpline.segments
    rimEyelets.value = nodes.map((node, idx) => {
      const incomingSeg = segs[(idx - 1 + segs.length) % segs.length]!
      const pt = findRimCrossing(incomingSeg, node.cx, node.cy, node.r - 1.5)
      return {
        x: pt.x,
        y: pt.y,
        visible: Boolean(nodeRevealed.value[idx])
      }
    })

    updateNeedleFromSegments(
      mainSpline.segments,
      mainSpline.cumulativeRatios,
      progress
    )
  } else if (crescentPts.length >= 7) {
    // MOBILE & TABLET: Flowing S-ribbon (0->1->2 -> Right Margin Clear of Copy -> 3->4->5->6)
    const n0 = nodes[0]!
    const n6 = nodes[6]!
    const leadIn = {
      x: Math.max(8, n0.cx - n0.r * 1.45),
      y: Math.max(8, n0.cy - n0.r * 0.85)
    }
    const rightMarginBridge = {
      x: Math.min(w - 10, Math.max(coreBounds.right + 16, w - 18)),
      y: coreBounds.midY
    }
    const tailOut = {
      x: Math.min(w - 8, n6.cx + n6.r * 1.35),
      y: n6.cy + n6.r * 0.85
    }

    // Waypoint indices: 0=leadIn, 1=N0, 2=N1, 3=N2, 4=bridge, 5=N3, 6=N4, 7=N5, 8=N6, 9=tailOut
    const chain = [
      leadIn,
      crescentPts[0]!,
      crescentPts[1]!,
      crescentPts[2]!,
      rightMarginBridge,
      crescentPts[3]!,
      crescentPts[4]!,
      crescentPts[5]!,
      crescentPts[6]!,
      tailOut
    ]

    const mainSpline = solveFlowingSpline(chain, false, 1, 23)
    solidThreadD.value = mainSpline.d

    const ratios = mainSpline.cumulativeRatios
    nodeTriggerThresholds.value = [
      ratios[1] ?? 0.08,
      ratios[2] ?? 0.2,
      ratios[3] ?? 0.32,
      ratios[5] ?? 0.56,
      ratios[6] ?? 0.68,
      ratios[7] ?? 0.8,
      ratios[8] ?? 0.92
    ]

    const ghostChain = chain.map((pt, idx) => ({
      x: Math.min(w - 6, Math.max(6, pt.x + (idx % 2 === 0 ? 12 : -12))),
      y: pt.y + (idx % 2 === 0 ? -11 : 11)
    }))
    ghostMeridianD.value = solveFlowingSpline(ghostChain, false, -1, 18).d

    // Incoming segment index in `chain` for each portrait [N0..N6]
    const incomingSegMap = [0, 1, 2, 4, 5, 6, 7]
    rimEyelets.value = nodes.map((node, idx) => {
      const segIdx = incomingSegMap[idx]!
      const incomingSeg = mainSpline.segments[segIdx]!
      const pt = findRimCrossing(incomingSeg, node.cx, node.cy, node.r - 1.5)
      return {
        x: pt.x,
        y: pt.y,
        visible: Boolean(nodeRevealed.value[idx])
      }
    })

    updateNeedleFromSegments(
      mainSpline.segments,
      mainSpline.cumulativeRatios,
      progress
    )
  }
}

const updateNeedleFromSegments = (
  segments: CubicSegment[],
  ratios: number[],
  progress: number
) => {
  if (progress <= 0.002 || progress >= 0.998 || !segments.length) {
    needleTip.value = { x: 0, y: 0, visible: false }
    return
  }
  for (let i = 0; i < segments.length; i++) {
    const r0 = ratios[i] ?? 0
    const r1 = ratios[i + 1] ?? 1
    if (progress <= r1 || i === segments.length - 1) {
      const localT = Math.max(0, Math.min(1, (progress - r0) / Math.max(0.0001, r1 - r0)))
      const pt = evalCubicPoint(segments[i]!, localT)
      needleTip.value = { x: pt.x, y: pt.y, visible: true }
      return
    }
  }
}

// =========================================================
// LAYOUT MEASUREMENT (RUNS ONLY ON RESIZE, ZERO READS IN RAF)
// =========================================================
const measureCanvasAndSlots = () => {
  const canvasEl = canvasRef.value
  if (!canvasEl) return

  const cRect = canvasEl.getBoundingClientRect()
  if (cRect.width <= 0 || cRect.height <= 0) return

  canvasWidth.value = cRect.width
  canvasHeight.value = cRect.height

  if (coreRef.value) {
    const coreRect = coreRef.value.getBoundingClientRect()
    coreBounds = {
      right: coreRect.right - cRect.left,
      midY: coreRect.top - cRect.top + coreRect.height * 0.5
    }
  }

  const nextMetrics: SlotMetric[] = []
  const count = resolvedPortraits.value.length
  for (let i = 0; i < count; i++) {
    const slotEl = slotElMap.get(i)
    if (!slotEl) continue
    const sRect = slotEl.getBoundingClientRect()
    nextMetrics.push({
      baseX: sRect.left - cRect.left + sRect.width * 0.5,
      baseY: sRect.top - cRect.top + sRect.height * 0.5,
      r: sRect.width * 0.5
    })
  }

  if (nextMetrics.length === count) {
    slotMetrics = nextMetrics
    isReady.value = true
    updateLoomFrame(performance.now() * 0.001, drawProgress.value)
  }
}

// =========================================================
// UNIFIED CHOREOGRAPHY & LIVING LOOP ENGINE
// =========================================================
const easeSilkInOut = (t: number): number =>
  t < 0.5 ? 2.4 * t * t * (1.25 - 0.5 * t) : 1 - Math.pow(-2 * t + 2, 2.4) / 2

const shouldAnimate = (): boolean =>
  import.meta.client && isInViewport && !isTabHidden

const stopLoop = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

const tickLoom = (now: number) => {
  if (!shouldAnimate()) {
    rafId = null
    return
  }

  if (introStartTimestamp === null) {
    introStartTimestamp = now + WEAVE_CONFIG.drawDelayMs
  }

  const drawElapsed = now - introStartTimestamp
  if (drawElapsed <= 0) {
    drawProgress.value = 0
  } else if (drawElapsed >= WEAVE_CONFIG.drawDurationMs) {
    drawProgress.value = 1
  } else {
    const rawT = drawElapsed / WEAVE_CONFIG.drawDurationMs
    drawProgress.value = Math.max(0, Math.min(1, easeSilkInOut(rawT)))
  }

  // Bloom each portrait cleanly right as the golden needle arrives
  const p = drawProgress.value
  for (let i = 0; i < nodeRevealed.value.length; i++) {
    if (!nodeRevealed.value[i]) {
      const trigger = (nodeTriggerThresholds.value[i] ?? 0) - 0.035
      if (p >= trigger) {
        nodeRevealed.value[i] = true
      }
    }
  }

  // Post-intro living burnished-gold filament & counter-meridian drift
  if (p >= 1) {
    const cyclePhase = ((now * 0.001) % WEAVE_CONFIG.filamentCycleSec) / WEAVE_CONFIG.filamentCycleSec
    filamentOffset.value = isDesktop.value
      ? 1 - cyclePhase
      : 1.18 - cyclePhase * 1.36
  }

  ghostDashOffset.value = -((now * 0.001 * WEAVE_CONFIG.ghostDriftPxPerSec) % 180)

  updateLoomFrame(now * 0.001, p)

  rafId = requestAnimationFrame(tickLoom)
}

const syncLoop = () => {
  if (shouldAnimate()) {
    if (rafId === null) {
      rafId = requestAnimationFrame(tickLoom)
    }
  } else {
    stopLoop()
  }
}

const onBreakpointChange = (e: MediaQueryListEvent | MediaQueryList) => {
  isDesktop.value = e.matches
  nextTick(() => {
    measureCanvasAndSlots()
  })
}

const onVisibilityChange = () => {
  if (!import.meta.client) return
  isTabHidden = document.hidden
  syncLoop()
}

onMounted(() => {

  lgMediaQuery = window.matchMedia('(min-width: 1024px)')
  isDesktop.value = lgMediaQuery.matches
  lgMediaQuery.addEventListener('change', onBreakpointChange)

  if (typeof ResizeObserver !== 'undefined' && canvasRef.value) {
    resizeObserver = new ResizeObserver(() => {
      measureCanvasAndSlots()
    })
    resizeObserver.observe(canvasRef.value)
  }

  nextTick(() => {
    measureCanvasAndSlots()

    if (typeof IntersectionObserver !== 'undefined' && sectionRef.value) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return
          isInViewport = entry.isIntersecting
          syncLoop()
        },
        { threshold: 0.14, rootMargin: '60px 0px' }
      )
      intersectionObserver.observe(sectionRef.value)
    } else {
      isInViewport = true
      syncLoop()
    }
  })

  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  stopLoop()
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
  if (lgMediaQuery) {
    lgMediaQuery.removeEventListener('change', onBreakpointChange)
    lgMediaQuery = null
  }
  if (import.meta.client) {
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
})
</script>

<template>
  <section
    ref="sectionRef"
    data-theme="light"
    aria-label="The Network — Weaving Stories Together"
    class="network-weave-section relative w-full overflow-hidden py-18 sm:py-22 lg:py-32 text-primary-light"
  >
    <!-- 1. DREAMY WATERCOLOR COTTON-RAG GRAIN & TOPOGRAPHICAL CONTOURS -->
    <svg
      aria-hidden="true"
      class="pointer-events-none select-none absolute inset-0 w-full h-full opacity-[0.026] mix-blend-multiply"
    >
      <filter id="weave-cotton-grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.62"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#weave-cotton-grain)" />
    </svg>

    <svg
      viewBox="0 0 1440 840"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      class="pointer-events-none select-none absolute inset-0 w-full h-full"
    >
      <ellipse cx="720" cy="420" rx="590" ry="310" stroke="#8aa5be" stroke-opacity="0.1" stroke-width="1" />
      <ellipse cx="720" cy="420" rx="465" ry="238" stroke="#c49a4a" stroke-opacity="0.09" stroke-width="0.9" stroke-dasharray="3 8" />
      <path d="M -60 710 Q 380 615, 760 690 T 1520 665" stroke="#7d9eb8" stroke-opacity="0.12" stroke-width="1" />
      <path d="M -60 765 Q 420 675, 810 742 T 1520 718" stroke="#c49a4a" stroke-opacity="0.1" stroke-width="0.9" />
    </svg>

    <!-- 2. UNIFIED COORDINATE STAGE -->
    <div
      ref="canvasRef"
      class="relative z-10 w-full max-w-xl sm:max-w-2xl lg:max-w-7xl mx-auto px-4 sm:px-6"
    >
      <!-- LAYER A (z-10): BACK LOOM — DOTTED MERIDIAN & UNDER-PORTRAIT GOLDEN CORD -->
      <svg
        v-if="isReady && solidThreadD"
        :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
        fill="none"
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-0 w-full h-full overflow-visible z-10"
      >
        <defs>
          <!-- Warm Spun-Gold Base Cord (Rich Satin Gold — Zero White) -->
          <linearGradient id="weave-satin-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#c38e33" stop-opacity="0.82" />
            <stop offset="28%" stop-color="#dca94c" stop-opacity="0.96" />
            <stop offset="56%" stop-color="#b47b1f" stop-opacity="0.98" />
            <stop offset="82%" stop-color="#d7a243" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#bc8529" stop-opacity="0.82" />
          </linearGradient>

          <!-- Burnished 24k Bronze-Amber Living Filament (No White!) -->
          <linearGradient id="weave-burnished-filament" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#9e6512" stop-opacity="0" />
            <stop offset="35%" stop-color="#8b5509" stop-opacity="0.95" />
            <stop offset="65%" stop-color="#e8b146" stop-opacity="1" />
            <stop offset="100%" stop-color="#9e6512" stop-opacity="0" />
          </linearGradient>

          <linearGradient id="weave-eyelet-brass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#e5b454" />
            <stop offset="55%" stop-color="#b57d20" />
            <stop offset="100%" stop-color="#895b10" />
          </linearGradient>

          <!-- Dynamic Live ClipPath for Odd Portraits (Over/Under Crescent Threading) -->
          <clipPath id="weave-over-crescents-clip">
            <circle
              v-for="(node, oIdx) in overWeaveNodes"
              :key="`over-clip-${oIdx}`"
              :cx="node.cx"
              :cy="node.cy"
              :r="node.r + 2"
            />
          </clipPath>
        </defs>

        <!-- Counter-Drifting Dotted Heritage Meridian -->
        <path
          :d="ghostMeridianD"
          stroke="#31587a"
          stroke-opacity="0.17"
          stroke-width="1.15"
          stroke-dasharray="2.5 7"
          :stroke-dashoffset="ghostDashOffset"
          stroke-linecap="round"
          class="transition-opacity duration-1000"
          :class="drawProgress > 0.08 ? 'opacity-100' : 'opacity-0'"
        />

        <!-- Soft Warm-Amber Dimensional Cord Aura -->
        <path
          :d="solidThreadD"
          pathLength="1"
          stroke="#c99334"
          stroke-opacity="0.16"
          stroke-width="5.5"
          stroke-linecap="round"
          :stroke-dasharray="1"
          :stroke-dashoffset="1 - drawProgress"
        />

        <!-- Primary Flowing Golden Cord -->
        <path
          :d="solidThreadD"
          pathLength="1"
          stroke="url(#weave-satin-gold)"
          stroke-width="1.95"
          stroke-linecap="round"
          :stroke-dasharray="1"
          :stroke-dashoffset="1 - drawProgress"
        />

        <!-- Post-Intro Burnished Bronze-Amber Gliding Filament -->
        <path
          v-if="drawProgress >= 1"
          :d="solidThreadD"
          pathLength="1"
          stroke="url(#weave-burnished-filament)"
          stroke-width="2.65"
          stroke-linecap="round"
          stroke-dasharray="0.15 0.85"
          :stroke-dashoffset="filamentOffset"
        />
      </svg>

      <!-- LAYER B (z-20 / z-30): PROTECTED CSS GRID (7 NON-CLICKABLE PORTRAITS + FLEXBOX CORE) -->
      <div
        class="relative grid grid-cols-6 lg:grid-cols-12 lg:grid-rows-[auto_minmax(17.5rem,auto)_auto] gap-y-5 sm:gap-y-6 lg:gap-y-3 gap-x-2 sm:gap-x-4 items-center"
      >
        <!-- 7 Stationary-Slot Buoyant Medallions (Pure Visual, Zero Route Links) -->
        <div
          v-for="(portrait, idx) in resolvedPortraits"
          :key="portrait.id"
          :ref="(el) => setSlotRef(idx, el)"
          :class="[
            'group network-weave-slot relative z-20 w-21 h-21 2xs:w-23 2xs:h-23 sm:w-28 sm:h-28 lg:w-31 lg:h-31 xl:w-35 xl:h-35 aspect-square rounded-full select-none cursor-default',
            SLOT_GRID_CLASSES[idx]
          ]"
        >
          <div
            :ref="(el) => setMedallionRef(idx, el)"
            class="network-weave-medallion relative select-none w-full h-full rounded-full overflow-hidden bg-surface-frosted border border-dark-gold/32 will-change-transform"
            style="
              opacity: 0;
              transform: scale(0.85);
              transition:
                opacity 620ms cubic-bezier(0.22, 1, 0.36, 1),
                box-shadow 500ms var(--ease-editorial);
            "
          >
            <img
              :src="portrait.image"
              :alt="portrait.alt"
              :width="portrait.width || 750"
              :height="portrait.height || 500"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              draggable="false"
              class="pointer-events-none block w-full h-auto aspect-square object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
              @error="onPortraitError"
            />
          </div>
        </div>

        <!-- Protected Center Flexbox Editorial Core (Only Button Navigates) -->
        <div
          ref="coreRef"
          class="relative z-30 col-start-1 col-span-6 row-start-2 lg:col-start-3 lg:col-span-8 lg:row-start-2 flex flex-col items-center text-center py-7 sm:py-9 lg:py-6 px-3 sm:px-6 mx-auto max-w-md sm:max-w-xl"
        >
          <div
            v-motion-fade-up
            :delay="WEAVE_CONFIG.eyebrowDelayMs"
            class="flex flex-col items-center mb-3.5 sm:mb-4"
          >
            <span class="eyebrow-text text-journey-deep/95 tracking-[0.26em]">
              {{ data.eyebrow }}
            </span>
            <span
              aria-hidden="true"
              class="w-10 sm:w-12 h-0.5 rounded-full bg-dark-gold mt-2.5"
            />
          </div>

          <h2
            v-motion-fade-up
            :delay="WEAVE_CONFIG.titleDelayMs"
            class="section-title-wrapper drop-shadow-none! mb-3.5 sm:mb-4"
          >
            <span class="text-journey-deep section-subtitle text-balance">
              {{ data.title }}
            </span>
          </h2>

          <p
            v-motion-fade-up
            :delay="WEAVE_CONFIG.copyDelayMs"
            class="section-paragraph text-secondary-light max-w-[32ch] sm:max-w-[40ch] text-balance"
          >
            {{ data.description }}
          </p>

          <div
            v-motion-fade-up
            :delay="WEAVE_CONFIG.ctaDelayMs"
            class="mt-6 sm:mt-8 flex justify-center"
          >
            <CtaButton
              :to="data.cta.to"
              :label="data.cta.label"
              variant="light"
            />
          </div>
        </div>
      </div>

      <!-- LAYER C: OVER-PORTRAIT CRESCENT WEAVE, HOLLOW BRASS EYELETS & NEEDLE TIP -->
      <svg
        v-if="isReady && solidThreadD"
        :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`"
        fill="none"
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-0 w-full h-full overflow-visible z-10"
      >
        <!-- Over-Weave Pass Across Outer Crescents of Odd Portraits (1, 3, 5) -->
        <g clip-path="url(#weave-over-crescents-clip)">
          <path
            :d="solidThreadD"
            pathLength="1"
            stroke="#162a3d"
            stroke-opacity="0.22"
            stroke-width="4.2"
            stroke-linecap="round"
            :stroke-dasharray="1"
            :stroke-dashoffset="1 - drawProgress"
          />
          <path
            :d="solidThreadD"
            pathLength="1"
            stroke="url(#weave-satin-gold)"
            stroke-width="2.05"
            stroke-linecap="round"
            :stroke-dasharray="1"
            :stroke-dashoffset="1 - drawProgress"
          />
          <path
            v-if="drawProgress >= 1"
            :d="solidThreadD"
            pathLength="1"
            stroke="url(#weave-burnished-filament)"
            stroke-width="2.65"
            stroke-linecap="round"
            stroke-dasharray="0.15 0.85"
            :stroke-dashoffset="filamentOffset"
          />
        </g>

        <!-- Exact Sub-Pixel Hollow Spun-Gold Rim Eyelets -->
        <g
          v-for="(eyelet, eIdx) in rimEyelets"
          :key="`rim-eyelet-${eIdx}`"
          class="transition-opacity duration-500"
          :class="eyelet.visible ? 'opacity-100' : 'opacity-0'"
        >
          <circle
            :cx="eyelet.x"
            :cy="eyelet.y"
            r="7.5"
            fill="#c99334"
            fill-opacity="0.16"
          />
          <circle
            :cx="eyelet.x"
            :cy="eyelet.y"
            r="4.6"
            fill="#b68022"
            fill-opacity="0.15"
            stroke="url(#weave-eyelet-brass)"
            stroke-width="2"
          />
        </g>

        <!-- Warm Molten-Amber Needle Tip Guiding the Entrance Weave -->
        <g v-if="needleTip.visible">
          <circle
            :cx="needleTip.x"
            :cy="needleTip.y"
            r="8.5"
            fill="#cf9630"
            fill-opacity="0.26"
          />
          <circle
            :cx="needleTip.x"
            :cy="needleTip.y"
            r="3.2"
            fill="#b87d19"
          />
        </g>
      </svg>
    </div>
  </section>
</template>

<style scoped>
.network-weave-section {
  background-color: #f3f6f9;
  background-image:
    radial-gradient(56% 44% at 50% 48%, rgba(252, 249, 242, 0.88) 0%, rgba(250, 246, 238, 0.35) 54%, transparent 82%),
    radial-gradient(48% 42% at 15% 18%, rgba(196, 218, 236, 0.56) 0%, transparent 72%),
    radial-gradient(46% 44% at 86% 16%, rgba(235, 214, 176, 0.44) 0%, transparent 72%),
    radial-gradient(54% 46% at 16% 84%, rgba(182, 212, 208, 0.48) 0%, transparent 74%),
    radial-gradient(56% 48% at 85% 86%, rgba(192, 214, 234, 0.58) 0%, transparent 76%),
    linear-gradient(180deg, #faf8f3 0%, #f1f5f9 38%, #e8f0f6 76%, #e2ecf4 100%);
}

.network-weave-medallion {
  box-shadow:
    0 18px 34px -14px rgba(18, 36, 54, 0.28),
    0 4px 12px -3px rgba(166, 116, 30, 0.16);
}

.network-weave-slot:hover .network-weave-medallion {
  box-shadow:
    0 22px 38px -12px rgba(18, 36, 54, 0.34),
    0 0 0 3px rgba(186, 138, 48, 0.2);
}
</style>
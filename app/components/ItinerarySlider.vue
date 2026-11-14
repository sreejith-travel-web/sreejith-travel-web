<!-- ~/app/components/ItinerarySlider.vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated
} from 'vue'
import ItineraryCard, { type ItineraryCardItem } from '~/components/ItineraryCard.vue'
import CtaButton from '~/components/CtaButton.vue'

export interface ItinerarySliderConfig {
  initialIndex?: number
  autoplay?: boolean
  autoplayIntervalMs?: number
  infinite?: boolean
  slides: ItineraryCardItem[]
}

export interface ItinerarySliderSectionData {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  subtitle: string
  description: string
  bottomQuote: string
  ctaLabel: string
  ctaTo: string
  slider: ItinerarySliderConfig
}

interface RenderedItinerarySlide {
  key: string
  item: ItineraryCardItem
  isClone: boolean
}

const SLIDER_MECHANICS = {
  cloneCountPerSide: 4,
  settleDurationMs: 490,
  dragThresholdPx: 6,
  velocityProjectionMs: 130,
  wheelCooldownMs: 420,
  maxSwipeSteps: 2
} as const

const props = withDefaults(
  defineProps<{
    data: ItinerarySliderSectionData
    autoplay?: boolean
    defaultIntervalMs?: number
    ariaLabel?: string
  }>(),
  {
    autoplay: undefined,
    defaultIntervalMs: 4000,
    ariaLabel: 'Curated Journeys'
  }
)

const sectionRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

const rawSlides = computed<ItineraryCardItem[]>(() => props.data.slider.slides || [])
const total = computed(() => rawSlides.value.length)

// Infinite loop activates cleanly whenever >= 3 slides exist (modulo clones prevent edge starvation)
const isInfinite = computed(
  () => props.data.slider.infinite !== false && total.value >= 3
)

// Explicit boolean `autoplay` prop takes priority, falling back to `data.slider.autoplay`
const isAutoplayEnabled = computed<boolean>(() =>
  Boolean(props.autoplay ?? props.data.slider.autoplay ?? false)
)

const cloneCount = computed(() =>
  isInfinite.value ? SLIDER_MECHANICS.cloneCountPerSide : 0
)

const modIndex = (val: number, len: number): number =>
  len > 0 ? ((val % len) + len) % len : 0

const displaySlides = computed<RenderedItinerarySlide[]>(() => {
  const list = rawSlides.value
  const n = list.length
  if (!n) return []

  if (!isInfinite.value) {
    return list.map((item, idx) => ({
      item,
      key: `itin-finite-${item.id}-${idx}`,
      isClone: false
    }))
  }

  const c = cloneCount.value
  const headClones: RenderedItinerarySlide[] = []
  const tailClones: RenderedItinerarySlide[] = []

  for (let i = 0; i < c; i++) {
    const headItem = list[modIndex(n - c + i, n)]!
    headClones.push({
      item: headItem,
      key: `itin-clone-head-${i}-${headItem.id}`,
      isClone: true
    })

    const tailItem = list[modIndex(i, n)]!
    tailClones.push({
      item: tailItem,
      key: `itin-clone-tail-${i}-${tailItem.id}`,
      isClone: true
    })
  }

  const mainSlides: RenderedItinerarySlide[] = list.map((item, idx) => ({
    item,
    key: `itin-main-${item.id}-${idx}`,
    isClone: false
  }))

  return [...headClones, ...mainSlides, ...tailClones]
})

const maxStopIndex = computed(() => Math.max(0, total.value - 1))
const totalStops = computed(() => total.value)

const resolveInitialLogicalIndex = (): number => {
  const n = rawSlides.value.length
  if (n <= 1) return 0
  if (props.data.slider.initialIndex !== undefined) {
    return Math.min(Math.max(0, props.data.slider.initialIndex), n - 1)
  }
  return !isInfinite.value && n === 3 ? 1 : 0
}

const initialLogical = resolveInitialLogicalIndex()
const currentIndex = ref(initialLogical)
const virtualIndex = ref(initialLogical + cloneCount.value)
const isInstant = ref(false)

const activeDotIndex = computed(() =>
  modIndex(currentIndex.value, totalStops.value)
)

const canGoPrev = computed(() => isInfinite.value || currentIndex.value > 0)
const canGoNext = computed(
  () => isInfinite.value || currentIndex.value < maxStopIndex.value
)

// =========================================================
// SEAMLESS INFINITE NORMALIZATION & STEPPING
// =========================================================
let snapTimeout: ReturnType<typeof setTimeout> | null = null

const clearSnapTimeout = () => {
  if (snapTimeout !== null) {
    clearTimeout(snapTimeout)
    snapTimeout = null
  }
}

const normalizeInfinitePosition = () => {
  clearSnapTimeout()
  if (!isInfinite.value || total.value === 0) return

  const minMain = cloneCount.value
  const maxMainExclusive = cloneCount.value + total.value

  if (virtualIndex.value < minMain || virtualIndex.value >= maxMainExclusive) {
    isInstant.value = true
    virtualIndex.value =
      minMain + modIndex(virtualIndex.value - minMain, total.value)
  }
}

const scheduleInfiniteSnap = () => {
  clearSnapTimeout()
  if (!isInfinite.value) return
  snapTimeout = setTimeout(() => {
    normalizeInfinitePosition()
  }, SLIDER_MECHANICS.settleDurationMs)
}

const goToStep = (delta: number) => {
  if (delta === 0 || total.value <= 1) return

  if (isInfinite.value) {
    const totalRendered = displaySlides.value.length
    const targetVirtual = virtualIndex.value + delta

    // Guard rapid multi-clicks from ever reaching clone edges
    if (targetVirtual <= 0 || targetVirtual >= totalRendered - 1) {
      normalizeInfinitePosition()
      void trackRef.value?.offsetWidth
    }

    requestAnimationFrame(() => {
      isInstant.value = false
      virtualIndex.value += delta
      currentIndex.value = modIndex(
        virtualIndex.value - cloneCount.value,
        total.value
      )
      scheduleInfiniteSnap()
    })
    return
  }

  const nextIdx = Math.min(
    Math.max(0, currentIndex.value + delta),
    maxStopIndex.value
  )
  if (nextIdx === currentIndex.value) return
  isInstant.value = false
  currentIndex.value = nextIdx
  virtualIndex.value = nextIdx
}

const next = () => {
  if (!canGoNext.value) {
    if (isAutoplayEnabled.value && total.value > 1) {
      isInstant.value = false
      currentIndex.value = 0
      virtualIndex.value = 0
    }
    return
  }
  goToStep(1)
}

const prev = () => {
  if (!canGoPrev.value) return
  goToStep(-1)
}

const goToDot = (targetDotIdx: number) => {
  if (total.value <= 1 || targetDotIdx === activeDotIndex.value) return
  if (isInfinite.value) {
    let delta = targetDotIdx - activeDotIndex.value
    const half = total.value / 2
    if (delta > half) delta -= total.value
    else if (delta < -half) delta += total.value
    goToStep(delta)
  } else {
    goToStep(targetDotIdx - currentIndex.value)
  }
}

// =========================================================
// VIEWPORT-GATED AUTOPLAY (IntersectionObserver + Tab Visibility)
// =========================================================
let autoplayTimer: ReturnType<typeof setInterval> | null = null
let intersectionObserver: IntersectionObserver | null = null
const isHoveredOrFocused = ref(false)
const isInViewport = ref(false)
const isTabHidden = ref(false)

const stopAutoplay = () => {
  if (autoplayTimer !== null) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const syncAutoplay = () => {
  stopAutoplay()
  if (
    !import.meta.client ||
    !isAutoplayEnabled.value ||
    total.value <= 1 ||
    !isInViewport.value ||
    isTabHidden.value ||
    isHoveredOrFocused.value ||
    isDragging.value
  ) {
    return
  }

  const interval =
    props.data.slider.autoplayIntervalMs || props.defaultIntervalMs
  autoplayTimer = setInterval(() => {
    if (!document.hidden && !isDragging.value && isInViewport.value) {
      next()
    }
  }, interval)
}

const pauseInteraction = () => {
  isHoveredOrFocused.value = true
  stopAutoplay()
}

const resumeInteraction = () => {
  isHoveredOrFocused.value = false
  syncAutoplay()
}

const onVisibilityChange = () => {
  if (!import.meta.client) return
  isTabHidden.value = document.hidden
  syncAutoplay()
}

// =========================================================
// ZERO-REFLOW CACHED STRIDE + MOUSE / TOUCH / WHEEL PHYSICS
// =========================================================
const isDragging = ref(false)
const dragOffsetPx = ref(0)

let cachedStridePx = 384
let resizeObserver: ResizeObserver | null = null
let startX = 0
let startY = 0
let lastX = 0
let lastTime = 0
let velocityX = 0
let didExceedDragThreshold = false
let suppressCardClick = false
let suppressClickTimer: ReturnType<typeof setTimeout> | null = null
let touchAxisLock: 'x' | 'y' | null = null

const measureSlideStride = () => {
  const track = trackRef.value
  if (!track || !import.meta.client) return
  const slides = track.children
  const first = slides[0] as HTMLElement | undefined
  const second = slides[1] as HTMLElement | undefined
  if (first && second) {
    const stride = second.offsetLeft - first.offsetLeft
    if (stride > 0) {
      cachedStridePx = stride
      return
    }
  }
  if (first && first.offsetWidth > 0) {
    cachedStridePx = first.offsetWidth + 20
  }
}

const applyDragDisplacement = (dx: number) => {
  if (!isInfinite.value) {
    if (
      (currentIndex.value === 0 && dx > 0) ||
      (currentIndex.value >= maxStopIndex.value && dx < 0)
    ) {
      dragOffsetPx.value = dx * 0.32
      return
    }
  }
  dragOffsetPx.value = dx
}

const settleGesture = () => {
  const activeSwipe = didExceedDragThreshold
  const finalOffset = dragOffsetPx.value
  const finalVel = velocityX

  isDragging.value = false
  isInstant.value = false
  didExceedDragThreshold = false
  dragOffsetPx.value = 0
  velocityX = 0

  if (activeSwipe) {
    suppressCardClick = true
    if (suppressClickTimer !== null) clearTimeout(suppressClickTimer)
    suppressClickTimer = setTimeout(() => {
      suppressCardClick = false
    }, 65)

    const projected =
      finalOffset + finalVel * SLIDER_MECHANICS.velocityProjectionMs
    let steps = -Math.round(projected / cachedStridePx)

    if (steps === 0) {
      if (finalOffset < -38 || finalVel < -0.28) steps = 1
      else if (finalOffset > 38 || finalVel > 0.28) steps = -1
    }

    steps = Math.max(
      -SLIDER_MECHANICS.maxSwipeSteps,
      Math.min(SLIDER_MECHANICS.maxSwipeSteps, steps)
    )

    if (steps !== 0) {
      goToStep(steps)
    }
  }

  syncAutoplay()
}

// --- Mouse Grab-Drag (Window-Tracked so Cursor Never Drops Mid-Swipe) ---
const onWindowPointerMove = (e: PointerEvent) => {
  const dx = e.clientX - startX
  if (!didExceedDragThreshold) {
    if (Math.abs(dx) <= SLIDER_MECHANICS.dragThresholdPx) return
    didExceedDragThreshold = true
    isDragging.value = true
    isInstant.value = true
  }

  e.preventDefault()
  const now = performance.now()
  const dt = Math.max(1, now - lastTime)
  velocityX = (e.clientX - lastX) / dt
  lastX = e.clientX
  lastTime = now

  applyDragDisplacement(dx)
}

const onWindowPointerUp = () => {
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
  window.removeEventListener('pointercancel', onWindowPointerUp)
  settleGesture()
}

const onStagePointerDown = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse' || e.button !== 0 || total.value <= 1) return
  normalizeInfinitePosition()

  didExceedDragThreshold = false
  startX = e.clientX
  lastX = e.clientX
  lastTime = performance.now()
  velocityX = 0
  stopAutoplay()

  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
  window.addEventListener('pointercancel', onWindowPointerUp)
}

// --- Axis-Locked Touch Swipe (Vertical Page Scroll Always Unlocked) ---
const onTouchStart = (e: TouchEvent) => {
  const t = e.touches[0]
  if (!t || total.value <= 1) return
  normalizeInfinitePosition()

  touchAxisLock = null
  didExceedDragThreshold = false
  startX = t.clientX
  startY = t.clientY
  lastX = t.clientX
  lastTime = performance.now()
  velocityX = 0
  stopAutoplay()
}

const onTouchMove = (e: TouchEvent) => {
  const t = e.touches[0]
  if (!t) return

  const dx = t.clientX - startX
  const dy = t.clientY - startY

  if (
    touchAxisLock === null &&
    (Math.abs(dx) > SLIDER_MECHANICS.dragThresholdPx ||
      Math.abs(dy) > SLIDER_MECHANICS.dragThresholdPx)
  ) {
    touchAxisLock = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
    if (touchAxisLock === 'x') {
      didExceedDragThreshold = true
      isDragging.value = true
      isInstant.value = true
    } else {
      syncAutoplay()
      return
    }
  }

  if (touchAxisLock !== 'x') return

  const now = performance.now()
  const dt = Math.max(1, now - lastTime)
  velocityX = (t.clientX - lastX) / dt
  lastX = t.clientX
  lastTime = now

  applyDragDisplacement(dx)
}

const onTouchEnd = () => {
  if (touchAxisLock === 'x') {
    settleGesture()
  } else {
    syncAutoplay()
  }
  touchAxisLock = null
}

const onTrackClickCapture = (e: MouseEvent) => {
  if (suppressCardClick) {
    e.preventDefault()
    e.stopPropagation()
    suppressCardClick = false
  }
}

// --- Trackpad Two-Finger Horizontal Wheel & Shift+Wheel ---
let wheelCooldown = false
const onWheel = (e: WheelEvent) => {
  if (total.value <= 1) return
  const horizontalDelta =
    Math.abs(e.deltaX) > Math.abs(e.deltaY)
      ? e.deltaX
      : e.shiftKey
        ? e.deltaY
        : 0

  if (Math.abs(horizontalDelta) < 16) return
  e.preventDefault()
  if (wheelCooldown) return

  wheelCooldown = true
  if (horizontalDelta > 0) next()
  else prev()

  setTimeout(() => {
    wheelCooldown = false
  }, SLIDER_MECHANICS.wheelCooldownMs)
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}

// =========================================================
// INSTAGRAM-STYLE 5+2 DOT WINDOW
// =========================================================
const MAX_NORMAL_DOTS = 5
const DOT_SIZE = 6
const GAP_SIZE = 8
const STRIDE = DOT_SIZE + GAP_SIZE

const windowStart = computed(() => {
  const n = totalStops.value
  if (n <= MAX_NORMAL_DOTS) return 0
  if (activeDotIndex.value <= 2) return 0
  if (activeDotIndex.value >= n - 3) return n - MAX_NORMAL_DOTS
  return activeDotIndex.value - 2
})

const trackTranslateX = computed(() => {
  if (totalStops.value <= MAX_NORMAL_DOTS) return 0
  return STRIDE - windowStart.value * STRIDE
})

const wrapperWidth = computed(() => {
  const n = totalStops.value
  if (n <= MAX_NORMAL_DOTS) return n * DOT_SIZE + Math.max(0, n - 1) * GAP_SIZE
  const visibleSlots = MAX_NORMAL_DOTS + 2
  return visibleSlots * DOT_SIZE + (visibleSlots - 1) * GAP_SIZE
})

const getDotStyle = (index: number) => {
  if (index === activeDotIndex.value) {
    return 'bg-journey-deep opacity-100 scale-115'
  }
  const ws = windowStart.value
  if (index >= ws && index < ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-35 hover:opacity-70 scale-100 cursor-pointer'
  }
  if (index === ws - 1 || index === ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-15 scale-[0.65] pointer-events-none'
  }
  return 'bg-journey-deep opacity-0 scale-0 pointer-events-none'
}

watch(
  [() => props.data.slider.infinite, () => total.value],
  () => {
    const startLogical = resolveInitialLogicalIndex()
    isInstant.value = true
    currentIndex.value = startLogical
    virtualIndex.value = startLogical + cloneCount.value
    nextTick(() => {
      measureSlideStride()
      requestAnimationFrame(() => {
        isInstant.value = false
      })
    })
  }
)

watch(isAutoplayEnabled, () => {
  syncAutoplay()
})

watch(isAutoplayEnabled, () => {
  syncAutoplay()
})

onMounted(() => {
  nextTick(() => {
    measureSlideStride()

    if (typeof ResizeObserver !== 'undefined' && trackRef.value) {
      resizeObserver = new ResizeObserver(() => {
        measureSlideStride()
      })
      resizeObserver.observe(trackRef.value)
    }

    if (typeof IntersectionObserver !== 'undefined' && sectionRef.value) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry) return
          isInViewport.value = entry.isIntersecting
          syncAutoplay()
        },
        { threshold: 0.01, rootMargin: '120px 0px' }
      )
      intersectionObserver.observe(sectionRef.value)
    } else {
      isInViewport.value = true
      syncAutoplay()
    }
  })

  document.addEventListener('visibilitychange', onVisibilityChange)
})

onActivated(() => {
  syncAutoplay()
})

onDeactivated(() => {
  stopAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  clearSnapTimeout()
  if (suppressClickTimer !== null) clearTimeout(suppressClickTimer)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()

  if (import.meta.client) {
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('pointermove', onWindowPointerMove)
    window.removeEventListener('pointerup', onWindowPointerUp)
    window.removeEventListener('pointercancel', onWindowPointerUp)
  }
})
</script>

<template>
  <section
    ref="sectionRef"
    data-theme="light"
    :aria-label="ariaLabel"
    aria-roledescription="carousel"
    tabindex="0"
    class="section-wrapper px-0! text-primary-light overflow-x-clip focus:outline-none"
    @keydown="onKeyDown"
  >
    <div class="relative w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-360 mx-auto flex flex-col items-center">
      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full max-w-3xl flex flex-col items-center text-center mb-7 md:mb-9 px-3 2xs:px-4 xs:px-6 sm:px-10">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper drop-shadow-none!"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <div
          v-motion-fade-up
          :delay="200"
          class="flex flex-col items-center"
        >
          <span class="text-intention-blue/90 section-midsubtitle">
            {{ data.subtitle }}
          </span>
          <p class="text-journey-deep/90 max-w-2xl lg:max-w-3xl px-2 sm:px-4 section-paragraph">
            {{ data.description }}
          </p>
        </div>
      </div>

      <!-- 2. 1600PX (max-w-400) EDGE-MASKED FIXED-WIDTH CENTERED SPINE STAGE -->
      <div
        v-motion-fade-up
        :delay="240"
        data-lenis-prevent-horizontal
        class="itinerary-slider-stage relative z-10 w-full mb-7 md:mb-9 py-2 select-none"
        :class="isDragging ? 'cursor-grabbing' : 'cursor-grab'"
        @pointerdown="onStagePointerDown"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
        @touchcancel.passive="onTouchEnd"
        @wheel="onWheel"
        @click.capture="onTrackClickCapture"
      >
        <div class="itinerary-slider-spine">
          <div
            ref="trackRef"
            class="itinerary-slider-track"
            :class="{ 'is-instant': isInstant }"
            :style="{
              '--idx': String(virtualIndex),
              '--drag-x': `${dragOffsetPx}px`
            }"
          >
            <div
              v-for="slideObj in displaySlides"
              :key="slideObj.key"
              :inert="slideObj.isClone || undefined"
              :aria-hidden="slideObj.isClone || undefined"
              class="itinerary-slide-item"
            >
              <ItineraryCard
                :item="slideObj.item"
                :eager="false"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 3. FOOTER CONTROLS, QUOTE & CTA -->
      <div class="relative z-10 w-full flex flex-col items-center text-center px-3 2xs:px-4 xs:px-6 sm:px-10">
        <div
          v-if="totalStops > 1"
          v-motion-micro-up
          :delay="100"
          class="flex items-center justify-center gap-4 sm:gap-5 mb-8 md:mb-10"
        >
          <!-- Previous Slide Arrow -->
          <button
            type="button"
            :aria-label="`Previous ${ariaLabel.toLowerCase()}`"
            :disabled="!canGoPrev"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-journey-deep/25 bg-transparent text-journey-deep flex items-center justify-center transition-all duration-300 ease-editorial hover:bg-journey-deep hover:border-journey-deep hover:text-surface-light active:bg-intention-blue active:border-intention-blue active:text-surface-light active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
            @click="prev"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="w-4 h-4 sm:w-4.5 sm:h-4.5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <!-- Interactive Instagram 5+2 Dot Window -->
          <div
            class="relative overflow-hidden flex items-center"
            :style="{ width: `${wrapperWidth}px`, height: '18px' }"
            aria-label="Slide indicators"
          >
            <div
              class="absolute left-0 top-1/2 flex items-center gap-2 transition-transform duration-300 ease-editorial will-change-transform"
              :style="{ transform: `translate3d(${trackTranslateX}px, -50%, 0)` }"
            >
              <button
                v-for="index in totalStops"
                :key="index"
                type="button"
                :tabindex="index - 1 >= windowStart && index - 1 < windowStart + MAX_NORMAL_DOTS ? 0 : -1"
                :aria-label="`Go to journey ${index}`"
                :aria-current="index - 1 === activeDotIndex ? 'true' : undefined"
                :class="[
                  'rounded-full w-1.5 h-1.5 shrink-0 transition-all duration-300 ease-editorial outline-none',
                  getDotStyle(index - 1)
                ]"
                @click="goToDot(index - 1)"
              />
            </div>
          </div>

          <!-- Next Slide Arrow -->
          <button
            type="button"
            :aria-label="`Next ${ariaLabel.toLowerCase()}`"
            :disabled="!canGoNext"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-journey-deep/25 bg-transparent text-journey-deep flex items-center justify-center transition-all duration-300 ease-editorial hover:bg-journey-deep hover:border-journey-deep hover:text-surface-light active:bg-intention-blue active:border-intention-blue active:text-surface-light active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
            @click="next"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              class="w-4 h-4 sm:w-4.5 sm:h-4.5"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- Bottom Quote -->
        <p
          v-motion-fade-up
          class="text-darker-gold px-2 sm:px-4 mb-8 md:mb-10 lg:max-w-3xl xl:max-w-4xl section-quote"
        >
          {{ data.bottomQuote }}
        </p>

        <!-- CTA Button -->
        <div
          v-motion-fade-up
          :delay="100"
        >
          <CtaButton
            :to="data.ctaTo"
            :label="data.ctaLabel"
            variant="light"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Typography-Locked Card Widths + Exact Edge Mask Ladder (0.5rem -> 1.5rem -> 3rem -> 5.5rem) */
.itinerary-slider-stage {
  --itinerary-card-w: min(calc(100vw - 1.75rem), 16.25rem);
  --itinerary-card-gap: 0.75rem;
  --itinerary-mask-edge: 1rem;
  overflow: hidden;
  touch-action: pan-y;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000000 var(--itinerary-mask-edge),
    #000000 calc(100% - var(--itinerary-mask-edge)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000000 var(--itinerary-mask-edge),
    #000000 calc(100% - var(--itinerary-mask-edge)),
    transparent 100%
  );
}

@media (min-width: 321px) {
  .itinerary-slider-stage {
    --itinerary-card-w: 19.75rem;
    --itinerary-card-gap: 1.25rem;
    --itinerary-mask-edge: 2.5rem;
  }
}

@media (min-width: 481px) {
  .itinerary-slider-stage {
    --itinerary-card-w: 19rem;
    --itinerary-card-gap: 1rem;
    --itinerary-mask-edge: 3.5rem;
  }
}

@media (min-width: 640px) {
  .itinerary-slider-stage {
    --itinerary-card-w: 20rem;
    --itinerary-card-gap: 1.25rem;
    --itinerary-mask-edge: 4.5rem;
  }
}

@media (min-width: 768px) {
  .itinerary-slider-stage {
    --itinerary-card-w: 20.25rem;
    --itinerary-card-gap: 1.375rem;
  }
}

@media (min-width: 1024px) {
  .itinerary-slider-stage {
    --itinerary-card-w: 21.25rem;
    --itinerary-card-gap: 1.5rem;
    --itinerary-mask-edge: 6.5rem;
  }
}

@media (min-width: 1280px) {
  .itinerary-slider-stage {
    --itinerary-card-w: 22.25rem;
    --itinerary-card-gap: 1.5rem;
  }
}

/* Zero-CLS Centered Spine (SSR-Safe, No JS Width Measurement Required) */
.itinerary-slider-spine {
  position: relative;
  left: 50%;
  width: 0;
  overflow: visible;
}

.itinerary-slider-track {
  display: flex;
  align-items: stretch;
  width: max-content;
  gap: var(--itinerary-card-gap);
  will-change: transform;
  transform: translate3d(
    calc(
      -1 * (
        var(--idx, 0) * (var(--itinerary-card-w) + var(--itinerary-card-gap)) +
        (var(--itinerary-card-w) / 2)
      ) + var(--drag-x, 0px)
    ),
    0,
    0
  );
  transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
}

.itinerary-slider-track.is-instant {
  transition: none !important;
}

.itinerary-slide-item {
  width: var(--itinerary-card-w);
  flex: 0 0 var(--itinerary-card-w);
  display: flex;
  flex-direction: column;
}

.itinerary-slide-item :deep(a),
.itinerary-slide-item :deep(img) {
  -webkit-user-drag: none;
  user-select: none;
}
</style>
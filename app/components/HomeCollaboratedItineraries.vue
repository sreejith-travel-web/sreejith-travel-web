<!-- ~/app/components/HomeCollaboratedItineraries.vue -->
<script setup lang="ts">

import { ref, computed, watch, onMounted, onBeforeUnmount, onActivated, onDeactivated } from 'vue'
import ItineraryCard, { type ItineraryCardItem } from '~/components/ItineraryCard.vue'
import CtaButton from '~/components/CtaButton.vue'

export interface CollaboratedSliderConfig {
  initialIndex?: number
  autoplay?: boolean
  autoplayIntervalMs?: number
  infinite?: boolean
  slides: ItineraryCardItem[]
}

export interface CollaboratedItinerariesSectionData {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  subtitle: string
  description: string
  bottomQuote: string
  ctaLabel: string
  ctaTo: string
  slider: CollaboratedSliderConfig
}

const props = defineProps<{
  data: CollaboratedItinerariesSectionData
}>()

const trackRef = ref<HTMLElement | null>(null)
const isDesktop = ref(false)

const rawSlides = computed(() => props.data.slider.slides || [])
const total = computed(() => rawSlides.value.length)
const isInfinite = computed(() => props.data.slider.infinite !== false && total.value > 3)

const CLONE_COUNT = computed(() => (isInfinite.value ? 4 : 0))

const displaySlides = computed(() => {
  const list = rawSlides.value
  if (!isInfinite.value || list.length === 0) {
    return list.map((item, idx) => ({ item, key: `collab-${item.id}-${idx}` }))
  }
  const headClones = list.slice(-CLONE_COUNT.value).map((item, idx) => ({
    item,
    key: `collab-clone-head-${item.id}-${idx}`
  }))
  const mainSlides = list.map((item, idx) => ({
    item,
    key: `collab-main-${item.id}-${idx}`
  }))
  const tailClones = list.slice(0, CLONE_COUNT.value).map((item, idx) => ({
    item,
    key: `collab-clone-tail-${item.id}-${idx}`
  }))
  return [...headClones, ...mainSlides, ...tailClones]
})

const maxStopIndex = computed(() => {
  if (isInfinite.value) return Math.max(0, total.value - 1)
  const visibleFullCards = isDesktop.value ? 3 : 1
  return Math.max(0, total.value - visibleFullCards)
})

const totalStops = computed(() => (isInfinite.value ? total.value : maxStopIndex.value + 1))

const initialIdx = Math.min(
  Math.max(0, props.data.slider.initialIndex || 0),
  Math.max(0, (props.data.slider.slides?.length || 1) - 1)
)

const currentIndex = ref(initialIdx)
const virtualIndex = ref(initialIdx + (props.data.slider.infinite !== false && (props.data.slider.slides?.length || 0) > 3 ? 4 : 0))
const isInstant = ref(false)

const activeDotIndex = computed(() => {
  if (totalStops.value <= 0) return 0
  return ((currentIndex.value % totalStops.value) + totalStops.value) % totalStops.value
})

const canGoPrev = computed(() => isInfinite.value || currentIndex.value > 0)
const canGoNext = computed(() => isInfinite.value || currentIndex.value < maxStopIndex.value)

// --- Seamless Infinite Loop Normalization ---
let snapTimeout: ReturnType<typeof setTimeout> | null = null

const clearSnapTimeout = () => {
  if (snapTimeout) {
    clearTimeout(snapTimeout)
    snapTimeout = null
  }
}

const normalizeInfinitePosition = () => {
  clearSnapTimeout()
  if (!isInfinite.value || total.value === 0) return

  if (virtualIndex.value < CLONE_COUNT.value) {
    isInstant.value = true
    virtualIndex.value += total.value
  } else if (virtualIndex.value >= CLONE_COUNT.value + total.value) {
    isInstant.value = true
    virtualIndex.value -= total.value
  }
}

const scheduleInfiniteSnap = () => {
  clearSnapTimeout()
  if (!isInfinite.value) return
  snapTimeout = setTimeout(() => {
    normalizeInfinitePosition()
  }, 490)
}

const goToStep = (delta: number) => {
  if (total.value <= 1) return

  if (isInfinite.value && (virtualIndex.value < CLONE_COUNT.value || virtualIndex.value >= CLONE_COUNT.value + total.value)) {
    normalizeInfinitePosition()
    void trackRef.value?.offsetWidth
  }

  requestAnimationFrame(() => {
    isInstant.value = false
    if (isInfinite.value) {
      virtualIndex.value += delta
      currentIndex.value = (((virtualIndex.value - CLONE_COUNT.value) % total.value) + total.value) % total.value
      scheduleInfiniteSnap()
    } else {
      const nextIdx = Math.min(Math.max(0, currentIndex.value + delta), maxStopIndex.value)
      currentIndex.value = nextIdx
      virtualIndex.value = nextIdx
    }
  })
}

const next = () => {
  if (!canGoNext.value) {
    if (props.data.slider.autoplay) {
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

// --- Autoplay Controller ---
let autoplayTimer: ReturnType<typeof setInterval> | null = null
const isHoveredOrFocused = ref(false)

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const startAutoplay = () => {
  stopAutoplay()
  if (!props.data.slider.autoplay || total.value <= 1 || isHoveredOrFocused.value) return
  const interval = props.data.slider.autoplayIntervalMs || 3500
  autoplayTimer = setInterval(() => {
    if (!document.hidden && !isDragging.value) {
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
  startAutoplay()
}

// --- Pointer / Touch Inertia Drag Engine ---
const isDragging = ref(false)
const dragOffsetPx = ref(0)
let startX = 0
let startY = 0
let lastX = 0
let lastTime = 0
let velocityX = 0
let maxDragDistance = 0
let isHorizontalGesture: boolean | null = null

const getCardStridePx = () => {
  if (!trackRef.value) return 320
  const firstSlide = trackRef.value.querySelector('.itinerary-slide-item') as HTMLElement | null
  if (!firstSlide) return 320
  const style = window.getComputedStyle(firstSlide)
  const marginRight = parseFloat(style.marginRight) || 0
  return firstSlide.offsetWidth + marginRight
}

const onPointerDown = (e: PointerEvent) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  normalizeInfinitePosition()

  isDragging.value = true
  isInstant.value = true
  isHorizontalGesture = null
  startX = e.clientX
  startY = e.clientY
  lastX = e.clientX
  lastTime = performance.now()
  velocityX = 0
  maxDragDistance = 0
  dragOffsetPx.value = 0
  stopAutoplay()
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return

  const dx = e.clientX - startX
  const dy = e.clientY - startY

  if (isHorizontalGesture === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
    isHorizontalGesture = Math.abs(dx) > Math.abs(dy)
    if (!isHorizontalGesture) {
      isDragging.value = false
      isInstant.value = false
      dragOffsetPx.value = 0
      return
    }
  }

  if (!isHorizontalGesture) return

  const now = performance.now()
  const dt = Math.max(1, now - lastTime)
  velocityX = (e.clientX - lastX) / dt
  lastX = e.clientX
  lastTime = now
  maxDragDistance = Math.max(maxDragDistance, Math.abs(dx))

  if (!isInfinite.value) {
    if ((currentIndex.value === 0 && dx > 0) || (currentIndex.value >= maxStopIndex.value && dx < 0)) {
      dragOffsetPx.value = dx * 0.32
      return
    }
  }

  dragOffsetPx.value = dx
}

const finishPointerDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  isInstant.value = false

  const stride = getCardStridePx()
  const projected = dragOffsetPx.value + velocityX * 130
  let steps = -Math.round(projected / stride)

  if (steps === 0) {
    if (dragOffsetPx.value < -40 || velocityX < -0.3) steps = 1
    else if (dragOffsetPx.value > 40 || velocityX > 0.3) steps = -1
  }

  steps = Math.max(-2, Math.min(2, steps))
  dragOffsetPx.value = 0

  if (steps !== 0) {
    goToStep(steps)
  }

  if (!isHoveredOrFocused.value) {
    startAutoplay()
  }
}

const onTrackClickCapture = (e: MouseEvent) => {
  if (maxDragDistance > 6) {
    e.preventDefault()
    e.stopPropagation()
    maxDragDistance = 0
  }
}

// --- Trackpad Two-Finger Horizontal Wheel Support ---
let wheelCooldown = false
const onWheel = (e: WheelEvent) => {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 14) return
  e.preventDefault()
  if (wheelCooldown) return
  wheelCooldown = true
  if (e.deltaX > 0) next()
  else prev()
  setTimeout(() => {
    wheelCooldown = false
  }, 420)
}

// --- Keyboard Left/Right Support ---
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}

// --- Instagram-Style 5+2 Dot Window ---
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
    return 'bg-journey-deep opacity-100 scale-110'
  }
  const ws = windowStart.value
  if (index >= ws && index < ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-35 scale-100'
  }
  if (index === ws - 1 || index === ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-15 scale-[0.65]'
  }
  return 'bg-journey-deep opacity-0 scale-0'
}

let mediaQuery: MediaQueryList | null = null
const updateBreakpoint = () => {
  if (!import.meta.client) return
  isDesktop.value = window.innerWidth >= 1024
}

watch(
  () => props.data.slider.infinite,
  () => {
    isInstant.value = true
    currentIndex.value = 0
    virtualIndex.value = CLONE_COUNT.value
  }
)

onMounted(() => {
  updateBreakpoint()
  mediaQuery = window.matchMedia('(min-width: 1024px)')
  mediaQuery.addEventListener('change', updateBreakpoint)
  startAutoplay()
})

onActivated(() => {
  startAutoplay()
})

onDeactivated(() => {
  stopAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  clearSnapTimeout()
  mediaQuery?.removeEventListener('change', updateBreakpoint)
})
</script>

<template>
  <section
    data-theme="light"
    aria-label="Collaborated Itineraries"
    tabindex="0"
    @keydown="onKeyDown"
    @mouseenter="pauseInteraction"
    @mouseleave="resumeInteraction"
    @focusin="pauseInteraction"
    @focusout="resumeInteraction"
    class="text-primary-light overflow-hidden section-wrapper focus:outline-none"
  >
    <div class="relative w-full max-w-360 mx-auto flex flex-col items-center">

      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full max-w-3xl flex flex-col items-center text-center mb-6 md:mb-8 px-2">
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
          class="section-title-wrapper"
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
          <p class="text-journey-deep/90 max-w-2xl lg:max-w-3xl px-4 section-paragraph">
            {{ data.description }}
          </p>
        </div>
      </div>

      <!-- 2. CONTROLLABLE MASKED SLIDER STAGE -->
      <div
        v-motion-fade-up
        :delay="250"
        class="relative z-10 w-full mb-6 md:mb-8 itinerary-slider-stage select-none"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="finishPointerDrag"
        @pointercancel="finishPointerDrag"
        @mouseleave="finishPointerDrag"
        @wheel="onWheel"
        @click.capture="onTrackClickCapture"
      >
        <div
          ref="trackRef"
          class="itinerary-slider-track flex items-stretch w-full"
          :class="{ 'is-instant': isInstant }"
          :style="{
            '--idx': virtualIndex,
            '--drag-x': `${dragOffsetPx}px`
          }"
        >
          <div
            v-for="(slideObj, sIdx) in displaySlides"
            :key="slideObj.key"
            class="itinerary-slide-item shrink-0 flex flex-col"
          >
            <ItineraryCard
              :item="slideObj.item"
              :eager="sIdx >= CLONE_COUNT && sIdx < CLONE_COUNT + 3"
            />
          </div>
        </div>
      </div>

      <!-- 3. FOOTER CONTROLS, QUOTE & CTA -->
      <div class="relative z-10 w-full flex flex-col items-center text-center">
        <div
          v-if="totalStops > 1"
          v-motion-micro-up
          :delay="100"
          class="flex items-center justify-center gap-4 sm:gap-5 mb-8 md:mb-10"
        >
          <!-- Previous Slide Arrow -->
          <button
            type="button"
            aria-label="Previous collaborated itinerary"
            :disabled="!canGoPrev"
            @click="prev"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-journey-deep/25 bg-transparent text-journey-deep flex items-center justify-center transition-all duration-300 ease-out hover:bg-journey-deep hover:border-journey-deep hover:text-surface-light active:bg-intention-blue active:border-intention-blue active:text-surface-light active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 sm:w-4.5 sm:h-4.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <!-- Instagram 5+2 Dot Window -->
          <div
            class="relative overflow-hidden flex items-center"
            :style="{ width: `${wrapperWidth}px`, height: '16px' }"
            aria-hidden="true"
          >
            <div
              class="absolute left-0 top-1/2 flex items-center gap-2 transition-transform duration-300 ease-out will-change-transform"
              :style="{ transform: `translate3d(${trackTranslateX}px, -50%, 0)` }"
            >
              <span
                v-for="index in totalStops"
                :key="index"
                :class="[
                  'rounded-full w-1.5 h-1.5 shrink-0 transition-all duration-300 ease-out',
                  getDotStyle(index - 1)
                ]"
              />
            </div>
          </div>

          <!-- Next Slide Arrow -->
          <button
            type="button"
            aria-label="Next collaborated itinerary"
            :disabled="!canGoNext"
            @click="next"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-journey-deep/25 bg-transparent text-journey-deep flex items-center justify-center transition-all duration-300 ease-out hover:bg-journey-deep hover:border-journey-deep hover:text-surface-light active:bg-intention-blue active:border-intention-blue active:text-surface-light active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 sm:w-4.5 sm:h-4.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- Bottom Quote -->
        <p
          v-motion-fade-up
          class="text-darker-gold px-4 mb-8 md:mb-10 lg:max-w-3xl xl:max-w-4xl section-quote"
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
.itinerary-slider-stage {
  --card-w: 88%;
  --card-gap: 16px;
  --center-shift: 0;
  overflow: hidden;
  touch-action: pan-y;
  cursor: grab;
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%);
}

.itinerary-slider-stage:active {
  cursor: grabbing;
}

@media (min-width: 640px) {
  .itinerary-slider-stage {
    --card-w: 56%;
    --card-gap: 20px;
    --center-shift: 0;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
  }
}

@media (min-width: 768px) {
  .itinerary-slider-stage {
    --card-w: 45%;
    --card-gap: 22px;
    --center-shift: 0;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
  }
}

@media (min-width: 1024px) {
  .itinerary-slider-stage {
    --card-w: 38%;
    --card-gap: 24px;
    --center-shift: 1;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  }
}

@media (min-width: 1280px) {
  .itinerary-slider-stage {
    --card-w: 32%;
    --card-gap: 24px;
    --center-shift: 1;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  }
}

@media (min-width: 1536px) {
  .itinerary-slider-stage {
    --card-w: 28%;
    --card-gap: 24px;
    --center-shift: 1;
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
  }
}

.itinerary-slider-track {
  will-change: transform;
  transform: translate3d(
    calc(
      50% - ((var(--idx, 0) + var(--center-shift, 0)) * (var(--card-w) + var(--card-gap))) -
        (var(--card-w) / 2) + var(--drag-x, 0px)
    ),
    0,
    0
  );
  transition: transform 0.48s cubic-bezier(0.22, 1, 0.36, 1);
}

.itinerary-slider-track.is-instant {
  transition: none !important;
}

.itinerary-slide-item {
  width: var(--card-w);
  flex: 0 0 var(--card-w);
  margin-right: var(--card-gap);
}

.itinerary-slide-item :deep(a),
.itinerary-slide-item :deep(img) {
  -webkit-user-drag: none;
  user-select: none;
}
</style>
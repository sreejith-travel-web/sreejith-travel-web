<!-- ~/app/components/HorizontalCardSlider.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

export interface SliderCardItem {
  id: string
  image: string
  alt: string
  eyebrow?: string
  title?: string
  tags?: string[]
  to?: string
  days?: string
  isFeatured?: boolean
}

export interface HorizontalCardSliderConfig {
  initialIndex?: number
  autoplay?: boolean
  autoplayIntervalMs?: number
  showCardOverlay?: boolean
  aspectRatio?: string
  imageWidth?: number
  imageHeight?: number
  typeIcon?: string
  featuredIcon?: string
  slides: SliderCardItem[]
}

const props = defineProps<{
  data: HorizontalCardSliderConfig
  ariaLabel?: string
}>()

const emit = defineEmits<{
  (e: 'change', stopIndex: number): void
  (e: 'stopsChange', totalStops: number): void
  (e: 'overflowChange', isOverflowing: boolean): void
  (e: 'select', index: number, item: SliderCardItem): void
}>()

// ==========================================
// REFS & LAYOUT METRICS
// ==========================================
const stageRef = ref<HTMLElement | null>(null)
const scrollContainerRef = ref<HTMLElement | null>(null)
const sampleCardRef = ref<HTMLElement | null>(null)

const slides = computed(() => props.data.slides || [])
const totalSlides = computed(() => slides.value.length)

const isOverflowing = ref(true)
const isMobileViewport = ref(false)
const cardWidth = ref(320)
const cardGap = ref(24)
const maxScrollLeft = ref(0)

const stride = computed(() => Math.max(1, cardWidth.value + cardGap.value))

// Exact number of distinct snap stops (equals totalSlides on mobile, or bounded stops on desktop)
const totalStops = computed(() => {
  if (!isOverflowing.value || totalSlides.value <= 1) return totalSlides.value
  if (isMobileViewport.value) return totalSlides.value
  const stops = Math.round(maxScrollLeft.value / stride.value) + 1
  return Math.max(1, Math.min(totalSlides.value, stops))
})

const activeStopIndex = ref(0)
const canGoPrev = ref(false)
const canGoNext = ref(true)

// ==========================================
// SCROLL POSITION & STOP MAPPING
// ==========================================
const getScrollLeftForStop = (stopIdx: number): number => {
  const clamped = Math.max(0, Math.min(totalStops.value - 1, stopIdx))
  if (clamped === totalStops.value - 1 && !isMobileViewport.value) {
    return maxScrollLeft.value
  }
  return Math.min(maxScrollLeft.value, clamped * stride.value)
}

const onScroll = () => {
  const el = scrollContainerRef.value
  if (!el) return

  const sl = el.scrollLeft
  const maxSl = Math.max(0, el.scrollWidth - el.clientWidth)
  maxScrollLeft.value = maxSl

  canGoPrev.value = sl > 4
  canGoNext.value = sl < maxSl - 4

  if (maxSl <= 4) {
    if (activeStopIndex.value !== 0) {
      activeStopIndex.value = 0
      emit('change', 0)
    }
    return
  }

  let nextStop = 0
  if (sl >= maxSl - 6) {
    nextStop = totalStops.value - 1
  } else {
    nextStop = Math.max(0, Math.min(totalStops.value - 1, Math.round(sl / stride.value)))
  }

  if (nextStop !== activeStopIndex.value) {
    activeStopIndex.value = nextStop
    emit('change', nextStop)
  }
}

// ==========================================
// NAVIGATION METHODS (ARROWS, KEYBOARD, DOTS)
// ==========================================
const scrollToStop = (stopIdx: number, smooth = true) => {
  const el = scrollContainerRef.value
  if (!el || !isOverflowing.value) return

  const clamped = Math.max(0, Math.min(totalStops.value - 1, stopIdx))
  const targetLeft = getScrollLeftForStop(clamped)

  activeStopIndex.value = clamped
  emit('change', clamped)

  el.scrollTo({
    left: targetLeft,
    behavior: smooth ? 'smooth' : 'auto'
  })
}

const next = () => {
  stopAutoplay()
  if (activeStopIndex.value < totalStops.value - 1) {
    autoplayDirection.value = 1
    scrollToStop(activeStopIndex.value + 1, true)
  }
  if (!isHoveringStage.value && !isTouching.value) startAutoplay()
}

const prev = () => {
  stopAutoplay()
  if (activeStopIndex.value > 0) {
    autoplayDirection.value = -1
    scrollToStop(activeStopIndex.value - 1, true)
  }
  if (!isHoveringStage.value && !isTouching.value) startAutoplay()
}

const goToRealIndex = (index: number) => {
  stopAutoplay()
  scrollToStop(index, true)
  if (!isHoveringStage.value && !isTouching.value) startAutoplay()
}

const onKeyDown = (e: KeyboardEvent) => {
  if (!isOverflowing.value) return
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'Home') {
    e.preventDefault()
    goToRealIndex(0)
  } else if (e.key === 'End') {
    e.preventDefault()
    goToRealIndex(totalStops.value - 1)
  }
}

// ==========================================
// DESKTOP MOUSE DRAG-TO-SCROLL (TOUCH USES NATIVE CSS)
// ==========================================
const isMouseDragging = ref(false)
const suppressClick = ref(false)
const isHoveringStage = ref(false)
const isTouching = ref(false)

let mouseDown = false
let dragStartX = 0
let dragStartScrollLeft = 0
let dragSamples: { x: number; t: number }[] = []

const onMouseDown = (e: MouseEvent) => {
  if (!isOverflowing.value || e.button !== 0 || !scrollContainerRef.value) return

  stopAutoplay()
  mouseDown = true
  isMouseDragging.value = false
  suppressClick.value = false

  dragStartX = e.clientX
  dragStartScrollLeft = scrollContainerRef.value.scrollLeft
  dragSamples = [{ x: e.clientX, t: performance.now() }]

  window.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('mouseup', onMouseUp, { passive: true })
}

const onMouseMove = (e: MouseEvent) => {
  if (!mouseDown || !scrollContainerRef.value) return

  const dx = e.clientX - dragStartX
  if (!isMouseDragging.value && Math.abs(dx) > 5) {
    isMouseDragging.value = true
    suppressClick.value = true
  }

  if (isMouseDragging.value) {
    scrollContainerRef.value.scrollLeft = dragStartScrollLeft - dx

    const now = performance.now()
    dragSamples.push({ x: e.clientX, t: now })
    while (dragSamples.length > 2 && now - dragSamples[0]!.t > 90) {
      dragSamples.shift()
    }
  }
}

const onMouseUp = () => {
  if (!mouseDown) return
  mouseDown = false

  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)

  const el = scrollContainerRef.value
  if (isMouseDragging.value && el) {
    const now = performance.now()
    while (dragSamples.length > 1 && now - dragSamples[0]!.t > 100) {
      dragSamples.shift()
    }

    let velocity = 0
    if (dragSamples.length >= 2) {
      const first = dragSamples[0]!
      const last = dragSamples[dragSamples.length - 1]!
      const dt = Math.max(1, last.t - first.t)
      velocity = -(last.x - first.x) / dt
      velocity = Math.max(-2.5, Math.min(2.5, velocity))
    }

    const projectedScroll = el.scrollLeft + velocity * 220
    const targetStop = Math.max(
      0,
      Math.min(totalStops.value - 1, Math.round(projectedScroll / stride.value))
    )

    isMouseDragging.value = false
    nextTick(() => {
      scrollToStop(targetStop, true)
    })
  } else {
    isMouseDragging.value = false
  }

  if (!isHoveringStage.value) startAutoplay()

  setTimeout(() => {
    suppressClick.value = false
  }, 50)
}

const onCardClickCapture = (e: MouseEvent, idx: number, item: SliderCardItem) => {
  if (suppressClick.value) {
    e.preventDefault()
    e.stopPropagation()
    return
  }
  emit('select', idx, item)
}

// Pause autoplay cleanly during native touch interaction
const onTouchStart = () => {
  isTouching.value = true
  stopAutoplay()
}

const onTouchEnd = () => {
  isTouching.value = false
  startAutoplay()
}

// ==========================================
// PING-PONG AUTOPLAY (LEFT -> RIGHT, THEN RIGHT -> LEFT)
// ==========================================
const autoplayDirection = ref<1 | -1>(1)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const startAutoplay = () => {
  stopAutoplay()
  if (!props.data.autoplay || !isOverflowing.value || totalStops.value <= 1) return

  const interval = props.data.autoplayIntervalMs || 5000
  autoplayTimer = setInterval(() => {
    if (
      mouseDown ||
      isHoveringStage.value ||
      isTouching.value ||
      document.visibilityState !== 'visible'
    ) {
      return
    }

    // Reverse direction gracefully at boundaries
    if (autoplayDirection.value === 1 && !canGoNext.value) {
      autoplayDirection.value = -1
    } else if (autoplayDirection.value === -1 && !canGoPrev.value) {
      autoplayDirection.value = 1
    }

    const nextStop = Math.max(
      0,
      Math.min(totalStops.value - 1, activeStopIndex.value + autoplayDirection.value)
    )
    scrollToStop(nextStop, true)
  }, interval)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// ==========================================
// RESIZE & OVERFLOW DETECTION
// ==========================================
let resizeObserver: ResizeObserver | null = null

const measureLayout = (isInitial = false) => {
  if (!stageRef.value) return
  const sw = stageRef.value.clientWidth
  isMobileViewport.value = sw < 640

  if (sw < 640) cardGap.value = 16
  else if (sw < 1024) cardGap.value = 20
  else cardGap.value = 24

  if (sampleCardRef.value) {
    const cw = sampleCardRef.value.clientWidth
    if (cw > 0) cardWidth.value = cw
  }

  const totalContentWidth =
    totalSlides.value * cardWidth.value + Math.max(0, totalSlides.value - 1) * cardGap.value
  const nextOverflow = totalSlides.value > 1 && totalContentWidth > sw

  if (nextOverflow !== isOverflowing.value || isInitial) {
    isOverflowing.value = nextOverflow
    emit('overflowChange', nextOverflow)
  }

  nextTick(() => {
    const el = scrollContainerRef.value
    if (!el) return

    maxScrollLeft.value = Math.max(0, el.scrollWidth - el.clientWidth)
    emit('stopsChange', totalStops.value)

    if (isInitial) {
      const initIdx = Math.max(0, Math.min(totalStops.value - 1, props.data.initialIndex || 0))
      if (initIdx > 0) {
        scrollToStop(initIdx, false)
      } else {
        onScroll()
      }
    } else {
      onScroll()
    }
  })
}

watch(totalStops, (newStops) => {
  emit('stopsChange', newStops)
})

onMounted(() => {
  nextTick(() => {
    measureLayout(true)

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measureLayout(false)
      })
      if (stageRef.value) resizeObserver.observe(stageRef.value)
      if (sampleCardRef.value) resizeObserver.observe(sampleCardRef.value)
    }

    startAutoplay()
  })
})

onBeforeUnmount(() => {
  stopAutoplay()
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  if (resizeObserver) resizeObserver.disconnect()
})

defineExpose({
  next,
  prev,
  goToRealIndex,
  canGoPrev,
  canGoNext,
  isOverflowing,
  totalStops
})
</script>

<template>
  <div
    ref="stageRef"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    tabindex="0"
    class="relative w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-intention-blue/20 overflow-hidden"
    @keydown="onKeyDown"
    @mouseenter="isHoveringStage = true; stopAutoplay()"
    @mouseleave="isHoveringStage = false; startAutoplay()"
  >
    <!-- Invisible Sizing Probe (Guarantees accurate card width measurement & 0.000 CLS) -->
    <div
      ref="sampleCardRef"
      :style="{ aspectRatio: data.aspectRatio || '2 / 3' }"
      class="absolute top-0 left-0 pointer-events-none invisible -z-10 w-[76vw] 2xs:w-[72vw] xs:w-[68vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] xl:w-[23vw] 2xl:w-[20vw] max-w-88 min-w-36"
      aria-hidden="true"
    />

    <!-- Screen Reader Live Region -->
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      Slide {{ activeStopIndex + 1 }} of {{ totalStops }}: {{ slides[activeStopIndex]?.title || slides[activeStopIndex]?.alt }}
    </div>

    <!-- ==========================================
         MODE A: NATIVE SNAP HORIZONTAL TRACK (When slides exceed container width)
         ========================================== -->
    <div
      v-if="isOverflowing"
      ref="scrollContainerRef"
      :class="[
        'w-full flex items-center overflow-x-auto hide-scrollbar py-4 sm:py-6',
        'px-[6vw] 2xs:px-[6vw] xs:px-[6vw] sm:px-4 md:px-6 lg:px-6',
        'sm:scroll-px-4 md:scroll-px-6 lg:scroll-px-6',
        'gap-4 sm:gap-5 lg:gap-6',
        isMouseDragging ? 'snap-none cursor-grabbing scroll-smooth-disabled' : 'snap-x snap-mandatory cursor-grab'
      ]"
      @scroll.passive="onScroll"
      @mousedown="onMouseDown"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
      @touchcancel.passive="onTouchEnd"
    >
      <article
        v-for="(item, idx) in slides"
        :key="item.id || idx"
        :style="{ aspectRatio: data.aspectRatio || '2 / 3' }"
        :class="[
          'group/card relative shrink-0 isolate w-[76vw] 2xs:w-[72vw] xs:w-[68vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] xl:w-[23vw] 2xl:w-[20vw] max-w-88 min-w-36 rounded-xl sm:rounded-2xl overflow-hidden bg-journey-deep shadow-md',
          'snap-center',
          idx < totalStops - 1
            ? 'sm:snap-start'
            : idx === totalSlides - 1
              ? 'sm:snap-end'
              : 'sm:snap-none'
        ]"
      >
        <!-- Background Image (Card stays anchored, image zooms smoothly) -->
        <img
          :src="item.image"
          :alt="item.alt"
          :width="data.imageWidth || 400"
          :height="data.imageHeight || 600"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          draggable="false"
          class="w-full h-full object-cover object-center select-none transition-transform duration-700 ease-editorial group-hover/card:scale-[1.08] group-active/card:scale-[1.12]"
        />

        <!-- Full-Card Interactive Link Overlay -->
        <NuxtLink
          v-if="data.showCardOverlay !== false"
          :to="item.to || '/itineraries'"
          draggable="false"
          @dragstart.prevent
          @click.capture="onCardClickCapture($event, idx, item)"
          class="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-5 md:p-6 bg-linear-to-t from-journey-deep/95 via-journey-deep/40 to-journey-deep/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warm-gold"
        >
          <!-- TOP BAR: Badges & Days -->
          <div class="flex justify-between items-start w-full">
            <div class="flex items-center gap-2">
              <div
                v-if="data.typeIcon"
                class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-journey-deep/80 text-surface-medium shadow-sm [&>svg]:w-4 [&>svg]:h-4 [&>svg]:sm:w-4.5 [&>svg]:sm:h-4.5"
                v-html="data.typeIcon"
              />
              <div
                v-if="item.isFeatured && data.featuredIcon"
                class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md text-warm-gold bg-journey-deep/80 shadow-sm [&>svg]:w-4.5 [&>svg]:h-4.5 [&>svg]:sm:w-5 [&>svg]:sm:h-5"
                v-html="data.featuredIcon"
              />
            </div>
            <div
              v-if="item.days"
              class="flex items-center justify-center px-2 py-1.5 sm:px-2.5 rounded-md bg-journey-deep/80 backdrop-blur-md text-surface-light font-primary font-medium text-[9px] sm:text-[10px] tracking-wide shadow-sm uppercase"
            >
              {{ item.days }}
            </div>
          </div>

          <!-- BOTTOM BAR: Typography & Animated Button -->
          <div class="flex items-end justify-between w-full gap-3 mt-auto text-left">
            <div class="flex flex-col flex-1 min-w-0">
              <span
                v-if="item.eyebrow"
                class="text-warm-gold card-eyebrow"
              >
                {{ item.eyebrow }}
              </span>
              <h3
                v-if="item.title"
                class="text-surface-light card-title"
              >
                {{ item.title }}
              </h3>
              <div
                v-if="item.tags?.length"
                class="flex flex-wrap items-center gap-1.5 border-t border-surface-light/15 pt-2.5"
              >
                <template v-for="(tag, tIdx) in item.tags" :key="tIdx">
                  <span class="text-surface-light/80 card-tag">
                    {{ tag }}
                  </span>
                  <span v-if="tIdx < item.tags.length - 1" class="text-warm-gold/70 text-[12px]" aria-hidden="true">·</span>
                </template>
              </div>
            </div>

            <!-- Arrow Button -->
            <div class="relative shrink-0 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full text-warm-gold transition-transform duration-300 ease-out group-hover/card:scale-110 active:scale-90">
              <div class="absolute inset-0 rounded-full ring-1 ring-warm-gold transition-all duration-300 ease-out group-hover/card:ring-2 group-hover/card:ring-warm-gold" />
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 ease-out">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>

    <!-- ==========================================
         MODE B: CENTERED FLEX FALLBACK (When slides fit inside container)
         ========================================== -->
    <div
      v-else
      class="relative w-full flex flex-wrap items-center justify-center gap-4 sm:gap-5 lg:gap-6 px-4 py-4 sm:py-6"
    >
      <article
        v-for="(item, idx) in slides"
        :key="item.id || idx"
        :style="{ aspectRatio: data.aspectRatio || '2 / 3' }"
        class="group/card relative isolate w-[76vw] 2xs:w-[72vw] xs:w-[68vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] xl:w-[23vw] 2xl:w-[20vw] max-w-88 min-w-36 rounded-xl sm:rounded-2xl overflow-hidden bg-journey-deep shadow-md cursor-pointer"
        @click="emit('select', idx, item)"
      >
        <img
          :src="item.image"
          :alt="item.alt"
          :width="data.imageWidth || 400"
          :height="data.imageHeight || 600"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          draggable="false"
          class="w-full h-full object-cover object-center select-none transition-transform duration-700 ease-editorial group-hover/card:scale-[1.08] group-active/card:scale-[1.12]"
        />

        <NuxtLink
          v-if="data.showCardOverlay !== false"
          :to="item.to || '/itineraries'"
          draggable="false"
          @dragstart.prevent
          class="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-5 md:p-6 bg-linear-to-t from-journey-deep/95 via-journey-deep/40 to-journey-deep/10"
        >
          <!-- TOP BAR: Badges & Days -->
          <div class="flex justify-between items-start w-full">
            <div class="flex items-center gap-2">
              <div
                v-if="data.typeIcon"
                class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-journey-deep/80 text-surface-medium shadow-sm [&>svg]:w-4 [&>svg]:h-4 [&>svg]:sm:w-4.5 [&>svg]:sm:h-4.5"
                v-html="data.typeIcon"
              />
              <div
                v-if="item.isFeatured && data.featuredIcon"
                class="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md text-warm-gold bg-journey-deep/80 shadow-sm [&>svg]:w-4.5 [&>svg]:h-4.5 [&>svg]:sm:w-5 [&>svg]:sm:h-5"
                v-html="data.featuredIcon"
              />
            </div>
            <div
              v-if="item.days"
              class="flex items-center justify-center px-2 py-1.5 sm:px-2.5 rounded-md bg-journey-deep/85 backdrop-blur-md text-surface-light font-primary font-medium text-[9px] sm:text-[10px] tracking-wide shadow-sm uppercase"
            >
              {{ item.days }}
            </div>
          </div>

          <!-- BOTTOM BAR: Typography & Animated Button -->
          <div class="flex items-end justify-between w-full gap-3 mt-auto text-left">
            <div class="flex flex-col flex-1 min-w-0">
              <span
                v-if="item.eyebrow"
                class="text-warm-gold card-eyebrow"
              >
                {{ item.eyebrow }}
              </span>
              <h3
                v-if="item.title"
                class="text-surface-light card-title"
              >
                {{ item.title }}
              </h3>
              <div
                v-if="item.tags?.length"
                class="flex flex-wrap items-center gap-1.5 border-t border-surface-light/15 pt-2.5"
              >
                <template v-for="(tag, tIdx) in item.tags" :key="tIdx">
                  <span class="text-surface-light/80 card-tag">
                    {{ tag }}
                  </span>
                  <span v-if="tIdx < item.tags.length - 1" class="text-warm-gold/70 text-[12px]" aria-hidden="true">·</span>
                </template>
              </div>
            </div>

            <!-- Arrow Button -->
            <div class="relative shrink-0 flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full text-warm-gold transition-transform duration-300 ease-out group-hover/card:scale-110 active:scale-90">
              <div class="absolute inset-0 rounded-full ring-1 ring-warm-gold/50 transition-all duration-300 ease-out group-hover/card:ring-2 group-hover/card:ring-warm-gold" />
              <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 ease-out">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>

  </div>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.scroll-smooth-disabled {
  scroll-behavior: auto !important;
}
</style>
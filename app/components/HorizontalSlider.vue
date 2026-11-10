<!-- ~/app/components/HorizontalSlider.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import type { LightboxMediaItem, LightboxOpenPayload } from '~/components/Lightbox.vue'

export interface HorizontalSlideImageInput {
  src: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  captionMob?: boolean
  captionPc?: boolean
}

export interface NormalizedHorizontalSlide extends LightboxMediaItem {
  aspectRatio: number
}

const props = withDefaults(
  defineProps<{
    images: Array<string | HorizontalSlideImageInput>
    /** Desktop height in px (default 400 -> 350 tablet -> 300 mobile) */
    sliderHeight?: number
    /** When false: only first image has left radius & last image has right radius. When true: all images rounded. */
    innerRounding?: boolean
    /** Passed strictly to Lightbox when opened (never rendered below the slider) */
    caption?: string
    captions?: string[]
    captionMob?: boolean
    captionPc?: boolean
  }>(),
  {
    sliderHeight: 400,
    innerRounding: false,
    caption: undefined,
    captions: undefined,
    captionMob: true,
    captionPc: true
  }
)

const emit = defineEmits<{
  (e: 'open-lightbox', payload: LightboxOpenPayload): void
}>()

// =========================================================
// RESPONSIVE HEIGHT STEP-DOWN (Desktop -> Tablet -50 -> Mobile -100)
// =========================================================
const heightVars = computed(() => {
  const pc = props.sliderHeight && props.sliderHeight > 0 ? props.sliderHeight : 400
  const tab = Math.max(220, pc - 50)
  const mob = Math.max(180, pc - 100)
  return {
    '--h-pc': `${pc}px`,
    '--h-tab': `${tab}px`,
    '--h-mob': `${mob}px`
  }
})

// =========================================================
// NORMALIZE SLIDES & AUTO-DETECT NATURAL ASPECT RATIO
// =========================================================
const naturalRatios = ref<Record<number, number>>({})

const normalizedSlides = computed<NormalizedHorizontalSlide[]>(() =>
  (props.images || []).map((raw, idx) => {
    const fallbackCap = props.captions?.[idx] ?? props.caption
    if (typeof raw === 'string') {
      const detectedRatio = naturalRatios.value[idx] || 1
      return {
        src: raw,
        alt: fallbackCap || `Gallery slide ${idx + 1}`,
        width: 600,
        height: 600,
        aspectRatio: detectedRatio,
        caption: fallbackCap,
        captionMob: props.captionMob,
        captionPc: props.captionPc
      }
    }

    const hasExplicitDims = Boolean(raw.width && raw.width > 0 && raw.height && raw.height > 0)
    const w = raw.width && raw.width > 0 ? raw.width : 600
    const h = raw.height && raw.height > 0 ? raw.height : 600
    const ratio = naturalRatios.value[idx] || (hasExplicitDims ? w / h : 1)

    return {
      src: raw.src,
      alt: raw.alt || raw.caption || fallbackCap || `Gallery slide ${idx + 1}`,
      width: w,
      height: h,
      aspectRatio: ratio,
      caption: raw.caption ?? fallbackCap,
      captionMob: raw.captionMob ?? props.captionMob,
      captionPc: props.captionPc ?? props.captionPc
    }
  })
)

const onImageLoad = (idx: number, event: Event) => {
  const img = event.target as HTMLImageElement | null
  if (!img || !img.naturalWidth || !img.naturalHeight) return
  const ratio = img.naturalWidth / img.naturalHeight
  if (Math.abs((naturalRatios.value[idx] || 0) - ratio) > 0.01) {
    naturalRatios.value[idx] = ratio
    nextTick(() => measureTrack())
  }
}

// =========================================================
// BORDER RADIUS HELPER (Outer Wrapper None; First Left, Last Right)
// =========================================================
const getSlideRoundingClass = (idx: number, total: number): string => {
  if (props.innerRounding || total === 1) {
    return 'rounded-2xl'
  }
  if (idx === 0) {
    return 'rounded-l-2xl rounded-r-none'
  }
  if (idx === total - 1) {
    return 'rounded-r-2xl rounded-l-none'
  }
  return 'rounded-none'
}

// =========================================================
// TRACK METRICS & SNAP STOPS (First Flush-Left, Middle Center, Last Flush-Right)
// =========================================================
const stageRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const slideRefs = ref<HTMLElement[]>([])
const imgRefs = ref<HTMLImageElement[]>([])

const scrollX = ref(0)
const maxScrollX = ref(0)
const snapStops = ref<number[]>([0])
const activeSlideIndex = ref(0)

let resizeObserver: ResizeObserver | null = null

const syncActiveSlideIndex = (currentX: number) => {
  let closestIdx = 0
  let minDiff = Number.POSITIVE_INFINITY
  snapStops.value.forEach((stop, idx) => {
    const diff = Math.abs(stop - currentX)
    if (diff < minDiff) {
      minDiff = diff
      closestIdx = idx
    }
  })
  activeSlideIndex.value = closestIdx
}

const measureTrack = () => {
  const stage = stageRef.value
  const track = trackRef.value
  if (!stage || !track) return

  const stageWidth = stage.clientWidth
  const trackWidth = track.scrollWidth
  const max = Math.max(0, trackWidth - stageWidth)
  maxScrollX.value = max

  const slides = slideRefs.value.filter(Boolean)
  const count = slides.length

  if (count <= 1 || max <= 0) {
    snapStops.value = [0]
    scrollX.value = 0
    activeSlideIndex.value = 0
    return
  }

  const stops: number[] = slides.map((el, idx) => {
    // 1. First image: flush left
    if (idx === 0) return 0
    // 2. Last image: flush right
    if (idx === count - 1) return max
    // 3. Middle images: dead center of container
    const centeredOffset = el.offsetLeft + el.offsetWidth / 2 - stageWidth / 2
    return Math.max(0, Math.min(max, centeredOffset))
  })

  snapStops.value = stops

  // Keep active slide centered/aligned when viewport resizes
  const targetStop = stops[activeSlideIndex.value] ?? 0
  scrollX.value = Math.max(0, Math.min(max, targetStop))
}

// =========================================================
// ONE-WAY SMOOTH EASING ENGINE (Zero Zigzag / Zero Overshoot)
// =========================================================
const isPointerDown = ref(false)
const isDragging = ref(false)
let rafId: number | null = null
let wheelTimeout: ReturnType<typeof setTimeout> | null = null

let startPointerX = 0
let startScrollX = 0
let lastPointerX = 0
let lastMoveTime = 0
let velocityX = 0
let maxDragDistance = 0

const stopAnimation = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

const findNearestStopIndex = (projectedX: number): number => {
  const clamped = Math.max(0, Math.min(maxScrollX.value, projectedX))
  let bestIdx = 0
  let bestDist = Number.POSITIVE_INFINITY

  snapStops.value.forEach((stop, idx) => {
    const dist = Math.abs(clamped - stop)
    if (dist < bestDist) {
      bestDist = dist
      bestIdx = idx
    }
  })
  return bestIdx
}

const easeToStopIndex = (targetIdx: number) => {
  stopAnimation()
  const clampedIdx = Math.max(0, Math.min(snapStops.value.length - 1, targetIdx))
  activeSlideIndex.value = clampedIdx
  const targetX = Math.max(0, Math.min(maxScrollX.value, snapStops.value[clampedIdx] ?? 0))

  const step = () => {
    const diff = targetX - scrollX.value
    if (Math.abs(diff) <= 0.5) {
      scrollX.value = targetX
      rafId = null
      return
    }
    // Pure one-way exponential ease-out (never overshoots or zigzags)
    scrollX.value += diff * 0.22
    rafId = requestAnimationFrame(step)
  }

  rafId = requestAnimationFrame(step)
}

// =========================================================
// POINTER & WHEEL HANDLERS (Zoom-In on Hover, Grabbing Only on Drag)
// =========================================================
const onPointerDown = (e: PointerEvent) => {
  if (e.button !== 0 && e.pointerType === 'mouse') return
  if (maxScrollX.value <= 0) return

  stopAnimation()
  isPointerDown.value = true
  isDragging.value = false
  startPointerX = e.clientX
  lastPointerX = e.clientX
  startScrollX = scrollX.value
  lastMoveTime = performance.now()
  velocityX = 0
  maxDragDistance = 0
}

const onPointerMove = (e: PointerEvent) => {
  if (!isPointerDown.value) return

  const now = performance.now()
  const dt = Math.max(1, now - lastMoveTime)
  const dx = e.clientX - lastPointerX
  const totalDelta = startPointerX - e.clientX

  maxDragDistance = Math.max(maxDragDistance, Math.abs(totalDelta))

  // Only enter dragging state (and switch cursor to grabbing) past 5px threshold
  if (!isDragging.value && maxDragDistance > 5) {
    isDragging.value = true
  }

  if (!isDragging.value) return

  const instantVx = -dx / dt
  velocityX = velocityX * 0.4 + instantVx * 0.6

  let nextX = startScrollX + totalDelta
  if (nextX < 0) {
    nextX = nextX * 0.25
  } else if (nextX > maxScrollX.value) {
    nextX = maxScrollX.value + (nextX - maxScrollX.value) * 0.25
  }

  scrollX.value = nextX
  lastPointerX = e.clientX
  lastMoveTime = now
}

const finishPointerDrag = () => {
  if (!isPointerDown.value) return
  isPointerDown.value = false

  if (!isDragging.value) {
    return
  }

  isDragging.value = false

  if (performance.now() - lastMoveTime > 80) {
    velocityX = 0
  }

  // Project natural momentum forward and pick the target slide stop
  const projectedX = scrollX.value + velocityX * 220
  let targetIdx = findNearestStopIndex(projectedX)

  // If user made a deliberate swipe/drag, step at least 1 slide in swipe direction
  if (
    targetIdx === activeSlideIndex.value &&
    (Math.abs(velocityX) > 0.25 || maxDragDistance > 45)
  ) {
    const dir = startPointerX - lastPointerX > 0 ? 1 : -1
    targetIdx = Math.max(0, Math.min(snapStops.value.length - 1, activeSlideIndex.value + dir))
  }

  easeToStopIndex(targetIdx)
}

const onWheel = (e: WheelEvent) => {
  if (maxScrollX.value <= 0) return
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return

  e.preventDefault()
  stopAnimation()

  const nextX = Math.max(0, Math.min(maxScrollX.value, scrollX.value + e.deltaX))
  scrollX.value = nextX
  syncActiveSlideIndex(nextX)

  if (wheelTimeout) clearTimeout(wheelTimeout)
  wheelTimeout = setTimeout(() => {
    const nearestIdx = findNearestStopIndex(scrollX.value)
    easeToStopIndex(nearestIdx)
  }, 120)
}

// =========================================================
// NAVIGATION ARROWS & LIGHTBOX TRIGGER
// =========================================================
const canGoPrev = computed(() => scrollX.value > 4)
const canGoNext = computed(() => maxScrollX.value > 4 && scrollX.value < maxScrollX.value - 4)

const prevSlide = () => {
  if (!canGoPrev.value) return
  const nextIdx = Math.max(0, activeSlideIndex.value - 1)
  easeToStopIndex(nextIdx)
}

const nextSlide = () => {
  if (!canGoNext.value) return
  const nextIdx = Math.min(snapStops.value.length - 1, activeSlideIndex.value + 1)
  easeToStopIndex(nextIdx)
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevSlide()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextSlide()
  }
}

const handleSlideClick = (idx: number) => {
  if (maxDragDistance > 5) return
  emit('open-lightbox', {
    items: normalizedSlides.value,
    index: idx
  })
}

watch(
  () => [props.images, props.sliderHeight],
  async () => {
    await nextTick()
    measureTrack()
  },
  { deep: true }
)

onMounted(() => {
  // Detect natural dimensions for any cached images already loaded
  imgRefs.value.forEach((img, idx) => {
    if (img && img.complete && img.naturalWidth && img.naturalHeight) {
      naturalRatios.value[idx] = img.naturalWidth / img.naturalHeight
    }
  })

  nextTick(() => measureTrack())

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => measureTrack())
    if (stageRef.value) resizeObserver.observe(stageRef.value)
    if (trackRef.value) resizeObserver.observe(trackRef.value)
  }

  window.addEventListener('pointerup', finishPointerDrag)
  window.addEventListener('pointercancel', finishPointerDrag)
})

onBeforeUnmount(() => {
  stopAnimation()
  if (wheelTimeout) clearTimeout(wheelTimeout)
  resizeObserver?.disconnect()
  window.removeEventListener('pointerup', finishPointerDrag)
  window.removeEventListener('pointercancel', finishPointerDrag)
})
</script>

<template>
  <div
    v-if="normalizedSlides.length > 0"
    v-motion-fade-up
    :style="heightVars"
    class="w-full flex flex-col select-none"
  >
    <!-- OUTER VIEWPORT STAGE (No Wrapper Border Radius) -->
    <div
      ref="stageRef"
      tabindex="0"
      role="region"
      aria-label="Horizontal image gallery"
      class="group relative w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue touch-pan-y"
      :class="isDragging ? 'cursor-grabbing' : 'cursor-zoom-in'"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @wheel="onWheel"
      @keydown="onKeyDown"
    >
      <!-- TRACK: w-full so child occupies its full width -->
      <div
        ref="trackRef"
        class="flex items-stretch gap-2.5 sm:gap-3.5 w-full will-change-transform"
        :style="{ transform: `translate3d(${-scrollX}px, 0, 0)` }"
      >
        <div
          v-for="(slide, idx) in normalizedSlides"
          :key="`${slide.src}-${idx}`"
          :ref="(el) => { if (el) slideRefs[idx] = el as HTMLElement }"
          class="horizontal-slide-item relative shrink-0 overflow-hidden bg-journey-deep/5 group/slide"
          :class="[
            getSlideRoundingClass(idx, normalizedSlides.length),
            isDragging ? 'cursor-grabbing' : 'cursor-zoom-in'
          ]"
          :style="{ '--slide-ratio': `${slide.aspectRatio}` }"
          @click="handleSlideClick(idx)"
        >
          <img
            :ref="(el) => { if (el) imgRefs[idx] = el as HTMLImageElement }"
            :src="slide.src"
            :alt="slide.alt"
            :width="slide.width || 600"
            :height="slide.height || 600"
            :loading="idx < 2 ? 'eager' : 'lazy'"
            decoding="async"
            draggable="false"
            class="w-full h-full object-cover object-center select-none pointer-events-none transition-transform duration-700 ease-out group-hover/slide:scale-[1.02]"
            @load="onImageLoad(idx, $event)"
          />
        </div>
      </div>

      <!-- TRANSLUCENT LEFT ARROW (Desktop Hover Only + Only When Needed) -->
      <button
        v-if="canGoPrev"
        type="button"
        aria-label="Previous slide"
        class="hidden md:flex absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-journey-deep/50 backdrop-blur-md border border-white/25 text-surface-light items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-300 ease-out hover:bg-journey-deep/80 hover:scale-105 active:scale-95 cursor-pointer"
        @pointerdown.stop
        @click.stop="prevSlide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <!-- TRANSLUCENT RIGHT ARROW (Desktop Hover Only + Only When Needed) -->
      <button
        v-if="canGoNext"
        type="button"
        aria-label="Next slide"
        class="hidden md:flex absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-journey-deep/50 backdrop-blur-md border border-white/25 text-surface-light items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all duration-300 ease-out hover:bg-journey-deep/80 hover:scale-105 active:scale-95 cursor-pointer"
        @pointerdown.stop
        @click.stop="nextSlide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4.5 h-4.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Fixed responsive height (min-height = height) + natural width capped at full image width */
.horizontal-slide-item {
  height: var(--h-mob, 300px);
  min-height: var(--h-mob, 300px);
  width: calc(var(--h-mob, 300px) * var(--slide-ratio, 1));
}

@media (min-width: 640px) {
  .horizontal-slide-item {
    height: var(--h-tab, 350px);
    min-height: var(--h-tab, 350px);
    width: calc(var(--h-tab, 350px) * var(--slide-ratio, 1));
  }
}

@media (min-width: 1024px) {
  .horizontal-slide-item {
    height: var(--h-pc, 400px);
    min-height: var(--h-pc, 400px);
    width: calc(var(--h-pc, 400px) * var(--slide-ratio, 1));
  }
}
</style>
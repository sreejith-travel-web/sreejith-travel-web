<!-- ~/app/components/StackedFanSlider.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useWindowSize, useIntersectionObserver } from '@vueuse/core'

export interface FanSlideItem {
  id?: string | number
  image: string
  alt: string
  eyebrow?: string
  title?: string
  tags?: string[]
  to?: string
}

export interface StackedFanSliderConfig {
  infinite?: boolean
  initialIndex?: number
  autoplay?: boolean
  autoplayIntervalMs?: number
  enableHoverGap?: boolean
  showCardOverlay?: boolean
  aspectRatio?: string
  imageWidth?: number
  imageHeight?: number
  slides: FanSlideItem[]
}

const props = withDefaults(defineProps<{
  data: StackedFanSliderConfig
  ariaLabel?: string
}>(), {
  ariaLabel: 'Interactive media showcase'
})

const emit = defineEmits<{
  change: [index: number, item: FanSlideItem]
  select: [index: number, item: FanSlideItem]
}>()

// --- Viewport & Breakpoint Adaptation ---
const { width: windowWidth } = useWindowSize()
const stageRef = ref<HTMLElement | null>(null)
const isInViewport = ref(false)

useIntersectionObserver(
  stageRef,
  (entries) => {
    if (entries[0]?.isIntersecting) isInViewport.value = true
  },
  { rootMargin: '250px 0px' }
)

// Responsive profile across 2xs, xs, sm, md, lg, xl, 2xl
// w-[72vw] 2xs:w-[68vw] xs:w-[64vw] sm:w-[56vw] md:w-[40vw] lg:w-[32vw] xl:w-[26vw] 2xl:w-[22vw]
const breakpointProfile = computed(() => {
  const w = import.meta.client ? windowWidth.value : 1280

  if (w < 321) {
    // Micro (<321px) | Card: 72vw | Max offset edge: 94.6vw (Single side card, zero clipping)
    return { minSlides: 3, maxSide: 1, baseStep: 16, stackStep: 0, gapBoost: 2, scaleDrop: 0.12 }
  }
  if (w < 375) {
    // 2xs (321px - 374px) | Card: 68vw | Max offset edge: 94.2vw (2 side cards visible)
    return { minSlides: 3, maxSide: 2, baseStep: 13, stackStep: 11, gapBoost: 2, scaleDrop: 0.11 }
  }
  if (w < 480) {
    // xs (375px - 479px) | Card: 64vw | Max offset edge: 94.1vw (2 side cards visible)
    return { minSlides: 3, maxSide: 2, baseStep: 15, stackStep: 12, gapBoost: 3, scaleDrop: 0.11 }
  }
  if (w < 640) {
    // sm (480px - 639px) | Card: 56vw | Max offset edge: 92.5vw (2 side cards visible)
    return { minSlides: 3, maxSide: 2, baseStep: 18, stackStep: 14, gapBoost: 4, scaleDrop: 0.10 }
  }
  if (w < 768) {
    // md-small (640px - 767px) | Card: 56vw | Max offset edge: 93.7vw (2 side cards visible)
    return { minSlides: 3, maxSide: 2, baseStep: 20, stackStep: 15, gapBoost: 4, scaleDrop: 0.095 }
  }
  if (w < 1024) {
    // md/lg (768px - 1023px) | Card: 40vw | Max offset edge: 85.2vw (3 side cards visible, zero clipping)
    return { minSlides: 5, maxSide: 3, baseStep: 32, stackStep: 16, gapBoost: 6, scaleDrop: 0.09 }
  }
  if (w < 1280) {
    // lg/xl (1024px - 1279px) | Card: 32vw | Max offset edge: 83.8vw (4 side cards visible, zero clipping)
    return { minSlides: 5, maxSide: 4, baseStep: 36, stackStep: 18, gapBoost: 8, scaleDrop: 0.085 }
  }
  if (w < 1536) {
    // xl (1280px - 1535px) | Card: 26vw | Max offset edge: 72.8vw (4 side cards visible, corner text safe)
    return { minSlides: 5, maxSide: 4, baseStep: 40, stackStep: 19, gapBoost: 9, scaleDrop: 0.08 }
  }
  // 2xl (1536px+) | Card: 22vw | Max offset edge: 65.1vw (4 side cards visible, inside 1640px container)
  return { minSlides: 5, maxSide: 4, baseStep: 44, stackStep: 20, gapBoost: 10, scaleDrop: 0.08 }
})

// --- Core State & Virtual Infinite Index ---
const slides = computed(() => props.data.slides || [])
const totalSlides = computed(() => slides.value.length)
const isFanActive = computed(() => totalSlides.value >= breakpointProfile.value.minSlides)
const isInfinite = computed(() => (props.data.infinite ?? true) && totalSlides.value > 1)
const enableHoverGap = computed(() => props.data.enableHoverGap ?? true)

// Unbounded integer in infinite mode; clamped [0, totalSlides - 1] in finite mode
const virtualIndex = ref(props.data.initialIndex ?? 0)

// Normalized [0, totalSlides - 1] index for external consumers & indicators
const activeRealIndex = computed(() => {
  const n = totalSlides.value
  if (n === 0) return 0
  return ((virtualIndex.value % n) + n) % n
})

// Hover states for the signature center-gap & side-tuck animation
const hoveredOffset = ref<number | null>(null)
const pressedOffset = ref<number | null>(null)
const isHoveringStage = ref(false)

// In the video: gap is open at rest or when hovering center card (offset === 0);
// gap closes (side cards tuck behind center card) when hovering side cards (|offset| >= 1)
const isSideStackTucked = computed(() => {
  if (!enableHoverGap.value) return false
  if (isActuallyDragging.value) return true
  return hoveredOffset.value !== null && hoveredOffset.value !== 0
})

// --- Virtual Slot Window Generation ---
interface VirtualCardSlot {
  vIndex: number
  realIndex: number
  offset: number
  item: FanSlideItem
}

const renderedSlots = computed<VirtualCardSlot[]>(() => {
  const n = totalSlides.value
  if (n === 0) return []

  // Render buffer of +1 beyond maxSide so multi-card jumps glide in smoothly without popping
  const buffer = breakpointProfile.value.maxSide + 1

  if (isInfinite.value) {
    const result: VirtualCardSlot[] = []
    for (let offset = -buffer; offset <= buffer; offset++) {
      const vIdx = virtualIndex.value + offset
      const rIdx = ((vIdx % n) + n) % n
      result.push({
        vIndex: vIdx,
        realIndex: rIdx,
        offset,
        item: slides.value[rIdx]!
      })
    }
    return result
  } else {
    return slides.value.map((item, idx) => ({
      vIndex: idx,
      realIndex: idx,
      offset: idx - virtualIndex.value,
      item
    }))
  }
})

// --- Navigation Actions ---
const goToOffset = (delta: number) => {
  if (totalSlides.value <= 1 || delta === 0) return

  if (isInfinite.value) {
    virtualIndex.value += delta
  } else {
    const next = Math.max(0, Math.min(totalSlides.value - 1, virtualIndex.value + delta))
    virtualIndex.value = next
  }
}

const next = () => goToOffset(1)
const prev = () => goToOffset(-1)

const goToRealIndex = (targetRealIdx: number) => {
  const n = totalSlides.value
  if (n <= 1) return

  if (!isInfinite.value) {
    virtualIndex.value = Math.max(0, Math.min(n - 1, targetRealIdx))
    return
  }

  // Shortest circular path in infinite mode
  const currentReal = activeRealIndex.value
  let diff = targetRealIdx - currentReal
  if (diff > n / 2) diff -= n
  if (diff < -n / 2) diff += n
  virtualIndex.value += diff
}

watch(activeRealIndex, (newIdx) => {
  const currentItem = slides.value[newIdx]
  if (currentItem) {
    emit('change', newIdx, currentItem)
  }
})

// --- Pointer / Touch Drag & Inertia Engine ---
const isDragging = ref(false)

//Only trigger drag physics if they moved the pointer more than 3 pixels
const isActuallyDragging = computed(() => isDragging.value && Math.abs(dragOffsetPx.value) > 10)

const dragOffsetPx = ref(0)
let pointerStartX = 0
let pointerStartY = 0
let pointerStartTime = 0
let isHorizontalGesture: boolean | null = null
let activePointerId: number | null = null
let didDragSignificantly = false

const getCardWidthPx = () => {
  if (!stageRef.value) return 260
  const centerCard = stageRef.value.querySelector('[data-center-card="true"]') as HTMLElement | null
  return centerCard?.offsetWidth || 260
}

const onPointerDown = (e: PointerEvent) => {
  if (totalSlides.value <= 1) return
  if (e.pointerType === 'mouse' && e.button !== 0) return

  stopAutoplay()
  activePointerId = e.pointerId
  pointerStartX = e.clientX
  pointerStartY = e.clientY
  pointerStartTime = performance.now()
  isHorizontalGesture = null
  didDragSignificantly = false
  isDragging.value = true
  dragOffsetPx.value = 0
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value || e.pointerId !== activePointerId) return

  const dx = e.clientX - pointerStartX
  const dy = e.clientY - pointerStartY

  if (isHorizontalGesture === null) {
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      isHorizontalGesture = Math.abs(dx) >= Math.abs(dy)
      if (!isHorizontalGesture) {
        isDragging.value = false
        dragOffsetPx.value = 0
        return
      }
    } else {
      return
    }
  }

  if (Math.abs(dx) > 8) {
    didDragSignificantly = true
  }

  // Apply rubber-band resistance at finite boundaries
  if (!isInfinite.value) {
    const atStart = virtualIndex.value === 0 && dx > 0
    const atEnd = virtualIndex.value === totalSlides.value - 1 && dx < 0
    if (atStart || atEnd) {
      dragOffsetPx.value = dx * 0.28
      return
    }
  }

  dragOffsetPx.value = dx
}

const onPointerUpOrCancel = (e: PointerEvent) => {

  pressedOffset.value = null

  if (!isDragging.value || (activePointerId !== null && e.pointerId !== activePointerId)) return

  const dx = dragOffsetPx.value
  const elapsed = Math.max(1, performance.now() - pointerStartTime)
  const velocity = dx / elapsed // px per ms
  const cardWidth = getCardWidthPx()

  isDragging.value = false
  dragOffsetPx.value = 0
  activePointerId = null

  // Inertia / velocity flick calculation
  if (Math.abs(velocity) > 0.45 || Math.abs(dx) > cardWidth * 0.18) {
    const direction = dx < 0 ? 1 : -1
    const velocityJump = Math.min(3, Math.max(1, Math.round(Math.abs(velocity) * 1.4)))
    const distanceJump = Math.min(3, Math.max(1, Math.round(Math.abs(dx) / (cardWidth * 0.55))))
    const steps = Math.max(velocityJump, distanceJump)
    goToOffset(direction * steps)
  }

  startAutoplay()
}

// --- Card Click Handler ---
const handleCardClick = (slot: VirtualCardSlot) => {
  if (didDragSignificantly) {
    didDragSignificantly = false
    return
  }

  if (slot.offset === 0) {
    emit('select', slot.realIndex, slot.item)
  } else {
    goToOffset(slot.offset)
  }
}

// --- Trackpad / Horizontal Wheel Support ---
let wheelCooldown = false
const onWheel = (e: WheelEvent) => {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 18) return
  e.preventDefault()
  if (wheelCooldown) return

  wheelCooldown = true
  if (e.deltaX > 0) next()
  else prev()

  setTimeout(() => {
    wheelCooldown = false
  }, 420)
}

// --- Complete Keyboard Suite ---
const onKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      e.preventDefault()
      stopAutoplay()
      next()
      break
    case 'ArrowLeft':
    case 'ArrowUp':
      e.preventDefault()
      stopAutoplay()
      prev()
      break
    case ' ':
    case 'Spacebar':
      e.preventDefault()
      stopAutoplay()
      if (e.shiftKey) prev()
      else next()
      break
    case 'Home':
      e.preventDefault()
      stopAutoplay()
      goToRealIndex(0)
      break
    case 'End':
      e.preventDefault()
      stopAutoplay()
      goToRealIndex(totalSlides.value - 1)
      break
    case 'Enter': {
      e.preventDefault()
      const current = slides.value[activeRealIndex.value]
      if (current) emit('select', activeRealIndex.value, current)
      break
    }
    default:
      // Number keys 1-9 jump directly to slide
      if (/^[1-9]$/.test(e.key)) {
        const target = parseInt(e.key, 10) - 1
        if (target < totalSlides.value) {
          e.preventDefault()
          stopAutoplay()
          goToRealIndex(target)
        }
      }
      break
  }
}

// --- GPU Transform & Depth Matrix Calculation ---
const getCardStyle = (slot: VirtualCardSlot) => {
  const { maxSide, baseStep, stackStep, gapBoost, scaleDrop } = breakpointProfile.value
  const cardWidth = getCardWidthPx()

  // Live fractional offset during pointer drag
  const dragFraction = isDragging.value ? dragOffsetPx.value / cardWidth : 0
  const effectiveOffset = slot.offset + dragFraction
  const absOffset = Math.abs(effectiveOffset)
  const sign = effectiveOffset === 0 ? 0 : effectiveOffset > 0 ? 1 : -1

  // Hide cards outside the visible fan window
  if (absOffset > maxSide + 0.5) {
    const parkedX = sign * (baseStep + gapBoost + maxSide * stackStep + 15)
    return {
      transform: `translate3d(${parkedX}%, 0, 0) scale(0.55)`,
      opacity: '0',
      zIndex: '1',
      pointerEvents: 'none' as const
    }
  }

  // Non-linear X positioning matching the video's center gap + tight outer fan
  const activeGapBoost = isSideStackTucked.value ? 0 : gapBoost
  let translateXPercent = 0

  if (absOffset <= 1) {
    translateXPercent = sign * absOffset * (baseStep + activeGapBoost)
  } else {
    translateXPercent =
      sign * (baseStep + activeGapBoost + (absOffset - 1) * stackStep)
  }

  // Scale pyramid: 1.0 at center, stepping down smoothly per rank
  const isDirectlyHovered = hoveredOffset.value === slot.offset && slot.offset !== 0 && !isDragging.value
  const baseScale = Math.max(0.58, 1 - absOffset * scaleDrop)
  let finalScale = isDirectlyHovered ? baseScale + 0.022 : baseScale

  if (pressedOffset.value === slot.offset) {
    finalScale *= 0.96 // Shrinks the card by 4% when pressed
  }

  // Outer edge fade for cards beyond maxSide
  let opacity = 1
  if (absOffset > maxSide) {
    opacity = Math.max(0, 1 - (absOffset - maxSide) * 1.6)
  }

  // Z-Index pyramid (center is highest at 30)
  const zIndex = Math.max(1, 30 - Math.round(absOffset * 4))

  return {
    transform: `translate3d(${translateXPercent.toFixed(2)}%, 0, 0) scale(${finalScale.toFixed(3)})`,
    opacity: opacity.toFixed(3),
    zIndex: String(zIndex),
    pointerEvents: (absOffset > maxSide + 0.2 ? 'none' : 'auto') as 'none' | 'auto'
  }
}

// GPU opacity scrim to dim side cards like the video without costly CSS filter: brightness()
const getScrimOpacity = (slot: VirtualCardSlot) => {
  const abs = Math.abs(slot.offset)
  if (abs === 0) return 0
  const isDirectlyHovered = hoveredOffset.value === slot.offset && !isDragging.value
  const rawDim = Math.min(0.76, 0.16 + (abs - 1) * 0.17)
  return isDirectlyHovered ? Math.max(0.08, rawDim - 0.12) : rawDim
}

// Smart lazy loading: only center & immediate neighbors load eagerly once slider is near viewport
// const shouldLoadEagerly = (slot: VirtualCardSlot) => {
//   return isInViewport.value && Math.abs(slot.offset) <= 1
// }

// --- Autoplay Lifecycle ---
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const startAutoplay = () => {
  stopAutoplay()
  if (props.data.autoplay && totalSlides.value > 1 && !isHoveringStage.value) {
    autoplayTimer = setInterval(() => {
      next()
    }, props.data.autoplayIntervalMs || 5000)
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

defineExpose({
  next,
  prev,
  goToRealIndex,
  activeRealIndex,
  isFanActive
})
</script>

<template>
  <div
    ref="stageRef"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel"
    tabindex="0"
    class="relative w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-intention-blue/10 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent overflow-hidden py-4 sm:py-6"
    @keydown="onKeyDown"
    @wheel="onWheel"
    @mouseenter="isHoveringStage = true; stopAutoplay()"
    @mouseleave="isHoveringStage = false; hoveredOffset = null; startAutoplay()"
  >
    <!-- Live Region for Screen Readers -->
    <div class="sr-only" aria-live="polite" aria-atomic="true">
      Slide {{ activeRealIndex + 1 }} of {{ totalSlides }}: {{ slides[activeRealIndex]?.title || slides[activeRealIndex]?.alt }}
    </div>

    <!-- MODE A: 3D / GPU Fan Stage (When totalSlides >= minSlides for breakpoint) -->
    <div
      v-if="isFanActive"
      :class="[
        'relative w-full flex items-center justify-center touch-pan-y',
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      ]"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUpOrCancel"
      @pointercancel="onPointerUpOrCancel"
      @lostpointercapture="onPointerUpOrCancel"
    >
      <!-- Center Sizing Anchor (Matches active card widths for 0.000 CLS) -->
      <div
        :style="{ aspectRatio: data.aspectRatio || '2 / 3' }"
        class="relative w-[72vw] 2xs:w-[68vw] xs:w-[64vw] sm:w-[56vw] md:w-[40vw] lg:w-[32vw] xl:w-[26vw] 2xl:w-[22vw] max-w-88 min-w-36 pointer-events-none invisible"
        aria-hidden="true"
      />

      <!-- Virtualized Stacked Cards -->
      <article
        v-for="slot in renderedSlots"
        :key="slot.vIndex"
        :data-center-card="slot.offset === 0 ? 'true' : undefined"
        :style="[
          { aspectRatio: data.aspectRatio || '2 / 3' },
          getCardStyle(slot)
        ]"
        :aria-hidden="slot.offset !== 0"
        :class="[
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 isolate transform-translateZ(0)',
          'w-[72vw] 2xs:w-[68vw] xs:w-[64vw] sm:w-[56vw] md:w-[40vw] lg:w-[32vw] xl:w-[26vw] 2xl:w-[22vw] max-w-88 min-w-36',
          'rounded-xl sm:rounded-2xl overflow-hidden bg-journey-deep shadow-md',
          'will-change-[transform,opacity]',
          isActuallyDragging 
            ? 'transition-none' 
            : (pressedOffset === slot.offset 
                ? 'transition-[transform,opacity] duration-200 ease-out' 
                : 'transition-[transform,opacity] duration-650 ease-[cubic-bezier(0.22,1,0.36,1)]'),
          'cursor-pointer'
        ]"
        @pointerdown="pressedOffset = slot.offset"
        @pointerleave="pressedOffset = null"
        @mouseenter="hoveredOffset = slot.offset"
        @click.stop="handleCardClick(slot)"
      >
        <img
          :src="slot.item.image"
          :alt="slot.item.alt"
          :width="data.imageWidth || 480"
          :height="data.imageHeight || 640"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          draggable="false"
          class="w-full h-full object-cover object-center select-none transition-transform duration-700 ease-out"
          :class="slot.offset === 0 && hoveredOffset === 0 && !isActuallyDragging ? 'scale-[1.03]' : 'scale-100'"
        />

        <slot
          name="card"
          :item="slot.item"
          :index="slot.realIndex"
          :offset="slot.offset"
          :is-active="slot.offset === 0"
        >
          <div
            v-if="data.showCardOverlay && (slot.item.eyebrow || slot.item.title || slot.item.tags?.length)"
            :class="[
              'absolute inset-0 z-30 flex flex-col justify-end p-4 sm:p-5 md:p-6 bg-linear-to-t from-journey-deep/90 via-journey-deep/25 to-transparent pointer-events-none transition-opacity duration-500',
              slot.offset === 0 ? 'opacity-100' : 'opacity-0 sm:opacity-80'
            ]"
          >
            <span
              v-if="slot.item.eyebrow"
              class="font-uppercase text-[9px] 2xs:text-[10px] xs:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] tracking-[0.24em] text-warm-gold uppercase mb-1"
            >
              {{ slot.item.eyebrow }}
            </span>

            <h3
              v-if="slot.item.title"
              class="font-primary text-surface-light text-[16px] 2xs:text-[18px] xs:text-[19px] sm:text-[20px] md:text-[21px] lg:text-[23px] xl:text-[25px] font-medium leading-snug mb-2.5 drop-shadow-sm"
            >
              {{ slot.item.title }}
            </h3>

            <div
              v-if="slot.item.tags?.length"
              class="flex flex-wrap items-center gap-1.5 border-t border-surface-light/15 pt-2.5"
            >
              <template v-for="(tag, tIdx) in slot.item.tags" :key="tIdx">
                <span class="font-uppercase text-[8px] 2xs:text-[9px] xs:text-[10px] md:text-[11px] lg:text-[12px] tracking-[0.08em] text-surface-light/80 uppercase">
                  {{ tag }}
                </span>
                <span
                  v-if="tIdx < slot.item.tags.length - 1"
                  class="text-warm-gold/70 text-[12px]"
                  aria-hidden="true"
                >
                  ·
                </span>
              </template>
            </div>
          </div>
        </slot>

        <div
          class="absolute inset-0 z-20 bg-journey-deep pointer-events-none transition-opacity duration-500 ease-out"
          :style="{ opacity: getScrimOpacity(slot) }"
          aria-hidden="true"
        />
      </article>
    </div>

    <!-- MODE B: Flex Fallback Layout (When totalSlides < minSlides for breakpoint) -->
    <div
      v-else
      class="relative w-full flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 px-2"
    >
      <article
        v-for="(item, idx) in slides"
        :key="item.id || idx"
        :style="{ aspectRatio: data.aspectRatio || '2 / 3' }"
        class="relative isolate w-[78vw] 2xs:w-[72vw] xs:w-[66vw] sm:w-[34vw] md:w-[26vw] lg:w-[21vw] xl:w-[19vw] max-w-76 min-w-36 rounded-xl sm:rounded-2xl overflow-hidden bg-journey-deep shadow-md cursor-pointer group transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 active:scale-[0.97]"
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
          class="w-full h-full object-cover object-center select-none transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        <slot
          name="card"
          :item="item"
          :index="idx"
          :offset="0"
          :is-active="true"
        >
          <div
            v-if="data.showCardOverlay && (item.eyebrow || item.title || item.tags?.length)"
            class="absolute inset-0 z-30 flex flex-col justify-end p-4 sm:p-5 md:p-6 bg-linear-to-t from-journey-deep/90 via-journey-deep/25 to-transparent pointer-events-none"
          >
            <span
              v-if="item.eyebrow"
              class="font-uppercase text-[9px] 2xs:text-[10px] xs:text-[11px] md:text-[12px] lg:text-[13px] xl:text-[14px] tracking-[0.24em] text-warm-gold uppercase mb-1"
            >
              {{ item.eyebrow }}
            </span>

            <h3
              v-if="item.title"
              class="font-primary text-surface-light text-[16px] 2xs:text-[18px] xs:text-[19px] sm:text-[20px] md:text-[21px] lg:text-[23px] xl:text-[25px] font-medium leading-snug mb-2.5 drop-shadow-sm"
            >
              {{ item.title }}
            </h3>

            <div
              v-if="item.tags?.length"
              class="flex flex-wrap items-center gap-1.5 border-t border-surface-light/15 pt-2.5"
            >
              <template v-for="(tag, tIdx) in item.tags" :key="tIdx">
                <span class="font-uppercase text-[8px] 2xs:text-[9px] xs:text-[10px] md:text-[11px] lg:text-[12px] tracking-[0.08em] text-surface-light/80 uppercase">
                  {{ tag }}
                </span>
                <span
                  v-if="tIdx < item.tags.length - 1"
                  class="text-warm-gold/70 text-[12px]"
                  aria-hidden="true"
                >
                  ·
                </span>
              </template>
            </div>
          </div>
        </slot>
      </article>
    </div>
  </div>
</template>
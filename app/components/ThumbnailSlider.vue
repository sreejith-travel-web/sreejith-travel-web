<!-- ~/app/components/ThumbnailSlider.vue -->
<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue'
import type { LightboxOpenPayload, LightboxMediaItem } from '~/components/Lightbox.vue'

export interface SliderImageEntry {
  src: string
  alt?: string
  width?: number
  height?: number
  caption?: string
  captionMob?: boolean
  captionPc?: boolean
  captionPC?: boolean
}

export interface ThumbnailSliderConfig {
  images: Array<string | SliderImageEntry>
  width?: number
  height?: number
  autoplay?: boolean
  interval?: number
  caption?: string
  captions?: string[]
  captionMob?: boolean
  captionPc?: boolean
  captionPC?: boolean
}

interface NormalizedSlideItem {
  index: number
  src: string
  width: number | null
  height: number | null
  alt: string
  fullCaption: string
  truncatedCaption: string
  captionClass: string
}

const props = defineProps<{
  block: ThumbnailSliderConfig
}>()

const emit = defineEmits<{
  (e: 'open-lightbox', payload: LightboxOpenPayload): void
}>()

const activeIndex = ref(0)
const thumbContainer = ref<HTMLElement | null>(null)

// Overflow, Drag & Inertia States
const isThumbOverflowing = ref(false)
const canScrollThumbLeft = ref(false)
const canScrollThumbRight = ref(false)
const isDraggingThumbs = ref(false)
const isInertiaMoving = ref(false)

let isPointerDown = false
let hasDraggedThumbs = false
let dragStartX = 0
let dragScrollLeft = 0
let lastMoveX = 0
let lastMoveTime = 0
let velocityX = 0
let inertiaRafId: number | null = null

let touchStartX = 0
let touchStartY = 0
let autoplayTimer: ReturnType<typeof setInterval> | null = null
let resizeObserver: ResizeObserver | null = null

const isAutoplayEnabled = computed(() => Boolean(props.block?.autoplay))
const autoplayInterval = computed(() => Number(props.block?.interval) || 4000)

// --- CAPTION & SLIDE NORMALIZATION ---
const truncateCaption = (text: string) => {
  if (!text) return ''
  return text.length > 100 ? `${text.slice(0, 100)}...` : text
}

const getCaptionVisibilityClass = (entry: SliderImageEntry | null) => {
  const rawMob = entry?.captionMob ?? props.block?.captionMob
  const rawPc =
    entry?.captionPc ?? entry?.captionPC ?? props.block?.captionPc ?? props.block?.captionPC

  // Default to true when caption exists unless explicitly set to false in JSON
  const showMob = rawMob !== undefined ? Boolean(rawMob) : true
  const showPc = rawPc !== undefined ? Boolean(rawPc) : true

  if (showMob && showPc) return 'block'
  if (showMob && !showPc) return 'block lg:hidden'
  if (!showMob && showPc) return 'hidden lg:block'
  return 'hidden'
}

const slides = computed<NormalizedSlideItem[]>(() => {
  const raw = Array.isArray(props.block?.images) ? props.block.images : []
  const blockCaption = props.block?.caption ? String(props.block.caption).trim() : ''

  return raw.map((entry, idx) => {
    const isObj = entry !== null && typeof entry === 'object'
    const src = isObj ? entry.src || '' : String(entry || '')
    const w = isObj && Number(entry.width) > 0 ? Number(entry.width) : null
    const h = isObj && Number(entry.height) > 0 ? Number(entry.height) : null

    const itemCaption = isObj && entry.caption ? String(entry.caption).trim() : ''
    const arrayCaption =
      Array.isArray(props.block?.captions) && props.block.captions[idx]
        ? String(props.block.captions[idx]).trim()
        : ''
    const resolvedCaption = itemCaption || arrayCaption || blockCaption

    const explicitAlt = isObj && entry.alt ? String(entry.alt).trim() : ''
    const alt = explicitAlt || resolvedCaption || `Sreejith Travel Visual ${idx + 1}`

    return {
      index: idx,
      src,
      width: w,
      height: h,
      alt,
      fullCaption: resolvedCaption,
      truncatedCaption: truncateCaption(resolvedCaption),
      captionClass: resolvedCaption ? getCaptionVisibilityClass(isObj ? entry : null) : 'hidden'
    }
  })
})

// Static Stage Aspect Ratio (Block dims -> First image dims -> Default 4:3 1200x900)
const stageDims = computed(() => {
  const bw = Number(props.block?.width)
  const bh = Number(props.block?.height)
  if (bw > 0 && bh > 0) return { width: bw, height: bh }

  const first = slides.value[0]
  if (first?.width && first?.height) {
    return { width: first.width, height: first.height }
  }
  return { width: 1200, height: 900 }
})

const activeSlide = computed<NormalizedSlideItem | null>(
  () => slides.value[activeIndex.value] || slides.value[0] || null
)

// --- LIGHTBOX TRIGGER ---
const openStageLightbox = () => {
  if (!slides.value.length) return
  const items: LightboxMediaItem[] = slides.value.map((s) => ({
    src: s.src,
    alt: s.alt,
    caption: s.fullCaption || '',
    width: s.width || stageDims.value.width,
    height: s.height || stageDims.value.height
  }))
  emit('open-lightbox', {
    items,
    index: activeIndex.value
  })
}

// --- SLIDE NAVIGATION & AUTOPLAY ---
const goToSlide = (index: number) => {
  if (!slides.value.length) return
  activeIndex.value = (index + slides.value.length) % slides.value.length
  nextTick(() => scrollToActiveThumbnail())
}

const nextSlide = () => {
  goToSlide(activeIndex.value + 1)
  resetAutoplay()
}

const prevSlide = () => {
  goToSlide(activeIndex.value - 1)
  resetAutoplay()
}

const startAutoplay = () => {
  if (!isAutoplayEnabled.value || slides.value.length <= 1) return
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    goToSlide(activeIndex.value + 1)
  }, autoplayInterval.value)
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const pauseAutoplay = () => stopAutoplay()
const resumeAutoplay = () => {
  if (isAutoplayEnabled.value) startAutoplay()
}
const resetAutoplay = () => {
  if (isAutoplayEnabled.value) startAutoplay()
}

// --- MAIN STAGE TOUCH SWIPE ---
const onStageTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return
  pauseAutoplay()
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

const onStageTouchEnd = (e: TouchEvent) => {
  const touch = e.changedTouches[0]
  if (!touch) {
    resumeAutoplay()
    return
  }
  const dx = touch.clientX - touchStartX
  const dy = touch.clientY - touchStartY

  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) nextSlide()
    else prevSlide()
  }
  resumeAutoplay()
}

// --- THUMBNAIL STRIP SCROLL, INERTIA DRAG & OVERFLOW ---
const stopInertia = () => {
  if (inertiaRafId !== null) {
    cancelAnimationFrame(inertiaRafId)
    inertiaRafId = null
  }
  isInertiaMoving.value = false
}

const updateThumbOverflowState = () => {
  const el = thumbContainer.value
  if (!el) return
  const overflow = el.scrollWidth > el.clientWidth + 2
  isThumbOverflowing.value = overflow
  canScrollThumbLeft.value = overflow && el.scrollLeft > 4
  canScrollThumbRight.value = overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}

const scrollThumbsBy = (delta: number) => {
  if (!thumbContainer.value) return
  stopInertia()
  thumbContainer.value.scrollBy({ left: delta, behavior: 'smooth' })
}

const scrollToActiveThumbnail = () => {
  const el = thumbContainer.value
  if (!el || !isThumbOverflowing.value) return
  stopInertia()
  const thumb = el.children[activeIndex.value] as HTMLElement | undefined
  if (thumb) {
    const scrollPos = thumb.offsetLeft - el.offsetWidth / 2 + thumb.offsetWidth / 2
    el.scrollTo({ left: scrollPos, behavior: 'smooth' })
  }
}

const onThumbnailClick = (idx: number) => {
  if (hasDraggedThumbs) return
  goToSlide(idx)
  resetAutoplay()
}

const startInertiaGlide = () => {
  const el = thumbContainer.value
  if (!el || Math.abs(velocityX) <= 0.5) {
    isInertiaMoving.value = false
    return
  }

  isInertiaMoving.value = true

  const step = () => {
    if (!thumbContainer.value) {
      isInertiaMoving.value = false
      inertiaRafId = null
      return
    }

    const prevScroll = thumbContainer.value.scrollLeft
    thumbContainer.value.scrollLeft -= velocityX
    updateThumbOverflowState()

    // Apply 0.93 friction decay per frame
    velocityX *= 0.93

    const hitEdge = Math.abs(thumbContainer.value.scrollLeft - prevScroll) < 0.2
    if (Math.abs(velocityX) > 0.4 && !hitEdge) {
      inertiaRafId = requestAnimationFrame(step)
    } else {
      isInertiaMoving.value = false
      inertiaRafId = null
    }
  }

  inertiaRafId = requestAnimationFrame(step)
}

const onThumbMouseDown = (e: MouseEvent) => {
  const el = thumbContainer.value
  if (!el) return
  stopInertia()
  isPointerDown = true
  hasDraggedThumbs = false
  dragStartX = e.pageX - el.offsetLeft
  dragScrollLeft = el.scrollLeft
  lastMoveX = e.pageX
  lastMoveTime = performance.now()
  velocityX = 0
  pauseAutoplay()
}

const onThumbMouseMove = (e: MouseEvent) => {
  const el = thumbContainer.value
  if (!isPointerDown || !el) return

  const x = e.pageX - el.offsetLeft
  const distance = x - dragStartX

  if (Math.abs(distance) > 5) {
    hasDraggedThumbs = true
    isDraggingThumbs.value = true
  }

  if (hasDraggedThumbs) {
    e.preventDefault()
    const now = performance.now()
    const dt = Math.max(1, now - lastMoveTime)
    const dx = e.pageX - lastMoveX

    // Track instantaneous pointer velocity scaled to 16ms frame + 2x walk multiplier
    velocityX = (dx / dt) * 16 * 2
    lastMoveX = e.pageX
    lastMoveTime = now

    const walk = (x - dragStartX) * 2
    el.scrollLeft = dragScrollLeft - walk
    updateThumbOverflowState()
  }
}

const finishThumbDrag = () => {
  if (!isPointerDown) return
  isPointerDown = false
  isDraggingThumbs.value = false
  resumeAutoplay()

  if (hasDraggedThumbs) {
    startInertiaGlide()
  }

  setTimeout(() => {
    hasDraggedThumbs = false
  }, 0)
}

const onThumbMouseUp = () => {
  finishThumbDrag()
}

const onThumbMouseLeave = () => {
  finishThumbDrag()
}

onMounted(() => {
  updateThumbOverflowState()
  if (thumbContainer.value && typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => updateThumbOverflowState())
    resizeObserver.observe(thumbContainer.value)
  }
  if (isAutoplayEnabled.value) startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
  stopInertia()
  if (resizeObserver) resizeObserver.disconnect()
})
</script>

<template>
  <div
    v-if="slides.length"
    class="w-full flex flex-col gap-3.5 outline-none select-none"
    tabindex="0"
    @keydown.left.prevent="prevSlide"
    @keydown.right.prevent="nextSlide"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
  >
    <!-- 1. MAIN STAGE (Static Aspect Ratio Container = Zero CLS) -->
    <div
      class="group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs bg-bg-light border border-journey-deep/8"
      :style="{ aspectRatio: `${stageDims.width} / ${stageDims.height}` }"
      @touchstart.passive="onStageTouchStart"
      @touchend.passive="onStageTouchEnd"
    >
      <Transition name="fade">
        <button
          v-if="activeSlide?.src"
          :key="activeIndex"
          type="button"
          :aria-label="`View ${activeSlide.alt} in full screen`"
          class="absolute inset-0 w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          @click="openStageLightbox"
        >
          <img
            :src="activeSlide.src"
            :alt="activeSlide.alt"
            :width="stageDims.width"
            :height="stageDims.height"
            loading="lazy"
            decoding="async"
            draggable="false"
            class="w-full h-full object-cover object-center select-none"
          />
        </button>
      </Transition>

      <!-- Main Stage Prev / Next Arrows (Themed with Intention Blue) -->
      <template v-if="slides.length > 1">
        <button
          type="button"
          aria-label="Previous slide"
          class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-journey-deep/55 hover:bg-intention-blue text-surface-light border border-surface-light/20 backdrop-blur-md flex items-center justify-center shadow-lg opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
          @click.stop="prevSlide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          type="button"
          aria-label="Next slide"
          class="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-journey-deep/55 hover:bg-intention-blue text-surface-light border border-surface-light/20 backdrop-blur-md flex items-center justify-center shadow-lg opacity-85 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
          @click.stop="nextSlide"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </template>
    </div>

    <!-- 2. ACTIVE SLIDE CAPTION (Between Main Stage & Thumbnails — Max 100 Chars) -->
    <div
      v-if="activeSlide?.truncatedCaption && activeSlide.captionClass !== 'hidden'"
      :class="[
        activeSlide.captionClass,
        'px-2 text-center section-subparagraph text-secondary-light/85'
      ]"
    >
      {{ activeSlide.truncatedCaption }}
    </div>

    <!-- 3. THUMBNAIL STRIP (4:3 Thumbnails, Centered When Not Overflowing, Inertia Drag + Arrows) -->
    <div v-if="slides.length > 1" class="relative w-full flex items-center">
      <!-- Thumbnail Left Overflow Arrow -->
      <button
        v-if="isThumbOverflowing && canScrollThumbLeft"
        type="button"
        aria-label="Scroll thumbnails left"
        class="absolute left-1 z-10 w-8 h-8 rounded-full bg-journey-deep/75 hover:bg-intention-blue text-surface-light border border-surface-light/20 shadow-md flex items-center justify-center transition-colors cursor-pointer"
        @click.stop="scrollThumbsBy(-260)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <!-- Thumbnail Track -->
      <div
        ref="thumbContainer"
        class="w-full flex items-center gap-3 overflow-x-auto hide-scrollbar py-2 px-1 touch-pan-x"
        :class="[
          isThumbOverflowing ? 'justify-start' : 'justify-center',
          isDraggingThumbs ? 'cursor-grabbing' : 'cursor-grab',
          isDraggingThumbs || isInertiaMoving ? 'scroll-auto' : 'scroll-smooth'
        ]"
        @mousedown="onThumbMouseDown"
        @mousemove="onThumbMouseMove"
        @mouseup="onThumbMouseUp"
        @mouseleave="onThumbMouseLeave"
        @touchstart.passive="stopInertia"
        @wheel.passive="stopInertia"
        @scroll.passive="updateThumbOverflowState"
      >
        <button
          v-for="(item, idx) in slides"
          :key="idx"
          type="button"
          :aria-label="`Select slide ${idx + 1}: ${item.alt}`"
          class="relative shrink-0 w-24 sm:w-32 md:w-36 aspect-4/3 rounded-xl overflow-hidden border-[3px] bg-bg-light transition-all duration-300 outline-none cursor-pointer"
          :class="
            activeIndex === idx
              ? 'border-intention-blue opacity-100 scale-[1.03] shadow-xs'
              : 'border-transparent opacity-55 hover:opacity-100'
          "
          @click="onThumbnailClick(idx)"
        >
          <img
            v-if="item?.src"
            :src="item.src"
            :alt="item.alt"
            width="300"
            height="225"
            loading="lazy"
            decoding="async"
            draggable="false"
            class="w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </button>
      </div>

      <!-- Thumbnail Right Overflow Arrow -->
      <button
        v-if="isThumbOverflowing && canScrollThumbRight"
        type="button"
        aria-label="Scroll thumbnails right"
        class="absolute right-1 z-10 w-8 h-8 rounded-full bg-journey-deep/75 hover:bg-intention-blue text-surface-light border border-surface-light/20 shadow-md flex items-center justify-center transition-colors cursor-pointer"
        @click.stop="scrollThumbsBy(260)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
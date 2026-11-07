<!-- ~/app/components/Lightbox.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export interface LightboxMediaItem {
  src: string
  alt?: string
  caption?: string
  width?: number | null
  height?: number | null
}

export interface LightboxOpenPayload {
  items: LightboxMediaItem[]
  index: number
}

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    items: LightboxMediaItem[]
    initialIndex?: number
  }>(),
  {
    isOpen: false,
    items: () => [],
    initialIndex: 0
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const activeIndex = ref(0)
const naturalDims = ref<{ width: number; height: number } | null>(null)

let touchStartX = 0
let touchStartY = 0

const hasMultiple = computed(() => props.items.length > 1)
const currentItem = computed<LightboxMediaItem | null>(
  () => props.items[activeIndex.value] || props.items[0] || null
)

const onImageLoad = (e: Event) => {
  const img = e.target as HTMLImageElement | null
  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    naturalDims.value = {
      width: img.naturalWidth,
      height: img.naturalHeight
    }
  }
}

// Exact 1.5x max dimensions bounded by 88vw width and 75vh height
const imageBoxStyle = computed(() => {
  const item = currentItem.value
  const providedW = Number(item?.width)
  const providedH = Number(item?.height)

  const w =
    providedW > 0
      ? providedW
      : naturalDims.value?.width && naturalDims.value.width > 0
        ? naturalDims.value.width
        : 900
  const h =
    providedH > 0
      ? providedH
      : naturalDims.value?.height && naturalDims.value.height > 0
        ? naturalDims.value.height
        : 675

  const ratio = w / h
  const maxW = Math.round(w * 1.5)

  return {
    aspectRatio: `${w} / ${h}`,
    width: `min(88vw, calc(75vh * ${ratio}), ${maxW}px)`,
    height: 'auto'
  }
})

const next = () => {
  if (!hasMultiple.value) return
  naturalDims.value = null
  activeIndex.value = (activeIndex.value + 1) % props.items.length
}

const prev = () => {
  if (!hasMultiple.value) return
  naturalDims.value = null
  activeIndex.value = (activeIndex.value - 1 + props.items.length) % props.items.length
}

const onKeyDown = (e: KeyboardEvent) => {
  if (!props.isOpen) return
  if (e.key === 'Escape') {
    e.preventDefault()
    emit('close')
  } else if (e.key === 'ArrowRight' && hasMultiple.value) {
    e.preventDefault()
    next()
  } else if (e.key === 'ArrowLeft' && hasMultiple.value) {
    e.preventDefault()
    prev()
  }
}

const onTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  if (!touch) return
  touchStartX = touch.clientX
  touchStartY = touch.clientY
}

const onTouchEnd = (e: TouchEvent) => {
  const touch = e.changedTouches[0]
  if (!hasMultiple.value || !touch) return
  const dx = touch.clientX - touchStartX
  const dy = touch.clientY - touchStartY
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) next()
    else prev()
  }
}

const lockPageScroll = (locked: boolean) => {
  if (!import.meta.client) return
  const html = document.documentElement
  const body = document.body

  if (locked) {
    html.classList.add('lenis-stopped', 'overflow-hidden')
    body.style.overflow = 'hidden'
  } else {
    html.classList.remove('lenis-stopped', 'overflow-hidden')
    body.style.overflow = ''
  }
}

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      naturalDims.value = null
      activeIndex.value = props.initialIndex || 0
      lockPageScroll(true)
    } else {
      lockPageScroll(false)
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  lockPageScroll(false)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="isOpen && currentItem"
        class="fixed inset-0 z-1000000 bg-journey-deep/90 backdrop-blur-md flex items-center justify-center select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Full screen image viewer"
        @click="emit('close')"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <!-- TOP-RIGHT CLOSE BUTTON (Themed with Intention Blue & Warm Gold) -->
        <button
          id="global-lightbox-close"
          name="global-lightbox-close"
          type="button"
          aria-label="Close lightbox"
          class="fixed top-4 right-4 sm:top-6 sm:right-8 z-30 w-11 h-11 rounded-full bg-surface-light/10 hover:bg-intention-blue text-surface-light border border-surface-light/25 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
          @click.stop="emit('close')"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- PREV / NEXT ARROWS (Rendered when > 1 image) -->
        <template v-if="hasMultiple">
          <button
            id="global-lightbox-prev"
            name="global-lightbox-prev"
            type="button"
            aria-label="Previous image"
            class="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-light/10 hover:bg-intention-blue text-surface-light border border-surface-light/25 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
            @click.stop="prev"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            id="global-lightbox-next"
            name="global-lightbox-next"
            type="button"
            aria-label="Next image"
            class="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface-light/10 hover:bg-intention-blue text-surface-light border border-surface-light/25 backdrop-blur-md flex items-center justify-center shadow-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold"
            @click.stop="next"
          >
            <svg
              class="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </template>

        <!-- CENTER IMAGE (Exact aspect ratio, capped at 150% dims & 88vw x 75vh safe box) -->
        <img
          :key="activeIndex"
          :src="currentItem.src"
          :alt="currentItem.alt || currentItem.caption || 'Journey visual'"
          :width="currentItem.width || 900"
          :height="currentItem.height || 675"
          :style="imageBoxStyle"
          loading="eager"
          decoding="sync"
          draggable="false"
          class="z-20 block object-contain rounded-xl sm:rounded-2xl shadow-2xl transition-transform duration-200"
          @load="onImageLoad"
          @click.stop
        />

        <!-- EDITORIAL BOTTOM CAPTION PILL & COUNTER (Safe bottom zone, no truncation) -->
        <div
          v-if="currentItem.caption || hasMultiple"
          class="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-16 z-30 flex justify-center pointer-events-none"
        >
          <div
            class="max-w-3xl px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl bg-surface-dark/85 border border-surface-light/15 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3.5 text-center pointer-events-auto"
            @click.stop
          >
            <span
              v-if="hasMultiple"
              class="card-tag text-warm-gold font-medium shrink-0 pt-0.5"
            >
              {{ activeIndex + 1 }} / {{ items.length }}
            </span>

            <span
              v-if="hasMultiple && currentItem.caption"
              class="hidden sm:inline-block w-1 h-1 rounded-full bg-surface-light/30 shrink-0"
              aria-hidden="true"
            />

            <p
              v-if="currentItem.caption"
              class="section-subparagraph text-surface-light/95 text-center"
            >
              {{ currentItem.caption }}
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
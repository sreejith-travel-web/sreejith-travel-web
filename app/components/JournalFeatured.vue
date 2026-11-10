<!-- ~/components/JournalFeatured.vue -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { JournalCardItem } from '~/components/JournalCard.vue'

const props = withDefaults(
  defineProps<{
    items: JournalCardItem[]
    showHeader?: boolean
    eager?: boolean
    eyebrow?: string
    titleLine1?: string
    titleLine2Cursive?: string
  }>(),
  {
    showHeader: true,
    eager: true,
    eyebrow: 'FEATURED DISPATCH',
    titleLine1: 'Stories worth slowing',
    titleLine2Cursive: 'Down for.'
  }
)

const currentIndex = ref(0)
const isDragging = ref(false)
const deckRef = ref<HTMLElement | null>(null)

const total = computed(() => props.items.length)
const isInteractiveDeck = computed(() => total.value > 1)

watch(
  () => props.items.length,
  (len) => {
    if (currentIndex.value >= len) {
      currentIndex.value = 0
    }
  }
)

const formattedIndex = computed(() => {
  if (!total.value) return '00 / 00'
  const current = String(currentIndex.value + 1).padStart(2, '0')
  const max = String(total.value).padStart(2, '0')
  return `${current} / ${max}`
})

const resolveHref = (slug: string) => {
  if (!slug) return '/journal'
  return slug.startsWith('/') ? slug : `/journal/${slug}`
}

const focusActiveSlideIfKeyboard = () => {
  if (!import.meta.client || !deckRef.value) return
  const activeEl = document.activeElement
  if (activeEl && deckRef.value.contains(activeEl) && activeEl.tagName === 'A') {
    requestAnimationFrame(() => {
      const nextAnchor = deckRef.value?.querySelector<HTMLAnchorElement>(
        `a[data-slide-idx="${currentIndex.value}"]`
      )
      nextAnchor?.focus({ preventScroll: true })
    })
  }
}

const goToSlide = (idx: number) => {
  if (!isInteractiveDeck.value) return
  currentIndex.value = ((idx % total.value) + total.value) % total.value
  focusActiveSlideIfKeyboard()
}

const prevSlide = () => {
  if (!isInteractiveDeck.value) return
  goToSlide(currentIndex.value - 1)
}

const nextSlide = () => {
  if (!isInteractiveDeck.value) return
  goToSlide(currentIndex.value + 1)
}

// --- 1. Passive Touch Swiping (Mobile & Tablet — Zero Main-Thread Blocking) ---
let touchStartX = 0
let touchStartY = 0
let touchCurrentX = 0
let touchCurrentY = 0

const onTouchStart = (e: TouchEvent) => {
  if (!isInteractiveDeck.value || !e.touches[0]) return
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  touchCurrentX = touchStartX
  touchCurrentY = touchStartY
}

const onTouchMove = (e: TouchEvent) => {
  if (!isInteractiveDeck.value || !e.touches[0]) return
  touchCurrentX = e.touches[0].clientX
  touchCurrentY = e.touches[0].clientY
}

const onTouchEnd = () => {
  if (!isInteractiveDeck.value) return
  const dx = touchCurrentX - touchStartX
  const dy = touchCurrentY - touchStartY
  if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    if (dx < 0) nextSlide()
    else prevSlide()
  }
}

// --- 2. Desktop Mouse Dragging + Click-Through Suppression ---
let mouseDown = false
let dragMoved = false
let dragStartX = 0
let dragStartY = 0
let suppressNextClick = false

const onMouseDown = (e: MouseEvent) => {
  if (!isInteractiveDeck.value || e.button !== 0) return
  mouseDown = true
  dragMoved = false
  dragStartX = e.clientX
  dragStartY = e.clientY
}

const onMouseMove = (e: MouseEvent) => {
  if (!mouseDown || !isInteractiveDeck.value) return
  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  if (!dragMoved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
    dragMoved = true
    isDragging.value = true
  }
}

const finishMouseDrag = (e: MouseEvent) => {
  if (!mouseDown) return
  mouseDown = false
  isDragging.value = false

  if (!dragMoved || !isInteractiveDeck.value) return

  const dx = e.clientX - dragStartX
  const dy = e.clientY - dragStartY
  suppressNextClick = true

  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    if (dx < 0) nextSlide()
    else prevSlide()
  }

  setTimeout(() => {
    suppressNextClick = false
  }, 60)
  dragMoved = false
}

const onSlideClick = (e: MouseEvent) => {
  if (suppressNextClick) {
    e.preventDefault()
    e.stopPropagation()
    suppressNextClick = false
  }
}

// --- 3. Passive Horizontal Trackpad Gesture ---
let wheelCooldown = false

const onWheelHorizontal = (e: WheelEvent) => {
  if (!isInteractiveDeck.value || wheelCooldown) return
  if (Math.abs(e.deltaX) > 36 && Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.5) {
    wheelCooldown = true
    if (e.deltaX > 0) nextSlide()
    else prevSlide()
    setTimeout(() => {
      wheelCooldown = false
    }, 450)
  }
}

// --- 4. Keyboard Left / Right Navigation ---
const onKeyDown = (e: KeyboardEvent) => {
  if (!isInteractiveDeck.value) return
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevSlide()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextSlide()
  }
}
</script>

<template>
  <div
    v-if="items.length > 0"
    :role="isInteractiveDeck ? 'region' : undefined"
    :aria-roledescription="isInteractiveDeck ? 'carousel' : undefined"
    :aria-label="isInteractiveDeck ? 'Featured journal stories' : undefined"
    class="w-full max-w-5xl mx-auto flex flex-col items-center outline-none"
    @keydown="onKeyDown"
  >
    <!-- Zero-CLS Single-Cell Grid Deck (White-to-Whisper-Blue Gradient) -->
    <div
      ref="deckRef"
      class="w-full grid grid-cols-1 rounded-2xl sm:rounded-3xl overflow-hidden bg-linear-to-br from-surface-light via-surface-light/95 to-soft-blue/18 border border-journey-deep/12 shadow-sm transition-shadow duration-500 hover:shadow-xl active:shadow-xl"
      :class="[
        isInteractiveDeck ? (isDragging ? 'cursor-grabbing select-none' : 'cursor-grab') : ''
      ]"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend.passive="onTouchEnd"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="finishMouseDrag"
      @mouseleave="finishMouseDrag"
      @wheel.passive="onWheelHorizontal"
    >
      <NuxtLink
        v-for="(post, idx) in items"
        :key="post.id"
        :data-slide-idx="idx"
        :to="resolveHref(post.slug)"
        draggable="false"
        :tabindex="currentIndex === idx ? 0 : -1"
        :aria-hidden="currentIndex !== idx ? 'true' : undefined"
        :inert="currentIndex !== idx || undefined"
        class="group col-start-1 row-start-1 w-full grid grid-cols-1 md:grid-cols-12 items-stretch transition-opacity duration-500 ease-editorial outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-action-blue"
        :class="
          currentIndex === idx
            ? 'opacity-100 z-10 pointer-events-auto'
            : 'opacity-0 z-0 pointer-events-none select-none'
        "
        @click="onSlideClick"
      >
        <!-- Left Image Column (7 Cols on Desktop) -->
        <div class="md:col-span-6 lg:col-span-7 relative w-full aspect-16/10 sm:aspect-video md:aspect-auto md:min-h-96 xl:min-h-104 overflow-hidden bg-surface-frosted">
          <!-- Warm Light Surface Badge -> Intention Blue on Hover -->
          <div class="card-tag font-semibold absolute top-4 left-4 sm:top-5 sm:left-5 z-10 bg-surface-light/95 backdrop-blur-xs text-dark-gold border border-dark-gold/20 group-hover:bg-intention-blue group-hover:text-surface-light group-hover:border-intention-blue group-active:bg-intention-blue group-active:text-surface-light group-active:border-intention-blue transition-colors duration-300 px-2.5 pt-1.75 pb-1 rounded-sm shadow-xs">
            Featured Story
          </div>

          <img
            :src="post.image"
            :alt="post.alt || post.title"
            width="600"
            height="400"
            draggable="false"
            :loading="eager && idx === 0 ? 'eager' : 'lazy'"
            :decoding="eager && idx === 0 ? 'sync' : 'async'"
            :fetchpriority="eager && idx === 0 ? 'high' : 'low'"
            class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-105 group-active:scale-105 select-none"
          />
        </div>

        <!-- Right Content Column (5 Cols on Desktop — Relaxed Top Rhythm) -->
        <div class="md:col-span-6 lg:col-span-5 p-5 sm:p-6 md:p-7 lg:p-10 xl:p-11 flex flex-col justify-between text-left">
          <!-- Top Editorial Copy Block -->
          <div class="flex flex-col items-start">
            <!-- Category & Read Time Meta -->
            <div class="card-tag font-primary text-journey-deep/80 font-semibold mb-3.5 sm:mb-4 flex items-center gap-2 flex-wrap">
              <span class="text-dark-gold font-bold">
                {{ post.categoryLabel || post.category || 'INSIGHT' }}
              </span>
              <span class="w-1 h-1 rounded-full bg-journey-deep/35" aria-hidden="true" />
              <span>{{ post.readTime }}</span>
            </div>

            <!-- Title -->
            <h3 class="section-smaller-subtitle text-journey-deep group-hover:text-intention-blue group-active:text-intention-blue transition-colors duration-300 leading-[1.18]! line-clamp-2 sm:line-clamp-3 mb-4">
              {{ post.title }}
            </h3>

            <!-- Gold Accent Bar (Expands & Shifts Blue on Hover) -->
            <div
              class="w-10 h-0.5 rounded-full bg-dark-gold mb-4 sm:mb-5 transition-all duration-300 ease-editorial group-hover:w-14 group-hover:bg-intention-blue group-active:w-14 group-active:bg-intention-blue"
              aria-hidden="true"
            />

            <!-- Relaxed Excerpt -->
            <p class="section-paragraph text-secondary-light/95 leading-relaxed line-clamp-3 sm:line-clamp-4 mb-7 sm:mb-8">
              {{ post.excerpt }}
            </p>
          </div>

          <!-- Bottom Divider + 3 Auto-Width Tag Pills + Rounded Outline CTA -->
          <div class="w-full pt-5 border-t border-journey-deep/12 flex flex-col items-start gap-4 mt-auto">
            <!-- 3 Hashtag Pills -->
            <div
              v-if="post.tags && post.tags.length"
              class="flex flex-wrap items-center gap-2"
            >
              <span
                v-for="tag in post.tags.slice(0, 3)"
                :key="tag"
                class="rounded-sm bg-surface-light/85 border border-journey-deep/16 text-journey-deep/85 card-tag font-primary font-medium px-3 pt-1.5 pb-1 transition-colors duration-300 group-hover:border-journey-deep/28"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Rounded Outline CTA Button with Fill Hover -->
            <div class="w-fit">
              <div class="shrink-0 inline-flex items-center justify-center border-[1.5px] border-journey-deep/35 bg-surface-light/80 px-3 h-9 rounded-sm text-[10px] md:text-[11px] font-uppercase font-semibold tracking-[0.18em] text-journey-deep uppercase transition-all duration-300 group-hover:border-intention-blue group-hover:bg-intention-blue group-hover:text-surface-light group-active:border-intention-blue group-active:bg-intention-blue group-active:text-surface-light mt-2 gap-2.5 group-active:scale-96">
                <span class="pt-1 leading-none">READ STORY</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Pagination Controls + Interactive Pills (Only Rendered When > 1 Story Exists) -->
    <div
      v-if="isInteractiveDeck"
      class="flex items-center justify-center gap-4 sm:gap-5 mt-5 sm:mt-6 h-10 select-none"
    >
      <!-- Previous Arrow -->
      <button
        type="button"
        aria-label="Previous featured story"
        @click="prevSlide"
        class="w-10 h-10 rounded-full border border-journey-deep/25 bg-surface-light/80 flex items-center justify-center text-journey-deep transition-all duration-300 hover:border-intention-blue hover:bg-intention-blue hover:text-surface-light active:border-intention-blue active:bg-intention-blue active:text-surface-light active:scale-95 cursor-pointer"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <!-- Clickable Pagination Dots + Editorial Counter -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5" role="tablist" aria-label="Choose featured story">
          <button
            v-for="(slide, dotIdx) in items"
            :key="`dot-${slide.id}`"
            type="button"
            role="tab"
            :aria-selected="currentIndex === dotIdx"
            :aria-label="`Go to featured story ${dotIdx + 1}: ${slide.title}`"
            @click="goToSlide(dotIdx)"
            class="h-2 rounded-full transition-all duration-300 cursor-pointer"
            :class="
              currentIndex === dotIdx
                ? 'w-6 bg-dark-gold'
                : 'w-2 bg-journey-deep/22 hover:bg-action-blue/65'
            "
          />
        </div>

        <span class="w-4 h-px bg-journey-deep/20" aria-hidden="true" />

        <span class="card-tag font-semibold text-journey-deep/80 tracking-[0.22em] tabular-nums pt-0.5">
          {{ formattedIndex }}
        </span>
      </div>

      <!-- Next Arrow -->
      <button
        type="button"
        aria-label="Next featured story"
        @click="nextSlide"
        class="w-10 h-10 rounded-full border border-journey-deep/25 bg-surface-light/80 flex items-center justify-center text-journey-deep transition-all duration-300 hover:border-intention-blue hover:bg-intention-blue hover:text-surface-light active:border-intention-blue active:bg-intention-blue active:text-surface-light active:scale-95 cursor-pointer"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>
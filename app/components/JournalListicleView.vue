<!-- ~/app/components/JournalListicleView.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useHead, useSeoMeta, useState } from '#imports'
import { useHeaderTheme } from '~/composables/useHeaderTheme'
import JournalRichText from '~/components/journal/JournalRichText.vue'
import { stripJournalHtml } from '~/components/journal/JournalMediaHeader.vue'
import type {
  JournalFullRecord,
  JournalListicleSlide,
  JournalMeta
} from '~~/server/utils/journalData'

const props = defineProps<{
  record: JournalFullRecord
  related: JournalMeta[]
}>()

// 1. Instant SSR + Client Dark Header Theme Sync (Zero Light-Header Flash)
const { backgroundTheme, forceTransparent, detectSectionUnderHeader } = useHeaderTheme()
backgroundTheme.value = 'dark'
forceTransparent.value = false

// 2. Normalized Cover, Slides & Related Data
const listicleData = computed(() => props.record.listicle)

const coverImage = computed(
  () => listicleData.value?.cover?.image || props.record.meta.image
)
const coverAlt = computed(
  () =>
    listicleData.value?.cover?.alt ||
    props.record.meta.alt ||
    stripJournalHtml(props.record.meta.title)
)
const coverEyebrow = computed(() => {
  if (listicleData.value?.cover?.eyebrow?.trim()) {
    return listicleData.value.cover.eyebrow.trim()
  }
  const typeLabel = props.record.meta.contentTypeLabel || 'INSIGHT'
  const subLabel = props.record.meta.subcategoryLabel || 'LIVING HERITAGE'
  return `${typeLabel} · ${subLabel}`
})
const coverTitle = computed(
  () => listicleData.value?.cover?.title?.trim() || props.record.meta.title
)

const slides = computed<JournalListicleSlide[]>(
  () => listicleData.value?.slides || []
)
const displayedRelated = computed<JournalMeta[]>(() =>
  (props.related || []).slice(0, 3)
)

const autoplayMs = computed(() => {
  const raw = listicleData.value?.autoplayInterval
  return typeof raw === 'number' && raw >= 2000 ? raw : 5000
})

// Deterministic UTC date formatting (prevents SSR/client timezone hydration mismatch)
const formatEditorialDate = (isoDate?: string): string => {
  if (!isoDate) return ''
  const parsed = new Date(
    isoDate.includes('T') ? isoDate : `${isoDate}T00:00:00Z`
  )
  if (Number.isNaN(parsed.getTime())) return isoDate
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}

const formattedPublishDate = computed(() =>
  formatEditorialDate(props.record.meta.publishDate)
)

const normalizeTag = (tag?: string): string => {
  if (!tag) return ''
  const clean = tag.trim()
  return clean.startsWith('#') ? clean : `#${clean}`
}

const normalizedTags = computed<string[]>(() =>
  (props.record.meta.tags || []).map(normalizeTag).filter(Boolean)
)

const formatSlideNumber = (num: number): string =>
  String(num).padStart(2, '0')

// 3. LCP Preload + SEO Meta
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: coverImage.value,
      fetchpriority: 'high'
    }
  ]
})

useSeoMeta({
  title: `${stripJournalHtml(props.record.meta.title)} | Journal`,
  description: props.record.meta.excerpt,
  ogType: 'article',
  ogTitle: stripJournalHtml(props.record.meta.title),
  ogDescription: props.record.meta.excerpt,
  ogImage: props.record.meta.image
})

// 4. Story Deck State & Off-Thread Progress Mechanics
const currentSlide = ref(0)
const progressResetKey = ref(0)
const finalSlideCompleted = ref(false)

const isHolding = ref(false)
const isManuallyPaused = ref(false)
const isTabHidden = ref(false)
const prefersReducedMotion = ref(false)
const globalMenuOpen = useState<boolean>('isMenuOpen', () => false)

const totalSlides = computed(() => 1 + slides.value.length + 1)
const isTitleSlide = computed(() => currentSlide.value === 0)
const isContentSlide = computed(
  () => currentSlide.value > 0 && currentSlide.value <= slides.value.length
)
const isRelatedSlide = computed(
  () => currentSlide.value === totalSlides.value - 1
)

const activeSlideIndex = computed(() => currentSlide.value - 1)
const activeSlide = computed<JournalListicleSlide | null>(() =>
  isContentSlide.value ? slides.value[activeSlideIndex.value] || null : null
)

const isEffectivelyPaused = computed(
  () =>
    isHolding.value ||
    isManuallyPaused.value ||
    isTabHidden.value ||
    prefersReducedMotion.value ||
    globalMenuOpen.value
)

const statusBadgeLabel = computed(() => {
  if (isTitleSlide.value) return 'COVER'
  if (isRelatedSlide.value) return 'EXPLORE'
  return `${formatSlideNumber(currentSlide.value)} / ${formatSlideNumber(slides.value.length)}`
})

const goToSlide = (targetIndex: number) => {
  const clamped = Math.max(0, Math.min(totalSlides.value - 1, targetIndex))
  finalSlideCompleted.value = false
  currentSlide.value = clamped
  progressResetKey.value++
}

const nextSlide = () => {
  if (currentSlide.value < totalSlides.value - 1) {
    goToSlide(currentSlide.value + 1)
  } else {
    finalSlideCompleted.value = true
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    goToSlide(currentSlide.value - 1)
  } else {
    goToSlide(0)
  }
}

const onActiveBarComplete = () => {
  if (currentSlide.value < totalSlides.value - 1) {
    nextSlide()
  } else {
    finalSlideCompleted.value = true
  }
}

const toggleManualPause = () => {
  isManuallyPaused.value = !isManuallyPaused.value
}

// 5. Silent Next-Slide Image Preloader (Zero Black Flash on Tap)
const preloadImageUrl = (src?: string) => {
  if (!import.meta.client || !src) return
  const img = new Image()
  img.decoding = 'async'
  img.src = src
}

watch(
  currentSlide,
  (idx) => {
    if (!import.meta.client) return
    const nextContentSlide = slides.value[idx]
    if (nextContentSlide?.image) {
      preloadImageUrl(nextContentSlide.image)
    }
    if (idx === slides.value.length - 1) {
      displayedRelated.value.forEach((item) => preloadImageUrl(item.image))
    }
  },
  { immediate: true }
)

// 6. Pointer Hold & Directional Swipe Gestures (Guards Vertical Scroll Deltas)
let touchStartX = 0
let touchStartY = 0

const onStagePointerDown = (e: PointerEvent) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  isHolding.value = true
}

const onStagePointerRelease = () => {
  isHolding.value = false
}

const onTouchStart = (e: TouchEvent) => {
  isHolding.value = true
  const touch = e.changedTouches[0]
  if (!touch) return
  touchStartX = touch.screenX
  touchStartY = touch.screenY
}

const onTouchEnd = (e: TouchEvent) => {
  isHolding.value = false
  const touch = e.changedTouches[0]
  if (!touch) return

  const dx = touch.screenX - touchStartX
  const dy = touch.screenY - touchStartY

  if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
    if (dx < 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
}

// 7. Keyboard & Tab Visibility Listeners
const onKeydown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement | null
  if (
    target &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable)
  ) {
    return
  }

  if (e.key === 'ArrowRight') {
    e.preventDefault()
    nextSlide()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prevSlide()
  } else if (e.key === ' ' && target?.tagName !== 'BUTTON' && target?.tagName !== 'A') {
    e.preventDefault()
    toggleManualPause()
  }
}

const onVisibilityChange = () => {
  if (!import.meta.client) return
  isTabHidden.value = document.hidden
}

// 8. Share Actions (Zero External Icon Library Overhead)
const copied = ref(false)
let copyResetTimer: ReturnType<typeof setTimeout> | null = null

const getCurrentUrl = (): string =>
  import.meta.client ? window.location.href : ''

const copyLink = async () => {
  const url = getCurrentUrl()
  if (!url || !navigator?.clipboard) return
  try {
    await navigator.clipboard.writeText(url)
    copied.value = true
    if (copyResetTimer) clearTimeout(copyResetTimer)
    copyResetTimer = setTimeout(() => {
      copied.value = false
    }, 2200)
  } catch (err) {
    console.error('[JournalListicleView] Failed to copy link:', err)
  }
}

const shareOnWhatsApp = () => {
  const url = getCurrentUrl()
  if (!url) return
  const shareText = `${stripJournalHtml(props.record.meta.title)} — ${url}`
  window.open(
    `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    '_blank',
    'noopener,noreferrer'
  )
}

const triggerNativeShare = async () => {
  const url = getCurrentUrl()
  if (!url) return
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: stripJournalHtml(props.record.meta.title),
        text: props.record.meta.excerpt,
        url
      })
      return
    } catch {
      // User dismissed native share sheet
      return
    }
  }
  await copyLink()
}

onMounted(() => {
  detectSectionUnderHeader()
  prefersReducedMotion.value = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  const firstContent = slides.value[0]?.image
  if (firstContent) preloadImageUrl(firstContent)

  window.addEventListener('keydown', onKeydown)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (copyResetTimer) clearTimeout(copyResetTimer)
  if (import.meta.client) {
    requestAnimationFrame(detectSectionUnderHeader)
  }
})
</script>

<template>
  <section
    data-theme="dark"
    aria-label="Visual Journal Story"
    class="listicle-viewport relative w-full min-h-dvh bg-journey-deep flex items-center justify-center pt-22 sm:pt-25 pb-5 sm:pb-8 px-3 sm:px-6 overflow-hidden select-none"
  >
    <!-- Pure-CSS Ambient Gallery Glow (Zero Extra Image Requests or GPU Blur Paint) -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 listicle-ambient-backdrop"
    />

    <!-- Stage + Desktop Flanking Arrows Wrapper -->
    <div class="relative z-10 flex items-center justify-center gap-5 lg:gap-7 max-w-full">
      <!-- Desktop Previous Slide Pill -->
      <button
        type="button"
        aria-label="Previous story slide"
        :disabled="currentSlide === 0"
        class="hidden md:flex w-11 h-11 rounded-full border border-white/15 bg-white/6 text-white/80 hover:bg-white/14 hover:text-white hover:border-intention-gold/45 disabled:opacity-25 disabled:pointer-events-none transition-all duration-300 items-center justify-center cursor-pointer shrink-0"
        @click="prevSlide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4.5 h-4.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- ============================================================
           2:3 ASPECT RATIO STORY STAGE (Isolated Local Z-Index Stack)
           ============================================================ -->
      <div
        class="listicle-stage relative isolate aspect-2/3 rounded-2xl sm:rounded-4xl overflow-hidden bg-black border border-white/12 shadow-2xl"
        @pointerdown="onStagePointerDown"
        @pointerup="onStagePointerRelease"
        @pointercancel="onStagePointerRelease"
        @pointerleave="onStagePointerRelease"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <!-- LAYER z-0: BACKGROUND PHOTOGRAPHY (No initial appear fade for instant LCP) -->
        <Transition name="listicle-media">
          <img
            v-if="isTitleSlide"
            key="media-cover"
            :src="coverImage"
            :alt="coverAlt"
            width="600"
            height="900"
            fetchpriority="high"
            loading="eager"
            decoding="sync"
            class="pointer-events-none absolute inset-0 z-0 w-full h-full object-cover object-center"
          />

          <img
            v-else-if="isContentSlide && activeSlide"
            :key="`media-slide-${currentSlide}`"
            :src="activeSlide.image"
            :alt="activeSlide.alt || stripJournalHtml(activeSlide.title)"
            width="600"
            height="900"
            loading="eager"
            decoding="async"
            class="pointer-events-none absolute inset-0 z-0 w-full h-full object-cover object-center"
          />

          <img
            v-else
            key="media-related"
            :src="coverImage"
            :alt="coverAlt"
            width="600"
            height="900"
            loading="lazy"
            decoding="async"
            class="pointer-events-none absolute inset-0 z-0 w-full h-full object-cover object-center opacity-22 scale-105"
          />
        </Transition>

        <!-- LAYER z-10: EDITORIAL CONTRAST SCRIMS -->
        <div
          aria-hidden="true"
          :class="[
            'pointer-events-none absolute inset-0 z-10 transition-opacity duration-500',
            isRelatedSlide
              ? 'bg-linear-to-t from-journey-deep/98 via-journey-deep/88 to-journey-deep/78'
              : 'bg-linear-to-t from-black/94 via-black/38 to-black/52'
          ]"
        />

        <!-- LAYER z-20: INVISIBLE TAP ZONES (Active on Cover & Content Slides) -->
        <template v-if="!isRelatedSlide">
          <button
            type="button"
            aria-label="Previous slide"
            class="absolute left-0 top-20 bottom-0 w-[36%] z-20 cursor-w-resize bg-transparent focus:outline-none"
            @click="prevSlide"
          />
          <button
            type="button"
            aria-label="Next slide"
            class="absolute right-0 top-20 bottom-0 w-[64%] z-20 cursor-e-resize bg-transparent focus:outline-none"
            @click="nextSlide"
          />
        </template>

        <!-- LAYER z-30: TOP PROGRESS BARS + CHROME -->
        <div class="absolute top-0 inset-x-0 z-30 px-3.5 sm:px-5 pt-3.5 sm:pt-4 flex flex-col gap-2.5">
          <!-- Segmented Off-Thread Progress Bars -->
          <div class="w-full flex items-center gap-1.5" role="tablist" aria-label="Story progress">
            <button
              v-for="idx in totalSlides"
              :key="`dash-${idx}`"
              type="button"
              role="tab"
              :aria-selected="currentSlide === idx - 1"
              :aria-label="`Go to slide ${idx} of ${totalSlides}`"
              class="group flex-1 py-1.5 cursor-pointer focus:outline-none"
              @click.stop="goToSlide(idx - 1)"
            >
              <span class="block w-full h-1 rounded-full bg-white/26 overflow-hidden">
                <!-- Completed Slide -->
                <span
                  v-if="idx - 1 < currentSlide || (idx - 1 === currentSlide && isRelatedSlide && finalSlideCompleted)"
                  class="block w-full h-full bg-intention-gold rounded-full"
                />
                <!-- Currently Active Slide (Compositor scaleX Animation) -->
                <span
                  v-else-if="idx - 1 === currentSlide"
                  :key="`active-bar-${currentSlide}-${progressResetKey}`"
                  class="block w-full h-full bg-intention-gold rounded-full origin-left listicle-progress-fill"
                  :style="{
                    animationDuration: `${autoplayMs}ms`,
                    animationPlayState: isEffectivelyPaused ? 'paused' : 'running'
                  }"
                  @animationend="onActiveBarComplete"
                />
              </span>
            </button>
          </div>

          <!-- Top Navigation Row: Back to Journal + Status & Pause Toggle -->
          <div class="w-full flex items-center justify-between">
            <NuxtLink
              to="/journal"
              aria-label="Back to Journal"
              class="inline-flex items-center gap-1.5 py-1 px-1.5 -ml-1.5 rounded-lg text-white/80 hover:text-intention-gold transition-colors"
              @click.stop
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-3.5 h-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              <span class="text-[10px] uppercase font-semibold tracking-[0.24em]">
                Journal
              </span>
            </NuxtLink>

            <div class="flex items-center gap-2">
              <span class="text-[10px] uppercase font-medium tracking-[0.22em] text-white/70 tabular-nums">
                {{ statusBadgeLabel }}
              </span>

              <button
                type="button"
                :aria-label="isManuallyPaused ? 'Resume story autoplay' : 'Pause story autoplay'"
                class="w-7 h-7 rounded-full bg-black/35 border border-white/16 text-white/85 hover:text-intention-gold hover:border-intention-gold/45 flex items-center justify-center transition-colors cursor-pointer"
                @click.stop="toggleManualPause"
              >
                <!-- Play Icon -->
                <svg
                  v-if="isManuallyPaused"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-3 h-3 translate-x-[0.5px]"
                >
                  <path d="M8 5.5v13l10.5-6.5L8 5.5z" />
                </svg>
                <!-- Pause Icon -->
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-3 h-3"
                >
                  <rect x="6.5" y="5.5" width="3.5" height="13" rx="0.8" />
                  <rect x="14" y="5.5" width="3.5" height="13" rx="0.8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- LAYER z-30: SLIDE EDITORIAL CONTENT -->
        <div class="pointer-events-none absolute inset-x-0 bottom-0 top-22 z-30 flex flex-col justify-end p-5 sm:p-7">
          <Transition name="listicle-copy" mode="out-in">
            <!-- 1. COVER SLIDE (Single section-title-sans + Category/Subcategory Eyebrow) -->
            <div
              v-if="isTitleSlide"
              key="copy-cover"
              class="w-full flex flex-col items-start text-left"
            >
              <div class="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-[10px] sm:text-[11px] tracking-[0.24em] text-white/75 uppercase font-medium mb-3">
                <span v-if="formattedPublishDate">{{ formattedPublishDate }}</span>
                <span v-if="formattedPublishDate && record.meta.readTime" aria-hidden="true" class="text-white/35">·</span>
                <span v-if="record.meta.readTime">{{ record.meta.readTime }}</span>
              </div>

              <div
                v-if="normalizedTags.length > 0"
                class="flex items-center flex-wrap gap-1.5 mb-4"
              >
                <span
                  v-for="tag in normalizedTags"
                  :key="tag"
                  class="text-[9.5px] bg-white/10 backdrop-blur-xs text-white/92 px-2.5 py-1 rounded-sm uppercase font-medium tracking-[0.18em] border border-white/14"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="flex items-center gap-2.5 mb-2.5">
                <span class="w-7 h-px bg-intention-gold shrink-0" aria-hidden="true" />
                <span class="text-[10px] sm:text-[11px] tracking-[0.24em] text-intention-gold uppercase font-semibold">
                  {{ coverEyebrow }}
                </span>
              </div>

              <h2 class="section-title-sans capitalize text-white! leading-[1.12] tracking-tight drop-shadow-xs">
                <JournalRichText :content="coverTitle" tag="span" />
              </h2>
            </div>

            <!-- 2. CONTENT SLIDES (Auto-Indexed 01 / N + Title + Rich Text) -->
            <div
              v-else-if="isContentSlide && activeSlide"
              :key="`copy-slide-${currentSlide}`"
              class="w-full flex flex-col items-start text-left"
            >
              <div class="w-full flex items-baseline justify-between gap-3 mb-3">
                <div class="tabular-nums leading-none">
                  <span class="text-4xl sm:text-5xl font-light text-intention-gold">
                    {{ formatSlideNumber(currentSlide) }}
                  </span>
                  <span class="text-lg sm:text-xl font-light text-white/45 ml-1">
                    /{{ formatSlideNumber(slides.length) }}
                  </span>
                </div>

                <span
                  v-if="activeSlide.eyebrow"
                  class="text-[9.5px] sm:text-[10px] uppercase tracking-[0.22em] text-intention-gold/95 font-medium text-right"
                >
                  {{ activeSlide.eyebrow }}
                </span>
              </div>

              <h2 class="section-smaller-subtitle text-white! font-medium leading-snug mb-2.5 sm:mb-3 drop-shadow-xs">
                <JournalRichText :content="activeSlide.title" tag="span" />
              </h2>

              <JournalRichText
                tag="p"
                :content="activeSlide.text"
                class="section-subparagraph sm:section-paragraph text-white/88! leading-relaxed [&_a]:pointer-events-auto [&_a]:text-intention-gold [&_a]:underline"
              />

              <NuxtLink
                v-if="activeSlide.to"
                :to="activeSlide.to"
                class="pointer-events-auto mt-4 inline-flex items-center gap-2 text-[10.5px] uppercase tracking-[0.22em] font-semibold text-intention-gold hover:text-white transition-colors"
                @click.stop
              >
                <span>{{ activeSlide.ctaLabel || 'Explore Route' }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </NuxtLink>
            </div>

            <!-- 3. FINAL RELATED SLIDE (3 Journal Cards + Share Story Bar) -->
            <div
              v-else
              key="copy-related"
              class="pointer-events-auto w-full flex flex-col items-start justify-end text-left"
            >
              <div class="flex items-center gap-2.5 mb-1.5">
                <span class="w-7 h-px bg-white/30 shrink-0" aria-hidden="true" />
                <span class="text-[10px] tracking-[0.26em] text-white/70 uppercase font-medium">
                  Continue Reading
                </span>
              </div>

              <h2 class="section-title-sans capitalize text-intention-gold! leading-tight mb-4 sm:mb-5">
                Keep Exploring
              </h2>

              <!-- 3 Auto-Wired Related Journal Cards -->
              <div v-if="displayedRelated.length > 0" class="flex flex-col gap-2.5 sm:gap-3 w-full">
                <NuxtLink
                  v-for="post in displayedRelated"
                  :key="post.id"
                  :to="`/journal/${post.slug}`"
                  class="group flex items-center gap-3.5 bg-white/6 hover:bg-white/12 p-2.5 sm:p-3 rounded-2xl border border-white/12 hover:border-intention-gold/45 transition-all duration-300"
                  @click.stop
                >
                  <img
                    :src="post.image"
                    :alt="post.alt || stripJournalHtml(post.title)"
                    width="144"
                    height="144"
                    loading="lazy"
                    decoding="async"
                    class="w-15 h-15 sm:w-17 sm:h-17 rounded-xl object-cover shrink-0 bg-journey-deep border border-white/10"
                  />

                  <div class="flex flex-col justify-center min-w-0 flex-1">
                    <span class="text-[9px] tracking-[0.2em] text-intention-gold uppercase font-semibold mb-1 truncate">
                      {{ post.categoryLabel || `${post.contentTypeLabel} · ${post.subcategoryLabel}` }}
                    </span>

                    <h3 class="text-xs sm:text-sm font-medium text-white leading-snug line-clamp-2 mb-1 group-hover:text-intention-gold transition-colors">
                      {{ stripJournalHtml(post.title) }}
                    </h3>

                    <div class="flex items-center gap-2 text-[9px] text-white/50 uppercase tracking-[0.16em]">
                      <span>{{ post.readTime }}</span>
                      <span v-if="post.tags?.[0]" aria-hidden="true">·</span>
                      <span v-if="post.tags?.[0]" class="truncate">{{ normalizeTag(post.tags[0]) }}</span>
                    </div>
                  </div>
                </NuxtLink>
              </div>

              <!-- Fallback Card If Fewer Posts Exist in Dev -->
              <NuxtLink
                v-else
                to="/journal"
                class="w-full flex items-center justify-between p-4 rounded-2xl bg-white/6 hover:bg-white/12 border border-white/12 transition-colors"
                @click.stop
              >
                <span class="text-sm font-medium text-white">Browse All Journal Stories</span>
                <span class="text-xs text-intention-gold uppercase tracking-widest">View →</span>
              </NuxtLink>

              <!-- Share Story Bar -->
              <div class="mt-5 sm:mt-6 pt-4 sm:pt-5 w-full flex items-center justify-between border-t border-white/12">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Replay story from start"
                    class="text-[10px] tracking-[0.24em] text-white/70 hover:text-intention-gold uppercase font-semibold transition-colors cursor-pointer"
                    @click.stop="goToSlide(0)"
                  >
                    Replay ↺
                  </button>
                  <span class="text-white/25" aria-hidden="true">·</span>
                  <span class="text-[10px] tracking-[0.24em] text-white/70 uppercase font-semibold">
                    Share
                  </span>
                </div>

                <div class="flex items-center gap-2.5">
                  <!-- 1. Copy Link -->
                  <button
                    type="button"
                    :title="copied ? 'Copied!' : 'Copy Link'"
                    :aria-label="copied ? 'Link copied' : 'Copy story link'"
                    class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/20 bg-white/6 text-white hover:bg-white hover:text-journey-deep transition-all duration-300 flex items-center justify-center cursor-pointer"
                    @click.stop="copyLink"
                  >
                    <svg
                      v-if="copied"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      class="w-4 h-4"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <svg
                      v-else
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.9"
                      class="w-4 h-4"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                      />
                    </svg>
                  </button>

                  <!-- 2. WhatsApp -->
                  <button
                    type="button"
                    title="Share on WhatsApp"
                    aria-label="Share story on WhatsApp"
                    class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-whatsapp/35 bg-whatsapp/12 text-whatsapp hover:bg-whatsapp hover:text-journey-deep transition-all duration-300 flex items-center justify-center cursor-pointer"
                    @click.stop="shareOnWhatsApp"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" class="w-4.5 h-4.5">
                      <path
                        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm5.82 14.01c-.24.68-1.41 1.3-1.95 1.38-.5.08-1.13.11-1.83-.11-.42-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.24-5.01-4.44-.15-.2-1.2-1.59-1.2-3.04 0-1.45.76-2.16 1.03-2.45.27-.29.59-.37.79-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.24.59.83 2.03.9 2.18.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.26 1.64 2.04 1.13 1.01 2.08 1.32 2.38 1.47.29.15.46.12.64-.07.17-.2.74-.86.94-1.15.2-.29.39-.24.66-.15.27.1 1.72.81 2.01.96.29.15.49.22.56.34.08.13.08.72-.16 1.4Z"
                      />
                    </svg>
                  </button>

                  <!-- 3. Native Share -->
                  <button
                    type="button"
                    title="Share Story"
                    aria-label="Share story via system share sheet"
                    class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-intention-gold/40 bg-intention-gold/12 text-intention-gold hover:bg-intention-gold hover:text-journey-deep transition-all duration-300 flex items-center justify-center cursor-pointer"
                    @click.stop="triggerNativeShare"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.9"
                      class="w-4 h-4"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Desktop Next Slide Pill -->
      <button
        type="button"
        aria-label="Next story slide"
        :disabled="currentSlide >= totalSlides - 1"
        class="hidden md:flex w-11 h-11 rounded-full border border-white/15 bg-white/6 text-white/80 hover:bg-white/14 hover:text-white hover:border-intention-gold/45 disabled:opacity-25 disabled:pointer-events-none transition-all duration-300 items-center justify-center cursor-pointer shrink-0"
        @click="nextSlide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4.5 h-4.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Accessible & Crawler-Indexable Semantic Story DOM (No aria-hidden) -->
    <article class="sr-only">
      <h1>{{ stripJournalHtml(record.meta.title) }}</h1>
      <p>{{ record.meta.excerpt }}</p>
      <section v-for="(slide, sIdx) in slides" :key="`sr-slide-${sIdx}`">
        <h2>{{ `${formatSlideNumber(sIdx + 1)}. ${stripJournalHtml(slide.title)}` }}</h2>
        <p>{{ stripJournalHtml(slide.text) }}</p>
      </section>
    </article>
  </section>
</template>

<style scoped>
/* Zero-CLS 2:3 Stage Sizing Across Mobile Bars, Short Laptops & Large Monitors */
.listicle-stage {
  width: min(94vw, 500px, calc((100vh - 7.25rem) * 0.6667));
  width: min(94vw, 500px, calc((100dvh - 7.25rem) * 0.6667));
}

@media (min-width: 640px) {
  .listicle-stage {
    width: min(88vw, 510px, calc((100vh - 8.25rem) * 0.6667));
    width: min(88vw, 510px, calc((100dvh - 8.25rem) * 0.6667));
  }
}

.listicle-ambient-backdrop {
  background-image:
    radial-gradient(
      circle at 50% 42%,
      rgba(212, 168, 88, 0.11) 0%,
      rgba(24, 42, 64, 0.22) 44%,
      transparent 76%
    ),
    linear-gradient(180deg, rgba(10, 16, 24, 0.55) 0%, rgba(10, 16, 24, 0.88) 100%);
}

/* Off-Thread GPU Progress Fill */
@keyframes listicle-bar-fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.listicle-progress-fill {
  animation-name: listicle-bar-fill;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  will-change: transform;
}

/* Compositor-Only Media Crossfade */
.listicle-media-enter-active,
.listicle-media-leave-active {
  transition: opacity 0.65s cubic-bezier(0.25, 1, 0.5, 1);
}

.listicle-media-enter-from,
.listicle-media-leave-to {
  opacity: 0;
}

/* Compositor-Only Copy Transition (Zero Blur Filter Repaints) */
.listicle-copy-enter-active,
.listicle-copy-leave-active {
  transition:
    opacity 0.34s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.34s cubic-bezier(0.25, 1, 0.5, 1);
}

.listicle-copy-enter-from {
  opacity: 0;
  transform: translate3d(0, 10px, 0);
}

.listicle-copy-leave-to {
  opacity: 0;
  transform: translate3d(0, -6px, 0);
}
</style>
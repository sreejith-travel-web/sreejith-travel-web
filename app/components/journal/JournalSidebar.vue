<!-- ~/app/components/journal/JournalSidebar.vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'

export interface JournalTocItem {
  id: string
  text: string
}

// Centralized timing, easing & scroll-handoff constants for effortless tuning
const SIDEBAR_MOTION = {
  glideDurationMs: 250,
  progressDurationMs: 320,
  easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
  railInsetPx: 6,
  baseUnitHeightPx: 40,
  autoFollowEdgePadPx: 26,
  manualScrollCooldownMs: 900,
  clickLockWindowMs: 680,
  boundaryTolerancePx: 2,
  copyFeedbackMs: 1600
} as const

const props = withDefaults(
  defineProps<{
    toc: JournalTocItem[]
    activeId: string
    title: string
    excerpt?: string
    mode?: 'desktop' | 'mobile'
  }>(),
  {
    excerpt: '',
    mode: 'desktop'
  }
)

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

const isCopied = ref(false)
const isMobileOpen = ref(false)
const mobileBarRef = ref<HTMLElement | null>(null)

// Unified Scroll & Indicator Refs (Strictly 1 active mode per instance)
const tocScrollRef = ref<HTMLElement | null>(null)
const tocNavRef = ref<HTMLElement | null>(null)
const itemButtonRefs = ref<(HTMLElement | null)[]>([])

const canScrollUp = ref(false)
const canScrollDown = ref(false)
const isIndicatorReady = ref(false)
const suppressTransition = ref(true)

const pillTranslateY = ref(0)
const pillScaleY = ref(1)
const railTranslateY = ref(0)
const railScaleY = ref(0.6)

// Prevents intermediate scroll-spy chatter when clicking straight to a distant heading
const optimisticTargetId = ref<string | null>(null)
const isUserScrollingToc = ref(false)

let copyTimeoutId: ReturnType<typeof setTimeout> | null = null
let optimisticTimeoutId: ReturnType<typeof setTimeout> | null = null
let manualScrollTimeoutId: ReturnType<typeof setTimeout> | null = null
let tocResizeObserver: ResizeObserver | null = null
let tocTouchStartY = 0

const effectiveActiveId = computed(() => optimisticTargetId.value || props.activeId)

const activeIndex = computed(() => {
  if (!props.toc.length) return 0
  const idx = props.toc.findIndex((item) => item.id === effectiveActiveId.value)
  return idx > -1 ? idx : 0
})

const progressRatio = computed(() => {
  if (!props.toc.length) return 0
  return Math.min(1, Math.max(0, (activeIndex.value + 1) / props.toc.length))
})

const formattedProgress = computed(() => {
  if (!props.toc.length) return '00 / 00'
  const current = String(activeIndex.value + 1).padStart(2, '0')
  const total = String(props.toc.length).padStart(2, '0')
  return `${current} / ${total}`
})

const pillTransformStyle = computed(() => ({
  transform: `translate3d(0, ${pillTranslateY.value}px, 0) scaleY(${pillScaleY.value})`,
  transitionProperty: suppressTransition.value ? 'none' : 'transform, opacity',
  transitionDuration: `${SIDEBAR_MOTION.glideDurationMs}ms`,
  transitionTimingFunction: SIDEBAR_MOTION.easing
}))

const railTransformStyle = computed(() => ({
  transform: `translate3d(0, ${railTranslateY.value}px, 0) scaleY(${railScaleY.value})`,
  transitionProperty: suppressTransition.value ? 'none' : 'transform, opacity',
  transitionDuration: `${SIDEBAR_MOTION.glideDurationMs}ms`,
  transitionTimingFunction: SIDEBAR_MOTION.easing
}))

const progressBarStyle = computed(() => ({
  transform: `scaleX(${progressRatio.value})`,
  transitionDuration: `${SIDEBAR_MOTION.progressDurationMs}ms`,
  transitionTimingFunction: SIDEBAR_MOTION.easing
}))

const setItemRef = (el: HTMLElement | null, idx: number) => {
  itemButtonRefs.value[idx] = el
}

// =========================================================
// FADE MASKS, GPU INDICATOR GEOMETRY & AUTO-FOLLOW
// =========================================================
const updateTocScrollMasks = () => {
  const el = tocScrollRef.value
  if (!el) {
    canScrollUp.value = false
    canScrollDown.value = false
    return
  }
  const { scrollTop, scrollHeight, clientHeight } = el
  canScrollUp.value = scrollTop > 3
  canScrollDown.value = scrollTop + clientHeight < scrollHeight - 3
}

const syncActiveIndicator = (instant = false) => {
  const btn = itemButtonRefs.value[activeIndex.value]
  if (!btn || !props.toc.length) {
    isIndicatorReady.value = false
    return
  }

  if (instant) {
    suppressTransition.value = true
  }

  const top = btn.offsetTop
  const height = Math.max(24, btn.offsetHeight)
  const inset = SIDEBAR_MOTION.railInsetPx
  const railHeight = Math.max(12, height - inset * 2)

  pillTranslateY.value = top
  pillScaleY.value = height / SIDEBAR_MOTION.baseUnitHeightPx
  railTranslateY.value = top + inset
  railScaleY.value = railHeight / SIDEBAR_MOTION.baseUnitHeightPx
  isIndicatorReady.value = true

  if (instant && import.meta.client) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        suppressTransition.value = false
      })
    })
  }
}

const keepActiveItemInView = (behavior: ScrollBehavior = 'smooth') => {
  if (isUserScrollingToc.value && behavior === 'smooth') return
  const container = tocScrollRef.value
  const btn = itemButtonRefs.value[activeIndex.value]
  if (!container || !btn) return

  const { scrollTop, scrollHeight, clientHeight } = container
  if (scrollHeight <= clientHeight + SIDEBAR_MOTION.boundaryTolerancePx) return

  const pad = SIDEBAR_MOTION.autoFollowEdgePadPx
  const itemTop = btn.offsetTop
  const itemBottom = itemTop + btn.offsetHeight

  if (itemTop < scrollTop + pad) {
    container.scrollTo({
      top: Math.max(0, itemTop - pad),
      behavior
    })
  } else if (itemBottom > scrollTop + clientHeight - pad) {
    container.scrollTo({
      top: Math.min(scrollHeight - clientHeight, itemBottom - clientHeight + pad),
      behavior
    })
  }
}

const markManualTocScroll = () => {
  isUserScrollingToc.value = true
  if (manualScrollTimeoutId) clearTimeout(manualScrollTimeoutId)
  manualScrollTimeoutId = setTimeout(() => {
    isUserScrollingToc.value = false
  }, SIDEBAR_MOTION.manualScrollCooldownMs)
}

// =========================================================
// SUBPIXEL-SAFE SIDEBAR BOUNDARY HANDOFF TO LENIS
// =========================================================
const canTocScrollInDirection = (el: HTMLElement, deltaY: number): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = el
  const tol = SIDEBAR_MOTION.boundaryTolerancePx
  if (scrollHeight <= clientHeight + tol) return false
  if (deltaY > 0) return scrollTop + clientHeight < scrollHeight - tol
  if (deltaY < 0) return scrollTop > tol
  return false
}

const onDesktopTocWheel = (e: WheelEvent) => {
  const el = e.currentTarget as HTMLElement | null
  if (!el) return
  markManualTocScroll()
  if (canTocScrollInDirection(el, e.deltaY)) {
    e.stopPropagation()
  }
}

const onTocTouchStart = (e: TouchEvent) => {
  tocTouchStartY = e.touches[0]?.clientY ?? 0
}

const onDesktopTocTouchMove = (e: TouchEvent) => {
  const el = e.currentTarget as HTMLElement | null
  if (!el || !e.touches[0]) return
  markManualTocScroll()
  const deltaY = tocTouchStartY - e.touches[0].clientY
  if (canTocScrollInDirection(el, deltaY)) {
    e.stopPropagation()
  }
}

// Mobile open popover contains scroll completely so underlying article never drifts
const onMobilePopoverWheel = (e: WheelEvent) => {
  markManualTocScroll()
  e.stopPropagation()
}

const onMobilePopoverTouchMove = (e: TouchEvent) => {
  markManualTocScroll()
  e.stopPropagation()
}

const attachResizeObservers = () => {
  if (!tocResizeObserver) return
  tocResizeObserver.disconnect()
  if (tocScrollRef.value) tocResizeObserver.observe(tocScrollRef.value)
  if (tocNavRef.value) tocResizeObserver.observe(tocNavRef.value)
}

// =========================================================
// SHARE & SECTION SELECTION ACTIONS
// =========================================================
const getCurrentUrl = (): string => {
  if (!import.meta.client) return ''
  return window.location.href
}

const handleCopyLink = async () => {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(getCurrentUrl())
    isCopied.value = true
    if (copyTimeoutId) clearTimeout(copyTimeoutId)
    copyTimeoutId = setTimeout(() => {
      isCopied.value = false
    }, SIDEBAR_MOTION.copyFeedbackMs)
  } catch (err) {
    console.error('[JournalSidebar] Failed to copy link:', err)
  }
}

const handleWhatsAppShare = () => {
  if (!import.meta.client) return
  const url = getCurrentUrl()
  const message = `${props.title} — ${url}`
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(waUrl, '_blank', 'noopener,noreferrer')
}

const handleNativeShare = async () => {
  if (!import.meta.client) return
  const url = getCurrentUrl()
  if (navigator.share) {
    try {
      await navigator.share({
        title: props.title,
        text: props.excerpt || props.title,
        url
      })
      return
    } catch (err) {
      if ((err as Error)?.name === 'AbortError') return
    }
  }
  await handleCopyLink()
}

const handleSelectSection = (id: string) => {
  optimisticTargetId.value = id
  if (optimisticTimeoutId) clearTimeout(optimisticTimeoutId)
  optimisticTimeoutId = setTimeout(() => {
    optimisticTargetId.value = null
  }, SIDEBAR_MOTION.clickLockWindowMs)

  isMobileOpen.value = false
  emit('select', id)
}

const handleOutsideClick = (e: MouseEvent) => {
  if (!isMobileOpen.value || !mobileBarRef.value) return
  const target = e.target as Node | null
  if (target && !mobileBarRef.value.contains(target)) {
    isMobileOpen.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMobileOpen.value) {
    isMobileOpen.value = false
  }
}

// Sync when scroll-spy reaches target or steps between sections
watch(
  () => props.activeId,
  (newId) => {
    if (optimisticTargetId.value && newId === optimisticTargetId.value) {
      optimisticTargetId.value = null
      if (optimisticTimeoutId) clearTimeout(optimisticTimeoutId)
    }
  }
)

watch(activeIndex, () => {
  nextTick(() => {
    syncActiveIndicator(false)
    keepActiveItemInView('smooth')
    updateTocScrollMasks()
  })
})

// Reset cleanly if navigating between related journal articles
watch(
  () => props.toc.map((t) => t.id).join('|'),
  () => {
    itemButtonRefs.value = itemButtonRefs.value.slice(0, props.toc.length)
    optimisticTargetId.value = null
    nextTick(() => {
      if (tocScrollRef.value) tocScrollRef.value.scrollTop = 0
      attachResizeObservers()
      syncActiveIndicator(true)
      updateTocScrollMasks()
    })
  }
)

// Pre-position mobile popover instantaneously on open (no flying-from-top glitch)
watch(isMobileOpen, (open) => {
  if (!open) return
  nextTick(() => {
    attachResizeObservers()
    syncActiveIndicator(true)
    keepActiveItemInView('instant' as ScrollBehavior)
    updateTocScrollMasks()
  })
})

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    tocResizeObserver = new ResizeObserver(() => {
      syncActiveIndicator(true)
      updateTocScrollMasks()
    })
  }

  if (props.mode === 'mobile') {
    document.addEventListener('pointerdown', handleOutsideClick)
    document.addEventListener('keydown', handleKeydown)
  } else {
    nextTick(() => {
      attachResizeObservers()
      syncActiveIndicator(true)
      updateTocScrollMasks()
    })
  }
})

onBeforeUnmount(() => {
  if (copyTimeoutId) clearTimeout(copyTimeoutId)
  if (optimisticTimeoutId) clearTimeout(optimisticTimeoutId)
  if (manualScrollTimeoutId) clearTimeout(manualScrollTimeoutId)
  if (tocResizeObserver) {
    tocResizeObserver.disconnect()
    tocResizeObserver = null
  }
  if (props.mode === 'mobile') {
    document.removeEventListener('pointerdown', handleOutsideClick)
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <!-- ==========================================
       MODE A: MOBILE & TABLET STICKY BAR + POPOVER (< 1024px)
       ========================================== -->
  <div
    v-if="mode === 'mobile'"
    ref="mobileBarRef"
    v-motion-fade-up
    :delay="400"
    class="sticky top-16 sm:top-18 md:top-20 z-30 w-full mb-8 lg:hidden"
  >
    <div class="relative w-full">
      <!-- Sticky Control Bar -->
      <div class="w-full rounded-2xl bg-surface-light/95 backdrop-blur-md border border-journey-deep/15 shadow-xs px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <!-- Left Toggle Button: IN THIS STORY + Live Progress -->
        <button
          type="button"
          :aria-expanded="isMobileOpen"
          aria-label="Toggle table of contents"
          class="inline-flex items-center gap-2 py-1 text-left cursor-pointer group min-w-0"
          @click="isMobileOpen = !isMobileOpen"
        >
          <svg
            class="w-4 h-4 text-dark-gold group-hover:text-action-blue group-active:text-action-blue transition-colors shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>

          <span class="card-eyebrow mb-0! text-journey-deep font-semibold tracking-[0.13em] truncate">
            IN THIS STORY
          </span>

          <span
            v-if="toc.length > 0"
            class="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full bg-journey-deep/6 text-journey-deep/75 card-tag font-semibold tabular-nums shrink-0"
          >
            {{ formattedProgress }}
          </span>

          <svg
            class="w-3.5 h-3.5 text-journey-deep/65 transition-transform duration-300 ease-editorial shrink-0"
            :class="isMobileOpen ? 'rotate-180 text-action-blue' : ''"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <!-- Right 3 Rounded Share Buttons (Micro-Phone Safe Sizing) -->
        <div class="flex items-center gap-1.5 sm:gap-2 pl-2.5 sm:pl-3 border-l border-journey-deep/12 shrink-0">
          <!-- 1. Copy Link -->
          <button
            type="button"
            :aria-label="isCopied ? 'Link copied' : 'Copy story link'"
            class="w-8 h-8 sm:w-9 sm:h-9 journal-share-btn"
            :class="
              isCopied
                ? 'bg-action-blue/12 border-action-blue text-action-blue'
                : 'bg-bg-light/75 border-journey-deep/15 text-journey-deep/85 hover:border-action-blue hover:text-action-blue active:border-action-blue active:text-action-blue'
            "
            @click="handleCopyLink"
          >
            <svg
              v-if="isCopied"
              class="w-3.5 h-3.5 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg
              v-else
              class="w-3.5 h-3.5 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </button>

          <!-- 2. WhatsApp Share -->
          <button
            type="button"
            aria-label="Share on WhatsApp"
            class="w-8 h-8 sm:w-9 sm:h-9 journal-share-btn bg-whatsapp/12 border-whatsapp/35 text-[#128C7E] hover:bg-whatsapp/22 active:bg-whatsapp/25"
            @click="handleWhatsAppShare"
          >
            <svg
              class="w-3.5 h-3.5 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
              <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
            </svg>
          </button>

          <!-- 3. Native Share -->
          <button
            type="button"
            aria-label="Share story"
            class="w-8 h-8 sm:w-9 sm:h-9 journal-share-btn bg-bg-light/75 border-journey-deep/15 text-journey-deep/85 hover:border-action-blue hover:text-action-blue active:border-action-blue active:text-action-blue"
            @click="handleNativeShare"
          >
            <svg
              class="w-3.5 h-3.5 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.9"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
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

      <!-- Expandable Mobile Contents Popover (Scroll-Capped + Fade Masks + Gliding Spine) -->
      <Transition
        enter-active-class="transition duration-220 ease-editorial"
        enter-from-class="opacity-0 -translate-y-2 scale-[0.99]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-160 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-1.5 scale-[0.99]"
      >
        <div
          v-if="isMobileOpen && toc.length > 0"
          data-lenis-prevent
          class="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 rounded-2xl bg-surface-light border border-journey-deep/15 shadow-lg p-4 sm:p-5 flex flex-col gap-3"
        >
          <div class="flex items-center justify-between shrink-0">
            <span class="card-eyebrow mb-0! text-journey-deep font-semibold tracking-[0.15em]">
              IN THIS STORY
            </span>
            <span class="card-tag font-semibold text-journey-deep/65 tabular-nums">
              {{ formattedProgress }}
            </span>
          </div>

          <div class="relative min-h-0">
            <div
              aria-hidden="true"
              :class="['journal-toc-fade-top', canScrollUp ? 'opacity-100' : 'opacity-0']"
            />

            <div
              ref="tocScrollRef"
              class="max-h-[min(58svh,21rem)] overflow-y-auto overscroll-contain pr-1 journal-toc-scroll"
              @scroll.passive="updateTocScrollMasks"
              @wheel.passive="onMobilePopoverWheel"
              @touchstart.passive="onTocTouchStart"
              @touchmove.passive="onMobilePopoverTouchMove"
            >
              <nav
                ref="tocNavRef"
                aria-label="Mobile table of contents"
                class="relative flex flex-col border-l border-journey-deep/14 ml-1"
              >
                <!-- Pure GPU Gliding Highlight Wash + Gold Spine -->
                <span
                  aria-hidden="true"
                  class="journal-toc-pill"
                  :class="isIndicatorReady ? 'opacity-100' : 'opacity-0'"
                  :style="pillTransformStyle"
                />
                <span
                  aria-hidden="true"
                  class="journal-toc-rail"
                  :class="isIndicatorReady ? 'opacity-100' : 'opacity-0'"
                  :style="railTransformStyle"
                />

                <button
                  v-for="(item, idx) in toc"
                  :key="`mob-toc-${item.id}`"
                  :ref="(el) => setItemRef(el as HTMLElement | null, idx)"
                  type="button"
                  class="group relative z-10 flex items-center pl-3.5 pr-2.5 py-2 text-left rounded-r-xl transition-colors duration-250 ease-editorial cursor-pointer"
                  :class="
                    item.id === effectiveActiveId
                      ? 'text-journey-deep'
                      : 'text-secondary-light/90 hover:text-journey-deep active:text-journey-deep hover:bg-journey-deep/3'
                  "
                  @click="handleSelectSection(item.id)"
                >
                  <span
                    class="section-subparagraph font-medium leading-[1.38] text-pretty transition-transform duration-250 ease-editorial"
                    :class="item.id === effectiveActiveId ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'"
                  >
                    {{ item.text }}
                  </span>
                </button>
              </nav>
            </div>

            <div
              aria-hidden="true"
              :class="['journal-toc-fade-bottom', canScrollDown ? 'opacity-100' : 'opacity-0']"
            />
          </div>
        </div>
      </Transition>
    </div>
  </div>

  <!-- ==========================================
       MODE B: DESKTOP STICKY SIDEBAR CARD (lg+)
       ========================================== -->
  <div
    v-else
    v-motion-fade-up
    class="journal-toc-card"
  >
    <!-- 1. SHARE THIS STORY (Pinned Top) -->
    <div class="shrink-0 flex flex-col gap-3 pb-4.5 border-b border-journey-deep/12">
      <div class="flex items-center justify-between gap-2">
        <span class="card-eyebrow mb-0! text-journey-deep font-semibold tracking-[0.15em]">
          SHARE THIS STORY
        </span>
        <span
          v-if="isCopied"
          class="card-tag text-action-blue font-semibold tracking-wider"
        >
          COPIED
        </span>
      </div>

      <div class="flex items-center gap-2.5">
        <!-- 1. Copy Link -->
        <button
          type="button"
          :aria-label="isCopied ? 'Link copied' : 'Copy story link'"
          class="w-10 h-10 xl:w-10.5 xl:h-10.5 journal-share-btn"
          :class="
            isCopied
              ? 'bg-action-blue/12 border-action-blue text-action-blue shadow-2xs'
              : 'bg-bg-light/70 border-journey-deep/15 text-journey-deep/85 hover:border-action-blue hover:text-action-blue active:border-action-blue active:text-action-blue'
          "
          @click="handleCopyLink"
        >
          <svg
            v-if="isCopied"
            class="w-4.5 h-4.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg
            v-else
            class="w-4.5 h-4.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>

        <!-- 2. WhatsApp -->
        <button
          type="button"
          aria-label="Share on WhatsApp"
          class="w-10 h-10 xl:w-10.5 xl:h-10.5 journal-share-btn bg-whatsapp/12 border-whatsapp/35 text-[#128C7E] hover:bg-whatsapp/22 active:bg-whatsapp/25"
          @click="handleWhatsAppShare"
        >
          <svg
            class="w-4.5 h-4.5 xl:w-5 xl:h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
        </button>

        <!-- 3. Native Share -->
        <button
          type="button"
          aria-label="Share story"
          class="w-10 h-10 xl:w-10.5 xl:h-10.5 journal-share-btn bg-bg-light/70 border-journey-deep/15 text-journey-deep/85 hover:border-action-blue hover:text-action-blue active:border-action-blue active:text-action-blue"
          @click="handleNativeShare"
        >
          <svg
            class="w-4.5 h-4.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.9"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
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

    <!-- 2. IN THIS STORY (Flex-Bounded Scroll Stage + Lenis Boundary Handoff) -->
    <div
      v-if="toc.length > 0"
      class="flex-1 min-h-0 flex flex-col gap-3"
    >
      <span class="shrink-0 card-eyebrow mb-0! text-journey-deep font-semibold tracking-[0.15em]">
        IN THIS STORY
      </span>

      <div class="relative flex-1 min-h-28 flex flex-col">
        <!-- Reactive Top Scroll Fade Mask -->
        <div
          aria-hidden="true"
          :class="['journal-toc-fade-top', canScrollUp ? 'opacity-100' : 'opacity-0']"
        />

        <!-- Native Scroll Container with Subpixel Lenis Handoff -->
        <div
          ref="tocScrollRef"
          class="flex-1 min-h-0 overflow-y-auto overscroll-y-auto pr-1.5 journal-toc-scroll"
          @scroll.passive="updateTocScrollMasks"
          @wheel.passive="onDesktopTocWheel"
          @touchstart.passive="onTocTouchStart"
          @touchmove.passive="onDesktopTocTouchMove"
        >
          <nav
            ref="tocNavRef"
            aria-label="Table of contents"
            class="relative flex flex-col border-l border-journey-deep/14 ml-1 py-0.5"
          >
            <!-- Pure GPU Gliding Highlight Wash + 2.5px Gold Spine -->
            <span
              aria-hidden="true"
              class="journal-toc-pill"
              :class="isIndicatorReady ? 'opacity-100' : 'opacity-0'"
              :style="pillTransformStyle"
            />
            <span
              aria-hidden="true"
              class="journal-toc-rail"
              :class="isIndicatorReady ? 'opacity-100' : 'opacity-0'"
              :style="railTransformStyle"
            />

            <button
              v-for="(item, idx) in toc"
              :key="`desk-toc-${item.id}`"
              :ref="(el) => setItemRef(el as HTMLElement | null, idx)"
              type="button"
              class="group relative z-10 flex items-center pl-3.5 pr-2 py-2 text-left rounded-r-xl transition-colors duration-250 ease-editorial cursor-pointer"
              :class="
                item.id === effectiveActiveId
                  ? 'text-journey-deep'
                  : 'text-secondary-light/90 hover:text-journey-deep active:text-journey-deep hover:bg-journey-deep/3'
              "
              @click="handleSelectSection(item.id)"
            >
              <span
                class="section-subparagraph font-medium leading-[1.38] text-pretty transition-transform duration-250 ease-editorial"
                :class="item.id === effectiveActiveId ? 'translate-x-0.5' : 'group-hover:translate-x-0.5'"
              >
                {{ item.text }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Reactive Bottom Scroll Fade Mask -->
        <div
          aria-hidden="true"
          :class="['journal-toc-fade-bottom', canScrollDown ? 'opacity-100' : 'opacity-0']"
        />
      </div>
    </div>

    <!-- 3. PINNED BOTTOM READING PROGRESS & COUNTER -->
    <div
      v-if="toc.length > 0"
      class="shrink-0 pt-3.5 border-t border-journey-deep/12 flex flex-col gap-2"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="card-tag text-muted tracking-[0.14em] font-medium">
          READING PROGRESS
        </span>
        <span class="section-subparagraph font-semibold text-journey-deep/85 tabular-nums tracking-wider">
          {{ formattedProgress }}
        </span>
      </div>

      <!-- Pure GPU scaleX Gold Progress Hairline -->
      <div
        aria-hidden="true"
        class="w-full h-1 rounded-full bg-journey-deep/8 overflow-hidden"
      >
        <div
          class="w-full h-full rounded-full bg-dark-gold origin-left transition-transform will-change-transform"
          :style="progressBarStyle"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.journal-toc-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(20, 38, 56, 0.2) rgba(20, 38, 56, 0.04);
}

.journal-toc-scroll::-webkit-scrollbar {
  width: 4px;
}

.journal-toc-scroll::-webkit-scrollbar-track {
  background: rgba(20, 38, 56, 0.04);
  border-radius: 9999px;
}

.journal-toc-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(20, 38, 56, 0.2);
  border-radius: 9999px;
  transition: background-color 0.2s ease;
}

.journal-toc-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-action-blue, #2b6cb0);
}
</style>
<!-- ~/app/components/journal/JournalSidebar.vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onActivated,
  onDeactivated,
  onBeforeUnmount
} from 'vue'
import { useRoute } from '#imports'

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
  copyFeedbackMs: 2000
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

const isHydrated = ref(false)
const route = useRoute()
const isKeepAliveActive = ref(true)
const ownerPath = ref('')

const normalizeRoutePath = (p: string): string =>
  (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p).toLowerCase()

// Unmounts from <body> the instant you leave this exact article or KeepAlive deactivates it
const isMobileBarMounted = computed<boolean>(() =>
  props.mode === 'mobile' &&
  isHydrated.value &&
  isKeepAliveActive.value &&
  Boolean(ownerPath.value) &&
  normalizeRoutePath(route.path) === ownerPath.value
)

const isCopied = ref(false)
const isShareCopied = ref(false)
const canNativeShare = ref(false)
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
let shareCopyTimeoutId: ReturnType<typeof setTimeout> | null = null
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

// Mobile open drop-up contains scroll completely so underlying article never drifts
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

const writeTextSafe = async (text: string): Promise<boolean> => {
  if (!import.meta.client || !text) return false
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to textarea fallback
    }
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

const handleCopyLink = async () => {
  if (await writeTextSafe(getCurrentUrl())) {
    isCopied.value = true
    if (copyTimeoutId) clearTimeout(copyTimeoutId)
    copyTimeoutId = setTimeout(() => {
      isCopied.value = false
    }, SIDEBAR_MOTION.copyFeedbackMs)
  }
}

const handleNativeShare = async () => {
  if (!import.meta.client) return
  const url = getCurrentUrl()

  if (canNativeShare.value && navigator.share) {
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

  if (await writeTextSafe(url)) {
    isShareCopied.value = true
    if (shareCopyTimeoutId) clearTimeout(shareCopyTimeoutId)
    shareCopyTimeoutId = setTimeout(() => {
      isShareCopied.value = false
    }, SIDEBAR_MOTION.copyFeedbackMs)
  }
}

const handleWhatsAppShare = () => {
  if (!import.meta.client) return
  const url = getCurrentUrl()
  const message = `${props.title} — ${url}`
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(waUrl, '_blank', 'noopener,noreferrer')
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

const handleOutsideClick = (e: PointerEvent) => {
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
    isMobileOpen.value = false
    nextTick(() => {
      if (tocScrollRef.value) tocScrollRef.value.scrollTop = 0
      attachResizeObservers()
      syncActiveIndicator(true)
      updateTocScrollMasks()
    })
  }
)

// Pre-position mobile drop-up instantaneously on open (no flying-from-top glitch)
watch(isMobileOpen, (open) => {
  if (!open) return
  nextTick(() => {
    attachResizeObservers()
    syncActiveIndicator(true)
    keepActiveItemInView('instant' as ScrollBehavior)
    updateTocScrollMasks()
  })
})

const attachMobileListeners = () => {
  if (!import.meta.client || props.mode !== 'mobile') return
  document.addEventListener('pointerdown', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
}

const detachMobileListeners = () => {
  if (!import.meta.client || props.mode !== 'mobile') return
  document.removeEventListener('pointerdown', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
}

watch(
  () => route.path,
  () => {
    isMobileOpen.value = false
  }
)

onMounted(() => {
  isHydrated.value = true
  isKeepAliveActive.value = true
  ownerPath.value = normalizeRoutePath(route.path)

  const isMobileHandset =
    /Android|iPhone|iPod/i.test(navigator.userAgent) &&
    window.matchMedia('(pointer: coarse)').matches
  canNativeShare.value = isMobileHandset && typeof navigator.share === 'function'

  if (typeof ResizeObserver !== 'undefined') {
    tocResizeObserver = new ResizeObserver(() => {
      syncActiveIndicator(true)
      updateTocScrollMasks()
    })
  }

  if (props.mode === 'mobile') {
    attachMobileListeners()
  } else {
    nextTick(() => {
      attachResizeObservers()
      syncActiveIndicator(true)
      updateTocScrollMasks()
    })
  }
})

onActivated(() => {
  isKeepAliveActive.value = true
  if (props.mode === 'mobile') {
    attachMobileListeners()
  }
})

onDeactivated(() => {
  isKeepAliveActive.value = false
  isMobileOpen.value = false
  detachMobileListeners()
})

onBeforeUnmount(() => {
  isKeepAliveActive.value = false
  if (copyTimeoutId) clearTimeout(copyTimeoutId)
  if (shareCopyTimeoutId) clearTimeout(shareCopyTimeoutId)
  if (optimisticTimeoutId) clearTimeout(optimisticTimeoutId)
  if (manualScrollTimeoutId) clearTimeout(manualScrollTimeoutId)
  if (tocResizeObserver) {
    tocResizeObserver.disconnect()
    tocResizeObserver = null
  }
  detachMobileListeners()
})
</script>

<template>
  <!-- ==========================================
       MODE A: MOBILE & TABLET FIXED BOTTOM BAR + DROP-UP (< 1024px)
       ========================================== -->
  <template v-if="mode === 'mobile'">
    <Teleport v-if="isMobileBarMounted" to="body">
      <div
        ref="mobileBarRef"
        role="region"
        aria-label="Story navigation and share actions"
        class="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface-light/95 backdrop-blur-md border-t border-journey-deep/10 px-4 sm:px-6 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_-6px_rgba(5,27,59,0.08)] select-none"
      >
        <div class="relative w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
          <!-- Upward Floating Contents Drop-Up (No Backdrop, Same Clean Journal Experience) -->
          <Transition
            enter-active-class="transition duration-240 ease-(--ease-editorial)"
            enter-from-class="opacity-0 translate-y-2.5 scale-[0.99]"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition duration-170 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-2 scale-[0.99]"
          >
            <div
              v-if="isMobileOpen && toc.length > 0"
              id="mobile-journal-toc-dropup"
              data-lenis-prevent
              class="absolute left-0 right-0 sm:right-auto sm:w-full sm:max-w-lg bottom-[calc(100%+0.75rem)] z-50 rounded-2xl bg-surface-light border border-dark-gold/28 shadow-[0_-12px_34px_-8px_rgba(5,27,59,0.18)] p-4.5 sm:p-5.5 flex flex-col gap-3.5 origin-bottom"
            >
              <!-- Drop-Up Header + Live Gold Reading Progress Hairline -->
              <div class="flex flex-col gap-2.5 shrink-0">
                <div class="flex items-center justify-between gap-3">
                  <span class="font-uppercase text-[11.5px] sm:text-[12px] text-journey-deep/90 font-semibold uppercase tracking-[0.15em] leading-none pt-0.5">
                    IN THIS STORY
                  </span>
                  <span class="font-uppercase text-[10.5px] sm:text-[11px] font-semibold text-journey-deep/70 tabular-nums tracking-widest leading-none pt-0.5">
                    {{ formattedProgress }}
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  class="w-full h-0.5 rounded-full bg-journey-deep/8 overflow-hidden"
                >
                  <div
                    class="w-full h-full rounded-full bg-dark-gold origin-left transition-transform will-change-transform"
                    :style="progressBarStyle"
                  />
                </div>
              </div>

              <!-- Scroll-Capped TOC List + Fade Masks + GPU Gold Spine -->
              <div class="relative min-h-0">
                <div
                  aria-hidden="true"
                  :class="['journal-toc-fade-top', canScrollUp ? 'opacity-100' : 'opacity-0']"
                />

                <div
                  ref="tocScrollRef"
                  class="max-h-[min(56svh,20.5rem)] overflow-y-auto overscroll-contain pr-1 journal-toc-scroll"
                  @scroll.passive="updateTocScrollMasks"
                  @wheel.passive="onMobilePopoverWheel"
                  @touchstart.passive="onTocTouchStart"
                  @touchmove.passive="onMobilePopoverTouchMove"
                >
                  <nav
                    ref="tocNavRef"
                    aria-label="Mobile table of contents"
                    class="relative flex flex-col border-l border-journey-deep/14 ml-1 py-0.5"
                  >
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
                      class="group relative z-10 flex items-center pl-3.5 pr-2.5 py-2.25 text-left rounded-r-xl transition-colors duration-250 ease-editorial cursor-pointer"
                      :class="
                        item.id === effectiveActiveId
                          ? 'text-journey-deep'
                          : 'text-secondary-light/90 hover:text-journey-deep active:text-journey-deep hover:bg-journey-deep/3'
                      "
                      @click="handleSelectSection(item.id)"
                    >
                      <span
                        class="font-primary text-[14px] 2xs:text-[14.5px] sm:text-[15.5px] leading-[1.4] text-pretty transition-transform duration-250 ease-editorial"
                        :class="
                          item.id === effectiveActiveId
                            ? 'font-semibold translate-x-0.5'
                            : 'font-medium group-hover:translate-x-0.5'
                        "
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

          <!-- Left Toggle Button: IN THIS STORY + Progress Pill + Upward Chevron (Rotates Down When Open) -->
          <button
            v-if="toc.length > 0"
            type="button"
            :aria-expanded="isMobileOpen"
            aria-controls="mobile-journal-toc-dropup"
            aria-label="Toggle table of contents"
            class="inline-flex items-center gap-2 2xs:gap-2.5 py-1.5 text-left cursor-pointer group min-w-0 focus:outline-none"
            @click="isMobileOpen = !isMobileOpen"
          >
            <svg
              class="w-4.5 h-4.5 text-dark-gold group-hover:text-intention-blue group-active:text-intention-blue transition-colors shrink-0"
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

            <span class="font-uppercase text-[11px] 2xs:text-[12px] sm:text-[12.5px] text-journey-deep/90 font-semibold uppercase tracking-[0.14em] leading-none pt-0.5 truncate">
              IN THIS STORY
            </span>

            <span class="hidden xs:inline-flex items-center px-2 pt-1 pb-0.5 rounded-full bg-journey-deep/7 text-journey-deep/80 font-uppercase text-[9.5px] sm:text-[10.5px] font-semibold tabular-nums tracking-[0.08em] leading-none shrink-0">
              {{ formattedProgress }}
            </span>

            <!-- Points UP when closed, rotates 180° DOWN when open -->
            <svg
              class="w-4 h-4 text-journey-deep/70 transition-transform duration-300 ease-editorial shrink-0"
              :class="isMobileOpen ? 'rotate-180 text-intention-blue' : 'rotate-0'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>

          <!-- Fallback Label If Story Has Zero Headings -->
          <span
            v-else
            class="font-uppercase text-[11.5px] 2xs:text-[12px] text-journey-deep/90 font-semibold uppercase tracking-[0.14em] leading-none pt-0.5 truncate"
          >
            SHARE THIS STORY
          </span>

          <!-- Right: 3 Same-Sized Circular Outline Buttons Matching ItinerarySidebar -->
          <div class="flex items-center gap-2 2xs:gap-2.5 shrink-0">
            <!-- 1. Copy Link + Floating "Link copied" Tooltip -->
            <div class="relative">
              <button
                type="button"
                :aria-label="isCopied ? 'Link copied' : 'Copy story link'"
                class="w-9.5 h-9.5 2xs:w-10 2xs:h-10 journal-share-btn"
                :class="
                  isCopied
                    ? 'bg-intention-blue/10 border-intention-blue text-intention-blue'
                    : 'border-intention-blue/40 text-intention-blue active:bg-intention-blue active:text-surface-light'
                "
                @click="handleCopyLink"
              >
                <svg
                  v-if="isCopied"
                  class="w-4.5 h-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
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
                  stroke-width="1.95"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </button>

              <span
                v-if="isCopied"
                role="status"
                class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-surface-light text-ink-dark border border-journey-deep/15 shadow-xs section-subparagraph text-xs! font-normal leading-none! whitespace-nowrap pointer-events-none z-50"
              >
                Link copied
              </span>
            </div>

            <!-- 2. WhatsApp Share (Matched Circular Outline & Crisp Vector) -->
            <button
              type="button"
              aria-label="Share on WhatsApp"
              class="w-9.5 h-9.5 2xs:w-10 2xs:h-10 journal-share-btn border-whatsapp/55 text-whatsapp active:bg-whatsapp active:text-surface-light"
              @click="handleWhatsAppShare"
            >
              <svg
                aria-hidden="true"
                viewBox="100 100 312 312"
                fill="none"
                class="w-4.5 h-4.5 2xs:w-5 2xs:h-5"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-width="28"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M123 393l14-65a138 138 0 1150 47z"
                />
                <path
                  fill="currentColor"
                  d="M308 273c-3-2-6-3-9 1l-12 16c-3 2-5 3-9 1-15-8-36-17-54-47-1-4 1-6 3-8l9-14c2-2 1-4 0-6l-12-29c-3-8-6-7-9-7h-8c-2 0-6 1-10 5-22 22-13 53 3 73 3 4 23 40 66 59 32 14 39 12 48 10 11-1 22-10 27-19 1-3 6-16 2-18"
                />
              </svg>
            </button>

            <!-- 3. Native Share (Tick + Tooltip on Copy Fallback, OS Sheet on Handset) -->
            <div class="relative">
              <button
                type="button"
                :aria-label="isShareCopied ? 'Link copied' : 'Share story'"
                class="w-9.5 h-9.5 2xs:w-10 2xs:h-10 journal-share-btn"
                :class="
                  isShareCopied
                    ? 'bg-intention-blue/10 border-intention-blue text-intention-blue'
                    : 'border-journey-deep/35 text-journey-deep/85 active:bg-intention-blue active:border-intention-blue active:text-surface-light'
                "
                @click="handleNativeShare"
              >
                <svg
                  v-if="isShareCopied"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-4.5 h-4.5"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="none"
                  class="w-4.5 h-4.5"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z"
                    fill="currentColor"
                  />
                </svg>
              </button>

              <span
                v-if="isShareCopied"
                role="status"
                class="absolute -top-10 right-0 px-3 py-1.5 rounded-lg bg-surface-light text-ink-dark border border-journey-deep/15 shadow-xs section-subparagraph text-xs! font-normal leading-none! whitespace-nowrap pointer-events-none z-50"
              >
                Link copied
              </span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </template>

  <!-- ==========================================
       MODE B: DESKTOP STICKY SIDEBAR CARD (lg+ — UNTOUCHED)
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

.journal-toc-card {
  width: 100%;
  border-radius: 1rem;
  background-color: var(--color-surface-light);
  border: 1px solid color-mix(in srgb, var(--color-journey-deep) 12%, transparent);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow: hidden;
}

@media (min-width: 1024px) {
  .journal-toc-card {
    max-height: calc(100svh - 8rem);
  }
}

@media (min-width: 1280px) {
  .journal-toc-card {
    padding: 1.375rem;
  }
}

.journal-toc-fade-top {
  pointer-events: none;
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 1.5rem;
  z-index: 20;
  background-image: linear-gradient(
    to bottom,
    var(--color-surface-light) 0%,
    color-mix(in srgb, var(--color-surface-light) 90%, transparent) 55%,
    transparent 100%
  );
  transition: opacity 250ms ease;
}

.journal-toc-fade-bottom {
  pointer-events: none;
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 1.75rem;
  z-index: 20;
  background-image: linear-gradient(
    to top,
    var(--color-surface-light) 0%,
    color-mix(in srgb, var(--color-surface-light) 90%, transparent) 55%,
    transparent 100%
  );
  transition: opacity 250ms ease;
}

.journal-toc-pill {
  pointer-events: none;
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 2.5rem;
  z-index: 0;
  transform-origin: top;
  will-change: transform;
  background-image: linear-gradient(
    to right,
    color-mix(in srgb, var(--color-dark-gold) 14%, transparent) 0%,
    color-mix(in srgb, var(--color-soft-cream) 42%, transparent) 50%,
    transparent 100%
  );
}

.journal-toc-rail {
  pointer-events: none;
  position: absolute;
  left: -1.5px;
  top: 0;
  width: 2.5px;
  height: 2.5rem;
  z-index: 10;
  border-radius: 9999px;
  background-color: var(--color-dark-gold);
  transform-origin: top;
  will-change: transform;
}

.journal-share-btn {
  border-radius: 9999px;
  border-width: 1px;
  border-style: solid;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 250ms var(--ease-editorial);
}

.journal-share-btn:active {
  scale: 0.94;
}
</style>
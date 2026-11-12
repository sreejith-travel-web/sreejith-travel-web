<!-- ~/app/components/TrapeziumTabBar.vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onActivated,
  onBeforeUnmount
} from 'vue'
import {
  EDITORIAL_GLIDE_CONFIG,
  easeSilkGlide
} from '~/composables/useEditorialGlide'

export interface TrapeziumTabOption {
  id: string
  label: string
}

const props = withDefaults(
  defineProps<{
    tabs: TrapeziumTabOption[]
    activeTab: string
    ariaLabel?: string
    'aria-label'?: string
    maxWidthClass?: string
    wrapperClass?: string
    idPrefix?: string
  }>(),
  {
    ariaLabel: 'Section Navigation Tabs',
    maxWidthClass: 'max-w-7xl',
    wrapperClass: 'mb-6 md:mb-8',
    idPrefix: 'trapezium'
  }
)

const resolvedAriaLabel = computed(
  () => props['aria-label'] || props.ariaLabel || 'Section Navigation Tabs'
)

const emit = defineEmits<{
  (e: 'select', tabId: string): void
}>()

const stickyRootRef = ref<HTMLElement | null>(null)
const scrollRailRef = ref<HTMLElement | null>(null)
const tabButtonMap = new Map<string, HTMLButtonElement>()

const setTabButtonRef = (id: string, el: unknown) => {
  if (el instanceof HTMLButtonElement) {
    tabButtonMap.set(id, el)
  } else {
    tabButtonMap.delete(id)
  }
}

const activeIndex = computed(() => {
  const idx = props.tabs.findIndex((t) => t.id === props.activeTab)
  return idx >= 0 ? idx : 0
})

const isOverflowing = ref(false)
const canScrollLeft = ref(false)
const canScrollRight = ref(false)
const isPointerDragging = ref(false)

let railAnimationRaf: number | null = null
let metricsRaf: number | null = null
let settleSnapTimer: ReturnType<typeof setTimeout> | null = null
let resizeObserver: ResizeObserver | null = null

let isTouchActive = false
let suppressNextClick = false
let dragStartX = 0
let dragStartScrollLeft = 0
let hasDraggedBeyondThreshold = false
let velocitySamples: Array<{ x: number; t: number }> = []

const cancelRailAnimation = () => {
  if (railAnimationRaf !== null) {
    cancelAnimationFrame(railAnimationRaf)
    railAnimationRaf = null
  }
}

const clearSettleTimer = () => {
  if (settleSnapTimer !== null) {
    clearTimeout(settleSnapTimer)
    settleSnapTimer = null
  }
}

const updateScrollMetrics = () => {
  metricsRaf = null
  const rail = scrollRailRef.value
  if (!rail) return

  const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
  isOverflowing.value = maxScroll > 2
  canScrollLeft.value = rail.scrollLeft > 3
  canScrollRight.value = rail.scrollLeft < maxScroll - 3
}

const scheduleMetricsUpdate = () => {
  if (!import.meta.client || metricsRaf !== null) return
  metricsRaf = requestAnimationFrame(updateScrollMetrics)
}

// Smooth Silk S-Curve Horizontal Glide
const glideRailTo = (
  rawTargetLeft: number,
  durationMs: number = EDITORIAL_GLIDE_CONFIG.TAB_SELECT_GLIDE_MS
) => {
  const rail = scrollRailRef.value
  if (!rail || !import.meta.client) return

  cancelRailAnimation()
  clearSettleTimer()

  const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
  const targetLeft = Math.max(0, Math.min(maxScroll, rawTargetLeft))
  const startLeft = rail.scrollLeft
  const delta = targetLeft - startLeft

  if (Math.abs(delta) < 1) {
    rail.scrollLeft = targetLeft
    updateScrollMetrics()
    return
  }

  const startTime = performance.now()

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / durationMs)
    rail.scrollLeft = startLeft + delta * easeSilkGlide(progress)
    updateScrollMetrics()

    if (progress < 1) {
      railAnimationRaf = requestAnimationFrame(step)
    } else {
      railAnimationRaf = null
      rail.scrollLeft = targetLeft
      updateScrollMetrics()
    }
  }

  railAnimationRaf = requestAnimationFrame(step)
}

const centerTabInRail = (tabId: string, immediate = false) => {
  if (!import.meta.client) return
  const rail = scrollRailRef.value
  const btn = tabButtonMap.get(tabId)
  if (!rail || !btn) return

  const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
  if (maxScroll <= 2) {
    updateScrollMetrics()
    return
  }

  const idealLeft = btn.offsetLeft + btn.offsetWidth / 2 - rail.clientWidth / 2
  const clampedLeft = Math.max(0, Math.min(maxScroll, idealLeft))

  if (immediate) {
    cancelRailAnimation()
    rail.scrollLeft = clampedLeft
    updateScrollMetrics()
    return
  }

  glideRailTo(clampedLeft, EDITORIAL_GLIDE_CONFIG.TAB_SELECT_GLIDE_MS)
}

// Gently glides any partially sliced edge tab into clean view after drag/swipe
const snapNearestClippedEdgeTab = () => {
  const rail = scrollRailRef.value
  if (!rail) return

  const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
  if (maxScroll <= 2) return
  if (rail.scrollLeft <= 6 || rail.scrollLeft >= maxScroll - 6) return

  const safePad = 28
  const visibleLeft = rail.scrollLeft + safePad
  const visibleRight = rail.scrollLeft + rail.clientWidth - safePad

  for (const item of props.tabs) {
    const btn = tabButtonMap.get(item.id)
    if (!btn) continue
    const btnLeft = btn.offsetLeft
    const btnRight = btnLeft + btn.offsetWidth

    if (btnLeft < visibleLeft && btnRight > visibleLeft) {
      const hiddenPart = visibleLeft - btnLeft
      const target =
        hiddenPart < btn.offsetWidth * 0.5
          ? btnLeft - safePad
          : btnRight - safePad + 8
      glideRailTo(target, EDITORIAL_GLIDE_CONFIG.TAB_SETTLE_SNAP_MS)
      return
    }

    if (btnLeft < visibleRight && btnRight > visibleRight) {
      const visiblePart = visibleRight - btnLeft
      const target =
        visiblePart >= btn.offsetWidth * 0.5
          ? btnRight - rail.clientWidth + safePad
          : btnLeft - rail.clientWidth + safePad - 8
      glideRailTo(target, EDITORIAL_GLIDE_CONFIG.TAB_SETTLE_SNAP_MS)
      return
    }
  }
}

const armSettleSnap = () => {
  clearSettleTimer()
  settleSnapTimer = setTimeout(() => {
    if (!isTouchActive && !isPointerDragging.value && railAnimationRaf === null) {
      snapNearestClippedEdgeTab()
    }
  }, EDITORIAL_GLIDE_CONFIG.SETTLE_IDLE_DELAY_MS)
}

const onRailScroll = () => {
  scheduleMetricsUpdate()
  if (!isPointerDragging.value && railAnimationRaf === null) {
    armSettleSnap()
  }
}

// Desktop Mouse Grab-and-Drag + Frame-Rate-Independent Inertia
const startDragInertia = (initialVelocityPxPerMs: number) => {
  const rail = scrollRailRef.value
  if (!rail) return

  cancelRailAnimation()
  let velocity = initialVelocityPxPerMs * 16.67
  let lastTime = performance.now()

  const step = (now: number) => {
    const dt = Math.min(34, Math.max(8, now - lastTime))
    lastTime = now
    const frameScale = dt / 16.67

    rail.scrollLeft -= velocity * frameScale
    velocity *= Math.pow(EDITORIAL_GLIDE_CONFIG.DRAG_INERTIA_FRICTION, frameScale)
    updateScrollMetrics()

    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth)
    const hitBoundary = rail.scrollLeft <= 0.5 || rail.scrollLeft >= maxScroll - 0.5

    if (!hitBoundary && Math.abs(velocity) > 0.32) {
      railAnimationRaf = requestAnimationFrame(step)
    } else {
      railAnimationRaf = null
      snapNearestClippedEdgeTab()
    }
  }

  railAnimationRaf = requestAnimationFrame(step)
}

const onWindowPointerMove = (e: PointerEvent) => {
  const rail = scrollRailRef.value
  if (!isPointerDragging.value || !rail) return

  const dx = e.clientX - dragStartX
  if (!hasDraggedBeyondThreshold && Math.abs(dx) > 5) {
    hasDraggedBeyondThreshold = true
    suppressNextClick = true
  }

  if (hasDraggedBeyondThreshold) {
    e.preventDefault()
    rail.scrollLeft = dragStartScrollLeft - dx
    scheduleMetricsUpdate()
  }

  const now = performance.now()
  velocitySamples.push({ x: e.clientX, t: now })
  const cutoff = now - 90
  while (velocitySamples.length > 2 && (velocitySamples[0]?.t ?? 0) < cutoff) {
    velocitySamples.shift()
  }
}

const stopPointerDrag = () => {
  if (!isPointerDragging.value) return
  isPointerDragging.value = false

  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', stopPointerDrag)
  window.removeEventListener('pointercancel', stopPointerDrag)

  if (!hasDraggedBeyondThreshold) return

  const now = performance.now()
  const first = velocitySamples[0]
  const last = velocitySamples[velocitySamples.length - 1]

  if (first && last && now - last.t < 65 && last.t > first.t) {
    const vPxPerMs = (last.x - first.x) / (last.t - first.t)
    if (Math.abs(vPxPerMs) > 0.12) {
      startDragInertia(vPxPerMs)
      setTimeout(() => {
        suppressNextClick = false
      }, 60)
      return
    }
  }

  snapNearestClippedEdgeTab()
  setTimeout(() => {
    suppressNextClick = false
  }, 60)
}

const onRailPointerDown = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  const rail = scrollRailRef.value
  if (!rail || rail.scrollWidth <= rail.clientWidth + 2) return

  cancelRailAnimation()
  clearSettleTimer()

  isPointerDragging.value = true
  hasDraggedBeyondThreshold = false
  suppressNextClick = false
  dragStartX = e.clientX
  dragStartScrollLeft = rail.scrollLeft
  velocitySamples = [{ x: e.clientX, t: performance.now() }]

  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', stopPointerDrag)
  window.addEventListener('pointercancel', stopPointerDrag)
}

const onRailTouchStart = () => {
  isTouchActive = true
  cancelRailAnimation()
  clearSettleTimer()
}

const onRailTouchEnd = () => {
  isTouchActive = false
  armSettleSnap()
}

const onRailWheel = (e: WheelEvent) => {
  const rail = scrollRailRef.value
  if (!rail || rail.scrollWidth <= rail.clientWidth + 2) return

  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    cancelRailAnimation()
    armSettleSnap()
    return
  }

  if (e.shiftKey && e.deltaY !== 0) {
    e.preventDefault()
    cancelRailAnimation()
    rail.scrollLeft += e.deltaY
    scheduleMetricsUpdate()
    armSettleSnap()
  }
}

const stepRailByDirection = (dir: -1 | 1) => {
  const rail = scrollRailRef.value
  if (!rail) return
  const stepDistance = Math.max(180, rail.clientWidth * 0.58) * dir
  glideRailTo(
    rail.scrollLeft + stepDistance,
    EDITORIAL_GLIDE_CONFIG.TAB_ARROW_STEP_MS
  )
}

const onTabClick = (tabId: string) => {
  if (suppressNextClick) {
    suppressNextClick = false
    return
  }
  emit('select', tabId)
  nextTick(() => centerTabInRail(tabId, false))
}

const onTablistKeydown = (e: KeyboardEvent) => {
  const total = props.tabs.length
  if (!total) return

  let targetIdx = -1
  if (e.key === 'ArrowRight') {
    targetIdx = (activeIndex.value + 1) % total
  } else if (e.key === 'ArrowLeft') {
    targetIdx = (activeIndex.value - 1 + total) % total
  } else if (e.key === 'Home') {
    targetIdx = 0
  } else if (e.key === 'End') {
    targetIdx = total - 1
  }

  if (targetIdx === -1) return
  e.preventDefault()

  const nextTab = props.tabs[targetIdx]
  if (!nextTab) return

  const btn = tabButtonMap.get(nextTab.id)
  btn?.focus({ preventScroll: true })
  emit('select', nextTab.id)
  nextTick(() => centerTabInRail(nextTab.id, false))
}

// Exposes exact sticky offset + height math so parent scroll anchors align pixel-perfectly
const getAnchorTargetScrollY = (anchorEl: HTMLElement | null): number => {
  if (!import.meta.client || !anchorEl) return 0
  const stickyEl = stickyRootRef.value
  const fallbackTop = window.innerWidth >= 768 ? 80 : 64
  const stickyTopPx = stickyEl
    ? Number.parseFloat(window.getComputedStyle(stickyEl).top) || fallbackTop
    : fallbackTop
  const stickyBarHeight = stickyEl ? stickyEl.offsetHeight : 58
  const anchorAbsoluteTop = anchorEl.getBoundingClientRect().top + window.scrollY
  return Math.max(0, anchorAbsoluteTop - stickyTopPx - stickyBarHeight - 12)
}

const getStickyBarHeight = (): number => stickyRootRef.value?.offsetHeight || 58

defineExpose({
  getAnchorTargetScrollY,
  getStickyBarHeight,
  centerTabInRail
})

watch(
  () => props.activeTab,
  (newId) => {
    nextTick(() => {
      centerTabInRail(newId, false)
    })
  }
)

onMounted(() => {
  nextTick(() => {
    updateScrollMetrics()
    centerTabInRail(props.activeTab, true)

    if (typeof ResizeObserver !== 'undefined' && scrollRailRef.value) {
      resizeObserver = new ResizeObserver(() => {
        updateScrollMetrics()
      })
      resizeObserver.observe(scrollRailRef.value)
    }
  })
})

onActivated(() => {
  nextTick(() => {
    updateScrollMetrics()
    centerTabInRail(props.activeTab, true)
  })
})

onBeforeUnmount(() => {
  cancelRailAnimation()
  clearSettleTimer()
  stopPointerDrag()
  if (metricsRaf !== null) cancelAnimationFrame(metricsRaf)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <!-- top-16 (<768px = 64px) and md:top-20 (>=768px = 80px) keeps 640px-768px flush under the header -->
  <div
    ref="stickyRootRef"
    :class="[
      'sticky top-16 md:top-20 z-30 w-full bg-bg-light/95 backdrop-blur-md py-2.5 md:py-3 flex items-center justify-center',
      wrapperClass
    ]"
  >
    <div :class="['relative w-full flex items-center mx-auto', maxWidthClass]">
      <!-- Left Edge Soft Fade + Step Chevron -->
      <div
        aria-hidden="true"
        :class="[
          'pointer-events-none absolute left-0 top-0 bottom-px w-8 sm:w-14 z-20 bg-linear-to-r from-bg-light via-bg-light/85 to-transparent transition-opacity duration-300',
          canScrollLeft ? 'opacity-100' : 'opacity-0'
        ]"
      />

      <!-- 1. Left Chevron Button -->
      <button
        type="button"
        :aria-label="`Scroll ${resolvedAriaLabel.toLowerCase()} left`"
        :tabindex="canScrollLeft ? 0 : -1"
        :class="[
          'hidden sm:flex absolute left-1 z-30 w-8 h-8 rounded-full bg-surface-light/95 border border-journey-deep/15 text-journey-deep hover:border-dark-gold/60 hover:text-dark-gold shadow-2xs items-center justify-center transition-all duration-300 cursor-pointer',
          canScrollLeft
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90 pointer-events-none'
        ]"
        @click="stepRailByDirection(-1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Horizontal Physics Scroll Viewport -->
      <div
        ref="scrollRailRef"
        data-lenis-prevent-horizontal
        :class="[
          'trapezium-scroll-rail',
          isOverflowing
            ? isPointerDragging
              ? 'cursor-grabbing'
              : 'cursor-grab'
            : 'cursor-default'
        ]"
        @scroll.passive="onRailScroll"
        @pointerdown="onRailPointerDown"
        @touchstart.passive="onRailTouchStart"
        @touchend.passive="onRailTouchEnd"
        @touchcancel.passive="onRailTouchEnd"
        @wheel="onRailWheel"
      >
        <!-- 2. Inner Tablist Track -->
        <div
          role="tablist"
          :aria-label="resolvedAriaLabel"
          class="trapezium-scroll-track"
          @keydown="onTablistKeydown"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :id="`${idPrefix}-tab-${tab.id}`"
            :ref="(el) => setTabButtonRef(tab.id, el)"
            role="tab"
            type="button"
            :tabindex="activeTab === tab.id ? 0 : -1"
            :aria-selected="activeTab === tab.id"
            :aria-controls="`${idPrefix}-panel-${tab.id}`"
            class="trapezium-tab shrink-0 whitespace-nowrap"
            :class="activeTab === tab.id ? 'trapezium-tab-active' : ''"
            @click="onTabClick(tab.id)"
          >
            <svg
              v-if="activeTab === tab.id"
              class="w-3.5 h-3.5 text-dark-gold shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{{ tab.label }}</span>
            <span v-if="activeTab === tab.id" class="trapezium-tab-indicator" />
          </button>
        </div>
      </div>

      <!-- Right Edge Soft Fade + Step Chevron -->
      <div
        aria-hidden="true"
        :class="[
          'pointer-events-none absolute right-0 top-0 bottom-px w-8 sm:w-14 z-20 bg-linear-to-l from-bg-light via-bg-light/85 to-transparent transition-opacity duration-300',
          canScrollRight ? 'opacity-100' : 'opacity-0'
        ]"
      />

      <!-- 3. Right Chevron Button -->
      <button
        type="button"
        :aria-label="`Scroll ${resolvedAriaLabel.toLowerCase()} right`"
        :tabindex="canScrollRight ? 0 : -1"
        :class="[
          'hidden sm:flex absolute right-1 z-30 w-8 h-8 rounded-full bg-surface-light/95 border border-journey-deep/15 text-journey-deep hover:border-dark-gold/60 hover:text-dark-gold shadow-2xs items-center justify-center transition-all duration-300 cursor-pointer',
          canScrollRight
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90 pointer-events-none'
        ]"
        @click="stepRailByDirection(1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
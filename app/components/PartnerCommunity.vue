<!-- ~/app/components/PartnerCommunity.vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'
import { useState } from '#imports'
import type Lenis from 'lenis'

export type CommunityCapsuleTint = 'cream' | 'sky' | 'peach' | 'sage'

export interface CommunityMemberItem {
  id: string | number
  name: string
  role: string
  location: string
  desc: string
  img: string
  alt?: string
  tint?: CommunityCapsuleTint
}

export interface PartnerCommunityConfig {
  ledgerNoun?: string
  interactionHint?: string
  fallbackImage?: string
  members: CommunityMemberItem[]
}

const props = defineProps<{
  data: PartnerCommunityConfig
}>()

const lenisState = useState<Lenis | null>('lenis-instance', () => null)

const TINT_SEQUENCE: CommunityCapsuleTint[] = ['cream', 'sky', 'peach', 'sage']
const MIN_SET_ITEMS = 14

const capsuleTintClassMap: Record<CommunityCapsuleTint, string> = {
  cream: 'community-capsule-cream',
  sky: 'community-capsule-sky',
  peach: 'community-capsule-peach',
  sage: 'community-capsule-sage'
}

const modalHeaderTintMap: Record<CommunityCapsuleTint, string> = {
  cream: 'bg-linear-to-br from-soft-cream/50 via-soft-cream/18 to-surface-light',
  sky: 'bg-linear-to-br from-soft-blue/36 via-soft-blue/12 to-surface-light',
  peach: 'bg-linear-to-br from-soft-peach/32 via-soft-peach/12 to-surface-light',
  sage: 'bg-linear-to-br from-deep-forest/12 via-olive-drab/5 to-surface-light'
}

const resolveMemberTint = (
  member: CommunityMemberItem,
  rowIdx: number,
  itemIdx: number
): CommunityCapsuleTint => {
  if (member.tint && member.tint in capsuleTintClassMap) return member.tint
  return TINT_SEQUENCE[(rowIdx * 2 + itemIdx) % TINT_SEQUENCE.length]!
}

const fallbackImgSrc = computed(
  () => props.data.fallbackImage || '/images/fallbacks/culture.webp'
)

const onAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement | null
  if (img && img.src !== fallbackImgSrc.value) {
    img.src = fallbackImgSrc.value
  }
}

// =========================================================
// DYNAMIC COUNT-AGNOSTIC STREAM DISTRIBUTION (10 to 80+ People)
// =========================================================
interface IndexedCustodian {
  member: CommunityMemberItem
  globalIndex: number
  tint: CommunityCapsuleTint
}

interface StreamRenderItem extends IndexedCustodian {
  renderKey: string
  copyIdx: number
  isPrimaryCopy: boolean
}

const streamCount = computed(() => {
  const total = props.data.members.length
  if (total <= 10) return 2
  if (total <= 20) return 3
  return 4
})

const streamRows = computed<StreamRenderItem[][]>(() => {
  const all = props.data.members
  if (!all.length) return []

  const rowsCount = streamCount.value
  const buckets: IndexedCustodian[][] = Array.from({ length: rowsCount }, () => [])

  all.forEach((member, globalIndex) => {
    const rowIdx = globalIndex % rowsCount
    const bucket = buckets[rowIdx]!
    bucket.push({
      member,
      globalIndex,
      tint: resolveMemberTint(member, rowIdx, bucket.length)
    })
  })

  return buckets.map((bucket, rIdx) => {
    if (!bucket.length) return []

    const repeatFactor = Math.max(1, Math.ceil(MIN_SET_ITEMS / bucket.length))
    const expandedSet: IndexedCustodian[] = []
    for (let r = 0; r < repeatFactor; r++) {
      for (const entry of bucket) {
        expandedSet.push(entry)
      }
    }

    // 3 identical sets [0, 1, 2] for seamless modulo wrapping
    const tripled: StreamRenderItem[] = []
    for (let copyIdx = 0; copyIdx < 3; copyIdx++) {
      expandedSet.forEach((entry, idx) => {
        tripled.push({
          ...entry,
          copyIdx,
          isPrimaryCopy: copyIdx === 1 && idx < bucket.length,
          renderKey: `r${rIdx}-c${copyIdx}-i${idx}-${entry.member.id}`
        })
      })
    }
    return tripled
  })
})

const baseSetLengths = computed<number[]>(() => {
  const all = props.data.members
  if (!all.length) return []
  const rowsCount = streamCount.value
  const counts = Array.from({ length: rowsCount }, () => 0)
  all.forEach((_, idx) => {
    const bucketIdx = idx % rowsCount
    counts[bucketIdx] = (counts[bucketIdx] ?? 0) + 1
  })
  return counts.map((len) => {
    if (len <= 0) return 0
    const repeatFactor = Math.max(1, Math.ceil(MIN_SET_ITEMS / len))
    return len * repeatFactor
  })
})

// =========================================================
// PER-ROW CONTINUOUS DRIFT + DIRECT SWIPE/DRAG PHYSICS ENGINE
// =========================================================
interface RowPhysicsState {
  offsetPx: number
  setWidthPx: number
  direction: -1 | 1
  baseSpeedPxPerFrame: number
  speedScale: number
  isHovered: boolean
  isDragging: boolean
  inertiaVelocity: number
  resumeHoldUntil: number
}

const ROW_BASE_SPEEDS = [0.42, 0.35, 0.46, 0.38] as const
const ROW_INITIAL_PHASES = [0.08, 0.34, 0.19, 0.46] as const

const sectionRef = ref<HTMLElement | null>(null)
const trackElMap = new Map<number, HTMLElement>()
const draggingRowIndex = ref<number | null>(null)
const rowStates: RowPhysicsState[] = []

let rafId: number | null = null
let lastFrameTime = 0
let isInViewport = true
let isTabHidden = false
let prefersReducedMotion = false
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null

const wrapStreamOffset = (rawOffset: number, setWidth: number): number => {
  if (setWidth <= 0) return 0
  const mod = (((rawOffset + setWidth) % setWidth) + setWidth) % setWidth
  return mod - 2 * setWidth
}

const applyTrackTransform = (rowIdx: number) => {
  const el = trackElMap.get(rowIdx)
  const state = rowStates[rowIdx]
  if (!el || !state) return
  el.style.transform = `translate3d(${state.offsetPx.toFixed(2)}px, 0, 0)`
}

const ensureRowStates = () => {
  const needed = streamRows.value.length
  while (rowStates.length < needed) {
    const idx = rowStates.length
    rowStates.push({
      offsetPx: 0,
      setWidthPx: 0,
      direction: idx % 2 === 0 ? -1 : 1,
      baseSpeedPxPerFrame: ROW_BASE_SPEEDS[idx % ROW_BASE_SPEEDS.length]!,
      speedScale: 1,
      isHovered: false,
      isDragging: false,
      inertiaVelocity: 0,
      resumeHoldUntil: 0
    })
  }
}

const measureAllTrackSetWidths = () => {
  if (!import.meta.client) return
  ensureRowStates()

  streamRows.value.forEach((_, rowIdx) => {
    const trackEl = trackElMap.get(rowIdx)
    const state = rowStates[rowIdx]
    const setLen = baseSetLengths.value[rowIdx] || 0
    if (!trackEl || !state || setLen <= 0) return

    const children = trackEl.children
    const firstEl = children[0] as HTMLElement | undefined
    const secondSetFirstEl = children[setLen] as HTMLElement | undefined
    if (!firstEl || !secondSetFirstEl) return

    const measuredWidth = secondSetFirstEl.offsetLeft - firstEl.offsetLeft
    if (measuredWidth <= 0) return

    const wasUninitialized = state.setWidthPx === 0
    state.setWidthPx = measuredWidth

    if (wasUninitialized) {
      const phase = ROW_INITIAL_PHASES[rowIdx % ROW_INITIAL_PHASES.length]!
      state.offsetPx = wrapStreamOffset(-measuredWidth * (1 + phase), measuredWidth)
    } else {
      state.offsetPx = wrapStreamOffset(state.offsetPx, measuredWidth)
    }
    applyTrackTransform(rowIdx)
  })
}

const setTrackRef = (rowIdx: number, el: unknown) => {
  const existing = trackElMap.get(rowIdx)
  if (existing && resizeObserver && el !== existing) {
    resizeObserver.unobserve(existing)
  }

  if (el instanceof HTMLElement) {
    trackElMap.set(rowIdx, el)
    resizeObserver?.observe(el)
  } else {
    trackElMap.delete(rowIdx)
  }
}

const shouldRunLoop = (): boolean =>
  import.meta.client &&
  isInViewport &&
  !isTabHidden &&
  activeCustodianIndex.value === null

const stopStreamLoop = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

const tickStreams = (now: number) => {
  if (!shouldRunLoop()) {
    rafId = null
    return
  }

  const dt = lastFrameTime > 0 ? Math.min(36, Math.max(8, now - lastFrameTime)) : 16.67
  lastFrameTime = now
  const frameScale = dt / 16.67

  for (let r = 0; r < rowStates.length; r++) {
    const state = rowStates[r]!
    if (state.setWidthPx <= 0 || state.isDragging) continue

    let deltaPx = 0

    if (Math.abs(state.inertiaVelocity) > 0.08) {
      deltaPx += state.inertiaVelocity * frameScale
      state.inertiaVelocity *= Math.pow(0.935, frameScale)
      if (Math.abs(state.inertiaVelocity) <= 0.08) {
        state.inertiaVelocity = 0
      }
    }

    const shouldPauseAuto =
      prefersReducedMotion || state.isHovered || now < state.resumeHoldUntil
    const targetScale = shouldPauseAuto ? 0 : 1
    state.speedScale += (targetScale - state.speedScale) * Math.min(1, 0.09 * frameScale)

    if (state.speedScale > 0.004) {
      deltaPx +=
        state.direction * state.baseSpeedPxPerFrame * state.speedScale * frameScale
    }

    if (Math.abs(deltaPx) > 0.001) {
      state.offsetPx = wrapStreamOffset(state.offsetPx + deltaPx, state.setWidthPx)
      applyTrackTransform(r)
    }
  }

  rafId = requestAnimationFrame(tickStreams)
}

const syncStreamLoop = () => {
  if (shouldRunLoop()) {
    if (rafId === null) {
      lastFrameTime = 0
      rafId = requestAnimationFrame(tickStreams)
    }
  } else {
    stopStreamLoop()
  }
}

// =========================================================
// DIRECT ROW POINTER DRAG & TOUCH SWIPE HANDLERS
// =========================================================
let activeGestureRow = -1
let gestureStartX = 0
let gestureStartY = 0
let gestureStartOffset = 0
let gestureLockAxis: 'x' | 'y' | null = null
let suppressCapsuleClick = false
let velocityHistory: Array<{ x: number; t: number }> = []

const onRowMouseEnter = (rowIdx: number) => {
  const state = rowStates[rowIdx]
  if (state) state.isHovered = true
}

const onRowMouseLeave = (rowIdx: number) => {
  const state = rowStates[rowIdx]
  if (state) state.isHovered = false
}

const recordVelocityPoint = (x: number) => {
  const now = performance.now()
  velocityHistory.push({ x, t: now })
  const cutoff = now - 90
  while (velocityHistory.length > 2 && (velocityHistory[0]?.t ?? 0) < cutoff) {
    velocityHistory.shift()
  }
}

const computeReleaseInertia = (): number => {
  const now = performance.now()
  const first = velocityHistory[0]
  const last = velocityHistory[velocityHistory.length - 1]
  if (!first || !last || now - last.t > 75 || last.t <= first.t) return 0
  const pxPerMs = (last.x - first.x) / (last.t - first.t)
  return Math.max(-24, Math.min(24, pxPerMs * 16.67))
}

const onWindowPointerMove = (e: PointerEvent) => {
  if (activeGestureRow < 0) return
  const state = rowStates[activeGestureRow]
  if (!state || !state.isDragging) return

  const dx = e.clientX - gestureStartX
  if (Math.abs(dx) > 5) {
    suppressCapsuleClick = true
  }

  if (suppressCapsuleClick && state.setWidthPx > 0) {
    e.preventDefault()
    state.offsetPx = wrapStreamOffset(gestureStartOffset + dx, state.setWidthPx)
    applyTrackTransform(activeGestureRow)
  }

  recordVelocityPoint(e.clientX)
}

const onWindowPointerUp = () => {
  if (activeGestureRow < 0) return
  const rowIdx = activeGestureRow
  const state = rowStates[rowIdx]

  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
  window.removeEventListener('pointercancel', onWindowPointerUp)

  if (state) {
    state.isDragging = false
    if (suppressCapsuleClick) {
      state.inertiaVelocity = computeReleaseInertia()
      state.resumeHoldUntil = performance.now() + 420
    }
  }

  activeGestureRow = -1
  draggingRowIndex.value = null
  syncStreamLoop()

  setTimeout(() => {
    suppressCapsuleClick = false
  }, 55)
}

const onRowPointerDown = (rowIdx: number, e: PointerEvent) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  ensureRowStates()
  const state = rowStates[rowIdx]
  if (!state) return

  activeGestureRow = rowIdx
  draggingRowIndex.value = rowIdx
  suppressCapsuleClick = false
  state.isDragging = true
  state.inertiaVelocity = 0
  gestureStartX = e.clientX
  gestureStartOffset = state.offsetPx
  velocityHistory = [{ x: e.clientX, t: performance.now() }]

  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
  window.addEventListener('pointercancel', onWindowPointerUp)
}

const onRowTouchStart = (rowIdx: number, e: TouchEvent) => {
  const t = e.touches[0]
  if (!t) return
  ensureRowStates()
  const state = rowStates[rowIdx]
  if (!state) return

  activeGestureRow = rowIdx
  gestureStartX = t.clientX
  gestureStartY = t.clientY
  gestureStartOffset = state.offsetPx
  gestureLockAxis = null
  suppressCapsuleClick = false
  state.isDragging = true
  state.inertiaVelocity = 0
  velocityHistory = [{ x: t.clientX, t: performance.now() }]
}

const onRowTouchMove = (rowIdx: number, e: TouchEvent) => {
  if (activeGestureRow !== rowIdx) return
  const t = e.touches[0]
  const state = rowStates[rowIdx]
  if (!t || !state) return

  const dx = t.clientX - gestureStartX
  const dy = t.clientY - gestureStartY

  if (gestureLockAxis === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
    gestureLockAxis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y'
    if (gestureLockAxis === 'y') {
      state.isDragging = false
      state.resumeHoldUntil = performance.now() + 300
      activeGestureRow = -1
      return
    }
  }

  if (gestureLockAxis === 'x' && state.setWidthPx > 0) {
    suppressCapsuleClick = true
    state.offsetPx = wrapStreamOffset(gestureStartOffset + dx, state.setWidthPx)
    applyTrackTransform(rowIdx)
    recordVelocityPoint(t.clientX)
  }
}

const onRowTouchEnd = (rowIdx: number) => {
  const state = rowStates[rowIdx]
  if (state && state.isDragging) {
    state.isDragging = false
    if (gestureLockAxis === 'x') {
      state.inertiaVelocity = computeReleaseInertia()
    }
    state.resumeHoldUntil = performance.now() + 550
  }
  activeGestureRow = -1
  gestureLockAxis = null
  syncStreamLoop()

  setTimeout(() => {
    suppressCapsuleClick = false
  }, 55)
}

// =========================================================
// CENTERED TRANSLUCENT DOSSIER MODAL + LENIS SCROLL LOCK
// =========================================================
const activeCustodianIndex = ref<number | null>(null)
const modalSlideDirection = ref<'next' | 'prev'>('next')

const totalMembers = computed(() => props.data.members.length)

const activeCustodian = computed<CommunityMemberItem | null>(() => {
  const idx = activeCustodianIndex.value
  if (idx === null) return null
  return props.data.members[idx] || null
})

const activeModalTint = computed<CommunityCapsuleTint>(() => {
  const idx = activeCustodianIndex.value
  const member = activeCustodian.value
  if (idx === null || !member) return 'cream'
  if (member.tint && member.tint in modalHeaderTintMap) return member.tint
  return TINT_SEQUENCE[idx % TINT_SEQUENCE.length]!
})

const formatCounter = (num: number): string => String(num).padStart(2, '0')

const setBackgroundScrollLock = (locked: boolean) => {
  if (!import.meta.client) return
  if (locked) {
    document.documentElement.classList.add('community-modal-lock')
    lenisState.value?.stop()
  } else {
    document.documentElement.classList.remove('community-modal-lock')
    lenisState.value?.start()
  }
}

const openDossier = (globalIdx: number) => {
  if (suppressCapsuleClick) {
    suppressCapsuleClick = false
    return
  }
  if (globalIdx < 0 || globalIdx >= totalMembers.value) return
  modalSlideDirection.value = 'next'
  activeCustodianIndex.value = globalIdx
  setBackgroundScrollLock(true)
  syncStreamLoop()
}

const closeDossier = () => {
  if (activeCustodianIndex.value === null) return
  activeCustodianIndex.value = null
  setBackgroundScrollLock(false)
  syncStreamLoop()
}

const stepDossier = (delta: -1 | 1) => {
  const current = activeCustodianIndex.value
  const total = totalMembers.value
  if (current === null || total <= 1) return
  modalSlideDirection.value = delta > 0 ? 'next' : 'prev'
  activeCustodianIndex.value = (((current + delta) % total) + total) % total
}

let modalSwipeStartX = 0
let modalSwipeStartY = 0

const onModalTouchStart = (e: TouchEvent) => {
  const t = e.touches[0]
  if (!t) return
  modalSwipeStartX = t.clientX
  modalSwipeStartY = t.clientY
}

const onModalTouchEnd = (e: TouchEvent) => {
  const t = e.changedTouches[0]
  if (!t) return
  const dx = t.clientX - modalSwipeStartX
  const dy = t.clientY - modalSwipeStartY
  if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    stepDossier(dx < 0 ? 1 : -1)
  }
}

const onWindowKeydown = (e: KeyboardEvent) => {
  if (activeCustodianIndex.value === null) return
  if (e.key === 'Escape') {
    e.preventDefault()
    closeDossier()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    stepDossier(1)
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    stepDossier(-1)
  }
}

const onVisibilityChange = () => {
  if (!import.meta.client) return
  isTabHidden = document.hidden
  syncStreamLoop()
}

watch(
  () => props.data.members.length,
  () => {
    nextTick(() => {
      measureAllTrackSetWidths()
      syncStreamLoop()
    })
  }
)

onMounted(() => {
  prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      measureAllTrackSetWidths()
    })
  }

  nextTick(() => {
    trackElMap.forEach((el) => resizeObserver?.observe(el))
    measureAllTrackSetWidths()

    if (typeof IntersectionObserver !== 'undefined' && sectionRef.value) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry) {
            isInViewport = entry.isIntersecting
            syncStreamLoop()
          }
        },
        { rootMargin: '120px 0px' }
      )
      intersectionObserver.observe(sectionRef.value)
    }

    syncStreamLoop()
  })

  window.addEventListener('keydown', onWindowKeydown)
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  stopStreamLoop()
  setBackgroundScrollLock(false)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
  if (import.meta.client) {
    window.removeEventListener('keydown', onWindowKeydown)
    window.removeEventListener('pointermove', onWindowPointerMove)
    window.removeEventListener('pointerup', onWindowPointerUp)
    window.removeEventListener('pointercancel', onWindowPointerUp)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
})
</script>

<template>
  <section
    ref="sectionRef"
    data-theme="light"
    aria-label="Local Community Custodians"
    class="community-section-shell mt-10"
  >
    <!-- 1. NON-COMPETING ARCHITECTURAL CONNECTOR & INTERACTIVE LEDGER PILL -->
    <div v-motion-micro-up class="community-bridge-header">
      <div aria-hidden="true" class="community-bridge-stem" />

      <div class="community-ledger-pill">
        <span aria-hidden="true" class="community-live-dot" />
        <span class="card-tag font-semibold text-journey-deep">
          {{ `${totalMembers} ${data.ledgerNoun || 'Local Custodians'}` }}
        </span>
        <span aria-hidden="true" class="text-dark-gold/60">·</span>
        <span class="card-tag text-muted">
          {{ data.interactionHint || 'Tap any person for their story · Drag stream' }}
        </span>
      </div>
    </div>

    <!-- 2. ALTERNATING CONTINUOUS CAPSULE STREAMS (Desktop & Mobile) -->
    <div
      data-lenis-prevent-horizontal
      class="community-streams-stage"
    >
      <div aria-hidden="true" class="community-edge-fade-left" />
      <div aria-hidden="true" class="community-edge-fade-right" />

      <div
        v-for="(rowItems, rIdx) in streamRows"
        :key="`stream-row-${rIdx}`"
        v-motion-atelier-card
        :delay="rIdx * 80"
        :class="[
          'community-stream-row',
          draggingRowIndex === rIdx ? 'cursor-grabbing' : 'cursor-grab'
        ]"
        @mouseenter="onRowMouseEnter(rIdx)"
        @mouseleave="onRowMouseLeave(rIdx)"
        @pointerdown="onRowPointerDown(rIdx, $event)"
        @touchstart.passive="onRowTouchStart(rIdx, $event)"
        @touchmove.passive="onRowTouchMove(rIdx, $event)"
        @touchend.passive="onRowTouchEnd(rIdx)"
        @touchcancel.passive="onRowTouchEnd(rIdx)"
      >
        <div
          :ref="(el) => setTrackRef(rIdx, el)"
          class="community-stream-track"
        >
          <button
            v-for="item in rowItems"
            :key="item.renderKey"
            type="button"
            :tabindex="item.isPrimaryCopy ? 0 : -1"
            :aria-hidden="!item.isPrimaryCopy || undefined"
            :aria-label="`${item.member.name}, ${item.member.role} from ${item.member.location}`"
            :class="[
              'group community-capsule',
              capsuleTintClassMap[item.tint]
            ]"
            @click="openDossier(item.globalIndex)"
          >
            <!-- Left Circular Portrait -->
            <span class="community-capsule-avatar">
              <img
                :src="item.member.img"
                :alt="item.member.alt || item.member.name"
                width="96"
                height="96"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                draggable="false"
                class="w-full h-full object-cover transition-transform duration-500 ease-editorial group-hover:scale-108"
                @error="onAvatarError"
              />
            </span>

            <!-- Snug Stacked Name + Designation -->
            <span class="flex flex-col items-start min-w-0">
              <span class="community-capsule-name">
                {{ item.member.name }}
              </span>
              <span class="card-tag community-capsule-role">
                {{ item.member.role }}
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. CENTERED TRANSLUCENT FROSTED DOSSIER MODAL -->
    <Teleport to="body">
      <Transition name="community-backdrop">
        <div
          v-if="activeCustodian && activeCustodianIndex !== null"
          role="dialog"
          aria-modal="true"
          :aria-label="`${activeCustodian.name} — ${activeCustodian.role}`"
          class="community-modal-backdrop"
          @click.self="closeDossier"
        >
          <div
            class="community-modal-card community-modal-pop"
            @touchstart.passive="onModalTouchStart"
            @touchend.passive="onModalTouchEnd"
          >
            <button
              type="button"
              aria-label="Close story card"
              class="community-modal-close-btn"
              @click="closeDossier"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <Transition
              :name="
                modalSlideDirection === 'next'
                  ? 'community-dossier-next'
                  : 'community-dossier-prev'
              "
              mode="out-in"
            >
              <div :key="activeCustodian.id" class="w-full flex flex-col">
                <div
                  :class="[
                    'community-modal-header',
                    modalHeaderTintMap[activeModalTint]
                  ]"
                >
                  <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1"
                    aria-hidden="true"
                    class="community-modal-watermark"
                  >
                    <circle cx="120" cy="0" r="88" />
                    <circle cx="120" cy="0" r="62" stroke-dasharray="3 4" />
                  </svg>

                  <div class="relative z-10 flex items-center gap-4 sm:gap-5 pr-8">
                    <div class="community-modal-avatar">
                      <img
                        :src="activeCustodian.img"
                        :alt="activeCustodian.alt || activeCustodian.name"
                        width="160"
                        height="160"
                        decoding="async"
                        class="w-full h-full object-cover"
                        @error="onAvatarError"
                      />
                    </div>

                    <div class="flex flex-col items-start min-w-0">
                      <span class="card-eyebrow text-dark-gold font-semibold mb-0.5!">
                        {{ activeCustodian.role }}
                      </span>

                      <h3 class="subsection-title text-journey-deep">
                        {{ activeCustodian.name }}
                      </h3>

                      <div class="inline-flex items-center gap-1.5 mt-1.5 text-muted">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          aria-hidden="true"
                          class="w-3.5 h-3.5 text-dark-gold shrink-0"
                        >
                          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span class="card-tag text-secondary-light/80 whitespace-normal!">
                          {{ activeCustodian.location }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="community-modal-body">
                  <p class="section-paragraph text-secondary-light">
                    {{ activeCustodian.desc }}
                  </p>
                </div>
              </div>
            </Transition>

            <div v-if="totalMembers > 1" class="community-modal-footer">
              <button
                type="button"
                aria-label="Previous community member"
                class="community-modal-step-btn"
                @click="stepDossier(-1)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="card-tag font-semibold">Prev</span>
              </button>

              <span class="card-tag text-muted tabular-nums">
                {{ `${formatCounter(activeCustodianIndex + 1)} / ${formatCounter(totalMembers)}` }}
              </span>

              <button
                type="button"
                aria-label="Next community member"
                class="community-modal-step-btn"
                @click="stepDossier(1)"
              >
                <span class="card-tag font-semibold">Next</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.community-backdrop-enter-active,
.community-backdrop-leave-active {
  transition: opacity 340ms var(--ease-editorial);
}

.community-backdrop-enter-from,
.community-backdrop-leave-to {
  opacity: 0;
}

.community-backdrop-enter-active .community-modal-pop,
.community-backdrop-leave-active .community-modal-pop {
  transition:
    transform 420ms var(--ease-editorial),
    opacity 340ms var(--ease-editorial);
}

.community-backdrop-enter-from .community-modal-pop,
.community-backdrop-leave-to .community-modal-pop {
  opacity: 0;
  transform: translate3d(0, 14px, 0) scale(0.95);
}

.community-dossier-next-enter-active,
.community-dossier-next-leave-active,
.community-dossier-prev-enter-active,
.community-dossier-prev-leave-active {
  transition:
    opacity 240ms var(--ease-editorial),
    transform 240ms var(--ease-editorial);
}

.community-dossier-next-enter-from {
  opacity: 0;
  transform: translate3d(16px, 0, 0);
}

.community-dossier-next-leave-to {
  opacity: 0;
  transform: translate3d(-16px, 0, 0);
}

.community-dossier-prev-enter-from {
  opacity: 0;
  transform: translate3d(-16px, 0, 0);
}

.community-dossier-prev-leave-to {
  opacity: 0;
  transform: translate3d(16px, 0, 0);
}
</style>
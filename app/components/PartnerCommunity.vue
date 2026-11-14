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
  coverImg?: string
  coverAlt?: string
  tint?: CommunityCapsuleTint | (string & {})
}

export interface PartnerCommunityConfig {
  eyebrow?: string
  title?: string
  description?: string
  ledgerNoun?: string
  interactionHint?: string
  fallbackImage?: string
  fallbackCoverImage?: string
  members: CommunityMemberItem[]
}

// Centralized stream distribution, physics & ring-ignition constants
const STREAM_PHYSICS = {
  minRows: 4,
  maxItemsPerRow: 15,
  minSetItems: 15,
  rowSpeeds: [0.58, 0.48, 0.62, 0.52, 0.58, 0.5],
  hoverSpeedScale: 0.38, // <- 0.38 = slows to 38% speed on hover (tweak 0.3–0.6 anytime)
  rowInitialPhases: [0.06, 0.34, 0.18, 0.46, 0.26, 0.12],
  inertiaFriction: 0.935,
  maxInertiaPx: 24,
  dragThresholdPx: 5,
  wheelHoldMs: 520,
  dragHoldMs: 420,
  touchHoldMs: 550,
  ringIgniteMs: 140
} as const

const props = defineProps<{
  data: PartnerCommunityConfig
}>()

const lenisState = useState<Lenis | null>('lenis-instance', () => null)

const TINT_SEQUENCE: CommunityCapsuleTint[] = ['cream', 'sky', 'peach', 'sage']
const HONORIFIC_OR_INITIAL_RE = /^(?:dr|mr|mrs|ms|smt|sri|shri|ustad|vidwan|prof|guru)\.?$|^[a-z](?:\.[a-z])*\.?$/i

const medallionTintClassMap: Record<CommunityCapsuleTint, string> = {
  cream: 'community-medallion-cream',
  sky: 'community-medallion-sky',
  peach: 'community-medallion-peach',
  sage: 'community-medallion-sage'
}

const resolveMemberTint = (
  member: CommunityMemberItem,
  rowIdx: number,
  itemIdx: number
): CommunityCapsuleTint => {
  const key = member.tint?.trim().toLowerCase()
  if (key && key in medallionTintClassMap) {
    return key as CommunityCapsuleTint
  }
  return TINT_SEQUENCE[(rowIdx * 2 + itemIdx) % TINT_SEQUENCE.length]!
}

// Extracts true given name cleanly (skips "Dr.", "Smt.", or South Indian initials like "K.")
const extractFirstName = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return ''
  for (const token of parts) {
    if (!HONORIFIC_OR_INITIAL_RE.test(token)) {
      return token
    }
  }
  return parts[0]!
}

const fallbackImgSrc = computed(
  () => props.data.fallbackImage || '/images/fallbacks/culture.webp'
)

const fallbackCoverSrc = computed(
  () => props.data.fallbackCoverImage || fallbackImgSrc.value
)

const resolveCoverImg = (member: CommunityMemberItem): string =>
  member.coverImg || fallbackCoverSrc.value

const onAvatarError = (e: Event) => {
  const img = e.target as HTMLImageElement | null
  if (img && img.src !== fallbackImgSrc.value) {
    img.src = fallbackImgSrc.value
  }
}

const onCoverError = (e: Event) => {
  const img = e.target as HTMLImageElement | null
  if (img && img.src !== fallbackCoverSrc.value) {
    img.src = fallbackCoverSrc.value
  }
}

// =========================================================
// DYNAMIC ROW ENGINE: 4 ROWS MIN, MAX 15/ROW, 5TH ROW AT >60
// (32 -> 8,8,8,8 | 33 -> 9,8,8,8 | 34 -> 9,9,8,8 | 61 -> 5 rows)
// =========================================================
interface IndexedCustodian {
  member: CommunityMemberItem
  globalIndex: number
  tint: CommunityCapsuleTint
  firstName: string
  arcCharCount: number
}

interface StreamRenderItem extends IndexedCustodian {
  renderKey: string
  copyIdx: number
  isPrimaryCopy: boolean
}

const streamCount = computed(() => {
  const total = props.data.members.length
  if (total <= 0) return 0
  return Math.max(
    STREAM_PHYSICS.minRows,
    Math.ceil(total / STREAM_PHYSICS.maxItemsPerRow)
  )
})

const rowBuckets = computed<IndexedCustodian[][]>(() => {
  const all = props.data.members
  const rowsCount = streamCount.value
  if (!all.length || rowsCount <= 0) return []

  const buckets: IndexedCustodian[][] = Array.from({ length: rowsCount }, () => [])

  all.forEach((member, globalIndex) => {
    const rowIdx = globalIndex % rowsCount
    const bucket = buckets[rowIdx]!
    const firstName = extractFirstName(member.name)
    bucket.push({
      member,
      globalIndex,
      tint: resolveMemberTint(member, rowIdx, bucket.length),
      firstName,
      arcCharCount: firstName.length + 3 + member.role.trim().length
    })
  })

  return buckets.filter((bucket) => bucket.length > 0)
})

const baseSetLengths = computed<number[]>(() =>
  rowBuckets.value.map((bucket) => {
    const repeatFactor = Math.max(
      1,
      Math.ceil(STREAM_PHYSICS.minSetItems / bucket.length)
    )
    return bucket.length * repeatFactor
  })
)

const streamRows = computed<StreamRenderItem[][]>(() =>
  rowBuckets.value.map((bucket, rIdx) => {
    const repeatFactor = Math.max(
      1,
      Math.ceil(STREAM_PHYSICS.minSetItems / bucket.length)
    )
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
)

// =========================================================
// PER-ROW ZIGZAG DRIFT + DRAG / SWIPE / TRACKPAD PHYSICS
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

const sectionRef = ref<HTMLElement | null>(null)
const trackElMap = new Map<number, HTMLElement>()
const draggingRowIndex = ref<number | null>(null)
const ignitingRenderKey = ref<string | null>(null)
const rowStates: RowPhysicsState[] = []

let rafId: number | null = null
let lastFrameTime = 0
let isInViewport = true
let isTabHidden = false
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let igniteTimeoutId: ReturnType<typeof setTimeout> | null = null

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
      baseSpeedPxPerFrame:
        STREAM_PHYSICS.rowSpeeds[idx % STREAM_PHYSICS.rowSpeeds.length]!,
      speedScale: 1,
      isHovered: false,
      isDragging: false,
      inertiaVelocity: 0,
      resumeHoldUntil: 0
    })
  }
  if (rowStates.length > needed) {
    rowStates.length = needed
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
    state.direction = rowIdx % 2 === 0 ? -1 : 1

    if (wasUninitialized) {
      const phase =
        STREAM_PHYSICS.rowInitialPhases[
          rowIdx % STREAM_PHYSICS.rowInitialPhases.length
        ]!
      state.offsetPx = wrapStreamOffset(
        -measuredWidth * (1 + phase),
        measuredWidth
      )
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
      state.inertiaVelocity *= Math.pow(STREAM_PHYSICS.inertiaFriction, frameScale)
      if (Math.abs(state.inertiaVelocity) <= 0.08) {
        state.inertiaVelocity = 0
      }
    }

    let targetScale = 1
    if (now < state.resumeHoldUntil) {
      targetScale = 0
    } else if (state.isHovered) {
      targetScale = STREAM_PHYSICS.hoverSpeedScale
    }
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
// POINTER DRAG, AXIS-LOCKED TOUCH SWIPE & TRACKPAD HORIZONTAL WHEEL
// =========================================================
let activeGestureRow = -1
let gestureStartX = 0
let gestureStartY = 0
let gestureStartOffset = 0
let gestureLockAxis: 'x' | 'y' | null = null
let suppressMedallionClick = false
let velocityHistory: Array<{ x: number; t: number }> = []

const onRowMouseEnter = (rowIdx: number) => {
  const state = rowStates[rowIdx]
  if (state) state.isHovered = true
}

const onRowMouseLeave = (rowIdx: number) => {
  const state = rowStates[rowIdx]
  if (state) state.isHovered = false
}

const onRowWheel = (rowIdx: number, e: WheelEvent) => {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 1.5) return
  ensureRowStates()
  const state = rowStates[rowIdx]
  if (!state || state.setWidthPx <= 0) return

  e.preventDefault()
  state.offsetPx = wrapStreamOffset(state.offsetPx - e.deltaX, state.setWidthPx)
  state.inertiaVelocity = Math.max(
    -STREAM_PHYSICS.maxInertiaPx,
    Math.min(STREAM_PHYSICS.maxInertiaPx, -e.deltaX * 0.32)
  )
  state.resumeHoldUntil = performance.now() + STREAM_PHYSICS.wheelHoldMs
  applyTrackTransform(rowIdx)
  syncStreamLoop()
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
  return Math.max(
    -STREAM_PHYSICS.maxInertiaPx,
    Math.min(STREAM_PHYSICS.maxInertiaPx, pxPerMs * 16.67)
  )
}

const onWindowPointerMove = (e: PointerEvent) => {
  if (activeGestureRow < 0) return
  const state = rowStates[activeGestureRow]
  if (!state || !state.isDragging) return

  const dx = e.clientX - gestureStartX
  if (Math.abs(dx) > STREAM_PHYSICS.dragThresholdPx) {
    suppressMedallionClick = true
  }

  if (suppressMedallionClick && state.setWidthPx > 0) {
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
    if (suppressMedallionClick) {
      state.inertiaVelocity = computeReleaseInertia()
      state.resumeHoldUntil = performance.now() + STREAM_PHYSICS.dragHoldMs
    }
  }

  activeGestureRow = -1
  draggingRowIndex.value = null
  syncStreamLoop()

  setTimeout(() => {
    suppressMedallionClick = false
  }, 55)
}

const onRowPointerDown = (rowIdx: number, e: PointerEvent) => {
  if (e.pointerType !== 'mouse' || e.button !== 0) return
  ensureRowStates()
  const state = rowStates[rowIdx]
  if (!state) return

  activeGestureRow = rowIdx
  draggingRowIndex.value = rowIdx
  suppressMedallionClick = false
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
  suppressMedallionClick = false
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
    suppressMedallionClick = true
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
    state.resumeHoldUntil = performance.now() + STREAM_PHYSICS.touchHoldMs
  }
  activeGestureRow = -1
  gestureLockAxis = null
  syncStreamLoop()

  setTimeout(() => {
    suppressMedallionClick = false
  }, 55)
}

// =========================================================
// RING LIGHT-UP IGNITION BEAT + COVER DOSSIER MODAL
// =========================================================
const activeCustodianIndex = ref<number | null>(null)
const modalSlideDirection = ref<'next' | 'prev'>('next')

const totalMembers = computed(() => props.data.members.length)
const hasSectionHeader = computed(() =>
  Boolean(props.data.eyebrow || props.data.title || props.data.description)
)

const activeCustodian = computed<CommunityMemberItem | null>(() => {
  const idx = activeCustodianIndex.value
  if (idx === null) return null
  return props.data.members[idx] || null
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

const handleMedallionClick = (globalIdx: number, renderKey: string) => {
  if (suppressMedallionClick) {
    suppressMedallionClick = false
    return
  }
  if (globalIdx < 0 || globalIdx >= totalMembers.value) return

  // Brief 140ms full-opacity ring light-up before mounting dossier modal
  ignitingRenderKey.value = renderKey
  if (igniteTimeoutId) clearTimeout(igniteTimeoutId)

  igniteTimeoutId = setTimeout(() => {
    modalSlideDirection.value = 'next'
    activeCustodianIndex.value = globalIdx
    ignitingRenderKey.value = null
    setBackgroundScrollLock(true)
    syncStreamLoop()
  }, STREAM_PHYSICS.ringIgniteMs)
}

const closeDossier = () => {
  if (igniteTimeoutId) {
    clearTimeout(igniteTimeoutId)
    igniteTimeoutId = null
  }
  ignitingRenderKey.value = null
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
      trackElMap.forEach((el) => resizeObserver?.observe(el))
      measureAllTrackSetWidths()
      syncStreamLoop()
    })
  }
)

onMounted(() => {

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
  if (igniteTimeoutId) clearTimeout(igniteTimeoutId)
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
    class="community-section-shell bg-bg-light"
  >
    <!-- Shared Zero-Footprint SVG Defs: Concentric Rim Arc + 4 Tapered Mineral Ring Gradients -->
    <svg
      aria-hidden="true"
      class="pointer-events-none absolute w-0 h-0 overflow-hidden opacity-0"
    >
      <defs>
        <!-- Concentric Upper Arc (Center 84,84 | Radius 59.5 -> ~2.5px outside R=56.1 rim) -->
        <path
          id="community-rim-arc"
          d="M 41.57 126.43 A 60 60 0 1 1 126.43 126.43"
        />

        <linearGradient id="community-ring-cream" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a6741e" stop-opacity="0.14" />
          <stop offset="50%" stop-color="#a6741e" stop-opacity="0.58" />
          <stop offset="100%" stop-color="#a6741e" stop-opacity="0.95" />
        </linearGradient>

        <linearGradient id="community-ring-sky" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#285884" stop-opacity="0.14" />
          <stop offset="50%" stop-color="#285884" stop-opacity="0.58" />
          <stop offset="100%" stop-color="#285884" stop-opacity="0.95" />
        </linearGradient>

        <linearGradient id="community-ring-peach" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a24e30" stop-opacity="0.14" />
          <stop offset="50%" stop-color="#a24e30" stop-opacity="0.58" />
          <stop offset="100%" stop-color="#a24e30" stop-opacity="0.95" />
        </linearGradient>

        <linearGradient id="community-ring-sage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2f6144" stop-opacity="0.14" />
          <stop offset="50%" stop-color="#2f6144" stop-opacity="0.58" />
          <stop offset="100%" stop-color="#2f6144" stop-opacity="0.95" />
        </linearGradient>
      </defs>
    </svg>

    <!-- 1. EDITORIAL SECTION HEADER -->
    <div v-if="hasSectionHeader" class="community-header-wrap">
      <div v-if="data.eyebrow" v-motion-fade-up class="eyebrow-wrapper">
        <div class="bg-dark-gold/70 eyebrow-border" />
        <span class="text-journey-deep/95 eyebrow-text">
          {{ data.eyebrow }}
        </span>
        <div class="bg-dark-gold/70 eyebrow-border" />
      </div>

      <h2
        v-if="data.title"
        v-motion-fade-up
        :delay="90"
        class="section-title-wrapper drop-shadow-none!"
      >
        <span class="text-journey-deep section-subtitle">
          {{ data.title }}
        </span>
      </h2>

      <p
        v-if="data.description"
        v-motion-fade-up
        :delay="170"
        class="section-paragraph text-secondary-light max-w-3xl"
      >
        {{ data.description }}
      </p>
    </div>

    <!-- 2. LIVE INTERACTIVE LEDGER PILL -->
    <div v-motion-micro-up :delay="hasSectionHeader ? 220 : 0" class="community-bridge-header">
      <div class="community-ledger-pill">
        <span aria-hidden="true" class="community-live-dot" />
        <span class="card-tag font-semibold text-journey-deep pt-1.25">
          {{ `${totalMembers} ${data.ledgerNoun || 'Local Custodians'}` }}
        </span>
        <span aria-hidden="true" class="hidden xs:inline text-dark-gold/60">·</span>
        <span class="card-tag text-muted pt-1.25">
          {{ data.interactionHint || 'Tap any person for their story · Drag stream' }}
        </span>
      </div>
    </div>

    <!-- 3. ALTERNATING ZIGZAG CIRCULAR MEDALLION STREAMS (4+ Rows) -->
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
        :delay="rIdx * 70"
        :class="[
          'community-stream-row',
          draggingRowIndex === rIdx ? 'cursor-grabbing' : 'cursor-grab'
        ]"
        @mouseenter="onRowMouseEnter(rIdx)"
        @mouseleave="onRowMouseLeave(rIdx)"
        @wheel="onRowWheel(rIdx, $event)"
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
              'group community-medallion',
              medallionTintClassMap[item.tint]
            ]"
            @click="handleMedallionClick(item.globalIndex, item.renderKey)"
          >
            <!-- Concentric Layer 1: Circular Portrait (DevTools-Clean 160x160 + aspect-square) -->
            <span class="community-medallion-avatar">
              <img
                :src="item.member.img"
                :alt="item.member.alt || item.member.name"
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                draggable="false"
                class="pointer-events-none block w-full h-auto aspect-square object-cover transition-transform duration-500 ease-editorial group-hover:scale-107 group-active:scale-104"
                @error="onAvatarError"
              />
            </span>

            <!-- Concentric Layer 2: Tapered Fading Ring + Click Light-Up + Rim-Hugging Arc Text -->
            <svg
              viewBox="0 0 168 168"
              fill="none"
              aria-hidden="true"
              class="community-medallion-svg"
            >
              <!-- Ambient Tapered Multi-Tint Ring (Warms on Hover) -->
              <circle
                cx="84"
                cy="84"
                r="56.1"
                :stroke="`url(#community-ring-${item.tint})`"
                stroke-width="1.6"
                class="transition-opacity duration-300 ease-editorial"
                :class="
                  ignitingRenderKey === item.renderKey
                    ? 'opacity-100'
                    : 'opacity-40 group-hover:opacity-85 group-active:opacity-90'
                "
              />

              <!-- Click Ignition Ring (Same Width, Flashes to Full Opacity Right Before Popup) -->
              <circle
                cx="84"
                cy="84"
                r="56.1"
                stroke="var(--medallion-solid)"
                stroke-width="1.6"
                class="transition-opacity duration-150 ease-out"
                :class="ignitingRenderKey === item.renderKey ? 'opacity-100' : 'opacity-0'"
              />

              <!-- Curved FirstName • Profession (~2.5px Outside Rim Edge) -->
              <text
                font-size="10"
                letter-spacing="1.2"
                class="font-primary uppercase"
              >
                <textPath
                  href="#community-rim-arc"
                  startOffset="50%"
                  text-anchor="middle"
                ><tspan class="fill-journey-deep font-semibold">{{ item.firstName.toUpperCase() }}</tspan><tspan class="fill-dark-gold font-semibold"> • </tspan><tspan class="fill-secondary-light font-medium">{{ item.member.role.toUpperCase() }}</tspan></textPath>
              </text>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 4. CENTERED COVER-BANNER + OVERLAPPING PORTRAIT DOSSIER MODAL -->
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
                <!-- Top Atmospheric Cover Image + Delicate Inset Frame Border -->
                <div class="community-modal-cover">
                  <img
                    :src="resolveCoverImg(activeCustodian)"
                    :alt="activeCustodian.coverAlt || `${activeCustodian.name} — ${activeCustodian.location}`"
                    width="640"
                    height="400"
                    decoding="async"
                    draggable="false"
                    class="pointer-events-none block w-full h-full aspect-16/10 object-cover"
                    @error="onCoverError"
                  />
                  <div
                    aria-hidden="true"
                    class="pointer-events-none absolute inset-0 bg-linear-to-t from-journey-deep/35 via-transparent to-journey-deep/20"
                  />
                  <div aria-hidden="true" class="community-modal-cover-frame" />
                </div>

                <!-- Straddling Enlarged Circular Portrait -->
                <div class="community-modal-avatar-shell">
                  <div class="w-full h-full rounded-full overflow-hidden bg-surface-frosted">
                    <img
                      :src="activeCustodian.img"
                      :alt="activeCustodian.alt || activeCustodian.name"
                      width="224"
                      height="224"
                      decoding="async"
                      draggable="false"
                      class="pointer-events-none block w-full h-auto aspect-square object-cover"
                      @error="onAvatarError"
                    />
                  </div>
                </div>

                <!-- Centered Identity Stack + Gold Divider + Lenis-Isolated Bio -->
                <div class="community-modal-body">
                  <h3 class="font-primary font-normal text-2xl sm:text-[1.68rem] text-journey-deep leading-tight tracking-[-0.01em]">
                    {{ activeCustodian.name }}
                  </h3>

                  <span class="card-eyebrow text-dark-gold font-semibold tracking-[0.18em] mt-1.5 mb-0!">
                    {{ activeCustodian.role }}
                  </span>

                  <div class="inline-flex items-center justify-center gap-1.5 mt-2 text-muted">
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
                    <span class="card-tag uppercase tracking-[0.14em] text-secondary-light/80 whitespace-normal!">
                      {{ activeCustodian.location }}
                    </span>
                  </div>

                  <div aria-hidden="true" class="w-11 h-px bg-dark-gold/38 my-4" />

                  <div
                    data-lenis-prevent
                    class="community-modal-bio-scroll"
                  >
                    <p class="section-paragraph text-secondary-light max-w-[34ch] mx-auto leading-relaxed">
                      {{ activeCustodian.desc }}
                    </p>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Symmetric 3-Slot CSS Grid Stepper Footer -->
            <div v-if="totalMembers > 1" class="community-modal-footer">
              <button
                type="button"
                aria-label="Previous community member"
                class="community-modal-step-btn justify-self-start"
                @click="stepDossier(-1)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-3.5 h-3.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span class="card-tag font-semibold pt-1">Prev</span>
              </button>

              <span class="card-tag text-muted tabular-nums justify-self-center">
                {{ `${formatCounter(activeCustodianIndex + 1)} / ${formatCounter(totalMembers)}` }}
              </span>

              <button
                type="button"
                aria-label="Next community member"
                class="community-modal-step-btn justify-self-end"
                @click="stepDossier(1)"
              >
                <span class="card-tag font-semibold pt-1">Next</span>
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
:global(html.community-modal-lock),
:global(html.community-modal-lock body) {
  overflow: hidden !important;
}

/* --- Section Shell & Headers --- */
.community-section-shell {
  position: relative;
  width: 100%;
  padding-block: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: clip;
  background-color: var(--color-bg-light);
  color: var(--color-primary-light);
}

@media (min-width: 640px) {
  .community-section-shell {
    padding-block: 4rem;
  }
}

@media (min-width: 768px) {
  .community-section-shell {
    padding-block: 5rem;
  }
}

.community-header-wrap {
  width: 100%;
  max-width: 56rem;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-inline: 1rem;
  margin-bottom: 1.75rem;
}

@media (min-width: 640px) {
  .community-header-wrap {
    padding-inline: 1.5rem;
    margin-bottom: 2.25rem;
  }
}

.community-bridge-header {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-inline: 1rem;
  margin-bottom: 1.75rem;
}

@media (min-width: 640px) {
  .community-bridge-header {
    margin-bottom: 2.25rem;
  }
}

.community-ledger-pill {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  column-gap: 0.625rem;
  row-gap: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--color-surface-light) 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-dark-gold) 25%, transparent);
  box-shadow: 0 1px rgb(0 0 0 / 0.05);
}

@media (min-width: 640px) {
  .community-ledger-pill {
    padding-inline: 1.25rem;
  }
}

.community-live-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: var(--color-dark-gold);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-dark-gold) 20%, transparent);
  flex-shrink: 0;
}

/* --- Alternating Zigzag Streams & Edge Fades --- */
.community-streams-stage {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-block: 0.25rem;
  user-select: none;
  --community-medallion-gap: 0px;
}

@media (min-width: 640px) {
  .community-streams-stage {
    --community-medallion-gap: 0.5rem;
  }
}

@media (min-width: 1024px) {
  .community-streams-stage {
    --community-medallion-gap: 0.6rem;
  }
}

.community-edge-fade-left,
.community-edge-fade-right {
  pointer-events: none;
  position: absolute;
  inset-block: 0;
  width: 1.5rem;
  z-index: 20;
}

.community-edge-fade-left {
  left: 0;
  background-image: linear-gradient(
    to right,
    var(--color-bg-light) 0%,
    color-mix(in srgb, var(--color-bg-light) 75%, transparent) 50%,
    transparent 100%
  );
}

.community-edge-fade-right {
  right: 0;
  background-image: linear-gradient(
    to left,
    var(--color-bg-light) 0%,
    color-mix(in srgb, var(--color-bg-light) 75%, transparent) 50%,
    transparent 100%
  );
}

@media (min-width: 640px) {
  .community-edge-fade-left,
  .community-edge-fade-right {
    width: 4rem;
  }
}

@media (min-width: 768px) {
  .community-edge-fade-left,
  .community-edge-fade-right {
    width: 6rem;
  }
}

@media (min-width: 1024px) {
  .community-edge-fade-left,
  .community-edge-fade-right {
    width: 8rem;
  }
}

.community-stream-row {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-block: 0.25rem;
  margin-block: -0.75rem;
  touch-action: pan-y;
}

@media (min-width: 640px) {
  .community-stream-row {
    margin-block: -1rem;
  }
}

.community-stream-track {
  position: relative;
  display: flex;
  align-items: center;
  width: max-content;
  will-change: transform;
  gap: var(--community-medallion-gap);
}

/* --- Circular Portrait Medallion (1x1 Concentric CSS Grid) --- */
.community-medallion {
  position: relative;
  flex-shrink: 0;
  margin-inline: -0.375rem;
  width: 8.5rem;
  height: 8.5rem;
  aspect-ratio: 1 / 1;
  border-radius: 9999px;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: repeat(1, minmax(0, 1fr));
  place-items: center;
  cursor: pointer;
  outline: none;
  transition:
    transform 300ms var(--ease-editorial),
    translate 300ms var(--ease-editorial),
    scale 300ms var(--ease-editorial);
}

@media (min-width: 640px) {
  .community-medallion {
    margin-inline: -0.5rem;
    width: 9.5rem;
    height: 9.5rem;
  }
}

@media (min-width: 1024px) {
  .community-medallion {
    margin-inline: -0.625rem;
    width: 10rem;
    height: 10rem;
  }
}

@media (min-width: 1536px) {
  .community-medallion {
    width: 10.5rem;
    height: 10.5rem;
  }
}

.community-medallion:hover {
  translate: 0 -0.125rem;
}

.community-medallion:active {
  scale: 0.97;
}

.community-medallion:focus-visible {
  box-shadow: 0 0 0 2px var(--color-dark-gold);
}

.community-medallion-cream {
  --medallion-bezel: rgba(168, 122, 42, 0.2);
  --medallion-glow: rgba(168, 122, 42, 0.24);
  --medallion-solid: #a6741e;
}

.community-medallion-sky {
  --medallion-bezel: rgba(42, 88, 132, 0.2);
  --medallion-glow: rgba(42, 88, 132, 0.22);
  --medallion-solid: #285884;
}

.community-medallion-peach {
  --medallion-bezel: rgba(164, 84, 54, 0.2);
  --medallion-glow: rgba(164, 84, 54, 0.22);
  --medallion-solid: #a24e30;
}

.community-medallion-sage {
  --medallion-bezel: rgba(50, 98, 70, 0.2);
  --medallion-glow: rgba(50, 98, 70, 0.22);
  --medallion-solid: #2f6144;
}

.community-medallion-avatar {
  grid-column-start: 1;
  grid-row-start: 1;
  width: 64%;
  height: 64%;
  aspect-ratio: 1 / 1;
  border-radius: 9999px;
  overflow: hidden;
  background-color: var(--color-surface-frosted);
  border: 1px solid var(--medallion-bezel);
  box-shadow: 0 8px 18px -10px var(--medallion-glow);
  transition: box-shadow 300ms var(--ease-editorial);
}

.community-medallion:hover .community-medallion-avatar,
.community-medallion:active .community-medallion-avatar {
  box-shadow: 0 12px 24px -10px var(--medallion-glow);
}

.community-medallion-svg {
  pointer-events: none;
  user-select: none;
  grid-column-start: 1;
  grid-row-start: 1;
  width: 100%;
  height: 100%;
  overflow: visible;
  z-index: 10;
}

/* --- Centered Atmospheric Cover + Overlapping Avatar Dossier Modal --- */
.community-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9990;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: color-mix(in srgb, var(--color-journey-deep) 38%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

@media (min-width: 640px) {
  .community-modal-backdrop {
    padding: 1.5rem;
  }
}

.community-modal-card {
  position: relative;
  width: 100%;
  max-width: 25.5rem;
  border-radius: 1.5rem;
  background-color: var(--color-surface-light);
  border: 1px solid color-mix(in srgb, var(--color-dark-gold) 22%, transparent);
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
}

@media (min-width: 640px) {
  .community-modal-card {
    max-width: 27.5rem;
  }
}

.community-modal-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  background-color: var(--color-journey-deep);
  overflow: hidden;
  flex-shrink: 0;
}

.community-modal-cover-frame {
  pointer-events: none;
  position: absolute;
  inset: 0.75rem;
  border-radius: 1rem;
  border: 1px solid color-mix(in srgb, var(--color-surface-light) 30%, transparent);
  z-index: 10;
}

@media (min-width: 640px) {
  .community-modal-cover-frame {
    inset: 0.875rem;
  }
}

.community-modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 30;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--color-journey-deep) 45%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid color-mix(in srgb, var(--color-surface-light) 28%, transparent);
  color: color-mix(in srgb, var(--color-surface-light) 90%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 250ms var(--ease-editorial);
  cursor: pointer;
}

@media (min-width: 640px) {
  .community-modal-close-btn {
    top: 1.375rem;
    right: 1.375rem;
  }
}

.community-modal-close-btn:hover {
  background-color: color-mix(in srgb, var(--color-journey-deep) 75%, transparent);
  border-color: color-mix(in srgb, var(--color-dark-gold) 65%, transparent);
  color: var(--color-surface-light);
}

.community-modal-close-btn:active {
  scale: 0.95;
}

.community-modal-avatar-shell {
  position: relative;
  z-index: 20;
  margin-top: -3rem;
  margin-inline: auto;
  width: 6rem;
  height: 6rem;
  border-radius: 9999px;
  padding: 0.25rem;
  background-color: var(--color-surface-light);
  border: 1px solid color-mix(in srgb, var(--color-dark-gold) 30%, transparent);
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .community-modal-avatar-shell {
    margin-top: -3.5rem;
    width: 7rem;
    height: 7rem;
  }
}

.community-modal-body {
  padding: 0.875rem 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

@media (min-width: 640px) {
  .community-modal-body {
    padding: 1rem 2rem 1.5rem;
  }
}

.community-modal-bio-scroll {
  width: 100%;
  max-height: 10rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-inline: 0.25rem;
}

@media (min-width: 640px) {
  .community-modal-bio-scroll {
    max-height: 12rem;
  }
}

.community-modal-footer {
  padding: 0.875rem 1.25rem;
  background-color: color-mix(in srgb, var(--color-surface-medium) 55%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--color-journey-deep) 10%, transparent);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  user-select: none;
}

@media (min-width: 640px) {
  .community-modal-footer {
    padding: 1rem 1.75rem;
  }
}

.community-modal-step-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  background-color: var(--color-surface-light);
  border: 1px solid color-mix(in srgb, var(--color-journey-deep) 12%, transparent);
  color: var(--color-journey-deep);
  box-shadow: 0 1px rgb(0 0 0 / 0.05);
  transition: all 250ms var(--ease-editorial);
  cursor: pointer;
}

.community-modal-step-btn:hover {
  border-color: var(--color-dark-gold);
  color: var(--color-dark-gold);
}

.community-modal-step-btn:active {
  scale: 0.96;
}

/* --- Modal & Dossier Step Transitions --- */
.community-backdrop-enter-active,
.community-backdrop-leave-active {
  transition: opacity 320ms var(--ease-editorial);
}

.community-backdrop-enter-from,
.community-backdrop-leave-to {
  opacity: 0;
}

.community-backdrop-enter-active .community-modal-pop,
.community-backdrop-leave-active .community-modal-pop {
  transition:
    transform 400ms var(--ease-editorial),
    opacity 320ms var(--ease-editorial);
}

.community-backdrop-enter-from .community-modal-pop,
.community-backdrop-leave-to .community-modal-pop {
  opacity: 0;
  transform: translate3d(0, 14px, 0) scale(0.96);
}

.community-dossier-next-enter-active,
.community-dossier-next-leave-active,
.community-dossier-prev-enter-active,
.community-dossier-prev-leave-active {
  transition:
    opacity 230ms var(--ease-editorial),
    transform 230ms var(--ease-editorial);
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
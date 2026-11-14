<!-- ~/app/components/PartnerDesigners.vue -->
<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export type DesignerCoverTint = 'gold' | 'sky' | 'peach' | 'sage' | 'copper'

export interface CollaboratedDesignerItem {
  id: string
  name: string
  role: string
  location: string
  intro: string
  avatar: string
  avatarAlt?: string
  coverImage: string
  coverAlt?: string
  tint?: DesignerCoverTint
}

export interface PartnerDesignersConfig {
  eyebrow: string
  title: string
  description?: string
  infinite?: boolean
  designers: CollaboratedDesignerItem[]
}

const props = defineProps<{
  data: PartnerDesignersConfig
}>()

const coverTintMap: Record<DesignerCoverTint, string> = {
  gold: 'bg-linear-to-t from-journey-deep/45 via-dark-gold/22 to-soft-cream/20',
  sky: 'bg-linear-to-t from-journey-deep/45 via-action-blue/24 to-soft-blue/20',
  peach: 'bg-linear-to-t from-journey-deep/45 via-terracotta/22 to-soft-peach/20',
  sage: 'bg-linear-to-t from-journey-deep/45 via-deep-forest/26 to-olive-drab/16',
  copper: 'bg-linear-to-t from-journey-deep/45 via-spiced-copper/24 to-soft-cream/18'
}

const resolveCoverTint = (tint?: DesignerCoverTint, idx = 0): string => {
  if (tint && tint in coverTintMap) return coverTintMap[tint]
  const order: DesignerCoverTint[] = ['gold', 'sky', 'peach', 'sage', 'copper']
  return coverTintMap[order[idx % order.length]!]
}

const count = computed(() => props.data.designers.length)
const isInfinite = computed(
  () => (props.data.infinite ?? true) && count.value >= 3
)

// Starts directly on the middle designer (e.g., index 2 of 5, or 3 of 7)
const middleLogicalIndex = computed(() =>
  count.value > 0 ? Math.floor(count.value / 2) : 0
)

// Clone copies guarantee ultrawide monitors never reveal empty edges in infinite mode
const copyCount = computed(() => {
  if (!isInfinite.value) return 1
  return count.value < 5 ? 5 : 3
})

const centerCopyOffset = computed(() =>
  isInfinite.value ? Math.floor(copyCount.value / 2) * count.value : 0
)

interface RenderedTrackSlide {
  renderKey: string
  trackIndex: number
  logicalIndex: number
  designer: CollaboratedDesignerItem
}

const renderedSlides = computed<RenderedTrackSlide[]>(() => {
  const base = props.data.designers
  if (!base.length) return []

  const result: RenderedTrackSlide[] = []
  let trackIndex = 0
  for (let copy = 0; copy < copyCount.value; copy++) {
    for (let idx = 0; idx < base.length; idx++) {
      const designer = base[idx]!
      result.push({
        renderKey: `copy-${copy}-${designer.id}`,
        trackIndex,
        logicalIndex: idx,
        designer
      })
      trackIndex++
    }
  }
  return result
})

const trackRef = ref<HTMLElement | null>(null)
const virtualIndex = ref(centerCopyOffset.value + middleLogicalIndex.value)
const stepCounter = ref(0)
const isInstantTeleport = ref(false)
const dragOffsetPx = ref(0)
const isPointerDragging = ref(false)

let teleportTimer: ReturnType<typeof setTimeout> | null = null
let wheelCooldownTimer: ReturnType<typeof setTimeout> | null = null

const modIndex = (val: number, len: number): number =>
  len > 0 ? ((val % len) + len) % len : 0

const activeLogicalIndex = computed(() =>
  modIndex(virtualIndex.value, count.value)
)

const canStepPrev = computed(
  () => isInfinite.value || virtualIndex.value > 0
)
const canStepNext = computed(
  () => isInfinite.value || virtualIndex.value < count.value - 1
)

const clearTeleportTimer = () => {
  if (teleportTimer !== null) {
    clearTimeout(teleportTimer)
    teleportTimer = null
  }
}

// Silently recenters virtualIndex inside the middle clone copy after glide completes
const scheduleInfiniteRecenter = () => {
  if (!isInfinite.value || !import.meta.client) return
  clearTeleportTimer()

  teleportTimer = setTimeout(() => {
    const n = count.value
    if (n < 3) return
    const minSafe = centerCopyOffset.value
    const maxSafe = centerCopyOffset.value + n - 1

    if (virtualIndex.value < minSafe || virtualIndex.value > maxSafe) {
      const normalized = centerCopyOffset.value + modIndex(virtualIndex.value, n)
      isInstantTeleport.value = true
      virtualIndex.value = normalized
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isInstantTeleport.value = false
        })
      })
    }
  }, 580)
}

// Guard for rapid multi-clicks so track never reaches clone edges mid-burst
const guardRapidBoundary = () => {
  if (!isInfinite.value || !import.meta.client) return
  const total = renderedSlides.value.length
  const n = count.value
  if (virtualIndex.value <= 2 || virtualIndex.value >= total - 3) {
    isInstantTeleport.value = true
    virtualIndex.value = centerCopyOffset.value + modIndex(virtualIndex.value, n)
    void trackRef.value?.offsetWidth
    isInstantTeleport.value = false
  }
}

const stepBy = (delta: number) => {
  if (delta === 0 || count.value <= 1) return
  clearTeleportTimer()
  isInstantTeleport.value = false

  if (isInfinite.value) {
    guardRapidBoundary()
    virtualIndex.value += delta
    stepCounter.value += delta
    scheduleInfiniteRecenter()
    return
  }

  const clamped = Math.max(0, Math.min(count.value - 1, virtualIndex.value + delta))
  const actualDelta = clamped - virtualIndex.value
  if (actualDelta === 0) return
  virtualIndex.value = clamped
  stepCounter.value += actualDelta
}

const onCardClick = (slide: RenderedTrackSlide) => {
  if (suppressCardClick) {
    suppressCardClick = false
    return
  }
  const delta = slide.trackIndex - virtualIndex.value
  if (delta !== 0) {
    stepBy(delta)
  }
}

// =========================================================
// INSTAGRAM-STYLE 7-SLOT CENTERED DOT CONVEYOR
// Slots: [-3 (micro), -2, -1, 0 (active center), +1, +2, +3 (micro)]
// Plus ±4 invisible wings for smooth conveyor enter/exit
// =========================================================
const CONVEYOR_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4] as const

interface ConveyorDotItem {
  key: number
  rel: number
  isVisible: boolean
  isInteractive: boolean
  targetDesignerName: string
}

const conveyorDots = computed<ConveyorDotItem[]>(() => {
  const n = count.value
  if (!n) return []

  return CONVEYOR_OFFSETS.map((rel) => {
    const key = stepCounter.value + rel
    const finiteLogical = middleLogicalIndex.value + key
    const inFiniteBounds = finiteLogical >= 0 && finiteLogical < n
    const isVisible =
      Math.abs(rel) <= 3 && (isInfinite.value || inFiniteBounds)

    const resolvedIdx = isInfinite.value
      ? modIndex(activeLogicalIndex.value + rel, n)
      : finiteLogical

    const designerName = props.data.designers[resolvedIdx]?.name || 'Designer'

    return {
      key,
      rel,
      isVisible,
      isInteractive: isVisible && (rel === -2 || rel === -1 || rel === 1 || rel === 2),
      targetDesignerName: designerName
    }
  })
})

const getDotSlotStyle = (rel: number, isVisible: boolean) => ({
  transform: `translate3d(calc(-50% + (${rel} * var(--dot-slot-step))), -50%, 0) scale(${
    !isVisible ? 0 : Math.abs(rel) === 3 ? 0.85 : 1
  })`,
  opacity: !isVisible ? '0' : Math.abs(rel) === 3 ? '0.45' : '1'
})

// =========================================================
// POINTER DRAG, TOUCH SWIPE, TRACKPAD & KEYBOARD CONTROLS
// =========================================================
let dragStartX = 0
let dragStartY = 0
let dragStartTime = 0
let isHorizontalGesture: boolean | null = null
let suppressCardClick = false

const measureSlideStridePx = (): number => {
  const track = trackRef.value
  if (!track || !import.meta.client) return 312
  const firstCard = track.firstElementChild as HTMLElement | null
  const gapPx = Number.parseFloat(window.getComputedStyle(track).gap) || 20
  const cardW = firstCard?.offsetWidth || 292
  return cardW + gapPx
}

const onPointerMove = (e: PointerEvent) => {
  if (!isPointerDragging.value) return
  const dx = e.clientX - dragStartX
  if (Math.abs(dx) > 5) {
    suppressCardClick = true
  }
  dragOffsetPx.value = dx
}

const onPointerUp = (e: PointerEvent) => {
  if (!isPointerDragging.value) return
  isPointerDragging.value = false

  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)

  const dx = e.clientX - dragStartX
  const elapsed = Math.max(16, performance.now() - dragStartTime)
  const velocityPxPerMs = dx / elapsed
  const stride = measureSlideStridePx()

  dragOffsetPx.value = 0

  if (Math.abs(dx) > 38 || Math.abs(velocityPxPerMs) > 0.32) {
    const projected = dx + velocityPxPerMs * 120
    const rawSteps = -Math.round(projected / stride)
    const steps =
      rawSteps !== 0 ? Math.max(-2, Math.min(2, rawSteps)) : dx < 0 ? 1 : -1
    stepBy(steps)
  }

  setTimeout(() => {
    suppressCardClick = false
  }, 50)
}

const onStagePointerDown = (e: PointerEvent) => {
  if (e.pointerType !== 'mouse' || e.button !== 0 || count.value <= 1) return
  clearTeleportTimer()
  isPointerDragging.value = true
  suppressCardClick = false
  dragStartX = e.clientX
  dragStartTime = performance.now()
  dragOffsetPx.value = 0

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
}

const onTouchStart = (e: TouchEvent) => {
  const t = e.touches[0]
  if (!t || count.value <= 1) return
  clearTeleportTimer()
  dragStartX = t.clientX
  dragStartY = t.clientY
  dragStartTime = performance.now()
  isHorizontalGesture = null
  isPointerDragging.value = true
  dragOffsetPx.value = 0
}

const onTouchMove = (e: TouchEvent) => {
  if (!isPointerDragging.value) return
  const t = e.touches[0]
  if (!t) return

  const dx = t.clientX - dragStartX
  const dy = t.clientY - dragStartY

  if (isHorizontalGesture === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) {
    isHorizontalGesture = Math.abs(dx) > Math.abs(dy)
  }

  if (isHorizontalGesture) {
    dragOffsetPx.value = dx
  }
}

const onTouchEnd = (e: TouchEvent) => {
  if (!isPointerDragging.value) return
  isPointerDragging.value = false

  const t = e.changedTouches[0]
  const dx = t ? t.clientX - dragStartX : dragOffsetPx.value
  const elapsed = Math.max(16, performance.now() - dragStartTime)
  const velocityPxPerMs = dx / elapsed
  const stride = measureSlideStridePx()

  dragOffsetPx.value = 0

  if (
    isHorizontalGesture &&
    (Math.abs(dx) > 36 || Math.abs(velocityPxPerMs) > 0.28)
  ) {
    const projected = dx + velocityPxPerMs * 110
    const rawSteps = -Math.round(projected / stride)
    const steps =
      rawSteps !== 0 ? Math.max(-2, Math.min(2, rawSteps)) : dx < 0 ? 1 : -1
    stepBy(steps)
  }

  isHorizontalGesture = null
}

const onStageWheel = (e: WheelEvent) => {
  if (count.value <= 1) return
  const horizontalDelta =
    Math.abs(e.deltaX) > Math.abs(e.deltaY)
      ? e.deltaX
      : e.shiftKey
        ? e.deltaY
        : 0

  if (Math.abs(horizontalDelta) < 22 || wheelCooldownTimer !== null) return
  e.preventDefault()
  stepBy(horizontalDelta > 0 ? 1 : -1)

  wheelCooldownTimer = setTimeout(() => {
    wheelCooldownTimer = null
  }, 420)
}

const onSectionKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    stepBy(-1)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    stepBy(1)
  }
}

watch(
  () => [props.data.designers.length, props.data.infinite],
  () => {
    isInstantTeleport.value = true
    stepCounter.value = 0
    virtualIndex.value = centerCopyOffset.value + middleLogicalIndex.value
    if (import.meta.client) {
      requestAnimationFrame(() => {
        isInstantTeleport.value = false
      })
    }
  }
)

onBeforeUnmount(() => {
  clearTeleportTimer()
  if (wheelCooldownTimer !== null) clearTimeout(wheelCooldownTimer)
  if (import.meta.client) {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointercancel', onPointerUp)
  }
})
</script>

<template>
  <section
    data-theme="light"
    aria-roledescription="carousel"
    aria-label="Collaborated Travel Designers"
    tabindex="0"
    class="section-wrapper overflow-x-clip bg-bg-surface-light text-primary-light outline-none bg-surface-light"
    @keydown="onSectionKeydown"
  >
    <div class="w-full flex flex-col items-center">
      <!-- 1. SECTION HEADER -->
      <div class="w-full max-w-4xl flex flex-col items-center text-center mb-10 md:mb-12 px-4">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <span class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </span>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
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
          class="section-paragraph text-secondary-light max-w-2xl"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. CENTERED EQUAL-SIZE HORIZONTAL SLIDER -->
      <div
        v-motion-atelier-card
        :delay="220"
        data-lenis-prevent-horizontal
        :class="[
          'designer-slider-stage',
          isPointerDragging ? 'cursor-grabbing' : 'cursor-grab'
        ]"
        @pointerdown="onStagePointerDown"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
        @touchcancel.passive="onTouchEnd"
        @wheel="onStageWheel"
      >
        <!-- Soft Edge Vignettes Framing the Centered Active Slide -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 left-0 w-6 sm:w-16 lg:w-28 z-20 bg-linear-to-r from-bg-light via-bg-light/70 to-transparent"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-y-0 right-0 w-6 sm:w-16 lg:w-28 z-20 bg-linear-to-l from-bg-light via-bg-light/70 to-transparent"
        />

        <!-- Zero-CLS Centered Track Spine -->
        <div class="designer-slider-spine">
          <div
            ref="trackRef"
            :class="[
              'designer-slider-track',
              isInstantTeleport || isPointerDragging
                ? 'designer-slider-track-instant'
                : ''
            ]"
            :style="{
              '--active-slide-idx': String(virtualIndex),
              '--slider-drag-px': `${dragOffsetPx}px`
            }"
          >
            <article
              v-for="slide in renderedSlides"
              :key="slide.renderKey"
              :aria-hidden="slide.trackIndex !== virtualIndex"
              :class="[
                'designer-slide-card group',
                slide.trackIndex === virtualIndex
                  ? 'designer-slide-card-active'
                  : 'designer-slide-card-idle'
              ]"
              @click="onCardClick(slide)"
            >
              <!-- A. Tinted 8:5 Landscape Cover Image + Subtle Inner Frame -->
              <div class="designer-card-cover">
                <img
                  :src="slide.designer.coverImage"
                  :alt="slide.designer.coverAlt || `${slide.designer.location} landscape`"
                  width="480"
                  height="300"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  draggable="false"
                  class="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  :class="[
                    'pointer-events-none absolute inset-0',
                    resolveCoverTint(slide.designer.tint, slide.logicalIndex)
                  ]"
                />
                <div aria-hidden="true" class="designer-card-cover-frame" />
              </div>

              <!-- B. Overlapping Ringed Portrait + Equal-Height Copy Body -->
              <div class="px-6 pb-7 flex-1 flex flex-col items-center text-center">
                <div class="designer-card-avatar">
                  <img
                    :src="slide.designer.avatar"
                    :alt="slide.designer.avatarAlt || slide.designer.name"
                    width="144"
                    height="144"
                    loading="lazy"
                    decoding="async"
                    fetchpriority="low"
                    draggable="false"
                    class="w-full h-full object-cover"
                  />
                </div>

                <h3 class="subsection-title text-journey-deep mt-3.5">
                  {{ slide.designer.name }}
                </h3>

                <span class="card-eyebrow text-dark-gold font-semibold mt-1 mb-0!">
                  {{ slide.designer.role }}
                </span>

                <div class="inline-flex items-center gap-1.5 mt-1.5 text-muted">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    class="w-3.5 h-3.5 text-dark-gold/75 shrink-0"
                  >
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span class="card-tag text-muted">
                    {{ slide.designer.location }}
                  </span>
                </div>

                <div class="w-10 h-px bg-dark-gold/30 my-4 shrink-0" aria-hidden="true" />

                <p class="section-subparagraph text-secondary-light">
                  {{ slide.designer.intro }}
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- 3. BOTTOM CENTERED CONVEYOR BAR (Left Btn + 5 Dots & 2 Micro Dots + Right Btn) -->
      <div
        v-if="count > 1"
        v-motion-fade-up
        :delay="280"
        class="designer-conveyor-bar"
      >
        <!-- Left Button Immediately Left of Dots -->
        <button
          type="button"
          aria-label="Previous travel designer"
          :disabled="!canStepPrev"
          class="designer-nav-btn"
          @click="stepBy(-1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- 7-Slot Instagram Conveyor Window (Active Dot Always Dead-Center) -->
        <div class="designer-dots-window" aria-label="Slide position indicator">
          <button
            v-for="dot in conveyorDots"
            :key="dot.key"
            type="button"
            :tabindex="dot.isInteractive ? 0 : -1"
            :aria-hidden="!dot.isVisible"
            :aria-current="dot.rel === 0 ? 'true' : undefined"
            :aria-label="
              dot.rel === 0
                ? `Active designer: ${dot.targetDesignerName}`
                : `Slide to ${dot.targetDesignerName}`
            "
            :style="getDotSlotStyle(dot.rel, dot.isVisible)"
            :class="[
              'designer-dot-slot',
              dot.rel === 0
                ? 'designer-dot-active'
                : Math.abs(dot.rel) === 3 || !dot.isVisible
                  ? 'designer-dot-micro'
                  : 'designer-dot-mid'
            ]"
            @click="dot.isInteractive ? stepBy(dot.rel) : undefined"
          />
        </div>

        <!-- Right Button Immediately Right of Dots -->
        <button
          type="button"
          aria-label="Next travel designer"
          :disabled="!canStepNext"
          class="designer-nav-btn"
          @click="stepBy(1)"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Responsive CSS-Driven Centered Slider Stage (Zero-CLS SSR Centering) */
.designer-slider-stage {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding-block: 0.75rem;
  user-select: none;
  touch-action: pan-y;
  --designer-card-w: 16.75rem;
  --designer-card-gap: 1rem;
}

@media (min-width: 481px) {
  .designer-slider-stage {
    --designer-card-w: 18.25rem;
    --designer-card-gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .designer-slider-stage {
    --designer-card-w: 19.5rem;
    --designer-card-gap: 1.5rem;
  }
}

.designer-slider-spine {
  position: relative;
  left: 50%;
  width: 0;
  overflow: visible;
}

.designer-slider-track {
  display: flex;
  align-items: stretch;
  width: max-content;
  will-change: transform;
  gap: var(--designer-card-gap);
  transform: translate3d(
    calc(
      -1 * (
        var(--active-slide-idx, 0) * (var(--designer-card-w) + var(--designer-card-gap)) +
        (var(--designer-card-w) / 2)
      ) + var(--slider-drag-px, 0px)
    ),
    0,
    0
  );
  transition: transform 560ms var(--ease-editorial);
}

.designer-slider-track-instant {
  transition: none !important;
}

.designer-slide-card {
  position: relative;
  flex-shrink: 0;
  width: var(--designer-card-w);
  border-radius: 1rem;
  background-color: var(--color-surface-light);
  border: 1px solid color-mix(in srgb, var(--color-journey-deep) 10%, transparent);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 500ms var(--ease-editorial);
}

.designer-slide-card-active {
  border-color: color-mix(in srgb, var(--color-dark-gold) 45%, transparent);
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
  translate: 0 -0.25rem;
}

.designer-slide-card-idle {
  box-shadow: 0 1px rgb(0 0 0 / 0.05);
  opacity: 0.88;
  cursor: pointer;
}

.designer-slide-card-idle:hover {
  opacity: 1;
  border-color: color-mix(in srgb, var(--color-journey-deep) 25%, transparent);
}

.designer-card-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 8 / 5;
  overflow: hidden;
  background-color: var(--color-surface-frosted);
  flex-shrink: 0;
}

.designer-card-cover-frame {
  pointer-events: none;
  position: absolute;
  inset: 0.625rem;
  border-radius: 0.75rem;
  border: 1px solid color-mix(in srgb, var(--color-surface-light) 35%, transparent);
  z-index: 10;
}

.designer-card-avatar {
  position: relative;
  z-index: 20;
  margin-top: -2.5rem;
  width: 5rem;
  height: 5rem;
  border-radius: 9999px;
  overflow: hidden;
  background-color: var(--color-surface-light);
  border: 1px solid color-mix(in srgb, var(--color-dark-gold) 30%, transparent);
  box-shadow:
    0 0 0 4px var(--color-surface-light),
    0 1px 2px 0 rgb(0 0 0 / 0.05);
  flex-shrink: 0;
}

/* Symmetrical Centered Conveyor Bar (Prev + 5 Dots + 2 Micro Dots + Next) */
.designer-conveyor-bar {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  user-select: none;
}

@media (min-width: 640px) {
  .designer-conveyor-bar {
    gap: 1.25rem;
  }
}

@media (min-width: 768px) {
  .designer-conveyor-bar {
    margin-top: 2.5rem;
  }
}

.designer-nav-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: var(--color-surface-light);
  border: 1px solid color-mix(in srgb, var(--color-journey-deep) 15%, transparent);
  color: var(--color-journey-deep);
  box-shadow: 0 1px rgb(0 0 0 / 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms var(--ease-editorial);
  cursor: pointer;
  flex-shrink: 0;
}

.designer-nav-btn:hover {
  border-color: var(--color-dark-gold);
  color: var(--color-dark-gold);
}

.designer-nav-btn:active {
  scale: 0.95;
}

.designer-nav-btn:disabled {
  opacity: 0.3;
  pointer-events: none;
}

.designer-dots-window {
  position: relative;
  height: 1.75rem;
  width: 9.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  --dot-slot-step: 1.25rem;
}

@media (min-width: 640px) {
  .designer-dots-window {
    width: 10.5rem;
    --dot-slot-step: 1.375rem;
  }
}

.designer-dot-slot {
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  outline: none;
  transition:
    transform 520ms var(--ease-editorial),
    opacity 520ms var(--ease-editorial),
    width 520ms var(--ease-editorial),
    height 520ms var(--ease-editorial),
    background-color 520ms var(--ease-editorial),
    box-shadow 520ms var(--ease-editorial);
}

.designer-dot-active {
  width: 1.5rem;
  height: 0.5rem;
  background-color: var(--color-dark-gold);
  box-shadow:
    0 0 0 2px var(--color-bg-light),
    0 0 0 4px color-mix(in srgb, var(--color-dark-gold) 25%, transparent);
}

.designer-dot-mid {
  width: 0.5rem;
  height: 0.5rem;
  background-color: color-mix(in srgb, var(--color-journey-deep) 30%, transparent);
  cursor: pointer;
}

.designer-dot-mid:hover {
  background-color: color-mix(in srgb, var(--color-dark-gold) 75%, transparent);
}

.designer-dot-micro {
  width: 0.375rem;
  height: 0.375rem;
  background-color: color-mix(in srgb, var(--color-journey-deep) 18%, transparent);
  pointer-events: none;
}
</style>
<!-- ~/app/components/HomeTestimonials.vue -->
<script setup lang="ts">
import { ref, computed, reactive, onMounted, onBeforeUnmount } from 'vue'
import CtaButton from '~/components/CtaButton.vue'

export interface LegacyTestimonialCategory {
  name: string
  colorVar: string
}

export interface TestimonialItem {
  id: number | string
  category?: string
  categoryColor?: string
  categoryId?: string
  name: string
  designation: string
  quote: string
  avatar: string
  image: string
  alt: string
  ctaLabel: string
  ctaUrl: string
}

export interface HomeTestimonialsConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  categories?: Record<string, LegacyTestimonialCategory>
  items: TestimonialItem[]
  bottomQuote: string
  bottomCta: {
    label: string
    to: string
  }
}

// Centralized slider tempo & drag physics constants (continuous stream, no hover pause)
const SLIDER_PHYSICS = {
  baseSpeedPxPerFrame: 0.78,
  inertiaFriction: 0.94,
  maxThrowVelocity: 22,
  dragThresholdPx: 6,
  wheelResumeDelayMs: 260,
  defaultDarkHex: '#2C4C63'
} as const

const props = defineProps<{
  data: HomeTestimonialsConfig
}>()

const scrollContainer = ref<HTMLElement | null>(null)
const sampledImageHex = reactive<Record<string, string>>({})
const isDraggingUi = ref(false)

let animationFrameId: number | null = null
let intersectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let wheelTimeout: ReturnType<typeof setTimeout> | null = null

// Explicitly typed physics state
let isPressing = false
let isDragging = false
let didDragExceedThreshold = false
let startX = 0
let scrollLeftStart = 0
let lastClientX = 0
let lastMoveTime = 0
let prevFrameTime = 0
let velocity: number = SLIDER_PHYSICS.baseSpeedPxPerFrame
let singleSetWidth = 0
let isVisible = false

const displayItems = computed<TestimonialItem[]>(() => [
  ...props.data.items,
  ...props.data.items,
  ...props.data.items
])

const resolveCategoryLabel = (item: TestimonialItem): string => {
  if (item.category?.trim()) return item.category.trim()
  if (item.categoryId && props.data.categories?.[item.categoryId]) {
    return props.data.categories[item.categoryId]!.name
  }
  return 'Traveler Story'
}

const resolveCardHex = (item: TestimonialItem): string => {
  const explicit = item.categoryColor?.trim()
  if (explicit && explicit !== 'auto') return explicit
  if (sampledImageHex[item.image]) return sampledImageHex[item.image]!
  if (item.categoryId && props.data.categories?.[item.categoryId]) {
    return props.data.categories[item.categoryId]!.colorVar
  }
  return SLIDER_PHYSICS.defaultDarkHex
}

// Optional automatic dark-#hex extraction when `categoryColor` is omitted or 'auto'
const onBgImageLoad = (e: Event, item: TestimonialItem) => {
  const explicit = item.categoryColor?.trim()
  if ((explicit && explicit !== 'auto') || sampledImageHex[item.image]) return
  const img = e.target as HTMLImageElement | null
  if (!img || !img.naturalWidth) return

  try {
    const canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    if (!ctx) return
    ctx.drawImage(img, 0, 0, 10, 10)
    const { data } = ctx.getImageData(0, 0, 10, 10)

    let rSum = 0
    let gSum = 0
    let bSum = 0
    let count = 0

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]!
      const g = data[i + 1]!
      const b = data[i + 2]!
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      const weight = 1 + (max - min) / 128
      rSum += r * weight
      gSum += g * weight
      bSum += b * weight
      count += weight
    }

    if (count > 0) {
      let r = rSum / count
      let g = gSum / count
      let b = bSum / count
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
      const targetLum = 64
      const scale = lum > 1 ? Math.min(1, targetLum / lum) : 0.45
      r = Math.max(20, Math.min(148, Math.round(r * scale)))
      g = Math.max(24, Math.min(126, Math.round(g * scale)))
      b = Math.max(28, Math.min(148, Math.round(b * scale)))

      const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase()
      sampledImageHex[item.image] = `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }
  } catch {
    // Ignore cross-origin canvas taint if external URLs are ever used
  }
}

const checkInfiniteWrap = () => {
  const el = scrollContainer.value
  if (!el || singleSetWidth <= 0) return

  if (el.scrollLeft >= singleSetWidth * 2) {
    el.scrollLeft -= singleSetWidth
  } else if (el.scrollLeft <= 2) {
    el.scrollLeft += singleSetWidth
  }
}

const scrollStep = (now: number) => {
  const el = scrollContainer.value
  if (!el || !isVisible) {
    animationFrameId = null
    return
  }

  const dt = prevFrameTime ? Math.min(34, now - prevFrameTime) : 16.667
  prevFrameTime = now
  const frameScale = dt / 16.667

  const targetAutoVel: number = SLIDER_PHYSICS.baseSpeedPxPerFrame

  if (!isPressing && !isDragging) {
    if (Math.abs(velocity - targetAutoVel) > 0.04) {
      const decay = Math.pow(SLIDER_PHYSICS.inertiaFriction, frameScale)
      velocity = velocity * decay + targetAutoVel * (1 - decay)
    } else {
      velocity = targetAutoVel
    }
    el.scrollLeft += velocity * frameScale
  }

  checkInfiniteWrap()
  animationFrameId = requestAnimationFrame(scrollStep)
}

const ensureLoopRunning = () => {
  if (isVisible && animationFrameId === null) {
    prevFrameTime = 0
    animationFrameId = requestAnimationFrame(scrollStep)
  }
}

const onMouseDown = (e: MouseEvent) => {
  const el = scrollContainer.value
  if (!el || e.button !== 0) return
  isPressing = true
  isDragging = true
  isDraggingUi.value = false
  didDragExceedThreshold = false
  startX = e.clientX
  scrollLeftStart = el.scrollLeft
  lastClientX = e.clientX
  lastMoveTime = performance.now()
  velocity = 0
}

const onMouseMove = (e: MouseEvent) => {
  const el = scrollContainer.value
  if (!isDragging || !el) return

  const walk = e.clientX - startX
  if (Math.abs(walk) > SLIDER_PHYSICS.dragThresholdPx) {
    didDragExceedThreshold = true
    isDraggingUi.value = true
  }

  if (didDragExceedThreshold) {
    e.preventDefault()
    el.scrollLeft = scrollLeftStart - walk
    checkInfiniteWrap()
  }

  const now = performance.now()
  const dt = now - lastMoveTime
  const dx = e.clientX - lastClientX
  if (dt > 0) {
    const rawVel = -(dx / dt) * 16.667
    velocity = Math.max(
      -SLIDER_PHYSICS.maxThrowVelocity,
      Math.min(SLIDER_PHYSICS.maxThrowVelocity, rawVel)
    )
  }

  lastClientX = e.clientX
  lastMoveTime = now
}

const onMouseUpOrLeave = () => {
  isPressing = false
  isDragging = false
  isDraggingUi.value = false
}

const onCardCtaClick = (e: MouseEvent) => {
  if (didDragExceedThreshold) {
    e.preventDefault()
    e.stopPropagation()
    didDragExceedThreshold = false
  }
}

const onTouchStart = () => {
  isPressing = true
  didDragExceedThreshold = false
  velocity = 0
}

const onTouchEnd = () => {
  isPressing = false
}

const onWheel = () => {
  isPressing = true
  if (wheelTimeout) clearTimeout(wheelTimeout)
  wheelTimeout = setTimeout(() => {
    isPressing = false
    velocity = SLIDER_PHYSICS.baseSpeedPxPerFrame
  }, SLIDER_PHYSICS.wheelResumeDelayMs)
}

const onKeydown = (e: KeyboardEvent) => {
  const el = scrollContainer.value
  if (!el) return
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    e.preventDefault()
    const dir = e.key === 'ArrowRight' ? 1 : -1
    velocity = dir * 14
  }
}

const measureTrack = () => {
  const el = scrollContainer.value
  if (!el) return
  const nextSetWidth = el.scrollWidth / 3
  if (nextSetWidth > 0) {
    const wasUninitialized = singleSetWidth === 0
    singleSetWidth = nextSetWidth
    if (wasUninitialized) {
      el.scrollLeft = singleSetWidth
    }
  }
}

onMounted(() => {

  requestAnimationFrame(() => {
    const el = scrollContainer.value
    if (!el) return

    measureTrack()

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        measureTrack()
      })
      resizeObserver.observe(el)
    }

    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting || false
          if (isVisible) {
            ensureLoopRunning()
          }
        },
        { rootMargin: '120px 0px' }
      )
      intersectionObserver.observe(el)
    } else {
      isVisible = true
      ensureLoopRunning()
    }
  })
})

onBeforeUnmount(() => {
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
  if (wheelTimeout) clearTimeout(wheelTimeout)
  intersectionObserver?.disconnect()
  resizeObserver?.disconnect()
})
</script>

<template>
  <section
    data-theme="light"
    class="text-primary-light overflow-x-clip section-wrapper"
  >
    <div class="relative z-10 w-full max-w-400 mx-auto flex flex-col items-center">
      <!-- 1. SECTION HEADER -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center px-2 mb-8 sm:mb-12 xl:mb-14">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper drop-shadow-none!"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <p
          v-motion-fade-up
          :delay="200"
          class="text-secondary-light max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. 1600PX (max-w-400) EDGE-MASKED FLEXBOX TRACK -->
      <div
        v-motion-fade-up
        :delay="260"
        class="relative z-20 w-full max-w-400 mx-auto px-1 xs:px-4 sm:px-6 md:px-8 mb-8 sm:mb-11 lg:mb-13"
      >
        <div class="testimonial-edge-mask w-full">
          <div
            ref="scrollContainer"
            tabindex="0"
            data-lenis-prevent-horizontal
            aria-label="Traveler stories carousel"
            class="flex overflow-x-auto overflow-y-hidden hide-scrollbar gap-4 sm:gap-6 px-3 sm:px-8 md:px-12 py-2 w-full touch-manipulation overscroll-x-contain scroll-smooth-disabled outline-none focus-visible:ring-2 focus-visible:ring-dark-gold rounded-2xl"
            :class="isDraggingUi ? 'cursor-grabbing' : 'cursor-grab'"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUpOrLeave"
            @mouseleave="onMouseUpOrLeave"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
            @wheel.passive="onWheel"
            @keydown="onKeydown"
          >
            <article
              v-for="(item, idx) in displayItems"
              :key="`testi-${item.id}-${idx}`"
              class="group testimonial-silk-card relative isolate shrink-0 w-[86vw] max-w-106 sm:w-132 sm:max-w-none md:w-152 lg:w-166 min-h-72 xs:min-h-76 sm:min-h-82 md:min-h-86 rounded-2xl overflow-hidden grid grid-rows-[auto_1fr_auto] p-5 xs:p-6 sm:p-7 md:p-9 select-none transition-shadow duration-500 ease-editorial"
              :style="{ '--card-hex': resolveCardHex(item) }"
            >
              <!-- Layer A: Vivid Full-Color Right-Revealed Travel Photograph -->
              <div class="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden rounded-2xl">
                <img
                  :src="item.image"
                  :alt="item.alt || `${item.name} journey highlight`"
                  width="1200"
                  height="800"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  draggable="false"
                  class="w-full h-full object-cover object-center transition-transform duration-1000 ease-editorial group-hover:scale-104"
                  @load="(e) => onBgImageLoad(e, item)"
                />
              </div>

              <!-- Layer B: Asymmetric Sunlit Silk Mask (Tinted with Item #Hex) -->
              <div aria-hidden="true" class="testimonial-silk-veil pointer-events-none absolute inset-0 z-1" />

              <!-- Row 1 (Grid auto): Top-Left Solid Dark #Hex Category Tag -->
              <div class="relative z-10 flex items-center justify-start">
                <span
                  class="card-tag text-white font-medium px-2.5 xs:px-3 pt-1.75 pb-0.75 rounded-sm shadow-2xs"
                  style="background-color: var(--card-hex);"
                >
                  {{ resolveCategoryLabel(item) }}
                </span>
              </div>

              <!-- Row 2 (Grid 1fr): Optically Centered Italic Quote + Subtle Watermark -->
              <div class="relative z-10 flex items-center py-4 sm:py-5">
                <span
                  aria-hidden="true"
                  class="pointer-events-none select-none absolute -top-1 -left-1 font-quote text-[60px] sm:text-[74px] leading-none"
                  style="color: color-mix(in srgb, var(--card-hex) 20%, transparent);"
                >
                  “
                </span>

                <blockquote
                  class="relative z-10 font-quote italic font-medium text-[18px] 2xs:text-[19px] xs:text-[20px] sm:text-[22px] md:text-[23px] leading-[1.45] text-journey-deep max-w-[34ch] sm:max-w-[38ch] md:max-w-[41ch] line-clamp-5 text-pretty drop-shadow-[0_1px_0_rgba(255,255,255,0.65)]"
                >
                  “{{ item.quote }}”
                </blockquote>
              </div>

              <!-- Row 3 (Grid auto): Single-Row Author & Solid #Hex rounded-sm CTA -->
              <div class="testimonial-card-footer relative z-10 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 xs:gap-3 sm:gap-4 pt-4 sm:pt-5 border-t">
                <!-- Avatar -->
                <div
                  class="w-10 h-10 xs:w-11 xs:h-11 md:w-13 md:h-13 rounded-full overflow-hidden border bg-surface-light p-0.5 shadow-2xs shrink-0"
                  style="border-color: color-mix(in srgb, var(--card-hex) 55%, #ffffff);"
                >
                  <img
                    :src="item.avatar"
                    :alt="`Portrait of ${item.name}`"
                    width="144"
                    height="144"
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    class="w-full h-full object-cover rounded-full pointer-events-none select-none"
                  />
                </div>

                <!-- Name & Designation -->
                <div class="flex flex-col min-w-0 pr-1">
                  <div class="testimonial-author text-journey-deep! truncate">
                    {{ item.name }}
                  </div>
                  <span class="card-paragraph text-secondary-light/90 drop-shadow-none! mt-0.5 truncate">
                    {{ item.designation }}
                  </span>
                </div>

                <!-- Original rounded-sm Solid Dark #Hex Action Button -->
                <NuxtLink
                  :to="item.ctaUrl"
                  draggable="false"
                  class="group/btn shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-dark-gold rounded-sm"
                  @click="onCardCtaClick"
                >
                  <div
                    class="flex items-center justify-center px-2.5 xs:px-3.5 sm:px-4 h-9 xs:h-9.5 sm:h-10.5 rounded-sm text-[8.5px] 2xs:text-[9.5px] sm:text-[10.5px] md:text-[11px] font-uppercase font-medium tracking-widest text-white uppercase transition-all duration-300 gap-1.5 sm:gap-2 shadow-xs group-hover/btn:brightness-112 active:scale-95"
                    style="background-color: var(--card-hex);"
                  >
                    <span class="pt-0.5 leading-none whitespace-nowrap">
                      {{ item.ctaLabel }}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.65"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </NuxtLink>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- 3. BOTTOM EDITORIAL QUOTE -->
      <div
        v-motion-fade-up
        class="flex flex-col items-center text-center px-4 w-full mb-7 md:mb-9"
      >
        <p class="px-2 sm:px-4 lg:max-w-3xl xl:max-w-4xl text-darker-gold section-quote">
          {{ data.bottomQuote }}
        </p>
      </div>

      <!-- 4. BOTTOM CENTERED CTA BUTTON -->
      <div
        v-motion-fade-up
        :delay="100"
        class="flex justify-center w-full"
      >
        <CtaButton
          :to="data.bottomCta.to"
          :label="data.bottomCta.label"
          variant="light"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.scroll-smooth-disabled {
  scroll-behavior: auto !important;
}

.testimonial-edge-mask {
  --testi-mask-edge: 0.5rem;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000000 var(--testi-mask-edge),
    #000000 calc(100% - var(--testi-mask-edge)),
    transparent 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    #000000 var(--testi-mask-edge),
    #000000 calc(100% - var(--testi-mask-edge)),
    transparent 100%
  );
}

@media (min-width: 481px) {
  .testimonial-edge-mask {
    --testi-mask-edge: 1.5rem;
  }
}

@media (min-width: 640px) {
  .testimonial-edge-mask {
    --testi-mask-edge: 3rem;
  }
}

@media (min-width: 1024px) {
  .testimonial-edge-mask {
    --testi-mask-edge: 5.5rem;
  }
}

.testimonial-silk-card {
  background-color: #faf7f2;
  border: 1px solid color-mix(in srgb, var(--card-hex, #2c4c63) 28%, #dfd7c8);
  box-shadow:
    0 16px 36px -16px rgba(15, 23, 42, 0.12),
    0 4px 12px -4px rgba(15, 23, 42, 0.05);
}

.testimonial-silk-card:hover {
  box-shadow:
    0 22px 44px -16px rgba(15, 23, 42, 0.17),
    0 6px 16px -4px rgba(15, 23, 42, 0.07);
}

.testimonial-silk-veil {
  background-image:
    linear-gradient(
      0deg,
      color-mix(in srgb, var(--card-hex, #2c4c63) 8%, #faf7f2) 0%,
      color-mix(in srgb, var(--card-hex, #2c4c63) 6%, rgba(250, 247, 242, 0.84)) 24%,
      rgba(250, 247, 242, 0) 48%
    ),
    linear-gradient(
      112deg,
      color-mix(in srgb, var(--card-hex, #2c4c63) 9%, #fbf9f5) 0%,
      color-mix(in srgb, var(--card-hex, #2c4c63) 8%, rgba(251, 249, 245, 0.96)) 46%,
      color-mix(in srgb, var(--card-hex, #2c4c63) 5%, rgba(250, 247, 242, 0.72)) 72%,
      rgba(250, 247, 242, 0.14) 100%
    );
}

@media (min-width: 640px) {
  .testimonial-silk-veil {
    background-image:
      linear-gradient(
        0deg,
        color-mix(in srgb, var(--card-hex, #2c4c63) 8%, #faf7f2) 0%,
        color-mix(in srgb, var(--card-hex, #2c4c63) 5%, rgba(250, 247, 242, 0.78)) 22%,
        rgba(250, 247, 242, 0) 44%
      ),
      linear-gradient(
        102deg,
        color-mix(in srgb, var(--card-hex, #2c4c63) 9%, #fbf9f5) 0%,
        color-mix(in srgb, var(--card-hex, #2c4c63) 8%, rgba(251, 249, 245, 0.96)) 38%,
        color-mix(in srgb, var(--card-hex, #2c4c63) 5%, rgba(250, 247, 242, 0.82)) 55%,
        rgba(250, 247, 242, 0.28) 73%,
        rgba(250, 247, 242, 0.02) 92%
      );
  }
}

.testimonial-card-footer {
  border-color: color-mix(in srgb, var(--card-hex, #2c4c63) 24%, rgba(15, 23, 42, 0.08));
}
</style>
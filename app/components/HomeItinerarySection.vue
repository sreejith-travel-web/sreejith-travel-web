<!-- ~/app/components/HomeItinerarySection.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import HorizontalCardSlider from '~/components/HorizontalCardSlider.vue'
import CtaButton from '~/components/CtaButton.vue'
import type { HorizontalCardSliderConfig } from '~/components/HorizontalCardSlider.vue'

export interface ItinerarySectionConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  subtitle: string
  description: string
  bottomQuote: string
  ctaLabel: string
  ctaTo: string
  slider: HorizontalCardSliderConfig
}

const props = defineProps<{
  data: ItinerarySectionConfig
}>()

// Component Ref to control the slider via left/right arrows
const sliderRef = ref<InstanceType<typeof HorizontalCardSlider> | null>(null)

// Track active snap stop & overflow status
const activeIndex = ref(props.data.slider.initialIndex || 0)
const isSliderOverflowing = ref(true)
const totalSlides = computed(() => props.data.slider.slides?.length || 0)
const totalStops = ref(totalSlides.value)

const handleSlideChange = (index: number) => {
  activeIndex.value = index
}

const handleStopsChange = (stops: number) => {
  totalStops.value = stops
}

const handleOverflowChange = (overflowing: boolean) => {
  isSliderOverflowing.value = overflowing
}

// --- Instagram-Style 5+2 Dot Indicator Logic ---
const MAX_NORMAL_DOTS = 5
const DOT_SIZE = 6 // w-1.5 h-1.5 = 6px
const GAP_SIZE = 8 // gap-2 = 8px
const STRIDE = DOT_SIZE + GAP_SIZE // 14px

// Calculates which dot sits at the far left of the 5-dot normal window
const windowStart = computed(() => {
  const n = totalStops.value
  if (n <= MAX_NORMAL_DOTS) return 0

  if (activeIndex.value <= 2) return 0
  if (activeIndex.value >= n - 3) return n - MAX_NORMAL_DOTS
  return activeIndex.value - 2
})

// Physical track translation keeping the 5 normal dots centered between the 2 passive edge slots
const trackTranslateX = computed(() => {
  if (totalStops.value <= MAX_NORMAL_DOTS) return 0
  return STRIDE - windowStart.value * STRIDE
})

// Exact wrapper width for (5+2 = 7 dots)
const wrapperWidth = computed(() => {
  const n = totalStops.value
  if (n <= MAX_NORMAL_DOTS) return n * DOT_SIZE + Math.max(0, n - 1) * GAP_SIZE
  const visibleSlots = MAX_NORMAL_DOTS + 2
  return visibleSlots * DOT_SIZE + (visibleSlots - 1) * GAP_SIZE
})

// Dynamic scale and opacity for each 1.5x1.5 dot
const getDotStyle = (index: number) => {
  if (index === activeIndex.value) {
    return 'bg-journey-deep opacity-100 scale-110'
  }

  const ws = windowStart.value
  if (index >= ws && index < ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-35 scale-100' // 5 Normal active window dots
  }
  if (index === ws - 1 || index === ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-15 scale-[0.65]' // 2 Passive edge dots
  }

  return 'bg-journey-deep opacity-0 scale-0' // Hidden outer dots
}

const handlePrev = () => {
  sliderRef.value?.prev()
}

const handleNext = () => {
  sliderRef.value?.next()
}
</script>

<template>
  <section
    data-theme="light"
    class="text-primary-light overflow-hidden section-wrapper px-0"
  >
    <div class="relative w-full max-w-full flex flex-col items-center">

      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full max-w-3xl flex flex-col items-center text-center mb-6 md:mb-8 px-2">

        <!-- Eyebrow with flanking lines -->  
        <div
          v-motion-fade-up
          class="eyebrow-wrapper"
        >
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <!-- Main Title -->
        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <!-- Subtitle & Description -->
        <div
          v-motion-fade-up
          :delay="200"
          class="flex flex-col items-center will-change-transform"
        >
          <span class="text-intention-blue/90 section-midsubtitle">
            {{ data.subtitle }}
          </span>
          <p class="text-journey-deep/90 max-w-2xl lg:max-w-3xl px-4 section-paragraph">
            {{ data.description }}
          </p>
        </div>
      </div>

      <!-- 2. THE HORIZONTAL SLIDER ENGINE -->
      <div
        v-motion
        :initial="{ opacity: 0, filter: 'blur(5px)', scale: 0.98 }"
        :visible-once="{ opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 300 } }"
        class="relative z-10 w-full mb-6 md:mb-8 will-change-[transform,opacity]"
      >
        <ClientOnly>
          <HorizontalCardSlider
            ref="sliderRef"
            :data="data.slider"
            :aria-label="data.eyebrow"
            @change="handleSlideChange"
            @stops-change="handleStopsChange"
            @overflow-change="handleOverflowChange"
          />

          <!-- Zero-CLS SSR Fallback matching card dimensions exactly -->
          <template #fallback>
            <div
              class="relative w-full flex items-center gap-4 sm:gap-5 lg:gap-6 py-4 sm:py-6 px-[12vw] 2xs:px-[14vw] xs:px-[16vw] sm:px-8 md:px-12 lg:px-16 overflow-hidden"
              aria-hidden="true"
            >
              <div
                v-for="n in 4"
                :key="n"
                :style="{ aspectRatio: data.slider.aspectRatio || '2 / 3' }"
                class="shrink-0 w-[76vw] 2xs:w-[72vw] xs:w-[68vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] xl:w-[23vw] 2xl:w-[20vw] max-w-88 min-w-36 rounded-xl sm:rounded-2xl bg-journey-deep/5"
              />
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- 3. FOOTER CONTENT (Arrows + Dots, Quote, CTA) -->
      <div class="relative z-10 w-full flex flex-col items-center text-center">

        <!-- Flanking Circular Arrows + Instagram 1.5x1.5 Dot Indicator (Hidden when slides don't overflow) -->
        <div
          v-if="totalStops > 1 && isSliderOverflowing"
          v-motion-micro-up
          :delay="100"
          class="flex items-center justify-center gap-4 sm:gap-5 mb-10 will-change-transform"
        >
          <!-- Previous Slide Arrow Button -->
          <button
            type="button"
            aria-label="Previous slide"
            :disabled="sliderRef ? !sliderRef.canGoPrev : false"
            @click="handlePrev"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-journey-deep/25 bg-transparent text-journey-deep flex items-center justify-center transition-all duration-300 ease-out hover:bg-journey-deep hover:border-journey-deep hover:text-surface-light active:bg-intention-blue active:border-intention-blue active:text-surface-light active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 sm:w-4.5 sm:h-4.5">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <!-- Purely Visual Instagram-Style Dot Window (5+2) -->
          <div
            class="relative overflow-hidden flex items-center"
            :style="{ width: `${wrapperWidth}px`, height: '16px' }"
            aria-hidden="true"
          >
            <div
              class="absolute left-0 top-1/2 flex items-center gap-2 transition-transform duration-300 ease-out will-change-transform"
              :style="{ transform: `translate3d(${trackTranslateX}px, -50%, 0)` }"
            >
              <span
                v-for="index in totalStops"
                :key="index"
                :class="[
                  'rounded-full w-1.5 h-1.5 shrink-0 transition-all duration-300 ease-out',
                  getDotStyle(index - 1)
                ]"
              />
            </div>
          </div>

          <!-- Next Slide Arrow Button -->
          <button
            type="button"
            aria-label="Next slide"
            :disabled="sliderRef ? !sliderRef.canGoNext : false"
            @click="handleNext"
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-journey-deep/25 bg-transparent text-journey-deep flex items-center justify-center transition-all duration-300 ease-out hover:bg-journey-deep hover:border-journey-deep hover:text-surface-light active:bg-intention-blue active:border-intention-blue active:text-surface-light active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 sm:w-4.5 sm:h-4.5">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>

        <!-- Bottom Quote -->
        <p
          v-motion-fade-up
          class="text-darker-gold px-4 mb-8 md:mb-10 lg:max-w-3xl xl:max-w-4xl section-quote"
        >
          {{ data.bottomQuote }}
        </p>

        <!-- CTA Button -->
        <div
          v-motion-fade-up
          :delay="100"
          class="will-change-transform"
        >
          <CtaButton
            :to="data.ctaTo"
            :label="data.ctaLabel"
            variant="light"
          />
        </div>

      </div>
    </div>
  </section>
</template>
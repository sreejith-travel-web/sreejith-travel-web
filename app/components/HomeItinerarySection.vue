<!-- ~/app/components/HomeItinerarySection.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import StackedFanSlider from '~/components/StackedFanSlider.vue'
import CtaButton from '~/components/CtaButton.vue'
import type { StackedFanSliderConfig } from '~/components/StackedFanSlider.vue'

export interface ItinerarySectionConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  subtitle: string
  description: string
  bottomQuote: string
  ctaLabel: string
  ctaTo: string
  slider: StackedFanSliderConfig
}

const props = defineProps<{
  data: ItinerarySectionConfig
}>()

// Component Ref to control the slider externally via dots
const sliderRef = ref<InstanceType<typeof StackedFanSlider> | null>(null)

// Track active slide
const activeIndex = ref(props.data.slider.initialIndex || 0)
const totalSlides = computed(() => props.data.slider.slides?.length || 0)

// Update state when the slider engine emits a change
const handleSlideChange = (index: number) => {
  activeIndex.value = index
}

// --- Instagram-Style Dot Logic ---
const MAX_NORMAL_DOTS = 5
const DOT_SIZE = 28 // px
const GAP_SIZE = 8 // px
const STRIDE = DOT_SIZE + GAP_SIZE // 14px

// Calculates which dot sits at the far left of the 5-dot "normal" window
const windowStart = computed(() => {
  const n = totalSlides.value
  if (n <= MAX_NORMAL_DOTS) return 0
  if (activeIndex.value < 2) return 0 // Near start
  if (activeIndex.value > n - 3) return n - MAX_NORMAL_DOTS // Near end
  return activeIndex.value - 2 // Keep active dot perfectly centered
})

// Calculates the physical track translation to keep the 5 normal dots locked in the center
const trackTranslateX = computed(() => {
  if (totalSlides.value <= MAX_NORMAL_DOTS) return 0
  // 14px offset perfectly centers the 5-dot window inside the 7-dot wrapper
  return STRIDE - (windowStart.value * STRIDE)
})

// Calculates the exact wrapper width needed
const wrapperWidth = computed(() => {
  const n = totalSlides.value
  if (n <= MAX_NORMAL_DOTS) return (n * DOT_SIZE) + ((n - 1) * GAP_SIZE)
  return (7 * DOT_SIZE) + (6 * GAP_SIZE) // Fixed width for exactly 7 dots (90px)
})

// Returns the dynamic scale and opacity for each dot based on its position in the window
const getDotStyle = (index: number) => {
  if (index === activeIndex.value) {
    return 'bg-journey-deep opacity-100 scale-100'
  }
  
  const ws = windowStart.value
  if (index >= ws && index < ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-40 scale-100 hover:opacity-70' // Normal dots
  }
  if (index === ws - 1 || index === ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-20 scale-[0.6] hover:opacity-50' // Translucent edge dots
  }
  
  return 'bg-journey-deep opacity-0 scale-0 pointer-events-none' // Hidden outer dots
}

const goToSlide = (index: number) => {
  sliderRef.value?.goToRealIndex(index)
}
</script>

<template>
  <section 
    data-theme="light"
    class="text-primary-light overflow-hidden section-wrapper"
  >
    <div class="relative w-full max-w-[1640px] flex flex-col items-center">

      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full max-w-3xl flex flex-col items-center text-center mb-6 md:mb-8">
        
        <!-- Eyebrow with flanking lines -->
        <div 
          v-motion-fade-up
          class="eyebrow-wrapper"
        >
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep eyebrow-text">
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
          <p
            class=" text-journey-deep/90 max-w-2xl lg:max-w-3xl px-4 section-paragraph">
            {{ data.description }}
          </p>
        </div>
      </div>

      <!-- 2. THE SLIDER ENGINE -->
      <div 
        v-motion
        :initial="{ opacity: 0, filter: 'blur(5px)', scale: 0.98 }"
        :visible-once="{ opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 300 } }"
        class="relative z-10 w-full mb-6 md:mb-8 will-change-[transform,opacity]"
      >
        <ClientOnly>
          <StackedFanSlider 
            ref="sliderRef"
            :data="data.slider" 
            :aria-label="data.eyebrow"
            @change="handleSlideChange" 
          />

          <!-- Fallback matching the center card dimensions exactly (0.000 CLS) -->
          <template #fallback>
            <div 
              class="relative w-full flex items-center justify-center py-4 sm:py-6" 
              aria-hidden="true"
            >
              <div 
                :style="{ aspectRatio: data.slider.aspectRatio || '2 / 3' }"
                class="w-[72vw] 2xs:w-[68vw] xs:w-[64vw] sm:w-[56vw] md:w-[40vw] lg:w-[32vw] xl:w-[26vw] 2xl:w-[22vw] max-w-88 min-w-36 rounded-xl sm:rounded-2xl bg-journey-deep/5"
              />
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- 3. FOOTER CONTENT (Pagination, Quote, CTA) -->
      <div class="relative z-10 w-full flex flex-col items-center text-center">
        
        <!-- Instagram-Style Dynamic Dot Pagination -->
        <div 
          v-if="totalSlides > 1"
          v-motion-micro-up
          :delay="100"      
          class="flex items-center justify-center h-4 mb-10 will-change-transform"
        > 
          <!-- Fixed Viewport Window -->
          <div class="relative overflow-hidden" :style="{ width: `${wrapperWidth}px`, height: '16px' }">
            <!-- Sliding Track -->
            <div 
              class="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-transform duration-300 ease-out will-change-transform"
              :style="{ transform: `translate3d(${trackTranslateX}px, -50%, 0)` }"
            >
              <button
                v-for="index in totalSlides"
                :key="index"
                :aria-label="`Go to slide ${index}`"
                :class="[
                  'rounded-full w-7 h-2 transition-all duration-300 ease-out cursor-pointer',
                  getDotStyle(index - 1)
                ]"
                @click="goToSlide(index - 1)"
              />
            </div>
          </div>
        </div>

        <!-- Bottom Quote -->
        <p 
          v-motion-fade-up         
          class="text-darker-gold px-4 mb-10 lg:max-w-3xl xl:max-w-4xl section-quote"
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
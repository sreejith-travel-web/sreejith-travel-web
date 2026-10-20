<!-- ~/app/components/HomeHero.vue -->

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import CtaButton from '~/components/CtaButton.vue'
import BackgroundVideo from '~/components/BackgroundVideo.vue'

type HeroMode = 'image' | 'video' | 'slideshow'

interface HeroSlide {
  type: 'image' | 'video'
  videoWebm?: string
  videoMp4?: string
  imageDesktop?: string
  imageMobile?: string
  alt: string
}

interface HeroContent {
  mode: HeroMode
  autoplay: boolean
  autoplayIntervalMs: number
  subtitleText: string
  headingLine1: string
  headingLine2Italic: string
  description: string
  slides: HeroSlide[]
}

const props = defineProps<{
  data: HeroContent
}>()

const isInitialAppLoad = useInitialAppLoad()
const isFinishedLoading = ref(false)
const currentSlideIndex = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const { forceTransparent } = useHeaderTheme()
const { y } = useWindowScroll()

// Inertia Parallax
const getParallax = (speed: number) => {
  if (!import.meta.client) return {}
  return { transform: `translateY(-${y.value * speed}px)` }
}

// Section Tints (kept decoupled from JSON payloads)
const VIDEO_TINT_CLASS = 'bg-linear-to-b from-journey-deep/40 via-journey-deep/60 to-journey-deep/80'
const IMAGE_TINT_CLASS = 'bg-linear-to-b from-journey-deep/35 via-journey-deep/60 to-journey-deep/85'

// Global Fallbacks
const FALLBACK_DESKTOP = '/images/video-posters/sreejith-hero-landscape.webp'
const FALLBACK_MOBILE = '/images/video-posters/sreejith-hero-portrait.webp'
const FALLBACK_VIDEO_WEBM = '/videos/sreejith-hero.webm'
const FALLBACK_VIDEO_MP4 = '/videos/sreejith-hero.mp4'

const slides = computed<HeroSlide[]>(() => {
  let rawSlides = props.data.slides

  if (props.data.mode === 'image') {
    const imageSlides = props.data.slides.filter((s) => s.type === 'image')
    rawSlides = imageSlides.length > 0 ? imageSlides.slice(0, 1) : props.data.slides.slice(0, 1)
  } else if (props.data.mode === 'video') {
    const videoSlides = props.data.slides.filter((s) => s.type === 'video')
    rawSlides = videoSlides.length > 0 ? videoSlides.slice(0, 1) : props.data.slides.slice(0, 1)
  }

  return rawSlides.map(slide => ({
    ...slide,
    videoWebm: slide.videoWebm || FALLBACK_VIDEO_WEBM,
    videoMp4: slide.videoMp4 || FALLBACK_VIDEO_MP4,
    imageDesktop: slide.imageDesktop || FALLBACK_DESKTOP,
    imageMobile: slide.imageMobile || FALLBACK_MOBILE
  }))
})

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const nextSlide = () => {
  if (slides.value.length <= 1) return
  currentSlideIndex.value = (currentSlideIndex.value + 1) % slides.value.length
}

const startAutoplay = () => {
  stopAutoplay()
  if (props.data.mode === 'slideshow' && props.data.autoplay && slides.value.length > 1) {
    autoplayTimer = setInterval(() => {
      nextSlide()
    }, props.data.autoplayIntervalMs)
  }
}

const selectSlide = (index: number) => {
  stopAutoplay()
  currentSlideIndex.value = index
  startAutoplay()
}

onMounted(() => {
  forceTransparent.value = true

  if (!isInitialAppLoad.value) {
    isFinishedLoading.value = true
  } else {
    const unwatch = watch(isInitialAppLoad, (loading) => {
      if (!loading) {
        isFinishedLoading.value = true
        unwatch()
      }
    })
  }

  startAutoplay()
})

onUnmounted(() => {
  forceTransparent.value = false
  stopAutoplay()
})
</script>

<template>
  <section
    data-theme="dark"
    aria-label="Home page hero introduction"
    class="relative w-full h-svh min-h-160 bg-bg-dark flex flex-col justify-center items-center overflow-hidden p-0 m-0 border-0"
  >
    <!-- Background Layers -->
    <div class="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <TransitionGroup name="fade-slide">
        <div
          v-for="(slide, index) in slides"
          v-show="index === currentSlideIndex"
          :key="`hero-slide-${index}`"
          class="absolute inset-0 w-full h-full overflow-hidden"
          aria-hidden="true"
        >
          <!-- Dynamic Ken Burns Zoom Wrapper: Remounts on active slide change to smoothly zoom from 106% to 100% -->
          <div
            :key="`zoom-media-${index}-${currentSlideIndex === index}`"
            :class="[
              'w-full h-full will-change-transform',
              index === currentSlideIndex ? 'animate-kenburns-zoom' : ''
            ]"
          >
            <!-- Video Slide -->
            <BackgroundVideo
              v-if="slide.type === 'video'"
              :video-webm="slide.videoWebm"
              :video-mp4="slide.videoMp4"
              :poster-desktop="slide.imageDesktop!"
              :poster-mobile="slide.imageMobile!"
              :poster-desktop-width="1280"
              :poster-desktop-height="720"
              :poster-mobile-width="540"
              :poster-mobile-height="720"
              :alt="slide.alt"
              :tint-class="VIDEO_TINT_CLASS"
              :is-active="index === currentSlideIndex"
              :priority="index === 0"
            />

            <!-- Image Slide -->
            <template v-else>
              <picture class="block w-full h-full">
                <source media="(min-width: 768px)" :srcset="slide.imageDesktop" type="image/webp" width="1600" height="900" />
                <source media="(max-width: 767px)" :srcset="slide.imageMobile" type="image/webp" width="600" height="900" />
                <img
                  :src="slide.imageDesktop"
                  :alt="slide.alt"
                  width="1600"
                  height="900"
                  :fetchpriority="index === 0 ? 'high' : 'low'"
                  :loading="index === 0 ? 'eager' : 'lazy'"
                  :decoding="index === 0 ? 'sync' : 'async'"
                  class="w-full h-full object-cover object-center"
                />
              </picture>

              <!-- Image Cinematic Gradient -->
              <div :class="['absolute inset-0 z-5', IMAGE_TINT_CLASS]" />
            </template>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Foreground Content (Text Safe Zone) -->
    <div class="relative z-10 w-full h-full min-h-full max-w-240 mx-auto px-2 2xs:px-4 xs:px-6 sm:px-8 md:px-12 lg:px-24 flex items-center justify-center py-20">
      <div
        v-if="isFinishedLoading"
        class="w-full flex flex-col items-center text-center mt-[4vh] lg:mt-[8vh]"
      >
        <!-- 1. H1 Eyebrow (Starts at 150ms) -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 18 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 900, ease: [0.22, 1, 0.36, 1], delay: 150 } }"
          :style="getParallax(0.5)"
          class="flex items-center justify-center w-full max-w-full px-2 mb-4 md:mb-5 max-[321px]:flex-wrap max-[321px]:gap-y-1 will-change-transform transition-transform duration-700 ease-out"
        >
          <div class="h-0.5 mb-0.5 rounded-md bg-warm-gold/70 grow max-w-5 md:max-w-12 shrink-2" />
          <h1 class="font-uppercase mx-2 md:mx-4 text-[10px] xs:text-[11px] sm:text-xs lg:text-[13px] tracking-[0.25em] md:tracking-[0.3em] text-surface-light/90 uppercase">
            {{ data.subtitleText }}
          </h1>
          <div class="h-0.5 mb-0.5 rounded-md bg-warm-gold/70 grow max-w-5 md:max-w-12 shrink-2" />
        </div>

        <!-- 2 & 3. Heading Hierarchy (Line 1 at 350ms, Line 2 Cursive at 580ms) -->
        <h2 class="text-surface-light mb-4 md:mb-8 drop-shadow-2xl w-full xs:max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
          <!-- Primary Line -->
          <span 
            v-motion
            :initial="{ opacity: 0, y: 22, filter: 'blur(4px)' }"
            :enter="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1000, ease: [0.22, 1, 0.36, 1], delay: 350 } }"
            :style="getParallax(0.45)" 
            class="font-primary text-[24px] xs:text-3xl md:text-4xl lg:text-5xl tracking-normal leading-snug font-medium block max-[320px]:[text-balance] will-change-transform transition-transform duration-700 ease-out"
          >
            {{ data.headingLine1 }}
          </span>

          <!-- Cursive Line -->
          <span 
            v-motion
            :initial="{ opacity: 0, y: 22, filter: 'blur(4px)' }"
            :enter="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1050, ease: [0.22, 1, 0.36, 1], delay: 580 } }"
            :style="getParallax(0.45)" 
            class="font-cursive text-3xl 2xs:text-[34px] xs:text-[40px] md:text-6xl lg:text-7xl text-warm-gold tracking-wide leading-snug block mt-2 md:mt-3 max-[321px]:[text-balance] will-change-transform transition-transform duration-700 ease-out"
          >
            {{ data.headingLine2Italic }}
          </span>
        </h2>

        <!-- 4. Description (Starts at 800ms) -->
        <p
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 1000, ease: [0.22, 1, 0.36, 1], delay: 800 } }"
          :style="getParallax(0.4)"
          class="font-primary w-full xs:max-w-md sm:max-w-xl lg:max-w-2xl text-xs 2xs:text-sm xs:text-base sm:text-lg lg:text-xl leading-relaxed tracking-wide text-surface-medium font-light mb-10 md:mb-12 drop-shadow-md max-[320px]:[text-balance] will-change-transform transition-transform duration-700 ease-out"
        >
          {{ data.description }}
        </p>

        <!-- 5. CTAs (Starts at 1020ms) -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 18 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 900, ease: [0.22, 1, 0.36, 1], delay: 1020 } }"
          :style="getParallax(0.35)"
          class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full will-change-transform transition-transform duration-700 ease-out"
        >
          <CtaButton to="/itineraries" label="Explore Itineraries" variant="dark" />
          <CtaButton to="/planYourJourney" label="Plan Your Journey" variant="dark" />
        </div>
      </div>
    </div>

    <!-- Slideshow Navigation -->
    <div
      v-if="isFinishedLoading && data.mode === 'slideshow' && slides.length > 1"
      class="absolute bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 pointer-events-auto"
      role="tablist"
      aria-label="Slideshow navigation"
    >
      <button
        v-for="(_, index) in slides"
        :key="`indicator-${index}`"
        type="button"
        role="tab"
        @click="selectSlide(index)"
        :aria-label="`View slide ${index + 1}`"
        :aria-selected="index === currentSlideIndex"
        class="group flex items-center justify-center cursor-pointer py-3 px-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-warm-gold rounded"
      >
        <span
          :class="[
            'block h-1 rounded-full transition-all duration-500 ease-editorial',
            index === currentSlideIndex
              ? 'w-15 bg-warm-gold'
              : 'w-4 bg-surface-light/40 group-hover:bg-surface-light/80 group-active:bg-surface-light/80'
          ]"
        />
      </button>
    </div>
  </section>
</template>

<style scoped>
/* Cross-fade between slides */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 1.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}

/* Ken Burns Subtle Zoom Out from 106% to 100% */
@keyframes heroKenBurns {
  0% {
    transform: scale(1.06);
  }
  100% {
    transform: scale(1);
  }
}

.animate-kenburns-zoom {
  animation: heroKenBurns 7.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}
</style>
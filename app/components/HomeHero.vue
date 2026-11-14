<!-- ~/app/components/HomeHero.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
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
  headingLine2Cursive: string
  description: string
  slides: HeroSlide[]
}

const props = defineProps<{
  data: HeroContent
}>()

const isInitialAppLoad = useInitialAppLoad()
const hasPlayedEntrance = ref(false)
const isHeroActive = ref(false)
const isReturnVideoHold = ref(false)
const heroActivationCycle = ref(0)
const currentSlideIndex = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const { forceTransparent } = useHeaderTheme()
const { y } = useWindowScroll()

const getParallax = (speed: number) => {
  if (!import.meta.client) return undefined
  const scrollY = y.value
  if (scrollY <= 0 || scrollY > 1100) return undefined
  return { transform: `translate3d(0, -${(scrollY * speed).toFixed(1)}px, 0)` }
}

const kenBurnsDurationStyle = computed(() => {
  const durationMs =
    props.data.autoplayIntervalMs && props.data.autoplayIntervalMs >= 3000
      ? props.data.autoplayIntervalMs
      : 7000
  return { '--ken-burns-duration': `${durationMs}ms` }
})

const VIDEO_TINT_CLASS = 'bg-linear-to-b from-journey-deep/30 via-journey-deep/60 to-journey-deep/70'
const IMAGE_TINT_CLASS = 'bg-linear-to-b from-journey-deep/30 via-journey-deep/60 to-journey-deep/80'

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

  return rawSlides.map((slide) => ({
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
  heroActivationCycle.value += 1
  startAutoplay()
}

// Once the slide changes away from the return hold, release the hold so video plays when cycle completes
watch(currentSlideIndex, () => {
  if (isReturnVideoHold.value) {
    isReturnVideoHold.value = false
  }
})

const activateHero = () => {
  forceTransparent.value = true
  isHeroActive.value = true
  if (hasPlayedEntrance.value) {
    isReturnVideoHold.value = true
    heroActivationCycle.value += 1
    startAutoplay()
  }
}

const deactivateHero = () => {
  forceTransparent.value = false
  isHeroActive.value = false
  stopAutoplay()
}

onMounted(() => {
  forceTransparent.value = true

  if (!isInitialAppLoad.value) {
    hasPlayedEntrance.value = true
    isHeroActive.value = true
    startAutoplay()
  } else {
    const unwatch = watch(
      isInitialAppLoad,
      (isStillLoading) => {
        if (!isStillLoading) {
          hasPlayedEntrance.value = true
          isHeroActive.value = true
          startAutoplay()
          unwatch()
        }
      },
      { flush: 'sync' }
    )
  }
})

onActivated(activateHero)
onDeactivated(deactivateHero)
onUnmounted(deactivateHero)
</script>

<template>
  <section
    data-theme="dark"
    aria-label="Home page hero introduction"
    :style="kenBurnsDurationStyle"
    class="relative w-full h-svh min-h-160 bg-bg-dark flex flex-col justify-center items-center overflow-hidden p-0 m-0 border-0"
  >
    <!-- 1. Background Layers -->
    <div class="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <TransitionGroup name="fade-slide">
        <div
          v-for="(slide, index) in slides"
          v-show="index === currentSlideIndex"
          :key="`hero-slide-${index}`"
          class="absolute inset-0 w-full h-full overflow-hidden"
          aria-hidden="true"
        >
          <!-- Video Slide: Standard entrance on first load; expressive Ken Burns on return until slide cycle completes -->
          <div
            v-if="slide.type === 'video'"
            :key="`video-wrap-${index}-${isReturnVideoHold ? heroActivationCycle : 'init'}`"
            class="w-full h-full hero-video-media"
            :class="[
              hasPlayedEntrance && index === currentSlideIndex ? 'is-revealed' : '',
              isReturnVideoHold && isHeroActive && index === currentSlideIndex ? 'is-return-loop' : ''
            ]"
          >
            <BackgroundVideo
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
          </div>

          <!-- Still Image Slide: Continuous looping Ken Burns zoom on every slide & every return -->
          <div
            v-else
            :key="`still-zoom-${index}-${currentSlideIndex === index}-${heroActivationCycle}`"
            class="w-full h-full hero-image-loop"
            :class="hasPlayedEntrance && isHeroActive && index === currentSlideIndex ? 'is-animating' : ''"
          >
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

            <div :class="['absolute inset-0 z-5', IMAGE_TINT_CLASS]" />
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- 2. Foreground Content (Plays once on initial entrance, stays settled on return) -->
    <div class="relative z-10 w-full h-full min-h-full max-w-270 mx-auto px-2 2xs:px-4 xs:px-6 sm:px-8 md:px-12 lg:px-24 flex items-center justify-center py-20">
      <div class="w-full flex flex-col items-center text-center mt-[2vh] lg:mt-[6vh]">
        
        <!-- Item 1: Eyebrow (0ms) -->
        <div :style="getParallax(0.48)" class="w-full flex justify-center">
          <div
            style="--stagger-delay: 0ms"
            :class="['eyebrow-wrapper hero-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
          >
            <div class="bg-warm-gold/70 eyebrow-border" />
            <h1 class="text-surface-light/90 eyebrow-text">
              {{ data.subtitleText }}
            </h1>
            <div class="bg-warm-gold/70 eyebrow-border" />
          </div>
        </div>

        <!-- Item 2 & 3: Heading Hierarchy (90ms & 180ms) -->
        <h2 class="section-title-wrapper">
          <span :style="getParallax(0.44)" class="block w-full">
            <span
              style="--stagger-delay: 90ms"
              :class="['block text-surface-light page-title-sans capitalize hero-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
            >
              {{ data.headingLine1 }}
            </span>
          </span>

          <span :style="getParallax(0.4)" class="block w-full">
            <span
              style="--stagger-delay: 180ms"
              :class="['text-warm-gold mt-2 md:mt-3 section-title-cursive hero-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
            >
              {{ data.headingLine2Cursive }}
            </span>
          </span>
        </h2>

        <!-- Item 4: Description (270ms) -->
        <div :style="getParallax(0.36)" class="w-full flex justify-center">
          <p
            style="--stagger-delay: 270ms"
            :class="['text-surface-medium w-full max-w-sm xs:max-w-md sm:max-w-xl lg:max-w-3xl mb-8 md:mb-10 hero-paragraph hero-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
          >
            {{ data.description }}
          </p>
        </div>

        <!-- Item 5: CTAs (360ms) -->
        <div :style="getParallax(0.32)" class="w-full flex justify-center">
          <div
            style="--stagger-delay: 360ms"
            :class="['hero-cta-wrapper hero-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
          >
            <CtaButton to="/itineraries" label="Explore Itineraries" variant="dark" />
            <CtaButton to="/planYourJourney" label="Plan Your Journey" variant="dark" />
          </div>
        </div>

      </div>
    </div>

    <!-- Item 6: Slideshow Navigation (450ms) -->
    <div
      v-if="data.mode === 'slideshow' && slides.length > 1"
      style="--stagger-delay: 450ms"
      :class="['absolute bottom-8 lg:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 pointer-events-auto hero-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
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
            'relative block h-1 rounded-full overflow-hidden transition-all duration-500 ease-editorial',
            index === currentSlideIndex
              ? 'w-15 bg-surface-light/25'
              : 'w-4 bg-surface-light/40 group-hover:bg-surface-light/80 group-active:bg-surface-light/80'
          ]"
        >
          <span
            v-if="index === currentSlideIndex"
            :key="`progress-${currentSlideIndex}-${heroActivationCycle}`"
            :class="[
              'block w-full h-full bg-warm-gold rounded-full origin-left',
              data.autoplay && hasPlayedEntrance && isHeroActive
                ? 'hero-indicator-progress'
                : 'scale-x-100'
            ]"
          />
        </span>
      </button>
    </div>

    <!-- Item 7: Award Badge (540ms) -->
    <div
      style="--stagger-delay: 540ms"
      :class="['absolute bottom-3 md:bottom-4 lg:bottom-5 left-3 md:left-4 lg:left-5 brightness-0 invert-100 z-30 pointer-events-auto select-none hover:brightness-100 hover:invert-0 active:brightness-100 active:invert-0 transition-all duration-300 ease-editorial hero-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
    >
      <img
        src="/images/home/award.webp"
        alt="Outlook Traveller Responsible Tourism India 2025 Awards"
        width="200"
        height="214"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        class="w-20 xs:w-22 sm:w-24 md:w-26 lg:w-28 h-auto aspect-200/214 object-contain opacity-95 drop-shadow-md pointer-events-none"
      />
    </div>
  </section>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 1.4s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}

/* 1A. Video Slide: Original 1st-Load Entrance + Expressive Return Ken Burns Hold */
.hero-video-media {
  transform: scale3d(1.12, 1.12, 1);
  will-change: transform;
  transition: transform 2.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-video-media.is-revealed {
  transform: scale3d(1, 1, 1);
}

.hero-video-media.is-return-loop {
  transition: none;
  animation: hero-video-poster-return var(--ken-burns-duration, 7000ms) cubic-bezier(0.33, 0, 0.67, 1) infinite alternate;
}

@keyframes hero-video-poster-return {
  0% {
    transform: scale3d(1.18, 1.18, 1) translate3d(-1.5%, -1%, 0);
  }
  100% {
    transform: scale3d(1.02, 1.02, 1) translate3d(1%, 0.5%, 0);
  }
}

/* 1B. Still Image Continuous Looping Ken Burns Animation */
.hero-image-loop {
  transform: scale3d(1.12, 1.12, 1);
  will-change: transform;
}

.hero-image-loop.is-animating {
  animation: hero-ken-burns-loop var(--ken-burns-duration, 7000ms) cubic-bezier(0.37, 0, 0.63, 1) infinite alternate;
}

@keyframes hero-ken-burns-loop {
  0% {
    transform: scale3d(1.12, 1.12, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}

/* 2. Foreground Stagger: Rises 28px over 1.0s on first entrance */
.hero-stagger-item {
  opacity: 0;
  transform: translate3d(0, 28px, 0);
  will-change: transform, opacity;
  transition:
    opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
    transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--stagger-delay, 0ms);
}

.hero-stagger-item.is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}

/* 3. Active Slide Indicator Progress Fill */
.hero-indicator-progress {
  transform: scale3d(0, 1, 1);
  will-change: transform;
  animation: hero-indicator-fill var(--ken-burns-duration, 7000ms) linear forwards;
}

@keyframes hero-indicator-fill {
  0% {
    transform: scale3d(0, 1, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}
</style>
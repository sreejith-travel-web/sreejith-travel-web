<!-- ~/app/components/PageHero.vue -->

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useWindowScroll } from '@vueuse/core'

export interface PageHeroContent {
  eyebrow?: string
  titleMain?: string
  titleItalic?: string
  intro?: string
  imageDesktop?: string
  imageMobile?: string
  alt?: string
}

const props = defineProps<{
  data?: PageHeroContent | null
}>()

const isInitialAppLoad = useState<boolean>('isInitialAppLoad')
const isFinishedLoading = ref(false)

const { forceTransparent } = useHeaderTheme()
const { y } = useWindowScroll()

// Subtle Inertia Parallax matching HomeHero
const getParallax = (speed: number) => {
  if (!import.meta.client) return {}
  return { transform: `translateY(-${y.value * speed}px)` }
}

const FALLBACK_HERO: Required<PageHeroContent> = {
  eyebrow: 'Explore',
  titleMain: 'Uncover Stories',
  titleItalic: 'Off The Beaten Path',
  intro: 'Immerse yourself in authentic traditions, pristine landscapes, and meaningful local encounters.',
  imageDesktop: '/images/home/hero.jpg',
  imageMobile: '/images/home/hero.jpg',
  alt: 'Bespoke cultural travel experience in India'
}

const activeData = computed<Required<PageHeroContent>>(() => ({
  eyebrow: props.data?.eyebrow || FALLBACK_HERO.eyebrow,
  titleMain: props.data?.titleMain || FALLBACK_HERO.titleMain,
  titleItalic: props.data?.titleItalic || FALLBACK_HERO.titleItalic,
  intro: props.data?.intro || FALLBACK_HERO.intro,
  imageDesktop: props.data?.imageDesktop || FALLBACK_HERO.imageDesktop,
  imageMobile: props.data?.imageMobile || FALLBACK_HERO.imageMobile,
  alt: props.data?.alt || props.data?.titleMain || FALLBACK_HERO.alt
}))

onMounted(() => {
  // Inner pages never use a transparent header
  forceTransparent.value = false

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
})
</script>

<template>
  <div class="w-full bg-bg-light">
    <!-- 1. Top Header Spacer (Forces Header to start in LIGHT mode at top of page) -->
    <div 
      data-theme="light" 
      class="w-full h-16 md:h-20 bg-bg-light" 
      aria-hidden="true"
    />

    <!-- 2. Hero Card Section (Switches Header to DARK mode as it scrolls underneath) -->
    <section 
      data-theme="dark"
      :aria-label="`${activeData.titleMain} hero banner`"
      class="w-full bg-bg-light p-2 sm:p-3 lg:p-4 flex justify-center"
    >
      <!-- Outer Card Container with Responsive Aspect Ratios -->
      <div 
        class="relative w-full rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden aspect-4/3 sm:aspect-2/1 md:aspect-2.5/1 lg:aspect-3/1 xl:aspect-[3.5/1] 2xl:aspect-4/1 shadow-xl md:shadow-2xl bg-journey-deep flex items-center justify-center"
      >
        <!-- Background Image & Cinematic Overlays -->
        <div class="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <picture class="block w-full h-full">
            <source media="(min-width: 768px)" :srcset="activeData.imageDesktop" type="image/webp" width="1600" height="1065" />
            <source media="(max-width: 767px)" :srcset="activeData.imageMobile" type="image/webp" width="750" height="1000" />
            <img 
              :src="activeData.imageDesktop" 
              :alt="activeData.alt"
              width="1600"
              height="1065"
              fetchpriority="high"
              loading="eager"
              decoding="sync"
              class="w-full h-full object-cover object-center scale-105 transition-transform duration-2000 ease-out"
            />
          </picture>
          <!-- Editorial Gradient Tint -->
          <div class="absolute inset-0 bg-linear-to-b from-journey-deep/35 via-journey-deep/60 to-journey-deep/85" />
        </div>

        <!-- Foreground Content -->
        <div 
          v-if="isFinishedLoading"
          class="relative z-10 w-full max-w-4xl px-4 2xs:px-6 sm:px-10 md:px-16 py-8 flex flex-col items-center text-center"
        >
          <!-- H1 Eyebrow -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 15 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut', delay: 70 } }"
            :style="getParallax(0.25)"
            class="flex items-center justify-center w-full max-w-full px-2 mb-3 md:mb-4 will-change-transform transition-transform duration-700 ease-out"
          >
            <span class="h-px bg-warm-gold/50 grow max-w-6 md:max-w-12 shrink-2" />
            <h1 class="mx-3 md:mx-4 text-[9px] 2xs:text-[10px] sm:text-[11px] lg:text-xs font-uppercase tracking-[0.25em] md:tracking-[0.3em] text-surface-light/90 uppercase">
              {{ activeData.eyebrow }}
            </h1>
            <span class="h-px bg-warm-gold/50 grow max-w-6 md:max-w-12 shrink-2" />
          </div>

          <!-- H2 Title Hierarchy -->
          <h2 
            v-motion
            :initial="{ opacity: 0, y: 20, filter: 'blur(3px)' }"
            :enter="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 500, ease: 'easeOut', delay: 140 } }"
            :style="getParallax(0.2)"
            class="text-surface-light mb-4 md:mb-5 drop-shadow-xl w-full will-change-transform transition-transform duration-700 ease-out"
          >
            <span class="font-primary text-2xl xs:text-3xl md:text-4xl lg:text-5xl tracking-normal leading-snug font-medium block">
              {{ activeData.titleMain }}
            </span>
            <span class="font-cursive text-3xl xs:text-4xl md:text-5xl lg:text-6xl text-warm-gold tracking-[0.04em] leading-[0.9] block mt-1.5 md:mt-2">
              {{ activeData.titleItalic }}
            </span>
          </h2>

          <!-- Decorative Brand Divider -->
          <div 
            v-motion
            :initial="{ opacity: 0, scale: 0.9 }"
            :enter="{ opacity: 1, scale: 1, transition: { duration: 500, ease: 'easeOut', delay: 190 } }"
            :style="getParallax(0.18)"
            class="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-5 w-full max-w-40 md:max-w-55 will-change-transform transition-transform duration-700 ease-out"
            aria-hidden="true"
          >
            <span class="h-px grow bg-warm-gold/30" />
            <div class="w-4 md:w-5 text-warm-gold/80 shrink-0">
              <SvgLogoMark :draw="false" />
            </div>
            <span class="h-px grow bg-warm-gold/30" />
          </div>

          <!-- Description / Intro -->
          <p 
            v-motion
            :initial="{ opacity: 0, y: 15 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut', delay: 240 } }"
            :style="getParallax(0.15)"
            class="font-primary text-xs 2xs:text-sm md:text-base lg:text-lg leading-relaxed tracking-wide text-surface-medium/90 font-light max-w-xl drop-shadow-sm will-change-transform transition-transform duration-700 ease-out"
          >
            {{ activeData.intro }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>
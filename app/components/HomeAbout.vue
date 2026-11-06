<!-- ~/app/components/HomeAbout.vue -->
<script setup lang="ts">
import CtaButton from '~/components/CtaButton.vue'

export interface AboutStat {
  value: string
  subtitle: string
  description: string
}

export interface HomeAboutContent {
  eyebrow?: string
  greeting: string
  name: string
  designations: string[]
  paragraph: string
  portraitImageDesktop: string
  portraitImageMobile: string
  portraitAlt: string
  stats: AboutStat[]
  bottomQuote: string
  ctaLabel?: string
  ctaTo?: string
}

defineProps<{
  data: HomeAboutContent
}>()
</script>

<template>
  <section
    data-theme="light"
    aria-label="About Sreejith"
    class="text-primary-light overflow-hidden section-wrapper"
  >
    <div class="w-full max-w-6xl mx-auto flex flex-col items-center">
      
      <!-- 1. TOP CENTERED HEADER & INTRO -->
      <div class="relative z-10 w-full max-w-4xl flex flex-col items-center text-center">
        
        <!-- Eyebrow -->
        <div v-if="data.eyebrow" v-motion-fade-up class="eyebrow-wrapper">
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
          class="leading-[1.2] tracking-normal mb-3 md:mb-4 will-change-transform"
        >
          <span class="text-action-blue mr-2 section-title-italic">
            {{ data.greeting }}
          </span>
          <span class="text-journey-deep section-title-sans capitalize">
            {{ data.name }}
          </span>
        </h2>

        <!-- Designations Row -->
        <div
          v-motion-fade-up
          :delay="150"
          class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-y-1 sm:gap-x-2.5 max-w-[92vw] will-change-transform mb-4 md:mb-5"
        >
          <template v-for="(role, index) in data.designations" :key="index">
            <span class="text-dark-gold section-midsubtitle mb-0">
              {{ role }}
            </span>
            <span
              v-if="index !== data.designations.length - 1"
              class="hidden sm:inline-block text-dark-gold section-midsubtitle mb-0 select-none"
              aria-hidden="true"
            >
              ·
            </span>
          </template>
        </div>

        <!-- Introduction Paragraph -->
        <p
          v-motion-fade-up
          :delay="200"
          class="text-journey-deep/90 section-paragraph max-w-3xl px-2 sm:px-4 will-change-transform"
        >
          {{ data.paragraph }}
        </p>
      </div>

      <!-- 2. CENTER WIDE PANORAMIC COLLAGE PORTRAIT (Zero-CLS Picture Art Direction) -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 24 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 700, ease: [0.22, 1, 0.36, 1] } }"
        class="w-full max-w-5xl my-4 md:my-6 will-change-transform"
      >
        <div class="relative w-full aspect-3/2 sm:aspect-3/1 flex items-center justify-center">
          <picture class="w-full h-full flex items-center justify-center">
            <!-- 640px (sm) and above: Wide PC Collage -->
            <source
              media="(min-width: 640px)"
              :srcset="data.portraitImageDesktop"
              type="image/webp"
              width="1080"
              height="360"
            />
            <!-- Below 640px: Mobile Collage -->
            <img
              :src="data.portraitImageMobile"
              :alt="data.portraitAlt"
              width="600"
              height="400"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              draggable="false"
              @contextmenu.prevent
              class="w-full h-full object-contain object-center select-none transition-all duration-700 ease-out hover:brightness-[1.03] hover:saturate-[1.05] hover:scale-[1.01]"
            />
          </picture>
        </div>
      </div>

      <!-- 3. 4-STATISTICS BAR (2x2 Grid on Mobile -> 4-Col Divided Row on Desktop) -->
      <div class="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 mb-6 md:mb-8">
        <div
          v-for="(stat, index) in data.stats"
          :key="index"
          v-motion-fade-up
          :delay="150 + index * 80"
          class="flex flex-col items-center text-center px-3 sm:px-6 py-5 md:py-2 border-dark-gold/30 will-change-transform"
          :class="[
            index % 2 === 0 ? 'border-r' : '',
            index < 2 ? 'border-b md:border-b-0' : '',
            index === 1 ? 'md:border-r' : '',
            index === 3 ? 'border-r-0' : ''
          ]"
        >
          <!-- Line 1: Big Number -->
          <span class="text-journey-deep home-stat-number mb-1.5">
            {{ stat.value }}
          </span>

          <!-- Line 2: Single Word Label (YEARS / CONNECTIONS / EXPERIENCES / AWARD) -->
          <span class="text-dark-gold home-stat-word mb-1.5">
            {{ stat.subtitle }}
          </span>

          <!-- Line 3: Short Description -->
          <p class="text-journey-deep/85 section-subparagraph max-w-44">
            {{ stat.description }}
          </p>
        </div>
      </div>

      <!-- 4. BOTTOM QUOTE -->
      <p
        v-motion-fade-up
        :delay="200"
        class="text-darker-gold text-center px-4 mb-8 md:mb-10 max-w-2xl lg:max-w-3xl xl:max-w-4xl section-quote will-change-transform"
      >
        {{ data.bottomQuote }}
      </p>

      <!-- 5. CTA BUTTON -->
      <div
        v-motion-fade-up
        :delay="250"
        class="will-change-transform"
      >
        <CtaButton
          :to="data.ctaTo || '/about'"
          :label="data.ctaLabel || 'Explore My Story'"
          variant="light"
        />
      </div>

    </div>
  </section>
</template>
<!-- ~/app/components/HomeAbout.vue -->
<script setup lang="ts">
import CtaButton from '~/components/CtaButton.vue'

export interface AboutStat {
  value: string
  subtitle: string
  description: string
}

export interface PhilosophyPillar {
  title: string
  subtitle: string
  description: string
}

export interface HomeAboutContent {
  eyebrow?: string
  greeting: string
  name: string
  designations: string[]
  paragraph: string
  portraitImage: string
  portraitAlt: string
  pillars: PhilosophyPillar[]
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
    <div class="w-full max-w-360 mx-auto flex flex-col items-center">
      
      <!-- 1. TOP CENTERED HEADER & INTRO -->
      <div class="relative z-10 w-full max-w-4xl flex flex-col items-center text-center mb-4 md:mb-6">
        
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
          class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-y-1.5 sm:gap-x-3 max-w-[92vw] will-change-transform mb-2 md:mb-4"
        >
          <template v-for="(role, index) in data.designations" :key="index">
            <span class="text-dark-gold section-midsubtitle mb-0">
              {{ role }}
            </span>
            <span
              v-if="index !== data.designations.length - 1"
              class="hidden sm:inline-block text-dark-gold text-[12px] leading-none select-none"
              aria-hidden="true"
            >
              &nbsp;
            </span>
          </template>
        </div>

        <!-- Introduction Paragraph -->
        <p
          v-motion-fade-up
          :delay="200"
          class="text-journey-deep/90 section-paragraph max-w-7xl px-4 will-change-transform"
        >
          {{ data.paragraph }}
        </p>
      </div>

      <!-- 2. MAIN 3-COLUMN GRID -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-2 xl:gap-y-4 lg:gap-x-8 xl:gap-x-12 items-center">
        
        <!-- COLUMN A: Philosophy Pillars -->
        <!-- Mobile: Top | 1024-1279px: Bottom Full-Width 3-Col | 1280px+: Left Column -->
        <div class="order-1 lg:order-3 xl:order-1 lg:col-span-12 xl:col-span-4 flex flex-col lg:grid lg:grid-cols-3 xl:flex xl:flex-col justify-center gap-8 md:gap-10 lg:gap-x-6 xl:gap-x-0 py-4 lg:py-8 lg:pr-0 xl:pr-4">
          <div
            v-for="(pillar, index) in data.pillars"
            :key="index"
            v-motion-fade-up
            :delay="index * 100"
            class="flex flex-col items-center text-center lg:items-start lg:text-left will-change-transform"
          >
            <h3 class="text-journey-deep/90 section-subtitle mb-1.5">
              {{ pillar.title }}
            </h3>
            <span class="text-dark-gold section-midsubtitle">
              {{ pillar.subtitle }}
            </span>
            <p class="text-journey-deep/85 section-subparagraph max-w-md">
              {{ pillar.description }}
            </p>
          </div>
        </div>

        <!-- COLUMN B: Portrait Image -->
        <!-- Mobile: Center | 1024-1279px: Top Left | 1280px+: Center Column -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 30, filter: 'blur(4px)' }"
          :visible-once="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 700, ease: [0.22, 1, 0.36, 1] } }"
          class="order-2 lg:order-1 xl:order-2 lg:col-span-5 xl:col-span-4 flex flex-col items-center lg:items-end xl:items-center justify-center w-full will-change-transform"
        >
          <div class="w-full max-w-95 sm:max-w-105 lg:max-w-full aspect-4/5 flex items-center justify-center lg:justify-end xl:justify-center">
            <img
              :src="data.portraitImage"
              :alt="data.portraitAlt"
              width="480"
              height="600"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              draggable="false"
              @contextmenu.prevent
              class="w-full h-full object-contain object-center select-none transition-all duration-700 ease-out hover:brightness-[1.04] hover:saturate-[1.08] hover:scale-[1.015]"
            />
          </div>
        </div>

        <!-- COLUMN C: Statistics / Awards -->
        <!-- Mobile: Bottom | 1024-1279px: Top Right (Left Aligned) | 1280px+: Right Column (Right Aligned) -->
        <div class="order-3 lg:order-2 xl:order-3 lg:col-span-7 xl:col-span-4 flex flex-col items-center lg:items-start xl:items-end gap-8 md:gap-10 py-4 lg:py-8 lg:pl-4 xl:pl-2">
          <div
            v-for="(stat, index) in data.stats"
            :key="index"
            v-motion-fade-up
            :delay="index * 120"
            class="flex flex-col items-center text-center lg:items-start xl:items-end lg:text-left xl:text-left will-change-transform"
          >
            <span class="text-journey-deep/90 mb-1.5 section-subtitle">
              {{ stat.value }}
            </span>
            <span class="text-dark-gold section-midsubtitle">
              {{ stat.subtitle }}
            </span>
            <p class="text-journey-deep/85 text-center lg:text-left xl:text-right section-subparagraph max-w-md">
              {{ stat.description }}
            </p>
          </div>
        </div>

      </div>

      <!-- Bottom Quote -->
        <p
          v-motion-fade-up
          :delay="200"
          class="text-darker-gold text-center mt-4 lg:mt-6 px-4 mb-8 md:mb-10 max-w-2xl lg:max-w-3xl xl:max-w-4xl section-quote will-change-transform"
        >
          {{ data.bottomQuote }}
        </p>

        <!-- CTA Button -->
        <div
          v-motion-fade-up
          :delay="300"
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
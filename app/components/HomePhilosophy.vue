<!-- ~/app/components/HomePhilosophy.vue -->
<script setup lang="ts">
import YoutubePlayer from '~/components/YoutubePlayer.vue'
import type { YoutubeVideoConfig } from '~/components/YoutubePlayer.vue'

export interface PhilosophyPillar {
  title: string
  subtitle: string
  description: string
}

export interface HomePhilosophyConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  video: YoutubeVideoConfig
  pillars: PhilosophyPillar[]
  bottomQuote: string
}

defineProps<{
  data: HomePhilosophyConfig
}>()
</script>

<template>
  <section
    data-theme="light"
    class="text-primary-light overflow-hidden section-wrapper"
  >
    <div class="relative w-full max-w-360 flex flex-col items-center">

      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full max-w-3xl flex flex-col items-center text-center mb-8 md:mb-10 xl:mb-14">
        
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

        <!-- Main Title (Line 2 in Cursive) -->
        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper mb-0"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold mt-1 md:mt-2 section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>
      </div>

      <!-- 2. SINGLE-DOM RESPONSIVE BODY (Video + 3 Pillars) -->
      <div class="w-full px-2 sm:px-4 md:px-6 xl:px-8 grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-10 xl:gap-12 items-center">
        
        <!-- Video Wrapper: Top on <1280px (order-1), Right column on >=1280px (xl:order-2) -->
        <div
          v-motion
          :initial="{ opacity: 0, filter: 'blur(5px)', scale: 0.98 }"
          :visible-once="{ opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 200 } }"
          class="order-1 xl:order-2 xl:col-span-7 w-full max-w-4xl xl:max-w-none mx-auto will-change-[transform,opacity]"
        >
          <YoutubePlayer :data="data.video" />
        </div>

        <!-- Pillars Wrapper: Bottom on <1280px (order-2), Left column on >=1280px (xl:order-1) -->
        <div class="order-2 xl:order-1 xl:col-span-5 w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-y-7 md:gap-y-0 xl:gap-y-7">
          <div
            v-for="(pillar, index) in data.pillars"
            :key="pillar.title"
            v-motion-stagger-card
            :delay="index * 120"
            class="flex flex-col items-center text-center xl:items-start xl:text-left px-2 sm:px-4 md:px-5 lg:px-7 xl:px-0 will-change-transform"
            :class="[
              index < data.pillars.length - 1
                ? 'md:border-r md:border-dark-gold/35 xl:border-r-0'
                : ''
            ]"
          >
            <!-- Pillar Title -->
            <h3 class="text-journey-deep section-subtitle mb-1.5">
              {{ pillar.title }}
            </h3>

            <!-- Pillar Midsubtitle -->
            <span class="text-dark-gold section-midsubtitle">
              {{ pillar.subtitle }}
            </span>

            <!-- Pillar Subparagraph -->
            <p class="text-journey-deep/90 section-subparagraph max-w-md md:max-w-xs xl:max-w-md">
              {{ pillar.description }}
            </p>

            <!-- Horizontal Divider: Centered on <768px, Hidden on 768–1279px (uses vertical border), Left-aligned on >=1280px -->
            <div
              v-if="index < data.pillars.length - 1"
              class="w-16 xl:w-12 h-[1.5px] bg-dark-gold/55 mt-7 md:hidden xl:block"
              aria-hidden="true"
            />
          </div>
        </div>

      </div>

      <!-- 3. BOTTOM QUOTE -->
      <div
        v-motion-fade-up
        :delay="200"
        class="w-full flex justify-center text-center mt-10 md:mt-12 xl:mt-16 px-4 will-change-transform"
      >
        <p class="text-darker-gold max-w-2xl lg:max-w-3xl xl:max-w-4xl section-quote">
          {{ data.bottomQuote }}
        </p>
      </div>

    </div>
  </section>
</template>
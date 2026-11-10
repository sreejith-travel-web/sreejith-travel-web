<!-- ~/components/InnerPageHeader.vue -->
<script setup lang="ts">
export interface InnerPageHeaderConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
}

defineProps<{
  data: InnerPageHeaderConfig
}>()
</script>

<template>
  <section
    data-theme="light"
    class="section-wrapper pb-2 bg-bg-light text-primary-light"
  >
    <div class="relative w-full max-w-4xl flex flex-col items-center text-center px-4">
      <!-- 1. Eyebrow (Starts at 1050ms — right after PageHero's 950ms intro) -->
      <div
        v-motion
        :initial="{ opacity: 0, y: 18 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 600, ease: [0.22, 1, 0.36, 1], delay: 1050 }
        }"
        class="eyebrow-wrapper"
      >
        <div class="bg-dark-gold/70 eyebrow-border" />
        <h2 class="text-journey-deep/95 eyebrow-text">
          {{ data.eyebrow }}
        </h2>
        <div class="bg-dark-gold/70 eyebrow-border" />
      </div>

      <!-- 2 & 3. Title Hierarchy (Line 1 at 1150ms, Line 2 Cursive at 1250ms) -->
      <h2 class="section-title-wrapper">
        <span
          v-motion
          :initial="{ opacity: 0, y: 22, filter: 'blur(4px)' }"
          :enter="{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 650, ease: [0.22, 1, 0.36, 1], delay: 1150 }
          }"
          class="text-journey-deep section-title-sans block"
        >
          {{ data.titleLine1 }}
        </span>

        <span
          v-motion
          :initial="{ opacity: 0, y: 22, filter: 'blur(4px)' }"
          :enter="{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 700, ease: [0.22, 1, 0.36, 1], delay: 1250 }
          }"
          class="text-dark-gold section-title-cursive"
        >
          {{ data.titleLine2Cursive }}
        </span>
      </h2>

      <!-- 4. Description (Starts at 1350ms) -->
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: { duration: 750, ease: [0.22, 1, 0.36, 1], delay: 1350 }
        }"
        class="text-journey-deep/90 max-w-3xl hero-paragraph"
      >
        {{ data.description }}
      </p>
    </div>
  </section>
</template>
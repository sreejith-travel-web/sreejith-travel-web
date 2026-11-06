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
        class="section-title-wrapper"
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
        class="text-journey-deep/90 max-w-3xl hero-paragraph"
      >
        {{ data.description }}
      </p>
    </div>
  </section>
</template>
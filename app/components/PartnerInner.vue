<!-- ~/app/components/PartnerInner.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import CtaButton from '~/components/CtaButton.vue'

export interface NetworkPhotoItem {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface NetworkSectionConfig {
  eyebrow: string
  title: string
  description?: string
  paragraphs?: string[]
  images?: [NetworkPhotoItem, NetworkPhotoItem] | NetworkPhotoItem[]
  image?: string
  imageAlt?: string
  secondaryImage?: string
  secondaryImageAlt?: string
  cta?: {
    label: string
    to: string
  }
}

export interface PartnerInnerConfig {
  network: NetworkSectionConfig
  partnerships?: unknown
}

// Centralized choreography tempo (ms)
const NETWORK_MOTION = {
  eyebrowDelayMs: 0,
  titleDelayMs: 90,
  copyDelayMs: 170,
  ctaDelayMs: 240,
  leftPhotoDelayMs: 150,
  rightPhotoDelayMs: 220
} as const

const props = defineProps<{
  data: PartnerInnerConfig | NetworkSectionConfig
}>()

const networkData = computed<NetworkSectionConfig>(() =>
  'network' in props.data ? props.data.network : props.data
)

const resolvedParagraphs = computed<string[]>(() => {
  if (networkData.value.paragraphs?.length) {
    return networkData.value.paragraphs.filter(Boolean)
  }
  if (networkData.value.description?.trim()) {
    return [networkData.value.description.trim()]
  }
  return []
})

const leftPhoto = computed<NetworkPhotoItem>(() => {
  const fromTuple = networkData.value.images?.[0]
  if (fromTuple?.src) return fromTuple
  return {
    src: networkData.value.image || '/images/impact/impact6.webp',
    alt:
      networkData.value.imageAlt ||
      'Grassroots artisans and local hosts across South India',
    width: 750,
    height: 500
  }
})

const rightPhoto = computed<NetworkPhotoItem>(() => {
  const fromTuple = networkData.value.images?.[1]
  if (fromTuple?.src) return fromTuple
  return {
    src:
      networkData.value.secondaryImage ||
      '/images/home/forest-portrait.webp',
    alt:
      networkData.value.secondaryImageAlt ||
      'Mindful collaborative journeys crafted across Kerala and beyond',
    width: 750,
    height: 500
  }
})
</script>

<template>
  <section
    data-theme="light"
    class="network-triptych-section"
  >
    <!-- Symmetrical Centered Meridian Watermark -->
    <svg
      viewBox="0 0 720 260"
      fill="none"
      stroke="currentColor"
      stroke-width="0.9"
      aria-hidden="true"
      class="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-152 sm:w-208 lg:w-5xl h-auto text-intention-deep/7"
    >
      <circle cx="360" cy="130" r="108" stroke-dasharray="4 6" />
      <circle cx="176" cy="130" r="68" />
      <circle cx="544" cy="130" r="68" />
      <path d="M108 130H612" stroke-dasharray="2 5" />
      <path d="M176 130Q360 56 544 130" />
      <path d="M176 130Q360 204 544 130" />
      <circle cx="176" cy="130" r="3.5" fill="currentColor" />
      <circle cx="360" cy="130" r="4" fill="currentColor" />
      <circle cx="544" cy="130" r="3.5" fill="currentColor" />
    </svg>

    <div class="network-triptych-grid">
      <!-- 1. CENTER EDITORIAL HEADER + PARAGRAPHS + CTA (Top on <1024px, Middle on lg+) -->
      <div class="network-triptych-copy">
        <div
          v-if="networkData.eyebrow"
          v-motion-fade-up
          :delay="NETWORK_MOTION.eyebrowDelayMs"
          class="eyebrow-wrapper"
        >
          <div class="bg-dark-gold/70 eyebrow-border" />
          <span class="text-intention-deep/95 eyebrow-text">
            {{ networkData.eyebrow }}
          </span>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-if="networkData.title"
          v-motion-fade-up
          :delay="NETWORK_MOTION.titleDelayMs"
          class="section-title-wrapper drop-shadow-none!"
        >
          <span class="text-intention-deep section-subtitle">
            {{ networkData.title }}
          </span>
        </h2>

        <div
          v-if="resolvedParagraphs.length"
          v-motion-fade-up
          :delay="NETWORK_MOTION.copyDelayMs"
          class="flex flex-col items-center gap-4 md:gap-5 max-w-2xl"
        >
          <p
            v-for="(paragraph, pIndex) in resolvedParagraphs"
            :key="pIndex"
            class="section-paragraph text-intention-deep/85 text-pretty"
          >
            {{ paragraph }}
          </p>
        </div>

        <div
          v-if="networkData.cta"
          v-motion-fade-up
          :delay="NETWORK_MOTION.ctaDelayMs"
          class="mt-7 md:mt-8 flex justify-center"
        >
          <CtaButton
            :to="networkData.cta.to"
            :label="networkData.cta.label"
            variant="light"
          />
        </div>
      </div>

      <!-- 2. LEFT 1:1 PORTRAIT (Bottom-Left on <1024px, Left Flank on lg+) -->
      <div class="network-triptych-slot-left">
        <div
          v-motion-atelier-card
          :delay="NETWORK_MOTION.leftPhotoDelayMs"
          class="group network-photo-card"
        >
          <div class="relative w-full h-full rounded-xl overflow-hidden">
            <img
              :src="leftPhoto.src"
              :alt="leftPhoto.alt"
              :width="leftPhoto.width || 750"
              :height="leftPhoto.height || 500"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              draggable="false"
              class="pointer-events-none block w-full h-auto aspect-square object-cover transition-transform duration-700 ease-editorial group-hover:scale-105 group-active:scale-103"
            />
          </div>
        </div>
      </div>

      <!-- 3. RIGHT 1:1 PORTRAIT (Bottom-Right on <1024px, Right Flank on lg+) -->
      <div class="network-triptych-slot-right">
        <div
          v-motion-atelier-card
          :delay="NETWORK_MOTION.rightPhotoDelayMs"
          class="group network-photo-card"
        >
          <div class="relative w-full h-full rounded-xl overflow-hidden">
            <img
              :src="rightPhoto.src"
              :alt="rightPhoto.alt"
              :width="rightPhoto.width || 750"
              :height="rightPhoto.height || 500"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              draggable="false"
              class="pointer-events-none block w-full h-auto aspect-square object-cover transition-transform duration-700 ease-editorial group-hover:scale-105 group-active:scale-103"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.network-triptych-section {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-block: 2.5rem;
  padding-inline: 0.5rem;
  overflow-x: clip;
  overflow-y: hidden;
  background-color: color-mix(in srgb, var(--color-soft-blue) 40%, transparent);
  color: var(--color-primary-light);
  border-top: 1px solid color-mix(in srgb, var(--color-action-blue) 12%, transparent);
}

@media (min-width: 321px) {
  .network-triptych-section {
    padding-inline: 0.75rem;
  }
}

@media (min-width: 481px) {
  .network-triptych-section {
    padding-inline: 1.25rem;
  }
}

@media (min-width: 640px) {
  .network-triptych-section {
    padding-block: 3.5rem;
    padding-inline: 2.5rem;
  }
}

@media (min-width: 768px) {
  .network-triptych-section {
    padding-block: 4.5rem;
    padding-inline: 3rem;
  }
}

@media (min-width: 1024px) {
  .network-triptych-section {
    padding-inline: 4rem;
  }
}

@media (min-width: 1280px) {
  .network-triptych-section {
    padding-block: 5rem;
    padding-inline: 5rem;
  }
}

@media (min-width: 1536px) {
  .network-triptych-section {
    padding-inline: 6rem;
  }
}

.network-triptych-grid {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 80rem;
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;
  align-items: center;
}

@media (min-width: 640px) {
  .network-triptych-grid {
    gap: 1.25rem;
  }
}

@media (min-width: 1024px) {
  .network-triptych-grid {
    grid-template-columns: minmax(13rem, 16.5rem) minmax(0, 1fr) minmax(13rem, 16.5rem);
    gap: 2rem;
  }
}

@media (min-width: 1280px) {
  .network-triptych-grid {
    grid-template-columns: minmax(15.5rem, 19rem) minmax(0, 1fr) minmax(15.5rem, 19rem);
    gap: 3rem;
  }
}

.network-triptych-copy {
  grid-column: span 2 / span 2;
  width: 100%;
  max-width: 42rem;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 0.75rem;
}

@media (min-width: 640px) {
  .network-triptych-copy {
    margin-bottom: 1rem;
  }
}

@media (min-width: 1024px) {
  .network-triptych-copy {
    grid-column: 2 / span 1;
    grid-row-start: 1;
    margin-bottom: 0;
  }
}

.network-triptych-slot-left {
  grid-column-start: 1;
  grid-row-start: 2;
  width: 100%;
  max-width: 16rem;
  justify-self: end;
}

.network-triptych-slot-right {
  grid-column-start: 2;
  grid-row-start: 2;
  width: 100%;
  max-width: 16rem;
  justify-self: start;
}

@media (min-width: 640px) {
  .network-triptych-slot-left,
  .network-triptych-slot-right {
    max-width: 18rem;
  }
}

@media (min-width: 1024px) {
  .network-triptych-slot-left {
    grid-column-start: 1;
    grid-row-start: 1;
    max-width: none;
    justify-self: stretch;
  }

  .network-triptych-slot-right {
    grid-column-start: 3;
    grid-row-start: 1;
    max-width: none;
    justify-self: stretch;
  }
}

.network-photo-card {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 1rem;
  overflow: hidden;
  background-color: color-mix(in srgb, var(--color-surface-light) 90%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-intention-deep) 12%, transparent);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  padding: 0.375rem;
  transition:
    translate 500ms var(--ease-editorial),
    scale 500ms var(--ease-editorial),
    border-color 500ms var(--ease-editorial),
    box-shadow 500ms var(--ease-editorial);
}

@media (min-width: 640px) {
  .network-photo-card {
    padding: 0.5rem;
  }
}

.network-photo-card:hover {
  translate: 0 -0.125rem;
  border-color: color-mix(in srgb, var(--color-dark-gold) 40%, transparent);
  box-shadow:
    0 1px 3px 0 rgb(0 0 0 / 0.1),
    0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.network-photo-card:active {
  scale: 0.99;
}
</style>
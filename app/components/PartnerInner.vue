<!-- ~/app/components/PartnerInner.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import CtaButton from '~/components/CtaButton.vue'

export interface NetworkSectionConfig {
  eyebrow: string
  title: string
  paragraphs: string[]
  image: string
  imageAlt: string
  cta?: {
    label: string
    to: string
  }
}

export interface PartnerInnerConfig {
  network: NetworkSectionConfig
  partnerships?: unknown
}

const props = defineProps<{
  data: PartnerInnerConfig | NetworkSectionConfig
}>()

const networkData = computed<NetworkSectionConfig>(() =>
  'network' in props.data ? props.data.network : props.data
)
</script>

<template>
  <section
    data-theme="light"
    class="section-wrapper relative overflow-x-clip overflow-y-hidden bg-soft-blue/40 text-primary-light border-t border-action-blue/12"
  >
    <!-- Subtle Background Network Meridian Watermark -->
    <svg
      viewBox="0 0 400 220"
      fill="none"
      stroke="currentColor"
      stroke-width="0.9"
      aria-hidden="true"
      class="pointer-events-none select-none absolute -bottom-8 -left-10 w-88 sm:w-120 h-auto text-intention-deep/7"
    >
      <circle cx="70" cy="150" r="64" />
      <circle cx="190" cy="110" r="88" stroke-dasharray="4 6" />
      <circle cx="310" cy="160" r="52" />
      <path d="M70 150L190 110L310 160" />
      <circle cx="70" cy="150" r="3.5" fill="currentColor" />
      <circle cx="190" cy="110" r="3.5" fill="currentColor" />
      <circle cx="310" cy="160" r="3.5" fill="currentColor" />
    </svg>

    <div class="relative z-10 w-full max-w-7xl flex flex-col md:flex-row md:items-start xl:items-center justify-between gap-10 md:gap-12 lg:gap-16">
      <!-- Left Text + CTA Column -->
      <div
        v-motion-glide-left
        class="order-1 w-full md:flex-1 flex flex-col items-start text-left max-w-2xl"
      >
        <div class="flex items-center w-full mb-3 md:mb-4">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <span class="text-intention-deep/90 eyebrow-text">
            {{ networkData.eyebrow }}
          </span>
        </div>

        <h2 class="section-subtitle text-intention-deep mb-5 md:mb-6">
          {{ networkData.title }}
        </h2>

        <div class="flex flex-col gap-4 md:gap-5">
          <p
            v-for="(paragraph, pIndex) in networkData.paragraphs"
            :key="pIndex"
            class="section-paragraph text-intention-deep/85"
          >
            {{ paragraph }}
          </p>
        </div>

        <div v-if="networkData.cta" class="mt-7 md:mt-8">
          <CtaButton
            :to="networkData.cta.to"
            :label="networkData.cta.label"
            variant="light"
          />
        </div>
      </div>

      <!-- Right 1:1 Framed Image Column (DevTools-Clean 600x600 + aspect-square) -->
      <div class="order-2 w-full max-w-xs sm:max-w-sm md:max-w-none md:w-72 lg:w-80 xl:w-96 shrink-0 mx-auto md:mx-0 md:sticky md:top-28 xl:static">
        <div
          v-motion-glide-right
          :delay="140"
          class="group relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-light/85 border border-intention-deep/10 shadow-xs p-2"
        >
          <div class="relative w-full h-full rounded-xl overflow-hidden">
            <img
              :src="networkData.image"
              :alt="networkData.imageAlt"
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              draggable="false"
              class="pointer-events-none w-full h-full aspect-square object-cover transition-transform duration-700 ease-editorial group-hover:scale-105 group-active:scale-103"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
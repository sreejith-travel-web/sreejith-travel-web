<!-- ~/app/components/HomeSignatureItineraries.vue -->
<script setup lang="ts">
import ItinerarySlider from '~/components/ItinerarySlider.vue'
import type { ItineraryCardItem } from '~/components/ItineraryCard.vue'

export interface SignatureSliderConfig {
  initialIndex?: number
  autoplay?: boolean
  autoplayIntervalMs?: number
  infinite?: boolean
  slides: ItineraryCardItem[]
}

export interface SignatureItinerariesSectionData {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  subtitle: string
  description: string
  bottomQuote: string
  ctaLabel: string
  ctaTo: string
  slider: SignatureSliderConfig
}

const props = withDefaults(
  defineProps<{
    data: SignatureItinerariesSectionData
    autoplay?: boolean
  }>(),
  {
    autoplay: false
  }
)
</script>

<template>
  <ItinerarySlider
    :data="props.data"
    :autoplay="props.autoplay"
    :default-interval-ms="3000"
    aria-label="Signature Experiences"
  />
</template>

<style scoped>
/* Preserves Vite HMR style[0] virtual module slot */
</style>
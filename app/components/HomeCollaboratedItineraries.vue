<!-- ~/app/components/HomeCollaboratedItineraries.vue -->
<script setup lang="ts">
import ItinerarySlider from '~/components/ItinerarySlider.vue'
import type { ItineraryCardItem } from '~/components/ItineraryCard.vue'

export interface CollaboratedSliderConfig {
  initialIndex?: number
  autoplay?: boolean
  autoplayIntervalMs?: number
  infinite?: boolean
  slides: ItineraryCardItem[]
}

export interface CollaboratedItinerariesSectionData {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  subtitle: string
  description: string
  bottomQuote: string
  ctaLabel: string
  ctaTo: string
  slider: CollaboratedSliderConfig
}

const props = withDefaults(
  defineProps<{
    data: CollaboratedItinerariesSectionData
    autoplay?: boolean
  }>(),
  {
    autoplay: true
  }
)
</script>

<template>
  <ItinerarySlider
    :data="props.data"
    :autoplay="props.autoplay"
    :default-interval-ms="3000"
    aria-label="Collaborated Itineraries"
  />
</template>

<style scoped>
/* Preserves Vite HMR style[0] virtual module slot */
</style>
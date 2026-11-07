<!-- ~/app/components/itineraries/ItineraryLightbox.vue -->
<script setup lang="ts">
import Lightbox, { type LightboxMediaItem } from '~/components/Lightbox.vue'

defineProps<{
  isOpen: boolean
  items: LightboxMediaItem[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Lightbox
    :is-open="isOpen"
    :items="items"
    :initial-index="initialIndex"
    @close="emit('close')"
  />
</template>
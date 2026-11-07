<!-- ~/app/components/itineraries/blocks/BlockMasonry.vue -->
<script setup lang="ts">
import Masonry, { type MasonryImageEntry } from '~/components/Masonry.vue'
import type { LightboxOpenPayload } from '~/components/Lightbox.vue'

export interface ItineraryMasonryBlockData {
  sectionId?: string
  eyebrow?: string
  title?: string
  images: Array<string | MasonryImageEntry>
  caption?: string
  captions?: string[]
  captionMob?: boolean
  captionPc?: boolean
}

defineProps<{
  data: ItineraryMasonryBlockData
}>()

const emit = defineEmits<{
  (e: 'open-lightbox', payload: LightboxOpenPayload): void
}>()
</script>

<template>
  <section
    v-if="data.images?.length"
    :id="data.sectionId"
    :aria-label="data.title || data.eyebrow || 'Journey visual gallery'"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-surface-light border border-journey-deep/8 p-6 sm:p-8 md:p-10 shadow-2xs flex flex-col gap-6 sm:gap-7"
  >
    <!-- Optional Header (Eyebrow + Title) -->
    <div
      v-if="data.eyebrow || data.title"
      v-motion-fade-up
      class="flex flex-col items-start text-left"
    >
      <span
        v-if="data.eyebrow"
        class="section-midsubtitle text-dark-gold font-medium mb-1.5! pt-0.5"
      >
        {{ data.eyebrow }}
      </span>

      <h2
        v-if="data.title"
        class="section-smaller-subtitle font-medium text-journey-deep"
      >
        {{ data.title }}
      </h2>
    </div>

    <!-- Reusable Masonry Grid (Capped at 3 Columns on Desktop for Itineraries) -->
    <div v-motion-fade-up :delay="80" class="w-full">
      <Masonry
        :block="data"
        :max-cols="3"
        @open-lightbox="emit('open-lightbox', $event)"
      />
    </div>
  </section>
</template>
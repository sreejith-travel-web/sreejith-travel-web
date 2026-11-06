<!-- ~/app/components/itineraries/blocks/BlockQuote.vue -->
<script setup lang="ts">
export interface ItineraryQuoteBlockData {
  sectionId?: string
  quote: string
  author?: string
}

defineProps<{
  data: ItineraryQuoteBlockData
}>()
</script>

<template>
  <figure
    :id="data.sectionId"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-surface-light border border-journey-deep/8 px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14 shadow-2xs flex flex-col items-center text-center"
  >
    <!-- Top Decorative Double Quote Mark -->
    <svg
      v-motion-micro-up
      viewBox="0 0 32 24"
      fill="currentColor"
      class="w-8 h-6 sm:w-10 sm:h-7 text-intention-blue/25 mb-4 sm:mb-5 shrink-0 select-none"
      aria-hidden="true"
    >
      <path d="M9.5 0C5.36 0 2 3.36 2 7.5c0 3.58 2.51 6.57 5.88 7.32-.45 2.75-2.18 5.18-4.88 6.68L4.5 24c5.52-2.42 9-7.95 9-14.5C13.5 4.25 11.71 0 9.5 0zm16 0C21.36 0 18 3.36 18 7.5c0 3.58 2.51 6.57 5.88 7.32-.45 2.75-2.18 5.18-4.88 6.68L20.5 24c5.52-2.42 9-7.95 9-14.5C29.5 4.25 27.71 0 25.5 0z" />
    </svg>

    <!-- Quote Text (font-quote via signature-quote utility) -->
    <blockquote
      v-motion-fade-up
      :delay="60"
      class="signature-quote text-journey-deep max-w-3xl mb-6 sm:mb-7"
    >
      {{ data.quote }}
    </blockquote>

    <!-- Author / Source Attribution (font-uppercase via eyebrow-text utility) -->
    <figcaption
      v-if="data.author"
      v-motion-micro-up
      :delay="120"
      class="eyebrow-text mx-0! pt-0.5 text-intention-blue font-medium"
    >
      &mdash; {{ data.author }}
    </figcaption>
  </figure>
</template>
<!-- ~/app/components/itineraries/blocks/BlockTipNote.vue -->
<script setup lang="ts">
export interface ItineraryTipNoteBlockData {
  sectionId?: string
  title: string
  text: string
}

defineProps<{
  data: ItineraryTipNoteBlockData
}>()
</script>

<template>
  <aside
    :id="data.sectionId"
    :aria-label="data.title"
    v-motion-fade-up
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-bg-medium/70 border border-intention-blue/15 border-l-4 border-l-intention-blue p-6 sm:p-8 md:p-9 flex flex-col gap-3 sm:gap-3.5"
  >
    <!-- Header Row: Info Icon + Eyebrow Text (Intention Blue) -->
    <div class="flex items-center gap-2.5 text-intention-blue">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="w-4.5 h-4.5 shrink-0"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>

      <h3 class="eyebrow-text mx-0! pt-0.5 font-semibold text-intention-blue">
        {{ data.title }}
      </h3>
    </div>

    <!-- Body Copy (font-primary via section-paragraph) -->
    <p class="section-paragraph text-secondary-light/90">
      {{ data.text }}
    </p>
  </aside>
</template>
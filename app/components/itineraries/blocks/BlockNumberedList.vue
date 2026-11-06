<!-- ~/app/components/itineraries/blocks/BlockNumberedList.vue -->
<script setup lang="ts">
export interface ItineraryNumberedListBlockData {
  sectionId?: string
  title: string
  items: string[]
}

defineProps<{
  data: ItineraryNumberedListBlockData
}>()
</script>

<template>
  <section
    :id="data.sectionId"
    :aria-label="data.title"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-surface-light border border-journey-deep/10 p-6 sm:p-8 md:p-10 shadow-2xs flex flex-col gap-5 sm:gap-6"
  >
    <!-- Mandatory Title -->
    <h2
      v-motion-fade-up
      class="section-smaller-subtitle font-medium text-journey-deep"
    >
      {{ data.title }}
    </h2>

    <!-- Mandatory Ordered List -->
    <ol class="flex flex-col gap-3.5 sm:gap-4 w-full">
      <li
        v-for="(item, idx) in data.items"
        :key="`num-item-${idx}`"
        v-motion-stagger-card
        :delay="idx * 70"
        class="flex items-baseline gap-3.5 sm:gap-4"
      >
        <span
          class="section-paragraph font-semibold! text-intention-blue tabular-nums shrink-0 select-none"
          aria-hidden="true"
        >
          {{ idx + 1 }}.
        </span>
        <span class="section-paragraph text-secondary-light/90">
          {{ item }}
        </span>
      </li>
    </ol>
  </section>
</template>
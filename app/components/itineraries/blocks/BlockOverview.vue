<!-- ~/app/components/itineraries/blocks/BlockOverview.vue -->
<script setup lang="ts">
import { computed } from 'vue'

export interface ItineraryOverviewBlockData {
  sectionId?: string
  eyebrow?: string
  title: string
  paragraphs: string[]
  image: string
  imageAlt: string
  /**
   * Defaults to '1 / 1' (square).
   * Accepts CSS aspect-ratio strings ('1 / 1', '4 / 5', '3 / 4', '16 / 9')
   * or shorthand keywords ('square', 'portrait', 'landscape').
   */
  imageAspectRatio?: string
  routeStops: string[]
  highlightsTitle?: string
  highlights: string[]
}

const props = withDefaults(
  defineProps<{
    data: ItineraryOverviewBlockData
  }>(),
  {
    data: () => ({
      sectionId: 'overview',
      eyebrow: 'THE JOURNEY AT A GLANCE',
      title: 'Route Overview',
      paragraphs: [],
      image: '/images/itineraries/dummy2.webp',
      imageAlt: 'Misty tea estates along the Malabar and Nilgiri route',
      imageAspectRatio: '1 / 1',
      routeStops: [],
      highlightsTitle: 'Highlights of the Journey',
      highlights: []
    })
  }
)

const emit = defineEmits<{
  (
    e: 'open-lightbox',
    payload: { items: Array<{ src: string; alt: string; caption?: string }>; index: number }
  ): void
}>()

const resolvedAspectRatio = computed(() => {
  const raw = props.data.imageAspectRatio?.trim().toLowerCase()
  if (!raw || raw === 'square') return '1 / 1'
  if (raw === 'portrait') return '4 / 5'
  if (raw === 'landscape') return '16 / 9'
  return props.data.imageAspectRatio
})

const handleImageClick = () => {
  emit('open-lightbox', {
    items: [
      {
        src: props.data.image,
        alt: props.data.imageAlt,
        caption: props.data.routeStops?.join(' → ')
      }
    ],
    index: 0
  })
}
</script>

<template>
  <section
    :id="data.sectionId || 'overview'"
    aria-label="Journey overview and highlights"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-surface-light border border-journey-deep/8 p-6 sm:p-8 md:p-10 shadow-2xs flex flex-col gap-8 sm:gap-10 md:gap-12"
  >
    <!-- =========================================================
         PART 1: ROUTE OVERVIEW (Text Left + Sticky Configurable-Ratio Image & Route Flow Right)
         ========================================================= -->
    <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-8 lg:gap-10 items-start">
      
      <!-- Left Column: Eyebrow + Heading + Narrative Paragraphs -->
      <div class="md:col-span-7 flex flex-col items-start text-left">
        <span
          v-if="data.eyebrow"
          v-motion-fade-up
          class="section-midsubtitle text-dark-gold font-medium mb-2! pt-0.5"
        >
          {{ data.eyebrow }}
        </span>

        <h2
          v-motion-fade-up
          :delay="60"
          class="section-subtitle font-medium text-journey-deep mb-4 sm:mb-5"
        >
          {{ data.title }}
        </h2>

        <div
          v-motion-fade-up
          :delay="120"
          class="flex flex-col gap-4 w-full"
        >
          <p
            v-for="(paragraph, pIdx) in data.paragraphs"
            :key="`overview-p-${pIdx}`"
            class="section-paragraph text-secondary-light/90"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <!-- Right Column: Sticky Image Container (Default 1:1, JSON Configurable) + Route Stops -->
      <div class="md:col-span-5 flex flex-col items-center w-full md:sticky md:top-36 self-start">
        <button
          id="overview-route-image-trigger"
          name="overview-route-image"
          type="button"
          aria-label="View route overview image in full screen"
          v-motion-fade-up
          :delay="150"
          @click="handleImageClick"
          :style="{ aspectRatio: resolvedAspectRatio }"
          class="group relative w-full rounded-2xl overflow-hidden bg-bg-light border border-journey-deep/8 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
        >
          <img
            :src="data.image"
            :alt="data.imageAlt"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 select-none"
          />
        </button>

        <!-- Route Progression Line -->
        <p
          v-if="data.routeStops?.length"
          v-motion-micro-up
          :delay="200"
          class="w-full text-center mt-3.5 sm:mt-4 section-subparagraph font-medium text-journey-deep/90 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1"
        >
          <template v-for="(stop, sIdx) in data.routeStops" :key="`stop-${sIdx}`">
            <span>{{ stop }}</span>
            <span
              v-if="sIdx < data.routeStops.length - 1"
              class="text-journey-deep/55 select-none"
              aria-hidden="true"
            >
              &rarr;
            </span>
          </template>
        </p>
      </div>

    </div>

    <!-- =========================================================
         PART 2: HIGHLIGHTS OF THE JOURNEY (Tinted Callout Card + Staggered List)
         ========================================================= -->
    <div
      v-if="data.highlights?.length"
      v-motion-fade-up
      :delay="180"
      class="w-full rounded-r-2xl rounded-l-xs bg-soft-cream/20 border-l-4 border-action-blue p-6 sm:p-8 md:p-9"
    >
      <h3 class="section-smaller-subtitle font-medium text-journey-deep mb-5 sm:mb-6">
        {{ data.highlightsTitle || 'Highlights of the Journey' }}
      </h3>

      <ul class="flex flex-col gap-4 sm:gap-5">
        <li
          v-for="(item, hIdx) in data.highlights"
          :key="`highlight-${hIdx}`"
          v-motion-stagger-card
          :delay="hIdx * 80"
          class="flex items-start gap-3.5 sm:gap-4"
        >
          <!-- Circular Checkmark Icon -->
          <svg
            viewBox="0 0 24 24"
            fill="none"
            class="w-5.5 h-5.5 sm:w-6 sm:h-6 text-action-blue shrink-0 mt-0.5"
            aria-hidden="true"
          >
            <circle
              cx="10"
              cy="12"
              r="8"
              stroke="currentColor"
              stroke-width="1.5"
              class="opacity-35"
            />
            <path
              d="M6.5 12l3 3 8.5-9"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <!-- Highlight Text -->
          <span class="section-paragraph text-journey-deep/90">
            {{ item }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>
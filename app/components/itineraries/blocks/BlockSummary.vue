<!-- ~/app/components/itineraries/blocks/BlockSummary.vue -->
<script setup lang="ts">
import { computed } from 'vue'

export interface ItinerarySummaryBlockData {
  sectionId?: string
  eyebrow?: string
  title?: string
  paragraphs?: string[]
  image?: string
  imageAlt?: string
  /**
   * Defaults to '1 / 1' (square).
   * Accepts CSS aspect-ratio strings ('1 / 1', '4 / 5', '3 / 4', '16 / 9')
   * or shorthand keywords ('square', 'portrait', 'landscape').
   */
  imageAspectRatio?: string
  /** Optional natural caption below the image (can be route flow or photo note) */
  caption?: string
  /** Optional title inside the bottom highlights/checklist box */
  highlightsTitle?: string
  /** Optional checklist/highlights array at the bottom */
  highlights?: string[]
}

const props = withDefaults(
  defineProps<{
    data: ItinerarySummaryBlockData
  }>(),
  {
    data: () => ({
      imageAspectRatio: '1 / 1'
    })
  }
)

const emit = defineEmits<{
  (
    e: 'open-lightbox',
    payload: { items: Array<{ src: string; alt: string; caption?: string }>; index: number }
  ): void
}>()

const hasText = computed(() =>
  Boolean(
    props.data.eyebrow?.trim() ||
      props.data.title?.trim() ||
      props.data.paragraphs?.length
  )
)

const hasImage = computed(() => Boolean(props.data.image?.trim()))

const hasTopContent = computed(() => hasText.value || hasImage.value)

const hasHighlights = computed(() => Boolean(props.data.highlights?.length))

const resolvedAspectRatio = computed(() => {
  const raw = props.data.imageAspectRatio?.trim().toLowerCase()
  if (!raw || raw === 'square') return '1 / 1'
  if (raw === 'portrait') return '4 / 5'
  if (raw === 'landscape') return '16 / 9'
  return props.data.imageAspectRatio || '1 / 1'
})

const handleImageClick = () => {
  if (!props.data.image) return
  emit('open-lightbox', {
    items: [
      {
        src: props.data.image,
        alt: props.data.imageAlt || props.data.title || 'Journey summary image',
        caption: props.data.caption || props.data.title
      }
    ],
    index: 0
  })
}
</script>

<template>
  <section
    v-if="hasTopContent || hasHighlights"
    :id="data.sectionId"
    :aria-label="data.title || data.highlightsTitle || 'Journey summary'"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-surface-light border border-journey-deep/8 p-6 sm:p-8 md:p-10 shadow-2xs flex flex-col gap-8 sm:gap-10 md:gap-12"
  >
    <!-- =========================================================
         PART 1: NARRATIVE + OPTIONAL STICKY IMAGE & CAPTION
         (Expands text to col-span-12 when no image is provided)
         ========================================================= -->
    <div
      v-if="hasTopContent"
      class="w-full grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-8 lg:gap-10 items-start"
    >
      <!-- Left Column: Optional Eyebrow + Optional Title + Optional Paragraphs -->
      <div
        v-if="hasText"
        class="flex flex-col items-start text-left"
        :class="hasImage ? 'md:col-span-7' : 'md:col-span-12'"
      >
        <span
          v-if="data.eyebrow"
          v-motion-fade-up
          class="section-midsubtitle text-dark-gold font-medium mb-2! pt-0.5"
        >
          {{ data.eyebrow }}
        </span>

        <h2
          v-if="data.title"
          v-motion-fade-up
          :delay="60"
          class="section-subtitle font-medium text-journey-deep"
          :class="data.paragraphs?.length ? 'mb-4 sm:mb-5' : ''"
        >
          {{ data.title }}
        </h2>

        <div
          v-if="data.paragraphs?.length"
          v-motion-fade-up
          :delay="120"
          class="flex flex-col gap-4 w-full"
        >
          <p
            v-for="(paragraph, pIdx) in data.paragraphs"
            :key="`summary-p-${pIdx}`"
            class="section-paragraph text-secondary-light/90"
          >
            {{ paragraph }}
          </p>
        </div>
      </div>

      <!-- Right Column: Optional Sticky Image + Optional Natural Caption -->
      <div
        v-if="hasImage"
        class="flex flex-col items-center w-full md:sticky md:top-36 self-start"
        :class="hasText ? 'md:col-span-5' : 'md:col-span-12 max-w-md mx-auto'"
      >
        <button
          :id="`summary-image-trigger-${data.sectionId || 'block'}`"
          :name="`summary-image-${data.sectionId || 'block'}`"
          type="button"
          :aria-label="`View ${data.imageAlt || data.title || 'summary image'} in full screen`"
          v-motion-fade-up
          :delay="150"
          @click="handleImageClick"
          :style="{ aspectRatio: resolvedAspectRatio }"
          class="group relative w-full rounded-2xl overflow-hidden bg-bg-light border border-journey-deep/8 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
        >
          <img
            :src="data.image"
            :alt="data.imageAlt || data.title || 'Journey image'"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-editorial group-hover:scale-105 select-none"
          />
        </button>

        <!-- Natural Client-Editable Caption (Routes, Location Note, or Credit — No Line Clamp) -->
        <p
          v-if="data.caption"
          v-motion-micro-up
          :delay="200"
          class="w-full text-left md:text-center mt-3.5 sm:mt-4 section-subparagraph font-medium text-journey-deep/90"
        >
          {{ data.caption }}
        </p>
      </div>
    </div>

    <!-- =========================================================
         PART 2: OPTIONAL HIGHLIGHTS / TAKEAWAYS CHECKLIST CARD
         ========================================================= -->
    <div
      v-if="hasHighlights"
      v-motion-fade-up
      :delay="180"
      class="w-full rounded-r-2xl rounded-l-xs bg-soft-cream/20 border-l-4 border-action-blue p-6 sm:p-8 md:p-9"
    >
      <h3
        v-if="data.highlightsTitle"
        class="section-smaller-subtitle font-medium text-journey-deep mb-5 sm:mb-6"
      >
        {{ data.highlightsTitle }}
      </h3>

      <ul class="flex flex-col gap-4 sm:gap-5">
        <li
          v-for="(item, hIdx) in data.highlights"
          :key="`summary-highlight-${hIdx}`"
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
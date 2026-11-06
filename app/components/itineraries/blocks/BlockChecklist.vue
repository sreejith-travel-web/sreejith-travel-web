<!-- ~/app/components/itineraries/blocks/BlockChecklist.vue -->
<script setup lang="ts">
import { computed } from 'vue'

export interface ItineraryChecklistBlockData {
  sectionId?: string
  title: string
  items: string[]
  image?: string
  imageAlt?: string
  /**
   * Defaults to '1 / 1' (square).
   * Can be '4 / 5', '3 / 4', '16 / 9', or 'portrait' / 'square'.
   */
  imageAspectRatio?: string
}

const props = withDefaults(
  defineProps<{
    data: ItineraryChecklistBlockData
  }>(),
  {
    data: () => ({
      title: 'Our Lodging Standards',
      items: [],
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

const hasImage = computed(() => Boolean(props.data.image?.trim()))

const resolvedAspectRatio = computed(() => {
  const raw = props.data.imageAspectRatio?.trim().toLowerCase()
  if (!raw || raw === 'square') return '1 / 1'
  if (raw === 'portrait') return '4 / 5'
  if (raw === 'landscape') return '16 / 9'
  return props.data.imageAspectRatio
})

const handleImageClick = () => {
  if (!props.data.image) return
  emit('open-lightbox', {
    items: [
      {
        src: props.data.image,
        alt: props.data.imageAlt || props.data.title,
        caption: props.data.title
      }
    ],
    index: 0
  })
}
</script>

<template>
  <section
    :id="data.sectionId"
    :aria-label="data.title"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-bg-light border border-journey-deep/10 p-6 sm:p-8 md:p-10 shadow-2xs flex flex-col gap-6 sm:gap-7"
  >
    <!-- 1. MANDATORY FULL-WIDTH TITLE (Never Sticky) -->
    <h2
      v-motion-fade-up
      class="section-smaller-subtitle font-medium text-journey-deep"
    >
      {{ data.title }}
    </h2>

    <!-- 2. STICKY CONTENT GRID (Splits 7/5 when image exists; Full-Width when no image) -->
    <div
      class="w-full grid grid-cols-1 gap-6 lg:gap-8 items-start"
      :class="hasImage ? 'md:grid-cols-12' : 'md:grid-cols-1'"
    >
      <!-- Mandatory Checklist Column (Sticky when paired with a taller image) -->
      <ul
        class="flex flex-col gap-3.5 sm:gap-4 w-full"
        :class="hasImage ? 'md:col-span-7 md:sticky md:top-36 self-start' : ''"
      >
        <li
          v-for="(item, idx) in data.items"
          :key="`checklist-item-${idx}`"
          v-motion-stagger-card
          :delay="idx * 70"
          class="w-full rounded-2xl bg-surface-light border border-journey-deep/8 px-4 py-4 sm:px-6 sm:py-4.5 shadow-2xs flex items-start gap-3.5 sm:gap-4"
        >
          <!-- Circular Checkmark Icon -->
          <svg
            viewBox="0 0 24 24"
            fill="none"
            class="w-5.5 h-5.5 sm:w-6 sm:h-6 text-intention-blue shrink-0 mt-0.5"
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

          <span class="section-paragraph text-secondary-light/90">
            {{ item }}
          </span>
        </li>
      </ul>

      <!-- Optional Sticky Right Image (Default 1:1 Square or Custom JSON Aspect Ratio) -->
      <div
        v-if="hasImage"
        class="md:col-span-5 w-full md:sticky md:top-36 self-start"
      >
        <button
          :id="`checklist-img-${data.sectionId || 'default'}`"
          :name="`checklist-img-${data.sectionId || 'default'}`"
          type="button"
          :aria-label="`View ${data.imageAlt || data.title} in full screen`"
          v-motion-fade-up
          :delay="120"
          @click="handleImageClick"
          :style="{ aspectRatio: resolvedAspectRatio }"
          class="group relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-light border border-journey-deep/8 shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
        >
          <img
            :src="data.image"
            :alt="data.imageAlt || data.title"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 select-none"
          />
        </button>
      </div>
    </div>
  </section>
</template>
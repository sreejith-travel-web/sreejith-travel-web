<!-- ~/app/components/journal/JournalAuthorProfile.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { JournalContentBlock } from '~~/server/utils/journalData'

const props = defineProps<{
  block: JournalContentBlock
}>()

const EDITORIAL_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

const DEFAULT_AUTHOR = {
  eyebrow: 'ABOUT THE AUTHOR',
  title: 'Sree Jith',
  text: 'Travel Experience Designer and field researcher crafting unhurried cultural journeys across South India in close partnership with regional historians, naturalists, and artisan communities.',
  image: '/images/home/solo-landscape.webp'
} as const

const resolvedEyebrow = computed(() => props.block.eyebrow?.trim() || DEFAULT_AUTHOR.eyebrow)
const resolvedTitle = computed(() => props.block.title?.trim() || DEFAULT_AUTHOR.title)
const resolvedBio = computed(() => props.block.text?.trim() || DEFAULT_AUTHOR.text)
const resolvedImage = computed(() => props.block.image?.trim() || DEFAULT_AUTHOR.image)
const resolvedAlt = computed(
  () => props.block.imageAlt?.trim() || `${resolvedTitle.value} portrait`
)

const cardSurfaceClass = computed(() => {
  if (props.block.theme === 'blue') {
    return 'bg-linear-to-br from-soft-blue/45 via-surface-light/15 to-surface-light border border-journey-deep/25 hover:border-action-blue/40'
  }
  return 'bg-linear-to-br from-soft-cream/45 via-soft-cream/20 to-surface-light border border-dark-gold/35 hover:border-dark-gold/50'
})

const avatarBorderClass = computed(() =>
  props.block.theme === 'blue' ? 'border-action-blue/35' : 'border-dark-gold/40'
)

const eyebrowColorClass = computed(() =>
  props.block.theme === 'blue' ? 'text-action-blue' : 'text-dark-gold'
)

const watermarkColorClass = computed(() =>
  props.block.theme === 'blue' ? 'text-intention-blue/15' : 'text-dark-gold/18'
)
</script>

<template>
  <aside
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible-once="{
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 560,
        ease: EDITORIAL_EASE
      }
    }"
    :aria-label="resolvedEyebrow"
    :class="[
      'group relative w-full my-3 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xs hover:shadow-sm transition-all duration-500 overflow-hidden flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 md:gap-10',
      cardSurfaceClass
    ]"
  >
    <!-- Circular Avatar (Exact Designer Profile Scale: w-28 -> sm:w-32 -> md:w-36) -->
    <div
      :class="[
        'relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 aspect-square rounded-full overflow-hidden border-2 bg-surface-light shadow-xs shrink-0 z-10',
        avatarBorderClass
      ]"
    >
      <img
        :src="resolvedImage"
        :alt="resolvedAlt"
        width="288"
        height="288"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        class="absolute inset-0 w-full h-full object-cover object-center select-none transition-transform duration-700 ease-editorial group-hover:scale-105"
      />
    </div>

    <!-- Author Details (Exact Designer Profile Scale & Alignment) -->
    <div class="flex flex-col items-center sm:items-start text-center sm:text-left relative z-10 flex-1 min-w-0">
      <span :class="['eyebrow-text mx-0! pt-0.5 font-medium mb-2', eyebrowColorClass]">
        {{ resolvedEyebrow }}
      </span>

      <h3 class="section-smaller-subtitle font-medium text-journey-deep mb-3 sm:mb-3.5">
        {{ resolvedTitle }}
      </h3>

      <p class="section-paragraph text-secondary-light/90 max-w-2xl">
        {{ resolvedBio }}
      </p>
    </div>

    <!-- Bottom-Right Architectural Watermark: Fountain Nib & Compass Arc (Exact w-48 sm:w-56 Scale) -->
    <svg
      viewBox="0 0 160 160"
      fill="none"
      stroke="currentColor"
      aria-hidden="true"
      :class="[
        'pointer-events-none select-none absolute -bottom-4 -right-4 w-48 h-48 sm:w-56 sm:h-56 transition-transform duration-700 ease-editorial group-hover:scale-105 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5',
        watermarkColorClass
      ]"
    >
      <!-- Outer Compass Degree Arc -->
      <path
        d="M 32 160 A 128 128 0 0 1 160 32"
        stroke-width="1.15"
        stroke-linecap="round"
      />
      <!-- Inner Concentric Meridian Arc -->
      <path
        d="M 56 160 A 104 104 0 0 1 160 56"
        stroke-width="0.9"
        stroke-dasharray="3 4"
        stroke-linecap="round"
      />
      <!-- Radial Compass Degree Ticks (15°, 30°, 60°, 75°) -->
      <line x1="40.2" y1="127.9" x2="32.5" y2="125.8" stroke-width="1.1" stroke-linecap="round" />
      <line x1="54.3" y1="99" x2="44" y2="93" stroke-width="1.2" stroke-linecap="round" />
      <line x1="99" y1="54.3" x2="93" y2="44" stroke-width="1.2" stroke-linecap="round" />
      <line x1="127.9" y1="40.2" x2="125.8" y2="32.5" stroke-width="1.1" stroke-linecap="round" />

      <!-- 45° Fountain Pen Nib Body -->
      <path
        d="M 58 58 Q 74 88 82.4 113.6 L 114.8 133.2 L 133.2 114.8 L 113.6 82.4 Q 88 74 58 58 Z"
        stroke-width="1.35"
        stroke-linejoin="round"
      />
      <!-- Central Nib Slit & Breather Hole -->
      <line x1="58" y1="58" x2="90.1" y2="90.1" stroke-width="1.2" stroke-linecap="round" />
      <circle cx="94" cy="94" r="5.5" stroke-width="1.25" />

      <!-- Architectural Collar Rings & Barrel Base -->
      <line x1="113.4" y1="134.6" x2="134.6" y2="113.4" stroke-width="1.25" stroke-linecap="round" />
      <line x1="120.4" y1="141.6" x2="141.6" y2="120.4" stroke-width="1.25" stroke-linecap="round" />
      <line x1="121.8" y1="140.2" x2="146" y2="164" stroke-width="1.15" />
      <line x1="140.2" y1="121.8" x2="164" y2="146" stroke-width="1.15" />
    </svg>
  </aside>
</template>
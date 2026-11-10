<!-- ~/app/components/journal/JournalQuoteBlock.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import JournalRichText from '~/components/journal/JournalRichText.vue'
import type { JournalContentBlock } from '~~/server/utils/journalData'

const props = defineProps<{
  block: JournalContentBlock
}>()

const EDITORIAL_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

const isBorderVariant = computed(() => props.block.variant === 'border')

// Strip accidental outer quote marks from JSON so we never double-wrap ““...””
const cleanedQuoteText = computed(() =>
  (props.block.text || '').trim().replace(/^[\s"“”]+|[\s"“”]+$/g, '')
)

const hasAttribution = computed(() =>
  Boolean(props.block.quoteAuthor?.trim() || props.block.quoteRole?.trim())
)

const resolvedTheme = computed<'cream' | 'blue' | 'mixed'>(() => {
  if (props.block.theme === 'blue') return 'blue'
  if (props.block.theme === 'mixed') return 'mixed'
  return 'cream'
})

const isBlueTheme = computed(() => resolvedTheme.value === 'blue')

const boxedSurfaceClass = computed(() => {
  if (resolvedTheme.value === 'blue') {
    return 'quote-surface-blue border border-action-blue/18 shadow-2xs'
  }
  if (resolvedTheme.value === 'mixed') {
    return 'quote-surface-mixed border border-journey-deep/12 shadow-2xs'
  }
  return 'quote-surface-gold border border-dark-gold/22 shadow-2xs'
})

const borderAccentClass = computed(() =>
  isBlueTheme.value ? 'border-action-blue' : 'border-dark-gold'
)

const authorAccentClass = computed(() =>
  isBorderVariant.value && isBlueTheme.value ? 'text-action-blue' : 'text-dark-gold'
)

const compassIllustrationClass = computed(() => {
  if (resolvedTheme.value === 'blue') return 'text-action-blue/44'
  if (resolvedTheme.value === 'mixed') return 'text-dark-gold/52'
  return 'text-dark-gold/46'
})

const trailIllustrationClass = computed(() => {
  if (resolvedTheme.value === 'blue') return 'text-action-blue/48'
  if (resolvedTheme.value === 'mixed') return 'text-dark-gold/54'
  return 'text-dark-gold/48'
})

const duneWaveClass = computed(() => {
  if (resolvedTheme.value === 'blue') return 'text-action-blue/8'
  if (resolvedTheme.value === 'mixed') return 'text-dark-peach/14'
  return 'text-dark-gold/9'
})

const bottomLeftWaveClass = computed(() => {
  if (resolvedTheme.value === 'cream') return 'text-dark-gold/7'
  return 'text-action-blue/9'
})
</script>

<template>
  <figure
    v-if="cleanedQuoteText"
    v-motion
    :initial="{ opacity: 0, y: 18 }"
    :visible-once="{
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 540,
        ease: EDITORIAL_EASE
      }
    }"
    :class="[
      isBorderVariant
        ? ['quote-left-border flex flex-col items-start', borderAccentClass]
        : ['my-3 p-7 sm:p-10 rounded-2xl flex flex-col items-center transition-colors duration-300', boxedSurfaceClass]
    ]"
  >
    <div v-if="!isBorderVariant">

      <!-- Top-Left Faceted 8-Point Compass Rose (Zero White Mask) -->
      <svg
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
        :class="[
          'pointer-events-none select-none absolute top-0 left-0 w-26 h-26 sm:w-36 sm:h-36 md:w-42 md:h-42 opacity-75 sm:opacity-100',
          compassIllustrationClass
        ]"
      >
        <!-- Outer Dashed Trajectory Arcs -->
        <path d="M -6 155 A 118 118 0 0 0 161.8 -6" stroke-width="0.85" stroke-dasharray="3 4" opacity="0.42" />
        <path d="M 0 176 Q 34 154 48 120" stroke-width="0.85" stroke-dasharray="2.5 4" opacity="0.42" />

        <!-- Concentric Compass Rings -->
        <circle cx="64" cy="60" r="62" stroke-width="0.9" opacity="0.5" />
        <circle cx="64" cy="60" r="56" stroke-width="0.6" opacity="0.26" />

        <!-- Extended Axis Scale Ticks -->
        <line x1="126" y1="60" x2="152" y2="60" stroke-width="0.85" opacity="0.45" />
        <line x1="136" y1="57" x2="136" y2="63" stroke-width="0.8" opacity="0.4" />
        <line x1="145" y1="58" x2="145" y2="62" stroke-width="0.8" opacity="0.4" />
        <line x1="64" y1="122" x2="64" y2="148" stroke-width="0.85" opacity="0.45" />
        <line x1="61" y1="132" x2="67" y2="132" stroke-width="0.8" opacity="0.4" />

        <!-- 4 Non-Overlapping Intercardinal Spikes (Clipped to Cardinal Star Waist) -->
        <polygon points="69.5,41.4 88,36 82.6,54.5 71.1,52.9" fill="currentColor" fill-opacity="0.09" stroke-width="0.9" stroke-linejoin="round" />
        <line x1="71.1" y1="52.9" x2="88" y2="36" stroke-width="0.7" opacity="0.5" />

        <polygon points="82.6,65.5 88,84 69.5,78.6 71.1,67.1" fill="currentColor" fill-opacity="0.09" stroke-width="0.9" stroke-linejoin="round" />
        <line x1="71.1" y1="67.1" x2="88" y2="84" stroke-width="0.7" opacity="0.5" />

        <polygon points="58.5,78.6 40,84 45.4,65.5 56.9,67.1" fill="currentColor" fill-opacity="0.09" stroke-width="0.9" stroke-linejoin="round" />
        <line x1="56.9" y1="67.1" x2="40" y2="84" stroke-width="0.7" opacity="0.5" />

        <polygon points="45.4,54.5 40,36 58.5,41.4 56.9,52.9" fill="currentColor" fill-opacity="0.09" stroke-width="0.9" stroke-linejoin="round" />
        <line x1="56.9" y1="52.9" x2="40" y2="36" stroke-width="0.7" opacity="0.5" />

        <!-- 4 Cardinal Star Sheer Light Facets (Replaces Solid White Cutout) -->
        <polygon points="64,60 56.9,52.9 64,2" fill="currentColor" fill-opacity="0.05" stroke="none" />
        <polygon points="64,60 71.1,52.9 122,60" fill="currentColor" fill-opacity="0.05" stroke="none" />
        <polygon points="64,60 71.1,67.1 64,118" fill="currentColor" fill-opacity="0.05" stroke="none" />
        <polygon points="64,60 56.9,67.1 6,60" fill="currentColor" fill-opacity="0.05" stroke="none" />

        <!-- 4 Cardinal Star Shaded Bevel Facets -->
        <polygon points="64,60 64,2 71.1,52.9" fill="currentColor" fill-opacity="0.22" stroke="none" />
        <polygon points="64,60 122,60 71.1,67.1" fill="currentColor" fill-opacity="0.22" stroke="none" />
        <polygon points="64,60 64,118 56.9,67.1" fill="currentColor" fill-opacity="0.22" stroke="none" />
        <polygon points="64,60 6,60 56.9,52.9" fill="currentColor" fill-opacity="0.22" stroke="none" />

        <!-- Crisp Cardinal Outline & Inner Bevel Ridges -->
        <polygon
          points="64,2 71.1,52.9 122,60 71.1,67.1 64,118 56.9,67.1 6,60 56.9,52.9"
          stroke-width="1.05"
          stroke-linejoin="round"
        />
        <line x1="64" y1="2" x2="64" y2="118" stroke-width="0.8" opacity="0.8" />
        <line x1="6" y1="60" x2="122" y2="60" stroke-width="0.8" opacity="0.8" />
        <line x1="56.9" y1="52.9" x2="71.1" y2="67.1" stroke-width="0.7" opacity="0.6" />
        <line x1="71.1" y1="52.9" x2="56.9" y2="67.1" stroke-width="0.7" opacity="0.6" />
      </svg>

      <!-- Subtle Bottom-Left Counter-Wave Wedge -->
      <svg
        viewBox="0 0 180 120"
        fill="none"
        aria-hidden="true"
        :class="[
          'pointer-events-none select-none absolute bottom-0 left-0 w-32 sm:w-44 h-auto',
          bottomLeftWaveClass
        ]"
      >
        <path d="M 0 36 Q 76 84 164 120 L 0 120 Z" fill="currentColor" />
      </svg>

      <!-- Bottom-Right Soft Dune Wave + Dotted Trail & Two-Leaf Sprout -->
      <svg
        viewBox="0 0 280 160"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
        :class="[
          'pointer-events-none select-none absolute bottom-0 right-0 w-40 sm:w-58 md:w-68 h-auto opacity-85 sm:opacity-100',
          trailIllustrationClass
        ]"
      >
        <!-- Soft Organic Corner Dune Wash -->
        <path
          d="M 48 160 C 128 152, 192 108, 280 44 L 280 160 Z"
          :class="duneWaveClass"
          fill="currentColor"
          stroke="none"
        />

        <!-- Winding Dotted Footpath -->
        <path
          d="M 76 158 C 110 136, 156 144, 196 116 C 214 103, 226 88, 235 74"
          stroke-width="1.35"
          stroke-dasharray="2.5 5.2"
          stroke-linecap="round"
          opacity="0.85"
        />

        <!-- Botanical Two-Leaf Sprout -->
        <path d="M 235 74 Q 239 67 242 61" stroke-width="1.25" stroke-linecap="round" />
        <path
          d="M 241 63 C 239 47, 249 36, 263 35 C 262 49, 253 60, 241 63 Z"
          fill="currentColor"
          fill-opacity="0.22"
          stroke-width="1.25"
          stroke-linejoin="round"
        />
        <path d="M 241 63 Q 251 50 259 40" stroke-width="0.95" stroke-linecap="round" opacity="0.85" />
        <path
          d="M 238 68 C 227 65, 223 55, 226 46 C 235 50, 240 59, 238 68 Z"
          fill="currentColor"
          fill-opacity="0.18"
          stroke-width="1.2"
          stroke-linejoin="round"
        />
        <path d="M 238 68 Q 232 59 229 51" stroke-width="0.9" stroke-linecap="round" opacity="0.8" />
      </svg>
      
    </div>

    <!-- Quote Copy: signature-quote for Boxed | section-quote for Left-Border -->
    <blockquote
      :class="[
        isBorderVariant ? 'section-quote text-journey-deep' : 'signature-quote text-journey-deep text-center',
        hasAttribution ? (isBorderVariant ? 'mb-2.5' : 'mb-4') : 'mb-0'
      ]"
    >
      <span>“</span><JournalRichText :content="cleanedQuoteText" tag="span" /><span>”</span>
    </blockquote>

    <!-- Optional Author & Role Attribution -->
    <figcaption
      v-if="hasAttribution"
      :class="['section-midsubtitle mb-0! flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center', authorAccentClass]"
    >
      <cite v-if="block.quoteAuthor" class="not-italic font-semibold">
        <span class="" v-if="isBorderVariant">—</span>
        {{ block.quoteAuthor }}
      </cite>
      <span
        v-if="block.quoteAuthor && block.quoteRole"
        class="text-journey-deep/35 select-none"
        aria-hidden="true"
      >
        -
      </span>
      <span v-if="block.quoteRole" class="text-journey-deep/70 font-medium">
        {{ block.quoteRole }}
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.quote-surface-blue {
  background-color: var(--color-surface-light);
  background-image:
    radial-gradient(
      circle at 0% 0%,
      color-mix(in srgb, var(--color-action-blue) 7%, color-mix(in srgb, var(--color-soft-blue) 46%, transparent)) 0%,
      transparent 52%
    ),
    radial-gradient(
      circle at 100% 100%,
      color-mix(in srgb, var(--color-action-blue) 8%, color-mix(in srgb, var(--color-soft-blue) 50%, transparent)) 0%,
      transparent 55%
    ),
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--color-soft-blue) 22%, transparent) 0%,
      transparent 44%
    ),
    radial-gradient(
      circle at 0% 100%,
      color-mix(in srgb, var(--color-soft-blue) 26%, transparent) 0%,
      transparent 46%
    );
}

.quote-surface-gold {
  background-color: var(--color-surface-light);
  background-image:
    radial-gradient(
      circle at 0% 0%,
      color-mix(in srgb, var(--color-dark-gold) 6%, color-mix(in srgb, var(--color-soft-cream) 48%, transparent)) 0%,
      transparent 52%
    ),
    radial-gradient(
      circle at 100% 100%,
      color-mix(in srgb, var(--color-dark-gold) 7%, color-mix(in srgb, var(--color-soft-cream) 52%, transparent)) 0%,
      transparent 55%
    ),
    radial-gradient(
      circle at 100% 0%,
      color-mix(in srgb, var(--color-soft-cream) 22%, transparent) 0%,
      transparent 44%
    ),
    radial-gradient(
      circle at 0% 100%,
      color-mix(in srgb, var(--color-soft-cream) 26%, transparent) 0%,
      transparent 46%
    );
}

.quote-surface-mixed {
  background-color: var(--color-surface-light);
  background-image:
    radial-gradient(
      circle at 0% 0%,
      color-mix(in srgb, var(--color-dark-gold) 7%, color-mix(in srgb, var(--color-soft-cream) 50%, transparent)) 0%,
      transparent 48%
    ),
    radial-gradient(
      circle at 100% 100%,
      color-mix(in srgb, var(--color-soft-peach) 36%, color-mix(in srgb, var(--color-soft-cream) 24%, transparent)) 0%,
      transparent 52%
    ),
    radial-gradient(
      circle at 0% 100%,
      color-mix(in srgb, var(--color-action-blue) 6%, color-mix(in srgb, var(--color-soft-blue) 38%, transparent)) 0%,
      transparent 48%
    ),
    radial-gradient(
      circle at 92% 0%,
      color-mix(in srgb, var(--color-soft-blue) 32%, transparent) 0%,
      transparent 46%
    );
}
</style>
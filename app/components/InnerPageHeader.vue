<!-- ~/app/components/InnerPageHeader.vue -->
<script setup lang="ts">
import { computed } from 'vue'

export interface InnerPageHeaderConfig {
  subtitle?: string
  paragraph?: string
  // Backwards-safe optional keys while sweeping remaining inner pages
  eyebrow?: string
  titleLine1?: string
  titleLine2Cursive?: string
  description?: string
}

// Centralized choreography tempo (ms) for effortless tuning
const PROLOGUE_MOTION = {
  subtitleDelayMs: 740,
  ornamentDelayMs: 840,
  wingDelayMs: 875,
  paragraphDelayMs: 940
} as const

const props = defineProps<{
  data: InnerPageHeaderConfig
}>()

const resolvedSubtitle = computed<string>(() => {
  if (props.data.subtitle?.trim()) return props.data.subtitle.trim()

  const line1 = props.data.titleLine1?.trim() || ''
  const line2 = props.data.titleLine2Cursive?.trim() || ''
  if (!line1) return line2
  if (!line2) return line1

  // If line1 didn't end a sentence, lowercase line2's leading capital for natural flow
  const endsSentence = /[.!?]$/.test(line1)
  const normalizedLine2 = endsSentence
    ? line2
    : line2.charAt(0).toLowerCase() + line2.slice(1)

  return `${line1} ${normalizedLine2}`
})

const resolvedParagraph = computed<string>(() => {
  return (props.data.paragraph ?? props.data.description ?? '').trim()
})
</script>

<template>
  <section
    data-theme="light"
    class="inner-header-section"
  >
    <div class="inner-header-container">
      <!-- Beat 1: Editorial Prologue Subtitle -->
      <h2
        v-if="resolvedSubtitle"
        v-motion-prologue-subtitle
        :delay="PROLOGUE_MOTION.subtitleDelayMs"
        class="inner-header-subtitle"
      >
        {{ resolvedSubtitle }}
      </h2>

      <!-- Beat 2: Center Gold Compass Diamond + Outward-Unfolding Hairline Wings -->
      <div
        v-if="resolvedSubtitle && resolvedParagraph"
        aria-hidden="true"
        class="inner-header-ornament"
      >
        <span
          v-motion-wing-expand
          :delay="PROLOGUE_MOTION.wingDelayMs"
          class="inner-header-wing origin-right"
        />
        <svg
          v-motion-diamond-bloom
          :delay="PROLOGUE_MOTION.ornamentDelayMs"
          class="w-2 h-2 sm:w-2.5 sm:h-2.5 text-dark-gold shrink-0"
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M6 0.75L11.25 6L6 11.25L0.75 6L6 0.75Z" />
        </svg>
        <span
          v-motion-wing-expand
          :delay="PROLOGUE_MOTION.wingDelayMs"
          class="inner-header-wing-right origin-left"
        />
      </div>

      <!-- Beat 3: Measured Lead Paragraph -->
      <p
        v-if="resolvedParagraph"
        v-motion-prologue-copy
        :delay="PROLOGUE_MOTION.paragraphDelayMs"
        class="inner-header-paragraph"
      >
        {{ resolvedParagraph }}
      </p>
    </div>
  </section>
</template>
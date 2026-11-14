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

<style scoped>
.inner-header-section {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 2.5rem;
  padding-bottom: 0.75rem;
  padding-inline: 0.5rem;
  background-color: var(--color-bg-light);
  color: var(--color-primary-light);
  overflow-x: clip;
}

@media (min-width: 321px) {
  .inner-header-section {
    padding-inline: 0.75rem;
  }
}

@media (min-width: 481px) {
  .inner-header-section {
    padding-inline: 1.25rem;
  }
}

@media (min-width: 640px) {
  .inner-header-section {
    padding-top: 3rem;
    padding-bottom: 1rem;
    padding-inline: 2.5rem;
  }
}

@media (min-width: 768px) {
  .inner-header-section {
    padding-top: 3.5rem;
    padding-bottom: 1.25rem;
    padding-inline: 3rem;
  }
}

@media (min-width: 1024px) {
  .inner-header-section {
    padding-inline: 4rem;
  }
}

@media (min-width: 1280px) {
  .inner-header-section {
    padding-top: 4rem;
    padding-inline: 5rem;
  }
}

@media (min-width: 1536px) {
  .inner-header-section {
    padding-inline: 6rem;
  }
}

.inner-header-container {
  position: relative;
  width: 100%;
  max-width: 56rem;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.inner-header-subtitle {
  font-family: var(--font-primary);
  font-weight: 400;
  letter-spacing: -0.01em;
  color: var(--color-journey-deep);
  line-height: 1.3;
  font-size: 1.2rem;
  text-wrap: balance;
  max-width: 26ch;
  filter: none;
}

@media (min-width: 321px) {
  .inner-header-subtitle {
    font-size: 1.32rem;
  }
}

@media (min-width: 481px) {
  .inner-header-subtitle {
    font-size: 1.45rem;
    max-width: 32ch;
  }
}

@media (min-width: 640px) {
  .inner-header-subtitle {
    font-size: 1.62rem;
    line-height: 1.24;
    max-width: 35ch;
  }
}

@media (min-width: 768px) {
  .inner-header-subtitle {
    font-size: 1.8rem;
  }
}

@media (min-width: 1024px) {
  .inner-header-subtitle {
    font-size: 1.95rem;
  }
}

@media (min-width: 1280px) {
  .inner-header-subtitle {
    font-size: 2.08rem;
  }
}

.inner-header-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  margin-block: 1rem;
  user-select: none;
  pointer-events: none;
}

@media (min-width: 640px) {
  .inner-header-ornament {
    gap: 0.75rem;
    margin-block: 1.25rem;
  }
}

.inner-header-wing,
.inner-header-wing-right {
  width: 2.25rem;
  height: 1px;
}

@media (min-width: 321px) {
  .inner-header-wing,
  .inner-header-wing-right {
    width: 2.75rem;
  }
}

@media (min-width: 640px) {
  .inner-header-wing,
  .inner-header-wing-right {
    width: 3.5rem;
  }
}

@media (min-width: 768px) {
  .inner-header-wing,
  .inner-header-wing-right {
    width: 4rem;
  }
}

.inner-header-wing {
  background-image: linear-gradient(
    to right,
    transparent 0%,
    color-mix(in srgb, var(--color-dark-gold) 55%, transparent) 50%,
    color-mix(in srgb, var(--color-dark-gold) 80%, transparent) 100%
  );
}

.inner-header-wing-right {
  background-image: linear-gradient(
    to left,
    transparent 0%,
    color-mix(in srgb, var(--color-dark-gold) 55%, transparent) 50%,
    color-mix(in srgb, var(--color-dark-gold) 80%, transparent) 100%
  );
}

.inner-header-paragraph {
  font-family: var(--font-primary);
  font-size: 14px;
  line-height: 1.55;
  letter-spacing: 0.01em;
  font-weight: 400;
  color: var(--color-secondary-light);
  text-wrap: pretty;
  max-width: 36ch;
}

@media (max-width: 320px) {
  .inner-header-paragraph {
    text-wrap: balance;
  }
}

@media (min-width: 321px) {
  .inner-header-paragraph {
    font-size: 15px;
    max-width: 42ch;
  }
}

@media (min-width: 481px) {
  .inner-header-paragraph {
    max-width: 48ch;
  }
}

@media (min-width: 640px) {
  .inner-header-paragraph {
    font-size: 16px;
    max-width: 56ch;
  }
}

@media (min-width: 768px) {
  .inner-header-paragraph {
    max-width: 62ch;
  }
}

@media (min-width: 1024px) {
  .inner-header-paragraph {
    font-size: 17px;
  }
}

@media (min-width: 1280px) {
  .inner-header-paragraph {
    font-size: 18px;
  }
}
</style>
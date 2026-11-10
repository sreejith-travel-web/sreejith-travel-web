<!-- ~/app/components/journal/JournalImageSplitBlock.vue -->
<script setup lang="ts">
import { computed, useId } from 'vue'
import type { LightboxOpenPayload } from '~/components/Lightbox.vue'
import JournalRichText from '~/components/journal/JournalRichText.vue'
import {
  resolveJournalMediaSectionId,
  stripJournalHtml
} from '~/components/journal/JournalMediaHeader.vue'
import type {
  JournalContentBlock,
  JournalParagraphEntry
} from '~~/server/utils/journalData'

const props = defineProps<{
  block: JournalContentBlock
}>()

const emit = defineEmits<{
  (e: 'open-lightbox', payload: LightboxOpenPayload): void
}>()

const uid = useId()

const resolvedSectionId = computed(() => resolveJournalMediaSectionId(props.block))
const triggerId = computed(
  () => `journal-split-trigger-${resolvedSectionId.value || uid}`
)

const plainTitle = computed(() => stripJournalHtml(props.block.title))
const plainCaption = computed(() => stripJournalHtml(props.block.caption))
const resolvedAlt = computed(
  () => props.block.imageAlt?.trim() || plainTitle.value || 'Journal feature image'
)

// Purge-safe 12-column width mappings (Defaults to 6 / 6)
const IMAGE_COL_MAP: Record<4 | 5 | 6 | 7, string> = {
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  7: 'md:col-span-7'
}

const TEXT_COL_MAP: Record<4 | 5 | 6 | 7, string> = {
  4: 'md:col-span-8',
  5: 'md:col-span-7',
  6: 'md:col-span-6',
  7: 'md:col-span-5'
}

const normalizedCols = computed<4 | 5 | 6 | 7>(() => {
  const c = props.block.imageCols
  if (c === 4 || c === 5 || c === 6 || c === 7) return c
  return 6
})

const imageColSpanClass = computed(() => IMAGE_COL_MAP[normalizedCols.value])
const textColSpanClass = computed(() => TEXT_COL_MAP[normalizedCols.value])

// Independent Mobile & Desktop Ordering
const imageOrderClass = computed(() => [
  props.block.mobileOrder === 'text-first' ? 'order-2' : 'order-1',
  props.block.imagePosition === 'right' ? 'md:order-2' : 'md:order-1'
])

const textOrderClass = computed(() => [
  props.block.mobileOrder === 'text-first' ? 'order-1' : 'order-2',
  props.block.imagePosition === 'right' ? 'md:order-1' : 'md:order-2'
])

// Sticky Top-Align by Default | Optional Center-Align for Short Copy
const isCenterAligned = computed(() => props.block.verticalAlign === 'center')

// Aspect Ratio Presets (Includes 3:4 & 2:3 Portrait + Custom W:H Fallback)
interface RatioSpec {
  css: string
  w: number
  h: number
}

const RATIO_PRESETS: Record<string, RatioSpec> = {
  '1:1': { css: '1 / 1', w: 800, h: 800 },
  '4:3': { css: '4 / 3', w: 800, h: 600 },
  '3:4': { css: '3 / 4', w: 600, h: 800 },
  '2:3': { css: '2 / 3', w: 600, h: 900 },
  '3:2': { css: '3 / 2', w: 900, h: 600 },
  '16:10': { css: '16 / 10', w: 960, h: 600 },
  '16:9': { css: '16 / 9', w: 960, h: 540 }
}

const resolvedRatioSpec = computed<RatioSpec>(() => {
  const raw = (props.block.aspectRatio || '4:3').trim().replace(/\s+/g, '')
  const normalizedKey = raw.replace('/', ':')
  if (RATIO_PRESETS[normalizedKey]) {
    return RATIO_PRESETS[normalizedKey]
  }

  const customMatch = normalizedKey.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/)
  if (customMatch) {
    const rw = Number(customMatch[1])
    const rh = Number(customMatch[2])
    if (rw > 0 && rh > 0) {
      return {
        css: `${rw} / ${rh}`,
        w: Math.round(600 * (rw / rh)),
        h: 600
      }
    }
  }

  return RATIO_PRESETS['4:3']!
})

const resolvedAspectRatio = computed(() => resolvedRatioSpec.value.css)

// Card Surface (Default Light + Optional Cream/Blue Tints)
const surfaceClass = computed(() => {
  if (props.block.theme === 'cream') {
    return 'bg-soft-cream/20 border border-dark-gold/20 shadow-2xs'
  }
  if (props.block.theme === 'blue') {
    return 'bg-soft-blue/16 border border-journey-deep/12 shadow-2xs'
  }
  return 'bg-surface-light border border-journey-deep/10 shadow-2xs'
})

const eyebrowColorClass = computed(() =>
  props.block.theme === 'blue' ? 'text-action-blue' : 'text-dark-gold'
)

const headingTag = computed(() => {
  if (props.block.titleLevel === 1) return 'h2'
  if (props.block.titleLevel === 3) return 'h4'
  return 'h3'
})

const headingClass = computed(() => {
  if (props.block.titleLevel === 3) {
    return 'subsection-title font-medium text-journey-deep'
  }
  return 'section-smaller-subtitle font-medium text-journey-deep'
})

const normalizedParagraphs = computed<JournalParagraphEntry[]>(() => {
  const result: JournalParagraphEntry[] = []
  const fallbackLevel = props.block.paragraphLevel || 2

  if (props.block.text?.trim()) {
    result.push({ text: props.block.text, level: fallbackLevel })
  }

  if (Array.isArray(props.block.paragraphs)) {
    for (const entry of props.block.paragraphs) {
      if (typeof entry === 'string' && entry.trim()) {
        result.push({ text: entry, level: fallbackLevel })
      } else if (typeof entry === 'object' && entry?.text?.trim()) {
        result.push({
          text: entry.text,
          level: entry.level || fallbackLevel
        })
      }
    }
  }

  return result
})

const getParagraphClass = (level?: 1 | 2 | 3): string => {
  if (level === 1) return 'hero-paragraph text-secondary-light'
  if (level === 3) return 'section-subparagraph text-secondary-light'
  return 'section-paragraph text-secondary-light'
}

const handleImageClick = () => {
  if (!props.block.image) return
  emit('open-lightbox', {
    items: [
      {
        src: props.block.image,
        alt: resolvedAlt.value,
        caption: plainCaption.value || plainTitle.value || undefined
      }
    ],
    index: 0
  })
}
</script>

<template>
  <section
    v-if="block.image"
    :id="resolvedSectionId"
    :aria-label="plainTitle || resolvedAlt"
    :class="[
      'w-full my-3 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-7 p-3.5 sm:p-5 md:p-6 rounded-2xl',
      isCenterAligned ? 'items-center' : 'items-start',
      { 'scroll-mt-36': Boolean(resolvedSectionId) },
      surfaceClass
    ]"
  >
    <!-- Image Column (Sticky on Desktop by Default) -->
    <figure
      :class="[
        'w-full flex flex-col',
        imageColSpanClass,
        imageOrderClass,
        { 'md:sticky md:top-32': !isCenterAligned }
      ]"
    >
      <button
        :id="triggerId"
        :name="triggerId"
        type="button"
        :aria-label="`View ${resolvedAlt} in full screen`"
        v-motion-fade-up
        :style="{ aspectRatio: resolvedAspectRatio }"
        class="group relative w-full rounded-xl overflow-hidden bg-surface-frosted border border-journey-deep/8 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-action-blue"
        @click="handleImageClick"
      >
        <img
          :src="block.image"
          :alt="resolvedAlt"
          :width="resolvedRatioSpec.w"
          :height="resolvedRatioSpec.h"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-editorial group-hover:scale-105 select-none"
        />

        <!-- Subtle Frosted Zoom Cue -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute bottom-2.5 right-2.5 w-8 h-8 rounded-lg bg-journey-deep/55 backdrop-blur-xs border border-surface-light/25 text-surface-light flex items-center justify-center opacity-85 sm:opacity-0 sm:group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 ease-editorial group-hover:scale-105"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-3.5 h-3.5"
          >
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </span>
      </button>

      <figcaption
        v-if="block.caption"
        class="mt-2.5 px-0.5 text-left section-subparagraph text-secondary-light/85"
      >
        <JournalRichText :content="block.caption" tag="span" />
      </figcaption>
    </figure>

    <!-- Editorial Text Column -->
    <div
      v-motion-fade-up
      :delay="80"
      :class="[
        'w-full flex flex-col px-1 pb-1 sm:p-0 text-left',
        textColSpanClass,
        textOrderClass
      ]"
    >
      <span
        v-if="block.eyebrow"
        :class="['section-midsubtitle font-medium mb-1.5! pt-0.5', eyebrowColorClass]"
      >
        {{ block.eyebrow }}
      </span>

      <component
        :is="headingTag"
        v-if="block.title"
        :class="[headingClass, normalizedParagraphs.length ? 'mb-3' : 'mb-0']"
      >
        <JournalRichText :content="block.title" tag="span" />
      </component>

      <div
        v-if="normalizedParagraphs.length > 0"
        class="flex flex-col gap-3.5"
      >
        <JournalRichText
          v-for="(para, pIdx) in normalizedParagraphs"
          :key="`split-p-${pIdx}`"
          tag="p"
          :content="para.text"
          :class="getParagraphClass(para.level)"
        />
      </div>
    </div>
  </section>
</template>
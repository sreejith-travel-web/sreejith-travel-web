<!-- ~/app/components/journal/JournalTextBlock.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import JournalRichText from '~/components/journal/JournalRichText.vue'
import type { JournalBlock, JournalParagraphEntry, JournalListEntry } from '~~/server/utils/journalData'

const props = defineProps<{
  block: JournalBlock
}>()

const EDITORIAL_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

const slugifyHeading = (raw?: string): string =>
  (raw || '')
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const resolvedTitleLevel = computed<1 | 2 | 3>(() => {
  if (props.block.type === 'heading') return 1
  return props.block.titleLevel || 1
})

const isSectionHeading = computed(
  () => Boolean(props.block.title) && resolvedTitleLevel.value === 1
)

const resolvedSectionId = computed(() => {
  if (props.block.id) return props.block.id
  if (!isSectionHeading.value) return undefined
  return slugifyHeading(props.block.title)
})

const eyebrowClass = computed(() => {
  if (props.block.eyebrowLevel === 2) {
    return 'card-eyebrow line-clamp-none! overflow-visible! whitespace-normal! text-action-blue font-semibold mb-1.5!'
  }
  return 'section-midsubtitle text-dark-gold mb-2!'
})

const getParagraphClass = (level?: 1 | 2 | 3): string => {
  const resolved = level || props.block.paragraphLevel || 1
  if (resolved === 2) return 'section-paragraph text-secondary-light'
  if (resolved === 3) return 'section-subparagraph text-secondary-light'
  return 'hero-paragraph text-secondary-light'
}

const normalizedParagraphs = computed<JournalParagraphEntry[]>(() => {
  const result: JournalParagraphEntry[] = []
  if (props.block.text) {
    result.push({ text: props.block.text, level: props.block.paragraphLevel || 1 })
  }
  if (Array.isArray(props.block.paragraphs)) {
    for (const entry of props.block.paragraphs) {
      if (typeof entry === 'string' && entry.trim()) {
        result.push({ text: entry, level: props.block.paragraphLevel || 1 })
      } else if (typeof entry === 'object' && entry?.text) {
        result.push({
          text: entry.text,
          level: entry.level || props.block.paragraphLevel || 1
        })
      }
    }
  }
  return result
})

const normalizedListItems = computed<JournalListEntry[]>(() => {
  const rawItems = props.block.list?.items
  if (!Array.isArray(rawItems)) return []
  return rawItems
    .map((item) => (typeof item === 'string' ? { text: item } : item))
    .filter((item) => Boolean(item?.text || item?.title))
})

const listType = computed(() => props.block.list?.type || 'unordered')

const listTextClass = computed(() => {
  const resolved = props.block.list?.level || props.block.paragraphLevel || 2
  if (resolved === 1) return 'hero-paragraph font-normal text-secondary-light'
  if (resolved === 3) return 'section-subparagraph font-normal text-secondary-light'
  return 'section-paragraph font-normal text-secondary-light'
})

const hasTextHeaderOrBody = computed(
  () =>
    Boolean(props.block.eyebrow) ||
    Boolean(props.block.title) ||
    normalizedParagraphs.value.length > 0
)
</script>

<template>
  <div
    :id="resolvedSectionId"
    :class="[
      'w-full flex flex-col gap-4 sm:gap-5',
      { 'scroll-mt-36': Boolean(resolvedSectionId) },
      { 'pt-4 first:pt-0': isSectionHeading },
      { 'pt-2': Boolean(block.title) && !isSectionHeading }
    ]"
  >
    <!-- 1. Eyebrow + Heading + Rich-Text Paragraphs (v-motion GPU Fade-Up) -->
    <div
      v-if="hasTextHeaderOrBody"
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
      class="w-full flex flex-col gap-4 sm:gap-5"
    >
      <!-- Eyebrow + Title Group -->
      <div v-if="block.eyebrow || block.title" class="flex flex-col items-start">
        <span v-if="block.eyebrow" :class="eyebrowClass">
          {{ block.eyebrow }}
        </span>

        <!-- Level 1: H2 Section Title (Appears in Sidebar TOC + Left Gold Underline) -->
        <template v-if="block.title && resolvedTitleLevel === 1">
          <h2 class="section-subtitle text-journey-deep">
            <JournalRichText :content="block.title" tag="span" />
          </h2>
          <div class="w-10 h-0.5 bg-dark-gold mt-2.5" aria-hidden="true" />
        </template>

        <!-- Level 2: H3 Subsection Title -->
        <h3
          v-else-if="block.title && resolvedTitleLevel === 2"
          class="section-smaller-subtitle text-journey-deep"
        >
          <JournalRichText :content="block.title" tag="span" />
        </h3>

        <!-- Level 3: H4 Minor Subsection Title -->
        <h4
          v-else-if="block.title && resolvedTitleLevel === 3"
          class="subsection-title text-journey-deep"
        >
          <JournalRichText :content="block.title" tag="span" />
        </h4>
      </div>

      <!-- Rich-Text Paragraphs (Levels 1, 2, or 3) -->
      <JournalRichText
        v-for="(para, pIdx) in normalizedParagraphs"
        :key="`para-${pIdx}`"
        tag="p"
        :content="para.text"
        :class="getParagraphClass(para.level)"
      />
    </div>

    <!-- 2A. Unordered List (Rounded Gold Checkmark Icon + Stagger Reveal) -->
    <ul
      v-if="normalizedListItems.length > 0 && listType === 'unordered'"
      class="flex flex-col gap-3.5 pt-1"
    >
      <li
        v-for="(item, lIdx) in normalizedListItems"
        :key="`ul-${lIdx}`"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'tween',
            duration: 480,
            delay: Math.min(lIdx * 75, 450),
            ease: EDITORIAL_EASE
          }
        }"
        class="flex items-start gap-3.5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.6"
          stroke="currentColor"
          aria-hidden="true"
          class="w-5 h-5 text-dark-gold shrink-0 mt-1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <div class="flex-1 min-w-0">
          <strong v-if="item.title" class="font-semibold text-journey-deep mr-1.5">
            <JournalRichText :content="item.title" tag="span" />
          </strong>
          <JournalRichText tag="span" :content="item.text" :class="listTextClass" />
        </div>
      </li>
    </ul>

    <!-- 2B. Ordered List (Font-Semibold Numbers + Font-Normal Copy + Stagger Reveal) -->
    <ol
      v-else-if="normalizedListItems.length > 0 && listType === 'ordered'"
      class="flex flex-col gap-3.5 pt-1"
    >
      <li
        v-for="(item, lIdx) in normalizedListItems"
        :key="`ol-${lIdx}`"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'tween',
            duration: 480,
            delay: Math.min(lIdx * 75, 450),
            ease: EDITORIAL_EASE
          }
        }"
        class="flex items-baseline gap-3.5"
      >
        <span
          :class="[
            listTextClass,
            'font-semibold! text-journey-deep tabular-nums shrink-0 min-w-5 select-none'
          ]"
        >
          {{ lIdx + 1 }}.
        </span>

        <div class="flex-1 min-w-0">
          <strong v-if="item.title" class="font-semibold text-journey-deep mr-1.5">
            <JournalRichText :content="item.title" tag="span" />
          </strong>
          <JournalRichText tag="span" :content="item.text" :class="listTextClass" />
        </div>
      </li>
    </ol>

    <!-- 2C. Divided Resource List (Continue Exploring Subsection Style + Stagger Reveal) -->
    <ul
      v-else-if="normalizedListItems.length > 0 && listType === 'divided'"
      class="flex flex-col divide-y divide-journey-deep/15 border-t border-b border-journey-deep/15 mt-1"
    >
      <li
        v-for="(item, lIdx) in normalizedListItems"
        :key="`div-${lIdx}`"
        v-motion
        :initial="{ opacity: 0, y: 16 }"
        :visible-once="{
          opacity: 1,
          y: 0,
          transition: {
            type: 'tween',
            duration: 480,
            delay: Math.min(lIdx * 80, 480),
            ease: EDITORIAL_EASE
          }
        }"
        class="py-4 sm:py-4.5 flex flex-col gap-1"
      >
        <div
          v-if="item.title"
          class="section-paragraph font-semibold text-intention-blue [&_a]:text-intention-blue [&_a]:no-underline [&_a:hover]:text-action-blue [&_a:hover]:underline"
        >
          <JournalRichText :content="item.title" tag="span" />
        </div>
        <JournalRichText
          v-if="item.text"
          tag="p"
          :content="item.text"
          class="section-subparagraph text-secondary-light"
        />
      </li>
    </ul>
  </div>
</template>
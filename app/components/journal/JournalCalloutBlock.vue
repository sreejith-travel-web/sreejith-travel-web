<!-- ~/app/components/journal/JournalCalloutBlock.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import JournalRichText from '~/components/journal/JournalRichText.vue'
import type {
  JournalContentBlock,
  JournalParagraphEntry,
  JournalListEntry
} from '~~/server/utils/journalData'

const props = defineProps<{
  block: JournalContentBlock
}>()

const isCreamTheme = computed(() => props.block.theme === 'cream')

const surfaceClass = computed(() =>
  isCreamTheme.value
    ? 'bg-soft-cream/24 border border-dark-gold/22'
    : 'bg-soft-blue/18 border border-journey-deep/12'
)

const eyebrowAccentClass = computed(() =>
  isCreamTheme.value ? 'text-dark-gold' : 'text-action-blue'
)

const dividerAccentClass = computed(() =>
  isCreamTheme.value ? 'border-dark-gold/18' : 'border-journey-deep/12'
)

const hasHeader = computed(() =>
  Boolean(
    props.block.eyebrow?.trim() ||
      props.block.title?.trim() ||
      props.block.subtitle?.trim()
  )
)

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

const normalizeItems = (
  raw?: Array<string | JournalListEntry>
): JournalListEntry[] => {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => (typeof item === 'string' ? { text: item } : item))
    .filter((item) => Boolean(item?.text?.trim() || item?.title?.trim()))
}

// Supports dedicated unorderedList OR legacy block.items (when listType !== 'ordered')
const resolvedUnordered = computed(() => {
  if (props.block.unorderedList?.items?.length) {
    return {
      title: props.block.unorderedList.title?.trim() || '',
      level: props.block.unorderedList.level || 3,
      items: normalizeItems(props.block.unorderedList.items)
    }
  }

  if (props.block.items?.length && props.block.listType !== 'ordered') {
    return {
      title: '',
      level: 3 as const,
      items: normalizeItems(props.block.items)
    }
  }

  return { title: '', level: 3 as const, items: [] as JournalListEntry[] }
})

// Supports dedicated orderedList OR legacy block.items with listType: 'ordered'
const resolvedOrdered = computed(() => {
  if (props.block.orderedList?.items?.length) {
    return {
      title: props.block.orderedList.title?.trim() || '',
      level: props.block.orderedList.level || 3,
      items: normalizeItems(props.block.orderedList.items)
    }
  }

  if (props.block.items?.length && props.block.listType === 'ordered') {
    return {
      title: '',
      level: 3 as const,
      items: normalizeItems(props.block.items)
    }
  }

  return { title: '', level: 3 as const, items: [] as JournalListEntry[] }
})

const getParagraphClass = (level?: 1 | 2 | 3): string => {
  if (level === 1) return 'hero-paragraph text-journey-deep/90'
  if (level === 3) return 'section-subparagraph text-journey-deep/90'
  return 'section-paragraph text-journey-deep/90'
}

const getListTextClass = (level?: 2 | 3): string => {
  if (level === 2) return 'section-paragraph font-normal text-journey-deep/90'
  return 'section-subparagraph font-normal text-journey-deep/90'
}
</script>

<template>
  <aside
    v-motion-fade-up
    :id="block.id"
    :class="[
      'w-full my-3 p-6 sm:p-8 rounded-2xl flex flex-col gap-4 sm:gap-5',
      { 'scroll-mt-36': Boolean(block.id) },
      surfaceClass
    ]"
  >
    <!-- 1. Eyebrow + Primary Title + Subtitle -->
    <div v-if="hasHeader" class="flex flex-col items-start gap-1.5">
      <span
        v-if="block.eyebrow"
        :class="['section-midsubtitle mb-0.5!', eyebrowAccentClass]"
      >
        {{ block.eyebrow }}
      </span>

      <h3
        v-if="block.title"
        class="section-smaller-subtitle font-medium text-journey-deep"
      >
        <JournalRichText :content="block.title" tag="span" />
      </h3>

      <component
        :is="block.title ? 'h4' : 'h3'"
        v-if="block.subtitle"
        class="subsection-title font-medium! text-journey-deep/85"
      >
        <JournalRichText :content="block.subtitle" tag="span" />
      </component>
    </div>

    <!-- 2. Rich-Text Paragraph(s) -->
    <div
      v-if="normalizedParagraphs.length > 0"
      class="flex flex-col gap-3.5"
    >
      <JournalRichText
        v-for="(para, pIdx) in normalizedParagraphs"
        :key="`callout-p-${pIdx}`"
        tag="p"
        :content="para.text"
        :class="getParagraphClass(para.level)"
      />
    </div>

    <!-- 3. Unordered Checkmark List (With Optional List Title + Stagger Delay) -->
    <div
      v-if="resolvedUnordered.items.length > 0"
      class="flex flex-col gap-3"
    >
      <p
        v-if="resolvedUnordered.title"
        class="testimonial-author text-journey-deep!"
      >
        <JournalRichText :content="resolvedUnordered.title" tag="span" />
      </p>

      <ul class="flex flex-col gap-3">
        <li
          v-for="(item, uIdx) in resolvedUnordered.items"
          :key="`callout-ul-${uIdx}`"
          v-motion-stagger-card
          :delay="Math.min(80 + uIdx * 60, 440)"
          class="flex items-start gap-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.6"
            stroke="currentColor"
            aria-hidden="true"
            class="w-5 h-5 text-dark-gold shrink-0 mt-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <div class="flex-1 min-w-0">
            <strong
              v-if="item.title"
              class="font-semibold text-journey-deep mr-1.5"
            >
              <JournalRichText :content="item.title" tag="span" />
            </strong>
            <JournalRichText
              tag="span"
              :content="item.text"
              :class="getListTextClass(resolvedUnordered.level)"
            />
          </div>
        </li>
      </ul>
    </div>

    <!-- Subtle Divider Only When Both Lists Coexist -->
    <div
      v-if="resolvedUnordered.items.length > 0 && resolvedOrdered.items.length > 0"
      :class="['w-full border-t pt-1', dividerAccentClass]"
      aria-hidden="true"
    />

    <!-- 4. Ordered Numbered List (With Optional List Title + Stagger Delay) -->
    <div
      v-if="resolvedOrdered.items.length > 0"
      class="flex flex-col gap-3"
    >
      <p
        v-if="resolvedOrdered.title"
        class="testimonial-author text-journey-deep!"
      >
        <JournalRichText :content="resolvedOrdered.title" tag="span" />
      </p>

      <ol class="flex flex-col gap-3">
        <li
          v-for="(item, oIdx) in resolvedOrdered.items"
          :key="`callout-ol-${oIdx}`"
          v-motion-stagger-card
          :delay="Math.min(80 + (resolvedUnordered.items.length + oIdx) * 60, 500)"
          class="flex items-baseline gap-3.5"
        >
          <span
            :class="[
              getListTextClass(resolvedOrdered.level),
              'font-semibold! text-journey-deep tabular-nums shrink-0 min-w-5 select-none'
            ]"
          >
            {{ oIdx + 1 }}.
          </span>

          <div class="flex-1 min-w-0">
            <strong
              v-if="item.title"
              class="font-semibold text-journey-deep mr-1.5"
            >
              <JournalRichText :content="item.title" tag="span" />
            </strong>
            <JournalRichText
              tag="span"
              :content="item.text"
              :class="getListTextClass(resolvedOrdered.level)"
            />
          </div>
        </li>
      </ol>
    </div>
  </aside>
</template>
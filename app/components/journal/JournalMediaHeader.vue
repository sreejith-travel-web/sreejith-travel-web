<!-- ~/app/components/journal/JournalMediaHeader.vue -->
<script lang="ts">
import type { JournalContentBlock } from '~~/server/utils/journalData'

export const stripJournalHtml = (raw?: string): string =>
  (raw || '').replace(/<[^>]*>/g, '').trim()

export const slugifyJournalHeading = (raw?: string): string | undefined => {
  const clean = stripJournalHtml(raw)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return clean || undefined
}

export const resolveJournalMediaSectionId = (
  block: Pick<JournalContentBlock, 'id' | 'title' | 'titleLevel'>
): string | undefined => {
  if (block.id?.trim()) return block.id.trim()
  if (block.titleLevel === 1 && block.title) {
    return slugifyJournalHeading(block.title)
  }
  return undefined
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import JournalRichText from '~/components/journal/JournalRichText.vue'

const props = defineProps<{
  block: JournalContentBlock
}>()

const introCopy = computed(
  () => props.block.text?.trim() || props.block.paragraph?.trim() || ''
)

const hasHeader = computed(() =>
  Boolean(
    props.block.eyebrow?.trim() ||
      props.block.title?.trim() ||
      introCopy.value
  )
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
</script>

<template>
  <div
    v-if="hasHeader"
    v-motion-fade-up
    class="flex flex-col items-start text-left"
  >
    <span
      v-if="block.eyebrow"
      class="section-midsubtitle text-dark-gold font-medium mb-1.5! pt-0.5"
    >
      {{ block.eyebrow }}
    </span>

    <component
      :is="headingTag"
      v-if="block.title"
      :class="headingClass"
    >
      <JournalRichText :content="block.title" tag="span" />
    </component>

    <JournalRichText
      v-if="introCopy"
      tag="p"
      :content="introCopy"
      :class="[
        'section-paragraph text-secondary-light leading-relaxed max-w-3xl',
        block.title ? 'mt-2' : 'mt-0.5'
      ]"
    />
  </div>
</template>
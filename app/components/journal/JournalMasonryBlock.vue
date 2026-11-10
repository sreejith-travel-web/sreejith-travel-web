<!-- ~/app/components/journal/JournalMasonryBlock.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import Masonry, { type MasonryImageEntry } from '~/components/Masonry.vue'
import type { LightboxOpenPayload } from '~/components/Lightbox.vue'
import JournalMediaHeader, {
  resolveJournalMediaSectionId,
  stripJournalHtml
} from '~/components/journal/JournalMediaHeader.vue'
import type { JournalContentBlock } from '~~/server/utils/journalData'

const props = defineProps<{
  block: JournalContentBlock
}>()

const emit = defineEmits<{
  (e: 'open-lightbox', payload: LightboxOpenPayload): void
}>()

const resolvedSectionId = computed(() => resolveJournalMediaSectionId(props.block))
const plainTitle = computed(() => stripJournalHtml(props.block.title))

const resolvedImages = computed<Array<string | MasonryImageEntry>>(() => {
  if (props.block.images?.length) {
    return props.block.images as Array<string | MasonryImageEntry>
  }
  if (props.block.image) {
    return [
      {
        src: props.block.image,
        alt: props.block.imageAlt || plainTitle.value || 'Journal photograph',
        caption: props.block.caption
      }
    ]
  }
  return []
})

const masonryPayload = computed(() => ({
  images: resolvedImages.value,
  caption: props.block.caption,
  captions: props.block.captions,
  captionMob: props.block.captionMob,
  captionPc: props.block.captionPc
}))
</script>

<template>
  <section
    v-if="resolvedImages.length"
    :id="resolvedSectionId"
    :aria-label="plainTitle || block.eyebrow || 'Journal visual gallery'"
    :class="[
      'w-full my-3 sm:my-4 flex flex-col gap-5 sm:gap-6',
      { 'scroll-mt-36': Boolean(resolvedSectionId) },
      { 'pt-3 first:pt-0': block.titleLevel === 1 }
    ]"
  >
    <JournalMediaHeader :block="block" />

    <div v-motion-fade-up :delay="80" class="w-full">
      <Masonry
        :block="masonryPayload"
        :max-cols="block.maxCols ?? 3"
        @open-lightbox="emit('open-lightbox', $event)"
      />
    </div>
  </section>
</template>
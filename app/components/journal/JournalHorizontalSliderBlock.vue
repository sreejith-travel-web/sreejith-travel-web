<!-- ~/app/components/journal/JournalHorizontalSliderBlock.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import HorizontalSlider from '~/components/HorizontalSlider.vue'
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
</script>

<template>
  <section
    v-if="block.images?.length"
    :id="resolvedSectionId"
    :aria-label="plainTitle || block.eyebrow || 'Journal horizontal gallery'"
    :class="[
      'w-full my-3 sm:my-4 flex flex-col gap-5 sm:gap-6',
      { 'scroll-mt-36': Boolean(resolvedSectionId) },
      { 'pt-3 first:pt-0': block.titleLevel === 1 }
    ]"
  >
    <JournalMediaHeader :block="block" />

    <HorizontalSlider
      :images="block.images as any"
      :slider-height="block.sliderHeight ?? 400"
      :inner-rounding="block.innerRounding ?? false"
      :caption="block.caption"
      :captions="block.captions"
      :caption-mob="block.captionMob"
      :caption-pc="block.captionPc"
      @open-lightbox="(payload) => emit('open-lightbox', payload)"
    />
  </section>
</template>
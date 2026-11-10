<!-- ~/app/components/journal/JournalSliderBlock.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import ThumbnailSlider, { type SliderImageEntry } from '~/components/ThumbnailSlider.vue'
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

const sliderPayload = computed(() => ({
  images: (props.block.images || []) as Array<string | SliderImageEntry>,
  width: props.block.width,
  height: props.block.height,
  autoplay: props.block.autoplay,
  interval: props.block.interval,
  caption: props.block.caption,
  captions: props.block.captions,
  captionMob: props.block.captionMob,
  captionPc: props.block.captionPc
}))
</script>

<template>
  <section
    v-if="block.images?.length"
    :id="resolvedSectionId"
    :aria-label="plainTitle || block.eyebrow || 'Journal image slider'"
    :class="[
      'w-full my-3 sm:my-4 flex flex-col gap-5 sm:gap-6',
      { 'scroll-mt-36': Boolean(resolvedSectionId) },
      { 'pt-3 first:pt-0': block.titleLevel === 1 }
    ]"
  >
    <JournalMediaHeader :block="block" />

    <div v-motion-fade-up :delay="80" class="w-full">
      <ThumbnailSlider
        :block="sliderPayload"
        @open-lightbox="emit('open-lightbox', $event)"
      />
    </div>
  </section>
</template>
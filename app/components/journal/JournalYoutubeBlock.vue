<!-- ~/app/components/journal/JournalYoutubeBlock.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import YoutubePlayer from '~/components/YoutubePlayer.vue'
import JournalRichText from '~/components/journal/JournalRichText.vue'
import JournalMediaHeader, {
  resolveJournalMediaSectionId,
  stripJournalHtml
} from '~/components/journal/JournalMediaHeader.vue'
import type {
  JournalContentBlock,
  JournalYoutubeVideoConfig
} from '~~/server/utils/journalData'

const props = defineProps<{
  block: JournalContentBlock
}>()

const resolvedSectionId = computed(() => resolveJournalMediaSectionId(props.block))
const plainTitle = computed(() => stripJournalHtml(props.block.title))

const resolvedVideo = computed<JournalYoutubeVideoConfig | null>(() => {
  if (props.block.video?.videoId) {
    return props.block.video
  }
  if (props.block.videoId) {
    return {
      videoId: props.block.videoId,
      thumbnail: props.block.thumbnail || props.block.image || '',
      alt: props.block.imageAlt || plainTitle.value || 'Journal video feature',
      width: props.block.width,
      height: props.block.height
    }
  }
  return null
})
</script>

<template>
  <section
    v-if="resolvedVideo"
    :id="resolvedSectionId"
    :aria-label="plainTitle || resolvedVideo.alt || 'Journal video feature'"
    :class="[
      'w-full my-3 sm:my-4 flex flex-col gap-5 sm:gap-6',
      { 'scroll-mt-36': Boolean(resolvedSectionId) },
      { 'pt-3 first:pt-0': block.titleLevel === 1 }
    ]"
  >
    <JournalMediaHeader :block="block" />

    <figure class="w-full flex flex-col">
      <div
        v-motion
        :initial="{ opacity: 0, filter: 'blur(5px)', scale: 0.98 }"
        :visible-once="{
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 120 }
        }"
        class="w-full rounded-2xl sm:rounded-3xl overflow-hidden will-change-[transform,opacity]"
      >
        <YoutubePlayer :data="resolvedVideo" />
      </div>

      <figcaption
        v-if="block.caption"
        v-motion-micro-up
        :delay="180"
        class="w-full text-left md:text-center mt-3 sm:mt-3.5 section-subparagraph font-medium text-journey-deep/85"
      >
        <JournalRichText :content="block.caption" tag="span" />
      </figcaption>
    </figure>
  </section>
</template>
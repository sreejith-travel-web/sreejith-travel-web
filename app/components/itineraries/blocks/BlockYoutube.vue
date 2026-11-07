<!-- ~/app/components/itineraries/blocks/BlockYoutube.vue -->
<script setup lang="ts">
export interface YoutubeVideoConfig {
  videoId: string
  thumbnail: string
  alt: string
  width?: number
  height?: number
}

export interface ItineraryYoutubeBlockData {
  sectionId?: string
  eyebrow?: string
  title?: string
  video: YoutubeVideoConfig
  caption?: string
}

defineProps<{
  data: ItineraryYoutubeBlockData
}>()
</script>

<template>
  <section
    v-if="data.video?.videoId"
    :id="data.sectionId"
    :aria-label="data.title || data.video.alt || 'Journey video feature'"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-surface-light border border-journey-deep/8 p-6 sm:p-8 md:p-10 shadow-2xs flex flex-col gap-5 sm:gap-6"
  >
    <!-- Optional Header (Eyebrow + Title) -->
    <div
      v-if="data.eyebrow || data.title"
      v-motion-fade-up
      class="flex flex-col items-start text-left"
    >
      <span
        v-if="data.eyebrow"
        class="section-midsubtitle text-dark-gold font-medium mb-1.5! pt-0.5"
      >
        {{ data.eyebrow }}
      </span>

      <h2
        v-if="data.title"
        class="section-smaller-subtitle font-medium text-journey-deep"
      >
        {{ data.title }}
      </h2>
    </div>

    <!-- Video Wrapper with Blur-In Motion Entrance -->
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
        <YoutubePlayer :data="data.video" />
      </div>

      <!-- Optional Natural Caption Below Video -->
      <figcaption
        v-if="data.caption"
        v-motion-micro-up
        :delay="180"
        class="w-full text-left md:text-center mt-3.5 sm:mt-4 section-subparagraph font-medium text-journey-deep/90"
      >
        {{ data.caption }}
      </figcaption>
    </figure>
  </section>
</template>
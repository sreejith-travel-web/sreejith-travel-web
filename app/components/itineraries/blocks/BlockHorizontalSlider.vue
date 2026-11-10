<!-- ~/app/components/itineraries/blocks/BlockHorizontalSlider.vue -->
<script setup lang="ts">
import HorizontalSlider from '~/components/HorizontalSlider.vue'
import type { LightboxOpenPayload } from '~/components/Lightbox.vue'
import type { ItineraryHorizontalSliderBlockSpec } from '~~/server/utils/itinerariesData'

defineProps<{
  data: ItineraryHorizontalSliderBlockSpec
}>()

const emit = defineEmits<{
  (e: 'open-lightbox', payload: LightboxOpenPayload): void
}>()
</script>

<template>
  <div :id="data.sectionId" class="w-full flex flex-col gap-5 sm:gap-6">
    <!-- Optional Header (Eyebrow, Title, Paragraph - all optional) -->
    <div
      v-if="data.eyebrow || data.title || data.paragraph"
      class="flex flex-col gap-2"
    >
      <span
        v-if="data.eyebrow"
        v-motion-micro-up
        class="text-xs font-semibold uppercase tracking-[0.2em] text-dark-gold"
      >
        {{ data.eyebrow }}
      </span>

      <h3
        v-if="data.title"
        v-motion-fade-up
        :delay="60"
        class="font-primary text-2xl sm:text-3xl text-journey-deep leading-snug"
      >
        {{ data.title }}
      </h3>

      <p
        v-if="data.paragraph"
        v-motion-fade-up
        :delay="120"
        class="text-sm sm:text-base text-journey-deep/85 leading-relaxed max-w-3xl"
      >
        {{ data.paragraph }}
      </p>
    </div>

    <!-- Global Variable-Width Horizontal Slider -->
    <HorizontalSlider
      :images="data.images"
      :slider-height="data.sliderHeight ?? 400"
      :inner-rounding="data.innerRounding ?? false"
      :caption="data.caption"
      :captions="data.captions"
      :caption-mob="data.captionMob"
      :caption-pc="data.captionPc"
      @open-lightbox="(payload) => emit('open-lightbox', payload)"
    />
  </div>
</template>
<!-- ~/components/ItinerarySingleView.vue -->
<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import CtaButton from '~/components/CtaButton.vue'
import { computed } from 'vue'
import RelatedItineraries from '~/components/RelatedItineraries.vue'
import type { ItineraryFullRecord, ItineraryMeta } from '~~/server/utils/itinerariesData'

const props = defineProps<{
  record: ItineraryFullRecord & { related?: ItineraryMeta[] }
}>()

const relatedConfig = computed(() => ({
  eyebrow: 'CONTINUE EXPLORING',
  titleLine1: 'Related',
  titleLine2Cursive: 'Journeys.',
  items: props.record.related || []
}))

const heroData = {
  eyebrow: `${props.record.meta.type.toUpperCase()} JOURNEY · ${props.record.meta.days} DAYS`,
  titleMain: props.record.meta.title,
  titleItalic: props.record.meta.region,
  intro: props.record.meta.featuredDescription || props.record.meta.intro,
  imageDesktop: props.record.meta.image,
  imageMobile: props.record.meta.image,
  alt: props.record.meta.alt
}
</script>

<template>
  <div class="overflow-x-hidden bg-bg-light text-primary-light">
    <PageHero :data="heroData" />

    <section data-theme="light" class="section-wrapper bg-bg-light">
      <div class="w-full max-w-5xl flex flex-col gap-12">
        <!-- Back to Collection Breadcrumb -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-divider-light">
          <NuxtLink
            :to="`/itineraries/${record.meta.type}`"
            class="inline-flex items-center gap-2 font-uppercase text-[11px] tracking-[0.2em] uppercase text-journey-deep hover:text-intention-blue active:text-intention-blue transition-colors"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            <span>Back to {{ record.meta.type }} Journeys</span>
          </NuxtLink>

          <div class="flex flex-wrap items-center gap-2">
            <span
              v-for="tag in record.meta.tags"
              :key="tag"
              class="card-tag bg-soft-cream/55 border border-dark-gold/25 text-journey-deep px-2.5 py-1 rounded-xs"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- Modular Itinerary Blocks -->
        <div class="flex flex-col gap-10">
          <article
            v-for="(block, idx) in record.blocks"
            :key="idx"
            class="p-6 sm:p-8 md:p-10 rounded-2xl bg-surface-light border border-journey-deep/10 shadow-2xs flex flex-col md:flex-row gap-8 items-center"
          >
            <div class="w-full md:flex-1 flex flex-col items-start text-left">
              <span
                v-if="block.dayNumber"
                class="card-eyebrow text-dark-gold font-semibold"
              >
                DAY 0{{ block.dayNumber }}
              </span>
              <h2 class="section-smaller-subtitle text-journey-deep mb-3">
                {{ block.title }}
              </h2>
              <p class="section-paragraph text-secondary-light">
                {{ block.description }}
              </p>
            </div>

            <div
              v-if="block.image"
              class="w-full md:w-72 lg:w-80 aspect-4/3 rounded-xl overflow-hidden bg-surface-frosted shrink-0"
            >
              <img
                :src="block.image"
                :alt="block.title"
                width="480"
                height="360"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class="w-full h-full object-cover"
              />
            </div>
          </article>
        </div>

        <!-- Bottom CTA -->
        <div class="p-8 sm:p-12 rounded-2xl bg-soft-blue/25 border border-journey-deep/10 flex flex-col items-center text-center">
          <h3 class="section-subtitle text-journey-deep mb-3">
            Customize This Journey Around Your Pace
          </h3>
          <p class="section-paragraph text-secondary-light max-w-2xl mb-6">
            Every route is shaped privately around your interests, preferred dates, and rhythm of travel.
          </p>
          <div class="hero-cta-wrapper">
            <CtaButton to="/planYourJourney" label="Plan This Journey" variant="light" />
            <CtaButton to="/itineraries" label="Explore All Journeys" variant="light" />
          </div>
        </div>
      </div>
    </section>
    
    <RelatedItineraries
      v-if="relatedConfig.items.length > 0"
      :data="relatedConfig"
    />
  </div>
</template>
<!-- ~/app/pages/planYourJourney.vue -->

<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import CtaButton from '~/components/CtaButton.vue'

const pageData = {
  hero: {
    eyebrow: 'Begin Your Story',
    titleMain: 'Design Your Bespoke',
    titleItalic: 'Indian Odyssey',
    intro: 'Share your curiosities, preferred pace, and travel dreams so we can begin weaving an itinerary tailored exclusively to you.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Plan your custom travel journey in India'
  }
}
</script>

<template>
  <div class="overflow-x-hidden">
    <PageHero :data="pageData.hero" />

    <section
      data-theme="light"
      class="py-24 px-4 md:px-8 lg:px-12 bg-bg-light text-primary-light flex flex-col items-center justify-center text-center min-h-[120vh]"
    >
      <div class="max-w-3xl flex flex-col items-center">
        <span class="font-cursive text-3xl md:text-4xl text-action-blue mb-4">
          Co-Create With Us
        </span>
        <h2 class="text-3xl md:text-5xl font-semibold tracking-tight text-ink-dark mb-6">
          Plan Your Journey (Header switches back to Light Mode)
        </h2>
        <p class="text-base text-secondary-light leading-relaxed mb-8">
          This section will eventually host the interactive Journey Planner questionnaire.
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 250 } }"
          class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-max mx-auto"
        >
          <CtaButton to="/itineraries" label="View Sample Trails" variant="light" />
          <CtaButton to="/contact" label="Direct Inquiry" variant="light" />
        </div>
      </div>
    </section>
  </div>
</template>
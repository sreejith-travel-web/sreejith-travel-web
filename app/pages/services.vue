<!-- ~/app/pages/services.vue -->

<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import CtaButton from '~/components/CtaButton.vue'

const pageData = {
  hero: {
    eyebrow: 'Bespoke Concierge',
    titleMain: 'Seamless Luxury & Access',
    titleItalic: 'Tailored To Your Rhythm',
    intro: 'From private heritage access and scholar-led walks to boutique hideaways, every detail is orchestrated with quiet precision.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Luxury travel design services'
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
          What We Offer
        </span>
        <h2 class="text-3xl md:text-5xl font-semibold tracking-tight text-ink-dark mb-6">
          Services Page (Header switches back to Light Mode)
        </h2>
        <p class="text-base text-secondary-light leading-relaxed mb-8">
          This section will eventually receive the Services JSON payload.
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 250 } }"
          class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-max mx-auto"
        >
          <CtaButton to="/planYourJourney" label="Plan Your Journey" variant="light" />
          <CtaButton to="/itineraries" label="Explore Itineraries" variant="light" />
        </div>
      </div>
    </section>
  </div>
</template>
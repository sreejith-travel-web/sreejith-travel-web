<!-- ~/app/pages/itineraries.vue -->

<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import CtaButton from '~/components/CtaButton.vue'

const pageData = {
  hero: {
    eyebrow: 'Curated Collections',
    titleMain: 'Signature Cultural Trails',
    titleItalic: 'Across Unseen India',
    intro: 'Handcrafted itineraries designed to immerse you in ancient rituals, culinary secrets, and serene landscapes at your own pace.',
    imageDesktop: '/images/home/hero.jpg',
    imageMobile: '/images/home/hero.jpg',
    alt: 'Bespoke travel itineraries in India'
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
          Bespoke Routes
        </span>
        <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-ink-dark mb-6">
          Itineraries Page (Header switches back to Light Mode)
        </h2>
        <p class="text-base text-secondary-light leading-relaxed mb-8">
          This section will eventually receive the Itineraries listing JSON payload.
        </p>

        <div
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 250 } }"
          class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-max mx-auto"
        >
          <CtaButton to="/planYourJourney" label="Customize A Trail" variant="light" />
          <CtaButton to="/contact" label="Speak With An Expert" variant="light" />
        </div>
      </div>
    </section>
  </div>
</template>
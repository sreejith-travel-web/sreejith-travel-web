<!-- ~/app/pages/index.vue -->

<script setup lang="ts">
import HomeHero from '~/components/HomeHero.vue'

const pageData = {
  hero: {
    mode: 'slideshow' as const,
    autoplay: false,
    autoplayIntervalMs: 8500,
    subtitleText: 'Regenerative Travel Experiences',
    headingLine1: 'Designing Cultural Immersive Travel Experiences in India',
    headingLine2Italic: 'Inspired by People, Places & Stories',
    description: 'Designing luxury bespoke journeys bringing together meaningful encounters, rare access, and authentic stories that conventional tourism simply cannot offer.',
    slides: [
      {
        type: 'video' as const,
        videoId: 'GCYg1HQFQKY',
        // User forgot to upload images here! The component will catch it.
        // imageDesktop: '/images/home/hero.jpg',
        // imageMobile: '/images/home/hero-mobile.jpg',
        alt: 'Scenic river boating & Kerala backwaters signature tour'
      },
      {
        type: 'image' as const,
        imageDesktop: '/images/home/hero.jpg',
        imageMobile: '/images/home/hero.jpg',
        alt: 'Ancient temples of Kerala cultural heritage journey'
      },
      {
        type: 'image' as const,
        imageDesktop: '/images/home/hero.jpg',
        imageMobile: '/images/home/hero.jpg',
        alt: 'Lush natural hill regions and bespoke local experiences'
      }
    ]
  },

  // Future sections will be populated here in the same payload
  // about: { ... },
}
</script>

<template>
  <div class="overflow-x-hidden">
    <!-- Pass the hero chunk of the JSON directly into the component -->
    <HomeHero :data="pageData.hero" />

    <!-- Placeholder for the next section -->
    <section
      data-theme="light"
      class="py-24 px-4 md:px-8 lg:px-12 bg-bg-light text-primary-light flex flex-col items-center justify-center text-center min-h-[120vh]"
    >
      <div class="max-w-3xl flex flex-col items-center">
        <span class="font-cursive text-3xl md:text-4xl text-action-blue mb-4">
          Capturing India
        </span>
        <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-ink-dark mb-6">
          Light Section (Header switches back to Ink Mode)
        </h2>
        <p class="text-base text-secondary-light leading-relaxed mb-8">
          This section will eventually receive its own chunk of pageData.
        </p>
        
        <!-- CTAs -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 250 } }"
          class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[90vw] will-change-transform transition-transform duration-700 ease-out"
        >
          <CtaButton to="/itineraries" label="Explore Itineraries" variant="light" />
          <CtaButton to="/planYourJourney" label="Plan Your Journey" variant="light" />
        </div>
      </div>
    </section>
  </div>
</template>
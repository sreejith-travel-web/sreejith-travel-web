<!-- ~/app/components/HomeCategories.vue -->
<script setup lang="ts">
export interface CategoryItem {
  id: string
  title: string
  description?: string
  image: string
  alt: string
  to: string
}

defineProps<{
  data: {
    eyebrow: string
    titleLine1: string
    titleLine2Cursive: string
    subtitle: string
    bottomQuote: string
    ctaLabel: string
    ctaTo: string
    items: CategoryItem[]
  }
}>()
</script>

<template>
  <section
    data-theme="light"
    class="section-wrapper overflow-x-clip bg-bg-light text-primary-light px-3"
  >
    <div class="w-full max-w-6xl flex flex-col items-center">
      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full max-w-4xl flex flex-col items-center text-center mb-8 md:mb-12">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-motion-fade-up
          :delay="90"
          class="section-title-wrapper drop-shadow-none!"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <p
          v-motion-fade-up
          :delay="170"
          class="text-secondary-light max-w-3xl section-paragraph"
        >
          {{ data.subtitle }}
        </p>
      </div>

      <!-- 2. 1:1 SQUARE CATEGORY MATRIX (2x3 Mobile/Tablet -> 3x2 Desktop) -->
      <div class="flex flex-wrap justify-center gap-2 2xs:gap-3 xs:gap-4 sm:gap-6 lg:gap-7 xl:gap-8 w-full mb-8 md:mb-12">
        <NuxtLink
          v-for="(item, index) in data.items"
          :key="item.id"
          :to="item.to"
          v-motion-atelier-card
          :delay="120 + index * 75"
          class="group relative isolate w-[calc(50%-0.375rem)] [@media(min-width:350px)]:w-full max-w-40 xs:max-w-50 md:max-w-56 lg:max-w-70 xl:max-w-75 aspect-square overflow-hidden rounded-2xl bg-journey-deep border border-journey-deep/10 shadow-xs hover:shadow-md transition-shadow duration-500 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-gold"
        >
          <!-- Strict Lazy 1:1 Image -->
          <img
            :src="item.image"
            :alt="item.alt"
            width="600"
            height="600"
            loading="lazy"
            draggable="false"
            decoding="async"
            fetchpriority="low"
            class="absolute pointer-events-none inset-0 w-full h-full object-cover object-center transition-transform duration-600 ease-editorial group-hover:scale-106 group-active:scale-105"
          />

          <!-- Bottom-Weighted Contrast Scrim -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 z-10 bg-linear-to-tl from-journey-deep/82 group-hover:from-journey-deep/52 group-active:from-journey-deep/2 via-journey-deep/45 group-hover:via-journey-deep/25 group-active:via-journey-deep/25  to-journey-deep/18 group-hover:to-journey-deep/10 group-active:to-journey-deep/10 transition-opacity duration-500 group-hover:opacity-90 group-active:opacity-90"
          />

          <!-- Subtle Inner Gallery Hairline on Hover -->
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-1.5 sm:inset-2 md:inset-2.5 lg:inset-3 xl:inset-3.5 2xl:inset-4 z-20 rounded-xl border border-surface-light/0 group-hover:border-warm-gold/40 group-active:border-warm-gold/40 transition-colors duration-500 ease-editorial"
          />

          <!-- Signature Warm-Gold Circular Arrow Cue (Top-Right on Compact Mobile, Bottom-Right on xs+) -->
          <div
            class="itinerary-cta-circle pointer-events-none absolute hidden xs:block top-4 sm:top-5.5 md:top-6 lg:top-7 right-4 sm:right-5.5 md:right-6 lg:right-7 z-20 w-8! h-8! xs:w-9! xs:h-9! sm:w-10! sm:h-10! lg:w-11! lg:h-11! text-warm-gold drop-shadow-xs transition-transform duration-500 ease-editorial group-hover:scale-108 group-active:scale-95"
          >
            <svg
              class="w-full h-full overflow-visible"
              viewBox="0 0 44 44"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle cx="22" cy="22" r="20.5" class="itinerary-cta-ring" />
              <g
                class="transition-transform duration-500 ease-editorial"
                stroke-width="1.75"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 29L29 15" />
                <path d="M21 15h8v8" />
              </g>
            </svg>
          </div>

          <!-- Title + Expanding GPU Gold Accent Line + Paragraph -->
          <div class="pointer-events-none absolute inset-x-0 inset-y-0 xs:inset-y-auto xs:bottom-0 z-20 p-3.5 sm:p-4 md:p-4.5 lg:p-5 xl:p-5.5 2xl:p-6 flex flex-col items-center xs:items-start justify-center xs:justify-end text-left">
            <h3 class="card-title text-surface-light mb-2 text-center xs:text-left transition-transform duration-500 ease-editorial group-hover:-translate-y-0.5 group-active:-translate-y-0.5">
              {{ item.title }}
            </h3>
            <div
              aria-hidden="true"
              class="w-10 sm:w-12 h-0.5 bg-warm-gold rounded-full origin-center xs:origin-left scale-x-40 group-hover:scale-x-100 group-active:scale-x-100 transition-transform duration-500 ease-editorial"
            />
            <!-- Paragraph (Left Column) -->
            <p class="col-span-1 hidden xs:line-clamp-3 text-center xs:text-left text-surface-light/95 card-paragraph mt-2 xs:mt-2.5 sm:mt-3 md:mt-4">
              {{ item.description }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- 3. BOTTOM EDITORIAL QUOTE -->
      <div
        v-motion-fade-up
        class="flex flex-col items-center text-center px-4 mb-8 md:mb-10 w-full"
      >
        <p class="px-4 lg:max-w-3xl xl:max-w-4xl text-darker-gold section-quote">
          {{ data.bottomQuote }}
        </p>
      </div>

      <!-- 4. BOTTOM CENTERED CTA BUTTON -->
      <div
        v-motion-fade-up
        :delay="90"
        class="flex justify-center w-full"
      >
        <CtaButton
          :to="data.ctaTo || '/about'"
          :label="data.ctaLabel || 'Explore My Story'"
          variant="light"
        />
      </div>
    </div>
  </section>
</template>
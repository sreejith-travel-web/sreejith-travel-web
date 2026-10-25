<!-- ~/app/components/HomeCategories.vue -->
<script setup lang="ts">
export interface CategoryItem {
  id: string
  title: string
  description: string
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
  <section class="text-primary-light overflow-hidden section-wrapper block">
    
    <div class="relative w-full flex flex-col items-center">
      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full flex flex-col items-center text-center mb-6 md:mb-8">
        
        <!-- Eyebrow with flanking lines -->
        <div 
          v-motion-fade-up
          class="eyebrow-wrapper"
        >
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <!-- Main Title -->
        <h2 
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <!-- Subtitle & Description -->
        <div 
          v-motion-fade-up
          :delay="200"
          class="flex flex-col items-center will-change-transform"
        >
          <p
            class="text-journey-deep/90 section-paragraph">
            {{ data.subtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Masonry/Grid (1/6 -> 2/3 -> 3/2 Matrix) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 py-4 px-4 sm:px-6 md:px-8 xl:px-12 max-w-[1600px] mx-auto mb-2 md:mb-4">
      <NuxtLink
        v-for="(item, index) in data.items"
        :key="item.id"
        :to="item.to"
        v-motion-stagger-card
        :delay="index * 120"
        class="group relative isolate w-full overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer bg-journey-deep shadow-sm aspect-2.5/1 sm:aspect-[1.9/1]"
      >
        <!-- Background Image (Lazy Loaded & Sized properly) -->
        <img
          :src="item.image"
          :alt="item.alt"
          width="480"
          height="300"
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-105 group-active:scale-[0.98]"
        />

        <!-- Dark Scrim for pure white text readability -->
        <div class="absolute inset-0 bg-linear-to-t from-journey-deep/95 via-journey-deep/40 to-journey-deep/20 transition-colors duration-500 group-hover:bg-journey-deep/50 z-10"></div>

        <!-- Overlay Content -->
        <div class="absolute inset-0 z-20 p-3.5 sm:p-4.5 lg:p-6 flex items-end">
          <!-- Top Row (Index) -->
          <div class="absolute right-3.5 top-3.5 sm:right-4.5 sm:top-4.5 lg:right-6 lg:top-6 flex justify-end">
            <span class="text-surface-light/80 font-primary font-medium text-[10px] sm:text-xs tracking-widest">{{ item.id }}</span>
          </div>

          <!-- Bottom Row (Grid Layout) -->
          <div class="w-full mt-auto grid grid-cols-[1fr_auto] items-end gap-x-2 sm:gap-x-3 gap-y-1 sm:gap-y-1.5">
            
            <!-- Title (Spans full width above paragraph & button) -->
            <h3 class="col-span-2 text-surface-light card-title mb-0">
              {{ item.title }}
            </h3>

            <!-- Paragraph (Left Column) -->
            <p class="col-span-1 hidden 2xs:line-clamp-2 text-surface-light/85 pr-2 sm:pr-4 card-paragraph">
              {{ item.description }}
            </p>

            <!-- Square Button (Right Column, Bottom-Right Corner) -->
            <div class="select-none col-span-1 justify-self-end shrink-0 flex items-center justify-center border border-surface-light/40 px-1.5 sm:px-2.5 h-7 sm:h-8 rounded-sm text-[8px] xs:text-[9px] sm:text-[10px] md:text-[11px] font-uppercase tracking-widest text-surface-light uppercase transition-all duration-300 group-hover:border-surface-light group-hover:bg-surface-light/10 group-active:bg-surface-light/10 gap-1.5 group-active:scale-90">
              <span class="pt-0.75 leading-none">DISCOVER</span> 
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>
            
          </div>

        </div>
      </NuxtLink>
    </div>

    <!-- Bottom Quote & CTA -->
    <div 
      v-motion-fade-up
      class="flex flex-col items-center text-center mt-6 md:mt-8 px-4"
    >
      <!-- Bottom Quote -->
      <p class="px-4 mb-10 lg:max-w-3xl xl:max-w-4xl text-darker-gold section-quote">
        {{ data.bottomQuote }}
      </p>
    </div>

    <!-- 3. BOTTOM CENTERED CTA BUTTON -->
    <div
      v-motion-fade-up
      :delay="100"
      class="flex justify-center w-full will-change-transform"
    >
      <CtaButton
        :to="data.ctaTo || '/about'"
        :label="data.ctaLabel || 'Explore My Story'"
        variant="light"
      />
    </div>

  </section>
</template>
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
  <section class="relative w-full bg-bg-light text-primary-light py-12 sm:py-16 md:py-20 xl:py-24 px-2 2xs:px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 overflow-hidden">
    
    <div class="relative w-full flex flex-col items-center">
      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full flex flex-col items-center text-center mb-6 md:mb-8">
        
        <!-- Eyebrow with flanking lines -->
        <div 
          v-motion
          :initial="{ opacity:0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 700, ease: [0.22, 1, 0.36, 1]} }"
          :intersection="{ rootMargin: '0px 0px -30% 0px' }"
          class="flex items-center justify-center w-full max-w-full px-2 mb-4 md:mb-5 max-[321px]:flex-wrap max-[321px]:gap-y-1 will-change-transform transition-transform duration-700 ease-out"
        >
          <div class="h-0.5 mb-0.5 rounded-md bg-dark-gold/70 grow max-w-5 md:max-w-12 shrink-2" />
          <h2 class="font-uppercase font-medium mx-2 md:mx-4 text-[10px] xs:text-[11px] sm:text-xs lg:text-[13px] tracking-[0.25em] md:tracking-[0.3em] text-journey-deep uppercase">
            {{ data.eyebrow }}
          </h2>
          <div class="h-0.5 mb-0.5 rounded-md bg-dark-gold/70 grow max-w-5 md:max-w-12 shrink-2" />
        </div>

        <!-- Main Title -->
        <h2 
          v-motion
          :initial="{ opacity:0, y: 30, filter: 'blur(3px)' }"
          :visible-once="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 700, ease: [0.22, 1, 0.36, 1], delay: 100 } }"
          :intersection="{ rootMargin: '0px 0px -30% 0px' }"
          class="flex flex-col items-center gap-1 mb-8 will-change-transform"
        >
          <span class="font-primary font-normal text-journey-deep text-[28px] xs:text-[34px] sm:text-[40px] md:text-[46px] leading-tight tracking-tight uppercase">
            {{ data.titleLine1 }}
          </span>
          <span class="font-cursive text-dark-gold text-[40px] xs:text-[48px] sm:text-[56px] md:text-[64px] leading-[0.8] pr-4">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <!-- Subtitle & Description -->
        <div 
          v-motion
          :initial="{ opacity:0, y: 30 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 700, ease: [0.22, 1, 0.36, 1], delay: 200 } }"
          :intersection="{ rootMargin: '0px 0px -30% 0px' }"
          class="flex flex-col items-center will-change-transform"
        >
          <p
            class="font-primary font-normal text-journey-deep/90 text-[14px] xs:text-[15px] md:text-[16px] lg:text-[17px] 2xl:text-[18px] tracking-wide leading-[1.6] max-w-2xl lg:max-w-3xl px-4">
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
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, delay: index * 100, ease: [0.22, 1, 0.36, 1] } }"
        :intersection="{ rootMargin: '0px 0px -30% 0px' }"
        class="group relative isolate w-full overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer bg-journey-deep shadow-sm aspect-3/1 sm:aspect-2/1"
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
        <div class="absolute inset-0 z-20 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
          <!-- Top Row (Index) -->
          <div class="flex justify-end">
            <span class="text-surface-light/80 font-primary font-medium text-[10px] sm:text-xs tracking-widest">{{ item.id }}</span>
          </div>

          <!-- Bottom Row (Typography & Button) -->
          <div class="flex items-end justify-between gap-3 mt-auto">
            <!-- Text Content -->
            <div class="flex flex-col">
              <h3 class="font-primary text-surface-light text-[16px] 2xs:text-[18px] xs:text-[19px] sm:text-[20px] md:text-[21px] lg:text-[23px] xl:text-[25px] font-medium leading-snug mb-1.5 drop-shadow-sm line-clamp-2">
                {{ item.title }}
              </h3>
              <!-- Hidden on ultra-micro devices to protect aspect ratio 3:1 -->
              <p class="hidden 2xs:block text-surface-light/85 font-primary text-[10px] sm:text-[11px] md:text-xs line-clamp-1 sm:line-clamp-2 max-w-[85%] sm:max-w-[80%] drop-shadow-sm">
                {{ item.description }}
              </p>
            </div>

            <!-- Pill Button -->
            <div class="shrink-0 flex items-center border border-surface-light/40 px-2 py-1.25 sm:px-3 sm:py-1.75 text-[9px] xs:text-[10px] sm:text-[11px] md:text-[12px] font-uppercase tracking-widest text-surface-light uppercase transition-all duration-300 group-hover:border-surface-light group-hover:bg-surface-light/10 gap-1.5 group-active:scale-90">
              <span class="pt-0.5">DISCOVER</span> 
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Bottom Quote & CTA -->
    <div 
      v-motion
      :initial="{ opacity:0, y: 30 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, ease: [0.22, 1, 0.36, 1]} }"
      :intersection="{ rootMargin: '0px 0px -30% 0px' }"
      class="flex flex-col items-center mt-6 md:mt-8 px-4"
    >
      <!-- Bottom Quote -->
      <p class="font-quote italic px-4 mb-10 font-semibold lg:max-w-3xl xl:max-w-4xl text-darker-gold text-[20px] 2xs:text-[21px] xs:text-[22px] sm:text-[23px] lg:text-[24px] xl:text-[25px] leading-[1.45] tracking-[0.01em] will-change-transform">
        {{ data.bottomQuote }}
      </p>
    </div>
    <!-- 3. BOTTOM CENTERED CTA BUTTON -->
    <div
      v-motion
      :initial="{ opacity:0, y: 30 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 500, ease: [0.22, 1, 0.36, 1], delay: 100 } }"
      :intersection="{ rootMargin: '0px 0px -30% 0px' }"
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
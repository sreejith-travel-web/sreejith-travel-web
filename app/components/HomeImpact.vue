<script setup lang="ts">
import { ref } from 'vue'

export interface ImpactItem {
  id: string
  shortTitle: string
  longTitle: string
  intro: string
  img: string
  alt: string
  url: string
}

export interface HomeImpactConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  items: ImpactItem[]
  bottomCta: {
    label: string
    to: string
  }
}

defineProps<{
  data: HomeImpactConfig
}>()

const activeIndex = ref(0)
</script>

<template>
  <section
    data-theme="light"
    class="bg-surface-light text-primary-light overflow-hidden section-wrapper"
  >
    <div class="relative z-10 w-full max-w-360 flex flex-col items-center">
      
      <!-- 1. HEADER (Fade Up, Zero Blur) -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-10 md:mb-14 xl:mb-16">
        
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/60 eyebrow-border" />
          <h2 class="text-secondary-light eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/60 eyebrow-border" />
        </div>

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

        <p
          v-motion-fade-up
          :delay="200"
          class="text-secondary-light max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. UNIFIED RESPONSIVE DOM (Grid List & Image Canvas) -->
      <div class="relative w-full flex flex-col justify-center md:flex-row gap-6 md:gap-8 lg:gap-16 xl:gap-24 mb-12 md:mb-16">
        
        <!-- A. The Item List (Mobile: Scroll Snap Row / Desktop: Vertical List) -->
        <div 
          v-motion-fade-up 
          :initial="{ opacity: 0, filter: 'blur(5px)', scale: 0.98 }"
          :visible-once="{ opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 300 } }"
          class="w-full md:w-5/12 lg:w-5/12 flex overflow-x-auto md:overflow-visible scroll-snap-x mandatory md:scroll-snap-none gap-4 md:gap-2 px-4 pb-6 md:pb-0 md:px-0 hide-scrollbar md:flex-col shrink-0 z-20"
        >
          
          <component
            :is="item.url ? 'NuxtLink' : 'div'"
            v-for="(item, idx) in data.items" 
            :key="item.id"
            :to="item.url"
            @mouseenter="activeIndex = idx"
            class="group relative scroll-snap-align-start shrink-0 w-[85vw] md:w-full aspect-square md:aspect-auto rounded-2xl md:rounded-none overflow-hidden md:overflow-visible shadow-md md:shadow-none bg-journey-deep md:bg-transparent md:py-4 cursor-pointer"
          >
            
            <!-- MOBILE ONLY: Inline Image & Gradient Overlay -->
            <img 
              :src="item.img" 
              :alt="item.alt" 
              width="750"
              height="500"
              class="md:hidden absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" 
              loading="lazy" 
            />
            <div class="md:hidden absolute inset-0 bg-linear-to-t from-journey-deep/95 via-journey-deep/40 to-transparent z-10 pointer-events-none" />

            <!-- MOBILE ONLY: Card Content (Always Visible) -->
            <div class="md:hidden absolute inset-0 p-6 flex flex-col justify-end items-start z-20 pointer-events-none">
              <h3 class="section-smaller-subtitle text-surface-light mb-3 whitespace-pre-line">
                {{ item.longTitle }}
              </h3>
              <!-- Uses warm-gold because it sits on a dark overlay -->
              <div class="w-8 h-0.5 bg-warm-gold mb-4" />
              <p class="section-subparagraph text-surface-light/90">
                {{ item.intro }}
              </p>
            </div>

            <!-- DESKTOP ONLY: Interactive Text List Item -->
            <div class="hidden md:flex items-center w-full">
              <!-- Pointer Title -->
              <span 
                class="section-midsubtitle mb-0 transition-colors duration-500 shrink-0"
                :class="activeIndex === idx ? 'text-journey-deep' : 'text-secondary-light/50 group-hover:text-journey-deep/80 group-active:text-journey-deep/80'"
              >
                {{ item.shortTitle }}
              </span>
              
              <!-- Animated Dark Gold Line & Dot -->
              <div class="grow ml-4 lg:ml-6 flex items-center h-0.5 relative">
                <div 
                  class="absolute left-0 h-full bg-warm-gold transition-all duration-700 ease-editorial"
                  :class="activeIndex === idx ? 'w-full' : 'w-0'"
                >
                  <div 
                    class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-dark-gold transition-opacity duration-300 delay-100"
                    :class="activeIndex === idx ? 'opacity-100' : 'opacity-0'"
                  />
                </div>
              </div>
            </div>

          </component>
        </div>

        <!-- B. DESKTOP ONLY: 4:3 Image Overlay Container -->
        <div 
          v-motion-fade-up 
          :delay="400"
          class="hidden md:block w-7/12 lg:w-7/12 relative rounded-2xl overflow-hidden shadow-lg aspect-4/3 bg-journey-deep shrink-0 border border-border-light/50 z-10"
        >
          <NuxtLink 
            v-for="(item, idx) in data.items" 
            :key="`desktop-img-${item.id}`"
            :to="item.url"
            class="absolute inset-0 transition-opacity duration-1000 ease-editorial group"
            :class="activeIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'"
          >
            <!-- Crossfading Image -->
            <img 
              :src="item.img" 
              :alt="item.alt" 
              width="750"
              height="500"
              class="absolute inset-0 w-full h-full object-cover transform transition-transform duration-[4s] ease-out group-hover:scale-105 group-active:scale-105" 
              :class="activeIndex === idx ? 'scale-105' : 'scale-100'" 
              loading="lazy" 
            />
            
            <!-- Dark Gradient Tint -->
            <div 
              class="absolute inset-0 bg-linear-to-t from-journey-deep/95 via-journey-deep/40 to-transparent transition-opacity duration-700"
              :class="activeIndex === idx ? 'opacity-100 delay-200' : 'opacity-0'"
            />

            <!-- Delayed Content Overlay -->
            <div 
              class="absolute inset-x-0 bottom-0 p-8 lg:p-12 xl:p-14 flex flex-col justify-end items-start transform transition-all duration-700 ease-editorial"
              :class="activeIndex === idx ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-8 opacity-0'"
            >
              <h3 class="card-title text-surface-light mb-4 whitespace-pre-line">
                {{ item.longTitle }}
              </h3>
              
              <!-- Warm Gold Divider Line inside the dark overlay -->
              <div 
                class="w-10 h-0.5 bg-warm-gold transform origin-left transition-transform duration-700 mb-5"
                :class="activeIndex === idx ? 'scale-x-100 delay-600' : 'scale-x-0'"
              />
              
              <p class="card-paragraph text-surface-light/90 max-w-md">
                {{ item.intro }}
              </p>
            </div>
          </NuxtLink>
        </div>

      </div>

      <!-- 3. BOTTOM CTA -->
      <div v-motion-fade-up :delay="500" class="hero-cta-wrapper">
        <CtaButton
          :to="data.bottomCta.to"
          :label="data.bottomCta.label"
          variant="light"
        >
          {{ data.bottomCta.label }}
        </CtaButton>
      </div>

    </div>
  </section>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Webkit */
}

.scroll-snap-x {
  scroll-snap-type: x mandatory;
}
.scroll-snap-align-start {
  scroll-snap-align: center;
}
</style>
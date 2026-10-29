<!-- ~/app/components/HomeWayaToWork.vue -->
<script setup lang="ts">
export interface WorkCard {
  eyebrow: string
  title: string
  paragraphs: string[]
  cta: {
    label: string
    to: string
  }
  bgClass: string
}

export interface HomeWaysToWorkConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  cards: WorkCard[]
  icons: string[] // Just passing the labels from data payload
  bottomCta: {
    label: string
    to: string
  }
}

defineProps<{
  data: HomeWaysToWorkConfig
}>()

// The exact 5 SVG paths mapped in order (Corporate, Educational, Consulting, Boutique, NGOs)
const iconPaths = [
  "m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25",
  "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  "M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z",
  "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
]
</script>
<template>
  <section
    data-theme="light"
    class="text-primary-light overflow-hidden section-wrapper"
  >
    <div class="relative z-10 w-full max-w-360 flex flex-col items-center">
      
      <!-- 1. HEADER (All Fade Up, Zero Blur) -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-10 md:mb-14 xl:mb-16">
        
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
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
          class="text-journey-deep/90 max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. THE PARTNER CARDS (1-col on Mobile/Tablet, 2-col on Desktop) -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
        <div
          v-for="(card, index) in data.cards"
          :key="card.title"
          v-motion-stagger-card
          :delay="250 + (index * 120)"
          class="rounded-2xl p-8 md:p-10 xl:p-12 flex flex-col items-start text-left shadow-sm"
          :class="card.bgClass"
        >
          <!-- Card Eyebrow with fixed left underline -->
          <div class="flex flex-col items-start gap-2 mb-4 sm:mb-6 w-full">
            <span class="text-journey-deep/95 section-midsubtitle mb-0">
              {{ card.eyebrow }}
            </span>
            <div class="w-8 h-px bg-dark-gold/60" aria-hidden="true" />
          </div>

          <!-- Card Title (Using specific smaller-subtitle token) -->
          <h3 class="text-journey-deep/90 section-smaller-subtitle mb-4 sm:mb-5">
            {{ card.title }}
          </h3>

          <!-- Card Paragraphs -->
          <div class="flex-1 flex flex-col gap-4 mb-8 sm:mb-10">
            <p
              v-for="(para, pIdx) in card.paragraphs"
              :key="pIdx"
              class="text-journey-deep/85 section-subparagraph"
            >
              {{ para }}
            </p>
          </div>

          <!-- Card CTA -->
          <div class="mt-auto">
            <!-- Square Button (Right Column, Bottom-Right Corner) -->
            <NuxtLink :to="card.cta.to" class="group select-none">
              <div class="col-span-1 justify-self-end shrink-0 flex items-center justify-center border-2 border-journey-deep/30 px-2.5 sm:px-3 h-9 sm:h-10 rounded-sm text-[9px] 2xs:text-[10px] md:text-[11px] font-uppercase tracking-widest text-journey-deep uppercase transition-all duration-300 group-hover:border-journey-deep group-active:border-journey-deep gap-2 group-active:scale-96">
                <span class="pt-0.75 leading-none">{{ card.cta.label }}</span> 
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- 3. THE COMPLEX RESPONSIVE ICONS GRID -->
      <div
        class="w-full max-w-410 mx-auto flex flex-wrap justify-center mb-8 sm:mb-10 lg:mb-14 gap-x-3 gap-y-8 max-[480px]:gap-y-4"
      >
        <div
          v-for="(label, index) in data.icons"
          :key="label"
          v-motion-stagger-card
          :delay="400 + (index * 80)"
          class="relative flex rounded-lg border-2 cursor-default border-border-light p-2 hover:border-action-blue active:border-action-blue duration-500 ease-editorial "
          :class="[
            'gap-3 md:gap-4',
            
            // 0-480 (1x5): Left Icon
            'w-full flex-row items-center justify-start text-left max-[480px]:w-full',
            
            // 481-767 (2-2-1): Center Icon
            'xs:max-md:w-[45%] xs:max-md:flex-col xs:max-md:items-center xs:max-md:justify-center xs:max-md:text-center',
            
            // 768-1023 (md to lg): 3-2 Center Icon
            'md:max-lg:w-[30%] md:max-lg:flex-col md:max-lg:items-center md:max-lg:justify-center md:max-lg:text-center',
            
            // 1024-1279 (lg to xl): 3-2 Left Icon
            'lg:max-xl:w-[30%] lg:max-xl:flex-row lg:max-xl:items-center lg:max-xl:justify-start lg:max-xl:text-left',
            
            // 1280-1535 (xl to 2xl): 5x1 Center Icon
            'xl:max-2xl:w-[18%] xl:max-2xl:flex-col xl:max-2xl:items-center xl:max-2xl:justify-center xl:max-2xl:text-center',
            
            // 1536+ (2xl): 5x1 Left Icon
            '2xl:w-[18%] 2xl:flex-row 2xl:items-center 2xl:justify-start 2xl:text-left'
          ]"
        >

          <!-- The Icon (Mapped precisely to the script setup paths) -->
          <div class="w-10 h-10 md:w-11 md:h-11 shrink-0 flex items-center justify-center text-dark-gold">
            <svg class="w-full h-full" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="iconPaths[index]" />
            </svg>
          </div>

          <!-- 2px Vertical Divider (Dynamically hidden on row wrapping thresholds) -->
          <div
            class="w-0.5 bg-border-light"
            :class="[
              // Vertically Centered Alignment (adapts to both flex-row and flex-col perfectly)
              'h-8 md:h-10',
              
              // Wrapping Visibility Logic
              'xs:max-md:hidden',
              'md:max-lg:hidden',
              'xl:max-2xl:hidden'
            ]"
            aria-hidden="true"
          />
          
          <!-- The Label -->
          <span class="text-journey-deep/90 section-subparagraph line-clamp-2">
            {{ label }}
          </span>
        </div>
      </div>

      <!-- 4. BOTTOM CTA -->
        <div v-motion-fade-up :delay="500" class="flex justify-center w-full will-change-transform">
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
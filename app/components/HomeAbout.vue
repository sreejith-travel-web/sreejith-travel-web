<!-- ~/app/components/HomeAbout.vue -->
<script setup lang="ts">
import CtaButton from '~/components/CtaButton.vue'

export interface AboutStat {
  value: string
  subtitle: string
  description: string
}

export interface HomeAboutContent {
  greeting: string
  name: string
  designations: string[]
  paragraph: string
  quoteText: string
  signatureImage: string
  portraitImage: string
  portraitAlt: string
  stats: AboutStat[]
  ctaLabel?: string
  ctaTo?: string
}

defineProps<{
  data: HomeAboutContent
}>()
</script>

<template>
  <section
    data-theme="light"
    aria-label="About Sreejith"
    class="w-full bg-bg-light text-primary-light py-12 sm:py-16 md:py-20 xl:py-24 px-4 2xs:px-5 xs:px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 2xl:px-24 flex justify-center"
  >
    <div class="w-full max-w-[1640px] mx-auto flex flex-col items-center">
      
      <!-- 1. TOP CENTERED HEADER (Title + Designations) -->
      <header class="w-full flex flex-col items-center text-center mb-4 sm:mb-6 lg:mb-8 xl:mb-10">
        <h2
          v-motion
          :initial="{ opacity:0, y: 30, filter: 'blur(4px)' }"
          :visible-once="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 750, ease: [0.22, 1, 0.36, 1], delay: 100 } }"
          class="leading-[1.2] tracking-normal mb-3 md:mb-4 will-change-transform"
        >
          <span class="font-quote italic font-medium text-action-blue text-[28px] 2xs:text-[30px] xs:text-[34px] sm:text-[38px] md:text-[42px] lg:text-[46px] xl:text-[48px] mr-2">
            {{ data.greeting }}
          </span>
          <span class="font-primary font-normal text-journey-deep text-[26px] 2xs:text-[28px] xs:text-[32px] sm:text-[36px] md:text-[40px] lg:text-[44px] xl:text-[48px]">
            {{ data.name }}
          </span>
        </h2>

        <!-- Designations Row -->
        <div
          v-motion
          :initial="{ opacity:0, y: 26 }"
          :visible-once="{ opacity: 1, y: 0, transition: { duration: 750, ease: [0.22, 1, 0.36, 1], delay: 180 } }"
          class="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-y-1.5 sm:gap-x-3 max-w-[92vw] will-change-transform"
        >
          <template v-for="(role, index) in data.designations" :key="index">
            <span class="font-uppercase text-[10px] 2xs:text-[11px] sm:text-[12px] lg:text-[13px] tracking-[0.22em] md:tracking-[0.25em] text-intention-gold font-medium uppercase">
              {{ role }}
            </span>
            <span
              v-if="index !== data.designations.length - 1"
              class="hidden sm:inline-block text-intention-gold text-[12px] leading-none select-none"
              aria-hidden="true"
            >
              •
            </span>
          </template>
        </div>
      </header>

      <!-- 2. MAIN CONTENT GRID -->
      <!-- Mobile (<768px): 1 col stacked | Tablet (768-1279px): 2 cols top, stats full row below | Desktop (1280px+): 3 cols single row -->
      <div class="w-full grid grid-cols-1 md:grid-cols-12 gap-y-4 md:gap-x-8 lg:gap-x-12 xl:gap-x-12 2xl:gap-x-16 items-center">
        
        <!-- COLUMN A: Narrative, Quote & Golden Signature -->
        <div class="col-span-1 md:col-span-6 xl:col-span-4 order-1 flex flex-col items-start text-left">
          <p
            v-motion
            :initial="{ opacity:0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 240 } }"
            class="font-primary text-center md:text-left text-journey-deep/90 text-[14px] 2xs:text-[15px] xs:text-[16px] md:text-[16px] lg:text-[17px] xl:text-[17px] 2xl:text-[18px] tracking-wide leading-[1.6] font-normal mb-7 md:mb-8 will-change-transform"
          >
            {{ data.paragraph }}
          </p>

          <!-- Quote with 3px Left Border -->
          <blockquote
            v-motion
            :initial="{ opacity:0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 290 } }"
            class="border-l-[3px] border-intention-gold pl-4 xs:pl-5 md:pl-6 py-0.5 mb-6 md:mb-7 will-change-transform"
          >
            <p class="font-quote italic font-semibold text-journey-deep text-[19px] 2xs:text-[20px] xs:text-[21px] sm:text-[22px] lg:text-[23px] xl:text-[24px] leading-[1.55] tracking-[0.01em]">
              “{{ data.quoteText }}”
            </p>
          </blockquote>
        </div>

        <!-- COLUMN B: Center Watercolor Cutout Image (Consistent 4:5 Ratio, No Overflow Hidden, No Box Shadow) -->
        <div
          v-motion
          :initial="{ opacity:0, y: 34, filter: 'blur(4px)' }"
          :visible-once="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 900, ease: [0.22, 1, 0.36, 1], delay: 360 } }"
          class="col-span-1 md:col-span-6 xl:col-span-4 order-2 flex flex-col items-center justify-center w-full will-change-transform"
        >
          <div class="w-full max-w-95 sm:max-w-105 md:max-w-110 xl:max-w-120 aspect-4/5 flex items-center justify-center">
            <img
              :src="data.portraitImage"
              :alt="data.portraitAlt"
              width="480"
              height="600"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              draggable="false"
              @contextmenu.prevent
              class="w-full h-full object-contain object-center select-none transition-all duration-700 ease-out hover:brightness-[1.04] hover:saturate-[1.08] hover:scale-[1.015]"
            />
          </div>
          
          <!-- Intention Gold Masked Signature Logo -->
          <!-- <div
            v-motion
            :initial="{ opacity:0, y: 24 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 340 } }"
            class="w-31.25 xs:w-35 sm:w-37.5 md:w-40 aspect-300/114 bg-intention-gold will-change-transform"
            :style="{
              maskImage: `url(${data.signatureImage})`,
              WebkitMaskImage: `url(${data.signatureImage})`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'left center',
              WebkitMaskPosition: 'left center'
            }"
          >
            <img
              :src="data.signatureImage"
              :alt="data.name"
              width="300"
              height="114"
              fetchpriority="low"
              loading="lazy"
              decoding="async"
              draggable="false"
              @contextmenu.prevent
              class="h-full w-full object-contain object-left opacity-0 pointer-events-none select-none"
            />
          </div> -->
        
        </div>

        <!-- COLUMN C: Achievements / Statistics -->
        <!-- Mobile (<768px): Left-aligned vertical stack | Tablet (768-1279px): 3-col horizontal center-aligned | Desktop (1280px+): Left-aligned vertical stack -->
        <div class="col-span-1 md:col-span-12 xl:col-span-4 order-3 w-full grid grid-cols-1 md:grid-cols-3 xl:grid-cols-1 gap-y-4 md:gap-x-6 lg:gap-x-10 xl:gap-y-9 pt-2 md:pt-6 xl:pt-0">
          <div
            v-for="(stat, index) in data.stats"
            :key="index"
            v-motion
            :initial="{ opacity:0, y: 30 }"
            :visible-once="{ opacity: 1, y: 0, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 360 + index * 50 } }"
            class="flex flex-col items-center text-center xl:items-start xl:text-left will-change-transform"
          >
            <span class="font-primary font-normal text-journey-deep text-[28px] 2xs:text-[30px] xs:text-[32px] sm:text-[34px] md:text-[36px] xl:text-[40px] leading-[1.15] tracking-tight mb-1.5">
              {{ stat.value }}
            </span>
            <span class="font-uppercase text-[10px] 2xs:text-[11px] md:text-[12px] lg:text-[13px] tracking-[0.2em] text-intention-gold font-medium uppercase mb-2">
              {{ stat.subtitle }}
            </span>
            <p class="font-primary text-journey-deep/85 text-[13px] 2xs:text-[14px] xs:text-[15px] xl:text-[16px] leading-[1.6] font-normal max-w-95 md:max-w-75 xl:max-w-95">
              {{ stat.description }}
            </p>
          </div>
        </div>

      </div>

      <!-- 3. BOTTOM CENTERED CTA BUTTON -->
      <div
        v-motion
        :initial="{ opacity:0, y: 28 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 750, ease: [0.22, 1, 0.36, 1], delay: 400 } }"
        class="mt-10 sm:mt-12 md:mt-14 xl:mt-16 flex justify-center w-full will-change-transform"
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
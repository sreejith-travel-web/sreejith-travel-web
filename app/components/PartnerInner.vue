<!-- ~/components/PartnerInner.vue -->
<script setup lang="ts">
export type PartnerIconName = 'users' | 'building' | 'chat' | 'book'

export interface PartnershipCardItem {
  icon: PartnerIconName
  title: string
  description: string
}

export interface PartnershipsSectionConfig {
  eyebrow: string
  title: string
  description: string
  image: string
  imageAlt: string
  cards: PartnershipCardItem[]
}

export interface NetworkSectionConfig {
  eyebrow: string
  title: string
  paragraphs: string[]
  image: string
  imageAlt: string
}

export interface PartnerInnerConfig {
  partnerships: PartnershipsSectionConfig
  network: NetworkSectionConfig
}

defineProps<{
  data: PartnerInnerConfig
}>()
</script>

<template>
  <div class="w-full flex flex-col text-primary-light bg-bg-light">
    
    <!-- ==========================================
         1. PARTNERSHIPS SECTION
         ========================================== -->
    <section
      data-theme="light"
      class="section-wrapper border-t border-divider-light"
    >
      <div class="w-full max-w-7xl flex flex-col">
        
        <!-- Independent Top Header Block -->
        <div class="flex flex-col items-start text-left max-w-2xl mb-10 md:mb-12 lg:mb-14">
          <div v-motion-fade-up class="flex items-center w-full mb-3 md:mb-4">
            <div class="bg-dark-gold/70 eyebrow-border" />
            <span class="text-journey-deep/90 eyebrow-text">
              {{ data.partnerships.eyebrow }}
            </span>
          </div>

          <h2
            v-motion-fade-up
            :delay="100"
            class="section-subtitle text-journey-deep mb-4 md:mb-5"
          >
            {{ data.partnerships.title }}
          </h2>

          <p
            v-motion-fade-up
            :delay="200"
            class="section-paragraph text-secondary-light"
          >
            {{ data.partnerships.description }}
          </p>
        </div>

        <!-- Cards & Image Flex Split:
             Mobile (<md): Image first (order-1), Cards second (order-2)
             Tablet/Laptop (md to xl): Cards left, Sticky Image right (items-start)
             Desktop (xl+): Cards left, Vertically Centered Image right (xl:items-center) -->
        <div class="flex flex-col md:flex-row md:items-start xl:items-center justify-between gap-8 md:gap-10 lg:gap-12 xl:gap-16 w-full">
          
          <!-- 4 Soft-Cream Cards -->
          <div class="order-2 md:order-1 w-full md:flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
            <article
              v-for="(card, index) in data.partnerships.cards"
              :key="card.title"
              v-motion-stagger-card
              :delay="index * 100"
              class="bg-soft-cream rounded-2xl p-6 sm:p-7 lg:p-8 flex flex-col items-start text-left border border-dark-gold/15 shadow-xs"
            >
              <!-- Card Icon -->
              <div class="text-dark-gold mb-4 sm:mb-5">
                <svg
                  v-if="card.icon === 'users'"
                  class="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>

                <svg
                  v-else-if="card.icon === 'building'"
                  class="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M12 6h.01" />
                  <path d="M12 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M16 10h.01" />
                  <path d="M16 14h.01" />
                  <path d="M8 10h.01" />
                  <path d="M8 14h.01" />
                </svg>

                <svg
                  v-else-if="card.icon === 'chat'"
                  class="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>

                <svg
                  v-else
                  class="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>

              <h3 class="card-title text-journey-deep">
                {{ card.title }}
              </h3>

              <p class="section-subparagraph text-secondary-light mt-1">
                {{ card.description }}
              </p>
            </article>
          </div>

          <!-- 1:1 Image (Capped width on mobile/tablet, sticky on md-xl, static centered on xl+) -->
          <div class="order-1 md:order-2 w-full max-w-xs sm:max-w-sm md:max-w-none md:w-72 lg:w-80 xl:w-96 shrink-0 mx-auto md:mx-0 md:sticky md:top-28 xl:static">
            <div
              v-motion
              :initial="{ opacity: 0, y: 30, filter: 'blur(4px)' }"
              :visible-once="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 700, ease: [0.22, 1, 0.36, 1] } }"
              class="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-frosted shadow-sm"
            >
              <img
                :src="data.partnerships.image"
                :alt="data.partnerships.imageAlt"
                width="600"
                height="600"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ==========================================
         2. JOIN THE NETWORK SECTION (Soft Blue)
         ========================================== -->
    <section
      data-theme="light"
      class="section-wrapper bg-soft-blue/40"
    >
      <div class="w-full max-w-7xl flex flex-col md:flex-row md:items-start xl:items-center justify-between gap-10 md:gap-12 lg:gap-16">
        
        <!-- Left Text Column (Always first on Mobile & Desktop) -->
        <div class="order-1 w-full md:flex-1 flex flex-col items-start text-left max-w-2xl">
          <div v-motion-fade-up class="flex items-center w-full mb-3 md:mb-4">
            <div class="bg-dark-gold/70 eyebrow-border" />
            <span class="text-intention-deep/90 eyebrow-text">
              {{ data.network.eyebrow }}
            </span>
          </div>

          <h2
            v-motion-fade-up
            :delay="100"
            class="section-subtitle text-intention-deep mb-5 md:mb-6"
          >
            {{ data.network.title }}
          </h2>

          <div class="flex flex-col gap-4 md:gap-5">
            <p
              v-for="(paragraph, pIndex) in data.network.paragraphs"
              :key="pIndex"
              v-motion-fade-up
              :delay="200 + pIndex * 100"
              class="section-paragraph text-intention-deep/85"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>

        <!-- Right 1:1 Image Column (Second on Mobile & Desktop, sticky on md-xl, centered on xl+) -->
        <div class="order-2 w-full max-w-xs sm:max-w-sm md:max-w-none md:w-72 lg:w-80 xl:w-96 shrink-0 mx-auto md:mx-0 md:sticky md:top-28 xl:static">
          <div
            v-motion
            :initial="{ opacity: 0, y: 30, filter: 'blur(4px)' }"
            :visible-once="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 700, ease: [0.22, 1, 0.36, 1] } }"
            class="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface-light/40 shadow-sm"
          >
            <img
              :src="data.network.image"
              :alt="data.network.imageAlt"
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>

  </div>
</template>
<!-- ~/components/ImpactInner.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'

export interface ImpactPillar {
  title: string
  img: string
  alt: string
  list: string[]
}

export interface ImpactTabContent {
  title: string
  intro: string
  mainImg: string
  mainImgAlt: string
  quote: string
  pillars: ImpactPillar[]
}

export interface ImpactTabItem {
  id: string
  tabTitle: string
  content: ImpactTabContent
}

const props = defineProps<{
  items: ImpactTabItem[]
}>()

const activeTabId = ref<string>(props.items[0]?.id || '')

const activeTab = computed<ImpactTabItem | undefined>(() => {
  return props.items.find((item) => item.id === activeTabId.value) || props.items[0]
})

const selectTab = (id: string) => {
  activeTabId.value = id
}
</script>

<template>
  <section
    data-theme="light"
    class="section-wrapper bg-bg-light text-primary-light pt-2 sm:pt-4 md:pt-6"
  >
    <div class="w-full max-w-7xl flex flex-col items-center">
      
      <!-- ==========================================
           1. RESPONSIVE TAB MATRIX
           < 768px: 2x3 Grid (50% col width, text-center wrap)
           >= 768px: 3x2 Fixed-Width Grid inside max-w-4xl
           ========================================== -->
      <div
        v-motion-fade-up
        role="tablist"
        aria-label="Impact Pillars"
        class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl mx-auto mb-12 md:mb-16 lg:mb-20"
      >
        <button
          v-for="tab in items"
          :key="tab.id"
          role="tab"
          type="button"
          :aria-selected="activeTabId === tab.id"
          @click="selectTab(tab.id)"
          class="w-full min-h-13 sm:min-h-14 px-3 py-3 sm:px-5 sm:py-3.5 rounded-lg text-center flex items-center justify-center section-subparagraph transition-all duration-300 cursor-pointer select-none outline-none"
          :class="
            activeTabId === tab.id
              ? 'bg-soft-cream/40 text-dark-gold font-medium border border-dark-gold ring-1 ring-dark-gold ring-offset-2 ring-offset-bg-light shadow-xs'
              : 'bg-surface-light text-journey-deep/80 border border-journey-deep/20 hover:border-action-blue/50 hover:bg-soft-blue/15 hover:text-journey-deep'
          "
        >
          <span class="leading-snug hero-paragraph">{{ tab.tabTitle }}</span>
        </button>
      </div>

      <!-- ==========================================
           2. ACTIVE TAB CONTENT
           ========================================== -->
      <Transition name="impact-tab" mode="out-in">
        <div
          v-if="activeTab"
          :key="activeTab.id"
          class="w-full flex flex-col gap-12 md:gap-16 lg:gap-20"
        >
          
          <!-- A. TOP SPLIT: Heading + Intro First (Mobile Top / >768px Left), Image Second (Mobile Bottom / >768px Right) -->
          <div class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10 lg:gap-14 xl:gap-16 w-full max-w-5xl mx-auto">
            
            <!-- Left / First: Full Sans Heading + Intro Paragraph -->
            <div class="w-full md:flex-1 flex flex-col items-start text-left">
              <h3 class="section-subtitle text-journey-deep mb-4 md:mb-5">
                {{ activeTab.content.title }}
              </h3>

              <p class="section-paragraph text-secondary-light">
                {{ activeTab.content.intro }}
              </p>
            </div>

            <!-- Right / Second: Rounded-2xl Image -->
            <div class="w-full md:w-80 lg:w-105 xl:w-120 shrink-0">
              <div class="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-surface-frosted shadow-xs">
                <img
                  :src="activeTab.content.mainImg"
                  :alt="activeTab.content.mainImgAlt"
                  width="720"
                  height="540"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

          <!-- B. ELEVATED EDITORIAL QUOTE CENTERPIECE (Always below both) -->
          <div class="relative w-full py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-12 rounded-2xl bg-linear-to-r from-transparent via-soft-cream/25 to-transparent flex flex-col items-center text-center">
            <!-- Top Architectural Hairline -->
            <div class="w-full max-w-3xl h-px bg-linear-to-r from-transparent via-dark-gold/45 to-transparent mb-6 md:mb-8" />

            <!-- Subtle Dark-Gold Quote Emblem -->
            <svg
              class="w-7 h-7 sm:w-8 sm:h-8 text-dark-gold/65 mb-3 md:mb-4 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <!-- Larger Responsive Editorial Quote -->
            <blockquote class="font-quote italic font-medium text-[22px] 2xs:text-[24px] xs:text-[26px] sm:text-[30px] md:text-[33px] lg:text-[36px] xl:text-[40px] leading-[1.35] tracking-tight text-journey-deep max-w-4xl">
              “{{ activeTab.content.quote }}”
            </blockquote>

            <!-- Bottom Architectural Hairline -->
            <div class="w-full max-w-3xl h-px bg-linear-to-r from-transparent via-dark-gold/45 to-transparent mt-6 md:mt-8" />
          </div>

          <!-- C. 3-COLUMN PILLARS GRID -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 w-full">
            <article
              v-for="(pillar, idx) in activeTab.content.pillars"
              :key="pillar.title"
              v-motion-stagger-card
              :delay="idx * 100"
              class="flex flex-col items-start text-left"
            >
              <!-- Pillar Image (Always rounded-2xl) -->
              <div class="w-full aspect-4/3 rounded-2xl overflow-hidden bg-surface-frosted shadow-xs mb-5">
                <img
                  :src="pillar.img"
                  :alt="pillar.alt"
                  width="600"
                  height="450"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  class="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>

              <!-- Pillar Title -->
              <h4 class="card-title text-journey-deep mb-3.5">
                {{ pillar.title }}
              </h4>

              <!-- Pillar Unordered List with Provided Checkmark SVG -->
              <ul class="flex flex-col gap-3 w-full">
                <li
                  v-for="(point, pIdx) in pillar.list"
                  :key="pIdx"
                  class="flex items-start gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-5 h-5 text-dark-gold shrink-0 mt-0.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>

                  <span class="section-subparagraph text-secondary-light">
                    {{ point }}
                  </span>
                </li>
              </ul>
            </article>
          </div>

        </div>
      </Transition>

    </div>
  </section>
</template>

<style scoped>
.impact-tab-enter-active,
.impact-tab-leave-active {
  transition: opacity 0.35s cubic-bezier(0.25, 1, 0.5, 1), transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);
}
.impact-tab-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.impact-tab-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
<!-- ~/components/ItineraryFeatured.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ItineraryMeta } from '~~/server/utils/itinerariesData'

const props = defineProps<{
  items: ItineraryMeta[]
}>()

const currentIndex = ref(0)

const total = computed(() => props.items.length)

const formattedIndex = computed(() => {
  if (!total.value) return '00 / 00'
  const current = String(currentIndex.value + 1).padStart(2, '0')
  const max = String(total.value).padStart(2, '0')
  return `${current} / ${max}`
})

const prevSlide = () => {
  if (!total.value) return
  currentIndex.value = (currentIndex.value - 1 + total.value) % total.value
}

const nextSlide = () => {
  if (!total.value) return
  currentIndex.value = (currentIndex.value + 1) % total.value
}
</script>

<template>
  <section
    v-if="items.length > 0"
    data-theme="light"
    class="section-wrapper pt-8 sm:pt-10 md:pt-12 xl:pt-15 pb-2 bg-bg-light text-primary-light"
  >
    <div class="w-full max-w-6xl mx-auto flex flex-col items-center">
      
      <!-- Zero-CLS Single-Cell Grid Deck (Whole Card Linked + Compact Footprint) -->
      <div class="w-full grid grid-cols-1 rounded-2xl overflow-hidden bg-soft-peach/2 border border-journey-deep/12 shadow-sm hover:shadow-xl active:shadow-xl transition-all duration-500">
        <NuxtLink
          v-for="(item, idx) in items"
          :key="item.id"
          :to="`/itineraries/${item.slug}`"
          :tabindex="currentIndex === idx ? 0 : -1"
          :aria-hidden="currentIndex !== idx"
          class="group col-start-1 row-start-1 w-full grid grid-cols-1 lg:grid-cols-12 items-stretch transition-opacity duration-500 ease-editorial will-change-[opacity]"
          :class="
            currentIndex === idx
              ? 'opacity-100 z-10 pointer-events-auto'
              : 'opacity-0 z-0 pointer-events-none select-none'
          "
        >
          <!-- Left Image Column (6 Cols, Compact Height & Group-Hover Scale) -->
          <div class="lg:col-span-6 relative w-full aspect-16/10 sm:aspect-video lg:aspect-auto lg:min-h-96 overflow-hidden bg-surface-frosted">
            <div class="card-tag absolute top-3.5 left-3.5 z-10 bg-journey-deep group-hover:bg-intention-blue group-active:bg-intention-blue transition-colors duration-300 text-surface-light px-3 pt-2 pb-1 rounded-sm shadow-xs">
              Featured Journey
            </div>

            <img
              :src="item.image"
              :alt="item.alt"
              width="760"
              height="500"
              :loading="'lazy'"
              decoding="async"
              :fetchpriority="idx === 0 ? 'high' : 'low'"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
              />
            </div>
            <!-- :loading="idx === 0 ? 'eager' : 'lazy'" -->

          <!-- Right Content Column (6 Cols, Reduced Padding & Compact Scale) -->
          <div class="lg:col-span-6 p-5 sm:p-6 md:p-7 flex flex-col justify-between text-left">
            <div class="flex flex-col items-start">
              <!-- Eyebrow Type -->
              <div class="flex items-center gap-2.5 mb-2">
                <div class="w-5 h-0.5 bg-dark-gold/70 rounded-full" />
                <span class="card-eyebrow text-dark-gold font-semibold mb-0">
                  {{ item.type === 'signature' ? 'SIGNATURE JOURNEY' : 'COLLABORATED JOURNEY' }}
                </span>
                <div class="w-5 h-0.5 bg-dark-gold/70 rounded-full" />
              </div>

              <!-- Title -->
              <h3 class="section-smaller-subtitle text-journey-deep group-hover:text-intention-blue group-active:text-intention-blue transition-colors duration-300 mb-3 line-clamp-2">
                {{ item.title }}
              </h3>

              <!-- Region & Duration Meta -->
              <div class="flex flex-wrap items-center gap-3.5 text-journey-deep/75 card-tag font-semibold mb-3.5">
                <span class="inline-flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-action-blue shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-5.686-7-11a7 7 0 1 1 14 0c0 5.314-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  <span class="pt-1.5"> {{ item.region }}</span>
                </span>

                <span class="w-px h-3 bg-journey-deep/20" />

                <span class="inline-flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-action-blue shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path stroke-linecap="round" d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span class="pt-1.5"> {{ item.days }} DAYS</span>
                </span>
              </div>

              <!-- Extended Featured Description -->
              <p class="section-subparagraph text-secondary-light/90 line-clamp-3 mb-4">
                {{ item.featuredDescription || item.intro }}
              </p>

              <!-- 4 Extra Featured Highlights (Compact 2x2 Grid) -->
              <div
                v-if="item.highlights && item.highlights.length"
                class="w-full pt-3.5 border-t border-journey-deep/10 mb-5"
              >
                <span class="card-eyebrow text-journey-deep/60 font-semibold block mb-2.5">
                  HIGHLIGHTS
                </span>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    v-for="(hl, hIdx) in item.highlights"
                    :key="hIdx"
                    class="flex items-center gap-2"
                  >
                    <span class="w-6 h-6 rounded-full bg-soft-blue/25 text-action-blue flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-intention-blue/8 group-hover:text-intention-blue/70">
                      <svg v-if="hl.icon === 'boat'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2 17s3-2 6-2 6 2 10 2 4-2 4-2M4 13l8-8 8 8H4z" />
                      </svg>
                      <svg v-else-if="hl.icon === 'village'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
                      </svg>
                      <svg v-else-if="hl.icon === 'temple'" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3L4 9h16l-8-6zM6 9v9m4-9v9m4-9v9m4-9v9M3 18h18M2 21h20" />
                      </svg>
                      <svg v-else class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3c2.5 3 4 6 4 9a4 4 0 1 1-8 0c0-3 1.5-6 4-9z" />
                      </svg>
                    </span>
                    <span class="section-subparagraph text-journey-deep/90 font-medium line-clamp-1">
                      {{ hl.label }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Explore Journey CTA (Reacts to Whole-Card Group Hover & Active) -->
            <div class="w-fit mt-auto">
              <div class="shrink-0 flex items-center justify-center border-2 border-journey-deep/30 bg-surface-light/70 px-4 h-9 sm:h-10 rounded-sm text-[10px] md:text-[11px] font-uppercase tracking-widest text-journey-deep uppercase transition-all duration-300 group-hover:border-intention-blue group-hover:bg-intention-blue group-hover:text-surface-light group-active:border-intention-blue group-active:bg-intention-blue group-active:text-surface-light gap-2 group-active:scale-96">
                <span class="pt-0.75 leading-none">EXPLORE JOURNEY</span>
                <svg
                  class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Bottom Carousel Controls (01 / 04) -->
      <div
        v-if="total > 1"
        class="flex items-center justify-center gap-5 mt-5 sm:mt-6 h-10"
      >
        <button
          type="button"
          aria-label="Previous featured journey"
          @click="prevSlide"
          class="w-10 h-10 rounded-full border border-journey-deep/25 flex items-center justify-center text-journey-deep transition-all duration-300 hover:border-intention-blue hover:bg-intention-blue hover:text-surface-light active:border-intention-blue active:bg-intention-blue active:text-surface-light active:scale-95 cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div class="flex items-center gap-3">
          <span class="w-6 h-px bg-dark-gold/50" />
          <span class="card-tag font-semibold text-journey-deep/80 tracking-[0.22em] tabular-nums">
            {{ formattedIndex }}
          </span>
          <span class="w-6 h-px bg-dark-gold/50" />
        </div>

        <button
          type="button"
          aria-label="Next featured journey"
          @click="nextSlide"
          class="w-10 h-10 rounded-full border border-journey-deep/25 flex items-center justify-center text-journey-deep transition-all duration-300 hover:border-intention-blue hover:bg-intention-blue hover:text-surface-light active:border-intention-blue active:bg-intention-blue active:text-surface-light active:scale-95 cursor-pointer"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

    </div>
  </section>
</template>
<!-- ~/components/ItineraryCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'

export interface ItineraryCardItem {
  id: string
  slug: string
  type: 'signature' | 'collaborated' | 'essential' | string
  region: string
  days: number | string
  title: string
  intro: string
  image: string
  alt: string
  categories?: string[]
  collaborator?: {
    name: string
    role: string
    avatar?: string
  }
}

const props = defineProps<{
  item: ItineraryCardItem
  eager?: boolean
}>()

const cardSurfaceClass = computed(() => {
  if (props.item.type === 'signature') {
    return 'bg-soft-cream/5 border border-dark-gold/25 shadow-xs hover:shadow-md active:shadow-md'
  }
  if (props.item.type === 'collaborated') {
    return 'bg-soft-peach/5 border border-dark-peach/25 shadow-xs hover:shadow-md active:shadow-md'
  }
  return 'bg-surface-light border border-journey-deep/12 shadow-2xs hover:shadow-md active:shadow-md'
})

const dividerBarClass = computed(() => {
  if (props.item.type === 'signature') return 'bg-dark-gold'
  if (props.item.type === 'collaborated') return 'bg-dark-peach'
  return 'bg-journey-deep/35'
})

const headerPipeClass = computed(() => {
  if (props.item.type === 'signature') return 'bg-dark-gold/65'
  if (props.item.type === 'collaborated') return 'bg-dark-peach/65'
  return 'bg-journey-deep/30'
})
</script>

<template>
  <NuxtLink
    :to="`/itineraries/${item.slug}`"
    class="group relative w-full h-full flex flex-col justify-between rounded-2xl p-5 sm:p-6 overflow-hidden transition-all duration-500"
    :class="cardSurfaceClass"
  >
    <!-- Decorative Wavy Shimmer Watermark (Only on Signature & Collaborated) -->
    <svg
      v-if="item.type !== 'essential'"
      class="pointer-events-none absolute -top-6 -right-6 w-36 h-36 opacity-20 transition-transform duration-700 group-hover:scale-110"
      :class="item.type === 'signature' ? 'text-dark-gold' : 'text-dark-peach'"
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <path d="M10 30 Q 40 10, 70 30 T 130 30" stroke="currentColor" stroke-width="1.5" />
      <path d="M10 50 Q 40 30, 70 50 T 130 50" stroke="currentColor" stroke-width="1.5" />
      <path d="M10 70 Q 40 50, 70 70 T 130 70" stroke="currentColor" stroke-width="1.5" />
    </svg>

    <!-- ==========================================
         TOP BLOCK: CREST + REGION + DAYS PILL + TITLE + INTRO
         ========================================== -->
    <div class="relative z-10 w-full flex flex-col items-start text-left">
      
      <!-- Header Row: Crest | Region (Left) & Days Pill (Right) -->
      <div class="w-full flex items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2.5 min-w-0">
          
          <!-- 1. SIGNATURE CREST (Dark Navy + Wavy Gold Sheen + Fingerprint) -->
          <div
            v-if="item.type === 'signature'"
            class="relative w-9 h-9 rounded-lg bg-journey-deep text-surface-light flex items-center justify-center shrink-0 overflow-hidden shadow-2xs"
          >
            <svg class="absolute inset-x-0 bottom-0 w-full h-3.5 text-warm-gold/30" viewBox="0 0 36 14" fill="none" aria-hidden="true">
              <path d="M0 7 Q 9 2, 18 7 T 36 7 L 36 14 L 0 14 Z" fill="currentColor" />
            </svg>
            <svg class="relative z-10 w-5 h-5 text-warm-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
              <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
              <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
              <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
              <path d="M8.65 22c.21-.66.45-1.32.57-2" />
              <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
              <path d="M2 16h.01" />
              <path d="M21.8 16c.2-2 .131-5.354 0-6" />
              <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
            </svg>
          </div>

          <!-- 2. COLLABORATED CREST (Dark Navy + Wavy Blue Sheen + Collaborators Icon) -->
          <div
            v-else-if="item.type === 'collaborated'"
            class="relative w-9 h-9 rounded-lg bg-journey-deep text-surface-light flex items-center justify-center shrink-0 overflow-hidden shadow-2xs"
          >
            <svg class="absolute inset-x-0 bottom-0 w-full h-3.5 text-soft-blue/35" viewBox="0 0 36 14" fill="none" aria-hidden="true">
              <path d="M0 7 Q 9 2, 18 7 T 36 7 L 36 14 L 0 14 Z" fill="currentColor" />
            </svg>
            <svg class="relative z-10 w-5 h-5 text-soft-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="3.5" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a3.5 3.5 0 0 1 0 6.75" />
            </svg>
          </div>

          <!-- 3. ESSENTIAL / TRAVEL YOUR WAY CREST (Flat Neutral Surface + Minimalist Star) -->
          <div
            v-else
            class="w-9 h-9 rounded-lg bg-surface-medium border border-journey-deep/15 text-journey-deep/70 flex items-center justify-center shrink-0"
          >
            <svg class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m12 3 1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3L12 3Z" />
            </svg>
          </div>

          <!-- Vertical Divider Line -->
          <span class="w-px h-5 shrink-0" :class="headerPipeClass" />

          <!-- Region Label (Zero Categories Shown on Card) -->
          <span class="card-tag font-semibold text-journey-deep/90 truncate">
            {{ item.region }}
          </span>
        </div>

        <!-- Duration Pill (Right) -->
        <span
          class="card-tag font-semibold px-2 pt-1.5 pb-0.75 rounded-lg shrink-0"
          :class="
            item.type === 'essential'
              ? 'bg-journey-deep/85 text-surface-light'
              : 'bg-journey-deep text-surface-light shadow-2xs'
          "
        >
          {{ item.days }} DAYS
        </span>
      </div>

      <!-- Journey Title (Strictly 2 Lines Reserved) -->
      <h3 class="card-title text-journey-deep group-hover:text-intention-blue group-active:text-intention-blue transition-colors line-clamp-2 min-h-13 sm:min-h-14 mb-2">
        {{ item.title }}
      </h3>

      <!-- Tier-Matched Accent Divider Bar -->
      <div class="w-9 h-1 rounded-full mb-3" :class="dividerBarClass" />

      <!-- Clamped Intro Paragraph:
           4 Lines on Signature & Essential (min-h-24)
           3 Lines on Collaborated (min-h-18) -->
      <p
        class="section-subparagraph text-secondary-light"
        :class="
          item.type === 'collaborated'
            ? 'line-clamp-3 min-h-18 mb-3.5'
            : 'line-clamp-4 min-h-24 mb-4'
        "
      >
        {{ item.intro }}
      </p>
    </div>

    <!-- ==========================================
         BOTTOM / MIDDLE VISUAL & CTA BLOCK
         ========================================== -->

    <!-- A. COLLABORATED LAYOUT: 16:9 Middle Image + Avatar Left / Name Middle / Double-Border Arrow Right -->
    <div v-if="item.type === 'collaborated'" class="relative z-10 w-full flex flex-col mt-auto">
      <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-surface-frosted mb-3.5">
        <img
          :src="item.image"
          :alt="item.alt"
          width="640"
          height="360"
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
          :fetchpriority="eager ? 'high' : 'low'"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
        />
        <!-- 3. Unified Section Tint Overlay (z-20) -->
        <div class="absolute inset-0 w-full h-full pointer-events-none z-20 bg-journey-deep/20" />
      </div>

      <!-- Collaborator Footer Row -->
      <div class="w-full pt-3 border-t border-darker-gold/20 flex items-center justify-between gap-3">
        <!-- Left: Circular Avatar -->
        <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-darker-gold/40 bg-surface-frosted shrink-0">
          <img
            :src="item.collaborator?.avatar || item.image"
            :alt="item.collaborator?.name || 'Travel Designer'"
            width="44"
            height="44"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Middle: Left-Aligned Name & Role -->
        <div class="flex flex-col items-start text-left min-w-0 flex-1">
          <span class="font-uppercase text-[11px] sm:text-[12px] tracking-[0.12em] font-bold text-journey-deep uppercase leading-tight truncate w-full">
            {{ item.collaborator?.name || 'Regional Specialist' }}
          </span>
          <span class="card-paragraph text-secondary-light leading-tight truncate w-full mt-0.5">
            {{ item.collaborator?.role || 'Travel Designer' }}
          </span>
        </div>

        <!-- 1. Collaborated Card Footer Right CTA (Light Surface -> Deep / Intention Blue) -->
        <div class="itinerary-cta-circle text-journey-deep group-hover:text-intention-blue group-active:text-intention-blue group-hover:scale-105 group-active:scale-105 duration-300 ease-editorial">
          <svg
            class="w-full h-full overflow-visible"
            viewBox="0 0 44 44"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <!-- Smooth 1px -> 2px Vector Circle -->
            <circle
              cx="22"
              cy="22"
              r="20.5"
              class="itinerary-cta-ring"
            />
            <!-- Animated Long-Shaft Top-Right Arrow -->
            <g
              class=""
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 29L29 15" />
              <path d="M21 15h8v8" />
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- B. SIGNATURE & ESSENTIAL LAYOUT: 3:2 Bottom Image + Bottom-Right 2px Double-Border Arrow CTA -->
    <div v-else class="relative z-10 w-full aspect-3/2 rounded-xl overflow-hidden bg-surface-frosted mt-auto">
      <img
        :src="item.image"
        :alt="item.alt"
        width="600"
        height="400"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        :fetchpriority="eager ? 'high' : 'low'"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
      />

      <!-- 2. Signature & Essential Bottom-Right Image CTA (Transparent + Warm Gold) -->
      <div class="itinerary-cta-circle absolute bottom-3 right-3 z-21 text-warm-gold drop-shadow-xs group-hover:scale-105 group-active:scale-105 duration-500 ease-editorial">
        <svg
          class="w-full h-full overflow-visible"
          viewBox="0 0 44 44"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <!-- Smooth 1px -> 2px Vector Circle -->
          <circle
            cx="22"
            cy="22"
            r="20.5"
            class="itinerary-cta-ring"
          />
          <!-- Animated Long-Shaft Top-Right Arrow -->
          <g
            class=""
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 29L29 15" />
            <path d="M21 15h8v8" />
          </g>
        </svg>
      </div>

      <!-- 3. Unified Section Tint Overlay (z-20) -->
      <div class="absolute inset-0 w-full h-full pointer-events-none z-20 bg-journey-deep/30" />
    </div>

  </NuxtLink>
</template>
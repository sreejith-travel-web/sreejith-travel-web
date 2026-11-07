<!-- ~/app/components/itineraries/ItineraryHeader.vue -->
<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  to?: string
}

export interface JourneyDetailItem {
  label: string
  value: string
}

export interface ItineraryHeaderData {
  breadcrumbs: BreadcrumbItem[]
  coverImage: string
  coverAlt: string
  eyebrow: string
  title: string
  intro: string
  journeyDetails: JourneyDetailItem[]
}

defineProps<{
  data: ItineraryHeaderData
}>()
</script>

<template>
  <header
    data-theme="light"
    aria-label="Itinerary introduction"
    class="section-wrapper bg-bg-light text-journey-deep pt-24! sm:pt-28! md:pt-32! pb-10! sm:pb-14! overflow-hidden"
  >
    <div class="w-full max-w-7xl mx-auto flex flex-col items-center">
      
      <!-- 1. BREADCRUMB + COVER IMAGE (1440px / max-w-360) -->
      <div class="w-full">
        <!-- Breadcrumb Navigation (Uses card-eyebrow + static full-width bottom border on links) -->
        <nav
          v-if="data.breadcrumbs?.length"
          aria-label="Breadcrumb"
          class="w-full mb-4 sm:mb-5 px-1"
        >
          <ol class="flex flex-wrap items-center gap-2">
            <li
              v-for="(crumb, index) in data.breadcrumbs"
              :key="`crumb-${index}`"
              class="inline-flex items-center gap-2 min-w-0"
            >
              <!-- Source Link (Less opaque + full-width bottom border after padding, color change on hover) -->
              <NuxtLink
                v-if="crumb.to && index < data.breadcrumbs.length - 1"
                :to="crumb.to"
                class="card-eyebrow mb-0! pt-1 pb-px border-b border-journey-deep/25 text-journey-deep/55 hover:text-journey-deep hover:border-journey-deep/50 active:border-journey-deep/50 "
              >
                {{ crumb.label }}
              </NuxtLink>

              <!-- Active Current Page (Distinct color, no underline) -->
              <span 
                v-else
                class="card-eyebrow mb-0! pt-1.5 pb-1 border-b border-transparent text-dark-gold font-semibold"
                aria-current="page"
              >
                {{ crumb.label }}
              </span>

              <!-- Slash Separator -->
              <span
                v-if="index < data.breadcrumbs.length - 1"
                class="card-eyebrow mb-0! pt-1 pb-1 border-b border-transparent text-journey-deep/35 select-none"
                aria-hidden="true"
              >
                /
              </span>
            </li>
          </ol>
        </nav>

        <!-- Cover Image (3/2 -> sm:16/9 -> md:8/5 -> lg:2/1 -> xl:21/9) -->
        <div class="relative w-full aspect-3/2 sm:aspect-video md:aspect-8/5 lg:aspect-2/1 xl:aspect-21/9 rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-light shadow-xs">
          <img
            :src="data.coverImage"
            :alt="data.coverAlt"
            width="1200"
            height="630"
            fetchpriority="high"
            loading="eager"
            decoding="sync"
            class="w-full h-full object-cover object-center select-none"
          />
        </div>
      </div>

      <!-- 2. EYEBROW, TITLE, INTRO & DETAILS BAR -->
      <div class="w-full pt-5 sm:pt-6 md:pt-7 flex flex-col items-center text-center">
        
        <!-- Flanked Eyebrow -->
        <div
          v-motion-fade-up
          class="eyebrow-wrapper mb-2!"
        >
          <div class="bg-dark-gold/70 eyebrow-border" />
          <span class="text-journey-deep/85 eyebrow-text pt-0.5">
            {{ data.eyebrow }}
          </span>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <!-- Journey Title -->
        <h1
          v-motion-fade-up
          :delay="60"
          class="section-subtitle font-medium text-journey-deep max-w-4xl mb-3 sm:mb-4 px-2"
        >
          {{ data.title }}
        </h1>

        <!-- Intro Paragraph -->
        <p
          v-motion-fade-up
          :delay="120"
          class="section-paragraph text-secondary-light/90 max-w-5xl mb-6 sm:mb-8 px-2"
        >
          {{ data.intro }}
        </p>

        <!-- 3. FLEXBOX JOURNEY DETAILS BAR (select-none + cursor-default) -->
        <div
          v-if="data.journeyDetails?.length"
          v-motion-fade-up
          :delay="180"
          class="w-full max-w-4xl flex flex-wrap items-stretch justify-center gap-2.5 sm:gap-3 md:gap-3.5 px-1"
        >
          <div
            v-for="(detail, index) in data.journeyDetails"
            :key="`detail-${index}`"
            class="w-auto shrink-0 rounded-xl sm:rounded-2xl bg-soft-peach/10 border border-dark-gold/25 shadow-2xs px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3.5 flex flex-col items-center justify-center text-center select-none cursor-default"
          >
            <!-- Detail Name -->
            <span class="card-tag font-medium text-journey-deep/70 leading-none pt-0.5 mb-1 line-clamp-1">
              {{ detail.label }}
            </span>

            <!-- Detail Value -->
            <span class="section-subparagraph font-semibold text-journey-deep/80 leading-snug! line-clamp-2">
              {{ detail.value }}
            </span>
          </div>
        </div>

      </div>

    </div>
  </header>
</template>
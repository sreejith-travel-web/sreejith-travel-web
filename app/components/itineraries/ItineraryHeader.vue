<!-- ~/app/components/itineraries/ItineraryHeader.vue -->
<script setup lang="ts">
import { ref, watch, onMounted, onActivated } from 'vue'
import { useInitialAppLoad } from '#imports'

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

const props = defineProps<{
  data: ItineraryHeaderData
}>()

const isInitialAppLoad = useInitialAppLoad()
const hasPlayedEntrance = ref(false)

const triggerEntrance = () => {
  if (!import.meta.client) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hasPlayedEntrance.value = true
    })
  })
}

onMounted(() => {
  if (!isInitialAppLoad.value) {
    triggerEntrance()
  } else {
    const unwatch = watch(
      isInitialAppLoad,
      (isStillLoading) => {
        if (!isStillLoading) {
          hasPlayedEntrance.value = true
          unwatch()
        }
      },
      { flush: 'sync' }
    )
  }
})

onActivated(() => {
  if (!isInitialAppLoad.value && !hasPlayedEntrance.value) {
    triggerEntrance()
  }
})

// Replay entrance if user clicks a Related Itinerary at the bottom of the page
watch(
  () => props.data.title,
  () => {
    hasPlayedEntrance.value = false
    triggerEntrance()
  }
)
</script>

<template>
  <header
    data-theme="light"
    aria-label="Itinerary introduction"
    class="section-wrapper bg-bg-light text-journey-deep pt-24! sm:pt-28! md:pt-32! pb-10! sm:pb-14! overflow-hidden"
  >
    <div class="w-full max-w-7xl mx-auto flex flex-col items-center">
      <!-- 1. BREADCRUMB + COVER IMAGE -->
      <div class="w-full">
        <!-- Item 1: Breadcrumb Navigation (0ms) -->
        <nav
          v-if="data.breadcrumbs?.length"
          aria-label="Breadcrumb"
          style="--stagger-delay: 0ms"
          :class="['w-full mb-4 sm:mb-5 px-1 header-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
        >
          <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li
              v-for="(crumb, index) in data.breadcrumbs"
              :key="`crumb-${index}`"
              class="inline-flex items-center gap-2 min-w-0 max-w-full"
            >
              <NuxtLink
                v-if="crumb.to && index < data.breadcrumbs.length - 1"
                :to="crumb.to"
                class="card-eyebrow mb-0! pt-1 pb-px border-b border-journey-deep/25 text-journey-deep/55 hover:text-journey-deep hover:border-journey-deep/50 active:border-journey-deep/50 shrink-0"
              >
                {{ crumb.label }}
              </NuxtLink>

              <span
                v-else
                class="card-eyebrow mb-0! pt-1.5 pb-1 border-b border-transparent text-dark-gold font-semibold line-clamp-none! overflow-visible! whitespace-normal! wrap-break-word leading-relaxed"
                aria-current="page"
              >
                {{ crumb.label }}
              </span>

              <span
                v-if="index < data.breadcrumbs.length - 1"
                class="card-eyebrow mb-0! pt-1 pb-1 border-b border-transparent text-journey-deep/35 select-none shrink-0"
                aria-hidden="true"
              >
                /
              </span>
            </li>
          </ol>
        </nav>

        <!-- Item 2: Cover Image Frame (70ms) + Subtle Scale (1.08 -> 1.0) -->
        <div
          style="--stagger-delay: 70ms"
          :class="[
            'relative w-full aspect-3/2 sm:aspect-video md:aspect-8/5 lg:aspect-2/1 xl:aspect-21/9 rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-light shadow-xs header-stagger-item',
            { 'is-revealed': hasPlayedEntrance }
          ]"
        >
          <img
            :src="data.coverImage"
            :alt="data.coverAlt"
            width="1200"
            height="630"
            fetchpriority="high"
            loading="eager"
            decoding="sync"
            :class="[
              'w-full h-full object-cover object-center select-none header-cover-media',
              { 'is-revealed': hasPlayedEntrance }
            ]"
          />
        </div>
      </div>

      <!-- 2. EYEBROW, TITLE, INTRO & DETAILS BAR -->
      <div class="w-full pt-5 sm:pt-6 md:pt-7 flex flex-col items-center text-center">
        <!-- Item 3: Flanked Eyebrow (160ms) -->
        <div
          style="--stagger-delay: 160ms"
          :class="['eyebrow-wrapper mb-2! header-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
        >
          <div class="bg-dark-gold/70 eyebrow-border" />
          <span class="text-journey-deep/85 eyebrow-text pt-0.5">
            {{ data.eyebrow }}
          </span>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <!-- Item 4: Journey Title (240ms) -->
        <h1
          style="--stagger-delay: 240ms"
          :class="[
            'page-title-sans capitalize text-journey-deep max-w-4xl mb-3 sm:mb-4 px-2 pt-2 header-stagger-item',
            { 'is-revealed': hasPlayedEntrance }
          ]"
        >
          {{ data.title }}
        </h1>

        <!-- Item 5: Intro Paragraph (320ms) -->
        <p
          style="--stagger-delay: 320ms"
          :class="[
            'section-paragraph text-secondary-light/90 max-w-5xl mb-6 sm:mb-8 px-2 header-stagger-item',
            { 'is-revealed': hasPlayedEntrance }
          ]"
        >
          {{ data.intro }}
        </p>

        <!-- Item 6: Flexbox Journey Details Bar (400ms) -->
        <div
          v-if="data.journeyDetails?.length"
          style="--stagger-delay: 400ms"
          :class="[
            'w-full max-w-4xl flex flex-wrap items-stretch justify-center gap-2.5 sm:gap-3 md:gap-3.5 px-1 header-stagger-item',
            { 'is-revealed': hasPlayedEntrance }
          ]"
        >
          <div
            v-for="(detail, index) in data.journeyDetails"
            :key="`detail-${index}`"
            class="w-auto shrink-0 rounded-xl sm:rounded-2xl bg-soft-peach/10 border border-dark-gold/25 shadow-2xs px-4 py-2.5 sm:px-5 sm:py-3 md:px-6 md:py-3.5 flex flex-col items-center justify-center text-center select-none cursor-default"
          >
            <span class="card-tag font-medium text-journey-deep/70 leading-none pt-0.5 mb-1 line-clamp-1">
              {{ detail.label }}
            </span>

            <span class="section-subparagraph font-semibold text-journey-deep/80 leading-snug! line-clamp-2">
              {{ detail.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-cover-media {
  transform: scale(1.08);
  will-change: transform;
  transition: transform 2.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.header-cover-media.is-revealed {
  transform: scale(1);
}

.header-stagger-item {
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  will-change: transform, opacity;
  transition:
    opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.95s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--stagger-delay, 0ms);
}

.header-stagger-item.is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
</style>
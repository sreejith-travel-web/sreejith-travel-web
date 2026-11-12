<!-- ~/app/components/HomeJournal.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useAsyncData } from '#imports'
import CtaButton from '~/components/CtaButton.vue'
import JournalCard, { type JournalCardItem } from '~/components/JournalCard.vue'
import JournalFeatured from '~/components/JournalFeatured.vue'
import type { HomeFeaturedJournalResponse } from '~~/server/api/journal/home.get'

export type JournalPost = JournalCardItem

export interface HomeJournalConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  featuredSlug?: string
  listingSlugs?: string[]
  bottomQuote: string
  bottomCta: {
    label: string
    to: string
  }
}

const props = defineProps<{
  data: HomeJournalConfig
}>()

const normalizedFeaturedSlug = computed(() => props.data.featuredSlug?.trim() || '')
const normalizedListingSlugs = computed(() =>
  (props.data.listingSlugs || [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
)

const { data: homeJournal } = await useAsyncData<HomeFeaturedJournalResponse>(
  'home-journal-curated',
  () =>
    $fetch<HomeFeaturedJournalResponse>('/api/journal/home', {
      query: {
        featuredSlug: normalizedFeaturedSlug.value,
        listingSlugs: normalizedListingSlugs.value.join(',')
      }
    }),
  {
    watch: [normalizedFeaturedSlug, () => normalizedListingSlugs.value.join(',')],
    default: () => ({ featured: null, listing: [] })
  }
)

const featuredPosts = computed<JournalPost[]>(() => {
  if (!homeJournal.value?.featured) return []
  return [homeJournal.value.featured as unknown as JournalPost]
})

const listingPosts = computed<JournalPost[]>(() => {
  return (homeJournal.value?.listing || []).slice(0, 3) as unknown as JournalPost[]
})
</script>

<template>
  <section
    data-theme="light"
    class="section-wrapper overflow-x-clip bg-bg-light text-primary-light"
  >
    <div class="relative z-10 w-full max-w-7xl flex flex-col items-center">
      <!-- 1. HEADER -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-8 md:mb-12">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-motion-fade-up
          :delay="90"
          class="section-title-wrapper drop-shadow-none!"
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
          :delay="170"
          class="text-secondary-light max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. TOP ROW: ADAPTIVE SINGLE FEATURED JOURNAL CARD -->
      <div
        v-if="featuredPosts.length > 0"
        v-motion-editorial-showcase
        :delay="180"
        class="w-full mb-8 md:mb-10"
      >
        <JournalFeatured
          :items="featuredPosts"
          :show-header="false"
          :eager="false"
        />
      </div>

      <!-- 3. BOTTOM ROW: SELF-CENTERED FLEX-WRAP CARDS (0 TO 3 ITEMS) -->
      <div
        v-if="listingPosts.length > 0"
        class="home-journal-flex mt-2"
      >
        <div
          v-for="(post, idx) in listingPosts"
          :key="post.id"
          v-motion-atelier-card
          :delay="140 + idx * 85"
          class="home-journal-slot"
        >
          <JournalCard :post="post" />
        </div>
      </div>

      <!-- 4. BOTTOM QUOTE -->
      <div
        v-motion-fade-up
        class="flex flex-col items-center text-center mt-8 md:mt-10 mb-8 md:mb-10 px-4 w-full"
      >
        <p class="px-4 lg:max-w-3xl xl:max-w-4xl text-darker-gold section-quote">
          {{ data.bottomQuote }}
        </p>
      </div>

      <!-- 5. BOTTOM CENTERED CTA BUTTON -->
      <div
        v-motion-fade-up
        :delay="90"
        class="flex justify-center w-full"
      >
        <CtaButton
          :to="data.bottomCta.to"
          :label="data.bottomCta.label"
          variant="light"
        />
      </div>
    </div>
  </section>
</template>
<!-- ~/components/HomeJournal.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import CtaButton from '~/components/CtaButton.vue'
import JournalCard, { type JournalCardItem } from '~/components/JournalCard.vue'
import JournalFeatured from '~/components/JournalFeatured.vue'

export type JournalPost = JournalCardItem

export interface HomeJournalConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  posts: JournalPost[]
  bottomQuote: string
  bottomCta: {
    label: string
    to: string
  }
}

const props = defineProps<{
  data: HomeJournalConfig
}>()

// Top Row: Featured Story (or Slider if multiple posts have featured: true)
const featuredPosts = computed(() => {
  const flagged = props.data.posts.filter((p) => p.featured)
  return flagged.length > 0 ? flagged : props.data.posts.slice(0, 1)
})

// Bottom Row: 3 Regular Stories on Desktop
const regularPosts = computed(() => {
  const nonFeatured = props.data.posts.filter((p) => !p.featured)
  return nonFeatured.slice(0, 3)
})
</script>

<template>
  <section
    data-theme="light"
    class="text-primary-light overflow-hidden section-wrapper"
  >
    <div class="relative z-10 w-full max-w-7xl flex flex-col items-center">
      
      <!-- 1. HEADER -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-8 md:mb-12 px-4">
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

      <!-- 2. TOP ROW: CENTERED NARROWER FEATURED JOURNAL -->
      <div
        v-if="featuredPosts.length > 0"
        v-motion-fade-up
        :delay="250"
        class="w-full px-4 sm:px-6 md:px-8 xl:px-0 mb-8 md:mb-10"
      >
        <JournalFeatured
          :items="featuredPosts"
          :show-header="false"
        />
      </div>

      <!-- 3. BOTTOM ROW: 3 REGULAR JOURNAL CARDS -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full px-4 sm:px-6 md:px-8 xl:px-0 items-stretch">
        <div
          v-for="(post, idx) in regularPosts"
          :key="post.id"
          v-motion-fade-up
          :delay="300 + idx * 60"
          class="flex w-full"
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
        :delay="100"
        class="flex justify-center w-full will-change-transform"
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
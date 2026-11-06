<!-- ~/components/RelatedStories.vue -->
<script setup lang="ts">
import JournalCard, { type JournalCardItem } from '~/components/JournalCard.vue'

export interface RelatedStoriesConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  posts: JournalCardItem[]
}

defineProps<{
  data: RelatedStoriesConfig
}>()
</script>

<template>
  <section
    data-theme="light"
    class="section-wrapper pt-2 bg-bg-light text-primary-light"
  >
    <div class="w-full max-w-7xl flex flex-col">
      
      <!-- Left-Aligned Section Header -->
      <div class="flex flex-col items-start text-left mb-8 md:mb-12">
        <div v-motion-fade-up class="flex items-center w-full mb-3">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <span class="text-journey-deep/90 eyebrow-text">
            {{ data.eyebrow }}
          </span>
        </div>

        <h2
          v-motion-fade-up
          :delay="100"
          class="flex flex-wrap items-baseline gap-x-3 gap-y-1"
        >
          <span class="section-subtitle text-journey-deep">
            {{ data.titleLine1 }}
          </span>
          <span class="section-title-cursive text-dark-gold">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>
      </div>

      <!-- 3-Column Card Grid Using Reusable JournalCard -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch">
        <div
          v-for="(post, idx) in data.posts"
          :key="post.id"
          v-motion-stagger-card
          :delay="idx * 100"
          class="flex w-full"
        >
          <JournalCard :post="post" />
        </div>
      </div>

    </div>
  </section>
</template>
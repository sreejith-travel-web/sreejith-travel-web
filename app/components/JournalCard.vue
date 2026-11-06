<!-- ~/components/JournalCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'

export interface JournalCardItem {
  id: string
  slug: string
  type?: 'articles' | 'case-studies' | string
  featured?: boolean
  title: string
  excerpt: string
  category?: string
  categoryLabel?: string
  readTime: string
  tags: string[]
  image: string
  alt: string
}

const props = defineProps<{
  post: JournalCardItem
  eager?: boolean
}>()

const resolvedHref = computed(() => {
  if (!props.post.slug) return '/journal'
  return props.post.slug.startsWith('/') ? props.post.slug : `/journal/${props.post.slug}`
})

const displayCategory = computed(() => {
  return props.post.categoryLabel || props.post.category || 'FIELD NOTES'
})
</script>

<template>
  <NuxtLink
    :to="resolvedHref"
    class="group relative w-full h-full flex flex-col rounded-2xl overflow-hidden bg-linear-to-b from-surface-light via-soft-blue/14 to-soft-blue/28 border border-journey-deep/12 hover:border-action-blue/40 active:border-action-blue/40 shadow-xs hover:shadow-xl active:shadow-xl transition-all duration-500"
  >
    <!-- Top 3:2 Image Container with Subtle Bottom Vignette -->
    <div class="w-full relative overflow-hidden aspect-3/2 bg-surface-frosted shrink-0">
      <img
        :src="post.image"
        :alt="post.alt"
        width="600"
        height="400"
        :loading="eager ? 'eager' : 'lazy'"
        decoding="async"
        :fetchpriority="eager ? 'high' : 'low'"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
      />
      <div class="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-journey-deep/20 to-transparent" />
    </div>

    <!-- Card Body -->
    <div class="p-3.5 sm:p-4.5 flex flex-col grow justify-between text-left relative z-10">
      <div class="flex flex-col items-start w-full">
        
        <!-- 1. Headline Category & Read Time Meta -->
        <div class="card-tag font-primary text-journey-deep/75 font-semibold mb-2.5 flex flex-row items-center gap-2 flex-wrap">
          <span class="text-dark-gold font-bold">{{ displayCategory }}</span>
          <span class="w-1 h-1 rounded-full bg-journey-deep/30" />
          <span>{{ post.readTime }}</span>
        </div>

        <!-- 2. Title (Locked 2-Line Reserve for Equal Grid Height) -->
        <h3 class="card-title text-journey-deep/95 group-hover:text-intention-blue group-active:text-intention-blue transition-colors duration-300 line-clamp-2 min-h-13 sm:min-h-14 mb-2.5">
          {{ post.title }}
        </h3>

        <!-- Subtle Editorial Gradient Rule -->
        <div class="w-8 h-0.5 rounded-full bg-linear-to-r from-dark-gold to-action-blue/45 mb-3.5" />

        <!-- 3. Three Tag Pills (Placed Directly Above Excerpt Paragraph) -->
        <div
          v-if="post.tags && post.tags.length"
          class="flex flex-wrap items-center gap-1.5 mb-3.5"
        >
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="rounded-sm bg-surface-dark/8 border border-journey-deep/10 text-journey-deep/80 card-tag font-primary px-1.5 py-0.5"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 4. Excerpt Paragraph (Locked 3-Line Reserve) -->
        <p class="section-subparagraph text-secondary-light/90 line-clamp-3 min-h-18 mb-4">
          {{ post.excerpt }}
        </p>
      </div>

      <!-- 5. Standardized Square CTA Button -->
      <div class="w-fit mt-auto pt-px">
        <div class="shrink-0 flex items-center justify-center border-2 border-journey-deep/30 bg-surface-light/60 px-3 h-8 sm:h-9 rounded-sm text-[9px] 2xs:text-[10px] md:text-[11px] font-uppercase tracking-widest text-journey-deep uppercase transition-all duration-300 group-hover:border-intention-blue group-hover:bg-intention-blue group-hover:text-surface-light group-active:border-intention-blue group-active:bg-intention-blue group-active:text-surface-light gap-2 group-active:scale-96">
          <span class="pt-1 leading-none">READ STORY</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
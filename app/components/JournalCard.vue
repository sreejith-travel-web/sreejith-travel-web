<!-- ~/components/JournalCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'

export interface JournalCardItem {
  id: string
  slug: string
  type?: 'insights' | 'stories' | 'articles' | 'case-studies' | string
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
    draggable="false"
    class="group relative w-full h-full p-5 sm:p-6 flex flex-col rounded-2xl overflow-hidden bg-linear-to-br from-soft-peach/10 via-surface-light/45 to-soft-blue/25 border border-journey-deep/22 hover:border-action-blue/50 active:border-action-blue/40 shadow-xs hover:shadow-xl active:shadow-xl transition-all duration-500 text-left outline-none focus-visible:ring-2 focus-visible:ring-action-blue"
  >
    <!-- 1. Top Header Stack (Locked Height Reserve on sm+ so Inset Photos Align Horizontally) -->
    <div class="w-full flex flex-col items-start shrink-0">
      <!-- Category Eyebrow (Single-Line Locked) -->
      <span class="card-tag font-primary font-bold text-dark-gold tracking-[0.12em] truncate max-w-full mb-2.5">
        {{ displayCategory }}
      </span>

      <!-- 3-Line Title Reserve (3 * 1.25em = 3.75em across all responsive font sizes) -->
      <h3 class="card-title font-medium leading-tight text-journey-deep group-hover:text-intention-blue group-active:text-intention-blue transition-colors duration-300 line-clamp-2 sm:min-h-[3em] mb-2">
        {{ post.title }}
      </h3>

      <!-- Gold Accent Rule (Expands & Shifts to Intention Blue on Hover) -->
      <div
        class="w-10 h-0.5 rounded-full bg-dark-gold mb-4 sm:mb-5 transition-all duration-300 ease-editorial group-hover:w-14 group-hover:bg-intention-blue group-active:w-14 group-active:bg-intention-blue"
        aria-hidden="true"
      />
    </div>

    <!-- 2. Inset 3:2 Rounded Photo + Top-Right Read Time Pill -->
    <div class="w-full relative overflow-hidden aspect-3/2 rounded-xl bg-surface-frosted shrink-0 mb-4 sm:mb-5">
      <div class="card-tag font-primary font-semibold tracking-widest absolute top-3 right-3 z-10 px-3 pt-1.5 pb-1 rounded-sm bg-journey-deep/90 backdrop-blur-xs text-surface-light shadow-xs transition-colors duration-300 group-hover:bg-intention-blue group-active:bg-intention-blue">
        {{ post.readTime }}
      </div>

      <img
        :src="post.image"
        :alt="post.alt || post.title"
        width="600"
        height="400"
        draggable="false"
        :loading="eager ? 'eager' : 'lazy'"
        :decoding="eager ? 'sync' : 'async'"
        :fetchpriority="eager ? 'high' : 'low'"
        class="w-full h-full object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-105 group-active:scale-105 select-none"
      />
    </div>

    <!-- 3. Excerpt + Bottom Tags & Outline CTA -->
    <div class="w-full flex flex-col grow justify-between">
      <p class="section-subparagraph text-secondary-light/95 leading-[1.6] line-clamp-3 sm:min-h-[4.8em] mb-5">
        {{ post.excerpt }}
      </p>

      <div class="w-full flex flex-col items-start gap-4 mt-auto">
        <!-- 3 Auto-Width Hashtag Pills -->
        <div
          v-if="post.tags && post.tags.length"
          class="flex flex-wrap items-center gap-1.5"
        >
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="rounded-sm bg-surface-light/85 border border-journey-deep/16 text-journey-deep/85 card-tag font-primary font-medium px-2.5 pt-1.5 pb-1 transition-colors duration-300 group-hover:border-journey-deep/28"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Rounded Outline CTA Button -->
        <div class="w-fit">
          <div class="shrink-0 inline-flex items-center justify-center border-[1.5px] border-journey-deep/35 bg-surface-light/80 px-3 h-9 rounded-sm text-[10px] md:text-[11px] font-uppercase font-semibold tracking-[0.18em] text-journey-deep uppercase transition-all duration-300 group-hover:border-intention-blue group-hover:bg-intention-blue group-hover:text-surface-light group-active:border-intention-blue group-active:bg-intention-blue group-active:text-surface-light gap-2 group-active:scale-96">
            <span class="pt-1 leading-none">READ STORY</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
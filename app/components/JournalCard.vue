<!-- ~/app/components/JournalCard.vue -->
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

const visibleTags = computed(() => (props.post.tags || []).slice(0, 3))
</script>

<template>
  <NuxtLink
    :to="resolvedHref"
    draggable="false"
    class="group relative w-full h-full p-4.5 sm:p-5 2xl:p-6 flex flex-col rounded-2xl overflow-hidden bg-linear-to-br from-soft-peach/10 via-surface-light/45 to-soft-blue/25 border border-journey-deep/20 hover:border-action-blue/45 active:border-action-blue/45 shadow-xs hover:shadow-md active:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-500 ease-editorial text-left outline-none focus-visible:ring-2 focus-visible:ring-action-blue"
  >
    <!-- 1. Top Header Stack (Exact 2.5em 2-Line Reserve so Inset Photos Align Horizontally) -->
    <div class="w-full flex flex-col items-start shrink-0">
      <span class="card-tag font-primary! font-bold text-dark-gold tracking-[0.12em] truncate max-w-full mb-2">
        {{ displayCategory }}
      </span>

      <h3 class="card-title drop-shadow-none! font-medium leading-tight text-journey-deep group-hover:text-intention-blue group-active:text-intention-blue transition-colors duration-300 line-clamp-2 sm:min-h-[2.5em] mb-2.5">
        {{ post.title }}
      </h3>

      <!-- GPU Scale-X Accent Rule -->
      <div
        aria-hidden="true"
        class="w-14 h-0.5 rounded-full bg-dark-gold mb-4 sm:mb-5 origin-left scale-x-70 transition-all duration-500 ease-editorial group-hover:scale-x-100 group-hover:bg-intention-blue group-active:scale-x-100 group-active:bg-intention-blue"
      />
    </div>

    <!-- 2. Inset 3:2 Rounded Photo + Top-Right Read Time Pill -->
    <div class="w-full relative overflow-hidden aspect-3/2 rounded-xl bg-surface-frosted shrink-0 mb-4 sm:mb-5">
      <div class="card-tag font-primary! font-semibold tracking-widest absolute top-3 right-3 z-10 px-3 pt-1.5 pb-1 rounded-sm bg-journey-deep/90 backdrop-blur-xs text-surface-light shadow-xs transition-colors duration-300 group-hover:bg-intention-blue group-active:bg-intention-blue">
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
        class="pointer-events-none select-none w-full h-full object-cover object-center transition-transform duration-700 ease-editorial group-hover:scale-105 group-active:scale-103"
      />
    </div>

    <!-- 3. Excerpt + Multi-Line-Safe Footer (Tags Left + Scale-Only Ring CTA Bottom-Right) -->
    <div class="w-full flex flex-col grow justify-between">
      <p class="section-subparagraph text-secondary-light/95 leading-[1.6] line-clamp-3 sm:min-h-[4.8em] mb-4">
        {{ post.excerpt }}
      </p>

      <div class="w-full mt-auto pt-1 flex items-end justify-between gap-3 min-h-14.5">
        <!-- 2-Line Capped Tag Tray (Never Pushes Card Height or Ring Position) -->
        <div class="self-end flex-1 min-w-0 flex flex-wrap items-center content-start gap-1.5 max-h-14.5 overflow-hidden">
          <span
            v-for="tag in visibleTags"
            :key="tag"
            class="card-tag inline-flex items-center h-6.5 max-w-full truncate rounded-sm bg-surface-light/85 border border-journey-deep/16 text-journey-deep/85 font-primary! font-medium px-2.5 pb-px leading-none transition-colors duration-300 group-hover:border-journey-deep/28"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Scale-Only Circular Ring CTA (Zero Inner Arrow Translation) -->
        <div
          aria-hidden="true"
          class="itinerary-cta-circle shrink-0 self-end w-9.5! h-9.5! sm:w-10! sm:h-10! text-dark-gold transition-all duration-500 ease-editorial group-hover:text-intention-blue group-hover:scale-108 group-active:text-intention-blue group-active:scale-96"
        >
          <svg
            class="w-full h-full overflow-visible"
            viewBox="0 0 44 44"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="22" cy="22" r="20.5" class="itinerary-cta-ring" />
            <g
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
  </NuxtLink>
</template>
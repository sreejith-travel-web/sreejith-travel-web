<!-- ~/components/JournalFeatured.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JournalCardItem } from '~/components/JournalCard.vue'

const props = withDefaults(
  defineProps<{
    items: JournalCardItem[]
    showHeader?: boolean
    eyebrow?: string
    titleLine1?: string
    titleLine2Cursive?: string
  }>(),
  {
    showHeader: true,
    eyebrow: 'FEATURED DISPATCH',
    titleLine1: 'Stories worth slowing',
    titleLine2Cursive: 'Down for.'
  }
)

const currentIndex = ref(0)

const total = computed(() => props.items.length)

const formattedIndex = computed(() => {
  if (!total.value) return '00 / 00'
  const current = String(currentIndex.value + 1).padStart(2, '0')
  const max = String(total.value).padStart(2, '0')
  return `${current} / ${max}`
})

const resolveHref = (slug: string) => {
  if (!slug) return '/journal'
  return slug.startsWith('/') ? slug : `/journal/${slug}`
}

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
  <div
    v-if="items.length > 0"
    class="w-full max-w-5xl mx-auto flex flex-col items-center"
  >
    <!-- Zero-CLS Single-Cell Grid Deck (Narrower Centered Card) -->
    <div class="w-full grid grid-cols-1 rounded-2xl overflow-hidden bg-linear-to-br from-surface-light via-soft-blue/16 to-soft-blue/30 border border-journey-deep/12 shadow-sm duration-500 hover:shadow-xl active:shadow-xl ">
      <NuxtLink
        v-for="(post, idx) in items"
        :key="post.id"
        :to="resolveHref(post.slug)"
        :tabindex="currentIndex === idx ? 0 : -1"
        :aria-hidden="currentIndex !== idx"
        class="group col-start-1 row-start-1 w-full grid grid-cols-1 lg:grid-cols-12 items-stretch transition-opacity duration-500 ease-editorial will-change-[opacity]"
        :class="
          currentIndex === idx
            ? 'opacity-100 z-10 pointer-events-auto'
            : 'opacity-0 z-0 pointer-events-none select-none'
        "
      >
        <!-- Left Image Column (7 Cols on Desktop) -->
        <div class="lg:col-span-7 relative w-full aspect-16/10 sm:aspect-video lg:aspect-auto lg:min-h-96 overflow-hidden bg-surface-frosted">
          <div class="card-tag absolute top-3.5 left-3.5 z-10 bg-journey-deep group-hover:bg-intention-blue group-active:bg-intention-blue transition-colors duration-300 text-surface-light px-3 pt-2 pb-1.5 rounded-sm shadow-xs">
            Featured Story
          </div>

          <img
            :src="post.image"
            :alt="post.alt"
            width="760"
            height="500"
            :loading="idx === 0 ? 'eager' : 'lazy'"
            decoding="async"
            :fetchpriority="idx === 0 ? 'high' : 'low'"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105"
          />
        </div>

        <!-- Right Content Column (5 Cols on Desktop) -->
        <div class="lg:col-span-5 p-6 sm:p-8 md:p-9 flex flex-col justify-between text-left">
          <div class="flex flex-col items-start">
            <!-- Category & Read Time Meta -->
            <div class="card-tag font-primary text-journey-deep/75 font-semibold mb-2.5 flex items-center gap-2 flex-wrap">
              <span class="text-dark-gold font-bold">
                {{ post.categoryLabel || post.category }}
              </span>
              <span class="w-1 h-1 rounded-full bg-journey-deep/30" />
              <span>{{ post.readTime }}</span>
            </div>

            <!-- Title -->
            <h3 class="section-smaller-subtitle text-journey-deep group-hover:text-intention-blue group-active:text-intention-blue transition-colors duration-300 line-clamp-2 mb-3">
              {{ post.title }}
            </h3>

            <!-- Subtle Editorial Gradient Rule -->
            <div class="w-9 h-0.5 rounded-full bg-linear-to-r from-dark-gold to-action-blue/45 mb-4" />

            <!-- 3 Tag Pills (Above Excerpt Paragraph) -->
            <div
              v-if="post.tags && post.tags.length"
              class="flex flex-wrap items-center gap-1.5 mb-4"
            >
              <span
                v-for="tag in post.tags.slice(0, 3)"
                :key="tag"
                class="rounded-sm bg-surface-dark/8 border border-journey-deep/10 text-journey-deep/80 card-tag font-primary px-2 py-0.75"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Excerpt -->
            <p class="section-subparagraph text-secondary-light/90 line-clamp-4 mb-6">
              {{ post.excerpt }}
            </p>
          </div>

          <!-- Standardized Square CTA Button -->
          <div class="w-fit mt-auto">
            <div class="shrink-0 flex items-center justify-center border-2 border-journey-deep/30 bg-surface-light/70 px-4 h-10 rounded-sm text-[10px] md:text-[11px] font-uppercase tracking-widest text-journey-deep uppercase transition-all duration-300 group-hover:border-intention-blue group-hover:bg-intention-blue group-hover:text-surface-light group-active:border-intention-blue group-active:bg-intention-blue group-active:text-surface-light gap-2 group-active:scale-96">
              <span class="pt-1 leading-none">READ STORY</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
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
      </NuxtLink>
    </div>

    <!-- Pagination Controls (Automatically shown when > 1 Featured Story exists) -->
    <div
      v-if="total > 1"
      class="flex items-center justify-center gap-5 mt-5 sm:mt-6 h-10"
    >
      <button
        type="button"
        aria-label="Previous featured story"
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
        aria-label="Next featured story"
        @click="nextSlide"
        class="w-10 h-10 rounded-full border border-journey-deep/25 flex items-center justify-center text-journey-deep transition-all duration-300 hover:border-intention-blue hover:bg-intention-blue hover:text-surface-light active:border-intention-blue active:bg-intention-blue active:text-surface-light active:scale-95 cursor-pointer"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>
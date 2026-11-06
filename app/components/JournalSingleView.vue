<!-- ~/components/JournalSingleView.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useSeoMeta } from '#imports'
import PageHero from '~/components/PageHero.vue'
import RelatedStories from '~/components/RelatedStories.vue'
import type { JournalFullRecord, JournalMeta } from '~~/server/utils/journalData'

const props = defineProps<{
  record: JournalFullRecord
  related: JournalMeta[]
}>()

const heroData = computed(() => ({
  eyebrow: `${props.record.meta.categoryLabel} · ${props.record.meta.readTime}`,
  titleMain: props.record.meta.title,
  titleItalic: props.record.meta.type === 'case-studies' ? 'Case Study & Field Impact' : 'Field Notes & Perspectives',
  intro: props.record.meta.excerpt,
  imageDesktop: props.record.meta.image,
  imageMobile: props.record.meta.image,
  alt: props.record.meta.alt
}))

// Automatically generate Table of Contents from heading blocks
const toc = computed(() => {
  return props.record.blocks
    .filter((b) => b.type === 'heading' && b.title)
    .map((b) => ({
      id: b.id || (b.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      text: b.title || ''
    }))
})

const relatedConfig = computed(() => ({
  eyebrow: 'CONTINUE READING',
  titleLine1: 'Related',
  titleLine2Cursive: 'Stories.',
  posts: props.related.map((item) => ({
    id: item.id,
    slug: `/journal/${item.slug}`,
    title: item.title,
    excerpt: item.excerpt,
    category: item.categoryLabel,
    readTime: item.readTime,
    tags: item.tags,
    image: item.image,
    alt: item.alt
  }))
}))

const scrollToHeading = (id: string) => {
  if (!import.meta.client) return
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 110
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

useSeoMeta({
  title: `${props.record.meta.title} | Journal`,
  description: props.record.meta.excerpt,
  ogType: 'article',
  ogTitle: props.record.meta.title,
  ogDescription: props.record.meta.excerpt,
  ogImage: props.record.meta.image
})
</script>

<template>
  <div class="overflow-x-hidden bg-bg-light text-primary-light">
    <PageHero :data="heroData" />

    <section data-theme="light" class="section-wrapper bg-bg-light">
      <div class="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        <!-- Left Sticky Sidebar: Back Link + Table of Contents -->
        <aside class="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-28 pb-6 lg:pb-0 border-b lg:border-b-0 border-divider-light">
          <NuxtLink
            :to="`/journal/${record.meta.type}`"
            class="inline-flex items-center gap-2 font-uppercase text-[11px] tracking-[0.2em] uppercase text-journey-deep hover:text-intention-blue active:text-intention-blue transition-colors"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 12H5m7 7-7-7 7-7" />
            </svg>
            <span>Back to {{ record.meta.type === 'case-studies' ? 'Case Studies' : 'Articles' }}</span>
          </NuxtLink>

          <div
            v-if="toc.length > 0"
            class="p-5 rounded-2xl bg-surface-light border border-journey-deep/10 shadow-2xs flex flex-col gap-3"
          >
            <span class="card-eyebrow text-dark-gold font-semibold">
              IN THIS STORY
            </span>
            <nav aria-label="Table of contents" class="flex flex-col gap-2.5">
              <button
                v-for="item in toc"
                :key="item.id"
                type="button"
                @click="scrollToHeading(item.id)"
                class="text-left section-subparagraph text-secondary-light hover:text-intention-blue active:text-intention-blue transition-colors cursor-pointer"
              >
                {{ item.text }}
              </button>
            </nav>
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <span
              v-for="tag in record.meta.tags"
              :key="tag"
              class="px-2.5 py-1 rounded-full bg-soft-cream/55 border border-dark-gold/25 text-journey-deep text-[11px]"
            >
              {{ tag }}
            </span>
          </div>
        </aside>

        <!-- Right Editorial Blocks Column -->
        <article class="lg:col-span-9 flex flex-col gap-8 max-w-3xl text-left">
          <template v-for="(block, idx) in record.blocks" :key="idx">
            
            <!-- Heading Block -->
            <h2
              v-if="block.type === 'heading'"
              :id="block.id"
              class="section-subtitle text-journey-deep pt-4"
            >
              {{ block.title }}
            </h2>

            <!-- Paragraph Block -->
            <p
              v-else-if="block.type === 'paragraph'"
              class="hero-paragraph text-secondary-light"
            >
              {{ block.text }}
            </p>

            <!-- Quote Block -->
            <div
              v-else-if="block.type === 'quote'"
              class="my-4 p-8 sm:p-10 rounded-2xl bg-soft-cream/35 border border-dark-gold/20 flex flex-col items-start"
            >
              <blockquote class="signature-quote text-journey-deep mb-4">
                “{{ block.text }}”
              </blockquote>
              <cite v-if="block.quoteAuthor" class="not-italic section-midsubtitle text-dark-gold mb-0">
                — {{ block.quoteAuthor }}
              </cite>
            </div>

            <!-- Image Split Block -->
            <div
              v-else-if="block.type === 'image-split'"
              class="my-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-surface-light border border-journey-deep/10 shadow-2xs"
            >
              <div class="md:col-span-6 aspect-4/3 rounded-xl overflow-hidden bg-surface-frosted">
                <img
                  :src="block.image"
                  :alt="block.imageAlt || block.title"
                  width="600"
                  height="450"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="md:col-span-6 flex flex-col">
                <h3 class="card-title text-journey-deep mb-2">
                  {{ block.title }}
                </h3>
                <p class="section-subparagraph text-secondary-light">
                  {{ block.text }}
                </p>
              </div>
            </div>

            <!-- Checkmark Highlights Block -->
            <div
              v-else-if="block.type === 'highlights' && block.items"
              class="p-6 sm:p-8 rounded-2xl bg-soft-blue/20 border border-journey-deep/10 flex flex-col gap-4"
            >
              <h3 class="card-title text-journey-deep mb-1">
                {{ block.title }}
              </h3>
              <ul class="flex flex-col gap-3">
                <li
                  v-for="(point, pIdx) in block.items"
                  :key="pIdx"
                  class="flex items-start gap-3"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    class="w-5 h-5 text-dark-gold shrink-0 mt-0.5"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span class="section-subparagraph text-journey-deep/90">
                    {{ point }}
                  </span>
                </li>
              </ul>
            </div>

          </template>
        </article>

      </div>
    </section>

    <RelatedStories
      v-if="related.length > 0"
      :data="relatedConfig"
    />
  </div>
</template>
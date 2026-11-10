<!-- ~/components/JournalSingleView.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useSeoMeta } from '#imports'
import JournalHeader, { type JournalHeaderData } from '~/components/journal/JournalHeader.vue'
import JournalSidebar, { type JournalTocItem } from '~/components/journal/JournalSidebar.vue'
import RelatedStories from '~/components/RelatedStories.vue'
import type { JournalFullRecord, JournalContentBlock, JournalMeta } from '~~/server/utils/journalData'
import JournalTextBlock from '~/components/journal/JournalTextBlock.vue'
import JournalAuthorProfile from '~/components/journal/JournalAuthorProfile.vue'
import JournalQuoteBlock from '~/components/journal/JournalQuoteBlock.vue'
import JournalCalloutBlock from '~/components/journal/JournalCalloutBlock.vue'
import JournalBannerBlock from '~/components/journal/JournalBannerBlock.vue'
import Lightbox, {
  type LightboxMediaItem,
  type LightboxOpenPayload
} from '~/components/Lightbox.vue'
import JournalYoutubeBlock from '~/components/journal/JournalYoutubeBlock.vue'
import JournalSliderBlock from '~/components/journal/JournalSliderBlock.vue'
import JournalHorizontalSliderBlock from '~/components/journal/JournalHorizontalSliderBlock.vue'
import JournalMasonryBlock from '~/components/journal/JournalMasonryBlock.vue'
import { stripJournalHtml } from '~/components/journal/JournalMediaHeader.vue'
import JournalImageSplitBlock from '~/components/journal/JournalImageSplitBlock.vue'

const lightboxOpen = ref(false)
const lightboxItems = ref<LightboxMediaItem[]>([])
const lightboxIndex = ref(0)

const handleOpenLightbox = (payload: LightboxOpenPayload) => {
  if (!payload?.items?.length) return
  lightboxItems.value = payload.items
  lightboxIndex.value = payload.index ?? 0
  lightboxOpen.value = true
}

const handleCloseLightbox = () => {
  lightboxOpen.value = false
}

const props = defineProps<{
  record: JournalFullRecord
  related: JournalMeta[]
}>()

const headerData = computed<JournalHeaderData>(() => ({
  breadcrumbs: [
    { label: 'HOME', to: '/' },
    { label: 'JOURNAL', to: '/journal' },
    { label: props.record.meta.title.toUpperCase() }
  ],
  contentTypeLabel: props.record.meta.contentTypeLabel || 'INSIGHT',
  subcategoryLabel: props.record.meta.subcategoryLabel || 'LIVING HERITAGE',
  title: props.record.meta.title,
  intro: props.record.meta.excerpt,
  publishDate: props.record.meta.publishDate,
  author: props.record.meta.author || 'Sree Jith',
  readTime: props.record.meta.readTime,
  coverImage: props.record.meta.image,
  coverAlt: props.record.meta.alt,
  headerQuote:
    props.record.meta.headerQuote || 'Every place carries stories worth preserving.',
  tags: props.record.meta.tags
}))

// Supports both flat Journal blocks and Itinerary-style { type, data: { ... } } blocks
const normalizedBlocks = computed<JournalContentBlock[]>(() =>
  (props.record.blocks || []).map((b) => {
    if (!b.data || typeof b.data !== 'object') return b
    const { data, ...topLevel } = b
    return {
      ...data,
      ...topLevel,
      id: topLevel.id || data.sectionId || data.id
    }
  })
)

// Automatically generate Table of Contents from heading, H2 text, and titleLevel: 1 media blocks
const toc = computed<JournalTocItem[]>(() => {
  return normalizedBlocks.value
    .filter(
      (b) =>
        Boolean(b.title) &&
        (b.type === 'heading' ||
          b.titleLevel === 1 ||
          (b.type === 'text' && b.titleLevel === undefined))
    )
    .map((b) => {
      const cleanText = stripJournalHtml(b.title)
      return {
        id:
          b.id?.trim() ||
          cleanText
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        text: cleanText
      }
    })
    .filter((item) => Boolean(item.id && item.text))
})
const activeHeadingId = ref<string>(toc.value[0]?.id || '')

watch(
  toc,
  (newToc) => {
    activeHeadingId.value = newToc[0]?.id || ''
  },
  { immediate: true }
)

// Passive rAF Scroll-Spy Engine
let rafId: number | null = null

const updateActiveHeadingOnScroll = () => {
  rafId = null
  if (!import.meta.client || !toc.value.length) return

  const triggerOffset = window.innerWidth < 1024 ? 175 : 160
  let currentId = toc.value[0]?.id || ''

  for (const item of toc.value) {
    const el = document.getElementById(item.id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= triggerOffset) {
      currentId = item.id
    } else {
      break
    }
  }

  // If scrolled to the very bottom of the article, highlight the final heading
  const lastItem = toc.value[toc.value.length - 1]
  if (lastItem) {
    const lastEl = document.getElementById(lastItem.id)
    if (lastEl && window.innerHeight + window.scrollY >= document.body.offsetHeight - 120) {
      currentId = lastItem.id
    }
  }

  activeHeadingId.value = currentId
}

const onWindowScroll = () => {
  if (rafId !== null) return
  rafId = requestAnimationFrame(updateActiveHeadingOnScroll)
}

const scrollToHeading = (id: string) => {
  if (!import.meta.client) return
  activeHeadingId.value = id
  const el = document.getElementById(id)
  if (el) {
    const offset = window.innerWidth < 1024 ? 145 : 115
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
}

const onInlineScrollTo = (e: Event) => {
  const id = (e as CustomEvent<{ id?: string }>).detail?.id
  if (id) {
    e.preventDefault()
    scrollToHeading(id)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onWindowScroll, { passive: true })
  nextTick(updateActiveHeadingOnScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onWindowScroll)
  if (rafId !== null) cancelAnimationFrame(rafId)
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
  <div class="overflow-x-clip bg-bg-light text-primary-light">
    <JournalHeader :data="headerData" />

    <section data-theme="light" class="section-wrapper bg-bg-light pt-2! sm:pt-4!">
      <div class="w-full max-w-360 mx-auto">
        <!-- Mobile & Tablet Sticky Bar (< 1024px) -->
        <JournalSidebar
          mode="mobile"
          :toc="toc"
          :active-id="activeHeadingId"
          :title="record.meta.title"
          :excerpt="record.meta.excerpt"
          @select="scrollToHeading"
        />

        <!-- Main Workspace Grid: 4:8 on lg | 3:9 on xl -->
        <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          <!-- Left Sticky Sidebar (Desktop lg+) -->
          <aside class="hidden lg:block lg:col-span-4 xl:col-span-3 lg:sticky lg:top-28">
            <JournalSidebar
              mode="desktop"
              :toc="toc"
              :active-id="activeHeadingId"
              :title="record.meta.title"
              :excerpt="record.meta.excerpt"
              @select="scrollToHeading"
            />
          </aside>

          <!-- Right Editorial Blocks Column -->
          <article
            class="lg:col-span-8 xl:col-span-9 w-full flex flex-col gap-6 sm:gap-7 text-left"
            @journal-scroll-to="onInlineScrollTo"
          >
            <template v-for="(block, idx) in normalizedBlocks" :key="idx">
              
              <!-- Unified Rich-Text, Multi-Level Heading & Staggered List Block -->
              <JournalTextBlock
                v-if="block.type === 'text' || block.type === 'heading' || block.type === 'paragraph'"
                :block="block"
              />

              <!-- Editorial Quote Block (Boxed Cream/Blue + Left-Border Gold/Blue) -->
              <JournalQuoteBlock
                v-else-if="block.type === 'quote'"
                :block="block"
              />

              <!-- Split Image & Editorial Text Card (Sticky + Dynamic Width/Ratio + Lightbox) -->
              <JournalImageSplitBlock
                v-else-if="block.type === 'image-split'"
                :block="block"
                @open-lightbox="handleOpenLightbox"
              />

              <!-- Global YouTube Video Feature (Flush) -->
              <JournalYoutubeBlock
                v-else-if="block.type === 'youtube'"
                :block="block"
              />

              <!-- Global Thumbnail Slider (Flush) -->
              <JournalSliderBlock
                v-else-if="block.type === 'slider'"
                :block="block"
                @open-lightbox="handleOpenLightbox"
              />

              <!-- Global Variable-Width Horizontal Slider (Flush) -->
              <JournalHorizontalSliderBlock
                v-else-if="block.type === 'horizontal-slider'"
                :block="block"
                @open-lightbox="handleOpenLightbox"
              />

              <!-- Global Masonry Gallery / Single Full-Width Frame (Flush) -->
              <JournalMasonryBlock
                v-else-if="block.type === 'masonry'"
                :block="block"
                @open-lightbox="handleOpenLightbox"
              />

              <!-- Flat Informative Callout / Highlights Box (Cream & Blue) -->
              <JournalCalloutBlock
                v-else-if="
                  block.type === 'callout' ||
                  block.type === 'callout-note' ||
                  block.type === 'highlights'
                "
                :block="block"
              />

              <!-- Contextual Dark Interlink Banners (6 Presets + Full Client Overrides) -->
              <JournalBannerBlock
                v-else-if="
                  block.type === 'cta-banner' ||
                  block.type === 'banner' ||
                  block.type.startsWith('banner-')
                "
                :block="block"
              />

              <!-- Author Profile Card -->
              <JournalAuthorProfile
                v-else-if="block.type === 'author-profile'"
                :block="block"
              />
              
            </template>
          </article>
        </div>
      </div>
    </section>

    <!-- Shared Full-Screen Lightbox for Sliders, Masonry & Image-Split -->
    <Lightbox
      :is-open="lightboxOpen"
      :items="lightboxItems"
      :initial-index="lightboxIndex"
      @close="handleCloseLightbox"
    />

    <RelatedStories
      v-if="related.length > 0"
      :data="relatedConfig"
    />
  </div>
</template>
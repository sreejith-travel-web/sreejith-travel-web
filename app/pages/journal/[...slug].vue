<!-- ~/app/pages/journal/[...slug].vue -->
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useAsyncData, createError } from '#imports'
import PageHero from '~/components/PageHero.vue'
import InnerPageHeader from '~/components/InnerPageHeader.vue'
import JournalFeatured from '~/components/JournalFeatured.vue'
import JournalSingleView from '~/components/JournalSingleView.vue'
import type { JournalMeta, JournalPostType, JournalFullRecord } from '~~/server/utils/journalData'

const route = useRoute()

const rawSlug = route.params.slug
const slugParts = Array.isArray(rawSlug)
  ? rawSlug.filter(Boolean)
  : typeof rawSlug === 'string' && rawSlug.length > 0
    ? [rawSlug]
    : []

const slug0 = slugParts[0]?.toLowerCase() || null

const resolveTabFromSlug = (segment: string | null): JournalPostType | null => {
  if (!segment) return null
  if (segment === 'articles' || segment === 'article') return 'articles'
  if (segment === 'case-studies' || segment === 'case-study' || segment === 'casestudies') return 'case-studies'
  return null
}

const matchedTab = resolveTabFromSlug(slug0)
const isArchiveRoute = computed(() => !slug0 || matchedTab !== null)

const activeTab = ref<JournalPostType>(matchedTab || 'articles')
const shouldScrollToWorkspaceOnMount = ref(Boolean(matchedTab))

const { data: archivePosts } = await useAsyncData<JournalMeta[]>(
  'journal-collection',
  () => (isArchiveRoute.value ? $fetch('/api/journal') : Promise.resolve([])),
  { default: () => [] }
)

const { data: singlePayload, error: singleError } = await useAsyncData<{
  record: JournalFullRecord
  related: JournalMeta[]
} | null>(
  `journal-single-${slug0 || 'index'}`,
  () => (!isArchiveRoute.value && slug0 ? $fetch(`/api/journal/${slug0}`) : Promise.resolve(null))
)

if (!isArchiveRoute.value && (singleError.value || !singlePayload.value?.record)) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Story or Case Study Not Found',
    fatal: true
  })
}

// Featured Journal items (Filtered by featured: true)
const featuredJournalPosts = computed(() =>
  (archivePosts.value || []).filter((post) => post.featured)
)

const pageData = {
  hero: {
    eyebrow: 'FROM THE JOURNAL',
    titleMain: 'Stories That Travel',
    titleItalic: 'Beyond The Journey',
    intro: 'Observations, perspectives, case studies, and field notes from years of research and on-the-ground cultural discovery.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Stories and field notes from the journal'
  },
  intro: {
    eyebrow: 'WHAT TRAVEL MEANS TO ME',
    titleLine1: 'Places tell you where you are.',
    titleLine2Cursive: 'People tell you why it matters.',
    description: 'I believe people are the destination, along with the places and everything they represent. The most memorable journeys are created through conversations, relationships, and moments that cannot be found in a guidebook.'
  }
}

const handleTabUpdate = (newTab: JournalPostType) => {
  activeTab.value = newTab
  if (import.meta.client) {
    window.history.replaceState({}, '', `/journal/${newTab}`)
  }
}

const scrollToWorkspace = () => {
  if (!import.meta.client) return
  const el = document.getElementById('journal-workspace')
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (shouldScrollToWorkspaceOnMount.value) {
    nextTick(() => {
      setTimeout(scrollToWorkspace, 350)
    })
  }
})
</script>

<template>
  <div>
    <!-- BRANCH A: JOURNAL ARCHIVE WORKSPACE -->
    <div v-if="isArchiveRoute" class="overflow-x-hidden bg-bg-light">
      <PageHero :data="pageData.hero" />
      <InnerPageHeader :data="pageData.intro" />

      <!-- 1. Standalone Featured Journal Slider (Centered Narrower Container) -->
      <section data-theme="light" class="section-wrapper py-8 sm:py-10 md:py-12 xl:py-15 bg-bg-light pt-2 sm:pt-4">
        <JournalFeatured :items="featuredJournalPosts" />
      </section>

      <!-- 2. Main Search, Tabs & 3-Column Card Listing -->
      <LazyJournalListing
        hydrate-on-visible
        :items="archivePosts"
        :active-tab="activeTab"
        @update:active-tab="handleTabUpdate"
      />
    </div>

    <!-- BRANCH B: INDIVIDUAL ARTICLE OR CASE STUDY VIEW -->
    <JournalSingleView
      v-else-if="singlePayload?.record"
      :record="singlePayload.record"
      :related="singlePayload.related"
    />
  </div>
</template>
<!-- ~/app/pages/itineraries/[...slug].vue -->
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useAsyncData, createError } from '#imports'
import PageHero from '~/components/PageHero.vue'
import InnerPageHeader from '~/components/InnerPageHeader.vue'
import ItineraryFeatured from '~/components/ItineraryFeatured.vue'
import ItinerarySingleView from '~/components/ItinerarySingleView.vue'
import { useTravelSeo } from '~/composables/useTravelSeo'
import type {
  ItineraryMeta,
  ItineraryCategoryId,
  ItinerarySinglePayload
} from '~~/server/utils/itinerariesData'
import type { ItineraryTabFilter } from '~/components/ItineraryListing.vue'

const route = useRoute()

const VALID_CATEGORIES: ItineraryCategoryId[] = [
  'nature',
  'culture',
  'stays',
  'offbeat',
  'wellness',
  'bespoke'
]

const VALID_TABS: ItineraryTabFilter[] = ['signature', 'collaborated', 'categories']

const rawSlug = route.params.slug
const slugParts = Array.isArray(rawSlug)
  ? rawSlug.filter(Boolean)
  : typeof rawSlug === 'string' && rawSlug.length > 0
    ? [rawSlug]
    : []

const slug0 = slugParts[0]?.toLowerCase() || null
const slug1 = slugParts[1]?.toLowerCase() || null

const isArchiveRoute = computed(() => {
  if (!slug0) return true
  if (VALID_TABS.includes(slug0 as ItineraryTabFilter)) return true
  if (VALID_CATEGORIES.includes(slug0 as ItineraryCategoryId)) return true
  return false
})

const activeTab = ref<ItineraryTabFilter>('signature')
const selectedCategories = ref<ItineraryCategoryId[]>([])
const shouldScrollToFilterOnMount = ref(false)

if (isArchiveRoute.value && slug0) {
  shouldScrollToFilterOnMount.value = true

  if (slug0 === 'signature' || slug0 === 'collaborated') {
    activeTab.value = slug0
    selectedCategories.value = []
  } else if (slug0 === 'categories') {
    activeTab.value = 'categories'
    if (slug1 && VALID_CATEGORIES.includes(slug1 as ItineraryCategoryId)) {
      selectedCategories.value = [slug1 as ItineraryCategoryId]
    }
  } else if (VALID_CATEGORIES.includes(slug0 as ItineraryCategoryId)) {
    activeTab.value = 'categories'
    selectedCategories.value = [slug0 as ItineraryCategoryId]
  }
}

// 1. Fetch Lightweight Archive Meta List (Only on Archive Routes)
const { data: archiveItems } = await useAsyncData<ItineraryMeta[]>(
  'itineraries-collection',
  () => (isArchiveRoute.value ? $fetch('/api/itineraries') : Promise.resolve([])),
  { default: () => [] }
)

// 2. Fetch Single Itinerary + Pre-Resolved 3 Related Cards (Only on Slug Routes)
const { data: singleRecord, error: singleError } = await useAsyncData<ItinerarySinglePayload | null>(
  `itinerary-single-${slug0 || 'index'}`,
  () => (!isArchiveRoute.value && slug0 ? $fetch(`/api/itineraries/${slug0}`) : Promise.resolve(null))
)

if (!isArchiveRoute.value && (singleError.value || !singleRecord.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: `Itinerary "${slug0}" Not Found`,
    fatal: true
  })
}

// 3. Archive SEO
if (isArchiveRoute.value) {
  useTravelSeo({
    pageTitle: 'Signature Itineraries & Bespoke Routes Across South India',
    pageDesc:
      'Explore handcrafted Signature circuits, Collaborated regional routes, and slow-travel blueprints across Kerala and South India.',
    canonicalPath: '/itineraries',
    ogImage: '/images/favicons/sreejith-og-image.jpg',
    pageType: 'itineraries-index',
    breadcrumbName: 'Itineraries',
    collectionItems: (archiveItems.value || []).map((item) => ({
      title: item.title,
      intro: item.intro,
      url: `/itineraries/${item.slug}`,
      coverImage: item.image
    }))
  })
}

const featuredItineraries = computed(() =>
  (archiveItems.value || []).filter((item) => item.featured)
)

const pageData = {
  hero: {
    eyebrow: 'BESPOKE CIRCUITS',
    titleMain: 'Journeys Designed',
    titleItalic: 'Around Your Rhythm',
    intro: 'Explore handcrafted Signature circuits and Collaborated regional routes across South India and the subcontinent.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Bespoke itineraries across India'
  },
  intro: {
    eyebrow: 'EXPLORING BEYOND DESTINATIONS',
    titleLine1: 'Meaningful for the person.',
    titleLine2Cursive: 'Mindful of the place.',
    description: 'Whether you seek the deep cultural immersion of our Signature Journeys, the specialist perspective of our Collaborated Routes, or wish to begin by selecting the travel styles that move you—every itinerary is shaped with quiet care.'
  }
}

const syncBrowserUrl = () => {
  if (!import.meta.client) return

  if (activeTab.value === 'categories') {
    if (selectedCategories.value.length === 1) {
      window.history.replaceState({}, '', `/itineraries/categories/${selectedCategories.value[0]}`)
    } else {
      window.history.replaceState({}, '', '/itineraries/categories')
    }
  } else {
    window.history.replaceState({}, '', `/itineraries/${activeTab.value}`)
  }
}

const handleTabUpdate = (newTab: ItineraryTabFilter) => {
  activeTab.value = newTab
  syncBrowserUrl()
}

const handleCategoryToggle = (categoryId: ItineraryCategoryId) => {
  activeTab.value = 'categories'
  const idx = selectedCategories.value.indexOf(categoryId)
  if (idx > -1) {
    selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(categoryId)
  }
  syncBrowserUrl()
}

const handleClearFilters = () => {
  selectedCategories.value = []
  syncBrowserUrl()
}

const scrollToFilterWorkspace = () => {
  if (!import.meta.client) return
  const el = document.getElementById('find-your-journey')
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (shouldScrollToFilterOnMount.value) {
    nextTick(() => {
      setTimeout(scrollToFilterWorkspace, 350)
    })
  }
})
</script>

<template>
  <div>
    <!-- BRANCH A: ARCHIVE & FILTER WORKSPACE -->
    <div v-if="isArchiveRoute" class="overflow-x-hidden bg-bg-light">
      <PageHero :data="pageData.hero" />
      <InnerPageHeader :data="pageData.intro" />

      <!-- 1. Featured Itineraries (Untouched Component) -->
      <ItineraryFeatured :items="featuredItineraries" />

      <!-- 2. Find Your Journey 3-Tab Workspace -->
      <LazyItineraryListing
        hydrate-on-visible
        :items="archiveItems"
        :active-tab="activeTab"
        :selected-categories="selectedCategories"
        @update:active-tab="handleTabUpdate"
        @toggle-category="handleCategoryToggle"
        @clear-filters="handleClearFilters"
      />
    </div>

    <!-- BRANCH B: INDIVIDUAL ITINERARY SLUG VIEW -->
    <ItinerarySingleView
      v-else-if="singleRecord"
      :record="singleRecord"
    />
  </div>
</template>
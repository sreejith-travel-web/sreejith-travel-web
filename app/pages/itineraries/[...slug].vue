<!-- ~/app/pages/itineraries/[...slug].vue -->
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, createError } from '#imports'
import PageHero from '~/components/PageHero.vue'
import InnerPageHeader from '~/components/InnerPageHeader.vue'
import ItineraryFeatured from '~/components/ItineraryFeatured.vue'
import ItinerarySingleView from '~/components/ItinerarySingleView.vue'
import { useTravelSeo } from '~/composables/useTravelSeo'
import {
  ITINERARIES_DATABASE,
  buildDefaultItineraryParts,
  type ItineraryMeta,
  type ItineraryCategoryId,
  type ItineraryFullRecord
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

const VALID_TABS: ItineraryTabFilter[] = ['signature', 'collaborated', 'travelyourway']

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

// Default tab is 'signature' when entering /itineraries from Header or Sidebar
const activeTab = ref<ItineraryTabFilter>('signature')
const selectedCategories = ref<ItineraryCategoryId[]>([])
const shouldScrollToFilterOnMount = ref(false)

if (isArchiveRoute.value && slug0) {
  shouldScrollToFilterOnMount.value = true

  if (slug0 === 'signature' || slug0 === 'collaborated') {
    activeTab.value = slug0
    selectedCategories.value = []
  } else if (slug0 === 'travelyourway') {
    activeTab.value = 'travelyourway'
    if (slug1 && VALID_CATEGORIES.includes(slug1 as ItineraryCategoryId)) {
      selectedCategories.value = [slug1 as ItineraryCategoryId]
    }
  } else if (VALID_CATEGORIES.includes(slug0 as ItineraryCategoryId)) {
    activeTab.value = 'travelyourway'
    selectedCategories.value = [slug0 as ItineraryCategoryId]
  }
}

// 1. Resolve Archive Items Directly from ITINERARIES_DATABASE (Zero API 404 risk)
const archiveItems = computed<ItineraryMeta[]>(() =>
  ITINERARIES_DATABASE.map((entry) => entry.meta)
)

// 2. Resolve Single Itinerary Record by Slug or ID + Auto-Upgrade Legacy Items
const singleRecord = computed<ItineraryFullRecord | null>(() => {
  if (isArchiveRoute.value || !slug0) return null

  const found = ITINERARIES_DATABASE.find(
    (entry) =>
      entry.meta.slug.toLowerCase() === slug0 ||
      entry.meta.id.toLowerCase() === slug0
  )

  if (!found) return null

  // If this item already has the new unified 5-section schema, return as-is
  if (found.header && Array.isArray(found.sections) && found.sections.length > 0) {
    return found
  }

  // Otherwise, auto-upgrade legacy { meta, blocks } items so all 28 routes work immediately
  return {
    meta: found.meta,
    ...buildDefaultItineraryParts(found.meta)
  }
})

if (!isArchiveRoute.value && !singleRecord.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `Itinerary "${slug0}" Not Found`,
    fatal: true
  })
}

// 3. Archive SEO (Only runs on /itineraries archive routes)
if (isArchiveRoute.value) {
  useTravelSeo({
    pageTitle: 'Signature Itineraries & Bespoke Routes Across South India',
    pageDesc:
      'Explore handcrafted Signature circuits, Collaborated regional routes, and slow-travel blueprints across Kerala and South India.',
    canonicalPath: '/itineraries',
    ogImage: '/images/favicons/sreejith-og-image.jpg',
    pageType: 'itineraries-index',
    breadcrumbName: 'Itineraries',
    collectionItems: archiveItems.value.map((item) => ({
      title: item.title,
      intro: item.intro,
      url: `/itineraries/${item.slug}`,
      coverImage: item.image
    }))
  })
}

const featuredItineraries = computed(() =>
  archiveItems.value.filter((item) => item.featured)
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

  if (activeTab.value === 'travelyourway') {
    if (selectedCategories.value.length === 1) {
      window.history.replaceState({}, '', `/itineraries/travelyourway/${selectedCategories.value[0]}`)
    } else {
      window.history.replaceState({}, '', '/itineraries/travelyourway')
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
  activeTab.value = 'travelyourway'
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
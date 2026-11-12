<!-- ~/app/pages/itineraries/[...slug].vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onActivated,
  onDeactivated,
  nextTick
} from 'vue'
import { useRoute, useAsyncData, createError } from '#imports'
import PageHero from '~/components/PageHero.vue'
import InnerPageHeader from '~/components/InnerPageHeader.vue'
import ItineraryFeatured from '~/components/ItineraryFeatured.vue'
import ItinerarySingleView from '~/components/ItinerarySingleView.vue'
import { useTravelSeo } from '~/composables/useTravelSeo'
import { useSessionScroll } from '~/composables/useSessionScroll'
import type {
  ItineraryMeta,
  ItineraryCategoryId,
  ItinerarySinglePayload
} from '~~/server/utils/itinerariesData'
import type { ItineraryTabFilter } from '~/components/ItineraryListing.vue'

const route = useRoute()
const {
  hasSavedScrollPosition,
  setActiveRouteAlias,
  saveItinerariesArchiveState,
  getItinerariesArchiveState
} = useSessionScroll()

const VALID_CATEGORIES: ItineraryCategoryId[] = [
  'nature',
  'culture',
  'stays',
  'offbeat',
  'wellness',
  'bespoke'
]

const VALID_TABS: ItineraryTabFilter[] = ['signature', 'collaborated', 'categories']

const slugParts = computed<string[]>(() => {
  const rawSlug = route.params.slug
  if (Array.isArray(rawSlug)) return rawSlug.filter(Boolean)
  if (typeof rawSlug === 'string' && rawSlug.length > 0) return [rawSlug]
  return []
})

const slug0 = computed<string | null>(() => slugParts.value[0]?.toLowerCase() || null)
const slug1 = computed<string | null>(() => slugParts.value[1]?.toLowerCase() || null)

const isArchiveRoute = computed<boolean>(() => {
  if (!slug0.value) return true
  if (VALID_TABS.includes(slug0.value as ItineraryTabFilter)) return true
  if (VALID_CATEGORIES.includes(slug0.value as ItineraryCategoryId)) return true
  return false
})

const activeTab = ref<ItineraryTabFilter>('signature')
const selectedCategories = ref<ItineraryCategoryId[]>([])
const shouldScrollToFilterOnMount = ref(false)
const isPageActive = ref(true)

const resolveArchiveAliasUrl = (): string => {
  if (activeTab.value === 'categories') {
    if (selectedCategories.value.length === 1) {
      return `/itineraries/categories/${selectedCategories.value[0]}`
    }
    return '/itineraries/categories'
  }
  return `/itineraries/${activeTab.value}`
}

const persistArchiveSessionState = (aliasUrl: string) => {
  setActiveRouteAlias(aliasUrl)
  saveItinerariesArchiveState({
    activeTab: activeTab.value,
    selectedCategories: selectedCategories.value,
    aliasPath: aliasUrl
  })
}

const syncBrowserUrl = () => {
  if (!import.meta.client) return
  const targetUrl = resolveArchiveAliasUrl()
  window.history.replaceState({ ...window.history.state }, '', targetUrl)
  persistArchiveSessionState(targetUrl)
}

const syncFilterStateFromRoute = () => {
  if (!isArchiveRoute.value) return

  if (!slug0.value) {
    const savedArchive = getItinerariesArchiveState()
    if (savedArchive) {
      activeTab.value = savedArchive.activeTab
      selectedCategories.value = [...savedArchive.selectedCategories]
      shouldScrollToFilterOnMount.value = false
      if (import.meta.client) {
        window.history.replaceState(
          { ...window.history.state },
          '',
          savedArchive.aliasPath
        )
        setActiveRouteAlias(savedArchive.aliasPath)
      }
      return
    }

    activeTab.value = 'signature'
    selectedCategories.value = []
    shouldScrollToFilterOnMount.value = false
    persistArchiveSessionState('/itineraries')
    return
  }

  // Only auto-scroll to workspace if this specific deep link hasn't been visited yet
  shouldScrollToFilterOnMount.value = !hasSavedScrollPosition(route.path)

  if (slug0.value === 'signature' || slug0.value === 'collaborated') {
    activeTab.value = slug0.value
    selectedCategories.value = []
  } else if (slug0.value === 'categories') {
    activeTab.value = 'categories'
    if (slug1.value && VALID_CATEGORIES.includes(slug1.value as ItineraryCategoryId)) {
      selectedCategories.value = [slug1.value as ItineraryCategoryId]
    } else {
      selectedCategories.value = []
    }
  } else if (VALID_CATEGORIES.includes(slug0.value as ItineraryCategoryId)) {
    activeTab.value = 'categories'
    selectedCategories.value = [slug0.value as ItineraryCategoryId]
  }

  persistArchiveSessionState(route.path)
}

syncFilterStateFromRoute()

// 1. Always fetch the lightweight Archive Meta List (Never return [] on single routes)
const { data: archiveItems } = await useAsyncData<ItineraryMeta[]>(
  'itineraries-collection',
  () => $fetch<ItineraryMeta[]>('/api/itineraries'),
  {
    default: (): ItineraryMeta[] => []
  }
)

// Direct client fallback guarantee so archiveItems is never empty after breadcrumb navigation
const ensureArchiveItemsLoaded = async () => {
  if (!import.meta.client) return
  if (!archiveItems.value || archiveItems.value.length === 0) {
    try {
      archiveItems.value = await $fetch<ItineraryMeta[]>('/api/itineraries')
    } catch (err) {
      console.error('[itineraries] Failed to load archive items:', err)
    }
  }
}

// 2. Fetch Single Itinerary + Pre-Resolved 3 Related Cards (Only on Slug Routes)
const {
  data: singleRecord,
  error: singleError,
  status: singleStatus
} = await useAsyncData<ItinerarySinglePayload | null>(
  () => `itinerary-single-${slug0.value || 'index'}`,
  (): Promise<ItinerarySinglePayload | null> =>
    !isArchiveRoute.value && slug0.value
      ? $fetch<ItinerarySinglePayload>(`/api/itineraries/${slug0.value}`)
      : Promise.resolve(null),
  {
    watch: [slug0]
  }
)

if (!isArchiveRoute.value && (singleError.value || !singleRecord.value)) {
  throw createError({
    statusCode: 404,
    statusMessage: `Itinerary "${slug0.value}" Not Found`,
    fatal: true
  })
}

watch(singleStatus, (status) => {
  if (!isPageActive.value || isArchiveRoute.value) return
  if (status === 'error' && singleError.value) {
    throw createError({
      statusCode: 404,
      statusMessage: `Itinerary "${slug0.value}" Not Found`,
      fatal: true
    })
  }
})

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
    collectionItems: (archiveItems.value || []).map((item: ItineraryMeta) => ({
      title: item.title,
      intro: item.intro,
      url: `/itineraries/${item.slug}`,
      coverImage: item.image
    }))
  })
}

const featuredItineraries = computed<ItineraryMeta[]>(() =>
  (archiveItems.value || []).filter((item: ItineraryMeta) => item.featured)
)

const pageData = {
  hero: {
    eyebrow: 'BESPOKE CIRCUITS',
    titleMain: 'Journeys Designed',
    titleItalic: 'Around Your Rhythm',
    intro:
      'Explore handcrafted Signature circuits and Collaborated regional routes across South India and the subcontinent.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Bespoke itineraries across India'
  },
  intro: {
    subtitle: 'Meaningful for the person. Mindful of the place.',
    paragraph:
      'Whether you seek the deep cultural immersion of our Signature Journeys, the specialist perspective of our Collaborated Routes, or wish to begin by selecting the travel styles that move you—every itinerary is shaped with quiet care.'
  },
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
  if (!import.meta.client || !isPageActive.value) return
  const el = document.getElementById('find-your-journey')
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
}

const maybeScrollToFilterWorkspace = () => {
  if (!shouldScrollToFilterOnMount.value) return
  shouldScrollToFilterOnMount.value = false
  nextTick(() => {
    // Runs cleanly right after app.vue's 550ms route curtain lifts
    setTimeout(scrollToFilterWorkspace, 620)
  })
}

watch(
  () => route.path,
  async () => {
    if (!isPageActive.value) return
    syncFilterStateFromRoute()
    if (isArchiveRoute.value) {
      await ensureArchiveItemsLoaded()
      maybeScrollToFilterWorkspace()
    }
  }
)

onMounted(async () => {
  isPageActive.value = true
  await ensureArchiveItemsLoaded()
  maybeScrollToFilterWorkspace()
})

onActivated(async () => {
  isPageActive.value = true
  syncFilterStateFromRoute()
  await ensureArchiveItemsLoaded()
  maybeScrollToFilterWorkspace()
})

onDeactivated(() => {
  isPageActive.value = false
})
</script>

<template>
  <div>
    <!-- BRANCH A: ARCHIVE & FILTER WORKSPACE -->
    <div v-if="isArchiveRoute" class="overflow-x-clip bg-bg-light">
      <PageHero :data="pageData.hero" />
      <InnerPageHeader :data="pageData.intro" />

      <!-- 1. Featured Itineraries -->
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
      :key="singleRecord.meta.slug"
      :record="singleRecord"
    />
  </div>
</template>
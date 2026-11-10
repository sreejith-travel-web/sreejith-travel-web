<!-- ~/app/pages/journal/[...slug].vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onActivated, nextTick } from 'vue'
import { useRoute, useAsyncData, createError } from '#imports'
import PageHero from '~/components/PageHero.vue'
import InnerPageHeader from '~/components/InnerPageHeader.vue'
import JournalFeatured from '~/components/JournalFeatured.vue'
import JournalSingleView from '~/components/JournalSingleView.vue'
import type {
  JournalMeta,
  JournalCategoryType,
  JournalSubcategoryId,
  JournalSinglePayload
} from '~~/server/utils/journalData'

const route = useRoute()

// Client-safe subcategory -> parent category map (prevents bundling server/utils into browser)
const SUBCATEGORY_CATEGORY_MAP: Record<JournalSubcategoryId, JournalCategoryType> = {
  'field-notes': 'insights',
  'living-heritage': 'insights',
  'responsible-travel': 'insights',
  'research-perspectives': 'insights',
  'ideas-collaborations': 'insights',
  'people-communities': 'stories',
  'journey-stories': 'stories',
  'travel-experiences': 'stories',
  'traveller-stories': 'stories',
  'case-studies': 'stories'
}

const slugParts = computed<string[]>(() => {
  const rawSlug = route.params.slug
  if (Array.isArray(rawSlug)) return rawSlug.filter(Boolean)
  if (typeof rawSlug === 'string' && rawSlug.length > 0) return [rawSlug]
  return []
})

const slug0 = computed<string | null>(() => slugParts.value[0]?.toLowerCase() || null)
const slug1 = computed<string | null>(() => slugParts.value[1]?.toLowerCase() || null)

const resolveCategoryFromSegment = (segment: string | null): JournalCategoryType | null => {
  if (!segment) return null
  if (
    segment === 'insights' ||
    segment === 'insight' ||
    segment === 'articles' ||
    segment === 'article'
  ) {
    return 'insights'
  }
  if (segment === 'stories' || segment === 'story') {
    return 'stories'
  }
  return null
}

const resolveSubcategoryFromSegment = (segment: string | null): JournalSubcategoryId | null => {
  if (!segment) return null
  if (segment === 'case-study' || segment === 'casestudies') return 'case-studies'
  if (segment in SUBCATEGORY_CATEGORY_MAP) {
    return segment as JournalSubcategoryId
  }
  return null
}

const matchedCategory = computed(() => resolveCategoryFromSegment(slug0.value))
const matchedSubcategory = computed(() =>
  resolveSubcategoryFromSegment(slug1.value || slug0.value)
)

const isArchiveRoute = computed<boolean>(() => {
  if (!slug0.value) return true
  if (matchedCategory.value !== null) return true
  if (matchedSubcategory.value !== null) return true
  return false
})

const activeTab = ref<JournalCategoryType>('insights')
const selectedSubcategories = ref<JournalSubcategoryId[]>([])
const shouldScrollToWorkspaceOnMount = ref(false)

const syncFilterStateFromRoute = () => {
  if (!isArchiveRoute.value) return

  if (!slug0.value) {
    activeTab.value = 'insights'
    selectedSubcategories.value = []
    shouldScrollToWorkspaceOnMount.value = false
    return
  }

  shouldScrollToWorkspaceOnMount.value = true

  if (matchedSubcategory.value) {
    const subId = matchedSubcategory.value
    activeTab.value = SUBCATEGORY_CATEGORY_MAP[subId]
    selectedSubcategories.value = [subId]
    return
  }

  if (matchedCategory.value) {
    activeTab.value = matchedCategory.value
    selectedSubcategories.value = []
  }
}

syncFilterStateFromRoute()

// 1. Always fetch the lightweight Archive Meta List
const { data: archivePosts } = await useAsyncData<JournalMeta[]>(
  'journal-collection',
  () => $fetch<JournalMeta[]>('/api/journal'),
  {
    default: (): JournalMeta[] => []
  }
)

const ensureArchivePostsLoaded = async () => {
  if (!import.meta.client) return
  if (!archivePosts.value || archivePosts.value.length === 0) {
    try {
      archivePosts.value = await $fetch<JournalMeta[]>('/api/journal')
    } catch (err) {
      console.error('[journal] Failed to load archive posts:', err)
    }
  }
}

// 2. Fetch Single Journal Story + 3 Related Cards (Only on Slug Routes)
const { data: singlePayload, error: singleError } = await useAsyncData<JournalSinglePayload | null>(
  () => `journal-single-${slug0.value || 'index'}`,
  (): Promise<JournalSinglePayload | null> =>
    !isArchiveRoute.value && slug0.value
      ? $fetch<JournalSinglePayload>(`/api/journal/${slug0.value}`)
      : Promise.resolve(null),
  {
    watch: [slug0]
  }
)

if (!isArchiveRoute.value && (singleError.value || !singlePayload.value?.record)) {
  throw createError({
    statusCode: 404,
    statusMessage: `Journal Story "${slug0.value}" Not Found`,
    fatal: true
  })
}

const featuredJournalPosts = computed<JournalMeta[]>(() =>
  (archivePosts.value || []).filter((post: JournalMeta) => post.featured)
)

const pageData = {
  hero: {
    eyebrow: 'FROM THE JOURNAL',
    titleMain: 'Stories That Travel',
    titleItalic: 'Beyond The Journey',
    intro:
      'Stories, insights and perspectives from our travels across communities, craft traditions, and living landscapes.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Stories and field notes from the journal'
  },
  intro: {
    eyebrow: 'WHAT TRAVEL MEANS TO ME',
    titleLine1: 'Places tell you where you are.',
    titleLine2Cursive: 'People tell you why it matters.',
    description:
      'I believe people are the destination, along with the places and everything they represent. The most memorable journeys are created through conversations, relationships, and moments that cannot be found in a guidebook.'
  }
}

const syncBrowserUrl = () => {
  if (!import.meta.client) return
  if (selectedSubcategories.value.length === 1) {
    window.history.replaceState(
      {},
      '',
      `/journal/${activeTab.value}/${selectedSubcategories.value[0]}`
    )
  } else {
    window.history.replaceState({}, '', `/journal/${activeTab.value}`)
  }
}

const handleTabUpdate = (newTab: JournalCategoryType) => {
  activeTab.value = newTab
  selectedSubcategories.value = []
  syncBrowserUrl()
}

const handleSubcategoryToggle = (subId: JournalSubcategoryId) => {
  const idx = selectedSubcategories.value.indexOf(subId)
  if (idx > -1) {
    selectedSubcategories.value.splice(idx, 1)
  } else {
    selectedSubcategories.value.push(subId)
  }
  syncBrowserUrl()
}

const handleClearSubcategories = () => {
  selectedSubcategories.value = []
  syncBrowserUrl()
}

const scrollToWorkspace = () => {
  if (!import.meta.client) return
  const el = document.getElementById('journal-workspace')
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

watch(
  () => route.path,
  async () => {
    syncFilterStateFromRoute()
    if (isArchiveRoute.value) {
      await ensureArchivePostsLoaded()
    }
  }
)

onMounted(async () => {
  await ensureArchivePostsLoaded()
  if (shouldScrollToWorkspaceOnMount.value) {
    nextTick(() => {
      setTimeout(scrollToWorkspace, 350)
    })
  }
})

onActivated(async () => {
  await ensureArchivePostsLoaded()
})
</script>

<template>
  <div>
    <!-- BRANCH A: JOURNAL ARCHIVE WORKSPACE -->
    <div v-if="isArchiveRoute" class="overflow-x-clip bg-bg-light">
      <PageHero :data="pageData.hero" />
      <InnerPageHeader :data="pageData.intro" />

      <!-- 1. Standalone Featured Journal Slider -->
      <section
        v-if="featuredJournalPosts.length > 0"
        data-theme="light"
        class="section-wrapper mt-4 py-8 sm:py-10 md:py-12 xl:py-15 bg-bg-light pt-2 sm:pt-4"
      >
        <JournalFeatured :items="featuredJournalPosts" />
      </section>

      <!-- 2. Main Search, Tabs & 3-Column Card Listing -->
      <LazyJournalListing
        hydrate-on-visible
        :items="archivePosts"
        :active-tab="activeTab"
        :selected-subcategories="selectedSubcategories"
        @update:active-tab="handleTabUpdate"
        @toggle-subcategory="handleSubcategoryToggle"
        @clear-subcategories="handleClearSubcategories"
      />
    </div>

    <!-- BRANCH B: INDIVIDUAL INSIGHT OR STORY VIEW -->
    <JournalSingleView
      v-else-if="singlePayload?.record"
      :key="singlePayload.record.meta.slug"
      :record="singlePayload.record"
      :related="singlePayload.related"
    />
  </div>
</template>
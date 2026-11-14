<!-- ~/app/pages/journal/[...slug].vue -->
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
import JournalFeatured from '~/components/JournalFeatured.vue'
import JournalSingleView from '~/components/JournalSingleView.vue'
import JournalListicleView from '~/components/JournalListicleView.vue'
import { useSessionScroll } from '~/composables/useSessionScroll'
import { useEditorialGlide } from '~/composables/useEditorialGlide'
import { useFloatingControls } from '~/composables/useFloatingControls'
import type {
  JournalMeta,
  JournalCategoryType,
  JournalSubcategoryId,
  JournalSinglePayload
} from '~~/server/utils/journalData'

type JournalArchiveTab = 'all' | JournalCategoryType

const { setPageFloatingOverrides } = useFloatingControls()
const route = useRoute()
const { glidePageScrollTo } = useEditorialGlide()
const {
  hasSavedScrollPosition,
  setActiveRouteAlias,
  saveJournalArchiveState,
  getJournalArchiveState
} = useSessionScroll()

// Client-safe subcategory -> parent category map
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

const resolveArchiveTabFromSegment = (segment: string | null): JournalArchiveTab | null => {
  if (!segment) return null
  if (segment === 'all') return 'all'
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

const matchedCategory = computed(() => resolveArchiveTabFromSegment(slug0.value))
const matchedSubcategory = computed(() =>
  resolveSubcategoryFromSegment(slug1.value || slug0.value)
)

const isArchiveRoute = computed<boolean>(() => {
  if (!slug0.value) return true
  if (matchedCategory.value !== null) return true
  if (matchedSubcategory.value !== null) return true
  return false
})

const activeTab = ref<JournalArchiveTab>('all')
const selectedSubcategories = ref<JournalSubcategoryId[]>([])
const shouldScrollToWorkspaceOnMount = ref(false)
const isPageActive = ref(true)

const resolveArchiveAliasUrl = (): string => {
  if (activeTab.value === 'all') {
    return '/journal'
  }
  if (selectedSubcategories.value.length === 1) {
    return `/journal/${activeTab.value}/${selectedSubcategories.value[0]}`
  }
  return `/journal/${activeTab.value}`
}

const persistArchiveSessionState = (aliasUrl: string) => {
  setActiveRouteAlias(aliasUrl)
  saveJournalArchiveState({
    activeTab: activeTab.value as JournalCategoryType,
    selectedSubcategories: selectedSubcategories.value,
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
    const savedArchive = getJournalArchiveState()
    if (savedArchive) {
      activeTab.value = (savedArchive.activeTab as JournalArchiveTab) || 'all'
      selectedSubcategories.value = [...savedArchive.selectedSubcategories]
      shouldScrollToWorkspaceOnMount.value = false
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

    activeTab.value = 'all'
    selectedSubcategories.value = []
    shouldScrollToWorkspaceOnMount.value = false
    persistArchiveSessionState('/journal')
    return
  }

  shouldScrollToWorkspaceOnMount.value = !hasSavedScrollPosition(route.path)

  if (matchedSubcategory.value) {
    const subId = matchedSubcategory.value
    activeTab.value =
      matchedCategory.value === 'all' ? 'all' : SUBCATEGORY_CATEGORY_MAP[subId]
    selectedSubcategories.value = [subId]
    persistArchiveSessionState(route.path)
    return
  }

  if (matchedCategory.value) {
    activeTab.value = matchedCategory.value
    selectedSubcategories.value = []
    persistArchiveSessionState(
      matchedCategory.value === 'all' ? '/journal' : route.path
    )
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
const {
  data: singlePayload,
  error: singleError,
  status: singleStatus
} = await useAsyncData<JournalSinglePayload | null>(
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

watch(singleStatus, (status) => {
  if (!isPageActive.value || isArchiveRoute.value) return
  if (status === 'error' && singleError.value) {
    throw createError({
      statusCode: 404,
      statusMessage: `Journal Story "${slug0.value}" Not Found`,
      fatal: true
    })
  }
})

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
    subtitle: 'Places tell you where you are. People tell you why it matters.',
    paragraph:
      'I believe people are the destination, along with the places and everything they represent. The most memorable journeys are created through conversations, relationships, and moments that cannot be found in a guidebook.'
  },
}

const handleTabUpdate = (newTab: JournalArchiveTab) => {
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
  if (!import.meta.client || !isPageActive.value) return
  const el = document.getElementById('journal-workspace')
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 90
    glidePageScrollTo(Math.max(0, y))
  }
}

const maybeScrollToWorkspace = () => {
  if (!shouldScrollToWorkspaceOnMount.value) return
  shouldScrollToWorkspaceOnMount.value = false
  nextTick(() => {
    setTimeout(scrollToWorkspace, 620)
  })
}

const isListicleRecord = computed<boolean>(() =>
  Boolean(
    !isArchiveRoute.value &&
    singlePayload.value?.record?.meta.layout === 'listicle' &&
    singlePayload.value?.record?.listicle
  )
)

const syncFloatingControlsVisibility = () => {
  if (!import.meta.client || !isPageActive.value) return
  if (isArchiveRoute.value) {
    setPageFloatingOverrides({ scrollNav: true, actionDock: true })
  } else if (!singlePayload.value?.record || isListicleRecord.value) {
    setPageFloatingOverrides({ scrollNav: false, actionDock: false })
  } else {
    setPageFloatingOverrides({ scrollNav: false, actionDock: true })
  }
}

watch(
  [() => route.path, isArchiveRoute, () => singlePayload.value?.record?.meta.slug, isListicleRecord],
  () => {
    syncFloatingControlsVisibility()
  }
)

watch(
  () => route.path,
  async () => {
    if (!isPageActive.value) return
    syncFilterStateFromRoute()
    if (isArchiveRoute.value) {
      await ensureArchivePostsLoaded()
      maybeScrollToWorkspace()
    }
  }
)

onMounted(async () => {
  isPageActive.value = true
  syncFloatingControlsVisibility()
  await ensureArchivePostsLoaded()
  maybeScrollToWorkspace()
})

onActivated(async () => {
  isPageActive.value = true
  syncFilterStateFromRoute()
  syncFloatingControlsVisibility()
  await ensureArchivePostsLoaded()
  maybeScrollToWorkspace()
})

onDeactivated(() => {
  isPageActive.value = false
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

      <!-- 2. Main Search, Tabs (ALL / INSIGHTS / STORIES) & Flex-Wrap Card Listing -->
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

    <!-- BRANCH B1: IMMERSIVE 2:3 LISTICLE WEB STORY -->
    <JournalListicleView
      v-else-if="
        singlePayload?.record &&
        singlePayload.record.meta.layout === 'listicle' &&
        singlePayload.record.listicle
      "
      :key="`listicle-${singlePayload.record.meta.slug}`"
      :record="singlePayload.record"
      :related="singlePayload.related"
    />

    <!-- BRANCH B2: STANDARD EDITORIAL ARTICLE -->
    <JournalSingleView
      v-else-if="singlePayload?.record"
      :key="`article-${singlePayload.record.meta.slug}`"
      :record="singlePayload.record"
      :related="singlePayload.related"
    />
  </div>
</template>
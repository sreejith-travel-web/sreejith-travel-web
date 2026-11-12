<!-- ~/app/components/JournalListing.vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'
import JournalCard from '~/components/JournalCard.vue'
import TrapeziumTabBar, { type TrapeziumTabOption } from '~/components/TrapeziumTabBar.vue'
import { useEditorialGlide } from '~/composables/useEditorialGlide'
import type {
  JournalMeta,
  JournalCategoryType,
  JournalSubcategoryId
} from '~~/server/utils/journalData'

export type JournalArchiveTab = 'all' | JournalCategoryType
type FilterAccordionPanel = 'subcategories' | 'tags' | null

const props = withDefaults(
  defineProps<{
    items: JournalMeta[]
    activeTab?: JournalArchiveTab
    selectedSubcategories?: JournalSubcategoryId[]
  }>(),
  {
    activeTab: 'all',
    selectedSubcategories: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:activeTab', tab: JournalArchiveTab): void
  (e: 'toggle-subcategory', subcategoryId: JournalSubcategoryId): void
  (e: 'clear-subcategories'): void
}>()

const {
  glidePageScrollTo,
  lockPanelHeightBeforeLeave,
  releasePanelHeightAfterEnter
} = useEditorialGlide()

const tabsConfig: TrapeziumTabOption[] = [
  { id: 'all', label: 'ALL' },
  { id: 'insights', label: 'INSIGHTS' },
  { id: 'stories', label: 'STORIES' }
]

// Search, Tag & Accordion State
const searchQuery = ref('')
const selectedTags = ref<string[]>([])

// Mobile/Tablet (<1024px): Permanently default-closed & mutually exclusive
const mobileOpenPanel = ref<FilterAccordionPanel>(null)

// Desktop (>=1024px): Used when in accordion mode (ALL tab or sidebar overflow)
const desktopActivePanel = ref<FilterAccordionPanel>('subcategories')
const doesDesktopSidebarOverflow = ref(false)

interface SubcategoryOption {
  id: JournalSubcategoryId
  category: JournalCategoryType
  label: string
  description: string
}

const SUBCATEGORY_OPTIONS: SubcategoryOption[] = [
  // INSIGHTS (5)
  {
    id: 'field-notes',
    category: 'insights',
    label: 'Field Notes',
    description: 'Travel observations · Village life · Reflections · Discoveries'
  },
  {
    id: 'living-heritage',
    category: 'insights',
    label: 'Living Heritage',
    description: 'Folk arts · Architecture · Rituals · Crafts · Folklore'
  },
  {
    id: 'responsible-travel',
    category: 'insights',
    label: 'Responsible Travel',
    description: 'Regenerative travel · Sustainability · Community tourism'
  },
  {
    id: 'research-perspectives',
    category: 'insights',
    label: 'Research & Perspectives',
    description: 'Research · Documentation · Cultural insights · Essays'
  },
  {
    id: 'ideas-collaborations',
    category: 'insights',
    label: 'Ideas & Collaborations',
    description: 'Collaborations · Workshops · Consulting · Initiatives'
  },
  // STORIES (5)
  {
    id: 'people-communities',
    category: 'stories',
    label: 'People & Communities',
    description: 'Artisans · Artists · Communities · Local knowledge'
  },
  {
    id: 'journey-stories',
    category: 'stories',
    label: 'Journey Stories',
    description: 'Journeys · Destinations · Encounters · Moments'
  },
  {
    id: 'travel-experiences',
    category: 'stories',
    label: 'Travel Experiences',
    description: 'Culture · Nature · Food · Heritage · Wildlife · Festivals'
  },
  {
    id: 'traveller-stories',
    category: 'stories',
    label: 'Traveller Stories',
    description: 'Reflections · Testimonials · Memories · Guest experiences'
  },
  {
    id: 'case-studies',
    category: 'stories',
    label: 'Case Studies',
    description: 'Journey planning · Itinerary design · Outcomes · Feedback'
  }
]

const insightsSubcategories = SUBCATEGORY_OPTIONS.filter((s) => s.category === 'insights')
const storiesSubcategories = SUBCATEGORY_OPTIONS.filter((s) => s.category === 'stories')

const activeTabSubcategories = computed(() => {
  if (props.activeTab === 'all') return SUBCATEGORY_OPTIONS
  return SUBCATEGORY_OPTIONS.filter((sub) => sub.category === props.activeTab)
})

const subcategoryGroups = computed(() => {
  if (props.activeTab === 'all') {
    return [
      { id: 'insights', heading: 'Insights', items: insightsSubcategories },
      { id: 'stories', heading: 'Stories', items: storiesSubcategories }
    ]
  }
  return [
    {
      id: props.activeTab,
      heading: null as string | null,
      items: activeTabSubcategories.value
    }
  ]
})

// Per-subcategory post count for intuitive scannability
const subcategoryPostCounts = computed<Record<string, number>>(() => {
  const counts: Record<string, number> = {}
  for (const post of props.items) {
    if (props.activeTab !== 'all' && post.category !== props.activeTab) continue
    counts[post.subcategory] = (counts[post.subcategory] || 0) + 1
  }
  return counts
})

const activeTabDescription = computed(() => {
  if (props.activeTab === 'all') {
    return 'Field notes, research perspectives, and human stories from across South India and beyond.'
  }
  return props.activeTab === 'insights'
    ? 'Observations, research and ideas from the field.'
    : 'Journeys, people and experiences that inspire.'
})

const readoutUnitLabel = computed(() => {
  if (props.activeTab === 'insights') return 'Insights'
  if (props.activeTab === 'stories') return 'Stories'
  return filteredPosts.value.length === 1 ? 'Journal Entry' : 'Journal Entries'
})

// Dynamic Tags across active tab + selected subcategories (supports cross-category in ALL)
const availableTags = computed<string[]>(() => {
  const tagSet = new Set<string>()
  for (const post of props.items) {
    if (props.activeTab !== 'all' && post.category !== props.activeTab) continue
    if (
      props.selectedSubcategories.length > 0 &&
      !props.selectedSubcategories.includes(post.subcategory)
    ) {
      continue
    }
    for (const tag of post.tags || []) {
      tagSet.add(tag.toUpperCase())
    }
  }
  return Array.from(tagSet)
})

watch(availableTags, (validTags) => {
  selectedTags.value = selectedTags.value.filter((t) => validTags.includes(t))
})

const activeFilterCount = computed(() => {
  return (
    props.selectedSubcategories.length +
    selectedTags.value.length +
    (searchQuery.value.trim().length > 0 ? 1 : 0)
  )
})

const selectedSubcategoryLabels = computed(() => {
  return props.selectedSubcategories
    .map((id) => SUBCATEGORY_OPTIONS.find((s) => s.id === id)?.label)
    .filter(Boolean) as string[]
})

const filteredPosts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  return props.items.filter((post) => {
    if (props.activeTab !== 'all' && post.category !== props.activeTab) {
      return false
    }

    if (q) {
      const inTitle = post.title.toLowerCase().includes(q)
      const inExcerpt = post.excerpt.toLowerCase().includes(q)
      const inSubcat = post.categoryLabel.toLowerCase().includes(q)
      const inTags = post.tags.some((t) => t.toLowerCase().includes(q))
      if (!inTitle && !inExcerpt && !inSubcat && !inTags) return false
    }

    if (props.selectedSubcategories.length > 0) {
      if (!props.selectedSubcategories.includes(post.subcategory)) return false
    }

    if (selectedTags.value.length > 0) {
      const postTagsUpper = post.tags.map((t) => t.toUpperCase())
      const hasTag = selectedTags.value.some((tag) => postTagsUpper.includes(tag))
      if (!hasTag) return false
    }

    return true
  })
})

// =========================================================
// MUTUALLY EXCLUSIVE ACCORDION ENGINE (Mobile + Smart Desktop)
// =========================================================
const toggleMobilePanel = (panel: Exclude<FilterAccordionPanel, null>) => {
  mobileOpenPanel.value = mobileOpenPanel.value === panel ? null : panel
}

// Desktop uses accordions when ALL is selected OR when expanded content exceeds device sidebar height
const isDesktopAccordionMode = computed(
  () => props.activeTab === 'all' || doesDesktopSidebarOverflow.value
)

const isDesktopSubcatOpen = computed(
  () => !isDesktopAccordionMode.value || desktopActivePanel.value === 'subcategories'
)

const isDesktopTagsOpen = computed(
  () => !isDesktopAccordionMode.value || desktopActivePanel.value === 'tags'
)

const toggleDesktopPanel = (panel: Exclude<FilterAccordionPanel, null>) => {
  if (!isDesktopAccordionMode.value) return
  desktopActivePanel.value = desktopActivePanel.value === panel ? null : panel
  scheduleSidebarMaskUpdate(true)
}

// =========================================================
// DESKTOP STICKY SIDEBAR HEIGHT MEASUREMENT & FADE MASKS
// =========================================================
const sidebarScrollRef = ref<HTMLElement | null>(null)
const desktopSubcatHeaderRef = ref<HTMLElement | null>(null)
const desktopSubcatBodyRef = ref<HTMLElement | null>(null)
const desktopTagsHeaderRef = ref<HTMLElement | null>(null)
const desktopTagsBodyRef = ref<HTMLElement | null>(null)

const sidebarCanScrollUp = ref(false)
const sidebarCanScrollDown = ref(false)

let sidebarResizeObserver: ResizeObserver | null = null
let maskSettleTimer: ReturnType<typeof setTimeout> | null = null

const updateSidebarScrollMasks = () => {
  const el = sidebarScrollRef.value
  if (!el) {
    sidebarCanScrollUp.value = false
    sidebarCanScrollDown.value = false
    return
  }
  const { scrollTop, scrollHeight, clientHeight } = el
  sidebarCanScrollUp.value = scrollTop > 3
  sidebarCanScrollDown.value = scrollTop + clientHeight < scrollHeight - 3
}

// Measures unconstrained inner body heights so collapsing an accordion never causes a flicker loop
const evaluateDesktopSidebarOverflow = () => {
  if (!import.meta.client || window.innerWidth < 1024) {
    updateSidebarScrollMasks()
    return
  }

  const subHeaderH = desktopSubcatHeaderRef.value?.offsetHeight || 38
  const subBodyH = desktopSubcatBodyRef.value?.offsetHeight || 0
  const tagHeaderH = desktopTagsHeaderRef.value?.offsetHeight || 38
  const tagBodyH = desktopTagsBodyRef.value?.offsetHeight || 0

  // 32px gap between blocks + 24px bottom breathing room
  const totalExpandedNaturalHeight =
    subHeaderH + subBodyH + (availableTags.value.length > 0 ? 32 + tagHeaderH + tagBodyH : 0) + 24

  // Matches lg:max-h-[calc(100svh-10.5rem)] (10.5rem = 168px)
  const availableSidebarHeight = Math.max(240, window.innerHeight - 168)
  doesDesktopSidebarOverflow.value = totalExpandedNaturalHeight > availableSidebarHeight

  updateSidebarScrollMasks()
}

const scheduleSidebarMaskUpdate = (resetScrollTop = false) => {
  if (!import.meta.client) return
  nextTick(() => {
    if (resetScrollTop && sidebarScrollRef.value) {
      sidebarScrollRef.value.scrollTop = 0
    }
    evaluateDesktopSidebarOverflow()
    if (maskSettleTimer !== null) clearTimeout(maskSettleTimer)
    maskSettleTimer = setTimeout(() => {
      evaluateDesktopSidebarOverflow()
    }, 370)
  })
}

const attachSidebarObservers = () => {
  if (!sidebarResizeObserver) return
  sidebarResizeObserver.disconnect()
  const targets = [
    sidebarScrollRef.value,
    desktopSubcatBodyRef.value,
    desktopTagsBodyRef.value
  ]
  for (const el of targets) {
    if (el) sidebarResizeObserver.observe(el)
  }
}

watch(
  [() => props.activeTab, () => availableTags.value.length],
  () => {
    nextTick(() => {
      attachSidebarObservers()
      evaluateDesktopSidebarOverflow()
    })
  }
)

// =========================================================
// SCROLL ANCHORS, PER-TAB SCROLL MEMORY & SILK GLIDE
// =========================================================
const tabBarRef = ref<InstanceType<typeof TrapeziumTabBar> | null>(null)
const tabContentTopRef = ref<HTMLElement | null>(null)
const listingTopRef = ref<HTMLElement | null>(null)
const savedTabScrollY = ref<Partial<Record<JournalArchiveTab, number>>>({})

const getTabContentTopScrollY = (): number =>
  tabBarRef.value?.getAnchorTargetScrollY(tabContentTopRef.value) ?? 0

const getListingTopScrollY = (): number =>
  tabBarRef.value?.getAnchorTargetScrollY(
    listingTopRef.value || tabContentTopRef.value
  ) ?? 0

const scrollToListingTop = async () => {
  if (!import.meta.client) return
  await nextTick()
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const targetY = getListingTopScrollY()
      if (Math.abs(window.scrollY - targetY) > 8) {
        glidePageScrollTo(targetY)
      }
    })
  })
}

const toggleSubcategory = (id: JournalSubcategoryId) => {
  const isChecking = !props.selectedSubcategories.includes(id)
  emit('toggle-subcategory', id)
  if (isChecking) {
    scrollToListingTop()
  }
}

const toggleTag = (tag: string) => {
  const normalized = tag.toUpperCase()
  const idx = selectedTags.value.indexOf(normalized)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(normalized)
    scrollToListingTop()
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedTags.value = []
  emit('clear-subcategories')
}

const handleTabSelect = async (rawTabId: string) => {
  const nextTab = rawTabId as JournalArchiveTab
  if (!import.meta.client) {
    emit('update:activeTab', nextTab)
    return
  }

  const currentTab = props.activeTab
  if (nextTab === currentTab) {
    glidePageScrollTo(getTabContentTopScrollY())
    return
  }

  savedTabScrollY.value[currentTab] = window.scrollY
  const previousScrollForNextTab = savedTabScrollY.value[nextTab]

  selectedTags.value = []
  mobileOpenPanel.value = null
  desktopActivePanel.value = 'subcategories'
  emit('update:activeTab', nextTab)

  await nextTick()
  scheduleSidebarMaskUpdate(true)
  requestAnimationFrame(() => {
    const contentTopY = getTabContentTopScrollY()
    const targetY =
      previousScrollForNextTab !== undefined ? previousScrollForNextTab : contentTopY
    glidePageScrollTo(targetY)
  })
}

// =========================================================
// SUBPIXEL-SAFE SIDEBAR BOUNDARY HANDOFF TO LENIS
// =========================================================
let sidebarTouchStartY = 0

const canSidebarScrollInDirection = (el: HTMLElement, deltaY: number): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = el
  if (scrollHeight <= clientHeight + 2) return false
  if (deltaY > 0) return scrollTop + clientHeight < scrollHeight - 2
  if (deltaY < 0) return scrollTop > 2
  return false
}

const onSidebarWheel = (e: WheelEvent) => {
  const el = e.currentTarget as HTMLElement | null
  if (!el) return
  if (canSidebarScrollInDirection(el, e.deltaY)) {
    e.stopPropagation()
  }
}

const onSidebarTouchStart = (e: TouchEvent) => {
  sidebarTouchStartY = e.touches[0]?.clientY ?? 0
}

const onSidebarTouchMove = (e: TouchEvent) => {
  const el = e.currentTarget as HTMLElement | null
  if (!el || !e.touches[0]) return
  const deltaY = sidebarTouchStartY - e.touches[0].clientY
  if (canSidebarScrollInDirection(el, deltaY)) {
    e.stopPropagation()
  }
}

onMounted(() => {
  if (typeof ResizeObserver !== 'undefined') {
    sidebarResizeObserver = new ResizeObserver(() => {
      evaluateDesktopSidebarOverflow()
    })
  }
  window.addEventListener('resize', evaluateDesktopSidebarOverflow, { passive: true })
  nextTick(() => {
    attachSidebarObservers()
    evaluateDesktopSidebarOverflow()
  })
})

onBeforeUnmount(() => {
  if (maskSettleTimer !== null) clearTimeout(maskSettleTimer)
  if (sidebarResizeObserver) {
    sidebarResizeObserver.disconnect()
    sidebarResizeObserver = null
  }
  if (import.meta.client) {
    window.removeEventListener('resize', evaluateDesktopSidebarOverflow)
  }
})
</script>

<template>
  <section
    id="journal-workspace"
    data-theme="light"
    class="section-wrapper overflow-x-clip! bg-bg-light text-primary-light pt-4 sm:pt-6"
  >
    <div class="w-full max-w-[1800px] flex flex-col">
      <!-- 1. TOP SEARCH INPUT BAR -->
      <div class="w-full max-w-4xl mx-auto mb-6 md:mb-8">
        <div class="relative w-full flex items-center">
          <svg
            class="w-5 h-5 text-journey-deep/45 absolute left-4 sm:left-5 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path stroke-linecap="round" d="m21 21-4.3-4.3" />
          </svg>

          <input
            v-model="searchQuery"
            name="searchJournal"
            type="search"
            placeholder="Search insights, stories, communities, or tags..."
            aria-label="Search insights, stories, communities, or tags"
            class="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-10 rounded-full bg-surface-light border border-journey-deep/15 text-journey-deep placeholder:text-journey-deep/45 section-subparagraph shadow-2xs focus:border-action-blue focus:outline-none transition-colors"
          />

          <button
            v-if="searchQuery"
            type="button"
            aria-label="Clear search"
            class="absolute right-4 text-journey-deep/50 hover:text-journey-deep active:text-journey-deep p-1 cursor-pointer"
            @click="searchQuery = ''"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 2. STICKY CURVED TRAPEZIUM TABS (ALL / INSIGHTS / STORIES — max-w-4xl) -->
      <TrapeziumTabBar
        ref="tabBarRef"
        :tabs="tabsConfig"
        :active-tab="activeTab"
        aria-label="Journal Category Tabs"
        max-width-class="max-w-4xl"
        wrapper-class="mb-5 md:mb-6"
        id-prefix="journal"
        @select="handleTabSelect"
      />

      <!-- Invisible Scroll Anchor -->
      <div ref="tabContentTopRef" class="w-full h-0" aria-hidden="true" />

      <!-- 3. ACTIVE TAB WORKSPACE -->
      <div class="w-full">
        <Transition
          name="editorial-tab-panel"
          mode="out-in"
          @before-leave="lockPanelHeightBeforeLeave"
          @after-enter="
            () => {
              releasePanelHeightAfterEnter()
              scheduleSidebarMaskUpdate(false)
            }
          "
        >
          <div
            :id="`journal-panel-${activeTab}`"
            :key="activeTab"
            role="tabpanel"
            :aria-labelledby="`journal-tab-${activeTab}`"
            class="w-full flex flex-col"
          >
            <!-- 3A. Centered Hero-Paragraph Intro Under Tabs -->
            <div class="w-full max-w-4xl mx-auto flex justify-center text-center mb-6 md:mb-8 px-4">
              <p class="hero-paragraph text-secondary-light/90 max-w-3xl">
                {{ activeTabDescription }}
              </p>
            </div>

            <!-- 3B. MOBILE & TABLET MUTUALLY EXCLUSIVE DEFAULT-CLOSED ACCORDIONS (< 1024px) -->
            <div class="w-full flex flex-col gap-3 mb-6 lg:hidden">
              <div class="flex flex-wrap items-center justify-between gap-2.5">
                <div class="flex flex-wrap items-center gap-2.5">
                  <!-- Trigger 1: Subcategories Accordion -->
                  <button
                    type="button"
                    :aria-expanded="mobileOpenPanel === 'subcategories'"
                    :class="[
                      'journal-filter-trigger section-subparagraph font-medium',
                      mobileOpenPanel === 'subcategories' ? 'journal-filter-trigger-active' : ''
                    ]"
                    @click="toggleMobilePanel('subcategories')"
                  >
                    <svg class="w-4 h-4 text-dark-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
                    </svg>
                    <span>Subcategories</span>
                    <span
                      v-if="selectedSubcategories.length > 0"
                      class="px-2 py-0.5 rounded-full bg-dark-gold text-surface-light text-[11px] font-bold leading-none"
                    >
                      {{ selectedSubcategories.length }}
                    </span>
                    <svg
                      class="w-4 h-4 text-journey-deep/60 transition-transform duration-300"
                      :class="mobileOpenPanel === 'subcategories' ? 'rotate-180' : ''"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  <!-- Trigger 2: Tags Accordion (Permanently Default-Closed on Mobile/Tablet) -->
                  <button
                    v-if="availableTags.length > 0"
                    type="button"
                    :aria-expanded="mobileOpenPanel === 'tags'"
                    :class="[
                      'journal-filter-trigger section-subparagraph font-medium',
                      mobileOpenPanel === 'tags' ? 'journal-filter-trigger-active' : ''
                    ]"
                    @click="toggleMobilePanel('tags')"
                  >
                    <svg class="w-4 h-4 text-action-blue shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M3 11l8.5 8.5a2.12 2.12 0 0 0 3 0l6-6a2.12 2.12 0 0 0 0-3L12 2H5a2 2 0 0 0-2 2v7Z" />
                    </svg>
                    <span>Tags</span>
                    <span
                      v-if="selectedTags.length > 0"
                      class="px-2 py-0.5 rounded-full bg-action-blue text-surface-light text-[11px] font-bold leading-none"
                    >
                      {{ selectedTags.length }}
                    </span>
                    <span v-else class="card-tag text-muted tabular-nums">
                      ({{ availableTags.length }})
                    </span>
                    <svg
                      class="w-4 h-4 text-journey-deep/60 transition-transform duration-300"
                      :class="mobileOpenPanel === 'tags' ? 'rotate-180' : ''"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      aria-hidden="true"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <button
                  v-if="activeFilterCount > 0"
                  type="button"
                  class="section-subparagraph text-journey-deep/80 underline underline-offset-4 hover:text-action-blue active:text-action-blue font-medium cursor-pointer"
                  @click="clearAllFilters"
                >
                  Clear filters
                </button>
              </div>

              <!-- Mobile Panel 1: Subcategories Accordion Body -->
              <div
                :class="[
                  'journal-accordion-shell',
                  mobileOpenPanel === 'subcategories'
                    ? 'journal-accordion-open'
                    : 'journal-accordion-closed pointer-events-none'
                ]"
              >
                <div class="journal-accordion-clip">
                  <div class="w-full p-5 rounded-2xl bg-surface-light border border-journey-deep/15 shadow-xs flex flex-col gap-5">
                    <div
                      v-for="group in subcategoryGroups"
                      :key="`mob-group-${group.id}`"
                      class="flex flex-col"
                    >
                      <h3
                        v-if="group.heading"
                        class="card-eyebrow text-dark-gold font-semibold pb-2 mb-3 border-b border-divider-light"
                      >
                        {{ group.heading }}
                      </h3>
                      <h3
                        v-else
                        class="section-subparagraph font-semibold text-journey-deep pb-2 mb-3 border-b border-divider-light"
                      >
                        {{ activeTab === 'insights' ? 'Insights Subcategories' : 'Stories Subcategories' }}
                      </h3>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          v-for="sub in group.items"
                          :key="sub.id"
                          type="button"
                          class="flex items-center justify-between gap-3 py-1.5 text-left cursor-pointer group"
                          @click="toggleSubcategory(sub.id)"
                        >
                          <span class="flex items-center gap-3 min-w-0">
                            <span
                              class="w-4.5 h-4.5 rounded-xs border flex items-center justify-center transition-colors shrink-0"
                              :class="
                                selectedSubcategories.includes(sub.id)
                                  ? 'bg-dark-gold border-dark-gold text-surface-light'
                                  : 'bg-surface-light border-journey-deep/30 group-hover:border-action-blue'
                              "
                            >
                              <svg
                                v-if="selectedSubcategories.includes(sub.id)"
                                class="w-3 h-3 stroke-current"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke-width="3"
                                aria-hidden="true"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                            <span
                              class="section-subparagraph truncate"
                              :class="
                                selectedSubcategories.includes(sub.id)
                                  ? 'text-journey-deep font-semibold'
                                  : 'text-journey-deep/90'
                              "
                            >
                              {{ sub.label }}
                            </span>
                          </span>

                          <span class="card-tag text-muted tabular-nums shrink-0">
                            {{ subcategoryPostCounts[sub.id] || 0 }}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile Panel 2: Tags Accordion Body (Capped Scrollable Tray for 100+ Tags) -->
              <div
                v-if="availableTags.length > 0"
                :class="[
                  'journal-accordion-shell',
                  mobileOpenPanel === 'tags'
                    ? 'journal-accordion-open'
                    : 'journal-accordion-closed pointer-events-none'
                ]"
              >
                <div class="journal-accordion-clip">
                  <div class="w-full p-4 sm:p-5 rounded-2xl bg-surface-light border border-journey-deep/15 shadow-xs">
                    <div class="max-h-56 overflow-y-auto pr-1 flex flex-wrap items-center gap-2 journal-sidebar-scroll">
                      <button
                        v-for="tag in availableTags"
                        :key="tag"
                        type="button"
                        class="shrink-0 px-3 py-1.5 rounded-sm border card-tag font-primary transition-all duration-200 cursor-pointer active:scale-96"
                        :class="
                          selectedTags.includes(tag)
                            ? 'bg-journey-deep text-surface-light border-journey-deep font-medium'
                            : 'bg-surface-light text-journey-deep/75 border-journey-deep/15 hover:border-action-blue'
                        "
                        @click="toggleTag(tag)"
                      >
                        {{ tag }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Invisible Listing Top Scroll Anchor -->
            <div ref="listingTopRef" class="w-full h-0" aria-hidden="true" />

            <!-- 4. LIVE FILTER READOUT BAR -->
            <div class="filter-readout-bar">
              <div class="flex flex-wrap items-center gap-2 text-left">
                <span class="section-subparagraph font-semibold text-journey-deep">
                  {{ filteredPosts.length }} {{ readoutUnitLabel }}
                </span>

                <template v-if="selectedSubcategoryLabels.length > 0">
                  <span class="text-journey-deep/35">·</span>
                  <span class="section-subparagraph text-dark-gold font-medium">
                    {{ selectedSubcategoryLabels.join(', ') }}
                  </span>
                </template>

                <template v-if="selectedTags.length > 0">
                  <span class="text-journey-deep/35">·</span>
                  <span class="section-subparagraph text-action-blue font-medium">
                    {{ selectedTags.join(' ') }}
                  </span>
                </template>
              </div>

              <button
                v-if="activeFilterCount > 0"
                type="button"
                class="section-subparagraph text-journey-deep/80 underline underline-offset-4 hover:text-action-blue active:text-action-blue font-medium transition-colors cursor-pointer"
                @click="clearAllFilters"
              >
                Clear filters
              </button>
            </div>

            <!-- 5. MAIN WORKSPACE: LEFT STICKY SIDEBAR (lg:col-span-3) + RIGHT FLEX-WRAP CARDS (lg:col-span-9) -->
            <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              <!-- Desktop Sticky Filter Rail with Reactive Fade Masks & Smart Overflow Accordions -->
              <aside
                v-motion-glide-left
                aria-label="Journal Filters"
                class="hidden lg:block lg:col-span-3 lg:sticky lg:top-38 relative"
              >
                <!-- Reactive Top Scroll Fade Mask -->
                <div
                  aria-hidden="true"
                  :class="[
                    'journal-sidebar-fade-top',
                    sidebarCanScrollUp ? 'opacity-100' : 'opacity-0'
                  ]"
                />

                <!-- Native Scroll Container with Subpixel Lenis Boundary Handoff -->
                <div
                  ref="sidebarScrollRef"
                  class="flex flex-col gap-7 lg:max-h-[calc(100svh-10.5rem)] lg:overflow-y-auto lg:overscroll-y-auto lg:pr-3 pb-6 journal-sidebar-scroll"
                  @scroll.passive="updateSidebarScrollMasks"
                  @wheel.passive="onSidebarWheel"
                  @touchstart.passive="onSidebarTouchStart"
                  @touchmove.passive="onSidebarTouchMove"
                >
                  <!-- BLOCK A: SUBCATEGORIES (Grouped in ALL; Accordion when ALL or Overflowing) -->
                  <div class="flex flex-col">
                    <button
                      ref="desktopSubcatHeaderRef"
                      type="button"
                      :disabled="!isDesktopAccordionMode"
                      :aria-expanded="isDesktopSubcatOpen"
                      :class="[
                        'w-full flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-journey-deep/15 text-left',
                        isDesktopAccordionMode ? 'cursor-pointer group' : 'cursor-default'
                      ]"
                      @click="toggleDesktopPanel('subcategories')"
                    >
                      <span class="flex items-center gap-2">
                        <span class="section-subparagraph font-semibold text-journey-deep group-hover:text-intention-blue transition-colors">
                          {{
                            activeTab === 'all'
                              ? 'Subcategories'
                              : activeTab === 'insights'
                                ? 'Insights'
                                : 'Stories'
                          }}
                        </span>
                        <span
                          v-if="selectedSubcategories.length > 0"
                          class="px-2 py-0.5 rounded-full bg-dark-gold text-surface-light text-[10px] font-bold leading-none"
                        >
                          {{ selectedSubcategories.length }}
                        </span>
                      </span>

                      <svg
                        v-if="isDesktopAccordionMode"
                        class="w-4 h-4 text-journey-deep/60 group-hover:text-journey-deep transition-transform duration-300 shrink-0"
                        :class="isDesktopSubcatOpen ? 'rotate-180' : ''"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      :class="[
                        'journal-accordion-shell',
                        isDesktopSubcatOpen
                          ? 'journal-accordion-open'
                          : 'journal-accordion-closed pointer-events-none'
                      ]"
                    >
                      <div class="journal-accordion-clip">
                        <div ref="desktopSubcatBodyRef" class="flex flex-col gap-5 pt-0.5">
                          <div
                            v-for="group in subcategoryGroups"
                            :key="`desk-group-${group.id}`"
                            class="flex flex-col"
                          >
                            <span
                              v-if="group.heading"
                              class="card-eyebrow text-dark-gold font-semibold mb-2.5"
                            >
                              {{ group.heading }}
                            </span>

                            <div class="flex flex-col gap-2">
                              <button
                                v-for="sub in group.items"
                                :key="sub.id"
                                type="button"
                                class="flex items-start justify-between gap-3 py-1 text-left cursor-pointer group"
                                @click="toggleSubcategory(sub.id)"
                              >
                                <span class="flex items-start gap-3 min-w-0">
                                  <span
                                    class="w-4.5 h-4.5 mt-0.5 rounded-xs border flex items-center justify-center shrink-0 transition-colors"
                                    :class="
                                      selectedSubcategories.includes(sub.id)
                                        ? 'bg-dark-gold border-dark-gold text-surface-light'
                                        : 'bg-surface-light border-journey-deep/25 group-hover:border-action-blue'
                                    "
                                  >
                                    <svg
                                      v-if="selectedSubcategories.includes(sub.id)"
                                      class="w-3 h-3 stroke-current"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke-width="3"
                                      aria-hidden="true"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  </span>

                                  <span
                                    class="section-subparagraph transition-colors leading-snug"
                                    :class="
                                      selectedSubcategories.includes(sub.id)
                                        ? 'text-journey-deep font-semibold'
                                        : 'text-secondary-light group-hover:text-journey-deep'
                                    "
                                  >
                                    {{ sub.label }}
                                  </span>
                                </span>

                                <span class="card-tag text-muted tabular-nums mt-1 shrink-0">
                                  {{ subcategoryPostCounts[sub.id] || 0 }}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- BLOCK B: DYNAMIC TAGS (Open when compact; Mutually Exclusive Chevron Accordion when ALL or Overflowing) -->
                  <div v-if="availableTags.length > 0" class="flex flex-col">
                    <button
                      ref="desktopTagsHeaderRef"
                      type="button"
                      :disabled="!isDesktopAccordionMode"
                      :aria-expanded="isDesktopTagsOpen"
                      :class="[
                        'w-full flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-journey-deep/15 text-left',
                        isDesktopAccordionMode ? 'cursor-pointer group' : 'cursor-default'
                      ]"
                      @click="toggleDesktopPanel('tags')"
                    >
                      <span class="flex items-center gap-2">
                        <span class="section-subparagraph font-semibold text-journey-deep group-hover:text-intention-blue transition-colors">
                          Tags
                        </span>
                        <span
                          v-if="selectedTags.length > 0"
                          class="px-2 py-0.5 rounded-full bg-action-blue text-surface-light text-[10px] font-bold leading-none"
                        >
                          {{ selectedTags.length }}
                        </span>
                        <span
                          v-else-if="isDesktopAccordionMode"
                          class="card-tag text-muted tabular-nums"
                        >
                          ({{ availableTags.length }})
                        </span>
                      </span>

                      <svg
                        v-if="isDesktopAccordionMode"
                        class="w-4 h-4 text-journey-deep/60 group-hover:text-journey-deep transition-transform duration-300 shrink-0"
                        :class="isDesktopTagsOpen ? 'rotate-180' : ''"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
                      </svg>
                    </button>

                    <div
                      :class="[
                        'journal-accordion-shell',
                        isDesktopTagsOpen
                          ? 'journal-accordion-open'
                          : 'journal-accordion-closed pointer-events-none'
                      ]"
                    >
                      <div class="journal-accordion-clip">
                        <div ref="desktopTagsBodyRef" class="flex flex-wrap items-center gap-2 pt-0.5">
                          <button
                            v-for="tag in availableTags"
                            :key="tag"
                            type="button"
                            class="px-3 py-1.5 rounded-sm border card-tag font-primary transition-all duration-200 cursor-pointer active:scale-96"
                            :class="
                              selectedTags.includes(tag)
                                ? 'bg-journey-deep text-surface-light border-journey-deep font-medium shadow-2xs'
                                : 'bg-surface-light text-journey-deep/75 border-journey-deep/15 hover:border-action-blue hover:text-journey-deep'
                            "
                            @click="toggleTag(tag)"
                          >
                            {{ tag }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Reactive Bottom Scroll Fade Mask -->
                <div
                  aria-hidden="true"
                  :class="[
                    'journal-sidebar-fade-bottom',
                    sidebarCanScrollDown ? 'opacity-100' : 'opacity-0'
                  ]"
                />
              </aside>

              <!-- Right Flex-Wrap Card Workspace (md:justify-start for Flush-Left Final Row) -->
              <div class="lg:col-span-9 w-full">
                <div
                  v-if="filteredPosts.length > 0"
                  class="journal-listing-flex"
                >
                  <div
                    v-for="(post, idx) in filteredPosts"
                    :key="post.id"
                    v-motion-atelier-card
                    :delay="(idx % 3) * 65"
                    class="journal-listing-slot"
                  >
                    <JournalCard :post="post" />
                  </div>
                </div>

                <!-- Empty Filter State -->
                <div
                  v-else
                  class="w-full py-16 px-6 rounded-2xl bg-surface-light border border-journey-deep/10 flex flex-col items-center text-center"
                >
                  <p class="section-subtitle text-journey-deep mb-2">
                    No stories match your current filters.
                  </p>
                  <p class="section-paragraph text-secondary-light mb-6">
                    Try clearing your search or selecting a different subcategory or tag.
                  </p>
                  <button
                    type="button"
                    class="px-6 py-3 rounded-sm border-2 border-journey-deep text-journey-deep font-uppercase text-[11px] tracking-[0.2em] uppercase hover:bg-action-blue hover:border-action-blue hover:text-surface-light active:bg-action-blue active:text-surface-light transition-all cursor-pointer"
                    @click="clearAllFilters"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
.journal-sidebar-scroll {
  scrollbar-width: thin;
  scrollbar-color: rgba(20, 38, 56, 0.22) rgba(20, 38, 56, 0.05);
}

.journal-sidebar-scroll::-webkit-scrollbar {
  width: 5px;
}

.journal-sidebar-scroll::-webkit-scrollbar-track {
  background: rgba(20, 38, 56, 0.05);
  border-radius: 9999px;
}

.journal-sidebar-scroll::-webkit-scrollbar-thumb {
  background-color: rgba(20, 38, 56, 0.22);
  border-radius: 9999px;
  transition: background-color 0.2s ease;
}

.journal-sidebar-scroll::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-action-blue, #2b6cb0);
}
</style>
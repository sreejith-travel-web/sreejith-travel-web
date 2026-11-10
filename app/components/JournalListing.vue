<!-- ~/components/JournalListing.vue -->
<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import JournalCard from '~/components/JournalCard.vue'
import type {
  JournalMeta,
  JournalCategoryType,
  JournalSubcategoryId
} from '~~/server/utils/journalData'

const props = withDefaults(
  defineProps<{
    items: JournalMeta[]
    activeTab: JournalCategoryType
    selectedSubcategories?: JournalSubcategoryId[]
  }>(),
  {
    selectedSubcategories: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:activeTab', tab: JournalCategoryType): void
  (e: 'toggle-subcategory', subcategoryId: JournalSubcategoryId): void
  (e: 'clear-subcategories'): void
}>()

// Search & Tag State
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const isMobileFilterOpen = ref(false)

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

// Subcategories belonging to the currently active tab ('insights' | 'stories')
const activeTabSubcategories = computed(() =>
  SUBCATEGORY_OPTIONS.filter((sub) => sub.category === props.activeTab)
)

const activeTabDescription = computed(() =>
  props.activeTab === 'insights'
    ? 'Observations, research and ideas from the field.'
    : 'Journeys, people and experiences that inspire.'
)

// Dynamic Tags: Distinct tags extracted from posts matching active category (+ selected subcategories)
const availableTags = computed<string[]>(() => {
  const tagSet = new Set<string>()
  for (const post of props.items) {
    if (post.category !== props.activeTab) continue
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

// Auto-prune selected tags if they no longer exist in the current category/subcategory view
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

// Filtered Posts (Category Tab + Search + Subcategories + Dynamic Tags)
const filteredPosts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  return props.items.filter((post) => {
    // 1. Match Active Category ('insights' | 'stories')
    if (post.category !== props.activeTab) return false

    // 2. Match Search Query
    if (q) {
      const inTitle = post.title.toLowerCase().includes(q)
      const inExcerpt = post.excerpt.toLowerCase().includes(q)
      const inSubcat = post.categoryLabel.toLowerCase().includes(q)
      const inTags = post.tags.some((t) => t.toLowerCase().includes(q))
      if (!inTitle && !inExcerpt && !inSubcat && !inTags) return false
    }

    // 3. Match Selected Subcategories
    if (props.selectedSubcategories.length > 0) {
      if (!props.selectedSubcategories.includes(post.subcategory)) return false
    }

    // 4. Match Selected Tag Pills
    if (selectedTags.value.length > 0) {
      const postTagsUpper = post.tags.map((t) => t.toUpperCase())
      const hasTag = selectedTags.value.some((tag) => postTagsUpper.includes(tag))
      if (!hasTag) return false
    }

    return true
  })
})

// Scroll Anchors & Per-Tab Scroll Memory
const stickyTabsRef = ref<HTMLElement | null>(null)
const tabContentTopRef = ref<HTMLElement | null>(null)
const listingTopRef = ref<HTMLElement | null>(null)
const savedTabScrollY = ref<Partial<Record<JournalCategoryType, number>>>({})

const getAnchorScrollY = (anchorEl: HTMLElement | null): number => {
  if (!import.meta.client || !anchorEl) return 0
  const stickyEl = stickyTabsRef.value
  const stickyTopPx = stickyEl
    ? Number.parseFloat(window.getComputedStyle(stickyEl).top) || 72
    : 72
  const stickyBarHeight = stickyEl ? stickyEl.offsetHeight : 60
  const anchorAbsoluteTop = anchorEl.getBoundingClientRect().top + window.scrollY
  return Math.max(0, anchorAbsoluteTop - stickyTopPx - stickyBarHeight - 12)
}

const getTabContentTopScrollY = (): number => getAnchorScrollY(tabContentTopRef.value)

const getListingTopScrollY = (): number =>
  getAnchorScrollY(listingTopRef.value || tabContentTopRef.value)

const scrollToListingTop = async () => {
  if (!import.meta.client) return
  await nextTick()
  // Frame 1: let browser finish layout clamping after card count changes
  requestAnimationFrame(() => {
    // Frame 2: smoothly scroll to the top of the listing without being canceled
    requestAnimationFrame(() => {
      const targetY = getListingTopScrollY()
      if (Math.abs(window.scrollY - targetY) > 8) {
        window.scrollTo({ top: targetY, behavior: 'smooth' })
      }
    })
  })
}

// Only scroll to listing top when CHECKING an item (never when unchecking, and mobile drawer stays open)
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
    // Unchecking: do not scroll
    selectedTags.value.splice(idx, 1)
  } else {
    // Checking: scroll to top of listing section
    selectedTags.value.push(normalized)
    scrollToListingTop()
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedTags.value = []
  emit('clear-subcategories')
}

const handleTabSelect = async (nextTab: JournalCategoryType) => {
  if (!import.meta.client) {
    emit('update:activeTab', nextTab)
    return
  }

  const currentTab = props.activeTab
  if (nextTab === currentTab) {
    window.scrollTo({ top: getTabContentTopScrollY(), behavior: 'smooth' })
    return
  }

  savedTabScrollY.value[currentTab] = window.scrollY
  const previousScrollForNextTab = savedTabScrollY.value[nextTab]

  selectedTags.value = []
  emit('update:activeTab', nextTab)

  await nextTick()
  requestAnimationFrame(() => {
    const contentTopY = getTabContentTopScrollY()
    const targetY =
      previousScrollForNextTab !== undefined ? previousScrollForNextTab : contentTopY
    window.scrollTo({ top: targetY, behavior: 'smooth' })
  })
}

// Smooth Native Sidebar Scroll + Downward Boundary Handoff (Zero Glitch / Passive)
let sidebarTouchStartY = 0

const canSidebarScrollInDirection = (el: HTMLElement, deltaY: number): boolean => {
  const { scrollTop, scrollHeight, clientHeight } = el
  if (scrollHeight <= clientHeight + 1) return false
  if (deltaY > 0) return scrollTop + clientHeight < scrollHeight - 1
  if (deltaY < 0) return scrollTop > 1
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
            @click="searchQuery = ''"
            class="absolute right-4 text-journey-deep/50 hover:text-journey-deep active:text-journey-deep p-1 cursor-pointer"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path stroke-linecap="round" d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 2. STICKY CENTERED CURVED TRAPEZIUM TABS (INSIGHTS / STORIES) -->
      <div
        ref="stickyTabsRef"
        class="sticky top-16 sm:top-18 md:top-20 z-30 w-full bg-bg-light/95 backdrop-blur-md py-2.5 sm:py-3 mb-5 md:mb-6 flex justify-center"
      >
        <div
          role="tablist"
          aria-label="Journal Category Tabs"
          class="trapezium-tab-bar max-w-3xl mx-auto mb-0!"
        >
          <button
            role="tab"
            type="button"
            :aria-selected="activeTab === 'insights'"
            @click="handleTabSelect('insights')"
            class="trapezium-tab"
            :class="activeTab === 'insights' ? 'trapezium-tab-active' : ''"
          >
            <svg
              v-if="activeTab === 'insights'"
              class="w-3.5 h-3.5 text-dark-gold shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>INSIGHTS</span>
            <span v-if="activeTab === 'insights'" class="trapezium-tab-indicator" />
          </button>

          <button
            role="tab"
            type="button"
            :aria-selected="activeTab === 'stories'"
            @click="handleTabSelect('stories')"
            class="trapezium-tab"
            :class="activeTab === 'stories' ? 'trapezium-tab-active' : ''"
          >
            <svg
              v-if="activeTab === 'stories'"
              class="w-3.5 h-3.5 text-dark-gold shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>STORIES</span>
            <span v-if="activeTab === 'stories'" class="trapezium-tab-indicator" />
          </button>
        </div>
      </div>

      <!-- Invisible Scroll Anchor -->
      <div ref="tabContentTopRef" class="w-full h-0" aria-hidden="true" />

      <!-- 2B. CENTERED HERO-PARAGRAPH INTRO UNDER TABS -->
      <div class="w-full max-w-4xl mx-auto flex justify-center text-center mb-6 md:mb-8 px-4">
        <p
          :key="`journal-tab-desc-${activeTab}`"
          v-motion-fade-up
          class="hero-paragraph text-secondary-light/90 max-w-3xl"
        >
          {{ activeTabDescription }}
        </p>
      </div>

      <!-- 3. MOBILE & TABLET FILTER ACCORDION + DYNAMIC TAGS (< 1024px) -->
      <div class="w-full flex flex-col gap-3 mb-6 lg:hidden">
        <div class="flex items-center justify-between gap-3">
          <button
            type="button"
            :aria-expanded="isMobileFilterOpen"
            @click="isMobileFilterOpen = !isMobileFilterOpen"
            class="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface-light border border-journey-deep/15 text-journey-deep section-subparagraph font-medium shadow-2xs active:scale-98 cursor-pointer"
          >
            <svg class="w-4 h-4 text-dark-gold shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
            </svg>
            <span>Filter by Subcategory</span>
            <span
              v-if="activeFilterCount > 0"
              class="px-2 py-0.5 rounded-full bg-dark-gold text-surface-light text-[11px] font-bold"
            >
              {{ activeFilterCount }}
            </span>
            <svg
              class="w-4 h-4 text-journey-deep/60 transition-transform duration-300"
              :class="isMobileFilterOpen ? 'rotate-180' : ''"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
            </svg>
          </button>

          <button
            v-if="activeFilterCount > 0"
            type="button"
            @click="clearAllFilters"
            class="section-subparagraph text-journey-deep/80 underline underline-offset-4 hover:text-action-blue active:text-action-blue font-medium"
          >
            Clear filters
          </button>
        </div>

        <!-- Expandable Mobile Subcategory Drawer -->
        <div
          v-if="isMobileFilterOpen"
          class="w-full p-5 rounded-2xl bg-surface-light border border-journey-deep/15 shadow-sm flex flex-col gap-5"
        >
          <div>
            <h3 class="section-subparagraph font-semibold text-journey-deep pb-2 mb-3 border-b border-divider-light">
              {{ activeTab === 'insights' ? 'Insights Subcategories' : 'Stories Subcategories' }}
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                v-for="sub in activeTabSubcategories"
                :key="sub.id"
                type="button"
                @click="toggleSubcategory(sub.id)"
                class="flex items-center gap-3 py-1.5 text-left cursor-pointer group"
              >
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
                <span class="section-subparagraph text-journey-deep/90">
                  {{ sub.label }}
                </span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Dynamic Tags Strip on Mobile -->
        <div class="w-full flex flex-wrap items-center gap-2 py-1">
          <button
            v-for="tag in availableTags"
            :key="tag"
            type="button"
            @click="toggleTag(tag)"
            class="shrink-0 px-3 py-1.5 rounded-sm border card-tag font-primary transition-all duration-200 cursor-pointer active:scale-96"
            :class="
              selectedTags.includes(tag)
                ? 'bg-journey-deep text-surface-light border-journey-deep font-medium'
                : 'bg-surface-light text-journey-deep/75 border-journey-deep/15 hover:border-action-blue'
            "
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- Invisible Listing Top Scroll Anchor (Below Mobile Drawer & Tags) -->
      <div ref="listingTopRef" class="w-full h-0" aria-hidden="true" />

      <!-- 4. LIVE FILTER READOUT BAR -->
      <div class="filter-readout-bar">
        <div class="flex flex-wrap items-center gap-2 text-left">
          <span class="section-subparagraph font-semibold text-journey-deep">
            {{ filteredPosts.length }}
            {{ activeTab === 'insights' ? 'Insights' : 'Stories' }}
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
          @click="clearAllFilters"
          class="section-subparagraph text-journey-deep/80 underline underline-offset-4 hover:text-action-blue active:text-action-blue font-medium transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      </div>

      <!-- 5. MAIN WORKSPACE: LEFT SIDEBAR (lg:col-span-3) + RIGHT 3-COL CARDS (lg:col-span-9) -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <!-- Left Sticky Sidebar with Smooth Native Boundary Handoff (Desktop lg+) -->
        <aside
          @wheel.passive="onSidebarWheel"
          @touchstart.passive="onSidebarTouchStart"
          @touchmove.passive="onSidebarTouchMove"
          class="hidden lg:flex lg:col-span-3 flex-col gap-8 lg:sticky lg:top-28 lg:max-h-[calc(100svh-8.5rem)] lg:overflow-y-auto lg:overscroll-y-auto lg:pr-3 pb-6 journal-sidebar-scroll"
        >
          <!-- Subcategories Checklist -->
          <div class="flex flex-col">
            <h3 class="section-subparagraph font-semibold text-journey-deep pb-2.5 mb-3.5 border-b border-journey-deep/15">
              {{ activeTab === 'insights' ? 'Insights' : 'Stories' }}
            </h3>

            <div class="flex flex-col gap-2.5">
              <button
                v-for="sub in activeTabSubcategories"
                :key="sub.id"
                type="button"
                @click="toggleSubcategory(sub.id)"
                class="flex items-start gap-3 py-1 text-left cursor-pointer group"
              >
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

                <div class="flex flex-col">
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
                </div>
              </button>
            </div>
          </div>

          <!-- Dynamic Tags Pills (Computed from Active Category + Subcategory) -->
          <div class="flex flex-col">
            <h3 class="section-subparagraph font-semibold text-journey-deep pb-2.5 mb-3.5 border-b border-journey-deep/15">
              Tags
            </h3>

            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="tag in availableTags"
                :key="tag"
                type="button"
                @click="toggleTag(tag)"
                class="px-3 py-1.5 rounded-sm border card-tag font-primary transition-all duration-200 cursor-pointer active:scale-96"
                :class="
                  selectedTags.includes(tag)
                    ? 'bg-journey-deep text-surface-light border-journey-deep font-medium shadow-2xs'
                    : 'bg-surface-light text-journey-deep/75 border-journey-deep/15 hover:border-action-blue hover:text-journey-deep'
                "
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </aside>

        <!-- Right 3-Column Card Grid -->
        <div class="lg:col-span-9 w-full">
          <div
            v-if="filteredPosts.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 w-full items-stretch"
          >
            <JournalCard
              v-for="post in filteredPosts"
              :key="post.id"
              :post="post"
            />
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
              @click="clearAllFilters"
              class="px-6 pt-3.5 pb-2.5 rounded-sm border-2 border-journey-deep text-journey-deep font-uppercase text-[11px] tracking-[0.2em] uppercase hover:bg-action-blue hover:border-action-blue hover:text-surface-light active:bg-action-blue active:text-surface-light transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
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
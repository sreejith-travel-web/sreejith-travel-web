<!-- ~/components/JournalListing.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import JournalCard from '~/components/JournalCard.vue'
import type { JournalMeta, JournalPostType, JournalCategoryId } from '~~/server/utils/journalData'

const props = defineProps<{
  items: JournalMeta[]
  activeTab: JournalPostType
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', tab: JournalPostType): void
}>()

// Search & Filter State
const searchQuery = ref('')
const selectedCategories = ref<JournalCategoryId[]>([])
const selectedTopics = ref<string[]>([])
const isMobileFilterOpen = ref(false)

const categoryOptions: Array<{ id: JournalCategoryId; label: string }> = [
  { id: 'nature', label: 'Nature & Wilderness' },
  { id: 'culture', label: 'Culture & Heritage' },
  { id: 'stays', label: 'Places to Stay' },
  { id: 'offbeat', label: 'Offbeat Explorations' },
  { id: 'wellness', label: 'Wellness & Spirit' },
  { id: 'bespoke', label: 'Bespoke Luxury' }
]

const topicOptions: string[] = [
  '#kerala',
  '#himalayas',
  '#wildlife',
  '#culture',
  '#food',
  '#beaches',
  '#wellness',
  '#roadtrips',
  '#islands',
  '#sustainable'
]

const toggleCategory = (id: JournalCategoryId) => {
  const idx = selectedCategories.value.indexOf(id)
  if (idx > -1) {
    selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(id)
  }
}

const toggleTopic = (topic: string) => {
  const idx = selectedTopics.value.indexOf(topic)
  if (idx > -1) {
    selectedTopics.value.splice(idx, 1)
  } else {
    selectedTopics.value.push(topic)
  }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategories.value = []
  selectedTopics.value = []
}

const activeFilterCount = computed(() => {
  return (
    selectedCategories.value.length +
    selectedTopics.value.length +
    (searchQuery.value.trim().length > 0 ? 1 : 0)
  )
})

const selectedCategoryLabels = computed(() => {
  return selectedCategories.value
    .map((id) => categoryOptions.find((c) => c.id === id)?.label)
    .filter(Boolean) as string[]
})

// Filtered Posts (Tab + Search + Categories + Topics)
const filteredPosts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()

  return props.items.filter((post) => {
    // 1. Match Active Tab ('articles' | 'case-studies')
    if (post.type !== props.activeTab) return false

    // 2. Match Search Query
    if (q) {
      const inTitle = post.title.toLowerCase().includes(q)
      const inExcerpt = post.excerpt.toLowerCase().includes(q)
      const inCategory = post.categoryLabel.toLowerCase().includes(q)
      const inTags = post.tags.some((t) => t.toLowerCase().includes(q))
      if (!inTitle && !inExcerpt && !inCategory && !inTags) return false
    }

    // 3. Match Checked Categories
    if (selectedCategories.value.length > 0) {
      const hasCat = selectedCategories.value.some((catId) => post.categories.includes(catId))
      if (!hasCat) return false
    }

    // 4. Match Selected Topic Pills
    if (selectedTopics.value.length > 0) {
      const hasTopic = selectedTopics.value.some(
        (topic) => post.topics.includes(topic) || post.tags.includes(topic)
      )
      if (!hasTopic) return false
    }

    return true
  })
})
</script>

<template>
  <section
    id="journal-workspace"
    data-theme="light"
    class="section-wrapper bg-bg-light text-primary-light pt-4 sm:pt-6"
  >
    <div class="w-full max-w-[1800px] flex flex-col">
      
      <!-- ==========================================
           1. TOP SEARCH INPUT BAR
           ========================================== -->
      <div class="w-full max-w-4xl mx-auto mb-8 md:mb-10">
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
            placeholder="Search stories, destinations, or experiences..."
            aria-label="Search stories, destinations, or experiences"
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

      <!-- ==========================================
           2. CENTERED CURVED TRAPEZIUM TABS (ARTICLES / CASE STUDIES)
           ========================================== -->
      <div
        role="tablist"
        aria-label="Journal Content Type"
        class="trapezium-tab-bar max-w-3xl mx-auto mb-6 md:mb-8"
      >
        <button
          role="tab"
          type="button"
          :aria-selected="activeTab === 'articles'"
          @click="emit('update:activeTab', 'articles')"
          class="trapezium-tab"
          :class="activeTab === 'articles' ? 'trapezium-tab-active' : ''"
        >
          <svg
            v-if="activeTab === 'articles'"
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
          <span>ARTICLES</span>
          <span v-if="activeTab === 'articles'" class="trapezium-tab-indicator" />
        </button>

        <button
          role="tab"
          type="button"
          :aria-selected="activeTab === 'case-studies'"
          @click="emit('update:activeTab', 'case-studies')"
          class="trapezium-tab"
          :class="activeTab === 'case-studies' ? 'trapezium-tab-active' : ''"
        >
          <svg
            v-if="activeTab === 'case-studies'"
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
          <span>CASE STUDIES</span>
          <span v-if="activeTab === 'case-studies'" class="trapezium-tab-indicator" />
        </button>
      </div>

      <!-- ==========================================
           3. MOBILE & TABLET FILTER ACCORDION + TOPICS (< 1024px)
           ========================================== -->
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
            <span>Filter by Category & Topic</span>
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
            class="section-subparagraph text-journey-deep/80 underline underline-offset-4 hover:text-intention-blue active:text-intention-blue font-medium"
          >
            Clear filters
          </button>
        </div>

        <!-- Topics Strip on Mobile -->
        <div class="w-full flex flex-wrap items-center gap-2 py-1">
          <button
            v-for="topic in topicOptions"
            :key="topic"
            type="button"
            @click="toggleTopic(topic)"
            class="shrink-0 px-3 py-1.5 rounded-sm border card-tag font-primary transition-all duration-200 cursor-pointer active:scale-96"
            :class="
              selectedTopics.includes(topic)
                ? 'bg-journey-deep text-surface-light border-journey-deep font-medium'
                : 'bg-surface-light text-journey-deep/75 border-journey-deep/15 hover:border-action-blue'
            "
          >
            {{ topic }}
          </button>
        </div>

        <!-- Expandable Mobile Category Drawer -->
        <div
          v-if="isMobileFilterOpen"
          class="w-full p-5 rounded-2xl bg-surface-light border border-journey-deep/15 shadow-sm flex flex-col gap-5"
        >
          <div>
            <h3 class="section-subparagraph font-semibold text-journey-deep pb-2 mb-3 border-b border-divider-light">
              Categories
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                v-for="cat in categoryOptions"
                :key="cat.id"
                type="button"
                @click="toggleCategory(cat.id)"
                class="flex items-center gap-3 py-1.5 text-left cursor-pointer group"
              >
                <span
                  class="w-4.5 h-4.5 rounded-xs border flex items-center justify-center transition-colors"
                  :class="
                    selectedCategories.includes(cat.id)
                      ? 'bg-dark-gold border-dark-gold text-surface-light'
                      : 'bg-surface-light border-journey-deep/30 group-hover:border-action-blue'
                  "
                >
                  <svg
                    v-if="selectedCategories.includes(cat.id)"
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
                  {{ cat.label }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ==========================================
           4. LIVE FILTER READOUT BAR
           ========================================== -->
      <div class="filter-readout-bar">
        <div class="flex flex-wrap items-center gap-2 text-left">
          <span class="section-subparagraph font-semibold text-journey-deep">
            {{ filteredPosts.length }}
            {{ activeTab === 'articles' ? 'Articles' : 'Case Studies' }}
          </span>

          <template v-if="selectedCategoryLabels.length > 0">
            <span class="text-journey-deep/35">·</span>
            <span class="section-subparagraph text-dark-gold font-medium">
              {{ selectedCategoryLabels.join(', ') }}
            </span>
          </template>

          <template v-if="selectedTopics.length > 0">
            <span class="text-journey-deep/35">·</span>
            <span class="section-subparagraph text-action-blue font-medium">
              {{ selectedTopics.join(' ') }}
            </span>
          </template>
        </div>

        <button
          v-if="activeFilterCount > 0"
          type="button"
          @click="clearAllFilters"
          class="section-subparagraph text-journey-deep/80 underline underline-offset-4 hover:text-intention-blue active:text-intention-blue font-medium transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      </div>

      <!-- ==========================================
           5. MAIN WORKSPACE: LEFT SIDEBAR (lg+) + RIGHT 3-COL CARDS
           ========================================== -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        <!-- Left Sticky Sidebar (Desktop lg+) -->
        <aside class="hidden lg:flex lg:col-span-3 flex-col gap-8 lg:sticky lg:top-28">
          
          <!-- Categories Checklist -->
          <div class="flex flex-col">
            <h3 class="section-subparagraph font-semibold text-journey-deep pb-2.5 mb-3.5 border-b border-journey-deep/15">
              Categories
            </h3>

            <div class="flex flex-col gap-2.5">
              <button
                v-for="cat in categoryOptions"
                :key="cat.id"
                type="button"
                @click="toggleCategory(cat.id)"
                class="flex items-center gap-3 py-1 text-left cursor-pointer group"
              >
                <span
                  class="w-4.5 h-4.5 rounded-xs border flex items-center justify-center shrink-0 transition-colors"
                  :class="
                    selectedCategories.includes(cat.id)
                      ? 'bg-dark-gold border-dark-gold text-surface-light'
                      : 'bg-surface-light border-journey-deep/25 group-hover:border-action-blue'
                  "
                >
                  <svg
                    v-if="selectedCategories.includes(cat.id)"
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
                  class="section-subparagraph transition-colors"
                  :class="
                    selectedCategories.includes(cat.id)
                      ? 'text-journey-deep font-semibold'
                      : 'text-secondary-light group-hover:text-journey-deep'
                  "
                >
                  {{ cat.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- Topics Hashtag Pills -->
          <div class="flex flex-col">
            <h3 class="section-subparagraph font-semibold text-journey-deep pb-2.5 mb-3.5 border-b border-journey-deep/15">
              Topics
            </h3>

            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="topic in topicOptions"
                :key="topic"
                type="button"
                @click="toggleTopic(topic)"
                class="px-3 py-1.5 rounded-sm border card-tag font-primary transition-all duration-200 cursor-pointer active:scale-96"
                :class="
                  selectedTopics.includes(topic)
                    ? 'bg-journey-deep text-surface-light border-journey-deep font-medium shadow-2xs'
                    : 'bg-surface-light text-journey-deep/75 border-journey-deep/15 hover:border-action-blue hover:text-journey-deep'
                "
              >
                {{ topic }}
              </button>
            </div>
          </div>

        </aside>

        <!-- Right 3-Column Card Grid Using Reusable JournalCard -->
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
              Try clearing your search or selecting a different category or topic.
            </p>
            <button
              type="button"
              @click="clearAllFilters"
              class="px-6 py-3 rounded-sm border-2 border-journey-deep text-journey-deep font-uppercase text-[11px] tracking-[0.2em] uppercase hover:bg-intention-blue hover:border-intention-blue hover:text-surface-light active:bg-intention-blue active:text-surface-light transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>

      </div>

    </div>
  </section>
</template>
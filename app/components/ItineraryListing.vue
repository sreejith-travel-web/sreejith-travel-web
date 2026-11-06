<!-- ~/components/ItineraryListing.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import ItineraryCard from '~/components/ItineraryCard.vue'
import type { ItineraryMeta, ItineraryCategoryId, ItineraryType } from '~~/server/utils/itinerariesData'

export type ItineraryTabFilter = 'signature' | 'collaborated' | 'travelyourway'

export interface CategoryMetaConfig {
  id: ItineraryCategoryId
  label: string
  cardSelectedClass: string
  cardUnselectedClass: string
  checkboxSelectedClass: string
}

const props = defineProps<{
  items: ItineraryMeta[]
  activeTab: ItineraryTabFilter
  selectedCategories: ItineraryCategoryId[]
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', tab: ItineraryTabFilter): void
  (e: 'toggle-category', categoryId: ItineraryCategoryId): void
  (e: 'clear-filters'): void
}>()

const tabsConfig: Array<{ id: ItineraryTabFilter; label: string }> = [
  { id: 'signature', label: 'SIGNATURE' },
  { id: 'collaborated', label: 'COLLABORATED' },
  { id: 'travelyourway', label: 'CATEGORIES' }
]

const categoryConfigs: CategoryMetaConfig[] = [
  {
    id: 'nature',
    label: 'Nature & Wilderness',
    cardSelectedClass: 'bg-deep-forest/12 border-deep-forest/45 opacity-100 shadow-2xs',
    cardUnselectedClass: 'bg-deep-forest/6 border-deep-forest/20 opacity-60 hover:opacity-80 active:opacity-95',
    checkboxSelectedClass: 'bg-deep-forest border-deep-forest text-surface-light'
  },
  {
    id: 'culture',
    label: 'Culture & Heritage',
    cardSelectedClass: 'bg-terracotta/12 border-terracotta/45 opacity-100 shadow-2xs',
    cardUnselectedClass: 'bg-terracotta/6 border-terracotta/20 opacity-60 hover:opacity-80 active:opacity-95',
    checkboxSelectedClass: 'bg-terracotta border-terracotta text-surface-light'
  },
  {
    id: 'stays',
    label: 'Places to Stay',
    cardSelectedClass: 'bg-action-blue/14 border-action-blue/45 opacity-100 shadow-2xs',
    cardUnselectedClass: 'bg-action-blue/7 border-action-blue/20 opacity-60 hover:opacity-80 active:opacity-95',
    checkboxSelectedClass: 'bg-action-blue border-action-blue text-surface-light'
  },
  {
    id: 'offbeat',
    label: 'Offbeat Explorations',
    cardSelectedClass: 'bg-spiced-copper/14 border-spiced-copper/45 opacity-100 shadow-2xs',
    cardUnselectedClass: 'bg-spiced-copper/7 border-spiced-copper/20 opacity-60 hover:opacity-80 active:opacity-95',
    checkboxSelectedClass: 'bg-spiced-copper border-spiced-copper text-surface-light'
  },
  {
    id: 'wellness',
    label: 'Wellness & Spirit',
    cardSelectedClass: 'bg-olive-drab/12 border-olive-drab/45 opacity-100 shadow-2xs',
    cardUnselectedClass: 'bg-olive-drab/6 border-olive-drab/20 opacity-60 hover:opacity-80 active:opacity-95',
    checkboxSelectedClass: 'bg-olive-drab border-olive-drab text-surface-light'
  },
  {
    id: 'bespoke',
    label: 'Bespoke Luxury',
    cardSelectedClass: 'bg-midnight-slate/12 border-midnight-slate/45 opacity-100 shadow-2xs',
    cardUnselectedClass: 'bg-midnight-slate/6 border-midnight-slate/20 opacity-60 hover:opacity-80 active:opacity-95',
    checkboxSelectedClass: 'bg-midnight-slate border-midnight-slate text-surface-light'
  }
]

const isCategorySelected = (id: ItineraryCategoryId) => props.selectedCategories.includes(id)

// Priority Ranking for Travel Your Way: 1 = Signature, 2 = Collaborated, 3 = Essential
const tierPriorityWeight: Record<ItineraryType, number> = {
  signature: 1,
  collaborated: 2,
  essential: 3
}

const filteredItineraries = computed(() => {
  if (props.activeTab === 'signature') {
    return props.items.filter((item) => item.type === 'signature')
  }

  if (props.activeTab === 'collaborated') {
    return props.items.filter((item) => item.type === 'collaborated')
  }

  // TRAVEL YOUR WAY TAB: Includes Signature (1st), Collaborated (2nd), and Essential (3rd)
  const matching = props.items.filter((item) => {
    if (props.selectedCategories.length === 0) return true
    return props.selectedCategories.some((catId) => item.categories.includes(catId))
  })

  return [...matching].sort(
    (a, b) => tierPriorityWeight[a.type] - tierPriorityWeight[b.type]
  )
})

const selectedCategoryNames = computed(() => {
  return props.selectedCategories
    .map((id) => categoryConfigs.find((c) => c.id === id)?.label)
    .filter(Boolean) as string[]
})

const activeTabTitle = computed(() => {
  if (props.activeTab === 'signature') return 'Signature Journeys'
  if (props.activeTab === 'collaborated') return 'Collaborated Journeys'
  return 'Journeys Found'
})
</script>

<template>
  <section
    id="find-your-journey"
    data-theme="light"
    class="section-wrapper bg-bg-light text-primary-lightt"
  >
    <div class="w-full max-w-7xl flex flex-col items-center">
      
      <!-- 1. Section Header -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-8 md:mb-10 px-4">
        <div class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            EXPLORE THE COLLECTION
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2 class="section-title-wrapper">
          <span class="text-journey-deep section-title-sans">
            FIND YOUR JOURNEY
          </span>
          <span class="text-dark-gold section-title-cursive">
            Travel your way.
          </span>
        </h2>
      </div>

      <!-- 2. Centered Curved Trapezium Tabs (SIGNATURE | COLLABORATED | TRAVEL YOUR WAY) -->
      <div
        role="tablist"
        aria-label="Journey Collection Tabs"
        class="trapezium-tab-bar max-w-4xl mx-auto mb-8 md:mb-10"
      >
        <button
          v-for="tab in tabsConfig"
          :key="tab.id"
          role="tab"
          type="button"
          :aria-selected="activeTab === tab.id"
          @click="emit('update:activeTab', tab.id)"
          class="trapezium-tab"
          :class="activeTab === tab.id ? 'trapezium-tab-active' : ''"
        >
          <svg
            v-if="activeTab === tab.id"
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
          <span>{{ tab.label }}</span>
          <span v-if="activeTab === tab.id" class="trapezium-tab-indicator" />
        </button>
      </div>

      <!-- 3. 6 Multi-Tinted Category Cards (Visible ONLY inside TRAVEL YOUR WAY tab) -->
      <div
        v-if="activeTab === 'travelyourway'"
        class="w-full max-w-4xl mx-auto flex flex-col items-center mb-8 md:mb-10"
      >
        <p class="section-subparagraph text-secondary-light mb-4">
          Select one or more interests to filter routes
        </p>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 w-full">
          <button
            v-for="cat in categoryConfigs"
            :key="cat.id"
            type="button"
            :aria-pressed="isCategorySelected(cat.id)"
            @click="emit('toggle-category', cat.id)"
            class="category-filter-card"
            :class="isCategorySelected(cat.id) ? cat.cardSelectedClass : cat.cardUnselectedClass"
          >
            <span
              class="category-checkbox-box"
              :class="
                isCategorySelected(cat.id)
                  ? cat.checkboxSelectedClass
                  : 'bg-surface-light/80 border-journey-deep/30 text-transparent'
              "
            >
              <svg
                class="w-3.5 h-3.5 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>

            <span class="section-subparagraph font-medium text-journey-deep leading-snug">
              {{ cat.label }}
            </span>
          </button>
        </div>
      </div>

      <!-- 4. Live Filter Readout Bar -->
      <div class="filter-readout-bar">
        <div class="flex flex-wrap items-center gap-2 text-left">
          <span class="section-subparagraph font-semibold text-journey-deep">
            {{ filteredItineraries.length }} {{ activeTabTitle }}
          </span>

          <template v-if="activeTab === 'travelyourway' && selectedCategoryNames.length > 0">
            <span class="text-journey-deep/35">·</span>
            <span class="section-subparagraph text-dark-gold font-medium">
              {{ selectedCategoryNames.join(', ') }}
            </span>
          </template>
        </div>

        <button
          v-if="activeTab === 'travelyourway' && selectedCategories.length > 0"
          type="button"
          @click="emit('clear-filters')"
          class="section-subparagraph text-journey-deep/80 underline underline-offset-4 hover:text-intention-blue active:text-intention-blue font-medium transition-colors cursor-pointer"
        >
          Clear filters
        </button>
      </div>

      <!-- 5. 3-Column Equal-Height Itinerary Card Grid -->
      <div
        v-if="filteredItineraries.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full items-stretch"
      >
        <ItineraryCard
          v-for="item in filteredItineraries"
          :key="item.id"
          :item="item"
        />
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="w-full py-16 px-6 rounded-2xl bg-surface-light border border-journey-deep/10 flex flex-col items-center text-center"
      >
        <p class="section-subtitle text-journey-deep mb-2">
          No journeys match this exact selection.
        </p>
        <p class="section-paragraph text-secondary-light mb-6">
          Try clearing one of your selected categories.
        </p>
        <button
          type="button"
          @click="emit('clear-filters')"
          class="px-6 py-3 rounded-sm border-2 border-journey-deep text-journey-deep font-uppercase text-[11px] tracking-[0.2em] uppercase hover:bg-intention-blue hover:border-intention-blue hover:text-surface-light active:bg-intention-blue active:text-surface-light transition-all cursor-pointer"
        >
          Clear Category Filters
        </button>
      </div>

    </div>
  </section>
</template>
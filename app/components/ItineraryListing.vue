<!-- ~/app/components/ItineraryListing.vue -->
<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import ItineraryCard from '~/components/ItineraryCard.vue'
import TrapeziumTabBar, { type TrapeziumTabOption } from '~/components/TrapeziumTabBar.vue'
import { useEditorialGlide } from '~/composables/useEditorialGlide'
import type {
  ItineraryMeta,
  ItineraryCategoryId,
  ItineraryType
} from '~~/server/utils/itinerariesData'

export type ItineraryTabFilter = 'signature' | 'collaborated' | 'categories'

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

const {
  glidePageScrollTo,
  lockPanelHeightBeforeLeave,
  releasePanelHeightAfterEnter
} = useEditorialGlide()

const tabsConfig: TrapeziumTabOption[] = [
  { id: 'signature', label: 'SIGNATURE' },
  { id: 'collaborated', label: 'COLLABORATED' },
  { id: 'categories', label: 'CATEGORIES' }
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

// Priority Ranking for Categories Tab: 1 = Signature, 2 = Collaborated, 3 = Essential
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

const activeTabDescription = computed(() => {
  if (props.activeTab === 'signature') {
    return 'Handcrafted slow-travel routes shaped through years of ground research, intimate community access, and unhurried cultural immersion across Kerala and South India.'
  }
  if (props.activeTab === 'collaborated') {
    return 'Co-created regional journeys designed alongside specialist naturalists, historians, and regional hosts across the wider Indian subcontinent.'
  }
  return ''
})

// =========================================================
// PER-TAB SCROLL MEMORY & SILK GLIDE
// =========================================================
const tabBarRef = ref<InstanceType<typeof TrapeziumTabBar> | null>(null)
const tabContentTopRef = ref<HTMLElement | null>(null)
const savedTabScrollY = ref<Partial<Record<ItineraryTabFilter, number>>>({})

const getTabContentTopScrollY = (): number =>
  tabBarRef.value?.getAnchorTargetScrollY(tabContentTopRef.value) ?? 0

const handleTabSelect = async (rawTabId: string) => {
  const nextTab = rawTabId as ItineraryTabFilter
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

  emit('update:activeTab', nextTab)

  await nextTick()
  requestAnimationFrame(() => {
    const contentTopY = getTabContentTopScrollY()
    const targetY =
      previousScrollForNextTab !== undefined
        ? previousScrollForNextTab
        : contentTopY

    glidePageScrollTo(targetY)
  })
}
</script>

<template>
  <section
    id="find-your-journey"
    data-theme="light"
    class="section-wrapper overflow-x-clip! bg-bg-light text-primary-light"
  >
    <div class="w-full max-w-7xl flex flex-col items-center">
      <!-- 1. Section Header -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-6 md:mb-8 px-4">
        <div class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            EXPLORE THE COLLECTION
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2 class="section-title-wrapper drop-shadow-none!">
          <span class="text-journey-deep section-title-sans">
            FIND YOUR JOURNEY
          </span>
          <span class="text-dark-gold section-title-cursive">
            Travel your way.
          </span>
        </h2>
      </div>

      <!-- 2. Unified Sticky Curved Trapezium Tabs -->
      <TrapeziumTabBar
        ref="tabBarRef"
        :tabs="tabsConfig"
        :active-tab="activeTab"
        aria-label="Journey Collection Tabs"
        max-width-class="max-w-4xl"
        wrapper-class="mb-6 md:mb-8"
        id-prefix="itinerary"
        @select="handleTabSelect"
      />

      <!-- Invisible Scroll Anchor Marking the Top of Tab Content -->
      <div ref="tabContentTopRef" class="w-full h-0" aria-hidden="true" />

      <!-- 3. Active Tab Panel (Slow 380ms/740ms Glide + Zero-CLS Height Lock) -->
      <div class="w-full">
        <Transition
          name="editorial-tab-panel"
          mode="out-in"
          @before-leave="lockPanelHeightBeforeLeave"
          @after-enter="releasePanelHeightAfterEnter"
        >
          <div
            :id="`itinerary-panel-${activeTab}`"
            :key="activeTab"
            role="tabpanel"
            :aria-labelledby="`itinerary-tab-${activeTab}`"
            class="w-full flex flex-col items-center"
          >
            <!-- 3A. Signature & Collaborated Intro Paragraph -->
            <div
              v-if="activeTab === 'signature' || activeTab === 'collaborated'"
              class="w-full max-w-4xl mx-auto flex justify-center text-center mb-8 md:mb-10 px-4"
            >
              <p class="hero-paragraph text-secondary-light/90 max-w-3xl">
                {{ activeTabDescription }}
              </p>
            </div>

            <!-- 3B. 6 Multi-Tinted Category Filter Pills (Micro-Safe 1 -> 2 -> 3 CSS Grid) -->
            <div
              v-else-if="activeTab === 'categories'"
              class="w-full max-w-4xl mx-auto flex flex-col items-center mb-8 md:mb-10"
            >
              <p class="section-subparagraph text-secondary-light mb-4 text-center">
                Select one or more interests to filter routes
              </p>

              <div class="grid grid-cols-1 min-[360px]:grid-cols-2 md:grid-cols-3 auto-rows-fr gap-2.5 sm:gap-4 w-full">
                <button
                  v-for="cat in categoryConfigs"
                  :key="cat.id"
                  type="button"
                  :aria-pressed="isCategorySelected(cat.id)"
                  class="category-filter-card h-full"
                  :class="isCategorySelected(cat.id) ? cat.cardSelectedClass : cat.cardUnselectedClass"
                  @click="emit('toggle-category', cat.id)"
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

            <!-- 4 & 5. Width-Synced Readout Bar + Flex-Wrap Journey Stage -->
            <div class="itinerary-collection-stage">
              <!-- Live Filter Readout Bar -->
              <div class="filter-readout-bar">
                <div class="flex flex-wrap items-center gap-2 text-left">
                  <span class="section-subparagraph font-semibold text-journey-deep">
                    {{ filteredItineraries.length }} {{ activeTabTitle }}
                  </span>

                  <template v-if="activeTab === 'categories' && selectedCategoryNames.length > 0">
                    <span class="text-journey-deep/35">·</span>
                    <span class="section-subparagraph text-dark-gold font-medium">
                      {{ selectedCategoryNames.join(', ') }}
                    </span>
                  </template>
                </div>

                <button
                  v-if="activeTab === 'categories' && selectedCategories.length > 0"
                  type="button"
                  class="section-subparagraph text-journey-deep/80 underline underline-offset-4 hover:text-intention-blue active:text-intention-blue font-medium transition-colors cursor-pointer"
                  @click="emit('clear-filters')"
                >
                  Clear filters
                </button>
              </div>

              <!-- Flex-Wrap Equal-Height Itinerary Cards (Centered on Mobile, Flush-Left Final Row on md+) -->
              <div
                v-if="filteredItineraries.length > 0"
                class="itinerary-listing-flex"
              >
                <div
                  v-for="(item, idx) in filteredItineraries"
                  :key="item.id"
                  v-motion-atelier-card
                  :delay="(idx % 3) * 65"
                  class="itinerary-listing-slot"
                >
                  <ItineraryCard :item="item" />
                </div>
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
                  class="px-6 py-3 rounded-sm border-2 border-journey-deep text-journey-deep font-uppercase text-[11px] tracking-[0.2em] uppercase hover:bg-intention-blue hover:border-intention-blue hover:text-surface-light active:bg-intention-blue active:text-surface-light transition-all cursor-pointer"
                  @click="emit('clear-filters')"
                >
                  Clear Category Filters
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Typography-Locked Card Token Ladder (Identical to ItinerarySlider) */
.itinerary-collection-stage {
  --itin-card-w: min(calc(100vw - 1.5rem), 16.25rem);
  --itin-gap: 1.25rem;
  width: 100%;
  max-width: 26rem;
  margin-inline: auto;
}

@media (min-width: 321px) {
  .itinerary-collection-stage {
    --itin-card-w: 19.75rem;
  }
}

@media (min-width: 481px) {
  .itinerary-collection-stage {
    --itin-card-w: 19rem;
  }
}

@media (min-width: 640px) {
  .itinerary-collection-stage {
    --itin-card-w: 20rem;
  }
}

@media (min-width: 768px) {
  .itinerary-collection-stage {
    --itin-card-w: 20.25rem;
    --itin-gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .itinerary-collection-stage {
    --itin-card-w: 21.25rem;
  }
}

@media (min-width: 1280px) {
  .itinerary-collection-stage {
    --itin-card-w: 22.25rem;
  }
}

/* Exact Row-Fit Caps (+1px DPR safety): Syncs Readout Bar & Keeps Orphan Rows Flush-Left */
@media (min-width: 740px) {
  .itinerary-collection-stage {
    max-width: calc(2 * var(--itin-card-w) + var(--itin-gap) + 1px);
  }
}

@media (min-width: 1196px) {
  .itinerary-collection-stage {
    max-width: calc(3 * var(--itin-card-w) + 2 * var(--itin-gap) + 1px);
  }
}

.itinerary-listing-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: stretch;
  gap: var(--itin-gap);
  width: 100%;
  max-width: var(--itin-card-w);
  margin-inline: auto;
}

@media (min-width: 740px) {
  .itinerary-listing-flex {
    max-width: none;
  }
}

.itinerary-listing-slot {
  display: flex;
  width: var(--itin-card-w);
  flex: 0 0 var(--itin-card-w);
}
</style>
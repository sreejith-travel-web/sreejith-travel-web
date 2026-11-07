<!-- ~/app/components/ItinerarySingleView.vue -->
<script setup lang="ts">
import { ref, computed, onMounted, onActivated } from 'vue'
import ItineraryHeader from '~/components/itineraries/ItineraryHeader.vue'
import ItineraryScrollNav, { type ScrollNavSection } from '~/components/itineraries/ItineraryScrollNav.vue'
import ItinerarySidebar, { type ItinerarySidebarData } from '~/components/itineraries/ItinerarySidebar.vue'
import ItineraryLightbox from '~/components/itineraries/ItineraryLightbox.vue'
import type { LightboxMediaItem, LightboxOpenPayload } from '~/components/Lightbox.vue'
import RelatedItineraries, { type RelatedItinerariesConfig } from '~/components/RelatedItineraries.vue'
import { useTravelSeo } from '~/composables/useTravelSeo'
import {
  ITINERARIES_DATABASE,
  type ItineraryFullRecord,
  type ItineraryMeta
} from '~~/server/utils/itinerariesData'

const props = defineProps<{
  record: ItineraryFullRecord
}>()

const { forceTransparent } = useHeaderTheme()

const syncLightHeader = () => {
  forceTransparent.value = false
}

onMounted(syncLightHeader)
onActivated(syncLightHeader)

// =========================================================
// ROOT LIGHTBOX STATE
// =========================================================
const lightboxState = ref<{
  isOpen: boolean
  items: LightboxMediaItem[]
  index: number
}>({
  isOpen: false,
  items: [],
  index: 0
})

const openLightbox = (payload: LightboxOpenPayload) => {
  if (!payload?.items?.length) return
  lightboxState.value = {
    isOpen: true,
    items: payload.items,
    index: payload.index || 0
  }
}

const closeLightbox = () => {
  lightboxState.value.isOpen = false
}

// =========================================================
// NORMALIZED SIDEBAR (Merges per-itinerary price with brand defaults)
// =========================================================
const resolvedSidebar = computed<ItinerarySidebarData>(() => ({
  budgetLabel: props.record.sidebar?.budgetLabel || 'ESTIMATED BUDGET',
  price: props.record.sidebar?.price || 'From USD 1,450',
  priceUnit: props.record.sidebar?.priceUnit || 'per person',
  ctaTitle: props.record.sidebar?.ctaTitle || 'Want this trip, but shaped around you?',
  ctaSubtitle:
    props.record.sidebar?.ctaSubtitle ||
    'Every route is a starting point—talk to us to adjust the pace, stays, or detours.',
  planLabel: props.record.sidebar?.planLabel || 'Plan Your Journey',
  planTo: props.record.sidebar?.planTo || '/planYourJourney',
  enquireLabel: props.record.sidebar?.enquireLabel || 'Enquire',
  enquireTo: props.record.sidebar?.enquireTo || '/contact',
  partnerEyebrow: props.record.sidebar?.partnerEyebrow || 'FOR TRAVEL PARTNERS',
  consultLabel: props.record.sidebar?.consultLabel || 'Consult With Me',
  consultTo: props.record.sidebar?.consultTo || '/planYourJourney',
  phone: props.record.sidebar?.phone || '+91 99433 60478',
  whatsapp: props.record.sidebar?.whatsapp || '919943360478',
  email: props.record.sidebar?.email || 'mokshastories@mokshastories.com',
  shareTitle: props.record.sidebar?.shareTitle || props.record.header.title,
  shareText: props.record.sidebar?.shareText || props.record.header.intro
}))

// =========================================================
// AUTO-GENERATED STICKY SCROLL-SPY TABS
// =========================================================
const navSections = computed<ScrollNavSection[]>(() =>
  (props.record.sections || [])
    .filter((section) => section.blocks && section.blocks.length > 0)
    .map((section) => ({
      id: section.id,
      label: section.label
    }))
)

// =========================================================
// CURATED 3 RELATED ITINERARIES (Resolved via relatedSlugs)
// =========================================================
const relatedConfig = computed<RelatedItinerariesConfig>(() => {
  const slugs = props.record.relatedSlugs || []
  const matched = slugs
    .map(
      (s) =>
        ITINERARIES_DATABASE.find(
          (entry) => entry.meta.slug === s || entry.meta.id === s
        )?.meta
    )
    .filter((item): item is ItineraryMeta => Boolean(item && item.slug !== props.record.meta.slug))

  const fallbackPool = ITINERARIES_DATABASE.filter(
    (entry) =>
      entry.meta.slug !== props.record.meta.slug &&
      !matched.some((m) => m.slug === entry.meta.slug)
  ).map((e) => e.meta)

  const items = [...matched, ...fallbackPool].slice(0, 3)

  return {
    eyebrow: 'CONTINUE EXPLORING',
    titleLine1: 'Related',
    titleLine2Cursive: 'Journeys.',
    items
  }
})

// =========================================================
// DYNAMIC ITINERARY SEO & JSON-LD @GRAPH
// =========================================================
useTravelSeo({
  pageTitle: props.record.seo?.pageTitle || props.record.header.title,
  pageDesc: props.record.seo?.pageDesc || props.record.header.intro,
  canonicalPath: `/itineraries/${props.record.meta.slug}`,
  ogImage: props.record.seo?.ogImage || '/images/favicons/sreejith-og-image.jpg',
  ogImageAlt: props.record.seo?.ogImageAlt || props.record.header.coverAlt,
  pageType: 'itinerary',
  breadcrumbName:
    props.record.seo?.breadcrumbName ||
    props.record.header.breadcrumbs[props.record.header.breadcrumbs.length - 1]?.label ||
    props.record.header.title,
  publishDate: props.record.seo?.publishDate,
  priceText: resolvedSidebar.value.price,
  itinerarySections: props.record.sections
})
</script>

<template>
  <div class="min-h-screen bg-bg-light text-journey-deep pb-24 lg:pb-32">
    <!-- 1. ITINERARY HEADER -->
    <ItineraryHeader :data="record.header" />

    <!-- 2. STICKY HORIZONTAL SCROLL-SPY NAVIGATION -->
    <ItineraryScrollNav :sections="navSections" />

    <!-- 3. MAIN 12-COLUMN EDITORIAL GRID + STICKY RIGHT SIDEBAR -->
    <div class="section-wrapper pt-8! sm:pt-12! pb-12!">
      <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        <!-- LEFT COLUMN: Section-Grouped Dynamic Block Dispatcher -->
        <div class="lg:col-span-8 flex flex-col gap-12 sm:gap-16 w-full">
          <div
            v-for="section in record.sections"
            :id="section.id"
            :key="section.id"
            class="scroll-mt-36 flex flex-col gap-8 sm:gap-10 w-full"
          >
            <template
              v-for="(block, bIdx) in section.blocks"
              :key="`${section.id}-${block.type}-${bIdx}`"
            >
              <LazyItinerariesBlocksBlockSummary
                v-if="block.type === 'summary'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockItinerary
                v-else-if="block.type === 'itinerary'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockChecklist
                v-else-if="block.type === 'checklist'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockNumberedList
                v-else-if="block.type === 'numbered-list'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockQuote
                v-else-if="block.type === 'quote'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockTipNote
                v-else-if="block.type === 'tip-note'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockDesignerProfile
                v-else-if="block.type === 'designer-profile'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockCustomerQuery
                v-else-if="block.type === 'customer-query'"
                hydrate-on-visible
                :data="block.data"
              />

              <LazyItinerariesBlocksBlockMasonry
                v-else-if="block.type === 'masonry'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockSlider
                v-else-if="block.type === 'slider'"
                hydrate-on-visible
                :data="block.data"
                @open-lightbox="openLightbox"
              />

              <LazyItinerariesBlocksBlockYoutube
                v-else-if="block.type === 'youtube'"
                hydrate-on-visible
                :data="block.data"
              />
            </template>
          </div>
        </div>

        <!-- RIGHT COLUMN: Sticky Desktop Sidebar + Mobile Bottom Bar & Popup -->
        <div class="lg:col-span-4 w-full lg:sticky lg:top-36 self-start">
          <ItinerarySidebar :data="resolvedSidebar" />
        </div>

      </div>
    </div>

    <!-- 4. RELATED ITINERARIES (Curated 3 Related Slugs) -->
    <RelatedItineraries
      v-if="relatedConfig.items.length > 0"
      :data="relatedConfig"
    />

    <!-- 5. ROOT-LEVEL ITINERARY LIGHTBOX -->
    <ItineraryLightbox
      :is-open="lightboxState.isOpen"
      :items="lightboxState.items"
      :initial-index="lightboxState.index"
      @close="closeLightbox"
    />
  </div>
</template>
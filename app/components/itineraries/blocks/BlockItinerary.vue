<!-- ~/app/components/itineraries/blocks/BlockItinerary.vue -->
<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export interface ItineraryAccordionImage {
  src: string
  alt: string
  caption?: string
}

export interface ItineraryAccordionItem {
  id: string
  headerTitle: string
  bodySubtitle?: string
  paragraphs?: string[]
  listTitle?: string
  listItems?: string[]
  images?: ItineraryAccordionImage[]
  imageOrientation?: 'landscape' | 'square' | 'portrait'
  imageLayout?: 'side-by-side' | 'block'
  imageAspectRatio?: string
}

export interface ItineraryProgressionBlockData {
  sectionId?: string
  introTitle?: string
  introParagraphs?: string[]
  title: string
  items: ItineraryAccordionItem[]
}

const props = withDefaults(
  defineProps<{
    data: ItineraryProgressionBlockData
  }>(),
  {
    data: () => ({
      sectionId: 'itinerary',
      title: 'Detailed Progression',
      items: []
    })
  }
)

const emit = defineEmits<{
  (
    e: 'open-lightbox',
    payload: { items: Array<{ src: string; alt: string; caption?: string }>; index: number }
  ): void
}>()

// --- Element Refs for Exact Scroll Compensation ---
const headerRefs = ref<Record<string, HTMLElement | null>>({})
const panelRefs = ref<Record<string, HTMLElement | null>>({})

const setHeaderRef = (id: string, el: unknown) => {
  headerRefs.value[id] = el as HTMLElement | null
}

const setPanelRef = (id: string, el: unknown) => {
  panelRefs.value[id] = el as HTMLElement | null
}

// --- Accordion State Machine ---
const isExpandAllMode = ref(false)
const openIds = ref<string[]>(props.data.items[0]?.id ? [props.data.items[0].id] : [])
const settledOpenIds = ref<string[]>(props.data.items[0]?.id ? [props.data.items[0].id] : [])

const settleTimers = new Map<string, ReturnType<typeof setTimeout>>()
let scrollRafId: number | null = null

const stopSmoothScroll = () => {
  if (scrollRafId !== null) {
    cancelAnimationFrame(scrollRafId)
    scrollRafId = null
  }
}

const clearAllTimers = () => {
  settleTimers.forEach((timer) => clearTimeout(timer))
  settleTimers.clear()
}

const scheduleSettleOpen = (id: string) => {
  const existing = settleTimers.get(id)
  if (existing) clearTimeout(existing)

  const timer = setTimeout(() => {
    if (openIds.value.includes(id) && !settledOpenIds.value.includes(id)) {
      settledOpenIds.value.push(id)
    }
    settleTimers.delete(id)
  }, 320)

  settleTimers.set(id, timer)
}

const removeSettledId = (id: string) => {
  const existing = settleTimers.get(id)
  if (existing) {
    clearTimeout(existing)
    settleTimers.delete(id)
  }
  settledOpenIds.value = settledOpenIds.value.filter((item) => item !== id)
}

const isItemOpen = (id: string) => openIds.value.includes(id)
const isItemSettled = (id: string) => settledOpenIds.value.includes(id)

const areAllExpanded = computed(() => {
  return (
    props.data.items.length > 0 &&
    props.data.items.every((item) => openIds.value.includes(item.id))
  )
})

// --- Synced 320ms Smooth Scroll to Clicked Accordion Header ---
const smoothScrollToHeader = (id: string, closingHeightAbove = 0) => {
  if (!import.meta.client) return
  const headerEl = headerRefs.value[id]
  if (!headerEl) return

  stopSmoothScroll()

  const startY = window.scrollY
  const rect = headerEl.getBoundingClientRect()
  const isMobile = window.innerWidth < 768
  const stickyTopOffset = isMobile ? 124 : 148

  const targetY = Math.max(0, rect.top + startY - closingHeightAbove - stickyTopOffset)
  const delta = targetY - startY

  if (Math.abs(delta) < 4) return

  const duration = 320
  const startTime = performance.now()

  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / duration)
    // Cubic ease-out matching the 300ms CSS Grid accordion transition
    const eased = 1 - Math.pow(1 - progress, 3)

    window.scrollTo(0, startY + delta * eased)

    if (progress < 1) {
      scrollRafId = requestAnimationFrame(step)
    } else {
      scrollRafId = null
    }
  }

  scrollRafId = requestAnimationFrame(step)
}

const toggleExpandAll = () => {
  clearAllTimers()
  stopSmoothScroll()

  if (areAllExpanded.value) {
    isExpandAllMode.value = false
    settledOpenIds.value = []
    openIds.value = []
  } else {
    isExpandAllMode.value = true
    const allIds = props.data.items.map((item) => item.id)
    openIds.value = [...allIds]
    allIds.forEach((id) => scheduleSettleOpen(id))
  }
}

const toggleItem = (id: string) => {
  const currentlyOpen = isItemOpen(id)

  if (isExpandAllMode.value) {
    if (currentlyOpen) {
      removeSettledId(id)
      openIds.value = openIds.value.filter((item) => item !== id)
      isExpandAllMode.value = false
    } else {
      openIds.value.push(id)
      scheduleSettleOpen(id)
      smoothScrollToHeader(id, 0)
    }
    return
  }

  // Standard Single-Open Mode
  if (currentlyOpen) {
    removeSettledId(id)
    openIds.value = []
  } else {
    // Measure height of any open panel(s) ABOVE the clicked item before closing them
    const clickedIdx = props.data.items.findIndex((item) => item.id === id)
    let closingHeightAbove = 0

    if (clickedIdx > 0) {
      for (let i = 0; i < clickedIdx; i++) {
        const prevId = props.data.items[i]?.id
        if (prevId && openIds.value.includes(prevId)) {
          const panelEl = panelRefs.value[prevId]
          if (panelEl) {
            closingHeightAbove += panelEl.offsetHeight
          }
        }
      }
    }

    clearAllTimers()
    settledOpenIds.value = []
    openIds.value = [id]
    scheduleSettleOpen(id)
    smoothScrollToHeader(id, closingHeightAbove)
  }
}

watch(
  () => props.data.items,
  (nextItems) => {
    clearAllTimers()
    stopSmoothScroll()
    isExpandAllMode.value = false
    const firstId = nextItems[0]?.id
    openIds.value = firstId ? [firstId] : []
    settledOpenIds.value = firstId ? [firstId] : []
  }
)

onBeforeUnmount(() => {
  clearAllTimers()
  stopSmoothScroll()
})

// --- Strict Image & Layout Resolution Helpers ---
const getValidImages = (item: ItineraryAccordionItem): ItineraryAccordionImage[] => {
  return (item.images || []).slice(0, 2)
}

const hasTextOrList = (item: ItineraryAccordionItem) => {
  return Boolean(item.paragraphs?.length || item.listItems?.length)
}

const isSideBySideSticky = (item: ItineraryAccordionItem) => {
  const imgs = getValidImages(item)
  if (!hasTextOrList(item) || imgs.length !== 1) return false

  const orientation = item.imageOrientation || 'square'
  if (orientation === 'landscape') return false
  if (orientation === 'portrait') return true

  return (item.imageLayout || 'side-by-side') === 'side-by-side'
}

const getStickyImageAspectStyle = (item: ItineraryAccordionItem) => {
  if (item.imageAspectRatio) return { aspectRatio: item.imageAspectRatio }
  const orientation = item.imageOrientation || 'square'
  return { aspectRatio: orientation === 'portrait' ? '4 / 5' : '1 / 1' }
}

const getBlockImageAspectStyle = (item: ItineraryAccordionItem) => {
  if (item.imageAspectRatio) return { aspectRatio: item.imageAspectRatio }
  const orientation = item.imageOrientation || 'landscape'
  const count = getValidImages(item).length

  if (orientation === 'landscape') {
    return { aspectRatio: count === 1 ? '16 / 9' : '16 / 10' }
  }
  if (orientation === 'portrait') {
    return { aspectRatio: '4 / 5' }
  }
  return { aspectRatio: '1 / 1' }
}

const handleImageLightbox = (item: ItineraryAccordionItem, index: number) => {
  const imgs = getValidImages(item)
  if (!imgs.length) return
  emit('open-lightbox', {
    items: imgs.map((img) => ({
      src: img.src,
      alt: img.alt,
      caption: img.caption || item.headerTitle
    })),
    index
  })
}
</script>

<template>
  <section
    :id="data.sectionId || 'itinerary'"
    aria-label="Detailed journey progression"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-bg-medium/55 border border-journey-deep/10 p-5 sm:p-8 md:p-10 shadow-2xs flex flex-col gap-8 sm:gap-10"
  >
    <!-- 1. OPTIONAL TOP INTRO -->
    <div
      v-if="data.introTitle || data.introParagraphs?.length"
      class="w-full flex flex-col items-start text-left pb-2 border-b border-journey-deep/10"
    >
      <h2
        v-if="data.introTitle"
        v-motion-fade-up
        class="section-smaller-subtitle font-medium text-intention-blue mb-3.5 sm:mb-4"
      >
        {{ data.introTitle }}
      </h2>

      <div
        v-if="data.introParagraphs?.length"
        v-motion-fade-up
        :delay="60"
        class="flex flex-col gap-3.5 w-full pb-4"
      >
        <p
          v-for="(introP, idx) in data.introParagraphs"
          :key="`pace-p-${idx}`"
          class="section-paragraph text-secondary-light/90"
        >
          {{ introP }}
        </p>
      </div>
    </div>

    <!-- 2. ACCORDION HEADER BAR + EXPAND ALL / CLOSE ALL BUTTON -->
    <div class="w-full flex flex-col gap-4 sm:gap-5">
      <div
        v-motion-fade-up
        class="w-full flex items-end justify-between gap-4 mb-1"
      >
        <h2 class="section-subtitle font-medium text-journey-deep">
          {{ data.title }}
        </h2>

        <button
          v-if="data.items.length > 1"
          id="itinerary-expand-all-btn"
          name="itinerary-expand-all"
          type="button"
          :aria-label="areAllExpanded ? 'Close all itinerary phases' : 'Expand all itinerary phases'"
          @click="toggleExpandAll"
          class="shrink-0 card-eyebrow mb-0! pt-1 pb-1 border-b border-intention-blue/45 hover:border-intention-blue text-intention-blue font-medium tracking-[0.16em]! cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue select-none"
        >
          {{ areAllExpanded ? 'Close all' : 'Expand all' }}
        </button>
      </div>

      <!-- 3. ACCORDION CARDS LIST ([overflow-anchor:none] prevents browser scroll-jump) -->
      <div class="w-full flex flex-col gap-3.5 sm:gap-4 [overflow-anchor:none]">
        <article
          v-for="(item, idx) in data.items"
          :key="item.id"
          v-motion-stagger-card
          :delay="idx * 60"
          class="w-full rounded-2xl sm:rounded-3xl bg-surface-light border transition-colors duration-300 [overflow-anchor:none]"
          :class="
            isItemOpen(item.id)
              ? 'border-intention-blue shadow-xs'
              : 'border-journey-deep/10 hover:border-intention-blue/40'
          "
        >
          <!-- Accordion Header Trigger -->
          <button
            :id="`accordion-header-${item.id}`"
            :ref="(el) => setHeaderRef(item.id, el)"
            :name="`accordion-toggle-${item.id}`"
            type="button"
            :aria-expanded="isItemOpen(item.id)"
            :aria-controls="`accordion-panel-${item.id}`"
            @click="toggleItem(item.id)"
            class="group w-full px-5 py-4 sm:px-7 sm:py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue rounded-2xl sm:rounded-3xl"
          >
            <h3 class="card-title mb-0! font-medium! text-intention-blue group-hover:text-journey-deep transition-colors duration-200">
              {{ item.headerTitle }}
            </h3>

            <!-- Right-Side Angle Circle Button (Intention Blue) -->
            <span
              class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300"
              :class="
                isItemOpen(item.id)
                  ? 'bg-intention-blue text-surface-light border border-intention-blue'
                  : 'bg-intention-blue/8 border border-intention-blue/25 text-intention-blue group-hover:bg-intention-blue group-hover:text-surface-light'
              "
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-4.5 h-4.5 transition-transform duration-300"
                :class="isItemOpen(item.id) ? 'rotate-180' : 'rotate-0'"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </button>

          <!-- Collapsible Accordion Body -->
          <div
            :id="`accordion-panel-${item.id}`"
            :ref="(el) => setPanelRef(item.id, el)"
            role="region"
            :aria-labelledby="`accordion-header-${item.id}`"
            class="grid transition-[grid-template-rows] duration-500 --ease-editorial"
            :class="isItemOpen(item.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div :class="isItemSettled(item.id) ? 'overflow-visible' : 'overflow-hidden'">
              <div class="px-5 pb-6 sm:px-7 sm:pb-7 md:px-8 md:pb-8 pt-5 sm:pt-6 border-t border-journey-deep/10 flex flex-col gap-5 sm:gap-6">
                
                <!-- STANDALONE BODY SUBTITLE -->
                <div
                  v-if="item.bodySubtitle"
                  class="w-full"
                >
                  <span class="card-eyebrow mb-0! pt-0.5 text-intention-blue font-medium tracking-[0.18em]! block">
                    {{ item.bodySubtitle }}
                  </span>
                </div>

                <!-- MODE A: SIDE-BY-SIDE STICKY (Strictly 1 Portrait or 1 Square Image on Right) -->
                <div
                  v-if="isSideBySideSticky(item)"
                  class="w-full grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start"
                >
                  <div class="md:col-span-7 flex flex-col gap-5 w-full">
                    <div
                      v-if="item.paragraphs?.length"
                      class="flex flex-col gap-4 w-full"
                    >
                      <p
                        v-for="(pText, pIdx) in item.paragraphs"
                        :key="`${item.id}-p-${pIdx}`"
                        class="section-paragraph text-secondary-light/90"
                      >
                        {{ pText }}
                      </p>
                    </div>

                    <div
                      v-if="item.listItems?.length"
                      class="flex flex-col gap-3 w-full"
                    >
                      <h4
                        v-if="item.listTitle"
                        class="section-subparagraph font-medium text-journey-deep"
                      >
                        {{ item.listTitle }}
                      </h4>

                      <ul class="flex flex-col gap-3">
                        <li
                          v-for="(bullet, bIdx) in item.listItems"
                          :key="`${item.id}-li-${bIdx}`"
                          class="flex items-start gap-3"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            class="w-5 h-5 text-intention-blue shrink-0 mt-0.5"
                            aria-hidden="true"
                          >
                            <circle cx="10" cy="12" r="8" stroke="currentColor" stroke-width="1.5" class="opacity-35" />
                            <path d="M6.5 12l3 3 8.5-9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <span class="section-subparagraph text-secondary-light/90">
                            {{ bullet }}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div class="md:col-span-5 w-full md:sticky md:top-36 self-start">
                    <button
                      v-if="getValidImages(item)[0]"
                      :id="`acc-img-${item.id}-0`"
                      :name="`acc-img-${item.id}-0`"
                      type="button"
                      :aria-label="`View ${getValidImages(item)[0]?.alt} in full screen`"
                      @click="handleImageLightbox(item, 0)"
                      :style="getStickyImageAspectStyle(item)"
                      class="group relative w-full rounded-2xl overflow-hidden bg-bg-light border border-journey-deep/8 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
                    >
                      <img
                        :src="getValidImages(item)[0]?.src"
                        :alt="getValidImages(item)[0]?.alt"
                        width="600"
                        height="750"
                        loading="lazy"
                        decoding="async"
                        class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                      />
                    </button>
                  </div>
                </div>

                <!-- MODE B: FULL-WIDTH BLOCK MODE -->
                <div
                  v-else
                  class="w-full flex flex-col gap-6"
                >
                  <div
                    v-if="item.paragraphs?.length"
                    class="flex flex-col gap-4 w-full"
                  >
                    <p
                      v-for="(pText, pIdx) in item.paragraphs"
                      :key="`${item.id}-block-p-${pIdx}`"
                      class="section-paragraph text-secondary-light/90"
                    >
                      {{ pText }}
                    </p>
                  </div>

                  <div
                    v-if="item.listItems?.length"
                    class="flex flex-col gap-3.5 w-full"
                  >
                    <h4
                      v-if="item.listTitle"
                      class="section-subparagraph font-medium text-journey-deep"
                    >
                      {{ item.listTitle }}
                    </h4>

                    <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <li
                        v-for="(bullet, bIdx) in item.listItems"
                        :key="`${item.id}-block-li-${bIdx}`"
                        class="flex items-start gap-3 rounded-xl bg-bg-light/80 border border-journey-deep/8 p-3.5"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          class="w-5 h-5 text-intention-blue shrink-0 mt-0.5"
                          aria-hidden="true"
                        >
                          <circle cx="10" cy="12" r="8" stroke="currentColor" stroke-width="1.5" class="opacity-35" />
                          <path d="M6.5 12l3 3 8.5-9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span class="section-subparagraph text-secondary-light/90">
                          {{ bullet }}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div
                    v-if="getValidImages(item).length"
                    class="w-full grid gap-4"
                    :class="getValidImages(item).length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'"
                  >
                    <button
                      v-for="(img, imgIdx) in getValidImages(item)"
                      :id="`acc-block-img-${item.id}-${imgIdx}`"
                      :key="`${item.id}-block-img-${imgIdx}`"
                      :name="`acc-block-img-${item.id}-${imgIdx}`"
                      type="button"
                      :aria-label="`View ${img.alt} in full screen`"
                      @click="handleImageLightbox(item, imgIdx)"
                      :style="getBlockImageAspectStyle(item)"
                      class="group relative w-full rounded-2xl overflow-hidden bg-bg-light border border-journey-deep/8 shadow-2xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue"
                    >
                      <img
                        :src="img.src"
                        :alt="img.alt"
                        width="900"
                        height="675"
                        loading="lazy"
                        decoding="async"
                        class="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 select-none"
                      />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
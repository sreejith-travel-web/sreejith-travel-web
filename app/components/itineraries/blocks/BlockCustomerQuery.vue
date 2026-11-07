<!-- ~/app/components/itineraries/blocks/BlockCustomerQuery.vue -->
<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'

export interface ItineraryCustomerQueryItem {
  id: string
  question: string
  paragraphs?: string[]
  listTitle?: string
  listItems?: string[]
}

export interface ItineraryCustomerQueryBlockData {
  sectionId?: string
  eyebrow?: string
  title: string
  items: ItineraryCustomerQueryItem[]
}

const props = withDefaults(
  defineProps<{
    data: ItineraryCustomerQueryBlockData
  }>(),
  {
    data: () => ({
      eyebrow: 'GOOD TO KNOW',
      title: 'Frequently Asked Questions',
      items: []
    })
  }
)

const instancePrefix = computed(() => props.data.sectionId || 'customer-query')

// Guard: Ensure every rendered item has at least one paragraph or unordered list item
const validItems = computed(() =>
  (props.data.items || []).filter(
    (item) => Boolean(item.paragraphs?.length || item.listItems?.length)
  )
)

const headerRefs = ref<Record<string, HTMLElement | null>>({})
const panelRefs = ref<Record<string, HTMLElement | null>>({})

const setHeaderRef = (id: string, el: unknown) => {
  headerRefs.value[id] = el as HTMLElement | null
}

const setPanelRef = (id: string, el: unknown) => {
  panelRefs.value[id] = el as HTMLElement | null
}

const isExpandAllMode = ref(false)
const openIds = ref<string[]>(validItems.value[0]?.id ? [validItems.value[0].id] : [])

let scrollRafId: number | null = null

const stopSmoothScroll = () => {
  if (scrollRafId !== null) {
    cancelAnimationFrame(scrollRafId)
    scrollRafId = null
  }
}

const isItemOpen = (id: string) => openIds.value.includes(id)

const areAllExpanded = computed(() => {
  return (
    validItems.value.length > 0 &&
    validItems.value.every((item) => openIds.value.includes(item.id))
  )
})

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
  stopSmoothScroll()

  if (areAllExpanded.value) {
    isExpandAllMode.value = false
    openIds.value = []
  } else {
    isExpandAllMode.value = true
    openIds.value = validItems.value.map((item) => item.id)
  }
}

const toggleItem = (id: string) => {
  const currentlyOpen = isItemOpen(id)

  if (isExpandAllMode.value) {
    if (currentlyOpen) {
      openIds.value = openIds.value.filter((item) => item !== id)
      isExpandAllMode.value = false
    } else {
      openIds.value.push(id)
      smoothScrollToHeader(id, 0)
    }
    return
  }

  if (currentlyOpen) {
    openIds.value = []
  } else {
    const clickedIdx = validItems.value.findIndex((item) => item.id === id)
    let closingHeightAbove = 0

    if (clickedIdx > 0) {
      for (let i = 0; i < clickedIdx; i++) {
        const prevId = validItems.value[i]?.id
        if (prevId && openIds.value.includes(prevId)) {
          const panelEl = panelRefs.value[prevId]
          if (panelEl) {
            closingHeightAbove += panelEl.offsetHeight
          }
        }
      }
    }

    openIds.value = [id]
    smoothScrollToHeader(id, closingHeightAbove)
  }
}

watch(
  validItems,
  (nextItems) => {
    stopSmoothScroll()
    isExpandAllMode.value = false
    const firstId = nextItems[0]?.id
    openIds.value = firstId ? [firstId] : []
  }
)

onBeforeUnmount(() => {
  stopSmoothScroll()
})
</script>

<template>
  <section
    v-if="validItems.length"
    :id="data.sectionId"
    :aria-label="data.title"
    class="scroll-mt-36 w-full rounded-2xl sm:rounded-3xl bg-bg-medium/55 border border-journey-deep/10 p-5 sm:p-8 md:p-10 shadow-2xs flex flex-col gap-6 sm:gap-7"
  >
    <!-- Header Bar + Expand All / Close All -->
    <div
      v-motion-fade-up
      class="w-full flex items-end justify-between gap-4"
    >
      <div class="flex flex-col items-start text-left">
        <span
          v-if="data.eyebrow"
          class="section-midsubtitle text-dark-gold font-medium mb-1.5! pt-0.5"
        >
          {{ data.eyebrow }}
        </span>
        <h2 class="section-subtitle font-medium text-journey-deep">
          {{ data.title }}
        </h2>
      </div>

      <button
        v-if="validItems.length > 1"
        :id="`${instancePrefix}-expand-all-btn`"
        :name="`${instancePrefix}-expand-all`"
        type="button"
        :aria-label="areAllExpanded ? `Close all ${data.title}` : `Expand all ${data.title}`"
        @click="toggleExpandAll"
        class="shrink-0 card-eyebrow mb-0! pt-1 pb-1 border-b border-intention-blue/45 hover:border-intention-blue text-intention-blue font-medium tracking-[0.16em]! cursor-pointer transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue select-none"
      >
        {{ areAllExpanded ? 'Close all' : 'Expand all' }}
      </button>
    </div>

    <!-- Accordion Cards ([overflow-anchor:none] prevents browser scroll-jump) -->
    <div class="w-full flex flex-col gap-3.5 sm:gap-4 [overflow-anchor:none]">
      <article
        v-for="(item, idx) in validItems"
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
        <!-- Question / Clause Trigger -->
        <button
          :id="`${instancePrefix}-header-${item.id}`"
          :ref="(el) => setHeaderRef(item.id, el)"
          :name="`${instancePrefix}-toggle-${item.id}`"
          type="button"
          :aria-expanded="isItemOpen(item.id)"
          :aria-controls="`${instancePrefix}-panel-${item.id}`"
          @click="toggleItem(item.id)"
          class="group w-full px-5 py-4 sm:px-7 sm:py-5 md:px-8 md:py-5.5 flex items-center justify-between gap-4 text-left cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue rounded-2xl sm:rounded-3xl"
        >
          <h3 class="card-title mb-0! font-medium! text-intention-blue group-hover:text-journey-deep transition-colors duration-200">
            {{ item.question }}
          </h3>

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

        <!-- Answer / Clause Body (Uses ease-editorial utility directly) -->
        <div
          :id="`${instancePrefix}-panel-${item.id}`"
          :ref="(el) => setPanelRef(item.id, el)"
          role="region"
          :aria-labelledby="`${instancePrefix}-header-${item.id}`"
          class="grid transition-[grid-template-rows] duration-300 ease-editorial"
          :class="isItemOpen(item.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
          <div class="overflow-hidden">
            <div class="px-5 pb-6 sm:px-7 sm:pb-7 md:px-8 md:pb-8 pt-5 sm:pt-6 border-t border-journey-deep/10 flex flex-col gap-4 sm:gap-5">
              
              <!-- Optional Paragraphs -->
              <div
                v-if="item.paragraphs?.length"
                class="flex flex-col gap-3.5 w-full"
              >
                <p
                  v-for="(paragraph, pIdx) in item.paragraphs"
                  :key="`${item.id}-p-${pIdx}`"
                  class="section-paragraph text-secondary-light/90"
                >
                  {{ paragraph }}
                </p>
              </div>

              <!-- Optional Unordered List -->
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
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
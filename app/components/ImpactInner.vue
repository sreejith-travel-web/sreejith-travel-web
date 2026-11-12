<!-- ~/app/components/ImpactInner.vue -->
<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import TrapeziumTabBar, { type TrapeziumTabOption } from '~/components/TrapeziumTabBar.vue'
import Lightbox, { type LightboxMediaItem } from '~/components/Lightbox.vue'
import { useEditorialGlide } from '~/composables/useEditorialGlide'

export interface ImpactPillar {
  title: string
  img: string
  alt: string
  list: string[]
}

export interface ImpactTabContent {
  title: string
  intro: string
  mainImg: string
  mainImgAlt: string
  quote: string
  pillars: ImpactPillar[]
}

export interface ImpactTabItem {
  id: string
  tabTitle: string
  content: ImpactTabContent
}

const props = defineProps<{
  items: ImpactTabItem[]
  activeTab: string
}>()

const emit = defineEmits<{
  (e: 'update:activeTab', tabId: string): void
}>()

const {
  glidePageScrollTo,
  lockPanelHeightBeforeLeave,
  releasePanelHeightAfterEnter
} = useEditorialGlide()

const EDITORIAL_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

const tabsConfig = computed<TrapeziumTabOption[]>(() =>
  props.items.map((item) => ({
    id: item.id,
    label: item.tabTitle
  }))
)

const activeIndex = computed(() => {
  const idx = props.items.findIndex((item) => item.id === props.activeTab)
  return idx >= 0 ? idx : 0
})

const activeTabItem = computed<ImpactTabItem | undefined>(
  () => props.items[activeIndex.value] || props.items[0]
)

const nextTabItem = computed<ImpactTabItem | undefined>(() => {
  if (!props.items.length) return undefined
  return props.items[(activeIndex.value + 1) % props.items.length]
})

const formatIndex = (num: number): string => String(num).padStart(2, '0')

const slugifyAnchor = (title: string, idx: number): string =>
  `impact-pillar-${idx + 1}-${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`

// =========================================================
// LIGHTBOX GALLERY (Lead Image + 3 Pillar Images)
// =========================================================
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const activeLightboxItems = computed<LightboxMediaItem[]>(() => {
  const tab = activeTabItem.value
  if (!tab) return []
  const media = [
    {
      type: 'image',
      src: tab.content.mainImg,
      alt: tab.content.mainImgAlt,
      caption: `${tab.tabTitle} — ${tab.content.title}`
    },
    ...tab.content.pillars.map((p) => ({
      type: 'image',
      src: p.img,
      alt: p.alt,
      caption: p.title
    }))
  ]
  return media as unknown as LightboxMediaItem[]
})

const openLightboxAt = (index: number) => {
  if (!activeLightboxItems.value.length) return
  lightboxIndex.value = index
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

// =========================================================
// PER-TAB VERTICAL SCROLL MEMORY & SILK GLIDE
// =========================================================
const tabBarRef = ref<InstanceType<typeof TrapeziumTabBar> | null>(null)
const tabContentTopRef = ref<HTMLElement | null>(null)
const savedTabScrollY = ref<Record<string, number>>({})

const getTabContentTopScrollY = (): number =>
  tabBarRef.value?.getAnchorTargetScrollY(tabContentTopRef.value) ?? 0

const handleTabSelect = async (nextTabId: string) => {
  if (!import.meta.client) {
    emit('update:activeTab', nextTabId)
    return
  }

  const currentTabId = props.activeTab

  if (nextTabId === currentTabId) {
    glidePageScrollTo(getTabContentTopScrollY())
    return
  }

  savedTabScrollY.value[currentTabId] = window.scrollY
  const previousScrollForNextTab = savedTabScrollY.value[nextTabId]

  emit('update:activeTab', nextTabId)

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

const scrollToPillarCard = (anchorId: string) => {
  if (!import.meta.client) return
  const el = document.getElementById(anchorId)
  if (!el) return
  const stickyHeight = tabBarRef.value?.getStickyBarHeight() || 58
  const headerHeight = window.innerWidth >= 768 ? 80 : 64
  const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - stickyHeight - 20
  glidePageScrollTo(y)
}
</script>

<template>
  <section
    id="impact-pillars"
    data-theme="light"
    class="section-wrapper overflow-x-clip! bg-bg-light text-primary-light pt-2 sm:pt-4 md:pt-6"
  >
    <div class="w-full max-w-7xl flex flex-col items-center">
      <!-- 1. UNIFIED STICKY HORIZONTAL CURVED TRAPEZIUM TABS -->
      <TrapeziumTabBar
        ref="tabBarRef"
        :tabs="tabsConfig"
        :active-tab="activeTab"
        aria-label="Impact Pillars"
        max-width-class="max-w-7xl"
        wrapper-class="mb-8 md:mb-12"
        id-prefix="impact"
        @select="handleTabSelect"
      />

      <!-- Invisible Scroll Anchor Marking the Top of Tab Content -->
      <div ref="tabContentTopRef" class="w-full h-0" aria-hidden="true" />

      <!-- 2. ACTIVE IMPACT PILLAR WORKSPACE (Slow 380ms/740ms Glide + Zero-CLS Height Lock) -->
      <div class="w-full">
        <Transition
          name="editorial-tab-panel"
          mode="out-in"
          @before-leave="lockPanelHeightBeforeLeave"
          @after-enter="releasePanelHeightAfterEnter"
        >
          <div
            v-if="activeTabItem"
            :id="`impact-panel-${activeTabItem.id}`"
            :key="activeTabItem.id"
            role="tabpanel"
            :aria-labelledby="`impact-tab-${activeTabItem.id}`"
            class="w-full flex flex-col gap-12 sm:gap-14 md:gap-16 lg:gap-20"
          >
            <!-- A. FRAMED EDITORIAL LEAD SPLIT -->
            <div
              class="relative w-full rounded-2xl sm:rounded-3xl bg-linear-to-br from-soft-cream/32 via-surface-light to-surface-light border border-dark-gold/25 p-5 sm:p-8 md:p-10 lg:p-12 shadow-2xs overflow-hidden"
            >
              <!-- Subtle Architectural Corner Arc Watermark -->
              <svg
                viewBox="0 0 160 160"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
                class="pointer-events-none select-none absolute -top-6 -right-6 w-44 h-44 sm:w-56 sm:h-56 text-dark-gold/12"
              >
                <circle cx="160" cy="0" r="118" stroke-width="1" />
                <circle cx="160" cy="0" r="88" stroke-width="0.85" stroke-dasharray="3 5" />
              </svg>

              <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-9 lg:gap-12 items-center">
                <!-- Left Column -->
                <div class="lg:col-span-7 flex flex-col items-start text-left">
                  <div class="flex items-center gap-2.5 mb-2.5">
                    <span class="w-7 h-px bg-dark-gold shrink-0" aria-hidden="true" />
                    <span class="section-midsubtitle text-dark-gold mb-0!">
                      {{ `PILLAR ${formatIndex(activeIndex + 1)} OF ${formatIndex(items.length)} · ${activeTabItem.tabTitle}` }}
                    </span>
                  </div>

                  <h3 class="section-subtitle text-journey-deep">
                    {{ activeTabItem.content.title }}
                  </h3>

                  <div class="w-12 h-0.5 bg-dark-gold mt-3 mb-5" aria-hidden="true" />

                  <p class="hero-paragraph text-secondary-light mb-6">
                    {{ activeTabItem.content.intro }}
                  </p>

                  <!-- Quick-Jump Anchor Pills for the 3 Core Commitments -->
                  <div class="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      v-for="(pillar, pIdx) in activeTabItem.content.pillars"
                      :key="pillar.title"
                      type="button"
                      class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-light/90 border border-journey-deep/12 hover:border-dark-gold/55 text-journey-deep/85 hover:text-journey-deep transition-all duration-300 cursor-pointer"
                      @click="scrollToPillarCard(slugifyAnchor(pillar.title, pIdx))"
                    >
                      <span class="font-uppercase text-[10px] font-semibold tracking-[0.18em] text-dark-gold tabular-nums">
                        {{ formatIndex(pIdx + 1) }}
                      </span>
                      <span class="text-xs font-medium leading-none">
                        {{ pillar.title }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Right Column: Strict Lazy 3:2 Editorial Frame + Lightbox Trigger -->
                <div class="lg:col-span-5 w-full">
                  <button
                    type="button"
                    :aria-label="`Inspect photograph: ${activeTabItem.content.mainImgAlt}`"
                    class="group relative block w-full aspect-3/2 rounded-2xl overflow-hidden bg-surface-frosted border border-journey-deep/10 shadow-xs cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-gold"
                    @click="openLightboxAt(0)"
                  >
                    <img
                      :src="activeTabItem.content.mainImg"
                      :alt="activeTabItem.content.mainImgAlt"
                      width="750"
                      height="500"
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                      class="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                    />

                    <div
                      aria-hidden="true"
                      class="pointer-events-none absolute inset-0 bg-linear-to-t from-journey-deep/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />

                    <span
                      aria-hidden="true"
                      class="pointer-events-none absolute bottom-3 right-3 w-9 h-9 rounded-full bg-surface-light/90 backdrop-blur-xs border border-journey-deep/15 text-journey-deep flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 shadow-2xs"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <!-- B. ELEVATED EDITORIAL QUOTE CENTERPIECE -->
            <div
              class="relative w-full py-8 sm:py-10 md:py-12 px-4 sm:px-8 md:px-12 rounded-2xl bg-linear-to-r from-transparent via-soft-blue/16 to-transparent flex flex-col items-center text-center"
            >
              <div class="w-full max-w-3xl h-px bg-linear-to-r from-transparent via-dark-gold/45 to-transparent mb-6 md:mb-7" />

              <svg
                class="w-7 h-7 sm:w-8 sm:h-8 text-dark-gold/70 mb-3 md:mb-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"
                />
              </svg>

              <blockquote class="signature-quote text-journey-deep max-w-4xl">
                “{{ activeTabItem.content.quote }}”
              </blockquote>

              <div class="w-full max-w-3xl h-px bg-linear-to-r from-transparent via-dark-gold/45 to-transparent mt-6 md:mt-7" />
            </div>

            <!-- C. TACTILE 3-COLUMN COMMITMENT CARDS -->
            <div class="w-full flex flex-col gap-6 sm:gap-8">
              <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-journey-deep/12 pb-4">
                <div class="flex flex-col items-start text-left">
                  <span class="section-midsubtitle text-action-blue mb-1!">
                    IN PRACTICE · GROUND COMMITMENTS
                  </span>
                  <h4 class="section-smaller-subtitle text-journey-deep">
                    How {{ activeTabItem.tabTitle }} Shapes Every Route
                  </h4>
                </div>
                <span class="font-uppercase text-[11px] tracking-[0.22em] uppercase text-muted tabular-nums">
                  {{ `${activeTabItem.content.pillars.length} Core Standards` }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 w-full items-stretch">
                <article
                  v-for="(pillar, idx) in activeTabItem.content.pillars"
                  :id="slugifyAnchor(pillar.title, idx)"
                  :key="pillar.title"
                  v-motion
                  :initial="{ opacity: 0, y: 20 }"
                  :visible-once="{
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: 'tween',
                      duration: 620,
                      delay: idx * 100,
                      ease: EDITORIAL_EASE
                    }
                  }"
                  class="group h-full rounded-2xl sm:rounded-3xl bg-surface-light border border-journey-deep/10 hover:border-dark-gold/45 shadow-2xs hover:shadow-sm transition-all duration-500 overflow-hidden flex flex-col text-left scroll-mt-36"
                >
                  <button
                    type="button"
                    :aria-label="`Inspect photograph: ${pillar.alt}`"
                    class="relative block w-full aspect-3/2 overflow-hidden bg-surface-frosted cursor-zoom-in focus:outline-none"
                    @click="openLightboxAt(idx + 1)"
                  >
                    <img
                      :src="pillar.img"
                      :alt="pillar.alt"
                      width="750"
                      height="500"
                      loading="lazy"
                      decoding="async"
                      fetchpriority="low"
                      class="w-full h-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                    />

                    <span
                      class="pointer-events-none absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-journey-deep/82 backdrop-blur-xs border border-white/15 font-uppercase text-[10px] font-semibold tracking-[0.2em] text-soft-cream tabular-nums"
                    >
                      {{ formatIndex(idx + 1) }}
                    </span>
                  </button>

                  <div class="p-5 sm:p-6 md:p-7 flex-1 flex flex-col items-start">
                    <h5 class="subsection-title text-journey-deep mb-3 group-hover:text-intention-blue transition-colors">
                      {{ pillar.title }}
                    </h5>

                    <div
                      class="w-8 h-0.5 bg-dark-gold/55 mb-4 transition-all duration-500 group-hover:w-14 group-hover:bg-dark-gold"
                      aria-hidden="true"
                    />

                    <ul class="flex flex-col gap-3 w-full">
                      <li
                        v-for="(point, pIdx) in pillar.list"
                        :key="pIdx"
                        class="flex items-start gap-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.6"
                          stroke="currentColor"
                          aria-hidden="true"
                          class="w-5 h-5 text-dark-gold shrink-0 mt-0.5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>

                        <span class="section-subparagraph text-secondary-light">
                          {{ point }}
                        </span>
                      </li>
                    </ul>
                  </div>
                </article>
              </div>
            </div>

            <!-- D. NEXT IMPACT PILLAR CONTINUITY BAR -->
            <div v-if="nextTabItem" class="w-full pt-2 flex justify-end">
              <button
                type="button"
                class="group inline-flex items-center gap-4 py-3.5 px-5 sm:px-6 rounded-2xl bg-surface-light border border-journey-deep/12 hover:border-dark-gold/55 shadow-2xs transition-all duration-300 cursor-pointer text-left"
                @click="handleTabSelect(nextTabItem.id)"
              >
                <div class="flex flex-col">
                  <span class="font-uppercase text-[9.5px] tracking-[0.22em] uppercase text-dark-gold font-semibold">
                    Next Impact Pillar
                  </span>
                  <span class="section-paragraph font-medium text-journey-deep group-hover:text-intention-blue transition-colors">
                    {{ nextTabItem.tabTitle }}
                  </span>
                </div>

                <span class="itinerary-cta-circle text-journey-deep group-hover:text-dark-gold">
                  <svg viewBox="0 0 44 44" fill="none" class="w-10 h-10">
                    <circle cx="22" cy="22" r="20" stroke="currentColor" class="itinerary-cta-ring" />
                    <path
                      d="M17 22h10m-4-4 4 4-4 4"
                      stroke="currentColor"
                      stroke-width="1.6"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <Lightbox
      :is-open="lightboxOpen"
      :items="activeLightboxItems"
      :initial-index="lightboxIndex"
      @close="closeLightbox"
    />
  </section>
</template>
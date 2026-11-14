<!-- ~/app/components/HomeImpact.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface ImpactItem {
  id: string
  shortTitle: string
  longTitle: string
  intro: string
  img: string
  alt: string
  url: string
}

export interface HomeImpactConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  items: ImpactItem[]
  bottomQuote: string
  bottomCta: {
    label: string
    to: string
  }
}

const props = defineProps<{
  data: HomeImpactConfig
}>()

const CANONICAL_SLUGS = [
  'slow-travel',
  'authentic-connection',
  'local-first',
  'protecting-beauty',
  'conscious-choices',
  'giving-back'
] as const

const SLUG_ALIAS_MAP: Record<string, string> = {
  authentic: 'authentic-connection'
}

// Guarantees every card/tab routes to its exact /impact/<slug> even if legacy JSON passes '/impact'
const resolveItemUrl = (item: ImpactItem, idx: number): string => {
  const rawUrl = item.url?.trim() || ''
  if (rawUrl.startsWith('/impact/') && rawUrl.length > '/impact/'.length) {
    return rawUrl
  }
  const normalizedId = SLUG_ALIAS_MAP[item.id] || item.id || CANONICAL_SLUGS[idx]
  return normalizedId ? `/impact/${normalizedId}` : '/impact'
}

const formatIndex = (num: number): string => String(num).padStart(2, '0')

const activeIndex = ref(0)
const mobileActiveIndex = ref(0)
const mobileRailRef = ref<HTMLElement | null>(null)
let mobileScrollRaf: number | null = null

const onMobileRailScroll = () => {
  if (mobileScrollRaf !== null) return
  mobileScrollRaf = requestAnimationFrame(() => {
    mobileScrollRaf = null
    const el = mobileRailRef.value
    if (!el || props.data.items.length <= 1) return
    const maxScroll = Math.max(1, el.scrollWidth - el.clientWidth)
    const progress = Math.min(1, Math.max(0, el.scrollLeft / maxScroll))
    mobileActiveIndex.value = Math.round(progress * (props.data.items.length - 1))
  })
}

const scrollMobileToIndex = (idx: number) => {
  const el = mobileRailRef.value
  if (!el) return
  const cards = el.querySelectorAll<HTMLElement>('[data-impact-mob-card]')
  const target = cards[idx]
  if (!target) return
  const left = target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2
  el.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
}

// Aligned to 768px (`md:`) so neither mobile nor desktop mounts hidden 0x0 images
const isMdUp = ref(true)
let mdMedia: MediaQueryList | null = null

const onViewportChange = (e: MediaQueryListEvent | MediaQueryList) => {
  isMdUp.value = e.matches
}

onMounted(() => {
  mdMedia = window.matchMedia('(min-width: 768px)')
  onViewportChange(mdMedia)
  mdMedia.addEventListener('change', onViewportChange)
})

onBeforeUnmount(() => {
  mdMedia?.removeEventListener('change', onViewportChange)
  if (mobileScrollRaf !== null) {
    cancelAnimationFrame(mobileScrollRaf)
    mobileScrollRaf = null
  }
})
</script>

<template>
  <section
    data-theme="light"
    class="text-primary-light overflow-x-clip section-wrapper"
  >
    <div class="relative z-10 w-full max-w-360 flex flex-col items-center">
      <!-- 1. SECTION HEADER -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-10 md:mb-14 xl:mb-16">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep/95 eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper drop-shadow-none!"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <p
          v-motion-fade-up
          :delay="200"
          class="text-secondary-light max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. HYBRID RESPONSIVE SHOWCASE -->
      <div class="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16 mb-8 md:mb-10 lg:mb-12">
        <!-- =======================================================
             A. MOBILE SNAP CAROUSEL (< 768px — Zero Vertical Scroll Arrest)
             ======================================================= -->
        <div
          v-motion-fade-up
          :delay="250"
          class="w-full md:hidden flex flex-col items-center z-20"
        >
          <div
            ref="mobileRailRef"
            data-lenis-prevent-horizontal
            class="w-full flex overflow-x-auto overflow-y-hidden hide-scrollbar snap-x snap-mandatory px-4 pb-3 gap-4 touch-manipulation overscroll-x-contain"
            @scroll.passive="onMobileRailScroll"
          >
            <NuxtLink
              v-for="(item, idx) in data.items"
              :key="`mob-${item.id}`"
              data-impact-mob-card
              :to="resolveItemUrl(item, idx)"
              class="group relative snap-center shrink-0 w-[82vw] max-w-88 aspect-square rounded-2xl overflow-hidden shadow-sm border border-journey-deep/10 bg-journey-deep block focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-gold"
            >
              <!-- Strict Lazy Image -->
              <img
                v-if="!isMdUp"
                :src="item.img"
                :alt="item.alt"
                width="750"
                height="500"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                draggable="false"
                class="pointer-events-none block w-full h-auto aspect-square object-cover transition-transform duration-700 ease-editorial group-hover:scale-105 group-active:scale-105"
              />

              <!-- Multi-Stop Editorial Scrim -->
              <div
                aria-hidden="true"
                class="absolute inset-0 bg-linear-to-t from-journey-deep/96 via-journey-deep/42 to-journey-deep/12 z-10 pointer-events-none"
              />

              <!-- Card Copy (Right-Cleared for Bottom-Right CTA Circle) -->
              <div class="absolute inset-x-0 bottom-0 p-5 xs:p-6 pr-16 xs:pr-18 flex flex-col justify-end items-start text-left z-20 pointer-events-none">
                <h3 class="card-title line-clamp-none! text-surface-light mb-2.5 whitespace-pre-line">
                  {{ item.longTitle }}
                </h3>
                <div class="w-8 h-px bg-warm-gold mb-3" aria-hidden="true" />
                <p class="card-paragraph text-surface-light/90 leading-relaxed line-clamp-3">
                  {{ item.intro }}
                </p>
              </div>

              <!-- Bottom-Right Warm Gold Circular Outline CTA (Hover Scale-Up / Active Scale-Down) -->
              <div
                class="itinerary-cta-circle absolute bottom-4 right-4 xs:bottom-5 xs:right-5 z-21 text-warm-gold drop-shadow-xs transition-transform duration-500 ease-editorial group-hover:scale-108 group-active:scale-96 group-active:duration-150 pointer-events-none"
              >
                <svg
                  class="w-full h-full overflow-visible"
                  viewBox="0 0 44 44"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="22" cy="22" r="20.5" class="itinerary-cta-ring" />
                  <g
                    class="transition-transform duration-500 ease-editorial"
                    stroke-width="1.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M15 29L29 15" />
                    <path d="M21 15h8v8" />
                  </g>
                </svg>
              </div>
            </NuxtLink>
          </div>

          <!-- Minimal Mobile Snap Progress Pills -->
          <div
            v-if="data.items.length > 1"
            class="flex items-center justify-center gap-1.5 mt-2"
            aria-hidden="true"
          >
            <button
              v-for="(item, idx) in data.items"
              :key="`dot-${item.id}`"
              type="button"
              tabindex="-1"
              :aria-label="`Scroll to ${item.shortTitle}`"
              class="h-1.5 rounded-full transition-all duration-700 cursor-pointer"
              :class="
                mobileActiveIndex === idx
                  ? 'w-6 bg-dark-gold'
                  : 'w-1.5 bg-journey-deep/20 hover:bg-journey-deep/40'
              "
              @click="scrollMobileToIndex(idx)"
            />
          </div>
        </div>

        <!-- =======================================================
             B. DESKTOP INTERACTIVE PILLAR INDEX (>= 768px)
             ======================================================= -->
        <div class="hidden md:flex w-full md:w-5/12 lg:w-5/12 xl:w-4/12 flex-col gap-1.5 shrink-0 z-20">
          <NuxtLink
            v-for="(item, idx) in data.items"
            :key="`desk-text-${item.id}`"
            :to="resolveItemUrl(item, idx)"
            v-motion-stagger-card
            :delay="80 + idx * 65"
            class="group flex items-center w-full py-3.5 lg:py-4 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-dark-gold rounded-lg"
            @mouseenter="activeIndex = idx"
            @focus="activeIndex = idx"
          >
            <!-- Tabular Number -->
            <span
              class="font-uppercase text-[10px] lg:text-[11px] tracking-[0.2em] font-semibold tabular-nums mr-3 transition-colors duration-700 shrink-0"
              :class="
                activeIndex === idx
                  ? 'text-dark-gold'
                  : 'text-journey-deep/35 group-hover:text-dark-gold/75'
              "
            >
              {{ formatIndex(idx + 1) }}
            </span>

            <!-- Pillar Short Title -->
            <span
              class="section-midsubtitle mb-0! transition-colors duration-700 shrink-0"
              :class="
                activeIndex === idx
                  ? 'text-journey-deep font-semibold!'
                  : 'text-journey-deep/52 group-hover:text-journey-deep/85 group-focus:text-journey-deep/85'
              "
            >
              {{ item.shortTitle }}
            </span>

            <!-- Compositor-Only Gold Connector Line & Terminal Dot (Zero Layout Reflow) -->
            <div class="grow ml-4 lg:ml-5 flex items-center h-4 relative" aria-hidden="true">
              <div class="w-full h-px bg-journey-deep/10 relative overflow-visible">
                <div
                  class="absolute inset-0 bg-dark-gold origin-left transition-transform duration-700 ease-editorial"
                  :class="activeIndex === idx ? 'scale-x-100' : 'scale-x-0'"
                />
                <span
                  class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-dark-gold transition-all duration-500"
                  :class="
                    activeIndex === idx
                      ? 'opacity-100 scale-100 delay-150'
                      : 'opacity-0 scale-50'
                  "
                />
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- =======================================================
             C. DESKTOP 3:2 IMAGE OVERLAY STAGE (>= 768px)
             ======================================================= -->
        <div
          v-motion-fade-up
          :delay="320"
          class="hidden md:block flex-1 w-full max-w-190 relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-md md:aspect-4/3 lg:aspect-3/2 bg-journey-deep border border-journey-deep/12 z-10"
        >
          <NuxtLink
            v-for="(item, idx) in data.items"
            :key="`desk-img-${item.id}`"
            :to="resolveItemUrl(item, idx)"
            :tabindex="activeIndex === idx ? 0 : -1"
            :aria-hidden="activeIndex !== idx"
            class="group absolute inset-0 transition-opacity duration-1000 ease-editorial focus:outline-none"
            :class="
              activeIndex === idx
                ? 'opacity-100 z-10 pointer-events-auto'
                : 'opacity-0 z-0 pointer-events-none'
            "
          >
            <!-- Strict Lazy 3:2 Image -->
            <img
              v-if="isMdUp"
              :src="item.img"
              :alt="item.alt"
              width="750"
              height="500"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-editorial group-hover:scale-106 group-active:scale-106"
              :class="activeIndex === idx ? 'scale-102' : 'scale-100'"
            />

            <!-- Editorial Contrast Scrim -->
            <div
              aria-hidden="true"
              class="absolute inset-0 bg-linear-to-t from-journey-deep/95 via-journey-deep/42 to-journey-deep/10 transition-opacity duration-700"
              :class="activeIndex === idx ? 'opacity-100' : 'opacity-0'"
            />

            <!-- Bottom-Left Copy Block (Smooth GPU Translate-Up + Fade-Up) -->
            <div
              class="pointer-events-none absolute inset-x-0 bottom-0 p-7 lg:p-10 xl:p-12 pr-20 lg:pr-24 flex flex-col justify-end items-start text-left transition-[opacity,translate,transform] ease-editorial will-change-[opacity,translate]"
              :class="
                activeIndex === idx
                  ? 'translate-y-0 opacity-100 duration-1000 delay-300'
                  : 'translate-y-6 opacity-0 duration-300 delay-0'
              "
            >
              <h3 class="section-smaller-subtitle text-surface-light! font-medium mb-3.5 whitespace-pre-line">
                {{ item.longTitle }}
              </h3>

              <div
                aria-hidden="true"
                class="w-10 h-px bg-warm-gold origin-left transition-transform duration-700 ease-editorial mb-4"
                :class="activeIndex === idx ? 'scale-x-100 delay-200' : 'scale-x-0'"
              />

              <p class="section-subparagraph text-surface-light/90 max-w-md">
                {{ item.intro }}
              </p>
            </div>

            <!-- Bottom-Right Warm Gold Circular Outline CTA (Hover Scale-Up / Active Scale-Down) -->
            <div
              class="itinerary-cta-circle absolute bottom-5 right-5 lg:bottom-8 lg:right-8 z-21 text-warm-gold drop-shadow-xs transition-transform duration-500 ease-editorial group-hover:scale-108 group-active:scale-96 group-active:duration-150 pointer-events-none"
            >
              <svg
                class="w-full h-full overflow-visible"
                viewBox="0 0 44 44"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <!-- Smooth 1px -> 2px Vector Circle -->
                <circle cx="22" cy="22" r="20.5" class="itinerary-cta-ring" />
                <!-- Animated Long-Shaft Top-Right Arrow -->
                <g
                  class="transition-transform duration-500 ease-editorial"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M15 29L29 15" />
                  <path d="M21 15h8v8" />
                </g>
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- 3. BOTTOM EDITORIAL QUOTE -->
      <div
        v-motion-fade-up
        class="flex flex-col items-center text-center mb-8 md:mb-10 px-4 w-full"
      >
        <p class="px-4 lg:max-w-3xl xl:max-w-4xl text-darker-gold section-quote">
          {{ data.bottomQuote }}
        </p>
      </div>

      <!-- 4. BOTTOM CENTERED CTA BUTTON -->
      <div
        v-motion-fade-up
        :delay="100"
        class="flex justify-center w-full"
      >
        <CtaButton
          :to="data.bottomCta.to"
          :label="data.bottomCta.label"
          variant="light"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
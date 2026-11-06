<!-- ~/components/AboutInner.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CtaButton from '~/components/CtaButton.vue'

export interface JourneyChapter {
  id: string
  eyebrow: string
  title: string
  paragraphs: string[]
  staccatoList?: string[]
  bulletList?: string[]
  closingLine?: string
  externalCta?: {
    label: string
    href: string
  }
  image: string
  imageAlt: string
  imageCaption: string
}

export interface AuthorityStatItem {
  value: number
  suffix: string
  label: string
  sublabel?: string
}

export interface LookForCardItem {
  tag: string
  title: string
  moment: string
  image: string
  imageAlt: string
}

export interface PursuitRowItem {
  index: string
  title: string
  description: string
}

export interface RoutingHubCard {
  eyebrow: string
  title: string
  description: string
  linkLabel: string
  to: string
  image: string
  imageAlt: string
}

export interface AboutInnerConfig {
  founder: {
    eyebrow: string
    titleLine1: string
    titleLine2Cursive: string
    bioParagraph: string
    roleBadges: string[]
    summaryParagraph: string
    portraitImage: string
    portraitAlt: string
    worldEyebrow: string
    worldTitle: string
    worldDescription: string
    worldTags: string[]
  }
  journeySoFar: {
    chapters: JourneyChapter[]
  }
  boutiquePhilosophy: {
    eyebrow: string
    titleLine1: string
    titleLine2Cursive: string
    description: string
    mantras: string[]
    custodiansTitle: string
    custodiansIntro: string
    custodianPills: string[]
    stats: AuthorityStatItem[]
  }
  lookAndBeyond: {
    lookFor: {
      eyebrow: string
      title: string
      subtitle: string
      closingNote: string
      networkCtaLabel: string
      networkCtaTo: string
      cards: LookForCardItem[]
    }
    beyond: {
      eyebrow: string
      title: string
      paragraphs: string[]
      pursuits: PursuitRowItem[]
      closingLine: string
    }
  }
  finale: {
    routingEyebrow: string
    routingTitle: string
    routingCards: RoutingHubCard[]
    curiousEyebrow: string
    curiousTitle: string
    curiousDescription: string
    quoteText: string
    quoteAuthor: string
    ctaTitle: string
    ctaDescription: string
    primaryCta: {
      label: string
      to: string
    }
    secondaryCta: {
      label: string
      to: string
    }
  }
}

const props = defineProps<{
  data: AboutInnerConfig
}>()

// ==========================================
// 1. STICKY CROSSFADE OBSERVER (SECTION 3)
// ==========================================
const activeChapterIndex = ref(0)
const chapterRefs = ref<HTMLElement[]>([])
let chapterObserver: IntersectionObserver | null = null

const setChapterRef = (el: unknown, idx: number) => {
  if (el instanceof HTMLElement) {
    chapterRefs.value[idx] = el
  }
}

// ==========================================
// 2. RAF STAT COUNTER ENGINE (SECTION 4)
// ==========================================
const statsContainerRef = ref<HTMLElement | null>(null)
const animatedStats = ref<number[]>(props.data.boutiquePhilosophy.stats.map(() => 0))
let statsObserver: IntersectionObserver | null = null
let statsRafId: number | null = null
let hasAnimatedStats = false

const runStatsCounter = () => {
  if (hasAnimatedStats) return
  hasAnimatedStats = true

  const duration = 1400
  const startTime = performance.now()
  const targets = props.data.boutiquePhilosophy.stats.map((s) => s.value)

  const tick = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / duration)
    // Cubic ease-out: 1 - (1 - t)^3
    const eased = 1 - Math.pow(1 - progress, 3)

    animatedStats.value = targets.map((target) => Math.round(target * eased))

    if (progress < 1) {
      statsRafId = requestAnimationFrame(tick)
    } else {
      animatedStats.value = [...targets]
      statsRafId = null
    }
  }

  statsRafId = requestAnimationFrame(tick)
}

onMounted(() => {
  if (!import.meta.client || !('IntersectionObserver' in window)) {
    animatedStats.value = props.data.boutiquePhilosophy.stats.map((s) => s.value)
    return
  }

  // Observe Narrative Chapters for Sticky Image Crossfade
  chapterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idxAttr = (entry.target as HTMLElement).dataset.chapterIndex
          const parsed = idxAttr ? parseInt(idxAttr, 10) : 0
          if (!Number.isNaN(parsed)) {
            activeChapterIndex.value = parsed
          }
        }
      })
    },
    {
      rootMargin: '-35% 0px -45% 0px',
      threshold: 0
    }
  )

  chapterRefs.value.forEach((el) => {
    if (el) chapterObserver?.observe(el)
  })

  // Observe Authority Stats Grid for Count-Up
  if (statsContainerRef.value) {
    statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          runStatsCounter()
          statsObserver?.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    statsObserver.observe(statsContainerRef.value)
  }
})

onBeforeUnmount(() => {
  chapterObserver?.disconnect()
  statsObserver?.disconnect()
  if (statsRafId !== null) {
    cancelAnimationFrame(statsRafId)
  }
})
</script>

<template>
  <div class="w-full flex flex-col text-primary-light bg-bg-light pt-10 sm:pt-14 md:pt-18 xl:pt-20">

    <!-- ==========================================
         SECTION 2: THE FOUNDER & THE WORLD
         ========================================== -->
    <section
      data-theme="light"
      class="section-wrapper bg-bg-light pt-0"
    >
      <div class="w-full max-w-7xl flex flex-col gap-14 md:gap-20">
        
        <!-- Top Split: Bio Left + Portrait Right -->
        <div class="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 w-full">
          
          <!-- Left Column: Bio & Role Pills -->
          <div class="w-full lg:flex-1 flex flex-col items-start text-left">
            <div v-motion-fade-up class="flex items-center w-full mb-3 md:mb-4">
              <div class="bg-dark-gold/70 eyebrow-border" />
              <span class="text-journey-deep/90 eyebrow-text">
                {{ data.founder.eyebrow }}
              </span>
            </div>

            <h2
              v-motion-fade-up
              :delay="100"
              class="flex flex-col items-start text-left mb-5 md:mb-6"
            >
              <span class="text-journey-deep section-title-sans">
                {{ data.founder.titleLine1 }}
              </span>
              <span class="text-dark-gold section-title-cursive mt-1">
                {{ data.founder.titleLine2Cursive }}
              </span>
            </h2>

            <p
              v-motion-fade-up
              :delay="150"
              class="hero-paragraph text-journey-deep/95 mb-6"
            >
              {{ data.founder.bioParagraph }}
            </p>

            <!-- 4 Role Badges -->
            <div
              v-motion-fade-up
              :delay="200"
              class="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-6 md:mb-8"
            >
              <span
                v-for="role in data.founder.roleBadges"
                :key="role"
                class="card-tag bg-soft-cream/55 border border-dark-gold/25 text-journey-deep px-3 py-1.5 rounded-sm font-medium"
              >
                {{ role }}
              </span>
            </div>

            <p
              v-motion-fade-up
              :delay="250"
              class="section-paragraph text-secondary-light"
            >
              {{ data.founder.summaryParagraph }}
            </p>
          </div>

          <!-- Right Column: Editorial Portrait -->
          <div class="w-full max-w-sm sm:max-w-md lg:max-w-none lg:w-105 xl:w-115 shrink-0 mx-auto lg:mx-0">
            <div
              v-motion
              :initial="{ opacity: 0, y: 30, filter: 'blur(4px)' }"
              :visible-once="{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 700, ease: [0.22, 1, 0.36, 1] } }"
              class="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-surface-frosted shadow-sm border border-journey-deep/10"
            >
              <img
                :src="data.founder.portraitImage"
                :alt="data.founder.portraitAlt"
                width="600"
                height="800"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

        <!-- Bottom Block: The World I Explore -->
        <div class="w-full rounded-2xl bg-soft-blue/20 border border-journey-deep/10 p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col items-center text-center">
          <div v-motion-fade-up class="eyebrow-wrapper">
            <div class="bg-dark-gold/70 eyebrow-border" />
            <span class="text-journey-deep/95 eyebrow-text">
              {{ data.founder.worldEyebrow }}
            </span>
            <div class="bg-dark-gold/70 eyebrow-border" />
          </div>

          <h3
            v-motion-fade-up
            :delay="100"
            class="section-subtitle text-journey-deep mb-4 md:mb-5"
          >
            {{ data.founder.worldTitle }}
          </h3>

          <p
            v-motion-fade-up
            :delay="150"
            class="section-paragraph text-secondary-light max-w-3xl mb-8"
          >
            {{ data.founder.worldDescription }}
          </p>

          <!-- 7 Pillar Tags -->
          <div
            v-motion-fade-up
            :delay="200"
            class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
          >
            <span
              v-for="tag in data.founder.worldTags"
              :key="tag"
              class="section-midsubtitle bg-surface-light text-journey-deep border border-journey-deep/15 px-4 py-2 rounded-full mb-0 shadow-2xs"
            >
              {{ tag }}
            </span>
          </div>
        </div>

      </div>
    </section>

    <!-- ==========================================
         SECTION 3: THE JOURNEY SO FAR (STICKY CROSSFADE)
         ========================================== -->
    <section
      data-theme="light"
      class="section-wrapper bg-soft-cream/30 border-y border-dark-gold/15"
    >
      <div class="w-full max-w-7xl flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-16">
        
        <!-- Left Column: 3 Scrolling Narrative Chapters -->
        <div class="w-full lg:w-7/12 flex flex-col gap-16 md:gap-24">
          <article
            v-for="(chapter, cIdx) in data.journeySoFar.chapters"
            :key="chapter.id"
            :ref="(el) => setChapterRef(el, cIdx)"
            :data-chapter-index="cIdx"
            class="flex flex-col items-start text-left"
          >
            <!-- Eyebrow -->
            <div v-motion-fade-up class="flex items-center w-full mb-3">
              <div class="bg-dark-gold/70 eyebrow-border" />
              <span class="text-journey-deep/90 eyebrow-text">
                {{ chapter.eyebrow }}
              </span>
            </div>

            <!-- Chapter Title -->
            <h2
              v-motion-fade-up
              :delay="100"
              class="section-subtitle text-journey-deep mb-5 md:mb-6"
            >
              {{ chapter.title }}
            </h2>

            <!-- Narrative Paragraphs -->
            <div class="flex flex-col gap-4 mb-6">
              <p
                v-for="(p, pIdx) in chapter.paragraphs"
                :key="pIdx"
                v-motion-fade-up
                :delay="150 + pIdx * 50"
                class="section-paragraph text-secondary-light"
              >
                {{ p }}
              </p>
            </div>

            <!-- Optional Staccato Callout List (Block 1) -->
            <div
              v-if="chapter.staccatoList && chapter.staccatoList.length"
              v-motion-fade-up
              :delay="200"
              class="quote-left-border border-dark-gold bg-surface-light/60 rounded-r-xl p-5 sm:p-6 w-full grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
            >
              <span
                v-for="item in chapter.staccatoList"
                :key="item"
                class="font-quote italic text-[18px] sm:text-[20px] text-journey-deep font-medium"
              >
                {{ item }}
              </span>
            </div>

            <!-- Optional Checkmark Bullet List (Block 2) -->
            <ul
              v-if="chapter.bulletList && chapter.bulletList.length"
              class="flex flex-col gap-3.5 w-full mb-6"
            >
              <li
                v-for="(bullet, bIdx) in chapter.bulletList"
                :key="bIdx"
                v-motion-fade-up
                :delay="180 + bIdx * 50"
                class="flex items-start gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
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
                <span class="section-paragraph text-journey-deep/90">
                  {{ bullet }}
                </span>
              </li>
            </ul>

            <!-- Optional Closing Line -->
            <p
              v-if="chapter.closingLine"
              v-motion-fade-up
              :delay="250"
              class="section-quote text-darker-gold mb-6"
            >
              {{ chapter.closingLine }}
            </p>

            <!-- Optional External CTA (Moksha Stories) -->
            <a
              v-if="chapter.externalCta"
              :href="chapter.externalCta.href"
              target="_blank"
              rel="noopener noreferrer"
              v-motion-fade-up
              :delay="250"
              class="inline-flex items-center gap-2.5 px-5 py-3 rounded-sm border-2 border-journey-deep/30 text-journey-deep hover:border-intention-blue hover:bg-intention-blue hover:text-surface-light transition-all duration-300 font-uppercase text-[11px] sm:text-[12px] tracking-[0.18em] uppercase"
            >
              <span>{{ chapter.externalCta.label }}</span>
              <svg
                class="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>

            <!-- Mobile/Tablet Inline Image (< 1024px) -->
            <div class="w-full max-w-md mx-auto mt-8 lg:hidden">
              <div class="relative w-full aspect-4/3 rounded-2xl overflow-hidden bg-surface-frosted shadow-xs">
                <img
                  :src="chapter.image"
                  :alt="chapter.imageAlt"
                  width="640"
                  height="480"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </article>
        </div>

        <!-- Right Column: Sticky Crossfade Deck (Desktop lg+) -->
        <div class="hidden lg:flex lg:w-5/12 flex-col lg:sticky lg:top-28">
          <div class="relative w-full aspect-4/5 rounded-2xl overflow-hidden bg-surface-frosted shadow-md border border-dark-gold/20">
            <img
              v-for="(chapter, imgIdx) in data.journeySoFar.chapters"
              :key="chapter.id"
              :src="chapter.image"
              :alt="chapter.imageAlt"
              width="600"
              height="750"
              loading="lazy"
              decoding="async"
              fetchpriority="low"
              class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              :class="activeChapterIndex === imgIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'"
            />

            <!-- Subtle Bottom Caption & Chapter Progress Dots -->
            <div class="absolute bottom-0 inset-x-0 z-20 bg-linear-to-t from-journey-deep/85 via-journey-deep/45 to-transparent p-6 flex items-end justify-between gap-4">
              <span class="card-paragraph text-surface-light font-medium">
                {{ data.journeySoFar.chapters[activeChapterIndex]?.imageCaption }}
              </span>

              <div class="flex items-center gap-2 shrink-0">
                <span
                  v-for="(c, dotIdx) in data.journeySoFar.chapters"
                  :key="c.id"
                  class="h-1.5 rounded-full transition-all duration-500"
                  :class="activeChapterIndex === dotIdx ? 'w-6 bg-warm-gold' : 'w-1.5 bg-surface-light/50'"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- ==========================================
         SECTION 4: BOUTIQUE PHILOSOPHY & AUTHORITY STATS
         ========================================== -->
    <section
      data-theme="light"
      class="section-wrapper bg-bg-light"
    >
      <div class="w-full max-w-7xl flex flex-col items-center">
        
        <!-- Top Philosophy Header -->
        <div class="w-full max-w-4xl flex flex-col items-center text-center mb-12 md:mb-16">
          <div v-motion-fade-up class="eyebrow-wrapper">
            <div class="bg-dark-gold/70 eyebrow-border" />
            <span class="text-journey-deep/95 eyebrow-text">
              {{ data.boutiquePhilosophy.eyebrow }}
            </span>
            <div class="bg-dark-gold/70 eyebrow-border" />
          </div>

          <h2
            v-motion-fade-up
            :delay="100"
            class="section-title-wrapper"
          >
            <span class="text-journey-deep section-title-sans">
              {{ data.boutiquePhilosophy.titleLine1 }}
            </span>
            <span class="text-dark-gold section-title-cursive">
              {{ data.boutiquePhilosophy.titleLine2Cursive }}
            </span>
          </h2>

          <p
            v-motion-fade-up
            :delay="150"
            class="section-paragraph text-secondary-light max-w-3xl mb-8"
          >
            {{ data.boutiquePhilosophy.description }}
          </p>

          <!-- 3 Editorial Mantras -->
          <div
            v-motion-fade-up
            :delay="200"
            class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full py-5 px-6 rounded-xl bg-soft-cream/40 border border-dark-gold/20"
          >
            <span
              v-for="(mantra, mIdx) in data.boutiquePhilosophy.mantras"
              :key="mantra"
              class="flex items-center gap-4 sm:gap-8"
            >
              <span class="section-quote text-journey-deep">
                {{ mantra }}
              </span>
              <span
                v-if="mIdx < data.boutiquePhilosophy.mantras.length - 1"
                class="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-dark-gold"
              />
            </span>
          </div>
        </div>

        <!-- Middle Block: Cultural Custodians Pills -->
        <div class="w-full max-w-5xl flex flex-col items-center text-center mb-14 md:mb-20">
          <h3
            v-motion-fade-up
            class="section-smaller-subtitle text-journey-deep mb-3"
          >
            {{ data.boutiquePhilosophy.custodiansTitle }}
          </h3>

          <p
            v-motion-fade-up
            :delay="100"
            class="section-paragraph text-secondary-light max-w-2xl mb-6"
          >
            {{ data.boutiquePhilosophy.custodiansIntro }}
          </p>

          <div
            v-motion-fade-up
            :delay="150"
            class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
          >
            <span
              v-for="pill in data.boutiquePhilosophy.custodianPills"
              :key="pill"
              class="section-subparagraph bg-surface-light border border-journey-deep/15 text-journey-deep px-4 py-2 rounded-lg shadow-2xs"
            >
              {{ pill }}
            </span>
          </div>
        </div>

        <!-- Bottom Block: 5-Column Animated Authority Stats Grid -->
        <div
          ref="statsContainerRef"
          class="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 pt-10 md:pt-14 border-t border-divider-light"
        >
          <div
            v-for="(stat, sIdx) in data.boutiquePhilosophy.stats"
            :key="stat.label"
            v-motion-stagger-card
            :delay="sIdx * 80"
            class="flex flex-col items-center text-center p-4 sm:p-5 rounded-xl bg-surface-light border border-journey-deep/10 shadow-2xs"
            :class="sIdx === data.boutiquePhilosophy.stats.length - 1 ? 'col-span-2 md:col-span-1' : 'col-span-1'"
          >
            <div class="stat-number text-journey-deep mb-2">
              <span>{{ animatedStats[sIdx] ?? stat.value }}</span>
              <span class="text-dark-gold">{{ stat.suffix }}</span>
            </div>

            <span
              v-if="stat.sublabel"
              class="card-eyebrow font-semibold text-dark-gold mb-1"
            >
              {{ stat.sublabel }}
            </span>

            <p class="section-subparagraph text-secondary-light">
              {{ stat.label }}
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- ==========================================
         SECTION 5: WHAT I LOOK FOR & BEYOND TRAVEL DESIGN
         ========================================== -->
    <section
      data-theme="light"
      class="section-wrapper bg-soft-blue/25 border-y border-journey-deep/10"
    >
      <div class="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
        
        <!-- Left Column (7 Cols): What I Look For (6-Card Photo Overlay Grid) -->
        <div class="lg:col-span-7 flex flex-col items-start text-left w-full">
          <div v-motion-fade-up class="flex items-center w-full mb-3">
            <div class="bg-dark-gold/70 eyebrow-border" />
            <span class="text-journey-deep/90 eyebrow-text">
              {{ data.lookAndBeyond.lookFor.eyebrow }}
            </span>
          </div>

          <h2
            v-motion-fade-up
            :delay="100"
            class="section-subtitle text-journey-deep mb-2"
          >
            {{ data.lookAndBeyond.lookFor.title }}
          </h2>

          <p
            v-motion-fade-up
            :delay="150"
            class="section-paragraph text-secondary-light mb-8"
          >
            {{ data.lookAndBeyond.lookFor.subtitle }}
          </p>

          <!-- 6-Card Photography Overlay Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 w-full mb-8">
            <article
              v-for="(item, lIdx) in data.lookAndBeyond.lookFor.cards"
              :key="item.tag"
              v-motion-stagger-card
              :delay="lIdx * 80"
              class="group relative w-full aspect-4/5 rounded-2xl overflow-hidden bg-journey-deep shadow-sm"
            >
              <img
                :src="item.image"
                :alt="item.imageAlt"
                width="480"
                height="600"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                class="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />

              <div class="absolute inset-0 bg-linear-to-t from-journey-deep/95 via-journey-deep/45 to-transparent" />

              <div class="relative z-10 w-full h-full p-5 flex flex-col justify-end text-left">
                <span class="card-eyebrow font-bold text-warm-gold">
                  {{ item.tag }}
                </span>
                <h3 class="section-subparagraph font-medium text-surface-light leading-snug mb-1.5">
                  {{ item.title }}
                </h3>
                <p class="card-paragraph text-surface-light/80 italic">
                  {{ item.moment }}
                </p>
              </div>
            </article>
          </div>

          <!-- Closing Line & Link to Network Page -->
          <div
            v-motion-fade-up
            class="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-surface-light/80 border border-journey-deep/10"
          >
            <p class="section-subparagraph text-journey-deep font-medium">
              {{ data.lookAndBeyond.lookFor.closingNote }}
            </p>

            <NuxtLink
              :to="data.lookAndBeyond.lookFor.networkCtaTo"
              class="shrink-0 inline-flex items-center gap-2 font-uppercase text-[11px] tracking-[0.18em] uppercase text-intention-blue hover:text-dark-gold font-bold transition-colors"
            >
              <span>{{ data.lookAndBeyond.lookFor.networkCtaLabel }}</span>
              <svg
                class="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column (5 Cols): Beyond Travel Design (Editorial Ledger) -->
        <div class="lg:col-span-5 flex flex-col items-start text-left w-full bg-surface-light/90 rounded-2xl p-6 sm:p-8 md:p-10 border border-journey-deep/10 shadow-xs">
          <div v-motion-fade-up class="flex items-center w-full mb-3">
            <div class="bg-dark-gold/70 eyebrow-border" />
            <span class="text-journey-deep/90 eyebrow-text">
              {{ data.lookAndBeyond.beyond.eyebrow }}
            </span>
          </div>

          <h2
            v-motion-fade-up
            :delay="100"
            class="section-subtitle text-journey-deep mb-4"
          >
            {{ data.lookAndBeyond.beyond.title }}
          </h2>

          <div class="flex flex-col gap-3.5 mb-6">
            <p
              v-for="(p, pIdx) in data.lookAndBeyond.beyond.paragraphs"
              :key="pIdx"
              v-motion-fade-up
              :delay="150 + pIdx * 50"
              class="section-subparagraph text-secondary-light"
            >
              {{ p }}
            </p>
          </div>

          <!-- 5-Row Editorial Ledger -->
          <ul class="w-full flex flex-col mb-6">
            <li
              v-for="(row, rIdx) in data.lookAndBeyond.beyond.pursuits"
              :key="row.index"
              v-motion-fade-up
              :delay="200 + rIdx * 60"
              class="list-row-border"
            >
              <span class="font-uppercase text-[11px] tracking-[0.2em] text-dark-gold font-bold shrink-0">
                {{ row.index }}
              </span>
              <div class="flex flex-col">
                <h3 class="section-subparagraph font-semibold text-journey-deep">
                  {{ row.title }}
                </h3>
                <p class="card-paragraph text-secondary-light mt-0.5">
                  {{ row.description }}
                </p>
              </div>
            </li>
          </ul>

          <p
            v-motion-fade-up
            :delay="350"
            class="section-quote text-darker-gold"
          >
            {{ data.lookAndBeyond.beyond.closingLine }}
          </p>
        </div>

      </div>
    </section>

    <!-- ==========================================
         SECTION 6: THE ROUTING HUB, QUOTE & FINALE
         ========================================== -->
    <section
      data-theme="light"
      class="section-wrapper bg-bg-light"
    >
      <div class="w-full max-w-7xl flex flex-col items-center">
        
        <!-- 1. Top Routing Hub (4 Ecosystem Teaser Cards) -->
        <div class="w-full flex flex-col items-center mb-16 md:mb-24">
          <div v-motion-fade-up class="eyebrow-wrapper">
            <div class="bg-dark-gold/70 eyebrow-border" />
            <span class="text-journey-deep/95 eyebrow-text">
              {{ data.finale.routingEyebrow }}
            </span>
            <div class="bg-dark-gold/70 eyebrow-border" />
          </div>

          <h2
            v-motion-fade-up
            :delay="100"
            class="section-subtitle text-journey-deep text-center mb-8 md:mb-12"
          >
            {{ data.finale.routingTitle }}
          </h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            <NuxtLink
              v-for="(card, cIdx) in data.finale.routingCards"
              :key="card.title"
              :to="card.to"
              v-motion-stagger-card
              :delay="cIdx * 80"
              class="group flex flex-col rounded-2xl overflow-hidden bg-surface-light border border-journey-deep/10 shadow-xs hover:shadow-md transition-all duration-500"
            >
              <div class="relative w-full aspect-16/10 overflow-hidden bg-surface-frosted">
                <img
                  :src="card.image"
                  :alt="card.imageAlt"
                  width="480"
                  height="300"
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div class="p-5 sm:p-6 flex flex-col grow justify-between text-left">
                <div class="flex flex-col">
                  <span class="card-eyebrow text-dark-gold font-semibold">
                    {{ card.eyebrow }}
                  </span>
                  <h3 class="card-title text-journey-deep group-hover:text-intention-blue transition-colors">
                    {{ card.title }}
                  </h3>
                  <p class="section-subparagraph text-secondary-light mb-5">
                    {{ card.description }}
                  </p>
                </div>

                <div class="inline-flex items-center gap-2 font-uppercase text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-journey-deep group-hover:text-intention-blue font-bold mt-auto">
                  <span>{{ card.linkLabel }}</span>
                  <svg
                    class="w-3.5 h-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- 2. Still Curious Reflection & Signature Quote Centerpiece -->
        <div class="w-full max-w-4xl flex flex-col items-center text-center mb-16 md:mb-20">
          <div v-motion-fade-up class="eyebrow-wrapper">
            <div class="bg-dark-gold/70 eyebrow-border" />
            <span class="text-journey-deep/95 eyebrow-text">
              {{ data.finale.curiousEyebrow }}
            </span>
            <div class="bg-dark-gold/70 eyebrow-border" />
          </div>

          <h2
            v-motion-fade-up
            :delay="100"
            class="section-subtitle text-journey-deep mb-4"
          >
            {{ data.finale.curiousTitle }}
          </h2>

          <p
            v-motion-fade-up
            :delay="150"
            class="section-paragraph text-secondary-light max-w-2xl mb-12 md:mb-16"
          >
            {{ data.finale.curiousDescription }}
          </p>

          <!-- Signature Quote Box -->
          <div
            v-motion-fade-up
            :delay="200"
            class="w-full rounded-2xl bg-soft-cream/35 border border-dark-gold/20 py-10 sm:py-12 md:py-14 px-6 sm:px-10 md:px-14 flex flex-col items-center text-center"
          >
            <svg
              class="w-8 h-8 text-dark-gold/70 mb-4 shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <blockquote class="signature-quote text-journey-deep mb-6">
              “{{ data.finale.quoteText }}”
            </blockquote>

            <cite class="not-italic section-midsubtitle text-dark-gold mb-0">
              — {{ data.finale.quoteAuthor }}
            </cite>
          </div>
        </div>

        <!-- 3. Let's Begin Your Journey Dual CTA -->
        <div
          v-motion-fade-up
          class="w-full max-w-3xl flex flex-col items-center text-center pt-4"
        >
          <h2 class="section-subtitle text-journey-deep mb-3">
            {{ data.finale.ctaTitle }}
          </h2>

          <p class="section-paragraph text-secondary-light max-w-xl mb-8">
            {{ data.finale.ctaDescription }}
          </p>

          <div class="hero-cta-wrapper">
            <CtaButton
              :to="data.finale.primaryCta.to"
              :label="data.finale.primaryCta.label"
              variant="light"
            />
            <CtaButton
              :to="data.finale.secondaryCta.to"
              :label="data.finale.secondaryCta.label"
              variant="light"
            />
          </div>
        </div>

      </div>
    </section>

  </div>
</template>
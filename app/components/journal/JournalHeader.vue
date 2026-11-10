<!-- ~/app/components/journal/JournalHeader.vue -->
<script setup lang="ts">
import { ref, computed, watch, onMounted, onActivated } from 'vue'
import { useInitialAppLoad } from '#imports'

export interface JournalBreadcrumbItem {
  label: string
  to?: string
}

export interface JournalHeaderData {
  breadcrumbs: JournalBreadcrumbItem[]
  contentTypeLabel: string
  subcategoryLabel: string
  title: string
  intro: string
  publishDate: string
  author: string
  readTime: string
  coverImage: string
  coverAlt: string
  headerQuote: string
  tags: [string, string, string] | string[]
}

const props = defineProps<{
  data: JournalHeaderData
}>()

const isInitialAppLoad = useInitialAppLoad()
const hasPlayedEntrance = ref(false)

const formattedDate = computed(() => {
  const raw = props.data.publishDate
  if (!raw) return ''
  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return raw.toUpperCase()
  return parsed
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
    .toUpperCase()
})

const displayTags = computed(() => (props.data.tags || []).slice(0, 3))

const triggerEntrance = () => {
  if (!import.meta.client) return
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      hasPlayedEntrance.value = true
    })
  })
}

onMounted(() => {
  if (!isInitialAppLoad.value) {
    triggerEntrance()
  } else {
    const unwatch = watch(
      isInitialAppLoad,
      (isStillLoading) => {
        if (!isStillLoading) {
          hasPlayedEntrance.value = true
          unwatch()
        }
      },
      { flush: 'sync' }
    )
  }
})

onActivated(() => {
  if (!isInitialAppLoad.value && !hasPlayedEntrance.value) {
    triggerEntrance()
  }
})

watch(
  () => props.data.title,
  () => {
    hasPlayedEntrance.value = false
    triggerEntrance()
  }
)
</script>

<template>
  <header
    data-theme="light"
    aria-label="Journal story introduction"
    class="section-wrapper bg-bg-light text-journey-deep pt-24! sm:pt-28! md:pt-32! pb-8! sm:pb-12! overflow-hidden"
  >
    <div class="w-full max-w-360 mx-auto flex flex-col items-start text-left">
      <!-- 1. BREADCRUMB NAVIGATION (0ms, Active Slug in action-blue) -->
      <nav
        v-if="data.breadcrumbs?.length"
        aria-label="Breadcrumb"
        style="--stagger-delay: 0ms"
        :class="['w-full mb-5 sm:mb-6 header-stagger-item', { 'is-revealed': hasPlayedEntrance }]"
      >
        <ol class="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li
            v-for="(crumb, index) in data.breadcrumbs"
            :key="`crumb-${index}`"
            class="inline-flex items-center gap-2 min-w-0 max-w-full"
          >
            <NuxtLink
              v-if="crumb.to && index < data.breadcrumbs.length - 1"
              :to="crumb.to"
              class="card-eyebrow mb-0! pt-1 pb-px border-b border-journey-deep/25 text-journey-deep/55 hover:text-journey-deep hover:border-journey-deep/50 active:border-journey-deep/50 shrink-0"
            >
              {{ crumb.label }}
            </NuxtLink>

            <span
              v-else
              class="card-eyebrow mb-0! pt-1.5 pb-1 border-b border-transparent text-action-blue font-semibold line-clamp-none! overflow-visible! whitespace-normal! wrap-break-word leading-relaxed"
              aria-current="page"
            >
              {{ crumb.label }}
            </span>

            <span
              v-if="index < data.breadcrumbs.length - 1"
              class="card-eyebrow mb-0! pt-1 pb-1 border-b border-transparent text-journey-deep/35 select-none shrink-0"
              aria-hidden="true"
            >
              /
            </span>
          </li>
        </ol>
      </nav>

      <!-- 2. COMPOSITE EYEBROW: INSIGHT • LIVING HERITAGE (70ms) -->
      <div
        style="--stagger-delay: 70ms"
        :class="[' inline-flex flex-wrap items-center gap-2.5 mb-2.5 sm:mb-3 header-stagger-item pl-0', { 'is-revealed': hasPlayedEntrance }]"
      >
        <span class="eyebrow-text mx-0 text-dark-gold font-semibold">
          {{ data.contentTypeLabel }}
        </span>
        <span class="text-dark-gold text-xs select-none" aria-hidden="true">•</span>
        <span class="eyebrow-text mx-0 text-dark-gold font-semibold">
          {{ data.subcategoryLabel }}
        </span>
      </div>

      <!-- 3. STORY H1 TITLE (140ms) -->
      <h1
        style="--stagger-delay: 140ms"
        :class="[
          'page-title-sans capitalize text-journey-deep max-w-6xl pt-2 mb-2.5 sm:mb-3 header-stagger-item',
          { 'is-revealed': hasPlayedEntrance }
        ]"
      >
        {{ data.title }}
      </h1>

      <!-- 4. INTRO / LEAD PARAGRAPH (210ms) -->
      <p
        style="--stagger-delay: 210ms"
        :class="[
          'hero-paragraph text-secondary-light/90 max-w-6xl mb-4 sm:mb-5 header-stagger-item',
          { 'is-revealed': hasPlayedEntrance }
        ]"
      >
        {{ data.intro }}
      </p>

      <!-- 5. DATE • AUTHOR • READ TIME META LINE (280ms) -->
      <div
        style="--stagger-delay: 280ms"
        :class="[
          'flex flex-wrap items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8 header-stagger-item',
          { 'is-revealed': hasPlayedEntrance }
        ]"
      >
        <span v-if="formattedDate" class="card-eyebrow mb-0! text-journey-deep/80 font-medium">
          {{ formattedDate }}
        </span>
        <span v-if="formattedDate && data.author" class="text-journey-deep/45 text-xs select-none" aria-hidden="true">
          •
        </span>
        <span v-if="data.author" class="card-eyebrow mb-0! text-journey-deep/80 font-medium">
          BY {{ data.author.toUpperCase() }}
        </span>
        <span v-if="data.readTime" class="text-journey-deep/45 text-xs select-none" aria-hidden="true">
          •
        </span>
        <span v-if="data.readTime" class="card-eyebrow mb-0! text-journey-deep/80 font-medium">
          {{ data.readTime.toUpperCase() }}
        </span>
      </div>

      <!-- 6. FULL-WIDTH COVER IMAGE + UNDERNEATH QUOTE & 3 HASHTAGS -->
      <div class="w-full flex flex-col gap-6 sm:gap-8 lg:gap-9">
        <!-- Cover Image (350ms, 3:2 -> xs:16:9 -> md:2:1 -> lg:21:9) -->
        <div
          style="--stagger-delay: 350ms"
          :class="[
            'w-full header-stagger-item',
            { 'is-revealed': hasPlayedEntrance }
          ]"
        >
          <div class="relative w-full aspect-3/2 xs:aspect-video md:aspect-2/1 lg:aspect-21/9 rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-light shadow-xs">
            <img
              :src="data.coverImage"
              :alt="data.coverAlt"
              width="1440"
              height="617"
              fetchpriority="high"
              loading="eager"
              decoding="sync"
              :class="[
                'w-full h-full object-cover object-center select-none header-cover-media',
                { 'is-revealed': hasPlayedEntrance }
              ]"
            />
          </div>
        </div>

        <!-- Stacked Quote & Decorative 3-Tag Panel Underneath Cover (420ms) -->
        <div
          :class="[
            'w-full flex flex-col items-center'
          ]"
        >
          <!-- Top Flanked Quote Mark in action-blue -->
          <div v-motion-fade-up :delay="100" class="w-full flex items-center gap-4 sm:gap-5" aria-hidden="true">
            <span class="h-px flex-1 bg-journey-deep/20" />
            <svg
              class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 text-action-blue shrink-0"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <span class="h-px flex-1 bg-journey-deep/20" />
          </div>

          <!-- Center Editorial Quote (journal-header-quote) -->
          <blockquote v-motion-fade-up :delay="100" class="journal-header-quote text-journey-deep text-center max-w-4xl mx-auto px-2 sm:px-6 my-5 sm:my-6 lg:my-7">
            {{ data.headerQuote }}
          </blockquote>

          <!-- Bottom Divider + 3 Centered Auto-Width Hashtag Pills -->
          <div class="w-full flex flex-col pt-4 sm:pt-5 border-t border-journey-deep/20">
            <div class="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              <span
                v-for="(tag, tIdx) in displayTags"
                v-motion-stagger-card
                :delay="200 + tIdx * 120"
                :key="`header-tag-${tIdx}`"
                class="w-auto shrink-0 px-3.5 pt-2 pb-1 rounded-md border border-journey-deep/25 bg-surface-light/60 card-tag line-clamp-none! overflow-visible! whitespace-nowrap text-journey-deep/85 text-center select-none cursor-default"
              >
                {{ tag.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-cover-media {
  transform: scale(1.08);
  will-change: transform;
  transition: transform 2.2s cubic-bezier(0.22, 1, 0.36, 1);
}

.header-cover-media.is-revealed {
  transform: scale(1);
}

.header-stagger-item {
  opacity: 0;
  transform: translate3d(0, 24px, 0);
  will-change: transform, opacity;
  transition:
    opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.95s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--stagger-delay, 0ms);
}

.header-stagger-item.is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
</style>
<!-- ~/app/components/LegalDocument.vue -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

export interface LegalLinkItem {
  label: string
  to: string
}

export interface LegalBlock {
  type: 'paragraph' | 'heading' | 'unorderedList' | 'orderedList' | 'callout' | 'table' | 'links' | 'contact'
  text?: string
  level?: number
  items?: string[] | LegalLinkItem[]
  title?: string
  caption?: string
  columns?: string[]
  rows?: string[][]
  name?: string
  legalName?: string
  address?: string[]
  email?: string
  bookingEmail?: string
  privacyEmail?: string
  officeHours?: string
}

export interface LegalSection {
  id: string
  title: string
  blocks: LegalBlock[]
}

export interface LegalBusinessInfo {
  name: string
  legalName: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  email: string
  bookingEmail?: string
  privacyEmail?: string
  officeHours?: string
  timezone?: string
}

export interface LegalDocumentConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  effectiveDate?: string
  lastUpdated?: string
  introduction: string[]
  business?: LegalBusinessInfo
  contentsTitle: string
  sections: LegalSection[]
}

const props = defineProps<{
  data: LegalDocumentConfig
}>()

// --- Active Section & Element Refs ---
const activeSectionId = ref<string>(props.data.sections[0]?.id || '')
const sectionRefs = ref<Record<string, HTMLElement | null>>({})
const mobileTabsContainer = ref<HTMLElement | null>(null)
const mobileTabRefs = ref<Record<string, HTMLButtonElement | null>>({})
const desktopTabRefs = ref<Record<string, HTMLButtonElement | null>>({})
const desktopTabsContainer = ref<HTMLElement | null>(null)

const setSectionRef = (id: string, el: any) => {
  if (el) sectionRefs.value[id] = el as HTMLElement
}

const setMobileTabRef = (id: string, el: any) => {
  if (el) mobileTabRefs.value[id] = el as HTMLButtonElement
}

const setDesktopTabRef = (id: string, el: any) => {
  if (el) desktopTabRefs.value[id] = el as HTMLButtonElement
}

// --- Dynamic Date Formatter (Timezone-Safe UTC) ---
const formatDate = (dateStr?: string): string => {
  if (!dateStr) return ''
  const parts = dateStr.split('-').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) return dateStr
  const [year, month, day] = parts as [number, number, number]
  const date = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
}

// --- Programmatic Smooth Scroll (No href / No URL Hash) ---
let isProgrammaticScroll = false
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

const scrollToSection = (sectionId: string) => {
  if (hasDragged) return
  const targetEl = sectionRefs.value[sectionId]
  if (!targetEl) return

  activeSectionId.value = sectionId
  isProgrammaticScroll = true

  // Offset accounts for sticky mobile tab bar or desktop breathing room
  const isDesktop = window.innerWidth >= 1024
  const offset = isDesktop ? 96 : 148
  const elementPosition = targetEl.getBoundingClientRect().top + window.scrollY
  const offsetPosition = elementPosition - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })

  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    isProgrammaticScroll = false
  }, 850)
}

// --- Center Active Tab in Mobile Horizontal Strip ---
const centerActiveMobileTab = (sectionId: string) => {
  if (isDragging || !mobileTabsContainer.value) return
  const tabEl = mobileTabRefs.value[sectionId]
  if (!tabEl) return

  const container = mobileTabsContainer.value
  const tabLeft = tabEl.offsetLeft
  const tabWidth = tabEl.offsetWidth
  const containerWidth = container.clientWidth
  const targetScroll = tabLeft - containerWidth / 2 + tabWidth / 2

  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  })
}

const centerActiveDesktopTab = (sectionId: string) => {
  if (!desktopTabsContainer.value) return
  const tabEl = desktopTabRefs.value[sectionId]
  if (!tabEl) return

  const container = desktopTabsContainer.value
  const tabTop = tabEl.offsetTop
  const tabHeight = tabEl.offsetHeight
  const containerHeight = container.clientHeight
  const targetScroll = tabTop - (containerHeight / 2) + (tabHeight / 2)

  container.scrollTo({
    top: targetScroll,
    behavior: 'smooth'
  })
}

watch(activeSectionId, (newId) => {
  nextTick(() => {
    centerActiveMobileTab(newId)
    centerActiveDesktopTab(newId)
  })
})

// --- Scrollspy Engine (rAF Throttled) ---
let spyTicking = false

const updateScrollSpy = () => {
  if (isProgrammaticScroll) {
    spyTicking = false
    return
  }

  const triggerPoint = window.innerWidth >= 1024 ? 180 : 200
  let currentId = props.data.sections[0]?.id || ''

  for (const section of props.data.sections) {
    const el = sectionRefs.value[section.id]
    if (!el) continue
    const rect = el.getBoundingClientRect()
    if (rect.top <= triggerPoint) {
      currentId = section.id
    } else {
      break
    }
  }

  // If scrolled to the very bottom of the page, highlight the last section
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
    const lastSection = props.data.sections[props.data.sections.length - 1]
    if (lastSection) currentId = lastSection.id
  }

  if (currentId && currentId !== activeSectionId.value) {
    activeSectionId.value = currentId
  }

  spyTicking = false
}

const onWindowScroll = () => {
  if (!spyTicking) {
    window.requestAnimationFrame(updateScrollSpy)
    spyTicking = true
  }
}

// --- Mobile Tabs Drag-to-Scroll & Inertia Physics ---
let isDragging = false
let hasDragged = false
let startX = 0
let scrollLeft = 0
let velocity = 0
let momentumID: number | null = null
let lastX = 0
let lastTime = 0

const startDrag = (e: MouseEvent) => {
  if (!mobileTabsContainer.value) return
  isDragging = true
  hasDragged = false
  if (momentumID) cancelAnimationFrame(momentumID)

  startX = e.pageX - mobileTabsContainer.value.offsetLeft
  scrollLeft = mobileTabsContainer.value.scrollLeft
  lastX = e.pageX
  lastTime = performance.now()
  velocity = 0
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging || !mobileTabsContainer.value) return
  e.preventDefault()

  const currentX = e.pageX
  const x = currentX - mobileTabsContainer.value.offsetLeft
  const walk = (x - startX) * 1.5

  if (Math.abs(walk) > 6) {
    hasDragged = true
  }

  mobileTabsContainer.value.scrollLeft = scrollLeft - walk

  const now = performance.now()
  const dt = now - lastTime
  const dx = currentX - lastX

  if (dt > 0) {
    velocity = -(dx / dt) * 16.6 * 1.5
  }

  lastX = currentX
  lastTime = now
}

const applyMomentum = () => {
  if (!mobileTabsContainer.value) return
  mobileTabsContainer.value.scrollLeft += velocity
  velocity *= 0.92

  if (Math.abs(velocity) > 0.5) {
    momentumID = requestAnimationFrame(applyMomentum)
  }
}

const stopDrag = () => {
  if (!isDragging) return
  isDragging = false
  if (hasDragged) {
    momentumID = requestAnimationFrame(applyMomentum)
    setTimeout(() => {
      hasDragged = false
    }, 50)
  }
}

// --- Keyboard Navigation for Mobile & Desktop TOC ---
const handleKeydown = (e: KeyboardEvent) => {
  const currentIndex = props.data.sections.findIndex(s => s.id === activeSectionId.value)
  if (currentIndex === -1) return
  let nextIndex = currentIndex

  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    nextIndex = (currentIndex + 1) % props.data.sections.length
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    nextIndex = (currentIndex - 1 + props.data.sections.length) % props.data.sections.length
  }

  if (nextIndex !== currentIndex) {
    e.preventDefault()
    const nextSection = props.data.sections[nextIndex]
    if (nextSection) {
      hasDragged = false
      scrollToSection(nextSection.id)
    }
  }
}

// --- Type Guard Helper for Link Blocks ---
const asLinkItems = (items?: string[] | LegalLinkItem[]): LegalLinkItem[] => {
  if (!items) return []
  return items as LegalLinkItem[]
}

const asStringItems = (items?: string[] | LegalLinkItem[]): string[] => {
  if (!items) return []
  return items as string[]
}

onMounted(() => {
  window.addEventListener('scroll', onWindowScroll, { passive: true })
  updateScrollSpy()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onWindowScroll)
  if (momentumID) cancelAnimationFrame(momentumID)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
</script>

<template>
  <section
    data-theme="light"
    class="text-primary-light section-wrapper"
  >
    <div class="relative z-10 w-full max-w-400 mx-auto flex flex-col items-center">

      <!-- 1. SECTION HEADER -->
      <div class="relative w-full flex flex-col items-center text-center mb-8 md:mb-12 px-2">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper"
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

        <!-- Dynamic Effective & Updated Date Badges -->
        <div
          v-if="data.effectiveDate || data.lastUpdated"
          v-motion-fade-up
          :delay="250"
          class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 pt-4 border-t border-journey-deep/10"
        >
          <div
            v-if="data.effectiveDate"
            class="flex items-center gap-2 bg-soft-cream/35 border border-journey-deep/10 px-3.5 py-1.5 rounded-md"
          >
            <span class="card-tag font-bold text-journey-deep uppercase">Effective Date:</span>
            <time :datetime="data.effectiveDate" class="section-subparagraph font-semibold text-secondary-light">
              {{ formatDate(data.effectiveDate) }}
            </time>
          </div>

          <div
            v-if="data.lastUpdated"
            class="flex items-center gap-2 bg-soft-cream/35 border border-journey-deep/10 px-3.5 py-1.5 rounded-md"
          >
            <span class="card-tag font-bold text-journey-deep uppercase">Last Updated:</span>
            <time :datetime="data.lastUpdated" class="section-subparagraph font-semibold text-secondary-light">
              {{ formatDate(data.lastUpdated) }}
            </time>
          </div>
        </div>
      </div>

      <!-- 2. MOBILE / TABLET STICKY SCROLLSPY TABS (< lg) -->
      <div class="lg:hidden sticky top-15 z-30 w-full bg-bg-light/95 backdrop-blur-md py-3 mb-8 border-y border-journey-deep/10">
        <div
          ref="mobileTabsContainer"
          class="flex overflow-x-auto hide-scrollbar gap-2.5 sm:gap-3 w-full cursor-grab active:cursor-grabbing px-1 focus:outline-none scroll-smooth-disabled"
          tabindex="0"
          role="navigation"
          :aria-label="data.contentsTitle"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @keydown="handleKeydown"
        >
          <button
            v-for="section in data.sections"
            :key="`mobile-tab-${section.id}`"
            :ref="(el) => setMobileTabRef(section.id, el)"
            type="button"
            @click="scrollToSection(section.id)"
            class="shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-md section-subparagraph font-semibold uppercase transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue cursor-pointer select-none"
            :class="[
              activeSectionId === section.id
                ? 'bg-intention-blue text-surface-light border-intention-blue shadow-sm'
                : 'bg-surface-light text-intention-blue border-intention-blue/30 hover:border-intention-blue hover:bg-intention-blue/5 active:border-intention-blue active:bg-intention-blue/5'
            ]"
          >
            {{ section.title }}
          </button>
        </div>
      </div>

      <!-- 3. MAIN 12-COLUMN EDITORIAL GRID -->
      <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        <!-- LEFT COLUMN: DESKTOP STICKY SCROLLSPY TOC (lg+) -->
        <aside
          class="hidden lg:flex lg:col-span-4 xl:col-span-4 flex-col sticky top-28 self-start bg-soft-cream/25 border border-journey-deep/10 rounded-2xl p-5 xl:p-6 max-h-[calc(100vh-8rem)]"
          role="navigation"
          :aria-label="data.contentsTitle"
          tabindex="0"
          @keydown="handleKeydown"
        >
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-journey-deep/10 shrink-0">
            <h3 class="section-midsubtitle text-journey-deep font-bold mb-0">
              {{ data.contentsTitle }}
            </h3>
            <span class="card-tag text-darker-gold font-bold">
              {{ data.sections.length }} Sections
            </span>
          </div>

          <!-- Scrollable Links Container -->
          <div 
            ref="desktopTabsContainer" 
            data-lenis-prevent
            class="flex flex-col gap-1.5 overflow-y-auto editorial-scrollbar pr-2 relative scroll-smooth-disabled"
          >
            <button
              v-for="section in data.sections"
              :key="`desktop-toc-${section.id}`"
              :ref="(el) => setDesktopTabRef(section.id, el)"
              type="button"
              @click="scrollToSection(section.id)"
              class="group w-full text-left px-3.5 py-2.5 rounded-lg section-subparagraph transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue flex items-center justify-between gap-2"
              :class="[
                activeSectionId === section.id
                  ? 'bg-intention-blue text-surface-light font-semibold shadow-xs'
                  : 'bg-transparent text-secondary-light font-normal hover:bg-soft-cream/40 hover:text-journey-deep active:bg-soft-cream/40 active:text-journey-deep'
              ]"
            >
              <span class="truncate">{{ section.title }}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-3.5 h-3.5 shrink-0 transition-transform duration-300"
                :class="[
                  activeSectionId === section.id
                    ? 'opacity-100 translate-x-0 text-surface-light'
                    : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-active:opacity-100 group-active:translate-x-0 text-intention-blue'
                ]"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </aside>

        <!-- RIGHT COLUMN: LEGAL DOCUMENT CONTENT -->
        <div class="lg:col-span-8 xl:col-span-8 flex flex-col gap-8 md:gap-10 w-full">

          <!-- Introduction Box -->
          <div
            v-if="data.introduction?.length"
            class="bg-soft-cream/25 border border-journey-deep/10 rounded-2xl p-5 sm:p-6 md:p-8 flex flex-col gap-4"
          >
            <p
              v-for="(introParagraph, idx) in data.introduction"
              :key="`intro-${idx}`"
              class="hero-paragraph text-secondary-light"
            >
              {{ introParagraph }}
            </p>
          </div>

          <!-- Dynamic Document Sections -->
          <article
            v-for="section in data.sections"
            :key="section.id"
            :ref="(el) => setSectionRef(section.id, el)"
            class="bg-surface-light border border-journey-deep/10 rounded-2xl p-5 sm:p-7 md:p-9 shadow-xs flex flex-col gap-4 sm:gap-5 transition-colors duration-300"
            :class="activeSectionId === section.id ? 'border-intention-blue/30' : 'border-journey-deep/10'"
          >
            <!-- Section Heading (H2) -->
            <h2 class="section-smaller-subtitle font-semibold text-journey-deep pb-3 border-b border-journey-deep/10">
              {{ section.title }}
            </h2>

            <!-- Section Blocks Loop -->
            <div class="flex flex-col gap-4 sm:gap-5">
              <template v-for="(block, bIdx) in section.blocks" :key="`${section.id}-block-${bIdx}`">

                <!-- 1. Paragraph -->
                <p
                  v-if="block.type === 'paragraph'"
                  class="section-paragraph text-secondary-light"
                >
                  {{ block.text }}
                </p>

                <!-- 2. Sub-heading (Level 3) -->
                <h3
                  v-else-if="block.type === 'heading'"
                  class="hero-paragraph font-semibold text-journey-deep pt-2"
                >
                  {{ block.text }}
                </h3>

                <!-- 3. Unordered List -->
                <ul
                  v-else-if="block.type === 'unorderedList'"
                  class="list-disc pl-5 sm:pl-6 flex flex-col gap-2"
                >
                  <li
                    v-for="(item, iIdx) in asStringItems(block.items)"
                    :key="`ul-${iIdx}`"
                    class="section-paragraph text-secondary-light"
                  >
                    {{ item }}
                  </li>
                </ul>

                <!-- 4. Ordered List -->
                <ol
                  v-else-if="block.type === 'orderedList'"
                  class="list-decimal pl-5 sm:pl-6 flex flex-col gap-2"
                >
                  <li
                    v-for="(item, iIdx) in asStringItems(block.items)"
                    :key="`ol-${iIdx}`"
                    class="section-paragraph text-secondary-light"
                  >
                    {{ item }}
                  </li>
                </ol>

                <!-- 5. Editorial Callout -->
                <div
                  v-else-if="block.type === 'callout'"
                  class="bg-soft-cream/35 border-l-4 border-darker-gold rounded-r-xl p-4 sm:p-6 flex flex-col gap-2 my-1"
                >
                  <h4
                    v-if="block.title"
                    class="hero-paragraph font-semibold text-journey-deep"
                  >
                    {{ block.title }}
                  </h4>
                  <p class="section-paragraph text-secondary-light">
                    {{ block.text }}
                  </p>
                </div>

                <!-- 6. Responsive Data Table -->
                <div
                  v-else-if="block.type === 'table'"
                  class="w-full overflow-x-auto border border-journey-deep/15 rounded-xl my-2"
                >
                  <table class="w-full text-left border-collapse min-w-120">
                    <caption
                      v-if="block.caption"
                      class="text-left px-4 sm:px-5 py-3 bg-soft-cream/35 border-b border-journey-deep/10 section-midsubtitle font-bold text-journey-deep mb-0"
                    >
                      {{ block.caption }}
                    </caption>
                    <thead>
                      <tr class="bg-journey-deep text-surface-light">
                        <th
                          v-for="(col, cIdx) in block.columns"
                          :key="`th-${cIdx}`"
                          scope="col"
                          class="px-4 sm:px-5 py-3 section-subparagraph font-semibold uppercase"
                        >
                          {{ col }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-journey-deep/10 bg-surface-light">
                      <tr
                        v-for="(row, rIdx) in block.rows"
                        :key="`tr-${rIdx}`"
                        class="transition-colors hover:bg-soft-cream/20 active:bg-soft-cream/20"
                      >
                        <td
                          v-for="(cell, cellIdx) in row"
                          :key="`td-${rIdx}-${cellIdx}`"
                          class="px-4 sm:px-5 py-3.5 section-subparagraph text-secondary-light align-top"
                          :class="cellIdx === 0 ? 'font-semibold text-journey-deep' : 'font-normal'"
                        >
                          {{ cell }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 7. Contact Card Block -->
                <div
                  v-else-if="block.type === 'contact'"
                  class="bg-soft-cream/25 border border-journey-deep/15 rounded-xl p-5 sm:p-6 md:p-7 flex flex-col gap-4 my-1"
                >
                  <div class="flex flex-col gap-1 border-b border-journey-deep/10 pb-3">
                    <h4 v-if="block.name" class="hero-paragraph font-semibold text-journey-deep">
                      {{ block.name }}
                    </h4>
                    <p v-if="block.legalName" class="section-subparagraph font-semibold text-darker-gold uppercase">
                      {{ block.legalName }}
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <!-- Address Column -->
                    <div v-if="block.address?.length" class="flex flex-col gap-1">
                      <span class="card-tag font-bold text-journey-deep uppercase mb-1">Address</span>
                      <p
                        v-for="(line, aIdx) in block.address"
                        :key="`addr-${aIdx}`"
                        class="section-paragraph text-secondary-light"
                      >
                        {{ line }}
                      </p>
                    </div>

                    <!-- Channels & Hours Column -->
                    <div class="flex flex-col gap-3">
                      <div v-if="block.email" class="flex flex-col">
                        <span class="card-tag font-bold text-journey-deep uppercase">General Inquiries</span>
                        <a
                          :href="`mailto:${block.email}`"
                          class="section-paragraph font-semibold text-intention-blue hover:text-action-blue active:text-action-blue transition-colors break-all"
                        >
                          {{ block.email }}
                        </a>
                      </div>

                      <div v-if="block.bookingEmail" class="flex flex-col">
                        <span class="card-tag font-bold text-journey-deep uppercase">Bookings & Support</span>
                        <a
                          :href="`mailto:${block.bookingEmail}`"
                          class="section-paragraph font-semibold text-intention-blue hover:text-action-blue active:text-action-blue transition-colors break-all"
                        >
                          {{ block.bookingEmail }}
                        </a>
                      </div>

                      <div v-if="block.privacyEmail" class="flex flex-col">
                        <span class="card-tag font-bold text-journey-deep uppercase">Privacy Inquiries</span>
                        <a
                          :href="`mailto:${block.privacyEmail}`"
                          class="section-paragraph font-semibold text-intention-blue hover:text-action-blue active:text-action-blue transition-colors break-all"
                        >
                          {{ block.privacyEmail }}
                        </a>
                      </div>

                      <div v-if="block.officeHours" class="flex flex-col">
                        <span class="card-tag font-bold text-journey-deep uppercase">Office Hours</span>
                        <p class="section-paragraph text-secondary-light">
                          {{ block.officeHours }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 8. Action Links Block -->
                <div
                  v-else-if="block.type === 'links'"
                  class="flex flex-wrap items-center gap-3 pt-2"
                >
                  <NuxtLink
                    v-for="(link, lIdx) in asLinkItems(block.items)"
                    :key="`link-${lIdx}`"
                    :to="link.to"
                    class="group select-none inline-flex items-center justify-center border-2 border-journey-deep/30 px-3.5 py-2 rounded-sm card-tag font-bold text-journey-deep uppercase transition-all duration-300 hover:border-intention-blue hover:text-intention-blue active:border-intention-blue active:text-intention-blue active:scale-96 gap-2"
                  >
                    <span class="pt-0.5">{{ link.label }}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-active:translate-x-1"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </NuxtLink>
                </div>

              </template>
            </div>
          </article>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>

.hide-scrollbar {
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Webkit */
}
.scroll-smooth-disabled {
  scroll-behavior: auto !important;
}

/* Elegant Desktop TOC Scrollbar */
.editorial-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(5, 27, 59, 0.15) transparent; /* Uses journey-deep */
}
.editorial-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.editorial-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.editorial-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(5, 27, 59, 0.15);
  border-radius: 4px;
}
.editorial-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(5, 27, 59, 0.3);
}

</style>
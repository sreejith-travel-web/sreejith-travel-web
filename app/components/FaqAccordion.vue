<!-- ~/app/components/FaqAccordion.vue -->

<script setup lang="ts">
import { ref, computed } from 'vue'

// --- Interfaces matching the new structured JSON ---
export interface FaqAnswerBlock {
  type: 'paragraph' | 'unorderedList' | 'orderedList'
  text?: string
  items?: string[]
}

export interface FaqItem {
  id: string
  categoryId: string
  question: string
  answer: FaqAnswerBlock[]
}

export interface FaqCategory {
  id: string
  label: string
}

export interface FaqConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  categories: FaqCategory[]
  items: FaqItem[]
}

const props = defineProps<{
  data: FaqConfig
}>()

// --- State ---
const activeCategoryId = ref(props.data.categories[0]?.id || '')
const openQuestionIds = ref<Set<string>>(new Set())
const tabsContainer = ref<HTMLElement | null>(null)

// --- Computed ---
const filteredFaqs = computed(() => {
  return props.data.items.filter(item => item.categoryId === activeCategoryId.value)
})

// --- Drag-to-Scroll & Inertia State ---
let isDragging = false
let startX = 0
let scrollLeft = 0
let velocity = 0
let momentumID: number | null = null
let lastX = 0
let lastTime = 0

// --- Handlers ---
const toggleCategory = (categoryId: string) => {
  activeCategoryId.value = categoryId
  
  // Optional: visually center the clicked tab
  const tab = document.getElementById(`tab-${categoryId}`)
  tab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
}

const toggleQuestion = (questionId: string) => {
  const newSet = new Set(openQuestionIds.value)
  if (newSet.has(questionId)) {
    newSet.delete(questionId)
  } else {
    newSet.add(questionId)
  }
  openQuestionIds.value = newSet
}

// --- Desktop Swipe, Inertia & Keyboard Controls ---
const startDrag = (e: MouseEvent) => {
  isDragging = true
  if (!tabsContainer.value) return
  
  // Cancel any ongoing momentum from a previous swipe
  if (momentumID) cancelAnimationFrame(momentumID)

  startX = e.pageX - tabsContainer.value.offsetLeft
  scrollLeft = tabsContainer.value.scrollLeft
  lastX = e.pageX
  lastTime = performance.now()
  velocity = 0
}

const onDrag = (e: MouseEvent) => {
  if (!isDragging || !tabsContainer.value) return
  e.preventDefault()
  
  const currentX = e.pageX
  const x = currentX - tabsContainer.value.offsetLeft
  const walk = (x - startX) * 1.5 // 1.5x swipe speed multiplier
  tabsContainer.value.scrollLeft = scrollLeft - walk

  // Calculate precise pixel velocity per frame
  const now = performance.now()
  const dt = now - lastTime
  const dx = currentX - lastX
  
  if (dt > 0) {
    // Negative because dragging left moves the scroll right
    velocity = -(dx / dt) * 16.6 * 1.5 
  }

  lastX = currentX
  lastTime = now
}

const applyMomentum = () => {
  if (!tabsContainer.value) return
  
  // Apply the velocity to the scroll position
  tabsContainer.value.scrollLeft += velocity
  
  // Apply friction (lower number = stops faster, higher number = glides further)
  velocity *= 0.92 
  
  // Continue the loop until the velocity is essentially zero
  if (Math.abs(velocity) > 0.5) {
    momentumID = requestAnimationFrame(applyMomentum)
  }
}

const stopDrag = () => {
  if (!isDragging) return
  isDragging = false
  // Trigger the friction decay loop on release
  momentumID = requestAnimationFrame(applyMomentum)
}

const handleKeydown = (e: KeyboardEvent) => {
  const currentIndex = props.data.categories.findIndex(c => c.id === activeCategoryId.value)
  let nextIndex = currentIndex

  if (e.key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % props.data.categories.length
  } else if (e.key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + props.data.categories.length) % props.data.categories.length
  }

  if (nextIndex !== currentIndex) {
    e.preventDefault()
    const nextCategory = props.data.categories[nextIndex]
    if (nextCategory) {
      toggleCategory(nextCategory.id)
    }
  }
}
</script>

<template>
  <section
    data-theme="light"
    class="text-primary-light w-full py-16 md:py-24"
  >
    <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center px-4 sm:px-6 md:px-8">
      
      <!-- 1. HEADER -->
      <div class="relative w-full flex flex-col items-center text-center mb-10 md:mb-14">
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
          class="text-journey-deep max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. NATIVE SCROLL TABS (with swipe & keyboard controls) -->
      <div 
        v-motion-fade-up 
        :delay="300"
        class="w-full relative z-20 mb-8 md:mb-12"
      >
        <div 
          ref="tabsContainer"
          class="flex overflow-x-auto hide-scrollbar gap-3 sm:gap-4 w-full cursor-grab active:cursor-grabbing py-4 focus:outline-none scroll-smooth-disabled"
          tabindex="0"
          aria-label="FAQ Categories"
          @mousedown="startDrag"
          @mousemove="onDrag"
          @mouseup="stopDrag"
          @mouseleave="stopDrag"
          @keydown="handleKeydown"
        >
          <button
            v-for="category in data.categories"
            :key="category.id"
            :id="`tab-${category.id}`"
            @click="toggleCategory(category.id)"
            class="shrink-0 snap-start px-5 sm:px-6 py-2.5 sm:py-3 rounded-md section-subparagraph select-none tracking-wide font-semibold uppercase transition-all duration-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-intention-blue cursor-pointer"
            :class="[
              activeCategoryId === category.id
                ? 'bg-intention-blue text-surface-light border-intention-blue shadow-sm'
                : 'bg-transparent text-intention-blue border-intention-blue/30 hover:border-intention-blue hover:bg-intention-blue/5 active:border-intention-blue active:bg-intention-blue/5'
            ]"
          >
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- 3. ZERO-CLS ACCORDION LIST -->
      <div 
        v-motion-fade-up 
        :delay="400"
        class="w-full flex flex-col gap-3 sm:gap-4 max-w-5xl mx-auto"
      >
        <div
          v-for="(faq, index) in filteredFaqs"
          v-motion-fade-up 
          :key="faq.id"
          class="flex flex-col bg-soft-cream/30 border border-journey-deep/10 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
        >
          <!-- Accordion Header Button -->
          <button
            @click="toggleQuestion(faq.id)"
            class="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left focus:outline-none focus-visible:bg-surface-medium transition-colors group cursor-pointer"
            :aria-expanded="openQuestionIds.has(faq.id)"
            :aria-controls="`faq-answer-${faq.id}`"
          >
            <!-- Left: Number & Question -->
            <div class="flex items-center gap-4 sm:gap-5 md:gap-6 pr-4">
              <!-- Number Circle -->
              <div class="shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-darker-gold text-soft-cream text-[11px] md:text-[12px] font-bold tracking-widest transition-transform group-active:scale-95">
                {{ String(index + 1).padStart(2, '0') }}
              </div>
              
              <!-- Question Typography -->
              <h3 class="hero-paragraph font-semibold text-journey-deep mb-0 transition-colors duration-300 group-hover:text-intention-blue group-active:text-intention-blue">
                {{ faq.question }}
              </h3>
            </div>

            <!-- Right: Plus/Minus Toggle Circle -->
            <div class="shrink-0 flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-soft-cream/80 text-darker-gold transition-transform duration-500 ease-editorial shadow-xs"
                 :class="openQuestionIds.has(faq.id) ? 'rotate-135 bg-soft-cream' : 'rotate-0'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 md:w-5 md:h-5">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </div>
          </button>

          <!-- Accordion Answer (Native CSS Grid Animation for 0-CLS) -->
          <div
            :id="`faq-answer-${faq.id}`"
            class="grid transition-all duration-500 ease-editorial"
            :class="openQuestionIds.has(faq.id) ? 'grid-rows-[1fr] opacity-100 pt-5' : 'grid-rows-[0fr] opacity-0'"
          >
            <div class="overflow-hidden">
              <!-- Padding dynamically aligns the text block with the question text above -->
              <div class="flex flex-col gap-4 pb-5 md:pb-6 pl-6 md:pl-8 pr-6 md:pr-8">
                
                <!-- Dynamic Content Renderer (Paragraphs & Lists) -->
                <template v-for="(block, bIdx) in faq.answer" :key="`${faq.id}-block-${bIdx}`">
                  
                  <p v-if="block.type === 'paragraph'" class="section-paragraph text-secondary-light/90">
                    {{ block.text }}
                  </p>
                  
                  <ul v-else-if="block.type === 'unorderedList'" class="list-disc pl-5 flex flex-col gap-2">
                    <li v-for="(item, iIdx) in block.items" :key="`ul-${iIdx}`" class="section-paragraph text-secondary-light/90">
                      {{ item }}
                    </li>
                  </ul>
                  
                  <ol v-else-if="block.type === 'orderedList'" class="list-decimal pl-5 flex flex-col gap-2">
                    <li v-for="(item, iIdx) in block.items" :key="`ol-${iIdx}`" class="section-paragraph text-secondary-light/90">
                      {{ item }}
                    </li>
                  </ol>

                </template>

              </div>
            </div>
          </div>
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
</style>
<!-- ~/app/components/HomeTestimonials.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface TestimonialCategory {
  name: string
  colorVar: string 
}

export interface TestimonialItem {
  id: number
  categoryId: string
  name: string
  designation: string
  quote: string
  avatar: string
  image: string
  alt: string
  ctaLabel: string
  ctaUrl: string
}

export interface HomeTestimonialsConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  categories: Record<string, TestimonialCategory>
  items: TestimonialItem[]
  bottomQuote: string
  bottomCta: {
    label: string
    to: string
  }
}

const props = defineProps<{
  data: HomeTestimonialsConfig
}>()

const getCategory = (id: string): TestimonialCategory => {
  return props.data.categories[id] || { name: 'Unknown', colorVar: 'var(--color-journey-deep)' }
}

const scrollContainer = ref<HTMLElement | null>(null)
let animationFrameId: number | null = null
let intersectionObserver: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null

// --- Physics State ---
let isPressing = false
let isDragging = false
let startX = 0
let scrollLeftStart = 0
let lastClientX = 0
let lastTime = 0
let velocity = 1
const autoScrollSpeed = 1

// --- Main Thread Protections ---
let singleSetWidth = 0 
let isVisible = false

const displayItems = [...props.data.items, ...props.data.items, ...props.data.items]

// Loop using cached width (Zero Layout Thrashing)
const checkLoop = () => {
  if (!scrollContainer.value || singleSetWidth === 0) return
  
  if (scrollContainer.value.scrollLeft >= singleSetWidth * 2) {
    scrollContainer.value.scrollLeft -= singleSetWidth
  } else if (scrollContainer.value.scrollLeft <= 0) {
    scrollContainer.value.scrollLeft += singleSetWidth
  }
}

const scrollStep = () => {
  if (!scrollContainer.value || !isVisible) return // Yield main thread completely when off-screen

  if (!isPressing && !isDragging) {
    if (Math.abs(velocity - autoScrollSpeed) > 0.1) {
      velocity = velocity * 0.95 + autoScrollSpeed * 0.05
    } else {
      velocity = autoScrollSpeed
    }
    scrollContainer.value.scrollLeft += velocity
  }

  checkLoop()
  animationFrameId = requestAnimationFrame(scrollStep)
}

const onMouseDown = (e: MouseEvent) => {
  if (!scrollContainer.value) return
  isPressing = true
  isDragging = true
  startX = e.pageX - scrollContainer.value.offsetLeft
  scrollLeftStart = scrollContainer.value.scrollLeft
  lastClientX = e.pageX
  lastTime = performance.now()
  velocity = 0 
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging || !scrollContainer.value) return
  e.preventDefault() 
  
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX)
  scrollContainer.value.scrollLeft = scrollLeftStart - walk

  const now = performance.now()
  const dt = now - lastTime
  const dx = e.pageX - lastClientX
  if (dt > 0) {
    velocity = -(dx / dt) * 16.6 
  }
  
  lastClientX = e.pageX
  lastTime = now
}

const onMouseUpOrLeave = () => {
  isPressing = false
  isDragging = false
}

const onTouchStart = () => {
  isPressing = true
  velocity = 0 
}

const onTouchEnd = () => {
  isPressing = false
}

let wheelTimeout: ReturnType<typeof setTimeout>
const onWheel = () => {
  isPressing = true
  clearTimeout(wheelTimeout)
  wheelTimeout = setTimeout(() => {
    isPressing = false
    velocity = autoScrollSpeed
  }, 150)
}

onMounted(() => {
  // Defer heavy DOM measurements until browser is idle
  requestAnimationFrame(() => {
    if (!scrollContainer.value) return

    // Safely recalculate layout metric on window resize
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (scrollContainer.value) {
          singleSetWidth = scrollContainer.value.scrollWidth / 3
        }
      })
      resizeObserver.observe(scrollContainer.value)
    }

    // Set initial position
    singleSetWidth = scrollContainer.value.scrollWidth / 3
    scrollContainer.value.scrollLeft = singleSetWidth

    // Only run the 60fps loop when the user is actively looking at the section
    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver((entries) => {
        isVisible = entries[0]?.isIntersecting || false
        if (isVisible) {
          if (animationFrameId) cancelAnimationFrame(animationFrameId)
          animationFrameId = requestAnimationFrame(scrollStep)
        }
      }, { rootMargin: '100px' })
      intersectionObserver.observe(scrollContainer.value)
    } else {
      isVisible = true
      animationFrameId = requestAnimationFrame(scrollStep)
    }
  })
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  clearTimeout(wheelTimeout)
  intersectionObserver?.disconnect()
  resizeObserver?.disconnect()
})
</script>

<template>
  <section
    data-theme="light"
    class="text-primary-light overflow-hidden section-wrapper px-0"
  >
    <div class="relative z-10 w-full max-w-full flex flex-col items-center">
      
      <!-- 1. HEADER (No blur, strict utilities) -->
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
          class="text-journey-deep/90 max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. NATIVE INFINITE CAROUSEL (Blur Slide Fade In, Swipable, Drag Momentum) -->
      <div 
        v-motion
        :initial="{ opacity: 0, filter: 'blur(5px)', y: 30 }"
        :visible-once="{ opacity: 1, filter: 'blur(0px)', y: 0, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 300 } }"
        class="w-full relative z-20 mb-10 md:mb-12 lg:mb-15 will-change-transform"
      >
        <div
          ref="scrollContainer"
          tabindex="0"
          class="flex overflow-x-auto hide-scrollbar gap-4 sm:gap-6 px-4 sm:px-6 w-full cursor-default scroll-smooth-disabled outline-none"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUpOrLeave"
          @mouseleave="onMouseUpOrLeave"
          @touchstart="onTouchStart"
          @touchend="onTouchEnd"
          @wheel="onWheel"
        >
          <div
            v-for="(item, idx) in displayItems"
            :key="`testi-${idx}`"
            class="relative shrink-0 w-[85vw] sm:w-lg lg:w-160 min-h-96 rounded-2xl flex flex-col justify-between p-6 md:p-8 transition-transform duration-500 border bg-surface-medium select-none cursor-default"
            :style="{ 
              '--theme-color': getCategory(item.categoryId).colorVar,
              backgroundColor: 'color-mix(in srgb, var(--theme-color) 6%, transparent)',
              borderColor: 'color-mix(in srgb, var(--theme-color) 25%, transparent)'
            }"
          >
            <!-- ==========================================
            BACKGROUND IMAGE & GRADIENT TINT
            ========================================== -->
            <div class="absolute inset-0 z-0 pointer-events-none rounded-2xl opacity-15 select-none">
              <!-- Bg Image -->
              <img 
                :src="item.image" 
                :alt="item.alt || 'South Indian Tourism'" 
                width="1440"
                height="960"
                class="w-full h-full object-cover rounded-2xl object-center"
                loading="lazy" 
                decoding="async"
                fetchpriority="low"
              />
              <!-- Radial Gradient Overlay Tint -->
              <!-- <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-intention-deep)_0%,var(--color-journey-deep)_100%)] opacity-5"></div> -->
            </div>

            <!-- Giant Watermark Quote -->
            <!-- <span 
              class="absolute top-1/2 md:top-3/5 left-15 -translate-y-1/2 text-[300px] md:text-[400px] font-quote leading-none pointer-events-none select-none z-0"
              style="color: color-mix(in srgb, var(--theme-color) 12%, transparent);"
            >
              &#8220;
            </span> -->

            <!-- Top: Badge & Quote -->
            <div class="relative z-10 flex flex-col items-start gap-5 mt-2 sm:gap-6 mb-8">
              <!-- Category Badge -->
              <span 
                class="card-tag text-white px-3 pb-0.75 pt-1.5 rounded-sm shadow-xs"
                style="background-color: var(--theme-color);"
              >
                {{ getCategory(item.categoryId).name }}
              </span>

              <blockquote class="font-quote text-[19px] xs:text-[20px] sm:text-[21px] md:text-[22px] lg:text-[23px] leading-relaxed text-primary-light indent-4 sm:indent-6 line-clamp-5">
                "{{ item.quote }}"
              </blockquote>
            </div>

            <!-- Bottom: Author & Action -->
            <div class="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-4 pt-6 md:pt-8 border-t" style="border-color: color-mix(in srgb, var(--theme-color) 25%, transparent); margin-top: auto;">
            
            <!-- Author Profile (Aligns left on mobile) -->
            <div class="flex items-center gap-3 sm:gap-4 self-start sm:self-auto w-full sm:w-auto">
                <div 
                class="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border shrink-0 bg-surface-light p-0.5"
                style="border-color: var(--theme-color);"
                >
                <img 
                    :src="item.avatar" 
                    :alt="`Photo of ${item.name}`"
                    width="144"
                    height="144"
                    class="w-full h-full object-cover rounded-full pointer-events-none select-none" 
                    loading="lazy"
                />
                </div>
                <div class="flex flex-col min-w-0 pr-2">
                    <div class="testimonial-author truncate">
                        {{ item.name }}
                    </div>
                    <span class="card-paragraph text-secondary-light/80 mt-0.5 line-clamp-1">
                        {{ item.designation }}
                    </span>
                </div>
            </div>

            <!-- Bespoke Square Action Button (Aligns right on mobile) -->
            <NuxtLink :to="item.ctaUrl" class="group shrink-0 cursor-pointer self-end sm:self-auto mt-1 sm:mt-0">
                <div 
                class="flex items-center justify-center px-3 sm:px-4 h-10 sm:h-11 rounded-sm text-[9px] 2xs:text-[10px] md:text-[11px] font-uppercase tracking-widest text-white uppercase transition-all duration-300 gap-2 active:scale-96 shadow-sm group-hover:brightness-110 group-active:brightness-110"
                style="background-color: var(--theme-color);"
                >
                <span class="pt-0.5 leading-none">{{ item.ctaLabel }}</span> 
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                </svg>
                </div>
            </NuxtLink>

            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Quote -->
      <div 
        v-motion-fade-up
        class="flex flex-col items-center text-center px-4 w-full mb-8 md:mb-10"
      >
        <p class="px-4 lg:max-w-3xl xl:max-w-4xl text-darker-gold section-quote">
          {{ data.bottomQuote }}
        </p>
      </div>

      <!-- 3. BOTTOM CENTERED CTA BUTTON -->
      <div
        v-motion-fade-up
        :delay="100"
        class="flex justify-center w-full will-change-transform"
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
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome/Safari/Webkit */
}
.scroll-smooth-disabled {
  /* Prevents native CSS smooth scrolling from fighting the JS momentum engine */
  scroll-behavior: auto !important; 
}
</style>
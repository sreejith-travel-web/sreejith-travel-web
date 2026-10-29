<!-- ~/app/components/HomeItinerarySection.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import StackedFanSlider from '~/components/StackedFanSlider.vue'
import CtaButton from '~/components/CtaButton.vue'
import type { StackedFanSliderConfig } from '~/components/StackedFanSlider.vue'

const signatureIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" /></svg>`;
const collaboratedIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v5"></path><path d="M12 17v5"></path><path d="M2 12h5"></path><path d="M17 12h5"></path><path d="M5.8 5.8l2.1 2.1"></path><path d="M16.1 16.1l2.1 2.1"></path><path d="M18.2 5.8l-2.1 2.1"></path><path d="M7.9 16.1l-2.1 2.1"></path><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"></circle></svg>`;
const featuredStarSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>`;

const pageData = {
    signature: {
    eyebrow: 'SIGNATURE EXPERIENCES',
    titleLine1: 'HANDCRAFTED. IMMERSIVE.',
    titleLine2Cursive: 'Unforgettable.',
    subtitle: 'BESPOKE LUXURY TRAVEL EXPERIENCES IN SOUTH INDIA',
    description: 'Thoughtfully crafted – influenced by its people, culture, landscapes, and stories. Each experience listed here is an idea and a source of inspiration designed to be personalised, refined, and tailored around you.',
    bottomQuote: 'Whether you choose one as it is or use it as a starting point, every journey can be reimagined to match your interests, pace, and travel style.',
    ctaLabel: 'EXPLORE EXPERIENCES',
    ctaTo: '/itineraries',
    slider: {
      infinite: true,
      initialIndex: 0,
      autoplay: false,
      autoplayIntervalMs: 5500,
      enableHoverGap: true,
      showCardOverlay: true,
      aspectRatio: '2 / 3',
      imageWidth: 400,
      imageHeight: 600,
      typeIcon: signatureIconSVG, 
      featuredIcon: featuredStarSVG,
      slides: [
        {
          id: 'exp-1',
          image: '/images/itineraries/dummy1.webp',
          alt: 'Theyyam ritual performance in North Kerala',
          eyebrow: 'Kerala',
          title: 'Cultural Immersions',
          tags: ['People', 'Traditions', 'Stories'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-2',
          image: '/images/itineraries/dummy2.webp',
          alt: 'Misty tea estates and mountain trails in Munnar',
          eyebrow: 'Munnar & Beyond',
          title: 'Landscapes & Retreats',
          tags: ['Nature', 'Wellness', 'Slow Travel'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-3',
          image: '/images/itineraries/dummy3.webp',
          alt: 'Traditional houseboat gliding across tranquil backwaters at sunset',
          eyebrow: 'Backwaters',
          title: 'Rivers & Life',
          tags: ['Water', 'Villages', 'Local Life'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-4',
          image: '/images/itineraries/dummy4.webp',
          alt: 'Ancient Dravidian temple architecture and stone pillars',
          eyebrow: 'Tamil Nadu',
          title: 'Heritage Trails',
          tags: ['Temples', 'History', 'Living Culture'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-5',
          image: '/images/itineraries/dummy5.webp',
          alt: 'Authentic South Indian feast served on a fresh banana leaf',
          eyebrow: 'South India',
          title: 'Culinary Journeys',
          tags: ['Flavours', 'People', 'Traditions'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-6',
          image: '/images/itineraries/dummy6.webp',
          alt: 'Palm-fringed rocky coastline at golden hour',
          eyebrow: 'Kerala Coast',
          title: 'Coastal Escapes',
          tags: ['Beaches', 'Islands', 'Hidden Gems'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-7',
          image: '/images/itineraries/dummy7.webp',
          alt: 'Wild elephant walking through a lush forest landscape',
          eyebrow: 'Western Ghats',
          title: 'Into the Wild',
          tags: ['Wildlife', 'Forests', 'Conservation'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-8',
          image: '/images/itineraries/dummy8.webp',
          alt: 'Local artisan working by hand inside a traditional workshop',
          eyebrow: 'Craft Villages',
          title: 'Hands & Heritage',
          tags: ['Artisans', 'Craft', 'Communities'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-9',
          image: '/images/itineraries/dummy9.webp',
          alt: 'Hikers following a mountain trail through the Western Ghats',
          eyebrow: 'Highlands',
          title: 'Trails & Treks',
          tags: ['Trekking', 'Mountains', 'Adventure'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-10',
          image: '/images/itineraries/dummy10.webp',
          alt: 'Classical Indian dancer performing in traditional attire',
          eyebrow: 'Tamil Nadu',
          title: 'Rhythm & Ritual',
          tags: ['Dance', 'Music', 'Performance'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-11',
          image: '/images/itineraries/dummy11.webp',
          alt: 'Peaceful heritage retreat surrounded by tropical greenery',
          eyebrow: 'South India',
          title: 'Heritage Stays',
          tags: ['Boutique', 'Architecture', 'Slow Living'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-12',
          image: '/images/itineraries/dummy12.webp',
          alt: 'Fishermen navigating a traditional canoe through quiet village waters',
          eyebrow: 'Village Kerala',
          title: 'Life by the Water',
          tags: ['Communities', 'Backwaters', 'Local Life'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-13',
          image: '/images/itineraries/dummy13.webp',
          alt: 'Traditional wellness treatment in a serene natural setting',
          eyebrow: 'Kerala',
          title: 'Wellness & Renewal',
          tags: ['Ayurveda', 'Wellness', 'Mindfulness'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-14',
          image: '/images/itineraries/dummy14.webp',
          alt: 'Travellers sharing an intimate experience with a local community',
          eyebrow: 'Beyond the Map',
          title: 'Meaningful Encounters in the wildest forests',
          tags: ['People', 'Connection', 'Stories'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        }
      ]
    }
  },

  collaborated: {
    eyebrow: 'COLLABORATED ITINERARIES',
    titleLine1: 'CURATED. AUTHENTIC.',
    titleLine2Cursive: 'Exceptional.',
    subtitle: 'EXCLUSIVE PARTNERSHIP JOURNEYS ACROSS INDIA',
    description: 'Designed in harmony with local experts, master artisans, and renowned historians. These exclusive journeys grant you unprecedented access to protected heritage sites, private estates, and intimate cultural dialogues.',
    bottomQuote: 'Experience India through the eyes of its most passionate custodians, with journeys forged through decades of deep-rooted local relationships.',
    ctaLabel: 'DISCOVER COLLABORATIONS',
    ctaTo: '/itineraries',
    slider: {
      infinite: true,
      initialIndex: 0,
      autoplay: false,
      autoplayIntervalMs: 5500,
      enableHoverGap: true,
      showCardOverlay: true,
      aspectRatio: '2 / 3',
      imageWidth: 400,
      imageHeight: 600,
      typeIcon: collaboratedIconSVG, 
      featuredIcon: featuredStarSVG,
      slides: [
        {
          id: 'exp-1',
          image: '/images/itineraries/dummy1.webp',
          alt: 'Theyyam ritual performance in North Kerala',
          eyebrow: 'Kerala',
          title: 'Cultural Immersions',
          tags: ['People', 'Traditions', 'Stories'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-2',
          image: '/images/itineraries/dummy2.webp',
          alt: 'Misty tea estates and mountain trails in Munnar',
          eyebrow: 'Munnar & Beyond',
          title: 'Landscapes & Retreats',
          tags: ['Nature', 'Wellness', 'Slow Travel'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-3',
          image: '/images/itineraries/dummy3.webp',
          alt: 'Traditional houseboat gliding across tranquil backwaters at sunset',
          eyebrow: 'Backwaters',
          title: 'Rivers & Life',
          tags: ['Water', 'Villages', 'Local Life'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-4',
          image: '/images/itineraries/dummy4.webp',
          alt: 'Ancient Dravidian temple architecture and stone pillars',
          eyebrow: 'Tamil Nadu',
          title: 'Heritage Trails',
          tags: ['Temples', 'History', 'Living Culture'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-5',
          image: '/images/itineraries/dummy5.webp',
          alt: 'Authentic South Indian feast served on a fresh banana leaf',
          eyebrow: 'South India',
          title: 'Culinary Journeys',
          tags: ['Flavours', 'People', 'Traditions'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-6',
          image: '/images/itineraries/dummy6.webp',
          alt: 'Palm-fringed rocky coastline at golden hour',
          eyebrow: 'Kerala Coast',
          title: 'Coastal Escapes',
          tags: ['Beaches', 'Islands', 'Hidden Gems'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-7',
          image: '/images/itineraries/dummy7.webp',
          alt: 'Wild elephant walking through a lush forest landscape',
          eyebrow: 'Western Ghats',
          title: 'Into the Wild',
          tags: ['Wildlife', 'Forests', 'Conservation'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-8',
          image: '/images/itineraries/dummy8.webp',
          alt: 'Local artisan working by hand inside a traditional workshop',
          eyebrow: 'Craft Villages',
          title: 'Hands & Heritage',
          tags: ['Artisans', 'Craft', 'Communities'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-9',
          image: '/images/itineraries/dummy9.webp',
          alt: 'Hikers following a mountain trail through the Western Ghats',
          eyebrow: 'Highlands',
          title: 'Trails & Treks',
          tags: ['Trekking', 'Mountains', 'Adventure'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-10',
          image: '/images/itineraries/dummy10.webp',
          alt: 'Classical Indian dancer performing in traditional attire',
          eyebrow: 'Tamil Nadu',
          title: 'Rhythm & Ritual',
          tags: ['Dance', 'Music', 'Performance'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-11',
          image: '/images/itineraries/dummy11.webp',
          alt: 'Peaceful heritage retreat surrounded by tropical greenery',
          eyebrow: 'South India',
          title: 'Heritage Stays',
          tags: ['Boutique', 'Architecture', 'Slow Living'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-12',
          image: '/images/itineraries/dummy12.webp',
          alt: 'Fishermen navigating a traditional canoe through quiet village waters',
          eyebrow: 'Village Kerala',
          title: 'Life by the Water',
          tags: ['Communities', 'Backwaters', 'Local Life'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-13',
          image: '/images/itineraries/dummy13.webp',
          alt: 'Traditional wellness treatment in a serene natural setting',
          eyebrow: 'Kerala',
          title: 'Wellness & Renewal',
          tags: ['Ayurveda', 'Wellness', 'Mindfulness'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        },
        {
          id: 'exp-14',
          image: '/images/itineraries/dummy14.webp',
          alt: 'Travellers sharing an intimate experience with a local community',
          eyebrow: 'Beyond the Map',
          title: 'Meaningful Encounters',
          tags: ['People', 'Connection', 'Stories'],
          to: '/itineraries/',
          days: '7 DAYS',
          isFeatured: true
        }
      ]
    }
  },
}

export interface ItinerarySectionConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  subtitle: string
  description: string
  bottomQuote: string
  ctaLabel: string
  ctaTo: string
  slider: StackedFanSliderConfig
}

const props = defineProps<{
  data: ItinerarySectionConfig
}>()

// Component Ref to control the slider externally via dots
const sliderRef = ref<InstanceType<typeof StackedFanSlider> | null>(null)

// Track active slide
const activeIndex = ref(props.data.slider.initialIndex || 0)
const totalSlides = computed(() => props.data.slider.slides?.length || 0)

// Update state when the slider engine emits a change
const handleSlideChange = (index: number) => {
  activeIndex.value = index
}

// --- Instagram-Style Dot Logic ---
const MAX_NORMAL_DOTS = 5
const DOT_SIZE = 28 // px
const GAP_SIZE = 8 // px
const STRIDE = DOT_SIZE + GAP_SIZE // 14px

// Calculates which dot sits at the far left of the 5-dot "normal" window
const windowStart = computed(() => {
  const n = totalSlides.value
  if (n <= MAX_NORMAL_DOTS) return 0
  if (activeIndex.value < 2) return 0 // Near start
  if (activeIndex.value > n - 3) return n - MAX_NORMAL_DOTS // Near end
  return activeIndex.value - 2 // Keep active dot perfectly centered
})

// Calculates the physical track translation to keep the 5 normal dots locked in the center
const trackTranslateX = computed(() => {
  if (totalSlides.value <= MAX_NORMAL_DOTS) return 0
  // 14px offset perfectly centers the 5-dot window inside the 7-dot wrapper
  return STRIDE - (windowStart.value * STRIDE)
})

// Calculates the exact wrapper width needed
const wrapperWidth = computed(() => {
  const n = totalSlides.value
  if (n <= MAX_NORMAL_DOTS) return (n * DOT_SIZE) + ((n - 1) * GAP_SIZE)
  return (7 * DOT_SIZE) + (6 * GAP_SIZE) // Fixed width for exactly 7 dots (90px)
})

// Returns the dynamic scale and opacity for each dot based on its position in the window
const getDotStyle = (index: number) => {
  if (index === activeIndex.value) {
    return 'bg-journey-deep opacity-100 scale-100'
  }
  
  const ws = windowStart.value
  if (index >= ws && index < ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-40 scale-100 hover:opacity-70' // Normal dots
  }
  if (index === ws - 1 || index === ws + MAX_NORMAL_DOTS) {
    return 'bg-journey-deep opacity-20 scale-[0.6] hover:opacity-50' // Translucent edge dots
  }
  
  return 'bg-journey-deep opacity-0 scale-0 pointer-events-none' // Hidden outer dots
}

const goToSlide = (index: number) => {
  sliderRef.value?.goToRealIndex(index)
}
</script>

<template>
  <section 
    data-theme="light"
    class="text-primary-light overflow-hidden section-wrapper"
  >
    <div class="relative w-full max-w-[1640px] flex flex-col items-center">

      <!-- 1. EDITORIAL HEADER -->
      <div class="relative z-10 w-full max-w-3xl flex flex-col items-center text-center mb-6 md:mb-8">
        
        <!-- Eyebrow with flanking lines -->
        <div 
          v-motion-fade-up
          class="eyebrow-wrapper"
        >
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <!-- Main Title -->
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

        <!-- Subtitle & Description -->
        <div 
          v-motion-fade-up
          :delay="200"
          class="flex flex-col items-center will-change-transform"
        >
          <span class="text-intention-blue/90 section-midsubtitle">
            {{ data.subtitle }}
          </span>
          <p
            class=" text-journey-deep/90 max-w-2xl lg:max-w-3xl px-4 section-paragraph">
            {{ data.description }}
          </p>
        </div>
      </div>

      <!-- 2. THE SLIDER ENGINE -->
      <div 
        v-motion
        :initial="{ opacity: 0, filter: 'blur(5px)', scale: 0.98 }"
        :visible-once="{ opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 800, ease: [0.22, 1, 0.36, 1], delay: 300 } }"
        class="relative z-10 w-full mb-6 md:mb-8 will-change-[transform,opacity]"
      >
        <ClientOnly>
          <StackedFanSlider 
            ref="sliderRef"
            :data="data.slider" 
            :aria-label="data.eyebrow"
            @change="handleSlideChange" 
          />

          <!-- Fallback matching the center card dimensions exactly (0.000 CLS) -->
          <template #fallback>
            <div 
              class="relative w-full flex items-center justify-center py-4 sm:py-6" 
              aria-hidden="true"
            >
              <div 
                :style="{ aspectRatio: data.slider.aspectRatio || '2 / 3' }"
                class="w-[72vw] 2xs:w-[68vw] xs:w-[64vw] sm:w-[56vw] md:w-[40vw] lg:w-[32vw] xl:w-[26vw] 2xl:w-[22vw] max-w-88 min-w-36 rounded-xl sm:rounded-2xl bg-journey-deep/5"
              />
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- 3. FOOTER CONTENT (Pagination, Quote, CTA) -->
      <div class="relative z-10 w-full flex flex-col items-center text-center">
        
        <!-- Instagram-Style Dynamic Dot Pagination -->
        <div 
          v-if="totalSlides > 1"
          v-motion-micro-up
          :delay="100"      
          class="flex items-center justify-center h-4 mb-10 will-change-transform"
        > 
          <!-- Fixed Viewport Window -->
          <div class="relative overflow-hidden" :style="{ width: `${wrapperWidth}px`, height: '16px' }">
            <!-- Sliding Track -->
            <div 
              class="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 transition-transform duration-300 ease-out will-change-transform"
              :style="{ transform: `translate3d(${trackTranslateX}px, -50%, 0)` }"
            >
              <button
                v-for="index in totalSlides"
                :key="index"
                :aria-label="`Go to slide ${index}`"
                :class="[
                  'rounded-full w-7 h-2 transition-all duration-300 ease-out cursor-pointer',
                  getDotStyle(index - 1)
                ]"
                @click="goToSlide(index - 1)"
              />
            </div>
          </div>
        </div>

        <!-- Bottom Quote -->
        <p 
          v-motion-fade-up         
          class="text-darker-gold px-4 mb-10 lg:max-w-3xl xl:max-w-4xl section-quote"
        >
          {{ data.bottomQuote }}
        </p>

        <!-- CTA Button -->
        <div
          v-motion-fade-up
          :delay="100"          
          class="will-change-transform"
        >
          <CtaButton 
            :to="data.ctaTo" 
            :label="data.ctaLabel" 
            variant="light" 
          />
        </div>

      </div>
    </div>
  </section>
</template>
<!-- ~/app/components/journal/JournalBannerBlock.vue -->
<script setup lang="ts">
import { computed, useId } from 'vue'
import type {
  JournalBannerType,
  JournalContentBlock
} from '~~/server/utils/journalData'

const props = defineProps<{
  block: JournalContentBlock
}>()

const uid = useId()
const EDITORIAL_EASE: [number, number, number, number] = [0.25, 1, 0.5, 1]

interface BannerPresetConfig {
  eyebrow: string
  title: string
  text: string
  ctaLabel: string
  to: string
  surfaceClass: string
  eyebrowClass: string
  pipClass: string
  buttonClass: string
}

const BANNER_PRESETS: Record<JournalBannerType, BannerPresetConfig> = {
  plan: {
    eyebrow: 'BESPOKE JOURNEY DESIGN',
    title: 'Ready to Shape Your Own South India Story?',
    text: 'Every route is crafted from scratch around your pace, curiosities, and preferred season—guided by years of on-the-ground cultural research.',
    ctaLabel: 'PLAN YOUR JOURNEY',
    to: '/planyourjourney',
    surfaceClass:
      'banner-surface-plan border border-soft-cream/25 hover:border-soft-cream/48 shadow-sm hover:shadow-xl',
    eyebrowClass: 'text-soft-cream',
    pipClass: 'bg-dark-gold shadow-[0_0_8px_rgba(212,163,89,0.75)]',
    buttonClass:
      'border-soft-cream/42 bg-[#0f233c]/55 text-soft-cream group-hover:bg-soft-cream group-hover:border-soft-cream group-hover:text-journey-deep group-hover:shadow-[0_0_26px_rgba(245,229,176,0.3)] group-active:bg-soft-cream group-active:text-journey-deep'
  },
  itineraries: {
    eyebrow: 'CURATED ROUTES & EXPEDITIONS',
    title: 'Explore Journeys Inspired by Living Landscapes',
    text: 'Browse our Signature and Collaborated itineraries weaving together craft guilds, estuary waterways, and quiet heritage stays.',
    ctaLabel: 'EXPLORE ITINERARIES',
    to: '/itineraries',
    surfaceClass:
      'banner-surface-itineraries border border-soft-blue/28 hover:border-soft-blue/50 shadow-sm hover:shadow-xl',
    eyebrowClass: 'text-soft-blue',
    pipClass: 'bg-soft-blue shadow-[0_0_8px_rgba(186,220,255,0.7)]',
    buttonClass:
      'border-soft-blue/42 bg-[#0b2735]/55 text-soft-blue group-hover:bg-soft-blue group-hover:border-soft-blue group-hover:text-journey-deep group-hover:shadow-[0_0_26px_rgba(186,220,255,0.28)] group-active:bg-soft-blue group-active:text-journey-deep'
  },
  partner: {
    eyebrow: 'TRADE & INSTITUTIONAL COLLABORATIONS',
    title: 'Co-Create Meaningful Regional Journeys With Us',
    text: 'We partner with discerning travel designers, DMCs, and cultural institutions seeking grounded South India expertise.',
    ctaLabel: 'PARTNER WITH US',
    to: '/network',
    surfaceClass:
      'banner-surface-partner border border-[#f7dfc2]/26 hover:border-[#f7dfc2]/50 shadow-sm hover:shadow-xl',
    eyebrowClass: 'text-[#f7dfc2]',
    pipClass: 'bg-[#e59a66] shadow-[0_0_8px_rgba(229,154,102,0.75)]',
    buttonClass:
      'border-[#f7dfc2]/42 bg-[#1a1f38]/55 text-[#f7dfc2] group-hover:bg-[#f7dfc2] group-hover:border-[#f7dfc2] group-hover:text-[#1b2038] group-hover:shadow-[0_0_26px_rgba(247,223,194,0.3)] group-active:bg-[#f7dfc2] group-active:text-[#1b2038]'
  },
  impact: {
    eyebrow: 'REGENERATIVE STEWARDSHIP',
    title: 'See How Thoughtful Travel Sustains Local Guilds',
    text: 'Discover how direct atelier honorariums, unhurried pacing, and conservation buffers keep regional heritage thriving.',
    ctaLabel: 'OUR IMPACT',
    to: '/impact',
    surfaceClass:
      'banner-surface-impact border border-[#d9f2df]/26 hover:border-[#d9f2df]/50 shadow-sm hover:shadow-xl',
    eyebrowClass: 'text-[#d9f2df]',
    pipClass: 'bg-[#9be1b0] shadow-[0_0_8px_rgba(155,225,176,0.72)]',
    buttonClass:
      'border-[#d9f2df]/42 bg-[#0d2b22]/55 text-[#d9f2df] group-hover:bg-[#e3f5e7] group-hover:border-[#e3f5e7] group-hover:text-[#0f2e24] group-hover:shadow-[0_0_26px_rgba(217,242,223,0.28)] group-active:bg-[#e3f5e7] group-active:text-[#0f2e24]'
  },
  about: {
    eyebrow: 'PHILOSOPHY & FIELD PRACTICE',
    title: 'Meet the Research & Ethos Behind Every Route',
    text: 'Learn how years of documenting folk traditions, architecture, and rural livelihoods shape the way we design travel.',
    ctaLabel: 'MY STORY',
    to: '/about',
    surfaceClass:
      'banner-surface-about border border-[#faeccf]/26 hover:border-[#faeccf]/50 shadow-sm hover:shadow-xl',
    eyebrowClass: 'text-[#faeccf]',
    pipClass: 'bg-[#dfb068] shadow-[0_0_8px_rgba(223,176,104,0.75)]',
    buttonClass:
      'border-[#faeccf]/42 bg-[#1f1712]/55 text-[#faeccf] group-hover:bg-[#faeccf] group-hover:border-[#faeccf] group-hover:text-[#261d17] group-hover:shadow-[0_0_26px_rgba(250,236,207,0.28)] group-active:bg-[#faeccf] group-active:text-[#261d17]'
  },
  contact: {
    eyebrow: 'START A CONVERSATION',
    title: 'Have a Question or a Custom Route in Mind?',
    text: 'Write to our studio directly—whether you are planning a private journey, research dispatch, or creative collaboration.',
    ctaLabel: 'GET IN TOUCH',
    to: '/contact',
    surfaceClass:
      'banner-surface-contact border border-[#fce8d5]/26 hover:border-[#fce8d5]/50 shadow-sm hover:shadow-xl',
    eyebrowClass: 'text-[#fce8d5]',
    pipClass: 'bg-[#f0a875] shadow-[0_0_8px_rgba(240,168,117,0.75)]',
    buttonClass:
      'border-[#fce8d5]/42 bg-[#18202b]/55 text-[#fce8d5] group-hover:bg-[#fce8d5] group-hover:border-[#fce8d5] group-hover:text-[#1e2633] group-hover:shadow-[0_0_26px_rgba(252,232,213,0.28)] group-active:bg-[#fce8d5] group-active:text-[#1e2633]'
  }
}

const resolvedBannerType = computed<JournalBannerType>(() => {
  if (props.block.bannerType && props.block.bannerType in BANNER_PRESETS) {
    return props.block.bannerType
  }
  const rawType = (props.block.type || '').replace(/^banner-/, '') as JournalBannerType
  if (rawType in BANNER_PRESETS) {
    return rawType
  }
  return 'plan'
})

const activePreset = computed(() => BANNER_PRESETS[resolvedBannerType.value])

const resolvedEyebrow = computed(() =>
  props.block.eyebrow !== undefined
    ? props.block.eyebrow.trim()
    : activePreset.value.eyebrow
)

const resolvedTitle = computed(
  () => props.block.title?.trim() || activePreset.value.title
)

const resolvedText = computed(() =>
  props.block.text !== undefined
    ? props.block.text.trim()
    : activePreset.value.text
)

const resolvedCtaLabel = computed(
  () => props.block.ctaLabel?.trim() || activePreset.value.ctaLabel
)

const resolvedTo = computed(
  () => props.block.to?.trim() || activePreset.value.to
)

const isExternalLink = computed(() => /^https?:\/\//i.test(resolvedTo.value))
const patternId = computed(() => `jrn-banner-pat-${resolvedBannerType.value}-${uid}`)
const sunClipId = computed(() => `jrn-banner-sun-clip-${uid}`)
</script>

<template>
  <NuxtLink
    v-motion
    :initial="{ opacity: 0, y: 20 }"
    :visible-once="{
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        duration: 560,
        ease: EDITORIAL_EASE
      }
    }"
    :id="block.id"
    :to="resolvedTo"
    :target="isExternalLink ? '_blank' : undefined"
    :rel="isExternalLink ? 'noopener noreferrer' : undefined"
    draggable="false"
    :class="[
      'group relative w-full my-4 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:px-9 md:py-8 lg:px-10 lg:py-9 overflow-hidden block text-left transition-all duration-500 outline-none focus-visible:ring-2 focus-visible:ring-action-blue',
      { 'scroll-mt-36': Boolean(block.id) },
      activePreset.surfaceClass
    ]"
  >
    <!-- ============================================================
         WORLD 1 ARTWORK: PLAN YOUR JOURNEY
         (Handwoven Linen Texture + Western Ghats Dusk Ridge, Homestead & Trail)
         ============================================================ -->
    <template v-if="resolvedBannerType === 'plan'">
      <!-- Subtle Tactile Linen Weave Pattern -->
      <svg
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-0 w-full h-full banner-pattern-mask text-soft-cream"
      >
        <defs>
          <pattern
            :id="patternId"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 20 H 15 M 25 20 H 40 M 20 0 V 15 M 20 25 V 40"
              fill="none"
              stroke="currentColor"
              stroke-width="0.65"
              stroke-opacity="0.065"
              stroke-linecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
      </svg>

      <!-- Horizon-Anchored Western Ghats Ridges, Setting Sun, Homestead & Winding Trail -->
      <svg
        viewBox="0 0 420 220"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-72 sm:w-96 md:w-108 opacity-55 sm:opacity-85 md:opacity-100 transition-transform duration-700 ease-editorial group-hover:scale-103 group-hover:-translate-y-0.5"
      >
        <defs>
          <!-- Clips the setting sun cleanly behind the distant mountain ridge -->
          <clipPath :id="sunClipId">
            <path d="M 0 0 L 424 0 L 424 92 C 406 98, 390 110, 366 114 C 324 120, 286 144, 240 156 C 184 170, 130 194, 68 220 L 0 220 Z" />
          </clipPath>
        </defs>

        <!-- Setting Sun Glow & Rim Tucked Behind Ghats Saddle -->
        <g :clip-path="`url(#${sunClipId})`">
          <circle cx="324" cy="134" r="46" fill="#f5e5b0" fill-opacity="0.09" />
          <circle
            cx="324"
            cy="134"
            r="27"
            fill="#f5e5b0"
            fill-opacity="0.16"
            stroke="#f5e5b0"
            stroke-width="1"
            stroke-opacity="0.45"
          />
        </g>

        <!-- Two Distant Dusk Birds High in Sky -->
        <path
          d="M 346 54 Q 350 50 354 54 Q 358 50 362 54"
          stroke="#f5e5b0"
          stroke-width="1"
          stroke-opacity="0.45"
          stroke-linecap="round"
        />
        <path
          d="M 368 46 Q 371 43 374 46 Q 377 43 380 46"
          stroke="#f5e5b0"
          stroke-width="0.9"
          stroke-opacity="0.35"
          stroke-linecap="round"
        />

        <!-- Layer 1: Distant Western Ghats Escarpment -->
        <path
          d="M 68 220 C 130 194, 184 170, 240 156 C 286 144, 324 120, 366 114 C 390 110, 406 98, 424 92 L 424 220 Z"
          fill="#f5e5b0"
          fill-opacity="0.06"
          stroke="#f5e5b0"
          stroke-width="1"
          stroke-opacity="0.3"
        />

        <!-- Layer 2: Mid-Valley Tea & Forest Ridge -->
        <path
          d="M 122 220 C 176 196, 222 174, 276 166 C 328 158, 376 142, 424 132 L 424 220 Z"
          fill="#122742"
          fill-opacity="0.45"
          stroke="#d4a359"
          stroke-width="1.05"
          stroke-opacity="0.44"
        />

        <!-- Vernacular Malabar Sloped-Roof Homestead on Valley Shoulder -->
        <g>
          <!-- Pitched Tile Roof with Gently Upturned Eaves -->
          <path
            d="M 244 159 Q 254 157 263 149 Q 272 157 282 159 Z"
            fill="#f5e5b0"
            fill-opacity="0.18"
            stroke="#f5e5b0"
            stroke-width="1"
            stroke-opacity="0.65"
            stroke-linejoin="round"
          />
          <!-- Veranda Pillars & Stone Plinth -->
          <line x1="252" y1="159" x2="252" y2="166" stroke="#f5e5b0" stroke-width="0.9" stroke-opacity="0.5" />
          <line x1="263" y1="159" x2="263" y2="166" stroke="#f5e5b0" stroke-width="0.9" stroke-opacity="0.5" />
          <line x1="274" y1="159" x2="274" y2="166" stroke="#f5e5b0" stroke-width="0.9" stroke-opacity="0.5" />
          <line x1="247" y1="166" x2="279" y2="166" stroke="#d4a359" stroke-width="1" stroke-opacity="0.55" />
          <!-- Warm Evening Courtyard Lantern Dot -->
          <circle cx="263" cy="162.5" r="1.5" fill="#f5e5b0" fill-opacity="0.92" />
        </g>

        <!-- Layer 3: Foreground Foothill Slope -->
        <path
          d="M 192 220 C 258 198, 336 188, 424 172 L 424 220 Z"
          fill="#f5e5b0"
          fill-opacity="0.05"
          stroke="#d4a359"
          stroke-width="0.95"
          stroke-opacity="0.34"
        />

        <!-- Earthly Winding Valley Footpath Leading Up to Homestead -->
        <path
          d="M 148 220 C 182 200, 228 194, 260 166 L 265 166 C 237 196, 196 203, 168 220 Z"
          fill="#f5e5b0"
          fill-opacity="0.16"
        />
        <path
          d="M 148 220 C 182 200, 228 194, 260 166"
          stroke="#f5e5b0"
          stroke-width="1.05"
          stroke-opacity="0.62"
          stroke-linecap="round"
        />
        <path
          d="M 168 220 C 196 203, 237 196, 265 166"
          stroke="#d4a359"
          stroke-width="0.95"
          stroke-opacity="0.52"
          stroke-linecap="round"
        />
      </svg>
    </template>

    <!-- ============================================================
         WORLD 2 ARTWORK: ITINERARIES
         (Estuary Wave Texture + Kerala Backwaters, Vallam Boat & Palm)
         ============================================================ -->
    <template v-else-if="resolvedBannerType === 'itineraries'">
      <!-- Subtle Flowing Water-Current Wave Pattern -->
      <svg
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-0 w-full h-full banner-pattern-mask text-soft-blue"
      >
        <defs>
          <pattern
            :id="patternId"
            width="64"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 16 Q 16 11 32 16 T 64 16"
              fill="none"
              stroke="currentColor"
              stroke-width="0.65"
              stroke-opacity="0.07"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
      </svg>

      <!-- Horizon-Anchored Backwater Estuary, Gliding Vallam & Far-Right Palm -->
      <svg
        viewBox="0 0 420 220"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-72 sm:w-96 md:w-108 opacity-55 sm:opacity-85 md:opacity-100 transition-transform duration-700 ease-editorial group-hover:scale-103 group-hover:-translate-x-1"
      >
        <!-- Distant Misty Estuary Island Bank -->
        <path
          d="M 90 165 C 148 155, 206 151, 264 157 C 318 162, 370 150, 424 142 L 424 165 L 90 165 Z"
          fill="#badcff"
          fill-opacity="0.09"
          stroke="#badcff"
          stroke-width="0.95"
          stroke-opacity="0.34"
        />

        <!-- Calm Lagoon Horizon & Gentle Water Ripples -->
        <line x1="56" y1="165" x2="424" y2="165" stroke="#badcff" stroke-width="0.8" stroke-opacity="0.22" />
        <path d="M 78 176 Q 128 173 178 176 T 278 176" stroke="#badcff" stroke-width="0.85" stroke-opacity="0.24" stroke-linecap="round" />
        <path d="M 258 185 Q 308 182 358 185" stroke="#badcff" stroke-width="0.85" stroke-opacity="0.22" stroke-linecap="round" />
        <path d="M 104 204 Q 168 201 232 204 T 360 204" stroke="#badcff" stroke-width="0.9" stroke-opacity="0.26" stroke-linecap="round" />

        <!-- Traditional Kerala Vallam (Wooden Country Canoe + Woven Canopy) -->
        <g>
          <!-- Woven Bamboo Kettu Canopy -->
          <path
            d="M 174 184 C 180 171, 212 171, 218 184"
            fill="#badcff"
            fill-opacity="0.14"
            stroke="#f5e5b0"
            stroke-width="1.05"
            stroke-opacity="0.72"
          />
          <line x1="188" y1="174.5" x2="188" y2="184" stroke="#f5e5b0" stroke-width="0.8" stroke-opacity="0.45" />
          <line x1="204" y1="174.5" x2="204" y2="184" stroke="#f5e5b0" stroke-width="0.8" stroke-opacity="0.45" />

          <!-- Upturned Malabar Wooden Hull -->
          <path
            d="M 146 180 Q 158 191 196 191 Q 234 191 246 177 Q 231 184 196 184 Q 161 184 146 180 Z"
            fill="#f5e5b0"
            fill-opacity="0.22"
            stroke="#f5e5b0"
            stroke-width="1.1"
            stroke-opacity="0.82"
            stroke-linejoin="round"
          />

          <!-- Trailing Steering Pole & Sunlit Water Reflections -->
          <line x1="234" y1="183" x2="254" y2="194" stroke="#f5e5b0" stroke-width="0.95" stroke-opacity="0.52" stroke-linecap="round" />
          <line x1="164" y1="195.5" x2="228" y2="195.5" stroke="#f5e5b0" stroke-width="0.9" stroke-opacity="0.42" stroke-linecap="round" />
          <line x1="180" y1="199.5" x2="212" y2="199.5" stroke="#f5e5b0" stroke-width="0.8" stroke-opacity="0.26" stroke-linecap="round" />
        </g>

        <!-- Far-Right Foreground Bank & Arching Coconut Palm (Clear of CTA Button Zone) -->
        <path
          d="M 336 220 C 358 204, 388 196, 424 192 L 424 220 Z"
          fill="#badcff"
          fill-opacity="0.12"
          stroke="#badcff"
          stroke-width="1"
          stroke-opacity="0.38"
        />
        <!-- Slender Curved Trunk Along Right Margin -->
        <path
          d="M 410 195 C 403 152, 397 104, 387 46"
          stroke="#badcff"
          stroke-width="1.6"
          stroke-opacity="0.4"
          stroke-linecap="round"
        />
        <!-- Feathery Palm Crown High Above Button -->
        <path d="M 387 46 C 368 30, 344 26, 324 36" stroke="#badcff" stroke-width="1.15" stroke-opacity="0.46" stroke-linecap="round" />
        <path d="M 387 46 C 366 42, 348 48, 334 60" stroke="#badcff" stroke-width="1.05" stroke-opacity="0.38" stroke-linecap="round" />
        <path d="M 387 46 C 378 26, 390 15, 410 13" stroke="#badcff" stroke-width="1.1" stroke-opacity="0.42" stroke-linecap="round" />
        <path d="M 387 46 C 399 32, 412 30, 424 36" stroke="#badcff" stroke-width="1.1" stroke-opacity="0.42" stroke-linecap="round" />
        <path d="M 387 46 C 401 44, 414 50, 424 60" stroke="#badcff" stroke-width="1" stroke-opacity="0.35" stroke-linecap="round" />
      </svg>
    </template>

    <!-- ============================================================
         WORLD 3 ARTWORK: PARTNER WITH US
         (Kasavu Weave Lattice + Arched Stone Bridge & Padippura Gateway)
         ============================================================ -->
    <template v-else-if="resolvedBannerType === 'partner'">
      <!-- Subtle Kasavu Handloom Warp-and-Weft Lattice Pattern -->
      <svg
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-0 w-full h-full banner-pattern-mask text-[#f7dfc2]"
      >
        <defs>
          <pattern
            :id="patternId"
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 14 H 44 M 0 30 H 44 M 14 0 V 44 M 30 0 V 44"
              fill="none"
              stroke="currentColor"
              stroke-width="0.55"
              stroke-opacity="0.06"
            />
            <rect
              x="12.5"
              y="12.5"
              width="3"
              height="3"
              fill="currentColor"
              fill-opacity="0.1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
      </svg>

      <!-- Horizon-Anchored Heritage Stone Bridge & Pillared Padippura Gateway -->
      <svg
        viewBox="0 0 420 220"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-72 sm:w-96 md:w-108 opacity-55 sm:opacity-85 md:opacity-100 transition-transform duration-700 ease-editorial group-hover:scale-103 group-hover:-translate-y-0.5"
      >
        <!-- Distant Riverbank & Low Deccan Foothills -->
        <path
          d="M 74 220 C 132 198, 196 184, 268 180 C 328 176, 378 164, 424 156 L 424 220 Z"
          fill="#f7dfc2"
          fill-opacity="0.06"
          stroke="#f7dfc2"
          stroke-width="0.95"
          stroke-opacity="0.28"
        />

        <!-- Calm Dusk River Horizon & Shimmer Lines -->
        <line x1="88" y1="194" x2="338" y2="194" stroke="#f7dfc2" stroke-width="0.85" stroke-opacity="0.24" />
        <path d="M 148 201 H 180 M 198 201 H 232 M 248 201 H 276" stroke="#e59a66" stroke-width="0.9" stroke-opacity="0.4" stroke-linecap="round" />
        <path d="M 162 206 H 264" stroke="#f7dfc2" stroke-width="0.8" stroke-opacity="0.22" stroke-linecap="round" />

        <!-- Three-Arch Heritage Laterite Stone Bridge (Symbolizing Partnership) -->
        <g>
          <!-- Gently Cambered Parapet Rail -->
          <path
            d="M 122 175 Q 212 168 302 175"
            stroke="#f7dfc2"
            stroke-width="1.1"
            stroke-opacity="0.72"
            stroke-linecap="round"
          />
          <!-- Bridge Body & Three Catenary Arches -->
          <path
            d="M 126 194 L 126 178 Q 212 171 298 178 L 298 194 L 280 194 C 280 179, 248 179, 248 194 L 234 194 C 234 176, 190 176, 190 194 L 176 194 C 176 179, 144 179, 144 194 Z"
            fill="#f7dfc2"
            fill-opacity="0.14"
            stroke="#e59a66"
            stroke-width="1.05"
            stroke-opacity="0.62"
            stroke-linejoin="round"
          />
        </g>

        <!-- Rising Courtyard Mound & Approach Path on Far Right -->
        <path
          d="M 284 220 C 318 198, 362 184, 424 178 L 424 220 Z"
          fill="#1b2038"
          fill-opacity="0.55"
          stroke="#e59a66"
          stroke-width="1"
          stroke-opacity="0.45"
        />
        <path
          d="M 298 184 Q 332 184 358 179"
          stroke="#f7dfc2"
          stroke-width="0.95"
          stroke-dasharray="2.5 4"
          stroke-opacity="0.52"
          stroke-linecap="round"
        />

        <!-- Vernacular Malabar Padippura (Pillared Courtyard Gateway) on Right Shoulder -->
        <g>
          <!-- Sloped Tiled Roof with Upturned Timber Gables -->
          <path
            d="M 346 161 Q 364 159 380 147 Q 396 159 414 161 Z"
            fill="#e59a66"
            fill-opacity="0.22"
            stroke="#f7dfc2"
            stroke-width="1.05"
            stroke-opacity="0.72"
            stroke-linejoin="round"
          />
          <line x1="352" y1="164" x2="408" y2="164" stroke="#e59a66" stroke-width="0.9" stroke-opacity="0.55" />
          <!-- Four Courtyard Pillars & Stepped Plinth -->
          <line x1="358" y1="164" x2="358" y2="177" stroke="#f7dfc2" stroke-width="0.95" stroke-opacity="0.55" />
          <line x1="371" y1="164" x2="371" y2="177" stroke="#f7dfc2" stroke-width="0.95" stroke-opacity="0.55" />
          <line x1="389" y1="164" x2="389" y2="177" stroke="#f7dfc2" stroke-width="0.95" stroke-opacity="0.55" />
          <line x1="402" y1="164" x2="402" y2="177" stroke="#f7dfc2" stroke-width="0.95" stroke-opacity="0.55" />
          <line x1="353" y1="177" x2="407" y2="177" stroke="#f7dfc2" stroke-width="1.05" stroke-opacity="0.65" />
          <!-- Welcoming Brass Courtyard Lamp Glow -->
          <circle cx="380" cy="169.5" r="1.8" fill="#f7dfc2" fill-opacity="0.95" />
          <circle cx="380" cy="169.5" r="4.5" fill="#e59a66" fill-opacity="0.28" />
        </g>
      </svg>
    </template>

    <!-- ============================================================
         WORLD 4 ARTWORK: OUR IMPACT
         (Terrace Contour Texture + Spice Hills, Stream & Shola Canopy Tree)
         ============================================================ -->
    <template v-else-if="resolvedBannerType === 'impact'">
      <!-- Subtle Botanical Terrace Contour Pattern -->
      <svg
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-0 w-full h-full banner-pattern-mask text-[#d9f2df]"
      >
        <defs>
          <pattern
            :id="patternId"
            width="60"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 24 C 18 14, 42 14, 60 24"
              fill="none"
              stroke="currentColor"
              stroke-width="0.65"
              stroke-opacity="0.07"
            />
            <circle cx="30" cy="16" r="1" fill="currentColor" fill-opacity="0.12" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
      </svg>

      <!-- Horizon-Anchored Agroforestry Terraces, Watershed Stream & Right Shola Tree -->
      <svg
        viewBox="0 0 420 220"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-72 sm:w-96 md:w-108 opacity-55 sm:opacity-85 md:opacity-100 transition-transform duration-700 ease-editorial group-hover:scale-103 group-hover:-translate-y-0.5"
      >
        <!-- Distant Shola Forest Ridge -->
        <path
          d="M 68 220 C 128 194, 192 174, 258 165 C 322 156, 374 142, 424 130 L 424 220 Z"
          fill="#d9f2df"
          fill-opacity="0.07"
          stroke="#d9f2df"
          stroke-width="0.95"
          stroke-opacity="0.3"
        />

        <!-- Stepped Regenerative Spice & Tea Terraces -->
        <path
          d="M 114 220 C 172 197, 238 183, 310 175 C 358 170, 394 160, 424 152 L 424 220 Z"
          fill="#0f2e24"
          fill-opacity="0.42"
          stroke="#9be1b0"
          stroke-width="1"
          stroke-opacity="0.38"
        />
        <path
          d="M 164 220 C 222 202, 286 192, 352 186 C 386 183, 408 177, 424 172"
          stroke="#d9f2df"
          stroke-width="0.9"
          stroke-opacity="0.3"
        />
        <path
          d="M 224 220 C 278 207, 342 200, 424 192"
          stroke="#9be1b0"
          stroke-width="0.9"
          stroke-opacity="0.28"
        />

        <!-- Winding Mountain Spring / Watershed Stream -->
        <path
          d="M 272 165 C 254 178, 224 182, 206 196 C 194 205, 184 212, 172 220 L 194 220 C 204 211, 214 203, 224 195 C 242 182, 264 177, 280 165 Z"
          fill="#f5e5b0"
          fill-opacity="0.16"
        />
        <path
          d="M 272 165 C 254 178, 224 182, 206 196 C 194 205, 184 212, 172 220"
          stroke="#f5e5b0"
          stroke-width="1.05"
          stroke-opacity="0.62"
          stroke-linecap="round"
        />
        <path
          d="M 280 165 C 264 177, 242 182, 224 195 C 214 203, 204 211, 194 220"
          stroke="#9be1b0"
          stroke-width="0.95"
          stroke-opacity="0.48"
          stroke-linecap="round"
        />

        <!-- Young Botanical Saplings Along the Stream Bank -->
        <g stroke="#f5e5b0" stroke-opacity="0.72" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round">
          <path d="M 156 205 V 195" />
          <path d="M 156 198 C 150 196, 148 191, 152 188 C 156 190, 157 194, 156 198 Z" fill="#9be1b0" fill-opacity="0.22" />
          <path d="M 156 196 C 161 194, 164 189, 160 186 C 156 188, 155 192, 156 196 Z" fill="#f5e5b0" fill-opacity="0.2" />
        </g>

        <!-- Far-Right Native Shola Canopy Tree (Framing Right Margin Above CTA) -->
        <g>
          <!-- Rooted Trunk & Supporting Boughs Along Right Edge -->
          <path
            d="M 404 194 C 401 152, 398 104, 392 52"
            stroke="#d9f2df"
            stroke-width="1.7"
            stroke-opacity="0.42"
            stroke-linecap="round"
          />
          <path
            d="M 396 86 C 382 72, 368 62, 354 56"
            stroke="#d9f2df"
            stroke-width="1.15"
            stroke-opacity="0.36"
            stroke-linecap="round"
          />
          <path
            d="M 394 68 C 404 56, 414 48, 424 44"
            stroke="#d9f2df"
            stroke-width="1.1"
            stroke-opacity="0.34"
            stroke-linecap="round"
          />

          <!-- Airy Layered Canopy Foliage High Above CTA Zone -->
          <path
            d="M 332 58 C 330 42, 348 30, 368 34 C 376 20, 402 18, 416 28 C 422 32, 424 40, 424 48 C 406 52, 386 56, 366 60 C 348 63, 334 64, 332 58 Z"
            fill="#9be1b0"
            fill-opacity="0.14"
            stroke="#9be1b0"
            stroke-width="1.1"
            stroke-opacity="0.48"
            stroke-linejoin="round"
          />
          <path
            d="M 348 46 C 362 38, 384 36, 406 40"
            stroke="#f5e5b0"
            stroke-width="0.9"
            stroke-opacity="0.4"
            stroke-linecap="round"
          />
        </g>
      </svg>
    </template>

    <!-- ============================================================
         WORLD 5 ARTWORK: ABOUT & PHILOSOPHY
         (Palm-Leaf Manuscript Weave + Stepped Kulam Ghats, Mandapam & Banyan)
         ============================================================ -->
    <template v-else-if="resolvedBannerType === 'about'">
      <!-- Subtle Palm-Leaf Manuscript (Ola) & Kolam Dot Pattern -->
      <svg
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-0 w-full h-full banner-pattern-mask text-[#faeccf]"
      >
        <defs>
          <pattern
            :id="patternId"
            width="52"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="14"
              x2="52"
              y2="14"
              stroke="currentColor"
              stroke-width="0.55"
              stroke-opacity="0.065"
            />
            <path
              d="M 26 11.5 L 28.5 14 L 26 16.5 L 23.5 14 Z"
              fill="none"
              stroke="currentColor"
              stroke-width="0.6"
              stroke-opacity="0.11"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
      </svg>

      <!-- Horizon-Anchored Stepped Kulam Ghats, Stone Mandapam, Lotus Pond & Banyan -->
      <svg
        viewBox="0 0 420 220"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-72 sm:w-96 md:w-108 opacity-55 sm:opacity-85 md:opacity-100 transition-transform duration-700 ease-editorial group-hover:scale-103 group-hover:-translate-y-0.5"
      >
        <!-- Distant Heritage Hill & Foothill Silhouette -->
        <path
          d="M 76 220 C 138 196, 198 180, 268 172 C 332 165, 382 152, 424 138 L 424 220 Z"
          fill="#faeccf"
          fill-opacity="0.06"
          stroke="#faeccf"
          stroke-width="0.95"
          stroke-opacity="0.28"
        />

        <!-- Carved Four-Pillar Heritage Stone Mandapam (Scholarly Pavilion) -->
        <g>
          <!-- Tiered Dravidian / Kerala Stone Roof Cornice & Kalasam Finial -->
          <path
            d="M 212 158 L 222 150 H 262 L 272 158 Z"
            fill="#dfb068"
            fill-opacity="0.2"
            stroke="#faeccf"
            stroke-width="1"
            stroke-opacity="0.68"
            stroke-linejoin="round"
          />
          <path d="M 242 146 L 242 150" stroke="#faeccf" stroke-width="1" stroke-opacity="0.65" stroke-linecap="round" />
          <!-- Four Carved Stone Pillars & Base Plinth -->
          <line x1="220" y1="158" x2="220" y2="173" stroke="#faeccf" stroke-width="1" stroke-opacity="0.55" />
          <line x1="234" y1="158" x2="234" y2="173" stroke="#faeccf" stroke-width="0.95" stroke-opacity="0.5" />
          <line x1="250" y1="158" x2="250" y2="173" stroke="#faeccf" stroke-width="0.95" stroke-opacity="0.5" />
          <line x1="264" y1="158" x2="264" y2="173" stroke="#faeccf" stroke-width="1" stroke-opacity="0.55" />
          <line x1="214" y1="173" x2="270" y2="173" stroke="#dfb068" stroke-width="1.05" stroke-opacity="0.62" />
          <!-- Warm Nilavilakku Brass Lamp Inside Mandapam -->
          <line x1="242" y1="168" x2="242" y2="173" stroke="#dfb068" stroke-width="0.95" stroke-opacity="0.7" />
          <circle cx="242" cy="166.5" r="1.8" fill="#faeccf" fill-opacity="0.95" />
          <circle cx="242" cy="166.5" r="4.8" fill="#dfb068" fill-opacity="0.28" />
        </g>

        <!-- Stepped Laterite Temple Tank (Kulam) Ghats Descending to Water -->
        <path
          d="M 184 173 H 424 M 170 180 H 424 M 156 187 H 424 M 142 194 H 424"
          stroke="#dfb068"
          stroke-width="0.95"
          stroke-opacity="0.42"
        />
        <path
          d="M 184 173 V 180 M 170 180 V 187 M 156 187 V 194"
          stroke="#faeccf"
          stroke-width="0.9"
          stroke-opacity="0.45"
        />

        <!-- Still Sacred Pond Water, Lamp Reflection & Floating Lotus Blossoms -->
        <path d="M 96 202 Q 152 199 208 202 T 320 202" stroke="#faeccf" stroke-width="0.85" stroke-opacity="0.26" stroke-linecap="round" />
        <line x1="234" y1="200" x2="250" y2="200" stroke="#faeccf" stroke-width="0.95" stroke-opacity="0.48" stroke-linecap="round" />
        <line x1="237" y1="204" x2="247" y2="204" stroke="#dfb068" stroke-width="0.85" stroke-opacity="0.34" stroke-linecap="round" />

        <!-- Floating Lotus 1 -->
        <g stroke="#faeccf" stroke-width="0.9" stroke-opacity="0.65" stroke-linejoin="round">
          <path d="M 138 209 Q 144 202 144 202 Q 144 202 150 209 Z" fill="#dfb068" fill-opacity="0.22" />
          <path d="M 134 209 Q 138 204 143 207" fill="none" />
          <path d="M 154 209 Q 150 204 145 207" fill="none" />
          <line x1="130" y1="210.5" x2="158" y2="210.5" stroke-opacity="0.35" stroke-linecap="round" />
        </g>

        <!-- Floating Lotus 2 -->
        <g stroke="#faeccf" stroke-width="0.85" stroke-opacity="0.55" stroke-linejoin="round">
          <path d="M 294 212 Q 299 206 299 206 Q 299 206 304 212 Z" fill="#dfb068" fill-opacity="0.2" />
          <line x1="289" y1="213.5" x2="309" y2="213.5" stroke-opacity="0.3" stroke-linecap="round" />
        </g>

        <!-- Far-Right Sacred Banyan Trunk, Aerial Roots & Upper Canopy (Clear of CTA) -->
        <g>
          <path
            d="M 408 173 C 405 134, 402 92, 396 48"
            stroke="#faeccf"
            stroke-width="1.7"
            stroke-opacity="0.4"
            stroke-linecap="round"
          />
          <!-- Delicate Banyan Aerial Prop Roots in Right Margin Gutter -->
          <path d="M 398 62 C 397 86, 397 108, 398 128" stroke="#dfb068" stroke-width="0.8" stroke-opacity="0.34" stroke-linecap="round" />
          <path d="M 403 58 C 402 88, 402 118, 403 146" stroke="#faeccf" stroke-width="0.75" stroke-opacity="0.28" stroke-linecap="round" />
          <!-- Upper Bough & Canopy High Above CTA Zone -->
          <path d="M 398 64 C 382 52, 366 46, 348 44" stroke="#faeccf" stroke-width="1.1" stroke-opacity="0.36" stroke-linecap="round" />
          <path
            d="M 334 48 C 334 32, 354 22, 374 26 C 386 16, 408 16, 424 26 L 424 54 C 402 54, 378 56, 354 54 C 340 53, 334 51, 334 48 Z"
            fill="#dfb068"
            fill-opacity="0.14"
            stroke="#faeccf"
            stroke-width="1.05"
            stroke-opacity="0.44"
            stroke-linejoin="round"
          />
        </g>
      </svg>
    </template>

    <!-- ============================================================
         WORLD 6 ARTWORK: CONTACT
         (Coastal Breeze Texture + Malabar Harbor Jetty, Skiff & Lighthouse)
         ============================================================ -->
    <template v-else-if="resolvedBannerType === 'contact'">
      <!-- Subtle Diagonal Coastal Breeze & Ripple Weave Pattern -->
      <svg
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-0 w-full h-full banner-pattern-mask text-[#fce8d5]"
      >
        <defs>
          <pattern
            :id="patternId"
            width="56"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 0 20 Q 14 14 28 20 T 56 20"
              fill="none"
              stroke="currentColor"
              stroke-width="0.6"
              stroke-opacity="0.065"
            />
            <circle cx="28" cy="9" r="0.9" fill="currentColor" fill-opacity="0.11" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" :fill="`url(#${patternId})`" />
      </svg>

      <!-- Horizon-Anchored Malabar Harbor Cove, Lantern Jetty, Skiff & Right Lighthouse -->
      <svg
        viewBox="0 0 420 220"
        fill="none"
        preserveAspectRatio="xMaxYMax meet"
        aria-hidden="true"
        class="pointer-events-none select-none absolute inset-y-0 right-0 h-full w-72 sm:w-96 md:w-108 opacity-55 sm:opacity-85 md:opacity-100 transition-transform duration-700 ease-editorial group-hover:scale-103 group-hover:-translate-x-0.5"
      >
        <!-- Distant Low Harbor Cape & Calm Sea Horizon -->
        <path
          d="M 88 176 C 138 166, 192 164, 248 170 C 284 174, 316 172, 346 176 Z"
          fill="#fce8d5"
          fill-opacity="0.07"
          stroke="#fce8d5"
          stroke-width="0.9"
          stroke-opacity="0.28"
        />
        <line x1="64" y1="176" x2="424" y2="176" stroke="#fce8d5" stroke-width="0.85" stroke-opacity="0.24" />

        <!-- Dusk Sea Birds High in Upper Sky -->
        <path d="M 332 46 Q 336 42 340 46 Q 344 42 348 46" stroke="#fce8d5" stroke-width="0.95" stroke-opacity="0.42" stroke-linecap="round" />
        <path d="M 354 38 Q 357 35 360 38 Q 363 35 366 38" stroke="#fce8d5" stroke-width="0.85" stroke-opacity="0.32" stroke-linecap="round" />

        <!-- Timber Harbor Jetty & Welcoming Hanging Pier Lantern -->
        <g>
          <!-- Jetty Plank Deck & Timber Pilings -->
          <line x1="224" y1="183" x2="334" y2="183" stroke="#fce8d5" stroke-width="1.2" stroke-opacity="0.68" stroke-linecap="round" />
          <line x1="234" y1="183" x2="234" y2="195" stroke="#fce8d5" stroke-width="1" stroke-opacity="0.5" />
          <line x1="258" y1="183" x2="258" y2="195" stroke="#fce8d5" stroke-width="1" stroke-opacity="0.5" />
          <line x1="282" y1="183" x2="282" y2="194" stroke="#fce8d5" stroke-width="1" stroke-opacity="0.5" />
          <line x1="306" y1="183" x2="306" y2="193" stroke="#fce8d5" stroke-width="1" stroke-opacity="0.5" />
          <!-- Lantern Post & Warm Hanging Harbor Lantern -->
          <path d="M 228 183 V 165 H 221" stroke="#fce8d5" stroke-width="1" stroke-opacity="0.65" stroke-linecap="round" stroke-linejoin="round" />
          <circle cx="221" cy="169" r="1.9" fill="#fce8d5" fill-opacity="0.95" />
          <circle cx="221" cy="169" r="5" fill="#f0a875" fill-opacity="0.3" />
          <!-- Lantern Shimmer on Harbor Water -->
          <line x1="215" y1="198" x2="229" y2="198" stroke="#f0a875" stroke-width="0.95" stroke-opacity="0.52" stroke-linecap="round" />
          <line x1="218" y1="202" x2="226" y2="202" stroke="#fce8d5" stroke-width="0.8" stroke-opacity="0.34" stroke-linecap="round" />
        </g>

        <!-- Moored Coastal Wooden Skiff Gently Resting Near Pier -->
        <g>
          <path
            d="M 148 187 Q 160 195 178 195 Q 196 195 208 185 Q 194 190 178 190 Q 162 190 148 187 Z"
            fill="#f0a875"
            fill-opacity="0.22"
            stroke="#fce8d5"
            stroke-width="1.05"
            stroke-opacity="0.78"
            stroke-linejoin="round"
          />
          <line x1="174" y1="175" x2="174" y2="190" stroke="#fce8d5" stroke-width="0.95" stroke-opacity="0.58" stroke-linecap="round" />
          <path d="M 174 176 L 188 186 H 174" fill="#fce8d5" fill-opacity="0.14" stroke="#fce8d5" stroke-width="0.85" stroke-opacity="0.52" stroke-linejoin="round" />
        </g>

        <!-- Calm Cove Ripples -->
        <path d="M 88 194 Q 118 191 148 194" stroke="#fce8d5" stroke-width="0.85" stroke-opacity="0.24" stroke-linecap="round" />
        <path d="M 126 206 Q 186 203 246 206 T 356 206" stroke="#fce8d5" stroke-width="0.9" stroke-opacity="0.26" stroke-linecap="round" />

        <!-- Far-Right Rocky Coastal Promontory & Heritage Malabar Lighthouse (Clear of CTA) -->
        <path
          d="M 318 220 C 344 198, 378 184, 424 178 L 424 220 Z"
          fill="#18202b"
          fill-opacity="0.55"
          stroke="#f0a875"
          stroke-width="1"
          stroke-opacity="0.45"
        />

        <g>
          <!-- Soft Dusk Guiding Beam High in Upper Sky (Above CTA Button) -->
          <polygon
            points="399,55 276,34 276,66"
            fill="#fce8d5"
            fill-opacity="0.075"
          />
          <line x1="399" y1="55" x2="292" y2="39" stroke="#fce8d5" stroke-width="0.75" stroke-opacity="0.22" stroke-dasharray="3 5" />

          <!-- Slender Tapered Lighthouse Tower on Far-Right Margin -->
          <path
            d="M 397 181 L 400 61 H 408 L 411 181 Z"
            fill="#fce8d5"
            fill-opacity="0.14"
            stroke="#fce8d5"
            stroke-width="1.05"
            stroke-opacity="0.56"
            stroke-linejoin="round"
          />
          <!-- Traditional Malabar Horizontal Heritage Bands -->
          <line x1="399.2" y1="94" x2="408.8" y2="94" stroke="#f0a875" stroke-width="1" stroke-opacity="0.48" />
          <line x1="398.2" y1="134" x2="409.8" y2="134" stroke="#f0a875" stroke-width="1" stroke-opacity="0.48" />

          <!-- Balcony Gallery, Lantern Room & Dome Cap -->
          <line x1="397" y1="61" x2="411" y2="61" stroke="#fce8d5" stroke-width="1.15" stroke-opacity="0.7" stroke-linecap="round" />
          <rect x="400.5" y="51" width="7" height="10" stroke="#fce8d5" stroke-width="0.95" stroke-opacity="0.7" />
          <path d="M 399.5 51 Q 404 44 408.5 51 Z" fill="#f0a875" fill-opacity="0.38" stroke="#fce8d5" stroke-width="0.95" stroke-opacity="0.72" />

          <!-- Warm Guiding Beacon Glow -->
          <circle cx="404" cy="56" r="2.2" fill="#fce8d5" />
          <circle cx="404" cy="56" r="6.5" fill="#f0a875" fill-opacity="0.34" />
        </g>
      </svg>
    </template>

    <!-- ============================================================
         FOREGROUND EDITORIAL CONTENT + INTERACTIVE THEME CTA
         ============================================================ -->
    <div class="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8 lg:gap-10">
      <!-- Left Editorial Copy (Natural Height) -->
      <div class="flex-1 min-w-0 flex flex-col items-start">
        <div
          v-if="resolvedEyebrow"
          class="flex items-center gap-2.5 mb-2.5"
        >
          <span
            :class="['w-1.5 h-1.5 rounded-full shrink-0', activePreset.pipClass]"
            aria-hidden="true"
          />
          <span :class="['eyebrow-text mx-0! pt-0.5 font-semibold tracking-[0.18em]', activePreset.eyebrowClass]">
            {{ resolvedEyebrow }}
          </span>
        </div>

        <h3 class="section-smaller-subtitle font-medium text-surface-light leading-snug! mb-2.5 max-w-2xl">
          {{ resolvedTitle }}
        </h3>

        <p
          v-if="resolvedText"
          class="section-subparagraph sm:section-paragraph text-surface-light/85 leading-relaxed max-w-xl"
        >
          {{ resolvedText }}
        </p>
      </div>

      <!-- Right Theme-Matched Interactive Button -->
      <div class="shrink-0 flex items-center md:self-center">
        <span
          :class="[
            'inline-flex items-center justify-center gap-2.5 px-5 sm:px-6 h-11 rounded-xl border-[1.5px] backdrop-blur-md text-[10px] sm:text-[11px] font-uppercase font-semibold tracking-[0.18em] uppercase transition-all duration-300 ease-editorial group-active:scale-96',
            activePreset.buttonClass
          ]"
        >
          <span class="pt-0.5 leading-none">{{ resolvedCtaLabel }}</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4 shrink-0 transition-transform duration-300 ease-editorial group-hover:translate-x-1 group-active:translate-x-1"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.banner-pattern-mask {
  mask-image: linear-gradient(
    105deg,
    rgba(0, 0, 0, 0.14) 0%,
    rgba(0, 0, 0, 0.42) 48%,
    rgba(0, 0, 0, 0.92) 100%
  );
  -webkit-mask-image: linear-gradient(
    105deg,
    rgba(0, 0, 0, 0.14) 0%,
    rgba(0, 0, 0, 0.42) 48%,
    rgba(0, 0, 0, 0.92) 100%
  );
}

/* 1. PLAN YOUR JOURNEY: Lifted Dusk Sapphire + Golden-Hour Ghats Horizon */
.banner-surface-plan {
  background-color: #153052;
  box-shadow: inset 0 1px 0 rgba(245, 229, 176, 0.18);
  background-image:
    radial-gradient(
      circle at 80% 78%,
      rgba(229, 174, 96, 0.28) 0%,
      rgba(212, 163, 89, 0.09) 42%,
      transparent 70%
    ),
    radial-gradient(
      circle at 14% 12%,
      rgba(64, 128, 196, 0.28) 0%,
      transparent 56%
    ),
    linear-gradient(
      126deg,
      #132946 0%,
      #1b3b63 52%,
      #244b76 100%
    );
}

/* 2. ITINERARIES: Lifted Malabar Lagoon Teal + Sunlit Estuary Mist */
.banner-surface-itineraries {
  background-color: #123b4e;
  box-shadow: inset 0 1px 0 rgba(186, 220, 255, 0.2);
  background-image:
    radial-gradient(
      circle at 78% 76%,
      rgba(148, 218, 240, 0.24) 0%,
      rgba(72, 162, 190, 0.1) 42%,
      transparent 68%
    ),
    radial-gradient(
      circle at 90% 24%,
      rgba(245, 229, 176, 0.15) 0%,
      transparent 48%
    ),
    radial-gradient(
      circle at 14% 10%,
      rgba(38, 128, 148, 0.28) 0%,
      transparent 55%
    ),
    linear-gradient(
      126deg,
      #0f3344 0%,
      #16495e 52%,
      #1e5f76 100%
    );
}

/* 3. PARTNER WITH US: Lifted Twilight Indigo-Slate + Spiced Terracotta Courtyard Glow */
.banner-surface-partner {
  background-color: #212744;
  box-shadow: inset 0 1px 0 rgba(247, 223, 194, 0.18);
  background-image:
    radial-gradient(
      circle at 82% 80%,
      rgba(229, 154, 102, 0.28) 0%,
      rgba(212, 142, 92, 0.1) 42%,
      transparent 70%
    ),
    radial-gradient(
      circle at 14% 12%,
      rgba(108, 122, 186, 0.26) 0%,
      transparent 56%
    ),
    linear-gradient(
      126deg,
      #1b213a 0%,
      #272f52 52%,
      #363659 100%
    );
}

/* 4. OUR IMPACT: Lifted Western Ghats Canopy Emerald + Morning Sunlit Sage Mist */
.banner-surface-impact {
  background-color: #153c30;
  box-shadow: inset 0 1px 0 rgba(217, 242, 223, 0.2);
  background-image:
    radial-gradient(
      circle at 80% 78%,
      rgba(155, 225, 176, 0.22) 0%,
      rgba(245, 229, 176, 0.1) 42%,
      transparent 68%
    ),
    radial-gradient(
      circle at 92% 20%,
      rgba(245, 229, 176, 0.14) 0%,
      transparent 46%
    ),
    radial-gradient(
      circle at 14% 12%,
      rgba(52, 142, 108, 0.28) 0%,
      transparent 56%
    ),
    linear-gradient(
      126deg,
      #113127 0%,
      #184738 52%,
      #215c49 100%
    );
}

/* 5. ABOUT & PHILOSOPHY: Lifted Heritage Rosewood-Umber + Antique Brass Lamp Glow */
.banner-surface-about {
  background-color: #2b2019;
  box-shadow: inset 0 1px 0 rgba(250, 236, 207, 0.18);
  background-image:
    radial-gradient(
      circle at 80% 78%,
      rgba(223, 176, 104, 0.27) 0%,
      rgba(198, 142, 76, 0.1) 42%,
      transparent 70%
    ),
    radial-gradient(
      circle at 14% 12%,
      rgba(148, 106, 74, 0.26) 0%,
      transparent 56%
    ),
    linear-gradient(
      126deg,
      #241b15 0%,
      #35271e 52%,
      #473428 100%
    );
}

/* 6. CONTACT: Lifted Coastal Dusk Slate + Warm Harbor Sunset Amber Glow */
.banner-surface-contact {
  background-color: #232d3b;
  box-shadow: inset 0 1px 0 rgba(252, 232, 213, 0.18);
  background-image:
    radial-gradient(
      circle at 82% 76%,
      rgba(240, 168, 117, 0.27) 0%,
      rgba(224, 142, 96, 0.1) 42%,
      transparent 70%
    ),
    radial-gradient(
      circle at 94% 22%,
      rgba(252, 232, 213, 0.14) 0%,
      transparent 45%
    ),
    radial-gradient(
      circle at 14% 12%,
      rgba(92, 122, 158, 0.28) 0%,
      transparent 56%
    ),
    linear-gradient(
      126deg,
      #1d2532 0%,
      #2a3647 52%,
      #3b4659 100%
    );
}
</style>
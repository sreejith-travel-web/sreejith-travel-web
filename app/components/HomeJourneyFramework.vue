<!-- ~/app/components/HomeJourneyFramework.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

export interface JourneyStep {
  title: string
  subtitle: string
  description: string
}

export interface HomeJourneyFrameworkConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  steps: JourneyStep[]
  bottomQuote: string
  cta: {
    label: string
    to: string
  }
}

defineProps<{
  data: HomeJourneyFrameworkConfig
}>()

const timelineRef = ref<HTMLElement | null>(null)
const isWaveAnimated = ref(false)
let observer: IntersectionObserver | null = null

// Desktop Horizontal Node Coordinates (viewBox: 0 0 1250 150)
const desktopNodes = [
  { cx: 55, cy: 78, delay: 50 },
  { cx: 305, cy: 78, delay: 200 },
  { cx: 555, cy: 78, delay: 500 },
  { cx: 805, cy: 78, delay: 700 },
  { cx: 1035, cy: 78, delay: 1050, isSpreadOrigin: true },
]

// Desktop "Difference" Radiating Branches (Spreading right from x:1035, y:78)
const desktopBranches = [
  {
    d: 'M 1035 78 C 1095 78, 1145 16, 1215 16',
    endX: 1215,
    endY: 16,
    delay: 1100,
    dotR: 4.5,
  },
  {
    d: 'M 1035 78 C 1090 78, 1140 52, 1205 52',
    endX: 1205,
    endY: 52,
    delay: 1200,
    dotR: 4,
  },
  {
    d: 'M 1035 78 C 1095 78, 1155 94, 1235 94',
    endX: 1235,
    endY: 94,
    delay: 1300,
    dotR: 4.5,
  },
  {
    d: 'M 1035 78 C 1090 78, 1135 100, 1180 100',
    endX: 1180,
    endY: 100,
    delay: 1400,
    dotR: 2.5,
  },
  {
    d: 'M 1035 78 C 1095 78, 1145 140, 1225 140',
    endX: 1225,
    endY: 140,
    delay: 1500,
    dotR: 3.5,
  },
]

// Mobile/Tablet Vertical Node Coordinates (viewBox: 0 0 100 1000)
const mobileNodes = [
  { cx: 44, cy: 55, delay: 50 },
  { cx: 44, cy: 255, delay: 200 },
  { cx: 44, cy: 455, delay: 500 },
  { cx: 44, cy: 655, delay: 700 },
  { cx: 44, cy: 845, delay: 1050, isSpreadOrigin: true },
]

// Mobile/Tablet "Difference" Radiating Branches (Spreading down/out from x:44, y:845)
const mobileBranches = [
  {
    d: 'M 44 845 C 44 885, 16 925, 10 978',
    endX: 10,
    endY: 978,
    delay: 1100,
    dotR: 4,
  },
  {
    d: 'M 44 845 C 44 890, 28 935, 26 988',
    endX: 26,
    endY: 988,
    delay: 1200,
    dotR: 3.5,
  },
  {
    d: 'M 44 845 C 45 895, 48 945, 50 992',
    endX: 50,
    endY: 992,
    delay: 1300,
    dotR: 4.5,
  },
  {
    d: 'M 44 845 C 46 890, 68 935, 74 984',
    endX: 74,
    endY: 984,
    delay: 1400,
    dotR: 4,
  },
  {
    d: 'M 44 845 C 48 880, 80 920, 92 966',
    endX: 92,
    endY: 966,
    delay: 1500,
    dotR: 3.5,
  },
]

onMounted(() => {
  if ('IntersectionObserver' in window && timelineRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          isWaveAnimated.value = true
          observer?.disconnect()
        }
      },
      { threshold: 0.18 }
    )
    observer.observe(timelineRef.value)
  } else {
    isWaveAnimated.value = true
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section
    data-theme="dark"
    class="text-primary-dark overflow-hidden section-wrapper"
  >
    <!-- ==========================================
         BACKGROUND IMAGE & GRADIENT TINT
         ========================================== -->
    <div class="absolute inset-0 z-0 pointer-events-none select-none">
      <picture>
        <!-- Desktop Image (Loads only on screens 768px and wider) -->
        <source media="(min-width: 768px)" srcset="/images/home/journey-pc.webp" />
        <!-- Mobile Image (Default fallback) -->
        <img 
          src="/images/home/journey-mob.webp" 
          alt="South Indian Tourism" 
          role="presentation"
          class="w-full h-full object-cover object-center"
          loading="lazy" 
          decoding="async"
          fetchpriority="low"
        />
      </picture>
      
      <!-- Radial Gradient Overlay Tint -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-intention-deep)_0%,var(--color-journey-deep)_100%)] opacity-85"></div>
    </div>

    <div class="relative z-10 w-full max-w-360 flex flex-col items-center">

      <!-- 1. SECTION HEADER -->
      <div class="relative z-20 w-full max-w-3xl flex flex-col items-center text-center mb-10 md:mb-14 xl:mb-16">
        
        <!-- Eyebrow -->
        <div
          v-motion-fade-up
          class="eyebrow-wrapper"
        >
          <div class="bg-warm-gold/75 eyebrow-border" />
          <h2 class="text-surface-light eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-warm-gold/75 eyebrow-border" />
        </div>

        <!-- Main Heading (Fade-up) -->
        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper"
        >
          <span class="text-surface-light uppercase tracking-wide section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-warm-gold mt-1 md:mt-2 section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <!-- Header Paragraph -->
        <p
          v-motion-fade-up
          :delay="200"
          class="text-surface-light/90 max-w-2xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. JOURNEY FRAMEWORK TIMELINE (Single DOM for Steps + Responsive SVGs) -->
      <div
        ref="timelineRef"
        class="relative z-20 w-full max-w-xl md:max-w-2xl xl:max-w-none mx-auto px-2 sm:px-6 xl:px-4"
      >
        <!-- A. DESKTOP HORIZONTAL WAVE SVG (1280px and above) -->
        <div
          class="hidden xl:block relative z-20 w-full mb-4 pointer-events-none select-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 1250 150"
            fill="none"
            class="w-full h-auto overflow-visible"
          >
            <defs>
              <filter id="gold-glow-desktop" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <linearGradient id="wave-shimmer-desktop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ffc15c" stop-opacity="0.2" />
                <stop offset="50%" stop-color="#fff7e6" stop-opacity="0.95" />
                <stop offset="100%" stop-color="#ffc15c" stop-opacity="0.2" />
              </linearGradient>
            </defs>

            <!-- Base Faint Guide Track -->
            <path
              d="M 0 78 Q 28 90, 55 78 C 118 50, 242 50, 305 78 C 368 106, 492 106, 555 78 C 618 50, 742 50, 805 78 C 868 106, 972 106, 1035 78"
              stroke="rgba(255, 193, 92, 0.14)"
              stroke-width="1.5"
              fill="none"
            />

            <!-- Primary Animated Golden Wave (Streamlined Journey: Steps 1 to 5) -->
            <path
              d="M 0 78 Q 28 90, 55 78 C 118 50, 242 50, 305 78 C 368 106, 492 106, 555 78 C 618 50, 742 50, 805 78 C 868 106, 972 106, 1035 78"
              pathLength="1"
              stroke="#ffc15c"
              stroke-width="2"
              stroke-linecap="round"
              fill="none"
              class="journey-main-path"
              :class="{ 'is-drawn': isWaveAnimated }"
            />

            <!-- Continuous Forward-Flowing Energy Pulse on Main Wave -->
            <path
              v-if="isWaveAnimated"
              d="M 0 78 Q 28 90, 55 78 C 118 50, 242 50, 305 78 C 368 106, 492 106, 555 78 C 618 50, 742 50, 805 78 C 868 106, 972 106, 1035 78"
              pathLength="1"
              stroke="url(#wave-shimmer-desktop)"
              stroke-width="2.5"
              stroke-linecap="round"
              fill="none"
              class="journey-flow-pulse"
            />

            <!-- "Difference" Spreading Branches (Step 5 Impact Bloom) -->
            <g v-for="(branch, bIdx) in desktopBranches" :key="`d-branch-${bIdx}`">
              <path
                :d="branch.d"
                pathLength="1"
                stroke="#ffc15c"
                stroke-width="1.5"
                stroke-opacity="0.85"
                stroke-linecap="round"
                fill="none"
                class="journey-branch-path"
                :class="{ 'is-drawn': isWaveAnimated }"
                :style="{ transitionDelay: `${branch.delay}ms` }"
              />
              <!-- Branch Terminal Glowing Dot -->
              <circle
                :cx="branch.endX"
                :cy="branch.endY"
                :r="branch.dotR"
                fill="#ffc15c"
                filter="url(#gold-glow-desktop)"
                class="journey-node"
                :class="{ 'is-lit': isWaveAnimated }"
                :style="{ transitionDelay: `${branch.delay + 450}ms` }"
              />
            </g>

            <!-- The 5 Primary Step Nodes -->
            <g
              v-for="(node, nIdx) in desktopNodes"
              :key="`d-node-${nIdx}`"
              class="journey-node"
              :class="{ 'is-lit': isWaveAnimated }"
              :style="{ transitionDelay: `${node.delay}ms` }"
            >
              <!-- Outer Halo -->
              <circle
                :cx="node.cx"
                :cy="node.cy"
                :r="node.isSpreadOrigin ? 12 : 9"
                fill="rgba(255, 193, 92, 0.22)"
                class="journey-node-halo"
              />
              <!-- Core Gold Circle -->
              <circle
                :cx="node.cx"
                :cy="node.cy"
                :r="node.isSpreadOrigin ? 7 : 5.5"
                fill="#ffc15c"
                filter="url(#gold-glow-desktop)"
              />
            </g>
          </svg>
        </div>

        <!-- B. SINGLE-DOM STEPS CONTAINER (Vertical on <1280px with Left Wave, 5 Columns on >=1280px) -->
        <div class="relative flex flex-row xl:block">
          
          <!-- MOBILE & TABLET VERTICAL WAVE SVG (<1280px) -->
          <div
            class="xl:hidden relative z-20 w-14 sm:w-20 shrink-0 mr-3 sm:mr-6 pointer-events-none select-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 100 1000"
              preserveAspectRatio="none"
              fill="none"
              class="w-full h-full overflow-visible"
            >
              <!-- Base Faint Vertical Track -->
              <path
                d="M 28 0 Q 38 28, 44 55 C 66 120, 22 190, 44 255 C 66 320, 22 390, 44 455 C 66 520, 22 590, 44 655 C 66 720, 22 785, 44 845"
                stroke="rgba(255, 193, 92, 0.14)"
                stroke-width="1.5"
                fill="none"
              />

              <!-- Primary Animated Vertical Wave -->
              <path
                d="M 28 0 Q 38 28, 44 55 C 66 120, 22 190, 44 255 C 66 320, 22 390, 44 455 C 66 520, 22 590, 44 655 C 66 720, 22 785, 44 845"
                pathLength="1"
                stroke="#ffc15c"
                stroke-width="2"
                stroke-linecap="round"
                fill="none"
                class="journey-main-path"
                :class="{ 'is-drawn': isWaveAnimated }"
              />

              <!-- Continuous Forward-Flowing Energy Pulse on Vertical Wave -->
              <path
                v-if="isWaveAnimated"
                d="M 28 0 Q 38 28, 44 55 C 66 120, 22 190, 44 255 C 66 320, 22 390, 44 455 C 66 520, 22 590, 44 655 C 66 720, 22 785, 44 845"
                pathLength="1"
                stroke="#fff7e6"
                stroke-width="2.2"
                stroke-linecap="round"
                fill="none"
                class="journey-flow-pulse"
              />

              <!-- Mobile "Difference" Spreading Branches at Bottom -->
              <g v-for="(branch, bIdx) in mobileBranches" :key="`m-branch-${bIdx}`">
                <path
                  :d="branch.d"
                  pathLength="1"
                  stroke="#ffc15c"
                  stroke-width="1.5"
                  stroke-opacity="0.85"
                  stroke-linecap="round"
                  fill="none"
                  class="journey-branch-path"
                  :class="{ 'is-drawn': isWaveAnimated }"
                  :style="{ transitionDelay: `${branch.delay}ms` }"
                />
                <circle
                  :cx="branch.endX"
                  :cy="branch.endY"
                  :r="branch.dotR"
                  fill="#ffc15c"
                  class="journey-node"
                  :class="{ 'is-lit': isWaveAnimated }"
                  :style="{ transitionDelay: `${branch.delay + 450}ms` }"
                />
              </g>

              <!-- The 5 Vertical Step Nodes -->
              <g
                v-for="(node, nIdx) in mobileNodes"
                :key="`m-node-${nIdx}`"
                class="journey-node"
                :class="{ 'is-lit': isWaveAnimated }"
                :style="{ transitionDelay: `${node.delay}ms` }"
              >
                <circle
                  :cx="node.cx"
                  :cy="node.cy"
                  :r="node.isSpreadOrigin ? 11 : 8.5"
                  fill="rgba(255, 193, 92, 0.22)"
                  class="journey-node-halo"
                />
                <circle
                  :cx="node.cx"
                  :cy="node.cy"
                  :r="node.isSpreadOrigin ? 6.5 : 5"
                  fill="#ffc15c"
                />
              </g>
            </svg>
          </div>

          <!-- THE 5 STEPS LIST (Single DOM) -->
          <div class="flex-1 grid grid-cols-1 xl:grid-cols-5 gap-y-10 sm:gap-y-12 xl:gap-y-0 xl:gap-x-8 pb-6 xl:pb-0">
            <div
              v-for="(step, index) in data.steps"
              :key="step.title"
              v-motion-stagger-card
              :delay="index * 150"
              class="flex flex-col items-start text-left xl:pr-2 will-change-transform"
            >
              <!-- Step Title with Animated Gold Dash -->
              <div class="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                <h3 class="text-surface-light section-smaller-subtitle mb-0">
                  {{ step.title }}
                </h3>
              </div>

              <!-- Step Midsubtitle -->
              <span class="text-warm-gold section-midsubtitle">
                {{ step.subtitle }}
              </span>

              <!-- Step Subparagraph -->
              <p class="text-surface-light/90 section-subparagraph">
                {{ step.description }}
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Bottom Quote -->
      <div 
        v-motion-fade-up
        class="relative z-20 w-full flex flex-col items-center text-center mt-8 md:mt-12 xl:mt-16 px-4 mb-8 md:mb-10"
      >
        <p class="px-4 lg:max-w-3xl xl:max-w-4xl text-soft-blue section-quote">
          {{ data.bottomQuote }}
        </p>
      </div>

      <!-- 3. BOTTOM CENTERED CTA BUTTON -->
      <div
        v-motion-fade-up
        :delay="100"
        class="relative z-20 flex justify-center w-full will-change-transform"
      >
        <CtaButton
          :to="data.cta.to"
          :label="data.cta.label"
          variant="dark"
        />
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Primary Wave Forward Draw */
.journey-main-path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 1200ms cubic-bezier(0.22, 1, 0.6, 1);
}

.journey-main-path.is-drawn {
  stroke-dashoffset: 0;
}

/* "Difference" Spreading Branches Draw */
.journey-branch-path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  transition: stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1);
}

.journey-branch-path.is-drawn {
  stroke-dashoffset: 0;
}

/* Sequential Node Ignition */
.journey-node {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  transform: scale(0.2);
  transition:
    opacity 500ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
}

.journey-node.is-lit {
  opacity: 1;
  transform: scale(1);
}

/* Gentle Breathing Halo on Nodes */
.journey-node-halo {
  transform-box: fill-box;
  transform-origin: center;
  animation: node-breathe 2.2s ease-in-out infinite;
}

/* Continuous Forward-Flowing Energy Pulse */
.journey-flow-pulse {
  stroke-dasharray: 0.14 0.86;
  stroke-dashoffset: 1.14;
  opacity: 0;
  animation: wave-forward-stream 4.5s cubic-bezier(0.4, 0, 0.2, 1) 1.9s infinite;
}

@keyframes wave-forward-stream {
  0% {
    stroke-dashoffset: 1.14;
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  85% {
    opacity: 0.9;
  }
  100% {
    stroke-dashoffset: -0.14;
    opacity: 0;
  }
}

@keyframes node-breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.22;
  }
  50% {
    transform: scale(1.35);
    opacity: 0.45;
  }
}
</style>
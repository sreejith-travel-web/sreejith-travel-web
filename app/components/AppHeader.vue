<!-- ~/app/components/AppHeader.vue -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const isMenuOpen = ref(false)
const route = useRoute()

const { backgroundTheme, forceTransparent } = useHeaderTheme()
const { y } = useWindowScroll()
const { height: windowHeight } = useWindowSize()

const docHeight = ref(1)

const updateDocHeight = () => {
  if (import.meta.client) {
    docHeight.value = Math.max(1, document.documentElement.scrollHeight - windowHeight.value)
  }
}

onMounted(() => {
  updateDocHeight()
})

const scrollProgress = computed(() => {
  if (!import.meta.client) return 0
  const maxScroll = Math.max(1, document.documentElement.scrollHeight - windowHeight.value)
  return Math.min(1, Math.max(0, y.value / maxScroll))
})

// Header is only fully transparent if forceTransparent is on and you haven't scrolled down
const isTransparentTop = computed(() => forceTransparent.value && y.value < 50)

// Logo needs invert/white state if background behind is dark OR if we are forced transparent at the top
const shouldLogoInvert = computed(() => backgroundTheme.value === 'dark' || isTransparentTop.value)

// Text matches invert color needs
const isOnLightBg = computed(() => backgroundTheme.value === 'light' && !isTransparentTop.value)

const leftLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Itineraries', path: '/itineraries' },
]

const rightLinks = [
  { name: 'Services', path: '/services' },
  { name: 'Impact', path: '/impact' },
  { name: 'Blog', path: '/blog' },
]
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 w-full z-100 transition-all duration-300 ease-out',
      isTransparentTop
        ? 'bg-transparent border-b border-transparent shadow-none'
        : isOnLightBg
        ? 'bg-surface-frosted/90 border-b border-border-light/90 shadow-xl backdrop-blur-md'
        : 'bg-journey-deep/90 border-b border-white/10 shadow-xl backdrop-blur-md'
    ]"
  >
    <div class="flex justify-between items-center px-2 md:px-4 lg:px-6 h-16 md:h-20 mx-auto relative z-60">
      
      <!-- Left Side: Hamburger & Desktop Nav -->
      <div class="flex flex-1 items-center justify-start">
        <button
          @click="isMenuOpen = true"
          :class="[
            'relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex flex-col justify-center items-center group transition-colors duration-300 ease-out outline-none shrink-0 cursor-pointer',
            isOnLightBg 
                ? 'border-journey-deep/30 hover:border-intention-blue active:border-intention-blue' 
                : 'border-white/35 hover:border-heritage-gold active:border-heritage-gold'
          ]"
          aria-label="Open Menu"
        >
          <div class="w-4.75 h-2 md:w-6 md:h-2.5 relative flex flex-col items-start">
            <span
              :class="[
                'block h-0.5 absolute left-0 rounded-xl transition-all duration-300 ease-editorial w-4.75 md:w-6 top-0 group-hover:w-2.5 group-active:w-2.5 md:group-hover:w-3.5 md:group-active:w-3.5',
                isOnLightBg 
                    ? 'bg-journey-deep group-hover:bg-intention-blue group-active:bg-intention-blue' 
                    : 'bg-white group-hover:bg-heritage-gold group-active:bg-heritage-gold'
              ]"
            />
            <span
              :class="[
                'block h-0.5 absolute left-0 rounded-xl transition-all duration-300 ease-editorial w-2.5 md:w-3.5 top-2.25 md:top-2.5 group-hover:w-4.75 group-active:w-4.75 md:group-hover:w-6 md:group-active:w-6',
                isOnLightBg 
                    ? 'bg-journey-deep group-hover:bg-intention-blue group-active:bg-intention-blue' 
                    : 'bg-white group-hover:bg-heritage-gold group-active:bg-heritage-gold'
              ]"
            />
          </div>
        </button>

        <!-- Left Desktop Links -->
        <nav class="hidden lg:flex items-center gap-8 xl:gap-12 2xl:gap-20 ml-auto pr-10 2xl:pr-14">
          <NuxtLink
            v-for="link in leftLinks"
            :key="link.name"
            :to="link.path"
            :class="[
              'group relative text-xs 2xl:text-sm tracking-[0.2em] uppercase font-uppercase transition-all duration-300 ease-out font-medium group-hover:font-semibold',
              isOnLightBg ? 'text-ink-dark hover:text-intention-blue' : 'text-white/90 hover:text-heritage-gold',
            ]"
          >
            {{ link.name }}
            <span
              :class="[
                'absolute -bottom-1.5 left-1/2 h-0.5 -translate-x-1/2 transition-all duration-300 ease-out',
                isOnLightBg ? 'bg-intention-blue' : 'bg-heritage-gold',
                route.path === link.path ? 'w-full' : 'w-0 group-hover:w-full'
              ]"
            />
          </NuxtLink>
        </nav>
      </div>

      <!-- Center: Fully Automatic Responsive Center Positioning -->
      <div class="shrink-0 flex items-center justify-center">
        <NuxtLink 
            to="/" 
            :class="[
            'group cursor-pointer outline-none flex flex-col items-center justify-center transition-colors duration-500 ease-editorial',
            // The parent link dictates the color for BOTH the masked logo and the text below it
            isOnLightBg 
                ? 'text-journey-deep hover:text-intention-blue active:text-intention-blue' 
                : 'text-white hover:text-heritage-gold active:text-heritage-gold'
            ]"
        >
            <!-- Logo Container -->
            <div class="relative h-9 md:h-10 lg:h-11 w-max">
            
            <!-- 1. Real Image: Eagerly loads for CWV/LCP and sets physical dimensions, but visually hidden -->
            <img 
                src="/images/sreejith-logo.png" 
                alt="Sree Jith"
                width="300"
                height="114"
                fetchpriority="high"
                loading="eager"
                decoding="sync"
                class="h-full w-auto object-contain opacity-0 pointer-events-none select-none" 
            />
            
            <!-- 2. The Color Mask: Uses the PNG as a stencil and fills it with the parent's text color -->
            <div 
                class="absolute inset-0 w-full h-full bg-current transition-colors duration-500 ease-editorial"
                style="-webkit-mask-image: url('/images/sreejith-logo.png'); -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; mask-image: url('/images/sreejith-logo.png'); mask-size: contain; mask-repeat: no-repeat; mask-position: center;"
            ></div>
            </div>

            <!-- Tagline Text: Inherits the exact same transitioning text color from the NuxtLink -->
            <span class="text-[7px] sm:text-[8px] md:text-[10px] font-uppercase tracking-[0.3em] uppercase mt-1 font-semibold text-current opacity-90 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100">
            Travel Experience Designer
            </span>
        </NuxtLink>
      </div>

      <!-- Right Side: Desktop Nav & Contact Button -->
      <div class="flex flex-1 items-center justify-end">
        <nav class="hidden lg:flex items-center gap-8 xl:gap-12 2xl:gap-20 mr-auto pl-10 2xl:pl-14">
          <NuxtLink
            v-for="link in rightLinks"
            :key="link.name"
            :to="link.path"
            :class="[
              'group relative text-xs 2xl:text-sm font-uppercase tracking-[0.2em] uppercase transition-all duration-300 ease-out font-medium group-hover:font-semibold',
              isOnLightBg ? 'text-journey-deep hover:text-intention-blue' : 'text-white/90 hover:text-heritage-gold',
            ]"
          >
            {{ link.name }}
            <span
              :class="[
                'absolute -bottom-1.5 left-1/2 h-0.5 -translate-x-1/2 transition-all duration-300 ease-out',
                isOnLightBg ? 'bg-intention-blue' : 'bg-heritage-gold',
                route.path === link.path ? 'w-full' : 'w-0 group-hover:w-full'
              ]"
            />
          </NuxtLink>
        </nav>

        <NuxtLink to="/contact" class="cursor-pointer outline-none block" aria-label="Contact Us">
          <span
            :class="[
              'relative w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center group transition-colors duration-300 ease-editorial shrink-0',
              isOnLightBg 
                ? 'border-intention-blue/30 hover:border-intention-blue active:border-intention-blue' 
                : 'border-white/35 hover:border-heritage-gold active:border-heritage-gold'
            ]"
          >
            <svg
              viewBox="0 0 64 64"
              :class="[
                'w-4.75 h-4.75 md:w-6 md:h-6 relative top-px right-px transition-all duration-300 ease-editorial group-hover:scale-110 group-active:scale-110',
                isOnLightBg 
                    ? 'text-journey-deep group-hover:text-intention-blue group-active:text-intention-blue' 
                    : 'text-white group-hover:text-heritage-gold group-active:text-heritage-gold'
              ]"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M37.063,18.062h-0.0596c-0.5522,0-0.9702,0.4478-0.9702,1s0.4775,1,1.0298,1s1-0.4478,1-1S37.6152,18.062,37.063,18.062z"/>
              <path d="M45.1787,18.062H45.123c-0.5522,0-0.9722,0.4478-0.9722,1s0.4756,1,1.0278,1s1-0.4478,1-1S45.731,18.062,45.1787,18.062z"/>
              <path d="M53.2983,18.062h-0.0596c-0.5522,0-0.9702,0.4478-0.9702,1s0.4775,1,1.0298,1s1-0.4478,1-1S53.8506,18.062,53.2983,18.062z"/>
              <path d="M45.1953,45.9268c-5.1489-2.9038-6.6909-2.6665-10.6172-0.4468c-2.0146,1.3389-4.4404,0.5225-8.6563-2.9111c-0.8276-0.6743-1.6592-1.4263-2.4688-2.2319c-0.8091-0.8125-1.5605-1.644-2.2344-2.4722c-3.1782-3.8999-4.0435-7.459-3.0112-8.5317c3.042-3.271,2.3516-5.957-0.3335-10.7173c-1.6172-3.0591-3.3931-6.104-5.7568-6.8027c-1.7139-0.5034-4.2588,0.8154-5.0166,1.3184c-1.9492,1.2983-3.8003,3.5947-4.8311,5.9937c-1.896,4.4136-1.3931,9.7329-0.29,13.2397c1.812,5.749,6.1611,12.4063,11.6348,17.8086c5.4043,5.4761,12.0615,9.8242,17.8081,11.6313c1.8154,0.5728,4.1167,0.9844,6.5283,0.9844c2.2437,0,4.583-0.3564,6.7124-1.271c2.3989-1.0327,4.6938-2.8838,5.9888-4.8306c0.5039-0.7554,1.8276-3.2998,1.3184-5.021C51.2754,49.3071,48.2305,47.5308,45.1953,45.9268z M44.2368,47.6821c1.8521,0.979,5.2998,2.8018,5.8149,4.5513c0.1056,0.3564-0.0228,1.0059-0.2598,1.681l-13.5292-7.089C38.8073,45.4165,39.8377,45.2009,44.2368,47.6821z M11.5513,13.7314c1.7524,0.5181,3.5752,3.9663,4.5674,5.8428c2.6213,4.647,2.613,6.1134,0.9274,8.0579L9.748,14.0356c0.556-0.2056,1.1049-0.3412,1.499-0.3412C11.3633,13.6943,11.4658,13.7061,11.5513,13.7314z M43.873,59.6807c-3.9175,1.6836-8.8311,1.1694-11.8501,0.2163c-5.4517-1.7144-11.8032-5.8765-16.9897-11.1328c-0.0034-0.0034-0.0063-0.0063-0.0098-0.0098C9.7695,43.5698,5.606,37.2178,3.8872,31.7642c-0.9497-3.0195-1.4619-7.9346,0.2202-11.8501c0.8441-1.9645,2.3123-3.8291,3.8699-4.948l7.923,14.7618c-0.4362,2.3732,0.9189,5.9038,3.7676,9.4001c0.7153,0.8789,1.5122,1.7607,2.3711,2.623c0.8594,0.856,1.7407,1.6528,2.6196,2.3687c3.0879,2.5153,6.3303,4.6262,9.3667,3.7915l14.8708,7.792C47.7888,57.3002,45.8823,58.816,43.873,59.6807z"/>
              <path d="M60.9551,10.771C56.3843,2.0591,45.5757-1.3105,36.8604,3.2568l-0.0005,0.0005c-8.7119,4.5723-12.0825,15.3813-7.5137,24.0952c0.3311,0.6313,0.709,1.2549,1.1274,1.8613l-2.7012,4.6299c-0.1885,0.3228-0.1812,0.7241,0.0195,1.0396c0.1997,0.3159,0.5596,0.4912,0.9321,0.4604l7.75-0.6851c2.7095,1.5068,5.6899,2.2627,8.6748,2.2627c2.8374,0,5.6787-0.6836,8.293-2.0552C62.1543,30.2944,65.5249,19.4854,60.9551,10.771z M52.5127,33.0952c-4.8472,2.543-10.5723,2.4214-15.3154-0.3252c-0.1523-0.0884-0.3257-0.1348-0.501-0.1348c-0.0293,0-0.0586,0.0015-0.0879,0.0039l-6.1338,0.542l2.0532-3.519c0.2017-0.3462,0.1777-0.7793-0.0615-1.1006c-0.5132-0.6899-0.9668-1.4092-1.3486-2.1377c-4.0571-7.7373-1.0645-17.3354,6.6719-21.396l-0.0005,0.0005c7.7378-4.0581,17.3354-1.0635,21.395,6.6719C63.2417,19.438,60.2485,29.0356,52.5127,33.0952z"/>
            </svg>
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Liquid Horizon Progress Track -->
    <div class="absolute bottom-0 left-0 w-full h-0.75 pointer-events-none z-80 overflow-hidden">
      <div
        :style="{ transform: `scaleX(${scrollProgress})` }"
        :class="[
          'liquid-horizon absolute top-0 left-0 w-full h-full origin-left transition-transform duration-150 ease-out',
          isOnLightBg
            ? 'bg-linear-to-r from-action-blue/0 via-action-blue/70 to-action-blue'
            : 'bg-linear-to-r from-heritage-gold/0 via-heritage-gold/70 to-heritage-gold'
        ]"
      />
    </div>
  </header>

  <Sidebar :is-open="isMenuOpen" @close="isMenuOpen = false" />
</template>
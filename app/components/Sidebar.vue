<!-- ~/app/components/Sidebar.vue -->

<script setup lang="ts">
import { watch, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const mainLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Itineraries', path: '/itineraries' },
  { name: 'Services', path: '/services' },
  { name: 'Impact', path: '/impact' },
  { name: 'Blog', path: '/blog' },
]

const ctaLinks = [
  { name: 'Plan Your Journey', path: '/planYourJourney' },
  { name: 'Contact', path: '/contact' }
]

const footerLinks = [
  { name: 'Frequently Asked Questions', path: '/faq' },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Terms & Conditions', path: '/terms' }
]

</script>

<template>
  <Transition name="sidebar-drawer" :duration="600">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-200 flex"
      @wheel.prevent
      @touchmove.prevent
    >
      
      <!-- Backdrop Overlay (Removed cursor-pointer) -->
      <div
        class="sidebar-overlay absolute inset-0 bg-intention-blue/60 backdrop-blur-md"
        @click="emit('close')"
      />

      <!-- Drawer Panel -->
      <aside class="sidebar-panel relative w-full md:w-112.5 h-full bg-bg-light flex flex-col shadow-2xl border-r border-border-light z-10 will-change-transform">
        
        <!-- Top Header -->
        <div class="flex items-center justify-between px-8 md:px-12 py-5 border-b border-divider-light shrink-0">
          <span class="font-uppercase text-lg tracking-[0.2em] mt-3 text-action-blue uppercase font-semibold">
            MENU
          </span>
          
          <!-- Close Button (Mobile active states mirrored) -->
          <button
            @click="emit('close')"
            class="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-intention-blue/20 flex items-center justify-center group hover:border-intention-blue active:border-intention-blue transition-colors duration-500 ease-editorial outline-none cursor-pointer"
            aria-label="Close Menu"
          >
            <div class="relative w-5 h-5 flex flex-col justify-center items-center">
              <span class="w-6 h-0.5 bg-intention-blue absolute rotate-45 transition-all duration-500 ease-editorial group-hover:rotate-180 group-hover:opacity-0 group-active:rotate-180 group-active:opacity-0" />
              <span class="w-6 h-0.5 bg-intention-blue absolute -rotate-45 transition-all duration-500 ease-editorial group-hover:-rotate-180 group-hover:opacity-0 group-active:-rotate-180 group-active:opacity-0" />
              <span class="w-5 h-0.5 bg-action-blue absolute -translate-y-1.5 opacity-0 transition-all duration-500 ease-editorial group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0" />
              <span class="w-5 h-0.5 bg-action-blue absolute translate-y-1.5 opacity-0 transition-all duration-500 ease-editorial group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0" />
            </div>
          </button>
        </div>

        <!-- Scrollable Navigation Area -->
        <div 
          class="flex flex-col grow overflow-y-auto overscroll-contain"
          @wheel.stop
          @touchmove.stop
        >
          <div class="flex flex-col px-8 md:px-12 py-8 gap-10">
            
            <!-- Main Links (Rounded MD lines + Mobile touch states) -->
            <nav class="flex flex-col gap-5">
              <NuxtLink
                v-for="(link, index) in mainLinks"
                :key="link.name"
                v-motion
                :initial="{ opacity: 0, x: -28 }"
                :enter="{
                  opacity: 1,
                  x: 0,
                  transition: { delay: 120 + index * 45, duration: 500, ease: [0.22, 1, 0.36, 1] }
                }"
                :to="link.path"
                @click="emit('close')"
                class="group relative w-fit flex items-center gap-4 text-xl md:text-2xl text-intention-blue font-uppercase font-medium uppercase tracking-wider transition-colors duration-500 ease-editorial hover:text-action-blue active:text-action-blue cursor-pointer"
              >
                <span class="w-0 h-0.5 rounded-md bg-action-blue transition-all duration-500 ease-editorial group-hover:w-8 group-active:w-8" />
                {{ link.name }}
              </NuxtLink>
            </nav>

            <!-- CTA Boxes (Click scale bounce + Mobile touch states) -->
            <div class="flex flex-col gap-4">
              <NuxtLink
                v-for="(cta, index) in ctaLinks"
                :key="cta.name"
                v-motion
                :initial="{ opacity: 0, y: 16 }"
                :enter="{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 350 + index * 90, duration: 500, ease: [0.22, 1, 0.36, 1] }
                }"
                :to="cta.path"
                @click="emit('close')"
                class="group relative w-full border border-action-blue/40 py-4 flex items-center justify-center transition-all duration-500 ease-editorial hover:border-action-blue hover:bg-action-blue/5 active:border-action-blue active:bg-action-blue/5 active:scale-[0.98] cursor-pointer"
              >
                <span class="text-sm font-uppercase font-medium tracking-[0.2em] text-intention-blue uppercase transition-colors duration-500 ease-editorial group-hover:text-action-blue group-active:text-action-blue">
                  {{ cta.name }}
                </span>
              </NuxtLink>
            </div>

            <!-- Footer Utility Links -->
            <div
              v-motion
              :initial="{ opacity: 0 }"
              :enter="{ opacity: 1, transition: { delay: 500, duration: 500 } }"
              class="flex flex-col gap-3 pb-4"
            >
              <NuxtLink
                v-for="footerLink in footerLinks"
                :key="footerLink.name"
                :to="footerLink.path"
                @click="emit('close')"
                class="w-fit text-sm font-uppercase font-medium tracking-widest text-intention-blue/60 uppercase transition-all duration-500 ease-editorial hover:text-action-blue active:text-action-blue hover:opacity-100 cursor-pointer"
              >
                {{ footerLink.name }}
              </NuxtLink>
            </div>

          </div>

          <!-- Sticky Bottom Brand Signature (Mask-Image Implementation) -->
          <div class="mt-auto px-8 md:px-12 py-5 border-t border-divider-light shrink-0 bg-bg-light flex flex-col items-start">
            <NuxtLink 
              to="/" 
              @click="emit('close')"
              class="group outline-none flex flex-col items-start transition-colors duration-500 ease-editorial text-intention-blue hover:text-action-blue active:text-action-blue cursor-pointer w-max"
            >
              <!-- Logo Container -->
              <div class="relative h-9 w-23.75 md:h-11 md:w-29 transition-transform duration-500 ease-editorial">
                <img 
                  src="/images/sreejith-logo.png" 
                  alt="Sree Jith"
                  width="300"
                  height="114"
                  fetchpriority="low"
                  loading="lazy"
                  decoding="async"
                  class="h-full w-full object-contain object-left opacity-0 pointer-events-none select-none" 
                />
                <div 
                  class="absolute inset-0 w-full h-full bg-current transition-colors duration-500 ease-editorial"
                  style="-webkit-mask-image: url('/images/sreejith-logo.png'); -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: left; mask-image: url('/images/sreejith-logo.png'); mask-size: contain; mask-repeat: no-repeat; mask-position: left;"
                ></div>
              </div>
              <span class="text-[9px] md:text-[10px] font-uppercase tracking-[0.3em] font-semibold uppercase mt-1 text-current opacity-90 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100">
                Travel Experience Designer
              </span>
            </NuxtLink>
          </div>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
/* Overlay strictly handles fading */
.sidebar-drawer-enter-active .sidebar-overlay,
.sidebar-drawer-leave-active .sidebar-overlay {
  transition: opacity 0.6s var(--ease-editorial);
}
.sidebar-drawer-enter-from .sidebar-overlay,
.sidebar-drawer-leave-to .sidebar-overlay {
  opacity: 0;
}

/* Panel strictly handles sliding */
.sidebar-drawer-enter-active .sidebar-panel,
.sidebar-drawer-leave-active .sidebar-panel {
  transition: transform 0.6s var(--ease-editorial);
}
.sidebar-drawer-enter-from .sidebar-panel,
.sidebar-drawer-leave-to .sidebar-panel {
  transform: translateX(-100%);
}
</style>
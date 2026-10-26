<!-- ~/app/components/ContactSection.vue -->
<script setup lang="ts">
interface ContactCard {
  id: string
  title: string
  value: string
  actionUrl: string
  actionLabel: string
  icon: string
}

const props = defineProps<{
  data?: any // Keeps it flexible for your incoming JSON
}>()

// By casting the fallback array as ContactCard[], TypeScript knows 
// activePayload.cards is definitively an Array, making 'index' a number automatically.
const activePayload = {
  eyebrow: props.data?.eyebrow || 'Direct Access',
  titleMain: props.data?.titleMain || 'Reach Our',
  titleHighlight: props.data?.titleHighlight || 'Concierge',
  paragraph: props.data?.paragraph || 'Whether you wish to initiate a new bespoke route, inquire about private estate buyouts, or simply speak about your travel style—we are here to listen.',
  image: props.data?.image || '/images/fallbacks/culture.webp',
  imageAlt: props.data?.imageAlt || 'Sreejith Travel Sanctuary Concierge',
  hours: {
    days: props.data?.hours?.days || 'Monday – Saturday',
    time: props.data?.hours?.time || '09:30 AM – 06:00 PM IST',
    note: props.data?.hours?.note || '24/7 active route support for travelers on the ground.'
  },
  cards: (props.data?.cards?.length ? props.data.cards : [
    {
      id: 'phone',
      title: 'Direct Call / WhatsApp',
      value: '+91 99433 60478',
      actionUrl: 'https://wa.me/919943360478',
      actionLabel: 'Message On WhatsApp',
      icon: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.7 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`
    },
    {
      id: 'email',
      title: 'Electronic Mail',
      value: 'concierge@sreejithtravel.com',
      actionUrl: 'mailto:concierge@sreejithtravel.com',
      actionLabel: 'Send An Email',
      icon: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>`
    },
    {
      id: 'address',
      title: 'Private Sanctuary HQ',
      value: 'Malabar Heritage Estate, Fort Kochi, Kerala 682001, India',
      actionUrl: 'https://maps.google.com',
      actionLabel: 'Open In Google Maps',
      icon: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`
    }
  ]) as ContactCard[]
}
</script>

<template>
  <section class="section-wrapper bg-bg-light">
    <!-- MAIN SPLIT GRID -->
    <div class="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      
      <!-- LEFT COLUMN: Intro, Cards & Working Hours (7 Cols) -->
      <div class="lg:col-span-7 flex flex-col items-start text-left w-full">
        
        <!-- Eyebrow & Titles -->
        <div v-motion-fade-up class="eyebrow-wrapper justify-start! mb-6">
          <h3 class="text-journey-deep eyebrow-text ml-0!">
            {{ activePayload.eyebrow }}
          </h3>
          <div class="bg-dark-gold/70 eyebrow-border max-w-12!" />
        </div>

        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper items-start! text-left!"
        >
          <span class="text-journey-deep section-title-sans">
            {{ activePayload.titleMain }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ activePayload.titleHighlight }}
          </span>
        </h2>

        <p
          v-motion-fade-up
          :delay="200"
          class="text-secondary-light section-paragraph mb-8 md:mb-10 max-w-xl"
        >
          {{ activePayload.paragraph }}
        </p>

        <!-- 3 CONTACT CARDS -->
        <div class="w-full flex flex-col gap-4 mb-8 md:mb-10">
          <div
            v-for="(card, index) in activePayload.cards"
            :key="card.id"
            v-motion-fade-up
            :delay="250 + (index * 50)"
            class="w-full bg-surface-light rounded-2xl p-5 sm:p-6 border border-journey-deep/10 hover:border-intention-blue/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 group"
          >
            <div class="flex items-start sm:items-center gap-4">
              <!-- Icon Container -->
              <div class="w-11 h-11 rounded-xl bg-soft-blue/20 group-hover:bg-intention-blue text-intention-blue group-hover:text-surface-light flex items-center justify-center shrink-0 transition-colors duration-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5"
                  v-html="card.icon"
                />
              </div>

              <!-- Content -->
              <div class="flex flex-col gap-0.5">
                <span class="card-eyebrow text-journey-deep/70">
                  {{ card.title }}
                </span>
                
                <a 
                  v-if="card.id === 'phone'"
                  :href="`tel:${card.value.replace(/\s+/g, '')}`" 
                  class="hero-paragraph font-medium text-primary-light leading-snug hover:text-intention-blue transition-colors"
                >
                  {{ card.value }}
                </a>
                <a 
                  v-else-if="card.id === 'email'"
                  :href="`mailto:${card.value}`" 
                  class="hero-paragraph font-medium text-primary-light leading-snug hover:text-intention-blue transition-colors"
                >
                  {{ card.value }}
                </a>
                <span v-else class="hero-paragraph font-medium text-primary-light leading-snug pr-2">
                  {{ card.value }}
                </span>
              </div>
            </div>

            <!-- Direct Action Button -->
            <a
              :href="card.id === 'phone' ? `tel:${card.value.replace(/\s+/g, '')}` : (card.id === 'email' ? `mailto:${card.value}` : card.actionUrl)"
              :target="card.id === 'address' ? '_blank' : '_self'"
              :rel="card.id === 'address' ? 'noopener noreferrer' : undefined"
              class="self-start sm:self-auto px-4 py-2.5 rounded-lg border border-journey-deep/15 text-journey-deep hover:bg-intention-blue hover:text-surface-light hover:border-intention-blue card-tag font-bold transition-all duration-300 shrink-0 inline-flex items-center gap-2 select-none"
            >
              <span class="pt-0.5">{{ card.id === 'phone' ? 'Call Us' : card.actionLabel }}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- WORKING HOURS BLOCK -->
        <div 
          v-motion-fade-up
          :delay="450"
          class="w-full bg-soft-cream/25 rounded-2xl p-6 border border-journey-deep/10 flex flex-col gap-3 relative overflow-hidden"
        >
          <div class="flex items-center gap-3">
            <span class="w-2 h-2 rounded-full bg-dark-gold animate-pulse shadow-[0_0_8px_rgba(168,106,8,0.6)]" />
            <h4 class="hero-paragraph font-semibold text-journey-deep">Concierge Hours</h4>
          </div>
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 section-subparagraph text-secondary-light border-t border-journey-deep/10 pt-3 mt-1">
            <span class="font-medium">{{ activePayload.hours.days }}</span>
            <span class="font-bold text-intention-blue tracking-wide">{{ activePayload.hours.time }}</span>
          </div>

          <p class="card-paragraph text-secondary-light/80 italic">
            {{ activePayload.hours.note }}
          </p>
        </div>

      </div>

      <!-- RIGHT COLUMN: Visual Aspect Card (5 Cols) -->
      <div 
        v-motion-fade-up
        :delay="300"
        class="lg:col-span-5 flex justify-center w-full lg:sticky lg:top-28"
      >
        <div class="relative w-full max-w-lg lg:w-full aspect-square rounded-4xl overflow-hidden shadow-sm border border-journey-deep/10 group">
          <!-- Image -->
          <img
            :src="activePayload.image"
            :alt="activePayload.imageAlt"
            class="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />

          <!-- Gradient Overlay -->
          <div class="absolute inset-0 bg-linear-to-t from-journey-deep/80 via-journey-deep/10 to-transparent pointer-events-none" />

          <!-- Subtle Corner Floating Badge -->
          <div class="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-surface-light/10 backdrop-blur-md border border-surface-light/20 text-surface-light flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-intention-blue text-surface-light flex items-center justify-center shrink-0 shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="hero-paragraph font-medium leading-tight">Personalized Care</span>
              <span class="card-paragraph font-light text-surface-light/90">Every inquiry is reviewed directly by our founders.</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
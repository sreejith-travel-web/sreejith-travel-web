<!-- ~/app/pages/contact.vue -->
<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import ContactSection from '~/components/ContactSection.vue'

const pageData = {
  hero: {
    eyebrow: 'Get In Touch',
    titleMain: 'Start A Conversation',
    titleItalic: 'With Our Studio',
    intro: 'Whether you have a specific route in mind or simply a spark of curiosity, we are here to listen and guide your next steps.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Contact Sreejith Travel Experience Designer'
  },
  contactDetails: {
    eyebrow: 'Direct Access',
    titleMain: 'Reach Our',
    titleHighlight: 'Concierge',
    paragraph: 'Whether you wish to initiate a new bespoke route, inquire about private estate buyouts, or simply speak about your travel style—we are here to listen.',
    image: '/images/fallbacks/culture.webp',
    imageAlt: 'Sreejith Travel Sanctuary Concierge',
    hours: {
      days: 'Monday – Saturday',
      time: '09:30 AM – 06:00 PM IST',
      note: '24/7 active route support for travelers on the ground.'
    },
    cards: [
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
    ]
  }
}
</script>

<template>
  <div class="w-full">
    <PageHero class="bg-bg-light" :data="pageData.hero" />
    
    <!-- Passes the fully structured JSON data down to the brand-compliant section component -->
    <ContactSection class="bg-bg-light" :data="pageData.contactDetails" />
  </div>
</template>
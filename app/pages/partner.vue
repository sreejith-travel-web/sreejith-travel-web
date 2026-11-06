<!-- ~/app/pages/partner.vue -->
<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import InnerPageHeader, { type InnerPageHeaderConfig } from '~/components/InnerPageHeader.vue'
import PartnerInner, { type PartnerInnerConfig } from '~/components/PartnerInner.vue'

const pageData: {
  hero: {
    eyebrow: string
    titleMain: string
    titleItalic: string
    intro: string
    imageDesktop: string
    imageMobile: string
    alt: string
  }
  intro: InnerPageHeaderConfig
  content: PartnerInnerConfig
} = {
  hero: {
    eyebrow: 'Bespoke Concierge',
    titleMain: 'Seamless Luxury & Access',
    titleItalic: 'Tailored To Your Rhythm',
    intro: 'From private heritage access and scholar-led walks to boutique hideaways, every detail is orchestrated with quiet precision.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Luxury travel design services'
  },
  intro: {
    eyebrow: 'Work Together',
    titleLine1: 'Let’s build meaningful tourism',
    titleLine2Cursive: 'Together.',
    description: 'I collaborate with travel professionals, brands, organisations, and global partners to design immersive, responsible and high-quality travel experiences across South India and beyond.'
  },
  content: {
    partnerships: {
      eyebrow: 'Partnerships',
      title: 'Creating meaningful journeys Together.',
      description: 'I work with travel agents, tour operators, event planners, brands and like-minded organisations to co-create authentic, culturally immersive and sustainable travel experiences across South India.',
      image: '/images/fallbacks/culture.webp',
      imageAlt: 'Meaningful travel partnerships across South India',
      cards: [
        {
          icon: 'users',
          title: 'B2B Travel Trade Partnerships',
          description: 'Collaborate on tailor-made itineraries, special interest tours and unique stays for your clients.'
        },
        {
          icon: 'building',
          title: 'Corporate Experiences',
          description: 'Design impactful offsites, leadership journeys and team experiences rooted in place and culture.'
        },
        {
          icon: 'chat',
          title: 'Consulting & Speaking',
          description: 'Share insights through consulting, keynote talks and panel discussions on responsible and meaningful tourism.'
        },
        {
          icon: 'book',
          title: 'Education & Research',
          description: 'Partner on educational journeys, study tours and research projects that support local communities and heritage.'
        }
      ]
    },
    network: {
      eyebrow: 'The Network',
      title: 'Join the Network',
      paragraphs: [
        'We’re always looking for unique stays providers, passionate travel creators, storytellers, artisans, performers and experience providers who share a commitment to meaningful and responsible tourism.',
        'Become part of a trusted network that celebrates local communities, supports sustainable livelihoods and creates enriching travel experiences for discerning travellers.'
      ],
      image: '/images/fallbacks/culture.webp',
      imageAlt: 'Join the trusted network of local creators and stays'
    }
  }
}
</script>

<template>
  <div class="overflow-x-hidden">
    <PageHero :data="pageData.hero" />
    <InnerPageHeader :data="pageData.intro" />
    <PartnerInner :data="pageData.content" />
  </div>
</template>
<!-- ~/app/pages/about.vue -->


<!-- const pageData = {
  hero: {
    eyebrow: 'Our Story & Philosophy',
    titleMain: 'Crafting Meaningful Journeys',
    titleItalic: 'Rooted in Local Wisdom',
    intro: 'We bridge the gap between discerning travelers and the living, breathing heritage of India through deeply personal storytelling.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'About Sreejith Travel Experience Designer'
  }
} -->


<!-- ~/app/pages/about.vue -->
<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import AboutInner from '~/components/AboutInner.vue'

const pageData = {
  hero: {
    eyebrow: 'TRAVEL EXPERIENCE DESIGNER',
    titleMain: 'Travel, Through a',
    titleItalic: 'Different Lens',
    intro: 'A Journey Designed Through People, Places & Stories.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Sree Jith Palliyil - Travel Experience Designer'
  },
  content: {
    founder: {
      eyebrow: 'THE FOUNDER',
      titleLine1: 'Designing Journeys',
      titleLine2Cursive: 'Became My Craft.',
      bioParagraph: 'I’m Sree Jith Palliyil, a travel experience designer and founder of Moksha Stories. I create bespoke journeys across India, inspired by its people, places, living cultures, and stories, through meaningful encounters, rare access, and deep local connections.',
      roleBadges: [
        'Travel Experience Designer',
        'Founder, Moksha Stories',
        'Responsible Tourism Advocate',
        'Art & Cultural Curator'
      ],
      summaryParagraph: 'For more than 17 years, curiosity has taken me deeper into India’s villages, heritage spaces, cultural traditions, landscapes, and communities. What began as a fascination with people and their stories gradually became a way of designing travel.',
      portraitImage: '/images/fallbacks/culture.webp',
      portraitAlt: 'Portrait of Sree Jith Palliyil',
      worldEyebrow: 'PEOPLE, PLACES & STORIES',
      worldTitle: 'India is not one story.',
      worldDescription: 'It is a vast collection of living cultures, landscapes, traditions, and ways of life—each shaped by the people who call it home. I look for the details that bring those places to life: a craft passed between generations, a local festival, a traditional meal, a landscape understood through lived experience, or a story shared by someone who knows it best.',
      worldTags: ['People', 'Culture', 'Craft', 'Heritage', 'Food', 'Nature', 'Stories']
    },
    journeySoFar: {
      chapters: [
        {
          id: 'where-it-began',
          eyebrow: 'WHERE IT BEGAN',
          title: 'Curiosity became exploration. Exploration became my work.',
          paragraphs: [
            'I grew up in a culture where stories were not simply told—they were lived; where festivals, traditions, crafts, music, food, and folklore were woven into everyday life.',
            'As I travelled deeper into India, I became fascinated by the people who carried these traditions forward and the knowledge they shared. Over time, I discovered that the most compelling stories were often found beyond the usual itinerary. I started looking beyond the obvious places and searching for the stories behind them.',
            'The more I explored, the more I realised how much of India’s living heritage remains unseen—and how much of it is increasingly fragile. That curiosity took me beyond familiar places. I began travelling, researching, documenting, and building relationships across India. At one point, I chose to leave my corporate career and follow that path more deeply.'
          ],
          staccatoList: [
            'An old house.',
            'A forgotten craft.',
            'A local festival.',
            'A family recipe.',
            'A musician.',
            'A storyteller.'
          ],
          image: '/images/fallbacks/culture.webp',
          imageAlt: 'Living heritage and village traditions across India',
          imageCaption: '01 / Living traditions & unseen heritage'
        },
        {
          id: 'what-i-wanted-to-create',
          eyebrow: 'THE INTENTION',
          title: 'What I Wanted to Create',
          paragraphs: [
            'I wanted travellers to experience these stories, not simply hear about them.'
          ],
          bulletList: [
            'To meet the people behind them.',
            'To understand the effort, knowledge, and history behind a craft.',
            'To enter places with context rather than simply pass through them.',
            'And to create journeys where the traveller and the community both gain something meaningful from the encounter.'
          ],
          closingLine: 'That is how my curiosity became my craft.',
          image: '/images/fallbacks/culture.webp',
          imageAlt: 'Artisan craft and immersive cultural encounters',
          imageCaption: '02 / Entering places with context and care'
        },
        {
          id: 'moksha-stories',
          eyebrow: 'THE JOURNEY SO FAR',
          title: 'From curiosity to meaningful journeys.',
          paragraphs: [
            'I founded Moksha Stories to bring years of exploration, cultural discovery, and local relationships into the journeys I create.',
            'I wanted travellers to do more than visit a place. I wanted them to meet the people who give it character, understand the stories behind it, and experience its living culture with context and care.',
            'Local knowledge and personal connections are part of the design from the beginning. They help shape experiences that feel thoughtful, immersive, and personal.'
          ],
          externalCta: {
            label: 'Explore Moksha Stories',
            href: 'https://mokshastories.com'
          },
          image: '/images/fallbacks/culture.webp',
          imageAlt: 'Moksha Stories bespoke cultural journeys',
          imageCaption: '03 / Founding Moksha Stories'
        }
      ]
    },
    boutiquePhilosophy: {
      eyebrow: 'BOUTIQUE BY CHOICE',
      titleLine1: 'Fewer Journeys.',
      titleLine2Cursive: 'Deeper Attention.',
      description: 'I intentionally design a limited number of journeys each year. Not because I want to do less—because I want to be involved more. More attention to the details, more time with the people involved, and greater flexibility to shape the journey around you from the first conversation to the final day.',
      mantras: [
        'Quality over quantity.',
        'Connection over crowds.',
        'Meaning over checklists.'
      ],
      custodiansTitle: 'I Don’t Just Know Places. I Know People.',
      custodiansIntro: 'Over the years, I have built trusted relationships with people who understand their places from the inside.',
      custodianPills: [
        'Cultural Custodians',
        'Artists & Artisans',
        'Historians & Academics',
        'Storytellers',
        'Naturalists & Local Experts',
        'Chefs & Food Keepers',
        'Heritage Practitioners',
        'Community Hosts'
      ],
      stats: [
        {
          value: 17,
          suffix: '+',
          label: 'Years of research, exploration & travel design'
        },
        {
          value: 400,
          suffix: '+',
          label: 'Cultural practitioners, storytellers & local experts'
        },
        {
          value: 100,
          suffix: '+',
          label: 'Villages & communities connected across India'
        },
        {
          value: 120,
          suffix: '+',
          label: 'Bespoke experiences & circuits designed'
        },
        {
          value: 2025,
          suffix: '',
          sublabel: 'OUTLOOK TRAVELLER',
          label: 'Responsible Tourism Award — India'
        }
      ]
    },
    lookAndBeyond: {
      lookFor: {
        eyebrow: 'MY IDEA OF MEANINGFUL TRAVEL',
        title: 'What I Look For',
        subtitle: 'The extraordinary is rarely on the standard itinerary. Because travel becomes memorable when it becomes personal.',
        closingNote: 'Meet the artisans, historians, and custodians who bring these encounters to life.',
        networkCtaLabel: 'Explore the Network',
        networkCtaTo: '/partner',
        cards: [
          {
            tag: 'PEOPLE',
            title: 'The people who carry a place’s stories.',
            moment: 'A conversation with a historian.',
            image: '/images/fallbacks/culture.webp',
            imageAlt: 'People carrying regional stories'
          },
          {
            tag: 'CULTURE',
            title: 'Traditions that are still lived, not simply displayed.',
            moment: 'A village festival.',
            image: '/images/fallbacks/culture.webp',
            imageAlt: 'Living cultural festival'
          },
          {
            tag: 'ART & CRAFT',
            title: 'The hands, knowledge, and stories behind what is made.',
            moment: 'A workshop inside an artisan’s world.',
            image: '/images/fallbacks/culture.webp',
            imageAlt: 'Master artisan workshop'
          },
          {
            tag: 'PLACE',
            title: 'Landscapes and heritage understood beyond the surface.',
            moment: 'A landscape shared by generations.',
            image: '/images/fallbacks/culture.webp',
            imageAlt: 'Heritage landscape in India'
          },
          {
            tag: 'CONNECTION',
            title: 'Encounters that feel genuine rather than staged.',
            moment: 'A meal prepared from a family recipe.',
            image: '/images/fallbacks/culture.webp',
            imageAlt: 'Shared family culinary tradition'
          },
          {
            tag: 'MOMENTS',
            title: 'Experiences that could never be replicated elsewhere.',
            moment: 'Unscripted moments of grace.',
            image: '/images/fallbacks/culture.webp',
            imageAlt: 'Unscripted travel moment'
          }
        ]
      },
      beyond: {
        eyebrow: 'A FEW OTHER SIDES OF MY WORK',
        title: 'Curiosity takes many forms.',
        paragraphs: [
          'Travel design is only one part of what keeps me curious. I am drawn to architecture, heritage, history, cinema, food, traditional arts, old houses, forgotten stories, and the people who preserve them.',
          'You’ll often find me researching something long before it becomes part of a journey. My work and interests extend beyond itineraries—bringing together heritage, hospitality, culture, and the ways people experience a place.'
        ],
        pursuits: [
          {
            index: '01',
            title: 'Tourism Advisory',
            description: 'Advisor to the Ministry of Tourism, Government of Kerala, from 2021 to 2025.'
          },
          {
            index: '02',
            title: 'Heritage Practice',
            description: 'Working with historic spaces, oral histories, and heritage hospitality.'
          },
          {
            index: '03',
            title: 'Hospitality Consulting',
            description: 'Advising on experience design for heritage stays, resorts, and hospitality projects.'
          },
          {
            index: '04',
            title: 'Accessible Travel',
            description: 'Exploring more inclusive and thoughtful ways for people to experience the world.'
          },
          {
            index: '05',
            title: 'Agriculture',
            description: 'Cultivating indigenous GI-tagged Matta rice in Kerala.'
          }
        ],
        closingLine: 'These interests often find their way back into the journeys I design.'
      }
    },
    finale: {
      routingEyebrow: 'EXPLORE THE ECOSYSTEM',
      routingTitle: 'Where Curiosity Leads Next',
      routingCards: [
        {
          eyebrow: 'THE NETWORK',
          title: 'Meet the People',
          description: 'Discover the regional designers, storytellers, and 200+ grassroots communities behind our journeys.',
          linkLabel: 'Explore Network',
          to: '/partner',
          image: '/images/fallbacks/culture.webp',
          imageAlt: 'Collaborated travel designers and community network'
        },
        {
          eyebrow: 'REGENERATIVE IMPACT',
          title: 'Journey Beyond Destination',
          description: 'Travel should create value on both sides—supporting local livelihoods and preserving living heritage.',
          linkLabel: 'View Our Impact',
          to: '/impact',
          image: '/images/fallbacks/culture.webp',
          imageAlt: 'Regenerative travel and community impact'
        },
        {
          eyebrow: 'BESPOKE CIRCUITS',
          title: 'Meaningful Encounters',
          description: 'Meaningful for the person. Mindful of the place. Joyful to the people who welcome you.',
          linkLabel: 'Explore Itineraries',
          to: '/itineraries',
          image: '/images/fallbacks/culture.webp',
          imageAlt: 'Curated South India itineraries'
        },
        {
          eyebrow: 'FIELD NOTES',
          title: 'What Travel Means to Me',
          description: 'Places tell you where you are. Stories tell you how it was. People tell you why it matters.',
          linkLabel: 'Read the Journal',
          to: '/journal',
          image: '/images/fallbacks/culture.webp',
          imageAlt: 'Stories and field notes from the journal'
        }
      ],
      curiousEyebrow: 'THE JOURNEY CONTINUES',
      curiousTitle: 'Still Curious',
      curiousDescription: 'There are still places I haven’t explored, people I haven’t met, and traditions I have yet to understand. That curiosity continues to shape my work—and the conversations, discoveries, and journeys still to come.',
      quoteText: 'The best travel experiences aren’t measured only by the places you visit, but by the people you meet, the cultures you experience, and the stories you discover.',
      quoteAuthor: 'Sree Jith Palliyil',
      ctaTitle: 'Let’s begin your journey',
      ctaDescription: 'Tell me what inspires you, what you’re curious about, and what you want your journey to feel like.',
      primaryCta: {
        label: 'Plan Your Journey',
        to: '/planYourJourney'
      },
      secondaryCta: {
        label: 'Consult With Me',
        to: '/contact'
      }
    }
  }
}
</script>

<template>
  <div class="overflow-x-clip">
    <PageHero :data="pageData.hero" />
    <AboutInner :data="pageData.content" />
  </div>
</template>
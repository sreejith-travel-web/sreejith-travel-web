<!-- ~/app/pages/index.vue -->

<script setup lang="ts">
import HomeHero from '~/components/HomeHero.vue'
import HomeAbout from '~/components/HomeAbout.vue'

// Preload the responsive LCP poster image at 0ms so it doesn't wait for CSS parsing
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: '/images/video-posters/sreejith-hero-portrait.webp',
      type: 'image/webp',
      media: '(max-width: 767px)',
      fetchpriority: 'high'
    },
    {
      rel: 'preload',
      as: 'image',
      href: '/images/video-posters/sreejith-hero-landscape.webp',
      type: 'image/webp',
      media: '(min-width: 768px)',
      fetchpriority: 'high'
    }
  ]
})

const pageData = {
  hero: {
    mode: 'slideshow' as const,
    autoplay: true,
    autoplayIntervalMs: 8500,
    subtitleText: 'Regenerative Travel Experiences',
    headingLine1: 'Designing Cultural Immersive Travel Experiences in India',
    headingLine2Italic: 'Inspired by People, Places & Stories',
    description: 'Designing luxury bespoke journeys bringing together meaningful encounters, rare access, and authentic stories that conventional tourism simply cannot offer.',
    slides: [
      {
        type: 'image' as const,
        imageDesktop: '/images/home/forest-landscape.webp',
        imageMobile: '/images/home/forest-portrait.webp',
        alt: 'Forests, nature and mountain expeditions and trekking'
      },
      {
        type: 'video' as const,
        videoWebm: '/videos/sreejith-hero.webm',
        videoMp4: '/videos/sreejith-hero.mp4',
        imageDesktop: '/images/video-posters/sreejith-hero-landscape.webp',
        imageMobile: '/images/video-posters/sreejith-hero-portrait.webp',
        alt: 'Scenic river boating & Kerala backwaters signature tour'
      },
      {
        type: 'image' as const,
        imageDesktop: '/images/home/solo-landscape.webp',
        imageMobile: '/images/home/solo-portrait.webp',
        alt: 'Lush natural hill regions and bespoke local experiences'
      }
    ]
  },

  about: {
      greeting: 'Hello,',
      name: "I’m Sreejith",
      designations: [
        'Travel Experiences Designer',
        'Sustainable Travel Expert',
        'Art & Cultural Curator'
      ],
      paragraph:
        "Creating bespoke luxury journeys in India with a trusted local network of cultural custodians, storytellers, artisans, historians, and local experts. I approach travel as an art – bringing together meaningful encounters, rare access, authentic stories and regenerative travel that conventional tourism can't.",
      quoteText:
        "The best travel experiences aren’t measured by the places you visit, but by the people you meet, the cultures you experience, the stories you discover, and the lasting positive impact you leave behind.",
      signatureImage: '/images/sreejith-logo.png',
      portraitImage: '/images/home/about-sreejith.webp',
      portraitAlt: 'Sreejith - Travel Experiences Designer & Cultural Collage',
      stats: [
        {
          value: '2025',
          subtitle: 'AWARD-WINNING',
          description: 'Outlook Traveller – Responsible Tourism Award (India 2025).'
        },
        {
          value: '17+ YEARS',
          subtitle: 'RESEARCH, DISCOVERY & DESIGN',
          description:
            'Over a decade and a half of cultural research, field exploration, authentic local relationships and travel design.'
        },
        {
          value: '400+',
          subtitle: 'EXCLUSIVE LOCAL ACCESS',
          description: 'Cultural practitioners, local storytellers and community partners.'
        }
      ],
      ctaLabel: 'Explore My Story',
      ctaTo: '/about'
    },

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
      slides: [
        {
          id: 'exp-1',
          image: '/images/itineraries/dummy1.webp',
          alt: 'Theyyam ritual performance in North Kerala',
          eyebrow: 'Kerala',
          title: 'Cultural Immersions',
          tags: ['People', 'Traditions', 'Stories']
        },
        {
          id: 'exp-2',
          image: '/images/itineraries/dummy2.webp',
          alt: 'Misty tea estates and mountain trails in Munnar',
          eyebrow: 'Munnar & Beyond',
          title: 'Landscapes & Retreats',
          tags: ['Nature', 'Wellness', 'Slow Travel']
        },
        {
          id: 'exp-3',
          image: '/images/itineraries/dummy3.webp',
          alt: 'Traditional houseboat gliding across tranquil backwaters at sunset',
          eyebrow: 'Backwaters',
          title: 'Rivers & Life',
          tags: ['Water', 'Villages', 'Local Life']
        },
        {
          id: 'exp-4',
          image: '/images/itineraries/dummy4.webp',
          alt: 'Ancient Dravidian temple architecture and stone pillars',
          eyebrow: 'Tamil Nadu',
          title: 'Heritage Trails',
          tags: ['Temples', 'History', 'Living Culture']
        },
        {
          id: 'exp-5',
          image: '/images/itineraries/dummy5.webp',
          alt: 'Authentic South Indian feast served on a fresh banana leaf',
          eyebrow: 'South India',
          title: 'Culinary Journeys',
          tags: ['Flavours', 'People', 'Traditions']
        },
        {
          id: 'exp-6',
          image: '/images/itineraries/dummy6.webp',
          alt: 'Palm-fringed rocky coastline at golden hour',
          eyebrow: 'Kerala Coast',
          title: 'Coastal Escapes',
          tags: ['Beaches', 'Islands', 'Hidden Gems']
        },
        {
          id: 'exp-7',
          image: '/images/itineraries/dummy7.webp',
          alt: 'Wild elephant walking through a lush forest landscape',
          eyebrow: 'Western Ghats',
          title: 'Into the Wild',
          tags: ['Wildlife', 'Forests', 'Conservation']
        },
        {
          id: 'exp-8',
          image: '/images/itineraries/dummy8.webp',
          alt: 'Local artisan working by hand inside a traditional workshop',
          eyebrow: 'Craft Villages',
          title: 'Hands & Heritage',
          tags: ['Artisans', 'Craft', 'Communities']
        },
        {
          id: 'exp-9',
          image: '/images/itineraries/dummy9.webp',
          alt: 'Hikers following a mountain trail through the Western Ghats',
          eyebrow: 'Highlands',
          title: 'Trails & Treks',
          tags: ['Trekking', 'Mountains', 'Adventure']
        },
        {
          id: 'exp-10',
          image: '/images/itineraries/dummy10.webp',
          alt: 'Classical Indian dancer performing in traditional attire',
          eyebrow: 'Tamil Nadu',
          title: 'Rhythm & Ritual',
          tags: ['Dance', 'Music', 'Performance']
        },
        {
          id: 'exp-11',
          image: '/images/itineraries/dummy11.webp',
          alt: 'Peaceful heritage retreat surrounded by tropical greenery',
          eyebrow: 'South India',
          title: 'Heritage Stays',
          tags: ['Boutique', 'Architecture', 'Slow Living']
        },
        {
          id: 'exp-12',
          image: '/images/itineraries/dummy12.webp',
          alt: 'Fishermen navigating a traditional canoe through quiet village waters',
          eyebrow: 'Village Kerala',
          title: 'Life by the Water',
          tags: ['Communities', 'Backwaters', 'Local Life']
        },
        {
          id: 'exp-13',
          image: '/images/itineraries/dummy13.webp',
          alt: 'Traditional wellness treatment in a serene natural setting',
          eyebrow: 'Kerala',
          title: 'Wellness & Renewal',
          tags: ['Ayurveda', 'Wellness', 'Mindfulness']
        },
        {
          id: 'exp-14',
          image: '/images/itineraries/dummy14.webp',
          alt: 'Travellers sharing an intimate experience with a local community',
          eyebrow: 'Beyond the Map',
          title: 'Meaningful Encounters in the wildest forests',
          tags: ['People', 'Connection', 'Stories']
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
      infinite: false,
      initialIndex: 0,
      autoplay: false,
      autoplayIntervalMs: 5500,
      enableHoverGap: true,
      showCardOverlay: true,
      aspectRatio: '2 / 3',
      imageWidth: 400,
      imageHeight: 600,
      slides: [
        {
          id: 'exp-1',
          image: '/images/itineraries/dummy1.webp',
          alt: 'Theyyam ritual performance in North Kerala',
          eyebrow: 'Kerala',
          title: 'Cultural Immersions',
          tags: ['People', 'Traditions', 'Stories']
        },
        {
          id: 'exp-2',
          image: '/images/itineraries/dummy2.webp',
          alt: 'Misty tea estates and mountain trails in Munnar',
          eyebrow: 'Munnar & Beyond',
          title: 'Landscapes & Retreats',
          tags: ['Nature', 'Wellness', 'Slow Travel']
        },
        {
          id: 'exp-3',
          image: '/images/itineraries/dummy3.webp',
          alt: 'Traditional houseboat gliding across tranquil backwaters at sunset',
          eyebrow: 'Backwaters',
          title: 'Rivers & Life',
          tags: ['Water', 'Villages', 'Local Life']
        },
        {
          id: 'exp-4',
          image: '/images/itineraries/dummy4.webp',
          alt: 'Ancient Dravidian temple architecture and stone pillars',
          eyebrow: 'Tamil Nadu',
          title: 'Heritage Trails',
          tags: ['Temples', 'History', 'Living Culture']
        },
        {
          id: 'exp-5',
          image: '/images/itineraries/dummy5.webp',
          alt: 'Authentic South Indian feast served on a fresh banana leaf',
          eyebrow: 'South India',
          title: 'Culinary Journeys',
          tags: ['Flavours', 'People', 'Traditions']
        },
        {
          id: 'exp-6',
          image: '/images/itineraries/dummy6.webp',
          alt: 'Palm-fringed rocky coastline at golden hour',
          eyebrow: 'Kerala Coast',
          title: 'Coastal Escapes',
          tags: ['Beaches', 'Islands', 'Hidden Gems']
        },
        {
          id: 'exp-7',
          image: '/images/itineraries/dummy7.webp',
          alt: 'Wild elephant walking through a lush forest landscape',
          eyebrow: 'Western Ghats',
          title: 'Into the Wild',
          tags: ['Wildlife', 'Forests', 'Conservation']
        },
        {
          id: 'exp-8',
          image: '/images/itineraries/dummy8.webp',
          alt: 'Local artisan working by hand inside a traditional workshop',
          eyebrow: 'Craft Villages',
          title: 'Hands & Heritage',
          tags: ['Artisans', 'Craft', 'Communities']
        },
        {
          id: 'exp-9',
          image: '/images/itineraries/dummy9.webp',
          alt: 'Hikers following a mountain trail through the Western Ghats',
          eyebrow: 'Highlands',
          title: 'Trails & Treks',
          tags: ['Trekking', 'Mountains', 'Adventure']
        },
        {
          id: 'exp-10',
          image: '/images/itineraries/dummy10.webp',
          alt: 'Classical Indian dancer performing in traditional attire',
          eyebrow: 'Tamil Nadu',
          title: 'Rhythm & Ritual',
          tags: ['Dance', 'Music', 'Performance']
        },
        {
          id: 'exp-11',
          image: '/images/itineraries/dummy11.webp',
          alt: 'Peaceful heritage retreat surrounded by tropical greenery',
          eyebrow: 'South India',
          title: 'Heritage Stays',
          tags: ['Boutique', 'Architecture', 'Slow Living']
        },
        {
          id: 'exp-12',
          image: '/images/itineraries/dummy12.webp',
          alt: 'Fishermen navigating a traditional canoe through quiet village waters',
          eyebrow: 'Village Kerala',
          title: 'Life by the Water',
          tags: ['Communities', 'Backwaters', 'Local Life']
        },
        {
          id: 'exp-13',
          image: '/images/itineraries/dummy13.webp',
          alt: 'Traditional wellness treatment in a serene natural setting',
          eyebrow: 'Kerala',
          title: 'Wellness & Renewal',
          tags: ['Ayurveda', 'Wellness', 'Mindfulness']
        },
        {
          id: 'exp-14',
          image: '/images/itineraries/dummy14.webp',
          alt: 'Travellers sharing an intimate experience with a local community',
          eyebrow: 'Beyond the Map',
          title: 'Meaningful Encounters',
          tags: ['People', 'Connection', 'Stories']
        }
      ]
    }
  }

  // Future sections will be populated here in the same payload
  // about: { ... },
}


</script>

<template>
  <div class="2xs:overflow-x-hidden">
    <!-- Hero Section -->
    <HomeHero :data="pageData.hero" />

    <!-- About Section -->
    <HomeAbout :data="pageData.about" class="bg-surface-light"/>

    <!-- Signature Experiences -->
    <HomeItinerarySection :data="pageData.signature" />
    
    <!-- Collaborated Itineraries -->
    <HomeItinerarySection :data="pageData.collaborated" class="bg-surface-light" />

    <!-- Placeholder for the next section -->
    <section
      data-theme="light"
      class="py-24 px-4 md:px-8 lg:px-12 bg-bg-light text-primary-light flex flex-col items-center justify-center text-center min-h-[120vh]"
    >
      <div class="max-w-3xl flex flex-col items-center">
        <span class="font-cursive text-3xl md:text-4xl text-action-blue mb-4">
          Capturing India
        </span>
        <h2 class="text-3xl md:text-5xl font-bold tracking-tight text-ink-dark mb-6">
          Light Section (Header switches back to Ink Mode)
        </h2>
        <p class="text-base text-secondary-light leading-relaxed mb-8">
          This section will eventually receive its own chunk of pageData.
        </p>
        
        <!-- CTAs -->
        <div
          v-motion
          :initial="{ opacity: 0, y: 10 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 400, ease: 'easeOut', delay: 250 } }"
          class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-[90vw] will-change-transform transition-transform duration-700 ease-out"
        >
          <CtaButton to="/itineraries" label="Explore Itineraries" variant="light" />
          <CtaButton to="/planYourJourney" label="Plan Your Journey" variant="light" />
        </div>
      </div>
    </section>
  </div>
</template>
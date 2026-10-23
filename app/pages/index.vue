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

const signatureIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" /></svg>`;
const collaboratedIconSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v5"></path><path d="M12 17v5"></path><path d="M2 12h5"></path><path d="M17 12h5"></path><path d="M5.8 5.8l2.1 2.1"></path><path d="M16.1 16.1l2.1 2.1"></path><path d="M18.2 5.8l-2.1 2.1"></path><path d="M7.9 16.1l-2.1 2.1"></path><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"></circle></svg>`;
const featuredStarSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>`;

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
        type: 'video' as const,
        videoWebm: '/videos/sreejith-hero.webm',
        videoMp4: '/videos/sreejith-hero.mp4',
        imageDesktop: '/images/video-posters/sreejith-hero-landscape.webp',
        imageMobile: '/images/video-posters/sreejith-hero-portrait.webp',
        alt: 'Scenic river boating & Kerala backwaters signature tour'
      },
      {
        type: 'image' as const,
        imageDesktop: '/images/home/forest-landscape.webp',
        imageMobile: '/images/home/forest-portrait.webp',
        alt: 'Forests, nature and mountain expeditions and trekking'
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

    categories: {
      eyebrow: 'CATEGORIZED EXPERIENCES',
      titleLine1: 'TRAVEL YOUR WAY',
      titleLine2Cursive: 'Discover Your Style.',
      subtitle: 'Explore by what moves you. Select a path below to begin crafting your bespoke journey.',
      bottomQuote: 'The true luxury of travel lies in the freedom to choose your own pace, path, and purpose.',
      ctaLabel: 'Explore All Experiences',
      ctaTo: '/itineraries',
      items: [
        {
          id: '01',
          title: 'Nature & Wilderness',
          description: 'Reconnect with wild landscapes, forests and coastlines.',
          image: '/images/itineraries/category/nature.webp',
          alt: 'Moonlit mountain lake through tropical foliage',
          to: '/itineraries'
        },
        {
          id: '02',
          title: 'Culture & Heritage',
          description: 'Discover living traditions, timeless art and heritage.',
          image: '/images/itineraries/category/culture.webp',
          alt: 'Terracotta Temple Portico at Sunset',
          to: '/itineraries'
        },
        {
          id: '03',
          title: 'Places to Stay',
          description: 'Find thoughtful stays rooted in comfort and local charm.',
          image: '/images/itineraries/category/stay.webp',
          alt: 'Kerala Courtyard with Golden Arches',
          to: '/itineraries'
        },
        {
          id: '04',
          title: 'Offbeat Explorations',
          description: 'Follow lesser-known paths to unexpected discoveries.',
          image: '/images/itineraries/category/offbeat.webp',
          alt: 'Engraved River Trail and Compass',
          to: '/itineraries'
        },
        {
          id: '05',
          title: 'Wellness & Spirit',
          description: 'Restore your balance through mindful, soulful journeys.',
          image: '/images/itineraries/category/wellness.webp',
          alt: 'Ochre Lotus Over Rippling Hills',
          to: '/itineraries'
        },
        {
          id: '06',
          title: 'Bespoke Luxury',
          description: 'Enjoy exceptional comfort with a deeply personal touch.',
          image: '/images/itineraries/category/bespoke.webp',
          alt: 'Teal coastal terrace under palm fronds',
          to: '/itineraries'
        }
      ]
    },

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
    <LazyHomeItinerarySection hydrate-on-visible :data="pageData.signature" />
    
    <!-- Collaborated Itineraries -->
    <LazyHomeItinerarySection hydrate-on-visible :data="pageData.collaborated" class="bg-surface-light" />

    <!-- Categorized Itineraries -->
    <LazyHomeCategories hydrate-on-visible :data="pageData.categories"  />

    <!-- Placeholder for the next section -->
    <section
      data-theme="light"
      class="py-24 px-4 md:px-8 lg:px-12 bg-surface-light text-primary-light flex flex-col items-center justify-center text-center min-h-[120vh]"
    >
      <div class="max-w-3xl flex flex-col items-center">
        <span class="font-cursive text-3xl md:text-4xl text-action-blue mb-4">
          Capturing India
        </span>
        <h2 class="text-3xl md:text-5xl font-semibold tracking-tight text-ink-dark mb-6">
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
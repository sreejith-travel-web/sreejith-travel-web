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

// 1. Fetch all featuredHome: true Signature & Collaborated itineraries (Server-filtered, zero bundle bloat)
const { data: homeItineraries } = await useAsyncData(
  'home-featured-itineraries',
  () => $fetch('/api/itineraries/home'),
  {
    default: () => ({ signature: [], collaborated: [] })
  }
)

const pageData = {
  hero: {
    mode: 'slideshow' as const,
    autoplay: true,
    autoplayIntervalMs: 8500,
    subtitleText: 'Regenerative Travel Experiences',
    headingLine1: 'Designing Cultural Immersive Travel Experiences in India',
    headingLine2Cursive: 'Inspired by People, Places & Stories',
    description: 'Designing luxury bespoke journeys bringing together meaningful encounters, rare access, and authentic stories that conventional tourism simply cannot offer.',
    awardImage: '/images/home/award.webp',
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
    eyebrow: 'ABOUT ME',
    greeting: 'Hello,',
    name: 'I’m Sree Jith',
    designations: [
      'Travel Experience Designer',
      'Founder, Moksha Stories',
      'Sustainable Travel Expert',
      'Art & Cultural Curator'
    ],
    paragraph: 'I design bespoke journeys across India, shaped by the people, places, and living cultures that make each destination distinctive. Drawing on years of exploration and trusted local connections, I bring travellers closer to stories and experiences they might otherwise miss.',
    portraitImageDesktop: '/images/home/about-sreejith-pc.webp',
    portraitImageMobile: '/images/home/about-sreejith-mob.webp',
    portraitAlt: 'Sreejith - Travel Experiences Designer & Cultural Collage',
    stats: [
      {
        value: '17+',
        subtitle: 'YEARS',
        description: 'Research & travel design'
      },
      {
        value: '400+',
        subtitle: 'CONNECTIONS',
        description: 'Cultural & local experts'
      },
      {
        value: '120+',
        subtitle: 'EXPERIENCES',
        description: 'Journeys & encounters designed'
      },
      {
        value: '2025',
        subtitle: 'AWARD',
        description: 'Responsible tourism recognition'
      }
    ],
    bottomQuote: 'Places tell you where you are. Stories tell you how it was. People tell you why it matters.',
    ctaLabel: 'Explore My Story',
    ctaTo: '/about'
  },
  
  signature: {
    eyebrow: 'SIGNATURE EXPERIENCES',
    titleLine1: 'HANDCRAFTED. IMMERSIVE.',
    titleLine2Cursive: 'Unforgettable.',
    subtitle: 'BESPOKE LUXURY TRAVEL EXPERIENCES IN SOUTH INDIA',
    description:
      'Thoughtfully crafted – influenced by its people, culture, landscapes, and stories. Each experience listed here is an idea and a source of inspiration designed to be personalised, refined, and tailored around you.',
    bottomQuote:
      'Whether you choose one as it is or use it as a starting point, every journey can be reimagined to match your interests, pace, and travel style.',
    ctaLabel: 'EXPLORE EXPERIENCES',
    ctaTo: '/itineraries',
    slider: {
      initialIndex: 0,
      autoplay: false,
      autoplayIntervalMs: 5500,
      infinite: true,
      slides: homeItineraries.value?.signature || []
    }
  },

  collaborated: {
    eyebrow: 'COLLABORATED ITINERARIES',
    titleLine1: 'CURATED. AUTHENTIC.',
    titleLine2Cursive: 'Exceptional.',
    subtitle: 'EXCLUSIVE PARTNERSHIP JOURNEYS ACROSS INDIA',
    description:
      'Designed in harmony with local experts, master artisans, and renowned historians. These exclusive journeys grant you unprecedented access to protected heritage sites, private estates, and intimate cultural dialogues.',
    bottomQuote:
      'Experience India through the eyes of its most passionate custodians, with journeys forged through decades of deep-rooted local relationships.',
    ctaLabel: 'DISCOVER COLLABORATIONS',
    ctaTo: '/itineraries',
    slider: {
      initialIndex: 0,
      autoplay: true,
      autoplayIntervalMs: 3500,
      infinite: true,
      slides: homeItineraries.value?.collaborated || []
    }
  },

  categories: {
    eyebrow: 'CATEGORIZED EXPERIENCES',
    titleLine1: 'TRAVEL YOUR WAY.',
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
        to: '/itineraries/nature'
      },
      {
        id: '02',
        title: 'Culture & Heritage',
        description: 'Discover living traditions, timeless art and heritage.',
        image: '/images/itineraries/category/culture.webp',
        alt: 'Terracotta Temple Portico at Sunset',
        to: '/itineraries/culture'
      },
      {
        id: '03',
        title: 'Places to Stay',
        description: 'Find thoughtful stays rooted in comfort and local charm.',
        image: '/images/itineraries/category/stay.webp',
        alt: 'Kerala Courtyard with Golden Arches',
        to: '/itineraries/stay'
      },
      {
        id: '04',
        title: 'Offbeat Explorations',
        description: 'Follow lesser-known paths to unexpected discoveries.',
        image: '/images/itineraries/category/offbeat.webp',
        alt: 'Engraved River Trail and Compass',
        to: '/itineraries/offbeat'
      },
      {
        id: '05',
        title: 'Wellness & Spirit',
        description: 'Restore your balance through mindful, soulful journeys.',
        image: '/images/itineraries/category/wellness.webp',
        alt: 'Ochre Lotus Over Rippling Hills',
        to: '/itineraries/wellness'
      },
      {
        id: '06',
        title: 'Bespoke Luxury',
        description: 'Enjoy exceptional comfort with a deeply personal touch.',
        image: '/images/itineraries/category/bespoke.webp',
        alt: 'Teal coastal terrace under palm fronds',
        to: '/itineraries/bespoke'
      }
    ]
  },

  journeyFramework: {
    eyebrow: 'THE ART OF TRAVEL DESIGN',
    titleLine1: 'YOUR JOURNEY.',
    titleLine2Cursive: 'Thoughtfully Designed.',
    image: '/images/home/journey-mob.webp',
    alt: 'South Indian Tourism',
    description: 'Every meaningful journey deserves a thoughtful design. Through our proven Journey Design Framework, we transform your ideas, interests, and travel style into a bespoke experience that is uniquely yours.',
    steps: [
      {
        title: 'Dream',
        subtitle: 'BEGIN WITH YOUR TRAVEL VISION.',
        description: 'Share your interests, travel style, and the experiences you dream of, so we can begin shaping a journey that feels uniquely yours.'
      },
      {
        title: 'Define',
        subtitle: 'DISCOVER THE RIGHT POSSIBILITIES.',
        description: 'Explore destinations, stays, seasons, and cultural experiences with us to discover the possibilities that best reflect your vision.'
      },
      {
        title: 'Design',
        subtitle: 'CRAFTING EVERY DETAIL OF YOUR JOURNEY.',
        description: 'We weave thoughtful stays, seamless logistics, hidden experiences, and local connections into a journey designed around your interests.'
      },
      {
        title: 'Deliver',
        subtitle: 'TRAVEL WITH CONFIDENCE.',
        description: 'Travel with confidence as we coordinate every detail and provide support throughout, giving you the freedom to enjoy each moment.'
      },
      {
        title: 'Difference',
        subtitle: 'TRAVEL THAT LEAVES A POSITIVE IMPACT.',
        description: 'Support local communities, celebrate living heritage, and embrace regenerative travel that enriches you and the places you visit.'
      }
    ],
    bottomQuote: 'Let’s design a journey that’s uniquely yours.',
    cta: {
      label: 'PLAN YOUR JOURNEY',
      to: '/planyourjourney'
    }
  },

  waysToWork: {
    eyebrow: 'WAYS TO WORK TOGETHER',
    titleLine1: 'Building Meaningful Travel',
    titleLine2Cursive: 'Together.',
    description: 'I collaborate with travel professionals, brands, organisations, and global partners to design experiences.',
    cards: [
      {
        eyebrow: 'FOR TRAVEL PROFESSIONALS',
        title: '(B2B) Travel Trade Partnerships',
        paragraphs: [
          'For Travel Agents, designers, Tour Operators, Event Planners, DMCs & Travel Brands seeking authentic, high-quality B2B experiences across South India.',
          'Co-create sustainable, culturally immersive journeys backed by deep local knowledge, trusted networks, and seamless execution.'
        ],
        cta: { label: 'PARTNER WITH ME', to: '/partner' },
        bgClass: 'bg-soft-cream' // soft cream
      },
      {
        eyebrow: 'FOR INDIVIDUALS & ORGANISATIONS',
        title: 'Join Our Partner Network',
        paragraphs: [
          'We\'re always looking for Unique Stays Providers, Passionate Travel creators, storytellers, artisans, performers, and experience providers.',
          'Become part of a trusted ecosystem creating meaningful travel experiences that support local communities, environment and celebrate culture.'
        ],
        cta: { label: 'JOIN THE NETWORK', to: '/partner' },
        bgClass: 'bg-soft-blue' // soft blue
      }
    ],
    icons: [
      'Corporate & Team Experiences',
      'Educational & Research Journeys',
      'Consulting & Speaking',
      'Boutique or Heritage Stay Development',
      'NGOs, CSR, and Heritage Trusts'
    ],
    bottomCta: {
      label: "LET'S WORK TOGETHER",
      to: '/partner'
    }
  },

  impact:{
    eyebrow: 'Making a Difference',
    titleLine1: 'Travel That Leaves A Place',
    titleLine2Cursive: 'Better Than Before.',
    description: 'We travel slowly, support local communities and protect the beauty that makes each place unforgettable. Every journey is mindful and made to give back.',
    items: [
      {
        id: 'slow-travel',
        shortTitle: 'Slow Travel',
        longTitle: 'Slow travel,\nlasting impact',
        intro: 'We travel slowly, supporting local communities and protecting the beauty that makes each place unforgettable.',
        img: '/images/impact/impact1.webp',
        alt: 'Lush green tea estates overlooking misty mountains in Kerala, representing slow travel',
        url: '/impact'
      },
      {
        id: 'authentic',
        shortTitle: 'Authentic Over Curated',
        longTitle: 'Authentic\nover curated',
        intro: 'Stripping away the artificial to reveal the raw, unpolished, and breathtaking reality of living cultures.',
        img: '/images/impact/impact2.webp',
        alt: 'Local artisan performing a traditional dance in vibrant cultural attire',
        url: '/impact'
      },
      {
        id: 'local-first',
        shortTitle: 'Local First, Always',
        longTitle: 'Local first,\nalways',
        intro: 'Directly empowering regional artisans, guides, and family-owned stays to keep the economic ecosystem thriving.',
        img: '/images/impact/impact3.webp',
        alt: 'Close-up of a potter spinning clay with bare hands, highlighting local artisans',
        url: '/impact'
      },
      {
        id: 'protecting-beauty',
        shortTitle: 'Protecting Beauty',
        longTitle: 'Protecting\nnatural beauty',
        intro: 'Implementing zero-trace practices to ensure pristine landscapes remain untouched for generations to come.',
        img: '/images/impact/impact4.webp',
        alt: 'A tranquil river reflecting dense untouched mangrove forests in South India',
        url: '/impact'
      },
      {
        id: 'conscious-choices',
        shortTitle: 'Conscious Choices',
        longTitle: 'Conscious choices,\nlighter footprint',
        intro: 'Every logistical decision is weighed against its environmental impact, prioritizing sustainable alternatives.',
        img: '/images/impact/impact5.webp',
        alt: 'Eco-friendly heritage stay nestled organically into a forested hillside',
        url: '/impact'
      },
      {
        id: 'giving-back',
        shortTitle: 'Giving Back',
        longTitle: 'Giving back,\nwhere we go',
        intro: 'A percentage of every journey directly funds grassroots conservation and community education initiatives.',
        img: '/images/impact/impact6.webp',
        alt: 'Children from a local community smiling and learning outside a heritage village',
        url: '/impact'
      }
    ],
    bottomQuote: 'Meaningful journeys are about making a difference that reaches far beyond the paths we travel.',
    bottomCta: {
      label: 'DISCOVER OUR VALUES',
      to: '/impact'
    }
  },

  testimonials: {
    eyebrow: 'TESTIMONIALS',
    titleLine1: 'Moments Captured',
    titleLine2Cursive: 'Along The Way.',
    description: 'Glimpses of memorable moments, breathtaking landscapes, and meaningful connections. See the world through the eyes of those who travel with us.',
    categories: {
      'wilderness-trails': { name: 'Wilderness & Trails', colorVar: 'var(--color-deep-forest)' },
      'living-traditions': { name: 'Living Traditions', colorVar: 'var(--color-terracotta)' },
      'restorative-journeys': { name: 'Restorative Journeys', colorVar: 'var(--color-slate-blue)' },
      'flavors-feasts': { name: 'Flavors & Feasts', colorVar: 'var(--color-spiced-copper)' },
      'sanctuaries-stays': { name: 'Sanctuaries & Stays', colorVar: 'var(--color-olive-drab)' },
      'uncharted-paths': { name: 'Uncharted Paths', colorVar: 'var(--color-midnight-slate)' }
    },
    items: [
      {
        id: 1,
        categoryId: 'living-traditions',
        name: 'Ananya Menon',
        designation: 'Architect, Bengaluru, India',
        quote: 'Every temple, village, and conversation felt deeply personal. It wasn\'t sightseeing—it was understanding a place through its people, stories, and traditions. The journey stayed with me long after I returned home.',
        avatar: '/images/testimonials/avatar.webp',
        image: '/images/home/journey-pc.webp',
        alt: 'Experience Stories',
        ctaLabel: 'Read Story',
        ctaUrl: '/journal'
      },
      {
        id: 2,
        categoryId: 'wilderness-trails',
        name: 'Daniel Brooks',
        designation: 'Photographer, Melbourne, Australia',
        quote: 'From misty mountains to hidden trails, every day felt like an adventure crafted just for me. The landscapes were breathtaking, but the quiet moments in nature became my favorite memories.',
        avatar: '/images/testimonials/avatar.webp',
        image: '/images/home/journey-pc.webp',
        alt: 'Experience Stories',
        ctaLabel: 'Watch Video',
        ctaUrl: '/journal'
      },
      {
        id: 3,
        categoryId: 'restorative-journeys',
        name: 'Priya Raman',
        designation: 'Yoga Instructor, Chennai, India',
        quote: 'The retreat offered more than relaxation. It brought stillness, meaningful conversations, and a renewed sense of balance. I returned home feeling lighter, calmer, and deeply inspired.',
        avatar: '/images/testimonials/avatar.webp',
        image: '/images/home/journey-pc.webp',
        alt: 'Experience Stories',
        ctaLabel: 'Read Post',
        ctaUrl: '/journal'
      },
      {
        id: 4,
        categoryId: 'flavors-feasts',
        name: 'Lucas Meyer',
        designation: 'Chef, Munich, Germany',
        quote: 'Every meal told a story. Cooking alongside local families, discovering regional flavors, and sharing traditions around the table made this one of the most authentic journeys I\'ve ever experienced.',
        avatar: '/images/testimonials/avatar.webp',
        image: '/images/home/journey-pc.webp',
        alt: 'Experience Stories',
        ctaLabel: 'Explore',
        ctaUrl: '/journal'
      }
    ],
    bottomQuote: 'Travel is not merely a destination, but a new way of seeing things.',
    bottomCta: {
      label: 'READ TRAVELER STORIES',
      to: '/journal'
    }
  },

  journal: {
    eyebrow: 'FROM THE JOURNAL',
    titleLine1: 'STORIES THAT TRAVEL',
    titleLine2Cursive: 'Beyond the journey',
    description: 'Observations, perspectives, and field notes from years of research and on-the-ground experience. Exploring People, Culture, Heritage, Travel Trends, and Sustainability shaping meaningful journeys.',
    posts: [
      {
        id: '1',
        slug: '/journal/behind-the-doors-of-chettinad',
        type: 'articles',
        title: 'Behind the doors of Chettinad',
        excerpt: 'Step inside ancestral homes where carved courtyards, family stories, and gracious hospitality reveal the living heart of Chettinad.',
        category: 'LIVING HERITAGE',
        readTime: '7 MIN READ',
        tags: ['#ARCHITECTURE', '#HERITAGE', '#TAMILNADU'],
        image: '/images/fallbacks/culture.webp',
        alt: 'Courtyard of an ancestral Chettinad home',
        featured: true
      },
      {
        id: '2',
        slug: '/journal/the-quiet-paths-of-the-western-ghats',
        type: 'articles',
        title: 'The quiet paths of the Western Ghats',
        excerpt: 'Follow forest trails and mist-covered ridges, discovering the quiet rhythms and remarkable biodiversity of the Western Ghats.',
        category: 'NATURE & TRAILS',
        readTime: '5 MIN READ',
        tags: ['#BIODIVERSITY', '#ECOLOGY', '#TRAILS'],
        image: '/images/fallbacks/culture.webp',
        alt: 'Mist covered ridges of the Western Ghats',
        featured: false
      },
      {
        id: '3',
        slug: '/journal/case-study-regenerative-handloom-corridor',
        type: 'case-studies',
        title: 'Woven through generations',
        excerpt: 'Meet the artisans whose patient hands and inherited skills keep local traditions alive, weaving memory into everyday objects.',
        category: 'PEOPLE & CRAFT',
        readTime: '6 MIN READ',
        tags: ['#ARTISANS', '#HANDLOOM', '#CULTURE'],
        image: '/images/fallbacks/culture.webp',
        alt: 'Artisan weaving a traditional saree',
        featured: false
      },
      {
        id: '4',
        slug: '/journal/a-place-at-the-kerala-table',
        type: 'articles',
        title: 'A place at the Kerala table',
        excerpt: 'Discover the seasonal ingredients, generous kitchens, and cherished family recipes that turn a Kerala meal into a shared story.',
        category: 'FOOD & CULTURE',
        readTime: '4 MIN READ',
        tags: ['#CULINARY', '#TRADITION', '#KERALA'],
        image: '/images/fallbacks/culture.webp',
        alt: 'Traditional Kerala Sadhya served on a banana leaf',
        featured: false
      }
    ],
    bottomQuote: 'Every journey leaves a story worth carrying forward.',
    bottomCta: {
      label: 'EXPLORE THE JOURNAL',
      to: '/journal'
    }
  }
  
}


</script>

<template>
  <div class="2xs:overflow-x-hidden">
    <!-- Hero Section -->
    <HomeHero :data="pageData.hero" />

    <!-- About Section -->
    <HomeAbout :data="pageData.about" class="bg-surface-light"/>

    <!-- Signature Experiences -->
    <LazyHomeSignatureItineraries hydrate-on-visible :data="pageData.signature" class="bg-bg-light" />

    <!-- Collaborated Itineraries -->
    <LazyHomeCollaboratedItineraries hydrate-on-visible :data="pageData.collaborated" class="bg-surface-light" />

    <!-- Categorized Itineraries -->
    <LazyHomeCategories hydrate-on-visible :data="pageData.categories" class="bg-bg-light" />

    <!-- How It Works -->
    <LazyHomeJourneyFramework hydrate-on-visible :data="pageData.journeyFramework" />
    
    <!-- Ways To Work Together -->
    <LazyHomeWaysToWork hydrate-on-visible :data="pageData.waysToWork" class="bg-surface-light" />

    <!-- Ways To Work Together -->
    <LazyHomeImpact hydrate-on-visible :data="pageData.impact" class="bg-bg-light" />

    <!-- Testimonials -->
    <LazyHomeTestimonials hydrate-on-visible :data="pageData.testimonials" class="bg-surface-light" />
    
    <!-- Journal -->
    <LazyHomeJournal hydrate-on-visible :data="pageData.journal" class="bg-bg-light" />

  </div>
</template>
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
    headingLine2Cursive: 'Inspired by People, Places & Stories',
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
        "Creating bespoke luxury journeys in India with a trusted local network of cultural custodians, storytellers, artisans, historians, and local experts. I approach travel as an art – bringing together meaningful encounters, rare access, authentic stories and regenerative travel that conventional tourism doesn't provide.",
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

  philosophy : {
    eyebrow: 'BEHIND EVERY JOURNEY',
    titleLine1: 'Thoughtful travel.',
    titleLine2Cursive: 'Meaningful connections.',
    video: {
      videoId: 'k1OU4CqguLw', 
      thumbnail: '/images/home/travel-video.webp',
      alt: 'Artisan weaving basket during a cultural travel experience in India',
      width: 800,
      height: 450
    },
    pillars: [
      {
        title: 'Designed Around You',
        subtitle: 'EVERY JOURNEY IS UNIQUE',
        description: 'Personally crafted culturally rich travel experiences designed around your interests, pace, travel style, and aspirations.'
      },
      {
        title: 'Regenerative by Design',
        subtitle: 'TRAVEL THAT GIVES BACK',
        description: 'Co-created with local communities to create a lasting positive impact for both travellers and communities, culture, and nature they visit.'
      },
      {
        title: 'Boutique by Choice',
        subtitle: 'QUALITY OVER QUANTITY',
        description: 'We intentionally design a limited number of journeys each year, ensuring seamless end to end service, exceptional attention, meaningful local engagement, and authentic experiences.'
      }
    ],
    bottomQuote: 'Years spent walking village lanes, sitting with artisans, restoring heritage spaces, documenting traditions, and listening to the people who shape a place have changed how I see travel. Today, every journey I design carries those conversations forward.'
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

  journeyFramework: {
    eyebrow: 'THE ART OF TRAVEL DESIGN',
    titleLine1: 'YOUR JOURNEY.',
    titleLine2Cursive: 'Thoughtfully Designed.',
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
    description: 'I collaborate with travel professionals, brands, organisations, and global partners to design culturally immersive, community-driven travel experiences across South India—built on deep local knowledge, trusted networks, and years of on-ground research.',
    cards: [
      {
        eyebrow: 'FOR TRAVEL PROFESSIONALS',
        title: '(B2B) Travel Trade Partnerships',
        paragraphs: [
          'For Travel Agents, designers, Tour Operators, Event Planners, DMCs & Travel Brands seeking authentic, high-quality B2B experiences across South India.',
          'Co-create sustainable, culturally immersive journeys backed by deep local knowledge, trusted networks, and seamless execution.'
        ],
        cta: { label: 'PARTNER WITH ME', to: '/services' },
        bgClass: 'bg-soft-cream' // soft cream
      },
      {
        eyebrow: 'FOR INDIVIDUALS & ORGANISATIONS',
        title: 'Join Our Partner Network',
        paragraphs: [
          'We\'re always looking for Unique Stays Providers, Passionate Travel creators, storytellers, artisans, performers, and experience providers.',
          'Become part of a trusted ecosystem creating meaningful travel experiences that support local communities, environment and celebrate culture.'
        ],
        cta: { label: 'JOIN THE NETWORK', to: '/services' },
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
      to: '/services'
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
        ctaLabel: 'Read Story',
        ctaUrl: '/blog'
      },
      {
        id: 2,
        categoryId: 'wilderness-trails',
        name: 'Daniel Brooks',
        designation: 'Photographer, Melbourne, Australia',
        quote: 'From misty mountains to hidden trails, every day felt like an adventure crafted just for me. The landscapes were breathtaking, but the quiet moments in nature became my favorite memories.',
        avatar: '/images/testimonials/avatar.webp',
        ctaLabel: 'Watch Video',
        ctaUrl: '/blog'
      },
      {
        id: 3,
        categoryId: 'restorative-journeys',
        name: 'Priya Raman',
        designation: 'Yoga Instructor, Chennai, India',
        quote: 'The retreat offered more than relaxation. It brought stillness, meaningful conversations, and a renewed sense of balance. I returned home feeling lighter, calmer, and deeply inspired.',
        avatar: '/images/testimonials/avatar.webp',
        ctaLabel: 'Read Post',
        ctaUrl: '/blog'
      },
      {
        id: 4,
        categoryId: 'flavors-feasts',
        name: 'Lucas Meyer',
        designation: 'Chef, Munich, Germany',
        quote: 'Every meal told a story. Cooking alongside local families, discovering regional flavors, and sharing traditions around the table made this one of the most authentic journeys I\'ve ever experienced.',
        avatar: '/images/testimonials/avatar.webp',
        ctaLabel: 'Explore',
        ctaUrl: '/blog'
      }
    ],
    bottomQuote: 'Travel is not merely a destination, but a new way of seeing things.',
    bottomCta: {
      label: 'READ TRAVELER STORIES',
      to: '/blog'
    }
  },

  journal: {
    eyebrow: 'FROM THE JOURNAL',
    titleLine1: 'STORIES THAT TRAVEL',
    titleLine2Cursive: 'Beyond the journey',
    description: 'Observations, perspectives, and field notes from years of research and on-the-ground experience.  Exploring People, Culture, Heritage, Travel Trends, and Sustainability shaping meaningful journeys.',
    posts: [
      { 
        id: '1', 
        slug: '/blog',
        title: 'Behind the doors of Chettinad', 
        excerpt: 'Step inside ancestral homes where carved courtyards, family stories, and gracious hospitality reveal the living heart of Chettinad.', 
        category: 'LIVING HERITAGE', 
        readTime: '7 MIN READ', 
        image: '/images/blog/blog1.webp', 
        alt: 'Courtyard of an ancestral Chettinad home', 
        featured: true 
      },
      { 
        id: '2', 
        slug: '/blog',
        title: 'The quiet paths of the Western Ghats', 
        excerpt: 'Follow forest trails and mist-covered ridges, discovering the quiet rhythms and remarkable biodiversity of the Western Ghats.', 
        category: 'NATURE & TRAILS', 
        readTime: '5 MIN READ', 
        image: '/images/blog/blog2.webp', 
        alt: 'Mist covered ridges of the Western Ghats' 
      },
      { 
        id: '3', 
        slug: '/blog',
        title: 'Woven through generations', 
        excerpt: 'Meet the artisans whose patient hands and inherited skills keep local traditions alive, weaving memory into everyday objects.', 
        category: 'PEOPLE & CRAFT', 
        readTime: '6 MIN READ', 
        image: '/images/blog/blog3.webp', 
        alt: 'Artisan weaving a traditional saree' 
      },
      { 
        id: '4', 
        slug: '/blog',
        title: 'A place at the Kerala table', 
        excerpt: 'Discover the seasonal ingredients, generous kitchens, and cherished family recipes that turn a Kerala meal into a shared story.', 
        category: 'FOOD & CULTURE', 
        readTime: '4 MIN READ', 
        image: '/images/blog/blog4.webp', 
        alt: 'Traditional Kerala Sadhya served on a banana leaf' 
      },
      { 
        id: '5', 
        slug: '/blog',
        title: 'At the water\'s pace', 
        excerpt: 'Drift along quiet waterways, pause in village lanes, and discover how slowing down opens a deeper connection with life in Kerala.', 
        category: 'SLOW TRAVEL', 
        readTime: '5 MIN READ', 
        image: '/images/blog/blog5.webp', 
        alt: 'Man rowing a wooden boat on Kerala backwaters' 
      }
    ],
    bottomQuote: 'Every journey leaves a story worth carrying forward.',
    bottomCta: {
      label: 'EXPLORE THE JOURNAL',
      to: '/blog'
    }
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

    <!-- Philosophy Video Section -->
    <LazyHomePhilosophy hydrate-on-visible :data="pageData.philosophy" class="bg-bg-light" />

    <!-- Signature Experiences -->
    <LazyHomeItinerarySection hydrate-on-visible :data="pageData.signature" class="bg-surface-light" />
    
    <!-- Collaborated Itineraries -->
    <LazyHomeItinerarySection hydrate-on-visible :data="pageData.collaborated" class="bg-bg-light" />

    <!-- Categorized Itineraries -->
    <LazyHomeCategories hydrate-on-visible :data="pageData.categories" class="bg-surface-light" />

    <!-- How It Works -->
    <LazyHomeJourneyFramework hydrate-on-visible :data="pageData.journeyFramework" class="bg-[radial-gradient(ellipse_at_center,var(--color-intention-deep)_0%,var(--color-journey-deep)_100%)]" />
    
    <!-- Ways To Work Together -->
    <LazyHomeWaysToWork hydrate-on-visible :data="pageData.waysToWork" class="bg-bg-light" />

    <!-- Ways To Work Together -->
    <LazyHomeImpact hydrate-on-visible :data="pageData.impact" class="bg-surface-light" />

    <!-- Testimonials -->
    <LazyHomeTestimonials hydrate-on-visible :data="pageData.testimonials" class="bg-bg-light" />
    
    <!-- Journal -->
    <LazyHomeJournal hydrate-on-visible :data="pageData.journal" class="bg-bg-light" />

    <!-- Placeholder for the next section -->
    <section
      data-theme="light"
      class="py-24 px-4 md:px-8 lg:px-12 bg-bg-light text-primary-light flex flex-col items-center justify-center text-center min-h-[120vh]"
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
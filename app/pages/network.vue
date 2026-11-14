<!-- ~/app/pages/network.vue -->
<script setup lang="ts">
import { useSeoMeta } from '#imports'
import PageHero from '~/components/PageHero.vue'
import PartnerDesigners, { type PartnerDesignersConfig } from '~/components/PartnerDesigners.vue'
import PartnerInner, { type PartnerInnerConfig } from '~/components/PartnerInner.vue'
import PartnerCommunity, { type PartnerCommunityConfig } from '~/components/PartnerCommunity.vue'

useSeoMeta({
  title: 'Partner & Collaborate — Meaningful Travel Design',
  description:
    'Collaborate with travel designers, grassroots communities, trade partners, and cultural specialists across South India and beyond.',
  ogType: 'website',
  ogTitle: 'Partner & Collaborate — Meaningful Travel Design',
  ogDescription:
    'Co-create authentic, culturally immersive, and regenerative journeys across South India.',
  ogImage: '/images/og/network.jpg'
})

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
  community: PartnerCommunityConfig
  designers: PartnerDesignersConfig
  content: PartnerInnerConfig
} = {
  hero: {
    eyebrow: 'Bespoke Concierge',
    titleMain: 'Seamless Luxury & Access',
    titleItalic: 'Tailored To Your Rhythm',
    intro:
      'From private heritage access and scholar-led walks to boutique hideaways, every detail is orchestrated with quiet precision.',
    imageDesktop: '/images/home/journey-pc1.webp',
    imageMobile: '/images/home/journey-mob1.webp',
    alt: 'Luxury travel design collaborations across South India'
  },
  community: {
    eyebrow: 'People and Community',
    title: 'The Living Heart of Every Place',
    description:
      'Behind every meaningful journey is a trusted circle of artisans, storytellers, home cooks, performers, and local custodians — alongside global partners who share our devotion to place and culture; who welcome travellers into their everyday worlds.',
    ledgerNoun: 'Grassroots Custodians',
    interactionHint: 'Tap any person for their story · Drag stream',
    fallbackImage: '/images/fallbacks/culture.webp',
    fallbackCoverImage: '/images/impact/impact4.webp',
    members: [
      {
        id: 1,
        name: 'Soman',
        role: 'Boatman',
        location: 'Kumarakom, Kerala',
        desc: 'Soman navigates intricate backwater canals with decades of inherited knowledge, sharing quiet stories of life along the water.',
        img: '/images/home/journey-mob.webp',
        alt: 'Soman, Boatman from Kumarakom, Kerala',
        coverImg: '/images/impact/impact4.webp',
        coverAlt: 'Tranquil backwater canals of Kumarakom at dawn',
        tint: 'cream'
      },
      {
        id: 2,
        name: 'Lekshmi',
        role: 'Master Weaver',
        location: 'Chendamangalam, Kerala',
        desc: 'A master of the handloom, Lekshmi weaves traditional Kasavu fabrics, preserving a centuries-old regional textile lineage.',
        img: '/images/journal/journal1.webp',
        alt: 'Lekshmi, Master Weaver from Chendamangalam, Kerala',
        coverImg: '/images/itineraries/category/culture.webp',
        coverAlt: 'Traditional handloom textile craft in Chendamangalam',
        tint: 'peach'
      },
      {
        id: 3,
        name: 'Gopi',
        role: 'Village Potter',
        location: 'Aruvacode, Kerala',
        desc: 'Working with native river clay, Gopi shapes sustainable earthenware using wheel techniques passed down through generations.',
        img: '/images/impact/impact3.webp',
        alt: 'Gopi, Village Potter from Aruvacode, Kerala',
        coverImg: '/images/journal/journal4.webp',
        coverAlt: 'Handcrafted river-clay pottery studio in Aruvacode',
        tint: 'cream'
      },
      {
        id: 4,
        name: 'Meena',
        role: 'Home Cook',
        location: 'Kuttanad, Kerala',
        desc: 'Meena brings ancestral backwater cuisine to life using heirloom clay-pot recipes and seasonal homestead harvests.',
        img: '/images/home/journey-pc1.webp',
        alt: 'Meena, Home Cook from Kuttanad, Kerala',
        coverImg: '/images/impact/impact6.webp',
        coverAlt: 'Homestead kitchen and seasonal harvest in Kuttanad',
        tint: 'peach'
      },
      {
        id: 5,
        name: 'Sivan',
        role: 'Honey Gatherer',
        location: 'Wayanad, Kerala',
        desc: 'Scaling forest canopies in the Western Ghats, Sivan harvests wild cliff honey through sustainable indigenous traditions.',
        img: '/images/home/forest-portrait.webp',
        alt: 'Sivan, Honey Gatherer from Wayanad, Kerala',
        coverImg: '/images/itineraries/category/nature.webp',
        coverAlt: 'Dense Western Ghats forest canopy in Wayanad',
        tint: 'sky'
      },
      {
        id: 6,
        name: 'Ramesh',
        role: 'Wood Carver',
        location: 'Aranmula, Kerala',
        desc: 'Ramesh carves intricate timber gables and sacred sculptures, keeping classical Kerala architectural joinery alive.',
        img: '/images/journal/journal4.webp',
        alt: 'Ramesh, Wood Carver from Aranmula, Kerala',
        coverImg: '/images/itineraries/category/bespoke.webp',
        coverAlt: 'Classical carved timber joinery in Aranmula',
        tint: 'sage'
      },
      {
        id: 7,
        name: 'Anu',
        role: 'Herbalist',
        location: 'Munnar, Kerala',
        desc: 'Deeply attuned to highland shola flora, Anu cultivates and prepares rare botanicals for traditional healing.',
        img: '/images/itineraries/category/wellness.webp',
        alt: 'Anu, Herbalist from Munnar, Kerala',
        coverImg: '/images/impact/impact5.webp',
        coverAlt: 'Mist-covered highland botanical slopes in Munnar',
        tint: 'sky'
      },
      {
        id: 8,
        name: 'Babu',
        role: 'Oral Historian',
        location: 'Kozhikode, Kerala',
        desc: 'Babu narrates centuries of maritime folklore and spice-port legends that breathe life into historic Malabar quarters.',
        img: '/images/journal/journal2.webp',
        alt: 'Babu, Oral Historian from Kozhikode, Kerala',
        coverImg: '/images/itineraries/dummy1.webp',
        coverAlt: 'Historic maritime spice quarters of Kozhikode',
        tint: 'sage'
      },
      {
        id: 9,
        name: 'Shivu',
        role: 'Ritual Artist',
        location: 'Kannur, Kerala',
        desc: 'A dedicated Theyyam custodian, Shivu embodies sacred grove traditions through ancestral percussion, face-painting, and verse.',
        img: '/images/impact/impact2.webp',
        alt: 'Shivu, Ritual Artist from Kannur, Kerala',
        coverImg: '/images/journal/journal3.webp',
        coverAlt: 'Sacred grove ritual heritage of North Malabar in Kannur',
        tint: 'peach'
      },
      {
        id: 10,
        name: 'Nizam',
        role: 'Spice Grower',
        location: 'Thekkady, Kerala',
        desc: 'Tending shade-grown cardamom and heirloom pepper vines, Nizam shares the ecological wisdom of highland spice hills.',
        img: '/images/impact/impact1.webp',
        alt: 'Nizam, Spice Grower from Thekkady, Kerala',
        coverImg: '/images/home/forest-portrait.webp',
        coverAlt: 'Shade-grown cardamom and pepper estates in Thekkady',
        tint: 'cream'
      },
      {
        id: 11,
        name: 'Radha',
        role: 'Floral Artist',
        location: 'Palakkad, Kerala',
        desc: 'Radha composes intricate seasonal Pookkalam mandalas, transforming fresh courtyard blossoms into living geometry.',
        img: '/images/home/solo-portrait.webp',
        alt: 'Radha, Floral Artist from Palakkad, Kerala',
        coverImg: '/images/itineraries/dummy3.webp',
        coverAlt: 'Traditional courtyard floral artistry in Palakkad',
        tint: 'peach'
      },
      {
        id: 12,
        name: 'Jose',
        role: 'Heritage Guide',
        location: 'Fort Kochi, Kerala',
        desc: 'Walking quiet heritage lanes at dawn, Jose unpacks the layered Portuguese, Dutch, and Malabar histories of Kochi.',
        img: '/images/itineraries/dummy1.webp',
        alt: 'Jose, Heritage Guide from Fort Kochi, Kerala',
        coverImg: '/images/home/solo-landscape.webp',
        coverAlt: 'Morning light across historic lanes in Fort Kochi',
        tint: 'cream'
      },
      {
        id: 13,
        name: 'Jayan',
        role: 'Coastal Fisher',
        location: 'Mararikulam, Kerala',
        desc: 'Reading morning tides and monsoon currents, Jayan sustains a gentle, small-craft coastal fishing livelihood.',
        img: '/images/home/solo-landscape.webp',
        alt: 'Jayan, Coastal Fisher from Mararikulam, Kerala',
        coverImg: '/images/itineraries/dummy9.webp',
        coverAlt: 'Quiet Malabar shoreline at first light in Mararikulam',
        tint: 'sage'
      },
      {
        id: 14,
        name: 'Biju',
        role: 'Coir Artisan',
        location: 'Alappuzha, Kerala',
        desc: 'Spinning sun-cured coconut husk into golden coir, Biju demonstrates the resilient cottage craft of the backwaters.',
        img: '/images/journal/journal5.webp',
        alt: 'Biju, Coir Artisan from Alappuzha, Kerala',
        coverImg: '/images/home/journey-pc1.webp',
        coverAlt: 'Backwater coir spinning village along Alappuzha canals',
        tint: 'sky'
      },
      {
        id: 15,
        name: 'Devika',
        role: 'Ayurveda Vaidya',
        location: 'Varkala, Kerala',
        desc: 'Guided by classical palm-leaf manuscripts, Devika formulates individualized oil and herbal restorative therapies.',
        img: '/images/testimonials/avatar.webp',
        alt: 'Devika, Ayurveda Vaidya from Varkala, Kerala',
        coverImg: '/images/itineraries/category/wellness.webp',
        coverAlt: 'Traditional Ayurvedic apothecary and calm courtyard in Varkala',
        tint: 'sage'
      },
      {
        id: 16,
        name: 'Manoj',
        role: 'Sanctuary Steward',
        location: 'Thrissur, Kerala',
        desc: 'Working alongside conservation vets, Manoj dedicates his days to gentle, ethical care and habitat enrichment.',
        img: '/images/impact/impact4.webp',
        alt: 'Manoj, Sanctuary Steward from Thrissur, Kerala',
        coverImg: '/images/impact/impact1.webp',
        coverAlt: 'Lush riparian sanctuary landscape in Thrissur',
        tint: 'sky'
      },
      {
        id: 17,
        name: 'Leela',
        role: 'Tea Cultivator',
        location: 'Vagamon, Kerala',
        desc: 'Tending mist-wrapped mountain slopes, Leela shares the quiet rhythm of small-holder artisanal leaf plucking.',
        img: '/images/impact/impact5.webp',
        alt: 'Leela, Tea Cultivator from Vagamon, Kerala',
        coverImg: '/images/itineraries/category/offbeat.webp',
        coverAlt: 'Rolling mist-wrapped highland tea hills in Vagamon',
        tint: 'cream'
      },
      {
        id: 18,
        name: 'Vijay',
        role: 'Shell Crafter',
        location: 'Kollam, Kerala',
        desc: 'Vijay turns discarded coconut shells into finely polished ladles, bowls, and sustainable everyday objects.',
        img: '/images/itineraries/dummy2.webp',
        alt: 'Vijay, Shell Crafter from Kollam, Kerala',
        coverImg: '/images/impact/impact3.webp',
        coverAlt: 'Hand-finished natural craft studio in Kollam',
        tint: 'peach'
      },
      {
        id: 19,
        name: 'Haridas',
        role: 'Temple Scholar',
        location: 'Trivandrum, Kerala',
        desc: 'Haridas decodes stone-carved Dravidian iconography, epigraphy, and acoustic temple architecture for curious travellers.',
        img: '/images/itineraries/category/culture.webp',
        alt: 'Haridas, Temple Scholar from Trivandrum, Kerala',
        coverImg: '/images/itineraries/dummy6.webp',
        coverAlt: 'Stone-carved temple architecture in Trivandrum',
        tint: 'cream'
      },
      {
        id: 20,
        name: 'Aswathy',
        role: 'Classical Dancer',
        location: 'Kottayam, Kerala',
        desc: 'Through expressive mudras and abhinaya, Aswathy opens an intimate window into Kerala’s classical stage lineages.',
        img: '/images/itineraries/dummy3.webp',
        alt: 'Aswathy, Classical Dancer from Kottayam, Kerala',
        coverImg: '/images/impact/impact2.webp',
        coverAlt: 'Oil-lit classical performance kalari in Kottayam',
        tint: 'peach'
      },
      {
        id: 21,
        name: 'Prabhu',
        role: 'Spice Factor',
        location: 'Mattancherry, Kerala',
        desc: 'Inside a historic waterfront warehouse, Prabhu grades sun-dried ginger, wild nutmeg, and Alleppey turmeric.',
        img: '/images/itineraries/category/offbeat.webp',
        alt: 'Prabhu, Spice Factor from Mattancherry, Kerala',
        coverImg: '/images/journal/journal2.webp',
        coverAlt: 'Historic waterfront spice warehouse in Mattancherry',
        tint: 'sky'
      },
      {
        id: 22,
        name: 'Tessy',
        role: 'Cultural Host',
        location: 'Ernakulam, Kerala',
        desc: 'Tessy welcomes guests into her family homestead for unhurried conversations around regional customs and table rituals.',
        img: '/images/impact/impact6.webp',
        alt: 'Tessy, Cultural Host from Ernakulam, Kerala',
        coverImg: '/images/home/journey-pc1.webp',
        coverAlt: 'Warm heritage family veranda in Ernakulam',
        tint: 'sage'
      },
      {
        id: 23,
        name: 'Arun',
        role: 'Wetland Naturalist',
        location: 'Kavalam, Kerala',
        desc: 'Poling silent country canoes at first light, Arun tracks migratory birds and endemic wetland flora across Kuttanad.',
        img: '/images/itineraries/category/nature.webp',
        alt: 'Arun, Wetland Naturalist from Kavalam, Kerala',
        coverImg: '/images/impact/impact4.webp',
        coverAlt: 'Still wetland channels of Kavalam at sunrise',
        tint: 'sky'
      },
      {
        id: 24,
        name: 'Sneha',
        role: 'Mural Artist',
        location: 'Pathanamthitta, Kerala',
        desc: 'Grinding laterite stone, indigo, and leaf pigments by hand, Sneha paints classical Panchavarna temple murals.',
        img: '/images/journal/journal3.webp',
        alt: 'Sneha, Mural Artist from Pathanamthitta, Kerala',
        coverImg: '/images/journal/journal1.webp',
        coverAlt: 'Natural mineral pigments and Panchavarna mural studio',
        tint: 'sage'
      },
      {
        id: 25,
        name: 'Sujatha',
        role: 'Natural Dyer',
        location: 'Vaikom, Kerala',
        desc: 'Sujatha revives botanical dyeing vats extracted from jackfruit heartwood, madder root, and wild turmeric.',
        img: '/images/itineraries/dummy5.webp',
        alt: 'Sujatha, Natural Dyer from Vaikom, Kerala',
        coverImg: '/images/journal/journal5.webp',
        coverAlt: 'Botanical dye vats and sun-dried yarns in Vaikom',
        tint: 'peach'
      },
      {
        id: 26,
        name: 'Kumar',
        role: 'Bronze Caster',
        location: 'Payyanur, Kerala',
        desc: 'Using the ancient lost-wax process, Kumar casts resonant bell-metal lamps and ceremonial vessels in his village foundry.',
        img: '/images/itineraries/dummy6.webp',
        alt: 'Kumar, Bronze Caster from Payyanur, Kerala',
        coverImg: '/images/itineraries/dummy2.webp',
        coverAlt: 'Traditional bell-metal lost-wax foundry in Payyanur',
        tint: 'cream'
      },
      {
        id: 27,
        name: 'Narayanan',
        role: 'Mirror Metallurgist',
        location: 'Aranmula, Kerala',
        desc: 'One of a handful of living masters hand-polishing alloyed metal into the legendary front-surface Aranmula Kannadi mirror.',
        img: '/images/itineraries/category/bespoke.webp',
        alt: 'Narayanan, Mirror Metallurgist from Aranmula, Kerala',
        coverImg: '/images/journal/journal4.webp',
        coverAlt: 'Ancestral Aranmula Kannadi metallurgy workshop',
        tint: 'peach'
      },
      {
        id: 28,
        name: 'Celine',
        role: 'Estuary Host',
        location: 'Munroe Island, Kerala',
        desc: 'Hosting slow canoe mornings and island lunches where the Kallada River meets Ashtamudi Lake.',
        img: '/images/itineraries/dummy9.webp',
        alt: 'Celine, Estuary Host from Munroe Island, Kerala',
        coverImg: '/images/home/journey-mob.webp',
        coverAlt: 'Estuary confluence at Munroe Island and Ashtamudi Lake',
        tint: 'cream'
      },
      {
        id: 29,
        name: 'Madhavan',
        role: 'Kalari Gurukkal',
        location: 'Vadakara, Kerala',
        desc: 'Preserving northern Kalaripayattu lineages inside an earthen pit kalari, Madhavan teaches breath, balance, and martial grace.',
        img: '/images/itineraries/dummy2.webp',
        alt: 'Madhavan, Kalari Gurukkal from Vadakara, Kerala',
        coverImg: '/images/impact/impact2.webp',
        coverAlt: 'Traditional red-earth Kalaripayattu training pit in Vadakara',
        tint: 'sage'
      },
      {
        id: 30,
        name: 'Fathima',
        role: 'Mappila Cook',
        location: 'Thalassery, Kerala',
        desc: 'Stewarding heirloom Malabar coastal recipes, Fathima hosts unhurried kitchen gatherings rich with stories of maritime trade.',
        img: '/images/home/solo-portrait.webp',
        alt: 'Fathima, Mappila Cook from Thalassery, Kerala',
        coverImg: '/images/itineraries/dummy5.webp',
        coverAlt: 'Heirloom Malabar spice kitchen in Thalassery',
        tint: 'sky'
      },
      {
        id: 31,
        name: 'Sankaran',
        role: 'Uru Shipwright',
        location: 'Beypore, Kerala',
        desc: 'Shaping seasoned Malabar teak without blueprints, Sankaran carries forward Beypore’s centuries-old wooden dhow shipbuilding craft.',
        img: '/images/journal/journal2.webp',
        alt: 'Sankaran, Uru Shipwright from Beypore, Kerala',
        coverImg: '/images/home/solo-landscape.webp',
        coverAlt: 'Historic wooden Uru shipbuilding yard along the Beypore coast',
        tint: 'sage'
      },
      {
        id: 32,
        name: 'Valli',
        role: 'Bamboo Weaver',
        location: 'Attappady, Kerala',
        desc: 'Harvesting mature forest reed in tune with lunar cycles, Valli weaves resilient grain baskets and winnowing trays.',
        img: '/images/impact/impact5.webp',
        alt: 'Valli, Bamboo Weaver from Attappady, Kerala',
        coverImg: '/images/itineraries/category/nature.webp',
        coverAlt: 'Forested hills and bamboo groves of Attappady',
        tint: 'sky'
      }
    ]
  },
  designers: {
    eyebrow: 'The Specialists',
    title: 'Collaborated Travel Designers',
    description:
      'Regional scholars, naturalists, and cultural specialists who co-create deeply researched journeys alongside us.',
    infinite: true,
    designers: [
      {
        id: 'ananya-roy',
        name: 'Ananya Roy',
        role: 'Heritage Specialist',
        location: 'Kolkata, India',
        intro:
          'Conservation architect curating intimate restoration walks and living courtyard histories.',
        avatar: '/images/itineraries/dummy1.webp',
        coverImage: '/images/itineraries/category/culture.webp',
        tint: 'gold'
      },
      {
        id: 'marcus-vance',
        name: 'Marcus Vance',
        role: 'Wilderness Guide',
        location: 'Melbourne, Australia',
        intro:
          'Expeditionist designing low-impact highland treks and quiet estuarine birding corridors.',
        avatar: '/images/itineraries/dummy3.webp',
        coverImage: '/images/itineraries/category/nature.webp',
        tint: 'sage'
      },
      {
        id: 'kavita-nair',
        name: 'Kavita Nair',
        role: 'Textile Historian',
        location: 'Kochi, India',
        intro:
          'Connecting discerning travellers directly with master weavers and ancestral handloom guilds.',
        avatar: '/images/testimonials/avatar.webp',
        coverImage: '/images/itineraries/category/bespoke.webp',
        tint: 'peach'
      },
      {
        id: 'priya-sharma',
        name: 'Priya Sharma',
        role: 'Wellness Curator',
        location: 'Rishikesh, India',
        intro:
          'Practitioner shaping unhurried Ayurvedic and contemplative retreats grounded in classical lineage.',
        avatar: '/images/home/solo-portrait.webp',
        coverImage: '/images/itineraries/category/wellness.webp',
        tint: 'sky'
      },
      {
        id: 'liam-davies',
        name: 'Liam Davies',
        role: 'Culinary Anthropologist',
        location: 'London, UK',
        intro:
          'Documenting heirloom spice routes, coastal harvests, and matriarchal kitchen traditions.',
        avatar: '/images/itineraries/dummy6.webp',
        coverImage: '/images/itineraries/category/offbeat.webp',
        tint: 'copper'
      },
      {
        id: 'devika-menon',
        name: 'Devika Menon',
        role: 'Vernacular Stays Curator',
        location: 'Palakkad, India',
        intro:
          'Stewarding restored timber homesteads and quiet estate hideaways across rural Malabar.',
        avatar: '/images/itineraries/dummy9.webp',
        coverImage: '/images/itineraries/category/stay.webp',
        tint: 'gold'
      }
    ]
  },
  content: {
    partnerships: {
      eyebrow: 'Partnerships',
      title: 'Creating meaningful journeys Together.',
      description:
        'I work with travel agents, tour operators, event planners, brands and like-minded organisations to co-create authentic, culturally immersive and sustainable travel experiences across South India.',
      image: '/images/impact/impact1.webp',
      imageAlt: 'Meaningful travel partnerships across South India',
      cards: [
        {
          icon: 'users',
          theme: 'cream',
          title: 'B2B Travel Trade Partnerships',
          description:
            'Collaborate on tailor-made itineraries, special interest tours and unique stays for your clients.'
        },
        {
          icon: 'building',
          theme: 'sky',
          title: 'Corporate Experiences',
          description:
            'Design impactful offsites, leadership journeys and team experiences rooted in place and culture.'
        },
        {
          icon: 'chat',
          theme: 'peach',
          title: 'Consulting & Speaking',
          description:
            'Share insights through consulting, keynote talks and panel discussions on responsible and meaningful tourism.'
        },
        {
          icon: 'book',
          theme: 'sage',
          title: 'Education & Research',
          description:
            'Partner on educational journeys, study tours and research projects that support local communities and heritage.'
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
      image: '/images/impact/impact3.webp',
      imageAlt: 'Join the trusted network of local creators and stays',
      cta: {
        label: 'JOIN THE NETWORK',
        to: '/contact'
      }
    }
  }
}
</script>

<template>
  <div class="overflow-x-clip">
    <PageHero :data="pageData.hero" />

    <!-- 1. Community Moving Capsule Streams & Centered Translucent Dossier -->
    <PartnerCommunity :data="pageData.community" />
    
    <!-- 1. Collaborated Travel Designers Centered Slider -->
    <PartnerDesigners :data="pageData.designers" />

    <!-- 3. Partnerships Soft-Gradient Bento & Join the Network -->
    <PartnerInner :data="pageData.content" />
  </div>
</template>
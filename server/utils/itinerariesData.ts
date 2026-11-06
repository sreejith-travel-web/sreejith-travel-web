// ~/server/utils/itinerariesData.ts
export type ItineraryType = 'signature' | 'collaborated' | 'essential'
export type ItineraryCategoryId = 'nature' | 'culture' | 'stays' | 'offbeat' | 'wellness' | 'bespoke'

export interface FeaturedHighlight {
  icon: 'boat' | 'village' | 'temple' | 'wellness'
  label: string
}

export interface CollaboratorInfo {
  name: string
  role: string
  avatar: string
}

export interface ItineraryMeta {
  id: string
  slug: string
  type: ItineraryType
  featured: boolean
  title: string
  region: string
  days: number
  categories: ItineraryCategoryId[]
  tags: [string, string, string]
  intro: string
  image: string
  alt: string
  collaborator?: CollaboratorInfo
  featuredDescription?: string
  highlights?: [FeaturedHighlight, FeaturedHighlight, FeaturedHighlight, FeaturedHighlight]
}

export interface ItineraryFullRecord {
  meta: ItineraryMeta
  blocks: Array<{
    type: 'overview' | 'day' | 'inclusions'
    dayNumber?: number
    title: string
    description: string
    image?: string
  }>
}

const FALLBACK_IMG = '/images/fallbacks/culture.webp'

const defaultBlocks = (title: string): ItineraryFullRecord['blocks'] => [
  {
    type: 'overview',
    title: `The Rhythm of ${title}`,
    description: 'Designed around unhurried mornings, scholar-led walks, and intimate community encounters that reveal the living character of the land.'
  },
  {
    type: 'day',
    dayNumber: 1,
    title: 'Arrival & First Encounters',
    description: 'Settle into a family-stewarded heritage sanctuary followed by an evening walk through quiet village lanes and sacred groves.',
    image: FALLBACK_IMG
  },
  {
    type: 'day',
    dayNumber: 2,
    title: 'Living Traditions & Craft Custodians',
    description: 'Spend the morning inside master artisan workshops and share a seasonal regional lunch prepared from heirloom family recipes.',
    image: FALLBACK_IMG
  },
  {
    type: 'day',
    dayNumber: 3,
    title: 'Trails, Waterways & Quiet Reflection',
    description: 'Journey across scenic highland ridges or tranquil backwater channels with a resident naturalist before a private sunset gathering.',
    image: FALLBACK_IMG
  }
]

export const ITINERARIES_DATABASE: ItineraryFullRecord[] = [
  // ==========================================
  // TIER 1: SIGNATURE ITINERARIES (10)
  // ==========================================
  {
    meta: {
      id: 'sig-1',
      slug: 'stories-along-the-malabar-coast',
      type: 'signature',
      featured: true,
      title: 'Stories Along The Malabar Coast',
      region: 'Kerala',
      days: 7,
      categories: ['culture', 'nature', 'stays'],
      tags: ['#MALABAR', '#HERITAGE', '#BACKWATERS'],
      intro: 'A heritage-rich journey through Kerala’s coastal towns, historic spice trade routes, ancestral courtyard homes, and timeless backwaters.',
      image: FALLBACK_IMG,
      alt: 'Heritage house and wooden boat along the Malabar backwaters',
      featuredDescription: 'Drift through tranquil backwaters, stay in heritage homes, and experience a way of life where nature, tradition, and warm hospitality flow together.',
      highlights: [
        { icon: 'boat', label: 'Houseboat on serene backwaters' },
        { icon: 'village', label: 'Village life experiences' },
        { icon: 'temple', label: 'Heritage stays & local cuisine' },
        { icon: 'wellness', label: 'Ayurveda & wellness' }
      ]
    },
    blocks: defaultBlocks('Stories Along The Malabar Coast')
  },
  {
    meta: {
      id: 'sig-2',
      slug: 'temples-and-living-traditions',
      type: 'signature',
      featured: true,
      title: 'Temples & Living Traditions',
      region: 'Tamil Nadu & Karnataka',
      days: 8,
      categories: ['culture', 'offbeat', 'bespoke'],
      tags: ['#ARCHITECTURE', '#RITUALS', '#CRAFT'],
      intro: 'Walk with temple historians, lost-wax bronze casters, and silk weavers across the sacred towns and royal citadels of the southern plains.',
      image: FALLBACK_IMG,
      alt: 'Ancient stone chariot and temple architecture',
      featuredDescription: 'Explore centuries-old Chola and Vijayanagara sacred spaces alongside historians, classical musicians, and master bronze artisans.',
      highlights: [
        { icon: 'temple', label: 'Scholar-led sacred architecture walks' },
        { icon: 'village', label: 'Private bronze casting ateliers' },
        { icon: 'boat', label: 'Ancestral Chettinad mansion stays' },
        { icon: 'wellness', label: 'Dawn temple music & rituals' }
      ]
    },
    blocks: defaultBlocks('Temples & Living Traditions')
  },
  {
    meta: {
      id: 'sig-3',
      slug: 'forests-of-the-western-ghats',
      type: 'signature',
      featured: false,
      title: 'Forests of the Western Ghats',
      region: 'Kerala & Nilgiris',
      days: 6,
      categories: ['nature', 'wellness', 'offbeat'],
      tags: ['#BIODIVERSITY', '#SHOLA', '#TRAILS'],
      intro: 'Follow mist-covered highland ridges, endemic birding trails, and cloud-forest sanctuaries guided by conservation naturalists and local trackers.',
      image: FALLBACK_IMG,
      alt: 'Mist-covered forests of the Western Ghats'
    },
    blocks: defaultBlocks('Forests of the Western Ghats')
  },
  {
    meta: {
      id: 'sig-4',
      slug: 'sacred-groves-of-north-malabar',
      type: 'signature',
      featured: false,
      title: 'Sacred Groves & Folklore of Malabar',
      region: 'North Kerala',
      days: 7,
      categories: ['culture', 'nature', 'offbeat'],
      tags: ['#THEYYAM', '#MONSOON', '#MALABAR'],
      intro: 'Witness sacred grove rituals, spice-laden river estuaries, handloom weaver villages, and the ancestral performing arts of North Malabar.',
      image: FALLBACK_IMG,
      alt: 'Sacred groves and monsoon landscapes of Malabar'
    },
    blocks: defaultBlocks('Sacred Groves & Folklore of Malabar')
  },
  {
    meta: {
      id: 'sig-5',
      slug: 'chettinad-mansions-and-heirloom-tables',
      type: 'signature',
      featured: false,
      title: 'Chettinad Mansions & Heirloom Tables',
      region: 'Tamil Nadu',
      days: 5,
      categories: ['culture', 'stays', 'bespoke'],
      tags: ['#CULINARY', '#HERITAGE', '#MANSIONS'],
      intro: 'Step behind carved Burmese teak doors for heirloom spice workshops, handmade Athangudi tile studios, and gracious courtyard hospitality.',
      image: FALLBACK_IMG,
      alt: 'Carved pillars of an ancestral Chettinad mansion'
    },
    blocks: defaultBlocks('Chettinad Mansions & Heirloom Tables')
  },
  {
    meta: {
      id: 'sig-6',
      slug: 'ayurveda-and-sacred-waters-by-the-nila',
      type: 'signature',
      featured: false,
      title: 'Ayurveda & Sacred Waters by the Nila',
      region: 'Central Kerala',
      days: 9,
      categories: ['wellness', 'stays', 'nature'],
      tags: ['#AYURVEDA', '#HEALING', '#RIVERSIDE'],
      intro: 'A deeply restorative immersion guided by traditional Vaidyas, medicinal botanical gardens, temple percussion evenings, and slow riverine living.',
      image: FALLBACK_IMG,
      alt: 'Restorative Ayurveda sanctuary by the river'
    },
    blocks: defaultBlocks('Ayurveda & Sacred Waters by the Nila')
  },
  {
    meta: {
      id: 'sig-7',
      slug: 'nilgiri-biosphere-and-planters-trails',
      type: 'signature',
      featured: false,
      title: 'Nilgiri Biosphere & Planters’ Trails',
      region: 'Nilgiri Hills',
      days: 6,
      categories: ['nature', 'culture', 'stays'],
      tags: ['#NILGIRIS', '#TEAESTATES', '#ECOLOGY'],
      intro: 'Stay in heritage planters’ bungalows while exploring high-elevation shola grasslands, indigenous pastoral lore, and single-estate tea gardens.',
      image: FALLBACK_IMG,
      alt: 'High-altitude tea slopes in the Nilgiris'
    },
    blocks: defaultBlocks('Nilgiri Biosphere & Planters’ Trails')
  },
  {
    meta: {
      id: 'sig-8',
      slug: 'hampi-boulders-and-deccan-echoes',
      type: 'signature',
      featured: false,
      title: 'Hampi Boulders & Royal Echoes',
      region: 'Northern Karnataka',
      days: 6,
      categories: ['culture', 'bespoke', 'stays'],
      tags: ['#HAMPI', '#ARCHAEOLOGY', '#LUXURY'],
      intro: 'Private archaeological walks at dawn, coracle crossings on the Tungabhadra River, handloom guilds, and palatial heritage suites.',
      image: FALLBACK_IMG,
      alt: 'Stone temples among Hampi boulders at sunrise'
    },
    blocks: defaultBlocks('Hampi Boulders & Royal Echoes')
  },
  {
    meta: {
      id: 'sig-9',
      slug: 'silent-valleys-and-artisans-of-palakkad',
      type: 'signature',
      featured: false,
      title: 'Silent Valleys & Artisans of Palakkad',
      region: 'Palakkad Gap, Kerala',
      days: 5,
      categories: ['offbeat', 'culture', 'nature'],
      tags: ['#PALAKKAD', '#HANDLOOM', '#VILLAGES'],
      intro: 'Discover emerald Matta paddy plains, traditional bell-metal foundries, Kuthampully weaver hamlets, and untamed rainforest buffers.',
      image: FALLBACK_IMG,
      alt: 'Emerald paddy fields and palm groves of Palakkad'
    },
    blocks: defaultBlocks('Silent Valleys & Artisans of Palakkad')
  },
  {
    meta: {
      id: 'sig-10',
      slug: 'coorg-estates-and-kaveri-headwaters',
      type: 'signature',
      featured: false,
      title: 'Coorg Estates & Kaveri Headwaters',
      region: 'Kodagu, Karnataka',
      days: 6,
      categories: ['nature', 'stays', 'bespoke'],
      tags: ['#COFFEE', '#RAINFOREST', '#HOMESTEADS'],
      intro: 'Shade-grown coffee walks, Kodava culinary heritage, sacred river headwaters, and secluded forest verandas in the misty hills of Kodagu.',
      image: FALLBACK_IMG,
      alt: 'Misty coffee estate veranda in Coorg'
    },
    blocks: defaultBlocks('Coorg Estates & Kaveri Headwaters')
  },

  // ==========================================
  // TIER 2: COLLABORATED ITINERARIES (10)
  // ==========================================
  {
    meta: {
      id: 'col-1',
      slug: 'into-the-western-ghats-expedition',
      type: 'collaborated',
      featured: true,
      title: 'Into The Western Ghats',
      region: 'Munnar & Anaconda Hills',
      days: 8,
      categories: ['nature', 'offbeat', 'wellness'],
      tags: ['#WESTERNGHATS', '#TREK', '#WILDERNESS'],
      intro: 'Trek through misty hills, discover hidden waterfalls, and experience Kerala’s rich mountain wilderness up close.',
      image: FALLBACK_IMG,
      alt: 'Misty tea hills and cloud forests in the Western Ghats',
      collaborator: {
        name: 'Ananya Menon',
        role: 'Travel Designer',
        avatar: FALLBACK_IMG
      },
      featuredDescription: 'Journey across high-altitude ridges with conservationists and botanical illustrators, staying in secluded cloud-forest sanctuaries.',
      highlights: [
        { icon: 'temple', label: 'Private cloud-forest sanctuary access' },
        { icon: 'village', label: 'Indigenous highland tracker walks' },
        { icon: 'wellness', label: 'Botanical & spice estate immersions' },
        { icon: 'boat', label: 'High-range mountain stream trails' }
      ]
    },
    blocks: defaultBlocks('Into The Western Ghats')
  },
  {
    meta: {
      id: 'col-2',
      slug: 'sacred-ghats-and-classical-banaras',
      type: 'collaborated',
      featured: true,
      title: 'Sacred Ghats & Classical Banaras',
      region: 'Varanasi, Uttar Pradesh',
      days: 5,
      categories: ['culture', 'wellness', 'bespoke'],
      tags: ['#VARANASI', '#CLASSICALMUSIC', '#SILK'],
      intro: 'Curated with ethnomusicologists and master brocade weavers along the timeless riverfront courtyards of Kashi.',
      image: FALLBACK_IMG,
      alt: 'Dawn boat ride along the sacred ghats',
      collaborator: {
        name: 'Ananya Roy',
        role: 'Heritage Specialist',
        avatar: FALLBACK_IMG
      },
      featuredDescription: 'Experience Kashi through the eyes of its master musicians, Sanskrit scholars, and multi-generational Banarasi silk weavers from a restored river palace.',
      highlights: [
        { icon: 'boat', label: 'Dawn wooden boat recitals on the Ganga' },
        { icon: 'temple', label: 'Old-city courtyard haveli walks' },
        { icon: 'village', label: 'Master Banarasi handloom studios' },
        { icon: 'wellness', label: 'Private baithak classical concert' }
      ]
    },
    blocks: defaultBlocks('Sacred Ghats & Classical Banaras')
  },
  {
    meta: {
      id: 'col-3',
      slug: 'kutch-textile-guilds-and-salt-deserts',
      type: 'collaborated',
      featured: false,
      title: 'Kutch Textile Guilds & Salt Deserts',
      region: 'Kutch, Gujarat',
      days: 7,
      categories: ['culture', 'offbeat', 'bespoke'],
      tags: ['#KUTCH', '#AJRAKH', '#ARTISANS'],
      intro: 'Meet natural indigo Ajrakh block-printers, Rogan painters, and pastoral embroidery guilds in remote desert villages.',
      image: FALLBACK_IMG,
      alt: 'Natural indigo and Ajrakh block printing in Kutch',
      collaborator: {
        name: 'Kavita Nair',
        role: 'Textile Historian',
        avatar: FALLBACK_IMG
      }
    },
    blocks: defaultBlocks('Kutch Textile Guilds & Salt Deserts')
  },
  {
    meta: {
      id: 'col-4',
      slug: 'kaziranga-floodplains-and-majuli-island',
      type: 'collaborated',
      featured: false,
      title: 'Kaziranga Floodplains & Majuli Island',
      region: 'Assam',
      days: 8,
      categories: ['nature', 'culture', 'offbeat'],
      tags: ['#ASSAM', '#WILDLIFE', '#MAJULI'],
      intro: 'Track one-horned rhinos with field biologists and visit the mask-making monasteries of Majuli river island.',
      image: FALLBACK_IMG,
      alt: 'Floodplains of Kaziranga and river island heritage',
      collaborator: {
        name: 'Marcus Vance',
        role: 'Wilderness Guide',
        avatar: FALLBACK_IMG
      }
    },
    blocks: defaultBlocks('Kaziranga Floodplains & Majuli Island')
  },
  {
    meta: {
      id: 'col-5',
      slug: 'aravalli-stepwells-and-pastoral-trails',
      type: 'collaborated',
      featured: false,
      title: 'Aravalli Stepwells & Pastoral Trails',
      region: 'Rural Rajasthan',
      days: 8,
      categories: ['stays', 'culture', 'bespoke'],
      tags: ['#RAJASTHAN', '#STEPWELLS', '#HERITAGEFORT'],
      intro: 'Bypass crowded tourist circuits for private castle stays, subterranean stepwells, and Rabari pastoralist encounters.',
      image: FALLBACK_IMG,
      alt: 'Ancient stone stepwell and Aravalli hills',
      collaborator: {
        name: 'Liam Davies',
        role: 'Culinary Anthropologist',
        avatar: FALLBACK_IMG
      }
    },
    blocks: defaultBlocks('Aravalli Stepwells & Pastoral Trails')
  },
  {
    meta: {
      id: 'col-6',
      slug: 'sikkim-cloud-forests-and-orchid-valleys',
      type: 'collaborated',
      featured: false,
      title: 'Sikkim Cloud Forests & Orchid Valleys',
      region: 'West & North Sikkim',
      days: 9,
      categories: ['nature', 'wellness', 'stays'],
      tags: ['#SIKKIM', '#CLOUDFOREST', '#ORGANIC'],
      intro: 'Explore the world’s first organic state through Lepcha forest lore, rhododendron ridges, and mountain lodges.',
      image: FALLBACK_IMG,
      alt: 'Misty mountain ridge and forest sanctuary in Sikkim',
      collaborator: {
        name: 'Priya Sharma',
        role: 'Wellness Curator',
        avatar: FALLBACK_IMG
      }
    },
    blocks: defaultBlocks('Sikkim Cloud Forests & Orchid Valleys')
  },
  {
    meta: {
      id: 'col-7',
      slug: 'satpura-walking-safaris-and-gond-studios',
      type: 'collaborated',
      featured: false,
      title: 'Satpura Walking Safaris & Gond Studios',
      region: 'Madhya Pradesh',
      days: 6,
      categories: ['nature', 'stays', 'bespoke'],
      tags: ['#SATPURA', '#WALKINGSAFARI', '#GONDART'],
      intro: 'Canoe and foot safaris in central India’s wilderness paired with intimate visits to indigenous Gond painters.',
      image: FALLBACK_IMG,
      alt: 'Quiet forest stream and wildlife trail in Satpura',
      collaborator: {
        name: 'Marcus Vance',
        role: 'Wilderness Guide',
        avatar: FALLBACK_IMG
      }
    },
    blocks: defaultBlocks('Satpura Walking Safaris & Gond Studios')
  },
  {
    meta: {
      id: 'col-8',
      slug: 'meghalaya-living-root-bridges-and-canyons',
      type: 'collaborated',
      featured: false,
      title: 'Meghalaya Living Root Bridges',
      region: 'Khasi & Jaintia Hills',
      days: 7,
      categories: ['nature', 'offbeat', 'culture'],
      tags: ['#MEGHALAYA', '#ROOTBRIDGES', '#MATRILINEAL'],
      intro: 'Walk across bio-engineered Ficus root bridges and learn indigenous forest governance from Khasi village elders.',
      image: FALLBACK_IMG,
      alt: 'Living root bridge spanning a clear forest stream',
      collaborator: {
        name: 'Ananya Menon',
        role: 'Travel Designer',
        avatar: FALLBACK_IMG
      }
    },
    blocks: defaultBlocks('Meghalaya Living Root Bridges')
  },
  {
    meta: {
      id: 'col-9',
      slug: 'kumaon-himalayan-ridge-and-village-walk',
      type: 'collaborated',
      featured: false,
      title: 'Kumaon Himalayan Ridge Walk',
      region: 'Uttarakhand',
      days: 7,
      categories: ['wellness', 'nature', 'stays'],
      tags: ['#KUMAON', '#RIDGEWALK', '#SLOWTRAVEL'],
      intro: 'Walk from village house to village house below Nanda Devi, staying in restored stone-and-slate Kumaoni homes.',
      image: FALLBACK_IMG,
      alt: 'Terraced valleys and snow peaks in Kumaon',
      collaborator: {
        name: 'Priya Sharma',
        role: 'Wellness Curator',
        avatar: FALLBACK_IMG
      }
    },
    blocks: defaultBlocks('Kumaon Himalayan Ridge Walk')
  },
  {
    meta: {
      id: 'col-10',
      slug: 'himalayan-monasteries-and-high-passes',
      type: 'collaborated',
      featured: false,
      title: 'Himalayan Monasteries & High Passes',
      region: 'Ladakh & Zanskar',
      days: 10,
      categories: ['nature', 'culture', 'offbeat'],
      tags: ['#HIMALAYAS', '#MONASTERIES', '#HIGHALTITUDE'],
      intro: 'Experience ancient trans-Himalayan gompas, sacred thangka restoration, and remote high-valley homestays.',
      image: FALLBACK_IMG,
      alt: 'Himalayan monastery perched above mountain valleys',
      collaborator: {
        name: 'Ananya Roy',
        role: 'Heritage Specialist',
        avatar: FALLBACK_IMG
      }
    },
    blocks: defaultBlocks('Himalayan Monasteries & High Passes')
  },

  // ==========================================
  // TIER 3: ESSENTIAL / TRAVEL YOUR WAY GENERAL ROUTES (8)
  // (Never shown in Signature, Collaborated, or Homepage; listed 3rd in Travel Your Way)
  // ==========================================
  {
    meta: {
      id: 'ess-1',
      slug: 'periyar-spice-hills-and-lake-trails',
      type: 'essential',
      featured: false,
      title: 'Periyar Spice Hills & Lake Trails',
      region: 'Thekkady, Kerala',
      days: 4,
      categories: ['nature', 'stays'],
      tags: ['#PERIYAR', '#SPICES', '#FOREST'],
      intro: 'A classic highland escape through fragrant cardamom hills, bamboo rafting waters, and quiet plantation homesteads on the forest edge.',
      image: FALLBACK_IMG,
      alt: 'Periyar lake and forested hills at dawn'
    },
    blocks: defaultBlocks('Periyar Spice Hills & Lake Trails')
  },
  {
    meta: {
      id: 'ess-2',
      slug: 'coastal-whispers-of-marari-and-alleppey',
      type: 'essential',
      featured: false,
      title: 'Coastal Whispers of Marari & Alleppey',
      region: 'Coastal Kerala',
      days: 4,
      categories: ['stays', 'wellness', 'nature'],
      tags: ['#COASTAL', '#MARARI', '#SLOWTRAVEL'],
      intro: 'Unwind along palm-fringed fishing beaches and peaceful canal villages with unhurried coastal walks and fresh catch dining.',
      image: FALLBACK_IMG,
      alt: 'Palm-lined sandy coast at Marari'
    },
    blocks: defaultBlocks('Coastal Whispers of Marari & Alleppey')
  },
  {
    meta: {
      id: 'ess-3',
      slug: 'mysore-palaces-and-royal-gardens',
      type: 'essential',
      featured: false,
      title: 'Mysore Palaces & Artisan Bazaars',
      region: 'Southern Karnataka',
      days: 5,
      categories: ['culture', 'stays'],
      tags: ['#MYSORE', '#SILK', '#HERITAGE'],
      intro: 'Explore historic royal boulevards, traditional sandalwood and silk ateliers, and lively flower and incense markets.',
      image: FALLBACK_IMG,
      alt: 'Heritage palace arches and gardens in Mysore'
    },
    blocks: defaultBlocks('Mysore Palaces & Artisan Bazaars')
  },
  {
    meta: {
      id: 'ess-4',
      slug: 'wayanad-bamboo-groves-and-caves',
      type: 'essential',
      featured: false,
      title: 'Wayanad Bamboo Groves & Highland Caves',
      region: 'Wayanad, Kerala',
      days: 5,
      categories: ['nature', 'offbeat'],
      tags: ['#WAYANAD', '#BAMBOO', '#HIGHLANDS'],
      intro: 'Discover prehistoric rock engravings, misty mountain lakes, and bamboo craft villages nestled in the northern hills of Kerala.',
      image: FALLBACK_IMG,
      alt: 'Bamboo groves and mountain mist in Wayanad'
    },
    blocks: defaultBlocks('Wayanad Bamboo Groves & Highland Caves')
  },
  {
    meta: {
      id: 'ess-5',
      slug: 'pondicherry-boulevards-and-coastal-calm',
      type: 'essential',
      featured: false,
      title: 'Pondicherry Boulevards & Coastal Calm',
      region: 'Puducherry',
      days: 4,
      categories: ['culture', 'stays', 'wellness'],
      tags: ['#PONDICHERRY', '#HERITAGE', '#COAST'],
      intro: 'Stroll shaded Franco-Tamil quarters, artisan paper and pottery studios, and quiet oceanfront promenades.',
      image: FALLBACK_IMG,
      alt: 'Sunlit heritage street in Pondicherry'
    },
    blocks: defaultBlocks('Pondicherry Boulevards & Coastal Calm')
  },
  {
    meta: {
      id: 'ess-6',
      slug: 'kabini-river-and-forest-edge-retreat',
      type: 'essential',
      featured: false,
      title: 'Kabini River & Forest Edge Retreat',
      region: 'Nagarhole Buffer, Karnataka',
      days: 4,
      categories: ['nature', 'stays', 'bespoke'],
      tags: ['#KABINI', '#RIVER', '#WILDLIFE'],
      intro: 'Spend tranquil days along the Kabini riverbanks with coracle rides, birdwatching trails, and starlit lodge evenings.',
      image: FALLBACK_IMG,
      alt: 'Calm riverbanks along the Kabini forest'
    },
    blocks: defaultBlocks('Kabini River & Forest Edge Retreat')
  },
  {
    meta: {
      id: 'ess-7',
      slug: 'vagamon-pine-valleys-and-meadows',
      type: 'essential',
      featured: false,
      title: 'Vagamon Pine Valleys & Rolling Meadows',
      region: 'Highland Kerala',
      days: 4,
      categories: ['offbeat', 'nature', 'wellness'],
      tags: ['#VAGAMON', '#MEADOWS', '#HILLS'],
      intro: 'Pause in quiet highland meadows, pine forests, and small hilltop estates far removed from busy hill-station crowds.',
      image: FALLBACK_IMG,
      alt: 'Rolling green meadows and pine valleys in Vagamon'
    },
    blocks: defaultBlocks('Vagamon Pine Valleys & Rolling Meadows')
  },
  {
    meta: {
      id: 'ess-8',
      slug: 'madurai-courtyards-and-jasmine-trails',
      type: 'essential',
      featured: false,
      title: 'Madurai Courtyards & Jasmine Trails',
      region: 'Southern Tamil Nadu',
      days: 4,
      categories: ['culture', 'bespoke'],
      tags: ['#MADURAI', '#TEMPLES', '#CULINARY'],
      intro: 'Experience dawn flower markets, evening temple ceremonies, and time-honored southern culinary traditions in one of India’s oldest cities.',
      image: FALLBACK_IMG,
      alt: 'Carved temple towers and flower markets of Madurai'
    },
    blocks: defaultBlocks('Madurai Courtyards & Jasmine Trails')
  }
]
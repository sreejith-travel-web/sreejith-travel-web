// ~/server/utils/journalData.ts
export type JournalPostType = 'articles' | 'case-studies'

export type JournalCategoryId =
  | 'nature'
  | 'culture'
  | 'stays'
  | 'offbeat'
  | 'wellness'
  | 'bespoke'

export interface JournalMeta {
  id: string
  slug: string
  type: JournalPostType
  featured: boolean
  title: string
  excerpt: string
  categoryLabel: string
  categories: JournalCategoryId[]
  readTime: string
  publishDate: string
  tags: [string, string, string]
  topics: string[]
  image: string
  alt: string
}

export interface JournalContentBlock {
  type: 'heading' | 'paragraph' | 'quote' | 'image-split' | 'highlights'
  id?: string
  title?: string
  text?: string
  quoteAuthor?: string
  image?: string
  imageAlt?: string
  items?: string[]
}

export interface JournalFullRecord {
  meta: JournalMeta
  blocks: JournalContentBlock[]
}

const FALLBACK_IMG = '/images/fallbacks/culture.webp'

const createDefaultBlocks = (title: string, excerpt: string): JournalContentBlock[] => [
  {
    type: 'paragraph',
    text: excerpt
  },
  {
    type: 'heading',
    id: 'beyond-the-surface',
    title: 'Looking Beyond the Surface'
  },
  {
    type: 'paragraph',
    text: `Every encounter around ${title} begins with unhurried listening. When we step away from commercial schedules and spend time in family courtyards, craft ateliers, and forest buffers, a far more intimate story of India emerges.`
  },
  {
    type: 'quote',
    text: 'Places tell you where you are. Stories tell you how it was. People tell you why it matters.',
    quoteAuthor: 'Sree Jith Palliyil'
  },
  {
    type: 'heading',
    id: 'the-living-context',
    title: 'The Living Context & Custodians'
  },
  {
    type: 'image-split',
    title: 'Craft, Ecology & Shared Memory',
    text: 'By collaborating directly with historians, naturalists, and multi-generational artisans, each journey preserves fragile knowledge while creating meaningful local livelihoods.',
    image: FALLBACK_IMG,
    imageAlt: title
  },
  {
    type: 'heading',
    id: 'key-takeaways',
    title: 'Field Notes & Reflections'
  },
  {
    type: 'highlights',
    title: 'What Makes This Encounter Endure',
    items: [
      'Direct grass-roots access guided by regional scholars and community elders.',
      'Paced itineraries that leave room for spontaneous conversation and quiet observation.',
      'Respectful cultural exchange that honors sacred spaces and vernacular traditions.'
    ]
  }
]

export const JOURNAL_DATABASE: JournalFullRecord[] = [
  // ==========================================
  // 16 ARTICLES
  // ==========================================
  {
    meta: {
      id: 'art-1',
      slug: 'woven-through-generations',
      type: 'articles',
      featured: true,
      title: 'Woven through generations',
      excerpt: 'Meet the artisans whose patient hands and inherited skills keep local traditions alive, weaving memory into everyday objects.',
      categoryLabel: 'PEOPLE & CRAFT',
      categories: ['culture', 'offbeat'],
      readTime: '6 MIN READ',
      publishDate: '2026-05-12',
      tags: ['#culture', '#craft', '#kerala'],
      topics: ['#kerala', '#culture', '#craft', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Master weaver working on a traditional handloom'
    },
    blocks: createDefaultBlocks('Woven through generations', 'Meet the artisans whose patient hands and inherited skills keep local traditions alive, weaving memory into everyday objects.')
  },
  {
    meta: {
      id: 'art-2',
      slug: 'the-quiet-rhythm-of-the-backwaters',
      type: 'articles',
      featured: true,
      title: 'The quiet rhythm of the backwaters',
      excerpt: 'A slow journey through Kerala’s intricate waterways, where life moves to the gentle pace of the paddle and the day unfolds on water.',
      categoryLabel: 'PLACES & PEOPLE',
      categories: ['nature', 'stays', 'wellness'],
      readTime: '7 MIN READ',
      publishDate: '2026-05-08',
      tags: ['#kerala', '#backwaters', '#slowtravel'],
      topics: ['#kerala', '#wellness', '#sustainable', '#islands'],
      image: FALLBACK_IMG,
      alt: 'Wooden country boat gliding across calm backwaters at sunset'
    },
    blocks: createDefaultBlocks('The quiet rhythm of the backwaters', 'A slow journey through Kerala’s intricate waterways, where life moves to the gentle pace of the paddle and the day unfolds on water.')
  },
  {
    meta: {
      id: 'art-3',
      slug: 'a-journey-through-living-heritage',
      type: 'articles',
      featured: false,
      title: 'A journey through living heritage',
      excerpt: 'From ancient temples to vibrant local traditions, explore the stories, people, and places that keep India’s heritage alive today.',
      categoryLabel: 'CULTURE & HERITAGE',
      categories: ['culture', 'bespoke'],
      readTime: '8 MIN READ',
      publishDate: '2026-05-02',
      tags: ['#heritage', '#culture', '#india'],
      topics: ['#culture', '#sustainable', '#roadtrips'],
      image: FALLBACK_IMG,
      alt: 'Ancient carved stone chariot in Hampi'
    },
    blocks: createDefaultBlocks('A journey through living heritage', 'From ancient temples to vibrant local traditions, explore the stories, people, and places that keep India’s heritage alive today.')
  },
  {
    meta: {
      id: 'art-4',
      slug: 'behind-the-doors-of-chettinad',
      type: 'articles',
      featured: false,
      title: 'Behind the doors of Chettinad',
      excerpt: 'Step inside ancestral homes where carved courtyards, family stories, and gracious hospitality reveal the living heart of Tamil Nadu.',
      categoryLabel: 'LIVING HERITAGE',
      categories: ['culture', 'stays', 'bespoke'],
      readTime: '7 MIN READ',
      publishDate: '2026-04-26',
      tags: ['#architecture', '#heritage', '#food'],
      topics: ['#culture', '#food', '#roadtrips'],
      image: FALLBACK_IMG,
      alt: 'Sunlit courtyard of an ancestral Chettinad mansion'
    },
    blocks: createDefaultBlocks('Behind the doors of Chettinad', 'Step inside ancestral homes where carved courtyards, family stories, and gracious hospitality reveal the living heart of Tamil Nadu.')
  },
  {
    meta: {
      id: 'art-5',
      slug: 'the-quiet-paths-of-the-western-ghats',
      type: 'articles',
      featured: false,
      title: 'The quiet paths of the Western Ghats',
      excerpt: 'Follow forest trails and mist-covered ridges, discovering the quiet rhythms and remarkable biodiversity of the southern mountains.',
      categoryLabel: 'NATURE & TRAILS',
      categories: ['nature', 'offbeat', 'wellness'],
      readTime: '5 MIN READ',
      publishDate: '2026-04-19',
      tags: ['#wildlife', '#kerala', '#sustainable'],
      topics: ['#kerala', '#wildlife', '#wellness', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Misty shola forest ridges in the Western Ghats'
    },
    blocks: createDefaultBlocks('The quiet paths of the Western Ghats', 'Follow forest trails and mist-covered ridges, discovering the quiet rhythms and remarkable biodiversity of the southern mountains.')
  },
  {
    meta: {
      id: 'art-6',
      slug: 'a-place-at-the-kerala-table',
      type: 'articles',
      featured: false,
      title: 'A place at the Kerala table',
      excerpt: 'Discover the seasonal ingredients, generous kitchens, and cherished family recipes that turn a regional meal into a shared story.',
      categoryLabel: 'FOOD & CULTURE',
      categories: ['culture', 'stays'],
      readTime: '4 MIN READ',
      publishDate: '2026-04-14',
      tags: ['#food', '#kerala', '#culture'],
      topics: ['#kerala', '#food', '#culture'],
      image: FALLBACK_IMG,
      alt: 'Traditional meal served with heirloom spices'
    },
    blocks: createDefaultBlocks('A place at the Kerala table', 'Discover the seasonal ingredients, generous kitchens, and cherished family recipes that turn a regional meal into a shared story.')
  },
  {
    meta: {
      id: 'art-7',
      slug: 'sacred-groves-and-living-folklore',
      type: 'articles',
      featured: false,
      title: 'Sacred groves and living folklore of Malabar',
      excerpt: 'In the wooded shrines of North Kerala, ancient ecological conservation and ritual performance remain inseparable.',
      categoryLabel: 'CULTURE & ECOLOGY',
      categories: ['culture', 'nature', 'offbeat'],
      readTime: '6 MIN READ',
      publishDate: '2026-04-08',
      tags: ['#kerala', '#culture', '#wildlife'],
      topics: ['#kerala', '#culture', '#wildlife', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Sacred grove canopy in North Malabar'
    },
    blocks: createDefaultBlocks('Sacred groves and living folklore of Malabar', 'In the wooded shrines of North Kerala, ancient ecological conservation and ritual performance remain inseparable.')
  },
  {
    meta: {
      id: 'art-8',
      slug: 'high-passes-and-monastic-silence',
      type: 'articles',
      featured: false,
      title: 'High passes and monastic silence in Ladakh',
      excerpt: 'Travelling slowly across trans-Himalayan valleys where centuries-old gompas guard painted manuscripts and mountain wisdom.',
      categoryLabel: 'HIGHLAND JOURNEYS',
      categories: ['nature', 'wellness', 'offbeat'],
      readTime: '8 MIN READ',
      publishDate: '2026-03-29',
      tags: ['#himalayas', '#wellness', '#culture'],
      topics: ['#himalayas', '#wellness', '#culture', '#roadtrips'],
      image: FALLBACK_IMG,
      alt: 'Himalayan monastery overlooking dramatic valleys'
    },
    blocks: createDefaultBlocks('High passes and monastic silence in Ladakh', 'Travelling slowly across trans-Himalayan valleys where centuries-old gompas guard painted manuscripts and mountain wisdom.')
  },
  {
    meta: {
      id: 'art-9',
      slug: 'vernacular-architecture-that-breathes',
      type: 'articles',
      featured: false,
      title: 'Vernacular architecture that breathes with the land',
      excerpt: 'How lime plaster, laterite stone, and carved timber courtyards offer timeless lessons in sustainable boutique hospitality.',
      categoryLabel: 'PLACES TO STAY',
      categories: ['stays', 'bespoke', 'culture'],
      readTime: '6 MIN READ',
      publishDate: '2026-03-21',
      tags: ['#sustainable', '#culture', '#kerala'],
      topics: ['#kerala', '#culture', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Heritage timber and tile veranda surrounded by palms'
    },
    blocks: createDefaultBlocks('Vernacular architecture that breathes with the land', 'How lime plaster, laterite stone, and carved timber courtyards offer timeless lessons in sustainable boutique hospitality.')
  },
  {
    meta: {
      id: 'art-10',
      slug: 'guardians-of-the-coromandel-shores',
      type: 'articles',
      featured: false,
      title: 'Guardians of the Coromandel shores',
      excerpt: 'Walking alongside coastal fishing hamlets and marine conservationists working to protect seasonal turtle nesting beaches.',
      categoryLabel: 'COASTAL CONSERVATION',
      categories: ['nature', 'offbeat'],
      readTime: '5 MIN READ',
      publishDate: '2026-03-14',
      tags: ['#beaches', '#wildlife', '#sustainable'],
      topics: ['#beaches', '#wildlife', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Golden dawn along the Coromandel coastline'
    },
    blocks: createDefaultBlocks('Guardians of the Coromandel shores', 'Walking alongside coastal fishing hamlets and marine conservationists working to protect seasonal turtle nesting beaches.')
  },
  {
    meta: {
      id: 'art-11',
      slug: 'the-botanical-wisdom-of-ayurveda',
      type: 'articles',
      featured: false,
      title: 'The botanical wisdom of classical Ayurveda',
      excerpt: 'Inside family-run Vaidyasalas where seasonal rhythms, medicinal forest herbs, and mindful rest restore balance.',
      categoryLabel: 'WELLNESS & SPIRIT',
      categories: ['wellness', 'stays'],
      readTime: '7 MIN READ',
      publishDate: '2026-03-06',
      tags: ['#wellness', '#kerala', '#sustainable'],
      topics: ['#kerala', '#wellness', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Fresh botanical herbs prepared for classical Ayurveda'
    },
    blocks: createDefaultBlocks('The botanical wisdom of classical Ayurveda', 'Inside family-run Vaidyasalas where seasonal rhythms, medicinal forest herbs, and mindful rest restore balance.')
  },
  {
    meta: {
      id: 'art-12',
      slug: 'river-islands-of-the-brahmaputra',
      type: 'articles',
      featured: false,
      title: 'Mask-makers and river islands of Majuli',
      excerpt: 'Exploring the shifting river islands of Assam where monastic artisans sculpt expressive masks from bamboo and river clay.',
      categoryLabel: 'OFFBEAT EXPLORATIONS',
      categories: ['offbeat', 'culture', 'nature'],
      readTime: '6 MIN READ',
      publishDate: '2026-02-25',
      tags: ['#islands', '#culture', '#wildlife'],
      topics: ['#islands', '#culture', '#wildlife'],
      image: FALLBACK_IMG,
      alt: 'Quiet river island landscape in Assam'
    },
    blocks: createDefaultBlocks('Mask-makers and river islands of Majuli', 'Exploring the shifting river islands of Assam where monastic artisans sculpt expressive masks from bamboo and river clay.')
  },
  {
    meta: {
      id: 'art-13',
      slug: 'indigenous-rice-and-agrarian-memory',
      type: 'articles',
      featured: false,
      title: 'Cultivating GI-tagged Matta rice & agrarian memory',
      excerpt: 'Why preserving indigenous seed varieties in Palakkad’s paddy fields is vital to culinary heritage and rural resilience.',
      categoryLabel: 'FOOD & ECOLOGY',
      categories: ['culture', 'nature', 'offbeat'],
      readTime: '5 MIN READ',
      publishDate: '2026-02-18',
      tags: ['#food', '#kerala', '#sustainable'],
      topics: ['#kerala', '#food', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Lush green paddy fields in Palakkad'
    },
    blocks: createDefaultBlocks('Cultivating GI-tagged Matta rice & agrarian memory', 'Why preserving indigenous seed varieties in Palakkad’s paddy fields is vital to culinary heritage and rural resilience.')
  },
  {
    meta: {
      id: 'art-14',
      slug: 'bronze-casters-of- the-kaveri-delta',
      type: 'articles',
      featured: false,
      title: 'Lost-wax bronze casters of the Kaveri delta',
      excerpt: 'Seven centuries of Chola sculptural mastery passed down through quiet riverfront workshops in Swamimalai.',
      categoryLabel: 'PEOPLE & CRAFT',
      categories: ['culture', 'bespoke'],
      readTime: '6 MIN READ',
      publishDate: '2026-02-10',
      tags: ['#culture', '#craft', '#heritage'],
      topics: ['#culture', '#roadtrips'],
      image: FALLBACK_IMG,
      alt: 'Artisan sculpting a wax model for bronze casting'
    },
    blocks: createDefaultBlocks('Lost-wax bronze casters of the Kaveri delta', 'Seven centuries of Chola sculptural mastery passed down through quiet riverfront workshops in Swamimalai.')
  },
  {
    meta: {
      id: 'art-15',
      slug: 'cloud-forests-and-himalayan-orchids',
      type: 'articles',
      featured: false,
      title: 'Walking the organic ridges of West Sikkim',
      excerpt: 'From sacred alpine lakes to cardamom-shaded homestays in the shadow of Kanchenjunga.',
      categoryLabel: 'NATURE & WILDERNESS',
      categories: ['nature', 'stays', 'wellness'],
      readTime: '7 MIN READ',
      publishDate: '2026-01-29',
      tags: ['#himalayas', '#wildlife', '#sustainable'],
      topics: ['#himalayas', '#wildlife', '#wellness', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Cloud forest trail in the eastern Himalayas'
    },
    blocks: createDefaultBlocks('Walking the organic ridges of West Sikkim', 'From sacred alpine lakes to cardamom-shaded homestays in the shadow of Kanchenjunga.')
  },
  {
    meta: {
      id: 'art-16',
      slug: 'unscripted-roadtrips-across-the-deccan',
      type: 'articles',
      featured: false,
      title: 'Unscripted road journeys across the Deccan plateau',
      excerpt: 'Leaving room for serendipity between rock-cut sanctuaries, weaving towns, and historic stepwells.',
      categoryLabel: 'SLOW TRAVEL',
      categories: ['offbeat', 'culture', 'bespoke'],
      readTime: '5 MIN READ',
      publishDate: '2026-01-18',
      tags: ['#roadtrips', '#culture', '#heritage'],
      topics: ['#roadtrips', '#culture', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Scenic open road across the Deccan plateau'
    },
    blocks: createDefaultBlocks('Unscripted road journeys across the Deccan plateau', 'Leaving room for serendipity between rock-cut sanctuaries, weaving towns, and historic stepwells.')
  },

  // ==========================================
  // 12 CASE STUDIES (Linked from Testimonials)
  // ==========================================
  {
    meta: {
      id: 'cs-1',
      slug: 'case-study-regenerative-handloom-corridor',
      type: 'case-studies',
      featured: true,
      title: 'Restoring the Handloom Corridor of Kuthampully',
      excerpt: 'How connecting discerning travellers directly with master weavers eliminated middlemen and increased artisan studio revenue by 65%.',
      categoryLabel: 'COMMUNITY IMPACT CASE STUDY',
      categories: ['culture', 'offbeat', 'bespoke'],
      readTime: '6 MIN READ',
      publishDate: '2026-05-10',
      tags: ['#kerala', '#culture', '#sustainable'],
      topics: ['#kerala', '#culture', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Master weaver inspecting gold kasavu threads'
    },
    blocks: createDefaultBlocks('Restoring the Handloom Corridor of Kuthampully', 'How connecting discerning travellers directly with master weavers eliminated middlemen and increased artisan studio revenue by 65%.')
  },
  {
    meta: {
      id: 'cs-2',
      slug: 'case-study-private-heritage-trail-for-scholars',
      type: 'case-studies',
      featured: true,
      title: 'Designing a 14-Day Chola Architecture Immersion',
      excerpt: 'A bespoke scholarly route crafted for a London architectural foundation with private temple epigraphy access.',
      categoryLabel: 'BESPOKE DESIGN CASE STUDY',
      categories: ['culture', 'bespoke', 'stays'],
      readTime: '7 MIN READ',
      publishDate: '2026-04-28',
      tags: ['#culture', '#roadtrips', '#sustainable'],
      topics: ['#culture', '#roadtrips', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Carved stone pillars of a Chola temple sanctuary'
    },
    blocks: createDefaultBlocks('Designing a 14-Day Chola Architecture Immersion', 'A bespoke scholarly route crafted for a London architectural foundation with private temple epigraphy access.')
  },
  {
    meta: {
      id: 'cs-3',
      slug: 'case-study-zero-plastic-backwater-expeditions',
      type: 'case-studies',
      featured: false,
      title: 'Transitioning 18 Country Boats to Zero-Plastic Cruises',
      excerpt: 'Collaborating with Vembanad boatmen and village panchayats to establish refill stations and solar-assisted propulsion.',
      categoryLabel: 'ECOLOGICAL CASE STUDY',
      categories: ['nature', 'wellness', 'offbeat'],
      readTime: '5 MIN READ',
      publishDate: '2026-04-15',
      tags: ['#kerala', '#sustainable', '#islands'],
      topics: ['#kerala', '#sustainable', '#islands', '#wellness'],
      image: FALLBACK_IMG,
      alt: 'Clean backwater channels and traditional wooden boats'
    },
    blocks: createDefaultBlocks('Transitioning 18 Country Boats to Zero-Plastic Cruises', 'Collaborating with Vembanad boatmen and village panchayats to establish refill stations and solar-assisted propulsion.')
  },
  {
    meta: {
      id: 'cs-4',
      slug: 'case-study-multigenerational-culinary-homecoming',
      type: 'case-studies',
      featured: false,
      title: 'A Three-Generation Family Culinary Journey in Malabar',
      excerpt: 'Crafting an unhurried, accessible 10-day route across heritage homesteads and spice estates for guests aged 8 to 78.',
      categoryLabel: 'GUEST JOURNEY CASE STUDY',
      categories: ['stays', 'culture', 'bespoke'],
      readTime: '6 MIN READ',
      publishDate: '2026-04-02',
      tags: ['#food', '#kerala', '#culture'],
      topics: ['#kerala', '#food', '#culture'],
      image: FALLBACK_IMG,
      alt: 'Traditional courtyard dining in a Malabar heritage home'
    },
    blocks: createDefaultBlocks('A Three-Generation Family Culinary Journey in Malabar', 'Crafting an unhurried, accessible 10-day route across heritage homesteads and spice estates for guests aged 8 to 78.')
  },
  {
    meta: {
      id: 'cs-5',
      slug: 'case-study-himalayan-snow-leopard-stewardship',
      type: 'case-studies',
      featured: false,
      title: 'Community-Led Wildlife Tracking in High Ladakh',
      excerpt: 'Partnering with former pastoralists turned conservation trackers to fund village solar heating through low-volume expeditions.',
      categoryLabel: 'CONSERVATION CASE STUDY',
      categories: ['nature', 'offbeat'],
      readTime: '8 MIN READ',
      publishDate: '2026-03-19',
      tags: ['#himalayas', '#wildlife', '#sustainable'],
      topics: ['#himalayas', '#wildlife', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'High-altitude Himalayan ridge at sunrise'
    },
    blocks: createDefaultBlocks('Community-Led Wildlife Tracking in High Ladakh', 'Partnering with former pastoralists turned conservation trackers to fund village heating through low-volume expeditions.')
  },
  {
    meta: {
      id: 'cs-6',
      slug: 'case-study-adaptive-reuse-of-vernacular-mansions',
      type: 'case-studies',
      featured: false,
      title: 'Advising on the Restoration of a 19th-Century Tharavadu',
      excerpt: 'Transforming an ancestral Kerala estate into an intimate 6-suite heritage retreat without altering its timber joinery.',
      categoryLabel: 'HERITAGE ADVISORY CASE STUDY',
      categories: ['stays', 'culture', 'bespoke'],
      readTime: '7 MIN READ',
      publishDate: '2026-03-05',
      tags: ['#kerala', '#culture', '#sustainable'],
      topics: ['#kerala', '#culture', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Restored timber courtyard of a historic Kerala Tharavadu'
    },
    blocks: createDefaultBlocks('Advising on the Restoration of a 19th-Century Tharavadu', 'Transforming an ancestral Kerala estate into an intimate 6-suite heritage retreat without altering its timber joinery.')
  },
  {
    meta: {
      id: 'cs-7',
      slug: 'case-study-ayurvedic-sabbatical-by-the-nila',
      type: 'case-studies',
      featured: false,
      title: 'A 21-Day Restorative Sabbatical Along the Nila River',
      excerpt: 'Integrating classical Panchakarma therapies with gentle evening recitals of temple percussion and shadow puppetry.',
      categoryLabel: 'WELLNESS CASE STUDY',
      categories: ['wellness', 'stays', 'culture'],
      readTime: '5 MIN READ',
      publishDate: '2026-02-22',
      tags: ['#wellness', '#kerala', '#culture'],
      topics: ['#kerala', '#wellness', '#culture'],
      image: FALLBACK_IMG,
      alt: 'Peaceful riverfront veranda along the Bharathapuzha'
    },
    blocks: createDefaultBlocks('A 21-Day Restorative Sabbatical Along the Nila River', 'Integrating classical Panchakarma therapies with gentle evening recitals of temple percussion and shadow puppetry.')
  },
  {
    meta: {
      id: 'cs-8',
      slug: 'case-study-women-led-spice-collectives-idukki',
      type: 'case-studies',
      featured: false,
      title: 'Building Farm-to-Table Trails with Idukki Women’s Collectives',
      excerpt: 'Co-designing highland spice walks and heirloom cooking sessions that channel 100% of host fees to women farmers.',
      categoryLabel: 'LIVELIHOOD CASE STUDY',
      categories: ['food' as unknown as JournalCategoryId, 'nature', 'culture'].filter((c): c is JournalCategoryId => ['nature', 'culture', 'stays', 'offbeat', 'wellness', 'bespoke'].includes(c)),
      readTime: '6 MIN READ',
      publishDate: '2026-02-11',
      tags: ['#food', '#kerala', '#sustainable'],
      topics: ['#kerala', '#food', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Organic pepper and cardamom harvest in the Western Ghats'
    },
    blocks: createDefaultBlocks('Building Farm-to-Table Trails with Idukki Women’s Collectives', 'Co-designing highland spice walks and heirloom cooking sessions that channel 100% of host fees to women farmers.')
  },
  {
    meta: {
      id: 'cs-9',
      slug: 'case-study-accessible-sensory-trails-south-india',
      type: 'case-studies',
      featured: false,
      title: 'Pioneering Accessible Sensory Journeys Across South India',
      excerpt: 'Auditing step-free heritage stays, tactile craft workshops, and acoustic nature walks for inclusive travel.',
      categoryLabel: 'INCLUSIVE TRAVEL CASE STUDY',
      categories: ['stays', 'wellness', 'bespoke'],
      readTime: '6 MIN READ',
      publishDate: '2026-01-30',
      tags: ['#kerala', '#wellness', '#sustainable'],
      topics: ['#kerala', '#wellness', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Accessible garden pathway in a boutique heritage retreat'
    },
    blocks: createDefaultBlocks('Pioneering Accessible Sensory Journeys Across South India', 'Auditing step-free heritage stays, tactile craft workshops, and acoustic nature walks for inclusive travel.')
  },
  {
    meta: {
      id: 'cs-10',
      slug: 'case-study-kutch-indigo-and-pastoral-guilds',
      type: 'case-studies',
      featured: false,
      title: 'Documenting Natural Indigo Dyeing with Kutch Master Guilds',
      excerpt: 'A slow winter residency created for international textile collectors and sustainable fashion researchers.',
      categoryLabel: 'CRAFT RESIDENCY CASE STUDY',
      categories: ['culture', 'offbeat', 'bespoke'],
      readTime: '7 MIN READ',
      publishDate: '2026-01-20',
      tags: ['#culture', '#sustainable', '#roadtrips'],
      topics: ['#culture', '#sustainable', '#roadtrips'],
      image: FALLBACK_IMG,
      alt: 'Indigo-dyed textiles drying in the sun'
    },
    blocks: createDefaultBlocks('Documenting Natural Indigo Dyeing with Kutch Master Guilds', 'A slow winter residency created for international textile collectors and sustainable fashion researchers.')
  },
  {
    meta: {
      id: 'cs-11',
      slug: 'case-study-coastal-mangrove-rewilding-kokkamangalam',
      type: 'case-studies',
      featured: false,
      title: 'Rewilding Estuarine Mangroves Through Guest Stewardship',
      excerpt: 'Over 4,500 native mangrove saplings planted along fragile backwater banks funded directly through guest journeys.',
      categoryLabel: 'HABITAT RESTORATION CASE STUDY',
      categories: ['nature', 'beaches' as unknown as JournalCategoryId, 'offbeat'].filter((c): c is JournalCategoryId => ['nature', 'culture', 'stays', 'offbeat', 'wellness', 'bespoke'].includes(c)),
      readTime: '5 MIN READ',
      publishDate: '2026-01-11',
      tags: ['#beaches', '#wildlife', '#sustainable'],
      topics: ['#beaches', '#wildlife', '#sustainable', '#islands'],
      image: FALLBACK_IMG,
      alt: 'Thriving coastal mangrove roots along calm waters'
    },
    blocks: createDefaultBlocks('Rewilding Estuarine Mangroves Through Guest Stewardship', 'Over 4,500 native mangrove saplings planted along fragile backwater banks funded directly through guest journeys.')
  },
  {
    meta: {
      id: 'cs-12',
      slug: 'case-study-leadership-retreat-in-the-nilgiris',
      type: 'case-studies',
      featured: false,
      title: 'Curating a Mindful Leadership Offsite in the Nilgiri Biosphere',
      excerpt: 'Replacing boardrooms with forest walks, indigenous ecological dialogues, and restored tea bungalow gatherings.',
      categoryLabel: 'CORPORATE RETREAT CASE STUDY',
      categories: ['nature', 'stays', 'bespoke'],
      readTime: '6 MIN READ',
      publishDate: '2026-01-04',
      tags: ['#wildlife', '#wellness', '#sustainable'],
      topics: ['#wildlife', '#wellness', '#sustainable'],
      image: FALLBACK_IMG,
      alt: 'Sunlit veranda of a Nilgiri tea estate bungalow'
    },
    blocks: createDefaultBlocks('Curating a Mindful Leadership Offsite in the Nilgiri Biosphere', 'Replacing boardrooms with forest walks, indigenous ecological dialogues, and restored tea bungalow gatherings.')
  }
]
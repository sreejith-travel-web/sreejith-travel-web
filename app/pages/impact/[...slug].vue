<!-- ~/app/pages/impact/[...slug].vue -->
<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onActivated,
  onDeactivated,
  nextTick
} from 'vue'
import { useRoute, createError, useSeoMeta } from '#imports'
import PageHero from '~/components/PageHero.vue'
import InnerPageHeader from '~/components/InnerPageHeader.vue'
import ImpactInner, { type ImpactTabItem } from '~/components/ImpactInner.vue'
import RelatedStories from '~/components/RelatedStories.vue'
import { useSessionScroll } from '~/composables/useSessionScroll'

const route = useRoute()
const {
  hasSavedScrollPosition,
  setActiveRouteAlias,
  saveImpactArchiveState,
  getImpactArchiveState
} = useSessionScroll()

const impactItems: ImpactTabItem[] = [
  {
    id: 'slow-travel',
    tabTitle: 'Slow Travel',
    content: {
      title: 'Slow travel, lasting impact.',
      intro:
        'We craft our journeys on predominantly beautiful landscapes which are surprisingly invisible on the current day tourism map. We focus on building a strategic infusion of tourism in these areas which brings economic opportunity while preserving the natural environment and culture.',
      mainImg: '/images/impact/impact1.webp',
      mainImgAlt: 'Slow travel conversation in a rural courtyard',
      quote: 'When we take time to listen, a place becomes more than a destination.',
      pillars: [
        {
          title: 'Villages That Form Civilizations',
          img: '/images/home/journey-pc.webp',
          alt: 'Quiet rural village along the backwaters',
          list: [
            'Villages were always considered the cradle of any civilization, shaped by the pursuit of fertile lands and living waters.',
            'They have hosted a plethora of diverse cultures where even great nations trace their deepest legacies to rural traditions.',
            'Through millennia of human activity, oral histories and intricate storytelling traditions evolved naturally within these hamlets.',
            'We invite our guests to experience these lesser-known villages ecologically, unhurriedly, and with genuine reverence.'
          ]
        },
        {
          title: 'Communities of the Land',
          img: '/images/journal/journal1.webp',
          alt: 'Master weaver and grassroots community custodians in South India',
          list: [
            'Most communities we work with are either indigenous to the landscape or migrated generations ago with cultural purpose.',
            'We collaborate with over 200 grassroots communities, building enduring bonds through years of field research and listening.',
            'Together we co-create local experiences that honor their daily rhythms while opening respectful gateways for visitors.',
            'Our travellers cherish the rare opportunity for an unhurried cultural exchange rooted in mutual dignity.'
          ]
        },
        {
          title: 'Stories That Sparked Life',
          img: '/images/impact/impact2.webp',
          alt: 'Traditional waterways and lived folklore at dusk',
          list: [
            'We draw our inspiration from the people, places, and lived folklore that make each region of South India distinct.',
            'By weaving local scholarship with intimate knowledge of the land, we design circuits that cannot be replicated commercially.',
            'Every journey supports grassroots cultural preservation, keeping endangered art forms relevant for younger generations.',
            'These shared encounters transform both the traveller and the host community, creating memories that endure.'
          ]
        }
      ]
    }
  },
  {
    id: 'authentic-connection',
    tabTitle: 'Authentic Connection',
    content: {
      title: 'Authentic over curated.',
      intro:
        'Stripping away the artificial to reveal the raw, unpolished, and breathtaking reality of living cultures. We bypass staged commercial spectacles to introduce you directly to the true guardians of the land.',
      mainImg: '/images/impact/impact2.webp',
      mainImgAlt: 'Authentic cultural immersion with local elders',
      quote:
        'To travel authentically is to accept a destination exactly as it is, honoring its quiet truths.',
      pillars: [
        {
          title: 'Unscripted Encounters',
          img: '/images/journal/journal2.webp',
          alt: 'Spontaneous conversation in a heritage village',
          list: [
            'We intentionally leave breathing room in every itinerary for serendipity and spontaneous neighbourhood conversations.',
            'We prioritize family-stewarded heritage homes and estates over standardized, impersonal chain hospitality.',
            'Guests meet master artisans inside their working ateliers rather than tourist-facing commercial showrooms.'
          ]
        },
        {
          title: 'Culinary Heritage',
          img: '/images/home/journey-pc1.webp',
          alt: 'Home-cooked regional meal prepared with seasonal spices',
          list: [
            'Dining is treated as an intimate act of cultural immersion, sharing meals prepared by local home cooks and matriarchs.',
            'Ingredients are sourced directly from regional spice gardens, coastal catches, and seasonal village harvests.',
            'Each table becomes a living archive that documents and celebrates fading ancestral recipes.'
          ]
        },
        {
          title: 'The Art of Listening',
          img: '/images/impact/impact3.webp',
          alt: 'Scholar guide sharing regional history on a quiet trail',
          list: [
            'Our storytellers and naturalists are trained as cultural interpreters rather than scripted sightseeing narrators.',
            'We foster unhurried dialogue where travellers and local hosts exchange perspectives on equal footing.',
            'Sacred groves, temples, and community spaces are approached with the quiet mindfulness they deserve.'
          ]
        }
      ]
    }
  },
  {
    id: 'local-first',
    tabTitle: 'Local First',
    content: {
      title: 'Local first, always.',
      intro:
        'Directly empowering regional artisans, independent naturalists, and family-owned stays so that tourism wealth circulates within the communities who steward the destination.',
      mainImg: '/images/impact/impact3.webp',
      mainImgAlt: 'Local artisans and community hosts in Kerala',
      quote:
        'True luxury lies in the warmth of a community that thrives directly through your presence.',
      pillars: [
        {
          title: 'Economic Empowerment',
          img: '/images/journal/journal4.webp',
          alt: 'Local village studios and micro-entrepreneurs',
          list: [
            'Over 80% of every journey’s operational spend remains directly within regional family businesses and local cooperatives.',
            'We partner with rural micro-entrepreneurs, boatmen, and homesteads to build resilient year-round livelihoods.',
            'By avoiding multi-layered middlemen, we ensure fair, transparent compensation reaches the people on the ground.'
          ]
        },
        {
          title: 'Skill & Craft Revival',
          img: '/images/journal/journal5.webp',
          alt: 'Master craftsperson working on traditional handloom',
          list: [
            'We co-fund mentorship programs that train local youth as certified naturalists and heritage storytellers.',
            'Custom traveller workshops provide sustained income for weavers, potters, and traditional bronze casters.',
            'Preserving vernacular craft becomes economically viable when discerning travellers value provenance over mass production.'
          ]
        },
        {
          title: 'Direct Artisan Trade',
          img: '/images/impact/impact4.webp',
          alt: 'Handcrafted textiles and natural fibers',
          list: [
            'Every craft visit connects guests straight to the maker, ensuring 100% of any purchase stays with the studio.',
            'We champion women-led self-help groups producing organic spices, heirloom textiles, and natural wellness goods.',
            'Long-term partnerships allow workshops to plan sustainably without compromising their traditional techniques.'
          ]
        }
      ]
    }
  },
  {
    id: 'protecting-beauty',
    tabTitle: 'Protecting Beauty',
    content: {
      title: 'Protecting natural beauty.',
      intro:
        'From the shola cloud forests of the Western Ghats to fragile coastal estuaries, we implement low-impact practices that safeguard biodiversity and keep wild landscapes pristine.',
      mainImg: '/images/impact/impact4.webp',
      mainImgAlt: 'Pristine forest canopy in the Western Ghats',
      quote:
        'We are merely guests in the wild; our greatest achievement is leaving only reverence behind.',
      pillars: [
        {
          title: 'Zero Single-Use Plastics',
          img: '/images/home/solo-landscape.webp',
          alt: 'Clean waterways and plastic-free travel setup',
          list: [
            'All our vehicles and guided walks operate completely free of single-use plastic bottles and disposable packaging.',
            'Guests receive refillable metal flasks paired with purified hydration stations across every route and stay.',
            'We collaborate with rural panchayats to support clean-trail initiatives in sensitive mountain and backwater corridors.'
          ]
        },
        {
          title: 'Ethical Wildlife Encounters',
          img: '/images/home/forest-landscape.webp',
          alt: 'Quiet wildlife observation in a natural sanctuary',
          list: [
            'We strictly reject captive animal attractions in favor of quiet, naturalist-led observation in protected habitats.',
            'Small group sizes and off-peak entry windows minimize acoustic and physical disturbance in forest reserves.',
            'Our itineraries follow conservation biologists’ guidelines to respect seasonal breeding and migration corridors.'
          ]
        },
        {
          title: 'Habitat Regeneration',
          img: '/images/impact/impact5.webp',
          alt: 'Native saplings and reforested hillside',
          list: [
            'Every custom itinerary contributes toward planting and nurturing native endemic saplings in degraded buffer zones.',
            'We champion eco-lodges that actively rewild former plantation land back into thriving biodiversity corridors.',
            'Travellers can participate in citizen-science birding and flora documentation alongside resident ecologists.'
          ]
        }
      ]
    }
  },
  {
    id: 'conscious-choices',
    tabTitle: 'Conscious Choices',
    content: {
      title: 'Conscious choices, lighter footprint.',
      intro:
        'Every logistical decision—from route pacing and fewer hotel changes to solar-powered retreats—is thoughtfully weighed to reduce our environmental footprint while deepening your comfort.',
      mainImg: '/images/impact/impact5.webp',
      mainImgAlt: 'Sunlight filtering through an eco-sensitive heritage stay',
      quote:
        'Conscious travel is never a restriction; it is a quiet elevation of how we experience the world.',
      pillars: [
        {
          title: 'Paced Low-Carbon Routing',
          img: '/images/home/journey-pc.webp',
          alt: 'Scenic slow route through green hills and waterways',
          list: [
            'Designing longer stays in fewer bases drastically cuts unnecessary road transit and vehicular emissions.',
            'Wherever scenic and practical, we integrate regional rail journeys, walking trails, and non-motorized country boats.',
            'Thoughtful geographic sequencing ensures you spend more hours immersed in place and fewer hours on highways.'
          ]
        },
        {
          title: 'Earth-Sensitive Architecture',
          img: '/images/journal/journal3.webp',
          alt: 'Vernacular mud and timber architecture',
          list: [
            'We curate boutique stays built with vernacular lime, laterite, and reclaimed timber that cool naturally without heavy energy loads.',
            'Our partner properties prioritize solar thermal heating, rainwater harvesting, and chemical-free greywater recycling.',
            'Restoring historic mansions prevents demolition waste while keeping regional architectural wisdom alive.'
          ]
        },
        {
          title: 'Mindful Resource Stewardship',
          img: '/images/impact/impact6.webp',
          alt: 'Organic farm-to-table harvest garden',
          list: [
            'Partner kitchens compost organic waste and grow heirloom vegetables within metres of the dining room.',
            'Botanical bath amenities are biodegradable and crafted locally to protect delicate village water tables.',
            'We audit our supply chain annually to ensure our operational partners uphold verifiable sustainability benchmarks.'
          ]
        }
      ]
    }
  },
  {
    id: 'giving-back',
    tabTitle: 'Giving Back',
    content: {
      title: 'Giving back, where we go.',
      intro:
        'A dedicated share of every journey directly funds grassroots conservation, rural education, and heritage restoration initiatives across the regions that welcome our travellers.',
      mainImg: '/images/impact/impact6.webp',
      mainImgAlt: 'Community-led heritage and conservation initiative',
      quote:
        'True impact is measured not by the miles we cover, but by the resilience we leave behind.',
      pillars: [
        {
          title: 'Rural Education & Libraries',
          img: '/images/impact/impact1.webp',
          alt: 'Village school and community learning initiative',
          list: [
            'Journey proceeds help stock bilingual nature libraries and art supplies in remote forest-fringe village schools.',
            'We sponsor environmental field days that connect local schoolchildren with conservationists in their own backyard.',
            'Scholarship fellowships support young artisans apprenticing under master craftspeople in endangered disciplines.'
          ]
        },
        {
          title: 'Community Wellbeing',
          img: '/images/home/travel-video.webp',
          alt: 'Preventive healthcare and women cooperative support',
          list: [
            'We partner with regional trusts to organize preventive healthcare and vision camps in isolated highland settlements.',
            'Clean drinking water filtration units are co-funded for host villages along our signature walking routes.',
            'Emergency livelihood funds provide stability for guide and artisan families during off-season monsoon months.'
          ]
        },
        {
          title: 'Living Heritage Conservation',
          img: '/images/fallbacks/culture.webp',
          alt: 'Sacred temple mural and heritage restoration',
          list: [
            'Contributions support the documentation and conservation of sacred groves, stepwells, and village shrines.',
            'We patronize traditional performing arts troupes during off-peak seasons so sacred rituals remain community-centered.',
            'Every guest receives transparent reporting on the grassroots project their journey helped sustain.'
          ]
        }
      ]
    }
  }
]

const VALID_IMPACT_SLUGS = new Set(impactItems.map((item) => item.id))

const slugParts = computed<string[]>(() => {
  const raw = route.params.slug
  if (Array.isArray(raw)) return raw.filter(Boolean)
  if (typeof raw === 'string' && raw.length > 0) return [raw]
  return []
})

const slug0 = computed<string | null>(() => slugParts.value[0]?.toLowerCase() || null)

// Validate slug strictly on both SSR and client transitions
if (
  slugParts.value.length > 1 ||
  (slug0.value !== null && !VALID_IMPACT_SLUGS.has(slug0.value))
) {
  throw createError({
    statusCode: 404,
    statusMessage: `Impact Pillar "${slugParts.value.join('/')}" Not Found`,
    fatal: true
  })
}

const activeTab = ref<string>('slow-travel')
const shouldScrollToPillarsOnMount = ref(false)
const isPageActive = ref(true)

const persistImpactSession = (aliasUrl: string) => {
  setActiveRouteAlias(aliasUrl)
  saveImpactArchiveState({
    activeTab: activeTab.value,
    aliasPath: aliasUrl
  })
}

const syncBrowserUrl = () => {
  if (!import.meta.client) return
  const targetUrl = `/impact/${activeTab.value}`
  window.history.replaceState({ ...window.history.state }, '', targetUrl)
  persistImpactSession(targetUrl)
}

const syncTabFromRoute = () => {
  if (!slug0.value) {
    const savedState = getImpactArchiveState()
    if (savedState && VALID_IMPACT_SLUGS.has(savedState.activeTab)) {
      activeTab.value = savedState.activeTab
      shouldScrollToPillarsOnMount.value = false
      if (import.meta.client) {
        window.history.replaceState(
          { ...window.history.state },
          '',
          savedState.aliasPath
        )
        setActiveRouteAlias(savedState.aliasPath)
      }
      return
    }

    activeTab.value = 'slow-travel'
    shouldScrollToPillarsOnMount.value = false
    persistImpactSession('/impact')
    return
  }

  if (VALID_IMPACT_SLUGS.has(slug0.value)) {
    shouldScrollToPillarsOnMount.value = !hasSavedScrollPosition(route.path)
    activeTab.value = slug0.value
    persistImpactSession(`/impact/${slug0.value}`)
  }
}

syncTabFromRoute()

const currentTabMeta = computed(
  () => impactItems.find((i) => i.id === activeTab.value) || impactItems[0]!
)

useSeoMeta({
  title: () =>
    slug0.value
      ? `${currentTabMeta.value.tabTitle} — Regenerative Impact`
      : 'Regenerative Tourism & Community Impact',
  description: () => currentTabMeta.value.content.intro,
  ogType: 'website',
  ogTitle: () => `${currentTabMeta.value.tabTitle} | Regenerative Impact`,
  ogDescription: () => currentTabMeta.value.content.intro,
  ogImage: '/images/og/impact.jpg'
})

const pageData = {
  hero: {
    eyebrow: 'Regenerative Tourism',
    titleMain: 'Leaving Places Richer',
    titleItalic: 'For Generations Ahead',
    intro:
      'Every journey directly sustains local artisans, preserves fragile ecosystems, and honors community-led conservation.',
    imageDesktop: '/images/home/forest-landscape.webp',
    imageMobile: '/images/home/forest-portrait.webp',
    alt: 'Regenerative travel and positive community impact'
  },
  intro: {
    subtitle: 'Making a difference, together.',
    paragraph:
      'As a responsible travel company, we believe in the coexistence of our natural environment, its indigenous communities, and their diverse cultures. We travel slowly, ensuring every footprint leaves a positive mark.'
  },
  relatedStories: {
    eyebrow: 'RELATED STORIES',
    titleLine1: 'Related',
    titleLine2Cursive: 'Stories.',
    posts: [
      {
        id: 'rel-1',
        slug: '/journal/the-stories-that-live-beyond-the-map',
        title: 'The Stories That Live Beyond the Map',
        excerpt:
          'A closer look at the people, places and traditions that shape a destination into something more meaningful.',
        category: 'INSIGHT · LIVING HERITAGE',
        readTime: '8 MIN READ',
        tags: ['#CULTURE', '#HERITAGE', '#PEOPLE'],
        image: '/images/journal/journal1.webp',
        alt: 'Master weaver working on a traditional handloom in Kerala'
      },
      {
        id: 'rel-2',
        slug: '/journal/regenerative-handloom-corridor',
        title: 'Restoring the Handloom Corridor of Kuthampully',
        excerpt:
          'How connecting discerning travellers directly with master weavers eliminated middlemen and increased artisan studio revenue by 65%.',
        category: 'ARTICLE · CASE STUDIES',
        readTime: '6 MIN READ',
        tags: ['#ITINERARYDESIGN', '#OUTCOMES', '#HANDLOOMS'],
        image: '/images/journal/journal4.webp',
        alt: 'Traditional kasavu handloom weave in Kuthampully village'
      },
      {
        id: 'rel-3',
        slug: '/journal/five-quiet-thresholds-of-malabar',
        title: 'Five Quiet Thresholds Across Northern Malabar',
        excerpt:
          'Five unhurried dawn encounters across sacred groves, timber shipyards, and highland spice valleys.',
        category: 'VISUAL STORY · FIELD NOTES',
        readTime: '3 MIN STORY',
        tags: ['#FIELDNOTES', '#HERITAGE', '#MALABAR'],
        image: '/images/journal/journal3.webp',
        alt: 'Morning light across northern Kerala waterways and sacred groves'
      }
    ]
  }
}

const handleTabUpdate = (newTabId: string) => {
  if (!VALID_IMPACT_SLUGS.has(newTabId)) return
  activeTab.value = newTabId
  syncBrowserUrl()
}

const scrollToImpactWorkspace = () => {
  if (!import.meta.client || !isPageActive.value) return
  const el = document.getElementById('impact-pillars')
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 84
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }
}

const maybeScrollToWorkspace = () => {
  if (!shouldScrollToPillarsOnMount.value) return
  shouldScrollToPillarsOnMount.value = false
  nextTick(() => {
    setTimeout(scrollToImpactWorkspace, 620)
  })
}

watch(
  () => route.path,
  () => {
    if (!isPageActive.value) return
    if (
      slugParts.value.length > 1 ||
      (slug0.value !== null && !VALID_IMPACT_SLUGS.has(slug0.value))
    ) {
      throw createError({
        statusCode: 404,
        statusMessage: `Impact Pillar "${slugParts.value.join('/')}" Not Found`,
        fatal: true
      })
    }
    syncTabFromRoute()
    maybeScrollToWorkspace()
  }
)

onMounted(() => {
  isPageActive.value = true
  maybeScrollToWorkspace()
})

onActivated(() => {
  isPageActive.value = true
  syncTabFromRoute()
  maybeScrollToWorkspace()
})

onDeactivated(() => {
  isPageActive.value = false
})
</script>

<template>
  <div class="overflow-x-clip bg-bg-light">
    <PageHero :data="pageData.hero" />
    <InnerPageHeader :data="pageData.intro" />
    <ImpactInner
      :items="impactItems"
      :active-tab="activeTab"
      @update:active-tab="handleTabUpdate"
    />
    <RelatedStories :data="pageData.relatedStories" />
  </div>
</template>
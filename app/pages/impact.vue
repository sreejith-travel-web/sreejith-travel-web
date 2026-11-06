<!-- ~/app/pages/impact.vue -->
<script setup lang="ts">
import PageHero from '~/components/PageHero.vue'
import InnerPageHeader, { type InnerPageHeaderConfig } from '~/components/InnerPageHeader.vue'
import ImpactInner, { type ImpactTabItem } from '~/components/ImpactInner.vue'
import RelatedStories, { type RelatedStoriesConfig } from '~/components/RelatedStories.vue'

const pageData = {
  hero: {
    eyebrow: 'Regenerative Tourism',
    titleMain: 'Leaving Places Richer',
    titleItalic: 'For Generations Ahead',
    intro: 'Every journey directly sustains local artisans, preserves fragile ecosystems, and honors community-led conservation.',
    imageDesktop: '/images/fallbacks/culture.webp',
    imageMobile: '/images/fallbacks/culture.webp',
    alt: 'Regenerative travel and positive community impact'
  },
  intro: {
    eyebrow: 'Our Philosophy',
    titleLine1: 'Making a Difference',
    titleLine2Cursive: 'Together.',
    description: 'As a responsible travel company, we believe in the coexistence of our natural environment, its indigenous communities, and their diverse cultures. We travel slowly, ensuring every footprint leaves a positive mark.'
  },
  items: [
    {
      id: 'slow-travel',
      tabTitle: 'Slow Travel',
      content: {
        title: 'Slow travel, lasting impact.',
        intro: 'We craft our journeys on predominantly beautiful landscapes which are surprisingly invisible on the current day tourism map. We focus on building a strategic infusion of tourism in these areas which brings economic opportunity while preserving the natural environment and culture.',
        mainImg: '/images/fallbacks/culture.webp',
        mainImgAlt: 'Slow travel conversation in a rural courtyard',
        quote: 'When we take time to listen, a place becomes more than a destination.',
        pillars: [
          {
            title: 'Villages That Form Civilizations',
            img: '/images/fallbacks/culture.webp',
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
            img: '/images/fallbacks/culture.webp',
            alt: 'Women harvesting tea in the hills of South India',
            list: [
              'Most communities we work with are either indigenous to the landscape or migrated generations ago with cultural purpose.',
              'We collaborate with over 200 grassroots communities, building enduring bonds through years of field research and listening.',
              'Together we co-create local experiences that honor their daily rhythms while opening respectful gateways for visitors.',
              'Our travellers cherish the rare opportunity for an unhurried cultural exchange rooted in mutual dignity.'
            ]
          },
          {
            title: 'Stories That Sparked Life',
            img: '/images/fallbacks/culture.webp',
            alt: 'Traditional houseboat gliding across calm waters at sunset',
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
      id: 'authentic',
      tabTitle: 'Authentic Connection',
      content: {
        title: 'Authentic over curated.',
        intro: 'Stripping away the artificial to reveal the raw, unpolished, and breathtaking reality of living cultures. We bypass staged commercial spectacles to introduce you directly to the true guardians of the land.',
        mainImg: '/images/fallbacks/culture.webp',
        mainImgAlt: 'Authentic cultural immersion with local elders',
        quote: 'To travel authentically is to accept a destination exactly as it is, honoring its quiet truths.',
        pillars: [
          {
            title: 'Unscripted Encounters',
            img: '/images/fallbacks/culture.webp',
            alt: 'Spontaneous conversation in a heritage village',
            list: [
              'We intentionally leave breathing room in every itinerary for serendipity and spontaneous neighbourhood conversations.',
              'We prioritize family-stewarded heritage homes and estates over standardized, impersonal chain hospitality.',
              'Guests meet master artisans inside their working ateliers rather than tourist-facing commercial showrooms.'
            ]
          },
          {
            title: 'Culinary Heritage',
            img: '/images/fallbacks/culture.webp',
            alt: 'Home-cooked regional meal prepared with seasonal spices',
            list: [
              'Dining is treated as an intimate act of cultural immersion, sharing meals prepared by local home cooks and matriarchs.',
              'Ingredients are sourced directly from regional spice gardens, coastal catches, and seasonal village harvests.',
              'Each table becomes a living archive that documents and celebrates fading ancestral recipes.'
            ]
          },
          {
            title: 'The Art of Listening',
            img: '/images/fallbacks/culture.webp',
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
        intro: 'Directly empowering regional artisans, independent naturalists, and family-owned stays so that tourism wealth circulates within the communities who steward the destination.',
        mainImg: '/images/fallbacks/culture.webp',
        mainImgAlt: 'Local artisans and community hosts in Kerala',
        quote: 'True luxury lies in the warmth of a community that thrives directly through your presence.',
        pillars: [
          {
            title: 'Economic Empowerment',
            img: '/images/fallbacks/culture.webp',
            alt: 'Local village market and micro-entrepreneurs',
            list: [
              'Over 80% of every journey’s operational spend remains directly within regional family businesses and local cooperatives.',
              'We partner with rural micro-entrepreneurs, boatmen, and homesteads to build resilient year-round livelihoods.',
              'By avoiding multi-layered middlemen, we ensure fair, transparent compensation reaches the people on the ground.'
            ]
          },
          {
            title: 'Skill & Craft Revival',
            img: '/images/fallbacks/culture.webp',
            alt: 'Master craftsperson working on traditional handloom',
            list: [
              'We co-fund mentorship programs that train local youth as certified naturalists and heritage storytellers.',
              'Custom traveller workshops provide sustained income for weavers, potters, and traditional bronze casters.',
              'Preserving vernacular craft becomes economically viable when discerning travellers value provenance over mass production.'
            ]
          },
          {
            title: 'Direct Artisan Trade',
            img: '/images/fallbacks/culture.webp',
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
        intro: 'From the shola cloud forests of the Western Ghats to fragile coastal estuaries, we implement low-impact practices that safeguard biodiversity and keep wild landscapes pristine.',
        mainImg: '/images/fallbacks/culture.webp',
        mainImgAlt: 'Pristine forest canopy in the Western Ghats',
        quote: 'We are merely guests in the wild; our greatest achievement is leaving only reverence behind.',
        pillars: [
          {
            title: 'Zero Single-Use Plastics',
            img: '/images/fallbacks/culture.webp',
            alt: 'Clean waterways and plastic-free travel setup',
            list: [
              'All our vehicles and guided walks operate completely free of single-use plastic bottles and disposable packaging.',
              'Guests receive refillable metal flasks paired with purified hydration stations across every route and stay.',
              'We collaborate with rural panchayats to support clean-trail initiatives in sensitive mountain and backwater corridors.'
            ]
          },
          {
            title: 'Ethical Wildlife Encounters',
            img: '/images/fallbacks/culture.webp',
            alt: 'Quiet wildlife observation in a natural sanctuary',
            list: [
              'We strictly reject captive animal attractions in favor of quiet, naturalist-led observation in protected habitats.',
              'Small group sizes and off-peak entry windows minimize acoustic and physical disturbance in forest reserves.',
              'Our itineraries follow conservation biologists’ guidelines to respect seasonal breeding and migration corridors.'
            ]
          },
          {
            title: 'Habitat Regeneration',
            img: '/images/fallbacks/culture.webp',
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
        intro: 'Every logistical decision—from route pacing and fewer hotel changes to solar-powered retreats—is thoughtfully weighed to reduce our environmental footprint while deepening your comfort.',
        mainImg: '/images/fallbacks/culture.webp',
        mainImgAlt: 'Sunlight filtering through an eco-sensitive heritage stay',
        quote: 'Conscious travel is never a restriction; it is a quiet elevation of how we experience the world.',
        pillars: [
          {
            title: 'Paced Low-Carbon Routing',
            img: '/images/fallbacks/culture.webp',
            alt: 'Scenic rail and slow road route through green hills',
            list: [
              'Designing longer stays in fewer bases drastically cuts unnecessary road transit and vehicular emissions.',
              'Wherever scenic and practical, we integrate regional rail journeys, walking trails, and non-motorized country boats.',
              'Thoughtful geographic sequencing ensures you spend more hours immersed in place and fewer hours on highways.'
            ]
          },
          {
            title: 'Earth-Sensitive Architecture',
            img: '/images/fallbacks/culture.webp',
            alt: 'Vernacular mud and timber architecture',
            list: [
              'We curate boutique stays built with vernacular lime, laterite, and reclaimed timber that cool naturally without heavy energy loads.',
              'Our partner properties prioritize solar thermal heating, rainwater harvesting, and chemical-free greywater recycling.',
              'Restoring historic mansions prevents demolition waste while keeping regional architectural wisdom alive.'
            ]
          },
          {
            title: 'Mindful Resource Stewardship',
            img: '/images/fallbacks/culture.webp',
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
        intro: 'A dedicated share of every journey directly funds grassroots conservation, rural education, and heritage restoration initiatives across the regions that welcome our travellers.',
        mainImg: '/images/fallbacks/culture.webp',
        mainImgAlt: 'Community-led heritage and conservation initiative',
        quote: 'True impact is measured not by the miles we cover, but by the resilience we leave behind.',
        pillars: [
          {
            title: 'Rural Education & Libraries',
            img: '/images/fallbacks/culture.webp',
            alt: 'Village school and community learning initiative',
            list: [
              'Journey proceeds help stock bilingual nature libraries and art supplies in remote forest-fringe village schools.',
              'We sponsor environmental field days that connect local schoolchildren with conservationists in their own backyard.',
              'Scholarship fellowships support young artisans apprenticing under master craftspeople in endangered disciplines.'
            ]
          },
          {
            title: 'Community Wellbeing',
            img: '/images/fallbacks/culture.webp',
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
  ],
  relatedStories: {
    eyebrow: 'RELATED STORIES',
    titleLine1: 'Related',
    titleLine2Cursive: 'Stories.',
    posts: [
      {
        id: 'rel-1',
        slug: '/journal',
        title: 'The Great Migration of Kaziranga',
        excerpt: 'Witnessing the incredible conservation success story of the one-horned rhinoceros in the floodplains of Assam.',
        category: 'MAY 05, 2026',
        readTime: '6 MIN READ',
        tags: ['#CONSERVATION', '#WILDLIFE', '#NATURE'],
        image: '/images/fallbacks/culture.webp',
        alt: 'Lush green floodplains and hills at dawn'
      },
      {
        id: 'rel-2',
        slug: '/journal',
        title: 'Turtles of the Coromandel Coast',
        excerpt: 'Participating in midnight conservation walks to protect the nesting sites of the endangered Olive Ridley turtles.',
        category: 'APRIL 08, 2026',
        readTime: '5 MIN READ',
        tags: ['#MARINELIFE', '#NATURE', '#ADVENTURE'],
        image: '/images/fallbacks/culture.webp',
        alt: 'Coastal heritage home surrounded by palms'
      },
      {
        id: 'rel-3',
        slug: '/journal',
        title: 'Bespoke Flavors of Chettinad',
        excerpt: 'Tasting the fiery, complex, and deeply traditional cuisine housed within the grand mansions of Tamil Nadu.',
        category: 'MARCH 01, 2026',
        readTime: '7 MIN READ',
        tags: ['#HERITAGE', '#CULINARY', '#CULTURE'],
        image: '/images/fallbacks/culture.webp',
        alt: 'Wooden boat silhouetted against golden sunset waters'
      }
    ]
  }
}
</script>

<template>
  <div class="overflow-x-clip">
    <PageHero :data="pageData.hero" />
    <InnerPageHeader :data="pageData.intro" />
    <ImpactInner :items="pageData.items" />
    <RelatedStories :data="pageData.relatedStories" />
  </div>
</template>
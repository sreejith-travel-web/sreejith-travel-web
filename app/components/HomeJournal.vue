<script setup lang="ts">
export interface JournalPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  image: string
  alt: string
  featured?: boolean
}

export interface HomeJournalConfig {
  eyebrow: string
  titleLine1: string
  titleLine2Cursive: string
  description: string
  posts: JournalPost[]
  bottomQuote: string
  bottomCta: {
    label: string
    to: string
  }
}

defineProps<{
  data: HomeJournalConfig
}>()
</script>

<template>
  <section
    data-theme="light"
    class="bg-surface-light text-primary-light overflow-hidden section-wrapper"
  >
    <div class="relative z-10 w-full max-w-360 flex flex-col items-center">
      
      <!-- 1. HEADER (Bluish theme overrides) -->
      <div class="relative w-full max-w-4xl flex flex-col items-center text-center mb-8 md:mb-12 px-4">
        <div v-motion-fade-up class="eyebrow-wrapper">
          <div class="bg-dark-gold/70 eyebrow-border" />
          <h2 class="text-journey-deep eyebrow-text">
            {{ data.eyebrow }}
          </h2>
          <div class="bg-dark-gold/70 eyebrow-border" />
        </div>

        <h2
          v-motion-fade-up
          :delay="100"
          class="section-title-wrapper"
        >
          <span class="text-journey-deep section-title-sans">
            {{ data.titleLine1 }}
          </span>
          <span class="text-dark-gold section-title-cursive">
            {{ data.titleLine2Cursive }}
          </span>
        </h2>

        <p
          v-motion-fade-up
          :delay="200"
          class="text-journey-deep max-w-3xl section-paragraph"
        >
          {{ data.description }}
        </p>
      </div>

      <!-- 2. PURE CSS GRID LAYOUT -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full px-4 sm:px-6 md:px-8 xl:px-0">
        
        <NuxtLink
          v-for="(post, idx) in data.posts"
          :key="post.id"
          :to="post.slug"
          v-motion-fade-up
          :delay="300 + (idx * 50)"
          class="group flex rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500 bg-soft-blue/20 border border-journey-deep/10"
          :class="post.featured ? 'sm:col-span-2 flex-col sm:flex-row' : 'col-span-1 flex-col'"
        >
          <!-- Image Container (Featured is 60% width on Desktop) -->
          <div 
            :class="post.featured ? 'w-full sm:w-[55%] xl:w-[66%] shrink-0 relative overflow-hidden aspect-video sm:aspect-auto' : 'w-full relative overflow-hidden aspect-video sm:max-md:aspect-3/2 lg:max-xl:aspect-3/2'"
          >
            <!-- Mobile/Tablet Featured Badge -->
            <div 
              v-if="post.featured" 
              class="card-tag absolute top-3 left-3 sm:hidden z-10 bg-journey-deep group-hover:bg-intention-blue text-surface-light px-2.5 pt-2 pb-1 rounded-sm shadow-sm"
            >
              Featured Story
            </div>
            
            <img 
              :src="post.image" 
              :alt="post.alt" 
              width="600"
              height="400"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-active:scale-105" 
              loading="lazy" 
            />
          </div>

          <!-- Content Container (Featured is 34% width & vertically centered) -->
          <div 
            :class="post.featured ? 'w-full sm:w-[45%] xl:w-[34%] flex flex-col justify-center p-5 sm:p-6 lg:p-8' : 'w-full flex flex-col grow p-4 sm:p-5'"
          >
            <div class="flex flex-col justify-around">
              <!-- Desktop Featured Badge -->
              <div 
                v-if="post.featured" 
                class="card-tag hidden sm:inline-flex items-center justify-center bg-journey-deep group-hover:bg-intention-blue group-active:bg-intention-blue duration-700 ease-editorial text-surface-light px-2.5 pt-2 pb-1 rounded-sm mb-3 w-fit shadow-sm"
              >
                Featured Story
              </div>

              <!-- Tags -->
              <div 
                class="card-tag font-primary text-journey-deep/70 font-semibold mb-2 flex gap-2 flex-wrap"
                :class="post.featured ? 'items-center sm:flex-col sm:items-start' : 'flex-row items-center'"
              >
                <span class="flex justify-center items-center">
                  <span 
                      :class="post.featured ? 'hidden sm:flex' : 'hidden'" 
                      class="w-1 h-1 mr-2 rounded-full bg-journey-deep/30"
                  ></span>
                  {{ post.category }}
                </span>
                <span 
                  :class="post.featured ? 'sm:hidden' : ''" 
                  class="w-1 h-1 rounded-full bg-journey-deep/30"
                ></span>
                <span class="flex justify-center items-center">
                  <span 
                      :class="post.featured ? 'hidden sm:flex' : 'hidden'" 
                      class="w-1 h-1 mr-2 rounded-full bg-journey-deep/30"
                  ></span>
                  {{ post.readTime }}
                </span>
              </div>
            
              <!-- Title (Hover -> Intention Blue) -->
              <h3 class="card-title text-journey-deep mb-2 transition-colors duration-300 group-hover:text-intention-blue group-active:text-intention-blue">
                {{ post.title }}
              </h3>
              
              <!-- Excerpt -->
              <p class="section-subparagraph text-secondary-light/80 mb-4 sm:mb-5" :class="post.featured ? 'line-clamp-4' : 'line-clamp-3'">
                {{ post.excerpt }}
              </p>

              <!-- Standardized Square CTA Button (Hover -> Intention Blue) -->
              <div class="w-fit" :class="post.featured ? 'mt-2' : 'mt-auto'">
                <div class="shrink-0 flex items-center justify-center border-2 border-journey-deep/30 px-3 h-9 sm:h-10 rounded-sm text-[9px] 2xs:text-[10px] md:text-[11px] font-uppercase tracking-widest text-journey-deep uppercase transition-all duration-300 group-hover:border-intention-blue group-hover:bg-intention-blue group-hover:text-surface-light group-active:border-intention-blue group-active:bg-intention-blue group-active:text-surface-light gap-2 group-active:scale-96">
                  <span class="pt-0.75 leading-none">Read Story</span> 
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
        
      </div>

      <!-- Bottom Quote -->
      <div 
        v-motion-fade-up
        class="flex flex-col items-center text-center mt-10 md:mt-14 mb-8 md:mb-10 px-4 w-full"
      >
        <p class="px-4 lg:max-w-3xl xl:max-w-4xl text-darker-gold section-quote">
          {{ data.bottomQuote }}
        </p>
      </div>

      <!-- 3. BOTTOM CENTERED CTA BUTTON -->
      <div
        v-motion-fade-up
        :delay="100"
        class="flex justify-center w-full will-change-transform"
      >
        <CtaButton
          :to="data.bottomCta.to"
          :label="data.bottomCta.label"
          variant="light"
        />
      </div>

    </div>
  </section>
</template>
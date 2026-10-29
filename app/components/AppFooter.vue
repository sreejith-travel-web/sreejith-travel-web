<!-- ~/components/AppFooter.vue -->

<template>
  <footer id="main-footer" class="w-full relative overflow-hidden bg-journey-deep text-surface-light z-20">
    
    <!-- Ambient Gradients -->
    <div class="absolute inset-0 bg-linear-to-b from-intention-deep/60 to-journey-deep pointer-events-none z-0"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-125 bg-[radial-gradient(ellipse_at_top,var(--color-intention-blue)_0%,transparent_65%)] opacity-30 pointer-events-none z-0"></div>

    <div class="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-12 py-10 md:py-12 lg:py-14 flex flex-col">
      
      <!-- ==========================================
           1. TOP BRANDING BLOCK (Centered)
           ========================================== -->
      <div 
        v-motion-fade-up
        class="flex flex-col items-center text-center mb-8 md:mb-10 lg:mb-12"
      >
        <img 
          src="/images/sreejith-logo.png" 
          alt="Sreejith Travel"
          width="300"
          height="114"
          class="w-40 md:w-48 h-auto brightness-0 invert mb-3" 
        />
        <span class="card-eyebrow font-bold text-warm-gold tracking-[0.25em] mb-6">
          Travel Experience Designer
        </span>
        <p class="section-paragraph text-surface-light/80 max-w-2xl font-light">
          Meaningful journeys. Thoughtfully crafted. Deeply connected.<br class="hidden sm:block" />
          Travel inspired by people, places, and stories.
        </p>
      </div>

      <!-- ==========================================
           2. MAIN CONTENT GRID (Responsive Reordering)
           ========================================== -->
      <div class="flex flex-col lg:grid lg:grid-cols-12 w-full gap-y-8 lg:gap-y-0">
        
        <!-- CTA BLOCK -->
        <div 
          v-motion-fade-up
          class="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left py-8 lg:py-0 border-y border-surface-light/10 lg:border-y-0 lg:border-l lg:pl-16"
        >
          <span class="card-eyebrow font-bold text-warm-gold tracking-[0.2em] mb-4">
            Begin Your Journey
          </span>
          
          <h3 class="section-title-wrapper lg:items-start mb-4">
            <span class="text-surface-light section-subtitle leading-none capitalize">
              Your next journey,
            </span>
            <span class="text-warm-gold section-title-cursive mt-1 md:mt-2">
              thoughtfully designed.
            </span>
          </h3>
          
          <p class="section-paragraph text-surface-light/80 mb-8 max-w-md">
            Share your ideas. Let’s shape a journey around you.
          </p>
          
          <NuxtLink
            to="/planYourJourney"
            class="inline-flex items-center justify-center px-5 pt-4 pb-2.5 border border-surface-light/40 text-surface-light bg-transparent hover:bg-warm-gold hover:border-warm-gold hover:text-journey-deep active:bg-heritage-gold active:border-heritage-gold active:text-journey-deep section-subparagraph font-uppercase uppercase tracking-widest transition-all duration-300 rounded-sm cursor-pointer select-none"
          >
            Plan Your Journey
          </NuxtLink>
        </div>

        <!-- EXPLORE & CONNECT -->
        <div class="order-2 lg:order-1 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left lg:pr-12">
          
          <!-- Explore Links -->
          <div 
            v-motion-fade-up
            class="flex flex-col items-center md:items-start"
          >
            <span class="card-eyebrow font-bold text-warm-gold tracking-[0.2em] mb-4 md:mb-8">
              Explore
            </span>
            <ul class="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-y-5 text-center md:text-left section-subparagraph font-medium text-surface-light/90 w-full max-w-70 md:max-w-none mx-auto md:mx-0">
              <li><NuxtLink to="/" class="hover:text-warm-gold active:text-heritage-gold transition-colors">Home</NuxtLink></li>
              <li><NuxtLink to="/impact" class="hover:text-warm-gold active:text-heritage-gold transition-colors">Impact</NuxtLink></li>
              <li><NuxtLink to="/about" class="hover:text-warm-gold active:text-heritage-gold transition-colors">About</NuxtLink></li>
              <li><NuxtLink to="/blog" class="hover:text-warm-gold active:text-heritage-gold transition-colors">Journal</NuxtLink></li>
              <li><NuxtLink to="/itineraries" class="hover:text-warm-gold active:text-heritage-gold transition-colors">Itineraries</NuxtLink></li>
              <li><NuxtLink to="/faq" class="hover:text-warm-gold active:text-heritage-gold transition-colors">FAQ</NuxtLink></li>
              <li><NuxtLink to="/collaborate" class="hover:text-warm-gold active:text-heritage-gold transition-colors">Collaborate</NuxtLink></li>
              <li><NuxtLink to="/contact" class="hover:text-warm-gold active:text-heritage-gold transition-colors">Contact</NuxtLink></li>
            </ul>
          </div>

          <!-- Connect Details -->
          <div 
            v-motion-fade-up
            class="flex flex-col items-center md:items-start"
          >
            <span class="card-eyebrow font-bold text-warm-gold tracking-[0.2em] mb-4 md:mb-8">
              Connect
            </span>
            
            <div class="flex flex-col gap-5 section-subparagraph font-medium text-surface-light/90 w-fit mx-auto md:mx-0 text-left">
              <div class="flex justify-center md:justify-start items-start gap-4">
                <svg class="w-5 h-5 text-warm-gold shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Kochi, Kerala, India</span>
              </div>
              
              <a href="tel:+919943360478" class="flex justify-center md:justify-start items-center gap-4 hover:text-warm-gold active:text-heritage-gold transition-colors group">
                <svg class="w-5 h-5 text-warm-gold shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>+91 99433 60478</span>
              </a>
              
              <a href="mailto:hello@sreejithtravel.com" class="flex justify-center md:justify-start items-center gap-4 hover:text-warm-gold active:text-heritage-gold transition-colors group">
                <svg class="w-5 h-5 text-warm-gold shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>hello@sreejithtravel.com</span>
              </a>
            </div>

            <!-- Social Media Row -->
            <div class="flex items-center gap-5 mt-8 justify-center md:justify-start w-full md:pl-9">
              <a href="#" aria-label="Instagram" class="text-surface-light hover:text-warm-gold active:text-heritage-gold transition-colors">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" aria-label="Facebook" class="text-surface-light hover:text-warm-gold active:text-heritage-gold transition-colors">
                <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      <!-- ==========================================
           3. BOTTOM LEGAL BAR
           ========================================== -->
      <div 
        v-motion-fade-up
        class="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 mt-6 lg:mt-8 border-t border-surface-light/10 text-surface-light/60"
      >
        <p class="card-paragraph order-2 md:order-1">© 2026 Sreejith Travel. All rights reserved.</p>
        
        <div class="flex items-center gap-4 order-1 md:order-2">
          <NuxtLink to="/privacy" class="card-paragraph hover:text-warm-gold active:text-heritage-gold transition-colors">Privacy Policy</NuxtLink>
          <span class="w-px h-3 bg-surface-light/20"></span>
          <NuxtLink to="/terms" class="card-paragraph hover:text-warm-gold active:text-heritage-gold transition-colors">Terms & Conditions</NuxtLink>
        </div>
      </div>

    </div>
  </footer>
</template>
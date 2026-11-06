<!-- ~/app/layouts/default.vue -->
 
<template>
  <div class="app-wrapper min-h-screen flex flex-col bg-bg-light text-primary-light antialiased">      
    <AppHeader />
    
    <main class="grow">
      <slot />
    </main>

    <AppFooter />

    <!-- Toggle palette="gold" or palette="blue" for client review -->
    <!-- <WeavingStories palette="gold" /> -->
  </div>
</template>
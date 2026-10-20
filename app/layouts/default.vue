<!-- ~/app/layouts/default.vue -->

<template>
  <div class="app-wrapper min-h-screen flex flex-col bg-bg-light text-primary-light antialiased">      
    <!-- Global Editorial Horizontal Frame Padding -->
    <main class="grow">
      <AppHeader />
      <slot />
    </main>
  </div>
</template>
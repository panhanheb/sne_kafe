<script setup lang="ts">
// Bodrin Coffee Landing Page Wrapper
</script>

<template>
  <div class="min-h-screen bg-coffee-pattern bg-coffee-dark text-coffee-cream font-sans antialiased selection:bg-teal-accent selection:text-teal-darkText">
    <NuxtPage />
    <CartDrawer />
    <FavoritesDrawer />
    <FullMenuModal />
    <ToastNotification />
  </div>
</template>


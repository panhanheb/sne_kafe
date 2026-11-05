<script setup lang="ts">
// Bodrin Coffee Landing Page Wrapper
</script>

<template>
  <div class="min-h-screen bg-coffee-pattern bg-coffee-dark text-coffee-cream font-sans antialiased selection:bg-teal-accent selection:text-teal-darkText relative overflow-x-hidden">
    <!-- Ambient Liquid Glass Refraction Orbs (Fixed behind content) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      <!-- Top-right warm amber liquid orb -->
      <div
        class="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-coffee-sand/20 via-coffee-caramel/10 to-transparent blur-[120px] animate-fluid-1"
      />
      <!-- Mid-left luminous teal fluid orb -->
      <div
        class="absolute top-1/3 -left-48 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-teal-accent/15 via-teal-accent/5 to-transparent blur-[130px] animate-fluid-2"
      />
      <!-- Bottom-right coffee bronze liquid orb -->
      <div
        class="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-coffee-sand/15 via-coffee-mid/20 to-transparent blur-[110px] animate-fluid-3"
      />
    </div>
    <NuxtPage />
    <ClientOnly>
      <CartDrawer />
      <FavoritesDrawer />
      <FullMenuModal />
      <ProductDetailModal />
      <ToastNotification />
    </ClientOnly>
  </div>
</template>
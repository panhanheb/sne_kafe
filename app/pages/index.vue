<script setup lang="ts">
import { useI18n } from '~/composables/useI18n'

const { locale, isKhmer, t } = useI18n()

useHead(() => ({
  htmlAttrs: {
    lang: locale.value,
  },
  title: isKhmer.value
    ? 'ស្នេហ៍កាហ្វេ (Sne Kafe) — ស្វែងយល់ពីរសជាតិដ៏អស្ចារ្យក្នុងគ្រប់ដំណក់!'
    : 'Sne Kafe (ស្នេហ៍កាហ្វេ) — Exceptional Coffee in Every Sip!',
}))

useSeoMeta({
  title: () => isKhmer.value
    ? 'ស្នេហ៍កាហ្វេ (Sne Kafe) — ហាងកាហ្វេសិល្បៈពិសេស'
    : 'Sne Kafe (ស្នេហ៍កាហ្វេ) — Artisan Coffee Landing',
  ogTitle: () => isKhmer.value
    ? 'ស្នេហ៍កាហ្វេ (Sne Kafe) — ហាងកាហ្វេសិល្បៈពិសេស'
    : 'Sne Kafe (ស្នេហ៍កាហ្វេ) — Artisan Coffee Landing',
  description: () => t.value.hero.description,
  ogDescription: () => t.value.hero.description,
})
</script>

<template>
  <div class="relative overflow-x-hidden" :class="isKhmer ? 'font-khmer' : 'font-sans'">
    <!-- Header -->
    <AppHeader />

    <!-- Main Content -->
    <main>
      <!-- Hero Section -->
      <HeroSection />

      <!-- Products / Menu Section -->
      <ProductList />

      <!-- About Section -->
      <AboutSection />

      <!-- Interactive Quiz Section -->
      <QuizBanner />
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

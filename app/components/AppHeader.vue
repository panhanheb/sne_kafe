<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ShoppingBag, Heart, Menu, X, Globe } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'

const cartStore = useCartStore()
const { locale, setLocale, toggleLocale, t } = useI18n()

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const activeNav = ref('#hero')

const navItems = computed(() => [
  { name: t.value.nav.home, href: '#hero' },
  { name: t.value.nav.menu, href: '#menu' },
  { name: t.value.nav.about, href: '#about' },
  { name: t.value.nav.reviews, href: '#reviews' },
  { name: t.value.nav.promo, href: '#promo' },
])

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20

  const sections = ['hero', 'menu', 'about', 'reviews', 'promo']
  for (const section of sections) {
    const el = document.getElementById(section)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= 150 && rect.bottom >= 150) {
        activeNav.value = `#${section}`
        break
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navigateTo = (href: string) => {
  activeNav.value = href
  mobileMenuOpen.value = false
  const target = document.querySelector(href)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <header class="fixed top-2.5 sm:top-4 left-0 right-0 z-40 px-3 sm:px-6 transition-all duration-300">
    <div
      class="max-w-6xl mx-auto flex items-center justify-between gap-3 px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full liquid-glass-pill transition-all duration-300"
      :class="isScrolled ? 'shadow-[0_16px_40px_rgba(0,0,0,0.5)] bg-[#1A100A]/90' : 'shadow-[0_10px_30px_rgba(0,0,0,0.35)]'"
    >
      <!-- Logo: ស្នេហ៍កាហ្វេ (Sne Kafe) -->
      <a href="#hero" class="flex items-center gap-2.5 group select-none cursor-pointer" @click.prevent="navigateTo('#hero')">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full liquid-glass-pill flex items-center justify-center text-teal-accent group-hover:scale-110 group-hover:border-teal-accent/60 transition-all duration-300">
          <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M4 19h16v2H4v-2zm14-9V5H2v10a4 4 0 004 4h8a4 4 0 004-4v-2h2a3 3 0 003-3v-2a3 3 0 00-3-3h-2zm0 3h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v-4zM4 7h12v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/>
            <path d="M7 2h2v2H7zm4 0h2v2h-2z" opacity="0.75"/>
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-base sm:text-lg font-extrabold text-coffee-sand group-hover:text-coffee-caramel tracking-wide leading-tight font-khmer">
            ស្នេហ៍កាហ្វេ
          </span>
          <span class="text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-teal-accent/90 -mt-0.5">
            Sne Kafe
          </span>
        </div>
      </a>

      <!-- Centered liquid glass pill navigation (Desktop) -->
      <nav class="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-inner">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="relative px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer rounded-full"
          :class="activeNav === item.href ? 'text-teal-accent font-bold bg-white/15 shadow-sm' : 'text-coffee-muted hover:text-coffee-sand hover:bg-white/5'"
          @click.prevent="navigateTo(item.href)"
        >
          {{ item.name }}
          <span
            v-if="activeNav === item.href"
            class="absolute bottom-1 left-3 right-3 h-0.5 bg-teal-accent rounded-full animate-fadeIn shadow-[0_0_8px_rgba(111,168,163,0.8)]"
          />
        </a>
      </nav>

      <!-- Right controls: Language Switcher, favorites, cart, order button -->
      <div class="flex items-center gap-1.5 sm:gap-2.5">
        <!-- Liquid Language Switcher Pill (Khmer / English) -->
        <div class="flex items-center p-0.5 rounded-full liquid-glass-pill text-xs">
          <button
            type="button"
            class="px-2.5 py-1 rounded-full font-bold transition-all duration-200 cursor-pointer"
            :class="locale === 'km' ? 'liquid-glass-button text-teal-darkText shadow-sm' : 'text-coffee-muted hover:text-coffee-sand'"
            @click="setLocale('km')"
            title="ភាសាខ្មែរ (Khmer)"
          >
            ខ្មែរ
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-full font-bold transition-all duration-200 cursor-pointer"
            :class="locale === 'en' ? 'liquid-glass-button text-teal-darkText shadow-sm' : 'text-coffee-muted hover:text-coffee-sand'"
            @click="setLocale('en')"
            title="English"
          >
            EN
          </button>
        </div>

        <!-- Favorites button -->
        <button
          type="button"
          class="relative p-2 sm:p-2.5 rounded-full text-coffee-sand hover:text-teal-accent hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10 active:scale-90"
          :title="locale === 'km' ? 'បញ្ជីចូលចិត្ត' : 'Favorites'"
          @click="cartStore.openFavorites()"
        >
          <Heart class="w-5 h-5" :class="{ 'fill-red-500 text-red-500': cartStore.favorites.length > 0 }" />
          <span
            v-if="cartStore.favorites.length > 0"
            class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-[0_0_8px_rgba(239,68,68,0.7)]"
          >
            {{ cartStore.favorites.length }}
          </span>
        </button>

        <!-- Cart button with Pinia badge counter -->
        <button
          type="button"
          class="relative p-2 sm:p-2.5 rounded-full text-coffee-sand hover:text-teal-accent hover:bg-white/10 transition-all cursor-pointer border border-transparent hover:border-white/10 active:scale-90"
          :title="t.cart.title"
          @click="cartStore.openCart()"
        >
          <ShoppingBag class="w-5 h-5" />
          <span
            v-if="cartStore.totalItems > 0"
            class="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-teal-accent text-teal-darkText text-[10px] font-extrabold flex items-center justify-center leading-none shadow-[0_0_8px_rgba(111,168,163,0.8)] animate-pulse"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>

        <!-- Teal Liquid Glass Order Button -->
        <button
          type="button"
          class="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full liquid-glass-button font-bold text-xs lg:text-sm tracking-wide cursor-pointer"
          @click="cartStore.openCart()"
        >
          {{ t.nav.orderBtn }}
        </button>

        <!-- Hamburger toggle for mobile -->
        <button
          type="button"
          class="md:hidden p-2 text-coffee-sand hover:text-teal-accent rounded-lg focus:outline-none"
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <Menu v-if="!mobileMenuOpen" class="w-6 h-6" />
          <X v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Dropdown Navigation -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden mt-3 p-4 rounded-2xl liquid-glass-card space-y-2 border border-white/15"
      >
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="activeNav === item.href ? 'bg-white/10 text-teal-accent font-bold' : 'text-coffee-muted hover:text-coffee-sand'"
          @click.prevent="navigateTo(item.href)"
        >
          {{ item.name }}
        </a>

        <!-- Mobile Language Selection -->
        <div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-black/40 text-xs border border-white/5">
          <span class="text-coffee-muted">ភាសា / Language:</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="px-3 py-1 rounded-full font-bold cursor-pointer"
              :class="locale === 'km' ? 'liquid-glass-button text-teal-darkText' : 'text-coffee-muted'"
              @click="setLocale('km')"
            >
              ខ្មែរ
            </button>
            <button
              type="button"
              class="px-3 py-1 rounded-full font-bold cursor-pointer"
              :class="locale === 'en' ? 'liquid-glass-button text-teal-darkText' : 'text-coffee-muted'"
              @click="setLocale('en')"
            >
              EN
            </button>
          </div>
        </div>

        <div class="pt-2 border-t border-white/10 space-y-2">
          <button
            type="button"
            class="w-full py-2.5 rounded-full liquid-glass-button font-bold text-sm cursor-pointer"
            @click="cartStore.openCart(); mobileMenuOpen = false"
          >
            {{ t.nav.orderBtn }}
          </button>
          <button
            type="button"
            class="w-full py-2 rounded-full border border-white/15 hover:border-white/30 text-coffee-sand font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            @click="cartStore.openFavorites(); mobileMenuOpen = false"
          >
            <Heart class="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>{{ t.favorites.title }} ({{ cartStore.favorites.length }})</span>
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

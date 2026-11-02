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
  <header
    class="fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3.5 px-4 sm:px-8"
    :class="isScrolled ? 'backdrop-blur-xl bg-coffee-darkest/75 border-b border-coffee-sand/10 shadow-lg py-3' : 'bg-transparent'"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <!-- Logo: ស្នេហ៍កាហ្វេ (Sne Kafe) -->
      <a href="#hero" class="flex items-center gap-2.5 group select-none cursor-pointer" @click.prevent="navigateTo('#hero')">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-coffee-mid/80 border border-coffee-sand/30 flex items-center justify-center text-teal-accent group-hover:scale-110 group-hover:border-teal-accent transition-all duration-300 shadow-md">
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

      <!-- Centered glass pill navigation (Desktop) -->
      <nav class="hidden md:flex items-center gap-1.5 px-6 py-2.5 rounded-full glass-pill shadow-glass">
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="relative px-3.5 py-1.5 text-xs lg:text-sm font-medium transition-colors cursor-pointer"
          :class="activeNav === item.href ? 'text-teal-accent font-semibold' : 'text-coffee-muted hover:text-coffee-sand'"
          @click.prevent="navigateTo(item.href)"
        >
          {{ item.name }}
          <span
            v-if="activeNav === item.href"
            class="absolute bottom-0 left-3 right-3 h-0.5 bg-teal-accent rounded-full animate-fadeIn"
          />
        </a>
      </nav>

      <!-- Right controls: Language Switcher, favorites, cart, order button -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Language Switcher Pill (Khmer / English) -->
        <div class="flex items-center p-1 rounded-full bg-coffee-dark/80 border border-coffee-sand/20 text-xs">
          <button
            type="button"
            class="px-2.5 py-1 rounded-full font-bold transition-all duration-200"
            :class="locale === 'km' ? 'bg-teal-accent text-teal-darkText shadow-sm' : 'text-coffee-muted hover:text-coffee-sand'"
            @click="setLocale('km')"
            title="ភាសាខ្មែរ (Khmer)"
          >
            ខ្មែរ
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-full font-bold transition-all duration-200"
            :class="locale === 'en' ? 'bg-teal-accent text-teal-darkText shadow-sm' : 'text-coffee-muted hover:text-coffee-sand'"
            @click="setLocale('en')"
            title="English"
          >
            EN
          </button>
        </div>

        <!-- Favorites button -->
        <button
          type="button"
          class="relative p-2.5 rounded-full text-coffee-sand hover:text-teal-accent hover:bg-coffee-mid/50 transition-all cursor-pointer"
          :title="locale === 'km' ? 'បញ្ជីចូលចិត្ត' : 'Favorites'"
          @click="cartStore.openFavorites()"
        >
          <Heart class="w-5 h-5" :class="{ 'fill-red-500 text-red-500': cartStore.favorites.length > 0 }" />
          <span
            v-if="cartStore.favorites.length > 0"
            class="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none"
          >
            {{ cartStore.favorites.length }}
          </span>
        </button>

        <!-- Cart button with Pinia badge counter -->
        <button
          type="button"
          class="relative p-2.5 rounded-full text-coffee-sand hover:text-teal-accent hover:bg-coffee-mid/50 transition-all"
          :title="t.cart.title"
          @click="cartStore.openCart()"
        >
          <ShoppingBag class="w-5 h-5" />
          <span
            v-if="cartStore.totalItems > 0"
            class="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-teal-accent text-teal-darkText text-[10px] font-extrabold flex items-center justify-center leading-none animate-pulse"
          >
            {{ cartStore.totalItems }}
          </span>
        </button>

        <!-- Teal Order Button -->
        <button
          type="button"
          class="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-semibold text-xs lg:text-sm tracking-wide shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
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
        class="md:hidden mt-3 p-4 rounded-2xl glass-card backdrop-blur-2xl border border-coffee-sand/20 space-y-2"
      >
        <a
          v-for="item in navItems"
          :key="item.href"
          :href="item.href"
          class="block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          :class="activeNav === item.href ? 'bg-coffee-sand/15 text-teal-accent font-semibold' : 'text-coffee-muted hover:text-coffee-sand'"
          @click.prevent="navigateTo(item.href)"
        >
          {{ item.name }}
        </a>

        <!-- Mobile Language Selection -->
        <div class="flex items-center justify-between px-4 py-2.5 rounded-xl bg-coffee-dark/60 text-xs">
          <span class="text-coffee-muted">ភាសា / Language:</span>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="px-3 py-1 rounded-full font-bold"
              :class="locale === 'km' ? 'bg-teal-accent text-teal-darkText' : 'text-coffee-muted'"
              @click="setLocale('km')"
            >
              ខ្មែរ
            </button>
            <button
              type="button"
              class="px-3 py-1 rounded-full font-bold"
              :class="locale === 'en' ? 'bg-teal-accent text-teal-darkText' : 'text-coffee-muted'"
              @click="setLocale('en')"
            >
              EN
            </button>
          </div>
        </div>

        <div class="pt-2 border-t border-coffee-sand/10 space-y-2">
          <button
            type="button"
            class="w-full py-2.5 rounded-full bg-teal-accent text-teal-darkText font-semibold text-sm shadow-md"
            @click="cartStore.openCart(); mobileMenuOpen = false"
          >
            {{ t.nav.orderBtn }}
          </button>
          <button
            type="button"
            class="w-full py-2 rounded-full border border-coffee-sand/20 hover:border-coffee-sand/50 text-coffee-sand font-medium text-xs flex items-center justify-center gap-2 transition-colors"
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

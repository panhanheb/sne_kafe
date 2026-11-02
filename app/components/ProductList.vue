<script setup lang="ts">
import { ArrowRight, Sparkles } from 'lucide-vue-next'
import { useProducts } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'

const { featuredProducts } = useProducts()
const cartStore = useCartStore()
const { t, isKhmer } = useI18n()

const handleOpenFullMenu = () => {
  cartStore.openFullMenu()
}
</script>

<template>
  <section id="menu" class="relative py-20 sm:py-28 overflow-hidden">
    <!-- Watermark behind the cards -->
    <div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
      <span class="watermark-text transform rotate-3">
        COFFEE
      </span>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
        <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full glass-pill text-xs font-semibold text-teal-accent mb-3">
          <Sparkles class="w-3.5 h-3.5" />
          <span>{{ t.menu.tag }}</span>
        </div>
        <h2
          class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-coffee-sand tracking-tight"
          :class="isKhmer ? 'font-khmer' : ''"
        >
          {{ t.menu.title }}
        </h2>
        <p
          class="text-xs sm:text-sm text-coffee-muted mt-3"
          :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
        >
          {{ t.menu.description }}
        </p>
      </div>

      <!-- Featured Cards Grid / Mobile Horizontal Scroll -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 snap-x">
        <div
          v-for="product in featuredProducts"
          :key="product.id"
          class="snap-center"
        >
          <ProductCard :product="product" />
        </div>
      </div>

      <!-- Underlined link below: "View Full Menu →" (as in design screenshot) -->
      <div class="mt-14 sm:mt-18 text-center">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-[#D9A87C] hover:text-teal-accent font-medium text-sm sm:text-base border-b border-[#D9A87C]/60 hover:border-teal-accent pb-0.5 transition-all group cursor-pointer"
          @click="handleOpenFullMenu"
        >
          <span :class="isKhmer ? 'font-khmer' : ''">{{ t.menu.viewMenu }}</span>
          <span class="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

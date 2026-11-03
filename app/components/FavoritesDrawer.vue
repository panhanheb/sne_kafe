<script setup lang="ts">
import { computed } from 'vue'
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Plus } from 'lucide-vue-next'
import { useProducts, type DisplayProduct } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'

const cartStore = useCartStore()
const { products } = useProducts()
const { t, isKhmer } = useI18n()

const favoriteProducts = computed<DisplayProduct[]>(() => {
  return products.value.filter(p => cartStore.favorites.includes(p.id))
})

const handleAddAll = () => {
  if (favoriteProducts.value.length > 0) {
    cartStore.addAllFavoritesToCart(favoriteProducts.value)
    cartStore.closeFavorites()
  }
}

const handleAddSingle = (product: DisplayProduct) => {
  cartStore.addItem(product)
}

const handleOpenMenu = () => {
  cartStore.closeFavorites()
  cartStore.openFullMenu()
}
</script>

<template>
  <teleport to="body">
    <!-- Backdrop -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cartStore.isFavoritesOpen"
        class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl"
        @click="cartStore.closeFavorites()"
      />
    </transition>

    <!-- Slide-in Drawer (Liquid Glass) -->
    <transition
      enter-active-class="transition duration-300 ease-out transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="cartStore.isFavoritesOpen"
        class="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md liquid-glass-modal flex flex-col justify-between overflow-hidden"
      >
        <!-- Header -->
        <div class="p-6 border-b border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-red-500/15 flex items-center justify-center text-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              <Heart class="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2
                class="text-xl font-bold text-coffee-sand leading-tight"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ t.favorites.title }}
              </h2>
              <span class="text-xs text-coffee-muted">
                {{ favoriteProducts.length }} {{ t.favorites.countLabel }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="p-2.5 rounded-full text-coffee-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10"
            @click="cartStore.closeFavorites()"
            aria-label="Close favorites"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-if="favoriteProducts.length === 0"
          class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4"
        >
          <div class="w-20 h-20 rounded-full bg-coffee-mid/50 text-coffee-muted/70 flex items-center justify-center">
            <Heart class="w-10 h-10 stroke-[1.5]" />
          </div>
          <h3
            class="text-xl font-bold text-coffee-sand"
            :class="isKhmer ? 'font-khmer' : ''"
          >
            {{ t.favorites.emptyTitle }}
          </h3>
          <p
            class="text-xs sm:text-sm text-coffee-muted max-w-xs leading-relaxed"
            :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
          >
            {{ t.favorites.emptyDesc }}
          </p>
          <button
            type="button"
            class="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
            @click="handleOpenMenu"
          >
            <span>{{ t.favorites.emptyBtn }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Items List -->
        <div v-else class="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-[#3D281C]/70">
          <!-- Top Batch Action: Add All to Cart -->
          <div class="pb-2">
            <button
              type="button"
              class="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full liquid-glass-button font-extrabold text-xs tracking-wide cursor-pointer"
              @click="handleAddAll"
            >
              <ShoppingBag class="w-4 h-4" />
              <span>{{ t.favorites.addAllBtn }} ({{ favoriteProducts.length }})</span>
            </button>
          </div>

          <div
            v-for="product in favoriteProducts"
            :key="product.id"
            class="pt-4 first:pt-0 flex items-center gap-4 group"
          >
            <!-- Product Thumbnail -->
            <div class="w-16 h-16 rounded-2xl bg-[#2A1C15] p-2 flex items-center justify-center shrink-0 border border-coffee-sand/10">
              <NuxtImg
                :src="product.image"
                :alt="product.name"
                width="56"
                height="56"
                class="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform"
              />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-1">
                <div>
                  <h4
                    class="text-sm font-bold text-coffee-sand truncate"
                    :class="isKhmer ? 'font-khmer' : ''"
                  >
                    {{ product.name }}
                  </h4>
                  <span class="text-[11px] text-coffee-subtle font-mono">
                    {{ product.formattedPrice }}
                  </span>
                </div>

                <button
                  type="button"
                  class="text-coffee-muted hover:text-red-400 p-1 transition-colors"
                  :aria-label="'Remove ' + product.name + ' from favorites'"
                  @click="cartStore.toggleFavorite(product.id)"
                  :title="t.favorites.remove"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>

              <!-- Action button: Add to Cart -->
              <div class="mt-2.5 flex items-center justify-between">
                <span class="text-[11px] text-coffee-muted font-mono">
                  {{ product.nameEn }}
                </span>
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText text-xs font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
                  @click="handleAddSingle(product)"
                >
                  <Plus class="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{{ t.favorites.addToCart }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="favoriteProducts.length > 0" class="p-4 border-t border-[#3D281C] bg-[#180F0A]/95 text-center">
          <button
            type="button"
            class="text-xs text-coffee-muted hover:text-coffee-sand underline"
            @click="handleOpenMenu"
          >
            {{ t.fullMenu.title }} →
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Star, Plus, Check, Heart } from 'lucide-vue-next'
import type { DisplayProduct } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  product: DisplayProduct
}>()

const cartStore = useCartStore()
const { t, isKhmer } = useI18n()
const isAdded = ref(false)

const handleAddToCart = () => {
  cartStore.addItem(props.product)
  isAdded.value = true
  setTimeout(() => {
    isAdded.value = false
  }, 1200)
}
</script>

<template>
  <div
    class="relative rounded-[2rem] p-6 sm:p-7 pt-16 sm:pt-20 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-coffee-sand/40 group mt-16 sm:mt-20 bg-[#251811]/90 backdrop-blur-xl border border-[#442E20]/60 shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
  >
    <!-- Overlapping Cup Image (Clean, smooth soft shadow without harsh dark blobs) -->
    <div class="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 w-32 sm:w-36 h-32 sm:h-36 pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1 z-20 flex items-center justify-center">
      <NuxtImg
        :src="product.image"
        :alt="product.name"
        width="150"
        height="150"
        loading="lazy"
        class="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
      />
    </div>

    <!-- Top Row: Rating Pill (left), Badge (middle), Favorite Heart (right) -->
    <div class="flex items-center justify-between w-full mb-5 z-20">
      <!-- Rating Badge with Gold Star -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#180F0A] border border-white/10 text-xs font-bold text-white shadow-sm">
        <Star class="w-3.5 h-3.5 fill-[#EAA34B] text-[#EAA34B]" />
        <span>{{ product.rating.toFixed(1) }}</span>
      </div>

      <!-- Middle Badge (e.g. Best Seller / Guest's Choice) -->
      <span
        v-if="product.badge"
        class="text-[11px] font-semibold px-3 py-1 rounded-full bg-teal-accent/15 text-teal-accent border border-teal-accent/30 shadow-sm whitespace-nowrap"
      >
        {{ product.badge }}
      </span>
      <span v-else class="w-4" />

      <!-- Favorite Heart Toggle -->
      <button
        type="button"
        class="p-1 rounded-full text-coffee-muted hover:text-red-400 transition-colors cursor-pointer"
        :aria-label="'Favorite ' + product.name"
        @click="cartStore.toggleFavorite(product.id)"
      >
        <Heart
          class="w-4 h-4 transition-transform duration-200 active:scale-125"
          :class="cartStore.isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-coffee-muted/70 hover:text-white'"
        />
      </button>
    </div>

    <!-- Product Title & English Subtitle -->
    <div class="space-y-2 mb-6">
      <div class="flex items-baseline justify-between gap-2">
        <h3
          class="text-2xl sm:text-[1.65rem] font-bold text-[#E5B588] tracking-wide"
          :class="isKhmer ? 'font-khmer leading-snug' : ''"
        >
          {{ product.name }}
        </h3>
        <span class="text-[11px] uppercase tracking-widest text-[#8A6D57] font-semibold font-mono">
          {{ product.nameEn }}
        </span>
      </div>

      <!-- Description -->
      <p
        class="text-xs sm:text-[13px] text-[#A68871] leading-relaxed line-clamp-2 min-h-[38px]"
        :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
      >
        {{ product.description }}
      </p>
    </div>

    <!-- Bottom Bar: Price & Round Teal "+" Button -->
    <div class="flex items-end justify-between pt-4 border-t border-[#3D281C]/70">
      <div>
        <span class="text-[11px] text-[#8A6D57] block font-medium mb-0.5">
          {{ t.menu.priceLabel }}
        </span>
        <span class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {{ product.formattedPrice }}
        </span>
      </div>

      <!-- Round Teal Add Button -->
      <button
        type="button"
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-md active:scale-90"
        :class="isAdded
          ? 'bg-green-600 text-white'
          : 'bg-teal-accent hover:bg-teal-hover text-teal-darkText hover:shadow-glow hover:scale-105'"
        :aria-label="'Add ' + product.name + ' to cart'"
        @click="handleAddToCart"
      >
        <Check v-if="isAdded" class="w-5 h-5 animate-scaleIn" />
        <Plus v-else class="w-5 h-5 stroke-[2.8]" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Star, Plus, Check, Heart } from 'lucide-vue-next'
import type { DisplayProduct } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'
import { useFlyToCart } from '~/composables/useFlyToCart'
import { use8DAudio } from '~/composables/use8DAudio'

const props = defineProps<{
  product: DisplayProduct
}>()

const cartStore = useCartStore()
const { t, isKhmer } = useI18n()
const { flyToCart } = useFlyToCart()
const { playCardCue, playProduct8DExperience, playAddToCart, activePreviewProductId } = use8DAudio()

const isAdded = ref(false)
const cupImageRef = ref<HTMLElement | null>(null)
const isPlayingThisPreview = computed(() => activePreviewProductId.value === props.product.id)

const handleCardHover = (e: MouseEvent) => {
  if (typeof window === 'undefined') return
  const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect()
  if (rect) {
    const screenXRatio = (rect.left + rect.width / 2) / window.innerWidth
    playCardCue(screenXRatio)
  }
}

const handle8DPreviewClick = (e: Event) => {
  e.stopPropagation()
  if (typeof window === 'undefined') return
  const el = e.currentTarget as HTMLElement
  const rect = el?.getBoundingClientRect()
  const screenXRatio = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5
  playProduct8DExperience(props.product.id, screenXRatio)
}

const handleAddToCart = async () => {
  if (isAdded.value) return
  isAdded.value = true

  // Play spatial tactile Add to Cart acoustic chime
  const rect = cupImageRef.value?.getBoundingClientRect()
  const screenXRatio = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5
  playAddToCart(screenXRatio)

  // Realistic flying animation from the cup image to the header cart button
  if (cupImageRef.value) {
    flyToCart({
      sourceEl: cupImageRef.value,
      imageSrc: props.product.image,
      duration: 0.75,
    })
  }

  cartStore.addItem(props.product)

  setTimeout(() => {
    isAdded.value = false
  }, 1000)
}
</script>

<template>
  <div
    class="reveal-on-scroll spatial-8d-card relative rounded-[2.25rem] p-6 sm:p-7 pt-16 sm:pt-20 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 group mt-16 sm:mt-20 liquid-glass-card select-none overflow-visible cursor-pointer gpu-accel hover:shadow-[0_24px_50px_rgba(0,0,0,0.55),0_0_40px_rgba(234,163,75,0.08)]"
    @click="cartStore.openProductDetail(product)"
    @mouseenter="handleCardHover"
  >
    <!-- Overlapping Cup Image (Clean, prominent, unclipped with smooth soft drop shadow) -->
    <div
      ref="cupImageRef"
      class="absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2 w-32 sm:w-36 h-32 sm:h-36 pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-translate-y-3 z-20 flex items-center justify-center will-change-transform"
    >
      <NuxtImg
        :src="product.image"
        :alt="product.name"
        width="150"
        height="150"
        loading="lazy"
        class="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)]"
      />
      <!-- 8D Floating Audio Badge for all beverages with 1-click 8D Audio Preview -->
      <button
        v-if="product.category !== 'bakery'"
        type="button"
        class="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold backdrop-blur-md shadow-lg flex items-center gap-1 transition-all duration-300 pointer-events-auto cursor-pointer active:scale-90"
        :class="isPlayingThisPreview
          ? 'bg-teal-400 text-black border-teal-200 shadow-[0_0_14px_rgba(111,168,163,0.8)] scale-110'
          : 'bg-black/80 border-teal-400/50 text-teal-300 group-hover:border-teal-300 group-hover:scale-105'"
        :title="'Listen to 8D sound of ' + product.name"
        @click="handle8DPreviewClick"
      >
        <span class="text-[11px]">{{ isPlayingThisPreview ? '🔊' : '🎧' }}</span>
        <span class="tracking-wider">8D</span>
        <!-- Mini animated soundwave when preview is playing -->
        <span v-if="isPlayingThisPreview" class="flex items-center gap-0.5 h-2.5 ml-0.5">
          <span class="w-0.5 bg-black rounded-full animate-soundwave-1" />
          <span class="w-0.5 bg-black rounded-full animate-soundwave-2" />
          <span class="w-0.5 bg-black rounded-full animate-soundwave-3" />
        </span>
      </button>
    </div>

    <!-- Top Row: Rating Pill (left), Badge (middle), Favorite Heart (right) -->
    <div class="flex items-center justify-between w-full mb-5 z-20">
      <!-- Rating Badge with Gold Star -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A100A]/90 border border-white/10 text-xs font-bold text-white shadow-sm">
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
        class="p-1.5 rounded-full text-coffee-muted hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
        :aria-label="'Favorite ' + product.name"
        @click.stop="cartStore.toggleFavorite(product.id)"
      >
        <Heart
          class="w-4 h-4 transition-transform duration-200 active:scale-125"
          :class="cartStore.isFavorite(product.id) ? 'fill-red-500 text-red-500 filter drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]' : 'text-coffee-muted/70 hover:text-white'"
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

    <!-- Bottom Bar: Price & Round Teal Liquid Button -->
    <div class="flex items-end justify-between pt-4 border-t border-[#3D281C]/70">
      <div>
        <span class="text-[11px] text-[#8A6D57] block font-medium mb-0.5">
          {{ t.menu.priceLabel }}
        </span>
        <span class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {{ product.formattedPrice }}
        </span>
      </div>

      <!-- Round Teal Liquid Glass Add Button -->
      <button
        type="button"
        class="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-90 hover:scale-105"
        :class="isAdded
          ? 'bg-emerald-500 text-white shadow-md scale-105'
          : 'liquid-glass-button'"
        :aria-label="'Add ' + product.name + ' to cart'"
        @click.stop="handleAddToCart"
      >
        <Check v-if="isAdded" class="w-5 h-5 animate-scaleIn stroke-[3]" />
        <Plus v-else class="w-5 h-5 stroke-[2.8]" />
      </button>
    </div>
  </div>
</template>

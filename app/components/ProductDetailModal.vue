<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  X,
  Star,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Heart,
  Flame,
  Check,
  RotateCcw,
  Coffee,
  Info
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'
import type { CartCustomization } from '~/stores/cart'

const cartStore = useCartStore()
const { t, isKhmer } = useI18n()

// Active Product
const product = computed(() => cartStore.selectedProductForDetail)

// Customization State
const selectedSize = ref<'S' | 'M' | 'L'>('M')
const selectedIce = ref<string>('regular')
const selectedSweetness = ref<string>('50%')
const withCream = ref(false)
const withExtraShot = ref(false)
const withCocoa = ref(false)
const withCaramel = ref(false)
const quantity = ref(1)

// Animation Triggers
const isIceDropping = ref(false)
const isCreamSwirling = ref(false)
const isEspressoPouring = ref(false)
const isToppingShowering = ref(false)
const isOrderAdded = ref(false)

// 3D Tilt State
const tiltX = ref(0)
const tiltY = ref(0)
const isHoveringCup = ref(false)

// Reset state when a new product opens
watch(() => cartStore.selectedProductForDetail, (newProduct) => {
  if (newProduct) {
    selectedSize.value = 'M'
    selectedIce.value = newProduct.category === 'iced' ? 'regular' : 'none'
    selectedSweetness.value = '50%'
    withCream.value = newProduct.id === 'mocha'
    withExtraShot.value = false
    withCocoa.value = newProduct.id === 'cappuccino'
    withCaramel.value = newProduct.id === 'macchiato'
    quantity.value = 1
    isOrderAdded.value = false
  }
})

// Mouse 3D Tilt handlers
const handleMouseMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const mouseX = e.clientX - centerX
  const mouseY = e.clientY - centerY

  tiltX.value = -((mouseY / (rect.height / 2)) * 14)
  tiltY.value = (mouseX / (rect.width / 2)) * 16
  isHoveringCup.value = true
}

const handleMouseLeave = () => {
  tiltX.value = 0
  tiltY.value = 0
  isHoveringCup.value = false
}

// Interactive triggers
const setIce = (level: string) => {
  selectedIce.value = level
  if (level !== 'none') {
    isIceDropping.value = false
    // Force re-trigger animation
    nextTick(() => {
      isIceDropping.value = true
      setTimeout(() => {
        isIceDropping.value = false
      }, 1200)
    })
  }
}

const toggleCream = () => {
  withCream.value = !withCream.value
  if (withCream.value) {
    isCreamSwirling.value = false
    nextTick(() => {
      isCreamSwirling.value = true
      setTimeout(() => {
        isCreamSwirling.value = false
      }, 1100)
    })
  }
}

const toggleExtraShot = () => {
  withExtraShot.value = !withExtraShot.value
  if (withExtraShot.value) {
    isEspressoPouring.value = false
    nextTick(() => {
      isEspressoPouring.value = true
      setTimeout(() => {
        isEspressoPouring.value = false
      }, 1400)
    })
  }
}

const toggleCocoa = () => {
  withCocoa.value = !withCocoa.value
  if (withCocoa.value) {
    isToppingShowering.value = true
    setTimeout(() => {
      isToppingShowering.value = false
    }, 800)
  }
}

const toggleCaramel = () => {
  withCaramel.value = !withCaramel.value
  if (withCaramel.value) {
    isToppingShowering.value = true
    setTimeout(() => {
      isToppingShowering.value = false
    }, 800)
  }
}

// Dynamic Price Calculation
const unitPrice = computed(() => {
  if (!product.value) return 0
  let price = product.value.price

  // Size adjustments
  if (selectedSize.value === 'S') price -= 0.30
  if (selectedSize.value === 'L') price += 0.50

  // Addons
  if (withCream.value) price += 0.50
  if (withExtraShot.value) price += 0.60
  if (withCaramel.value) price += 0.25

  return Math.max(price, 0.50)
})

const totalPrice = computed(() => {
  return unitPrice.value * quantity.value
})

const formattedTotalPrice = computed(() => {
  return `$${totalPrice.value.toFixed(2)}`
})

const totalPriceKhr = computed(() => {
  return ((totalPrice.value * 4000).toLocaleString('en-US')) + ' ៛'
})

// Scale factor based on cup size
const cupScale = computed(() => {
  if (selectedSize.value === 'S') return 0.88
  if (selectedSize.value === 'L') return 1.12
  return 1.0
})

// Add to Cart
const handleAddToCart = () => {
  if (!product.value) return

  const toppings: string[] = []
  if (withCocoa.value) toppings.push('Cocoa Dust')
  if (withCaramel.value) toppings.push('Caramel Drizzle')

  const customization: CartCustomization = {
    size: selectedSize.value,
    iceLevel: selectedIce.value !== 'none' ? `Ice: ${selectedIce.value}` : 'No Ice',
    sweetness: `Sugar: ${selectedSweetness.value}`,
    cream: withCream.value,
    extraShot: withExtraShot.value,
    toppings,
  }

  cartStore.addCustomizedItem(product.value, customization, unitPrice.value, quantity.value)

  isOrderAdded.value = true
  setTimeout(() => {
    isOrderAdded.value = false
    cartStore.closeProductDetail()
  }, 700)
}

const close = () => {
  cartStore.closeProductDetail()
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
        v-if="cartStore.isProductDetailOpen && product"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto"
        @click.self="close"
      >
        <!-- Modal Container (Smooth Liquid Glass) -->
        <div
          class="relative w-full max-w-4xl rounded-[2.5rem] liquid-glass-modal flex flex-col lg:flex-row overflow-hidden my-auto shadow-2xl border border-white/15"
          @click.stop
        >
          <!-- Close Button -->
          <button
            type="button"
            class="absolute top-5 right-5 z-40 p-2.5 rounded-full text-coffee-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10 active:scale-90"
            @click="close"
            aria-label="Close product details"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- LEFT COLUMN: Interactive 3D Drink Showcase -->
          <div
            class="lg:w-1/2 p-6 sm:p-10 flex flex-col items-center justify-between relative bg-gradient-to-b from-[#2B1D16]/50 to-[#1A1009]/80 border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
          >
            <!-- Background Ambient Glow behind Drink -->
            <div
              class="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-0"
              :class="withCream ? 'bg-amber-400/20' : 'bg-teal-accent/20'"
            />

            <!-- Top Tag & Rating Pill -->
            <div class="w-full flex items-center justify-between z-20">
              <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass-pill text-xs font-bold text-white shadow-sm">
                <Star class="w-3.5 h-3.5 fill-[#EAA34B] text-[#EAA34B]" />
                <span>{{ product.rating.toFixed(1) }}</span>
                <span class="text-coffee-muted font-normal">({{ product.reviewsCount || 128 }})</span>
              </div>

              <!-- Badge if any -->
              <span
                v-if="product.badge"
                class="text-[11px] font-semibold px-3 py-1 rounded-full bg-teal-accent/15 text-teal-accent border border-teal-accent/30 shadow-sm"
              >
                {{ product.badge }}
              </span>
            </div>

            <!-- 3D Spatial Cup Canvas -->
            <div class="relative w-full h-80 sm:h-96 flex items-center justify-center perspective-1000 my-4 z-10">
              <!-- Tilting Wrapper -->
              <div
                class="relative flex items-center justify-center transition-transform duration-200 ease-out preserve-3d"
                :style="{
                  transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${cupScale})`,
                }"
              >
                <!-- Liquid Ripple when ice/pour triggers -->
                <div
                  v-if="isIceDropping || isEspressoPouring"
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border-2 border-teal-accent/40 animate-ripple pointer-events-none"
                />

                <!-- 3D Espresso Pour Stream -->
                <div
                  v-if="isEspressoPouring"
                  class="absolute -top-32 left-1/2 -translate-x-1/2 w-3 bg-gradient-to-b from-[#3B1E10] via-[#5C341C] to-[#251006] rounded-full animate-pour z-30 shadow-[0_0_12px_rgba(92,52,28,0.8)]"
                />

                <!-- 3D Swirling Whipped Cream Crown -->
                <div
                  v-if="withCream"
                  class="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-28 pointer-events-none z-30 flex items-center justify-center"
                  :class="{ 'animate-cream-swirl': isCreamSwirling }"
                >
                  <svg viewBox="0 0 160 140" class="w-full h-full filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
                    <defs>
                      <linearGradient id="creamGloss" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#FFFFFF" />
                        <stop offset="45%" stop-color="#FFFDF9" />
                        <stop offset="80%" stop-color="#F7ECE0" />
                        <stop offset="100%" stop-color="#E5D1BE" />
                      </linearGradient>
                      <linearGradient id="chocSyrup" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#461E0F" />
                        <stop offset="100%" stop-color="#1F0A03" />
                      </linearGradient>
                    </defs>
                    <!-- Cream swirl tiers -->
                    <path d="M25 125 C25 90 50 80 80 75 C110 80 135 90 135 125 Z" fill="url(#creamGloss)" />
                    <path d="M38 100 C42 65 60 50 80 40 C100 50 118 65 122 100 Z" fill="url(#creamGloss)" />
                    <path d="M55 65 C62 38 72 25 80 12 C88 25 98 38 105 65 Z" fill="url(#creamGloss)" />
                    <!-- Swirl ridges -->
                    <path d="M45 110 Q80 85 115 110" stroke="#EFE2D4" stroke-width="4" stroke-linecap="round" fill="none" />
                    <path d="M55 80 Q80 60 105 80" stroke="#EFE2D4" stroke-width="4" stroke-linecap="round" fill="none" />
                    <path d="M68 50 Q80 35 92 50" stroke="#EFE2D4" stroke-width="3" stroke-linecap="round" fill="none" />
                    <!-- Chocolate Syrup Drizzle -->
                    <path d="M42 98 Q60 115 80 95 Q100 75 120 102" stroke="url(#chocSyrup)" stroke-width="3.5" stroke-linecap="round" fill="none" class="animate-drizzle" />
                    <path d="M60 65 Q80 80 98 60" stroke="url(#chocSyrup)" stroke-width="3" stroke-linecap="round" fill="none" class="animate-drizzle" />
                  </svg>
                </div>

                <!-- 3D Translucent Falling Ice Cubes -->
                <div v-if="selectedIce !== 'none'" class="absolute inset-0 pointer-events-none z-20">
                  <!-- Ice Cube 1 -->
                  <div
                    class="absolute top-1/3 left-1/4 w-10 h-10 rounded-lg backdrop-blur-sm border border-white/60 bg-white/35 shadow-[0_4px_12px_rgba(255,255,255,0.3)] transform rotate-12"
                    :class="isIceDropping ? 'animate-ice-drop-1' : 'animate-ice-bob'"
                  >
                    <div class="absolute inset-1 rounded bg-gradient-to-br from-white/70 via-transparent to-teal-accent/20" />
                  </div>

                  <!-- Ice Cube 2 -->
                  <div
                    class="absolute top-2/5 right-1/4 w-9 h-9 rounded-lg backdrop-blur-sm border border-white/60 bg-white/30 shadow-[0_4px_12px_rgba(255,255,255,0.25)] transform -rotate-15"
                    :class="isIceDropping ? 'animate-ice-drop-2' : 'animate-ice-bob'"
                    style="animation-delay: 0.6s;"
                  >
                    <div class="absolute inset-1 rounded bg-gradient-to-tr from-white/60 via-transparent to-coffee-sand/20" />
                  </div>

                  <!-- Ice Cube 3 (If Extra Ice) -->
                  <div
                    v-if="selectedIce === 'extra'"
                    class="absolute top-1/4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-lg backdrop-blur-sm border border-white/60 bg-white/40 shadow-[0_4px_10px_rgba(255,255,255,0.3)] transform rotate-45"
                    :class="isIceDropping ? 'animate-ice-drop-3' : 'animate-ice-bob'"
                    style="animation-delay: 1.2s;"
                  >
                    <div class="absolute inset-1 rounded bg-gradient-to-b from-white/75 to-transparent" />
                  </div>
                </div>

                <!-- 3D Topping Cocoa Powder / Sprinkles -->
                <div v-if="withCocoa || withCaramel" class="absolute top-20 left-1/2 -translate-x-1/2 w-28 h-12 pointer-events-none z-30">
                  <div class="flex items-center justify-around w-full h-full animate-dust">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#4A2613] shadow-sm" />
                    <span class="w-1 h-1 rounded-full bg-[#EAA34B] shadow-sm" />
                    <span class="w-2 h-2 rounded-full bg-[#361A0C] shadow-sm" />
                    <span class="w-1.5 h-1.5 rounded-full bg-[#EAA34B] shadow-sm" />
                    <span class="w-1 h-1 rounded-full bg-[#4A2613] shadow-sm" />
                  </div>
                </div>

                <!-- Main Cup Image (Smooth & Clean) -->
                <NuxtImg
                  :src="product.image"
                  :alt="product.name"
                  width="220"
                  height="220"
                  class="w-56 sm:w-64 h-auto object-contain filter drop-shadow-[0_16px_30px_rgba(0,0,0,0.4)] pointer-events-none transition-transform duration-300"
                />
              </div>
            </div>

            <!-- Spatial 3D Hint -->
            <div class="flex items-center gap-2 text-[11px] text-coffee-muted/70 z-20">
              <Sparkles class="w-3.5 h-3.5 text-teal-accent" />
              <span>{{ isKhmer ? 'អូសដើម្បីមើលមុំ 3D នៃកែវ' : 'Hover / touch to tilt in 3D' }}</span>
            </div>
          </div>

          <!-- RIGHT COLUMN: Customization Controls & Add to Cart -->
          <div class="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6 overflow-y-auto max-h-[85vh]">
            <!-- Title & Pricing -->
            <div>
              <div class="flex items-baseline justify-between gap-3">
                <h2
                  class="text-2xl sm:text-3xl font-extrabold text-[#E5B588] tracking-wide"
                  :class="isKhmer ? 'font-khmer' : ''"
                >
                  {{ product.name }}
                </h2>
                <span class="text-xs font-mono uppercase tracking-widest text-coffee-muted">
                  {{ product.nameEn }}
                </span>
              </div>

              <p
                class="text-xs sm:text-sm text-coffee-muted leading-relaxed mt-2"
                :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
              >
                {{ product.description }}
              </p>

              <!-- Composition / Ingredients Pill -->
              <div v-if="product.composition" class="mt-3 p-3 rounded-2xl bg-black/30 border border-white/5 flex items-start gap-2.5">
                <Coffee class="w-4 h-4 text-teal-accent shrink-0 mt-0.5" />
                <p class="text-xs text-[#BFA48E] leading-normal" :class="isKhmer ? 'font-khmer' : ''">
                  {{ product.composition }}
                </p>
              </div>
            </div>

            <!-- Customizer Controls -->
            <div class="space-y-5">
              <!-- 1. Size Selection (S / M / L) -->
              <div>
                <div class="flex items-center justify-between text-xs font-bold text-coffee-sand mb-2.5">
                  <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'ទំហំកែវ (Size):' : 'Cup Size:' }}</span>
                  <span class="text-teal-accent font-mono text-[11px]">
                    {{ selectedSize === 'S' ? 'Small 8 oz (-$0.30)' : selectedSize === 'M' ? 'Regular 12 oz' : 'Large 16 oz (+$0.50)' }}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-black/40 border border-white/10">
                  <button
                    v-for="size in (['S', 'M', 'L'] as const)"
                    :key="size"
                    type="button"
                    class="py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5"
                    :class="selectedSize === size
                      ? 'liquid-glass-button text-teal-darkText shadow-sm'
                      : 'text-coffee-muted hover:text-white hover:bg-white/5'"
                    @click="selectedSize = size"
                  >
                    <span>{{ size }}</span>
                    <span class="text-[10px] font-normal opacity-80 font-mono">
                      {{ size === 'S' ? '8 oz' : size === 'M' ? '12 oz' : '16 oz' }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- 2. Ice Selection with 3D tumble animation -->
              <div>
                <div class="flex items-center justify-between text-xs font-bold text-coffee-sand mb-2.5">
                  <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'កម្រិតទឹកកក (Ice):' : 'Ice Level:' }}</span>
                  <span class="text-teal-accent text-[11px] font-mono">
                    {{ selectedIce === 'none' ? 'No Ice (0%)' : selectedIce === 'less' ? 'Less (50%)' : selectedIce === 'regular' ? 'Regular (100%)' : 'Extra (120%)' }}
                  </span>
                </div>
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="ice in [
                      { id: 'none', label: isKhmer ? 'គ្មាន' : 'None', icon: '0%' },
                      { id: 'less', label: isKhmer ? 'តិច' : 'Less', icon: '50%' },
                      { id: 'regular', label: isKhmer ? 'ធម្មតា' : 'Regular', icon: '100%' },
                      { id: 'extra', label: isKhmer ? 'ច្រើន' : 'Extra', icon: '120%' },
                    ]"
                    :key="ice.id"
                    type="button"
                    class="py-2 px-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5 border"
                    :class="selectedIce === ice.id
                      ? 'bg-teal-accent text-teal-darkText border-teal-accent font-bold shadow-sm scale-102'
                      : 'bg-[#2A1B14]/80 text-coffee-muted border-white/5 hover:text-white hover:border-white/15'"
                    @click="setIce(ice.id)"
                  >
                    <span>{{ ice.label }}</span>
                    <span class="text-[10px] opacity-75 font-mono">{{ ice.icon }}</span>
                  </button>
                </div>
              </div>

              <!-- 3. Sweetness / Sugar Level -->
              <div>
                <div class="flex items-center justify-between text-xs font-bold text-coffee-sand mb-2.5">
                  <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'កម្រិតផ្អែម (Sweetness):' : 'Sugar Level:' }}</span>
                  <span class="text-teal-accent font-mono text-[11px]">{{ selectedSweetness }}</span>
                </div>
                <div class="flex items-center justify-between gap-1 p-1 rounded-2xl bg-black/40 border border-white/10">
                  <button
                    v-for="sweet in ['0%', '25%', '50%', '75%', '100%']"
                    :key="sweet"
                    type="button"
                    class="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer"
                    :class="selectedSweetness === sweet
                      ? 'bg-coffee-sand text-[#1A1009] shadow-sm'
                      : 'text-coffee-muted hover:text-white hover:bg-white/5'"
                    @click="selectedSweetness = sweet"
                  >
                    {{ sweet }}
                  </button>
                </div>
              </div>

              <!-- 4. Interactive 3D Add-ons (Cream, Extra Shot, Toppings) -->
              <div class="space-y-2.5 pt-1">
                <span class="text-xs font-bold text-coffee-sand block" :class="isKhmer ? 'font-khmer' : ''">
                  {{ isKhmer ? 'បន្ថែមពិសេស (Add-ons):' : 'Special Add-ons:' }}
                </span>

                <div class="grid grid-cols-2 gap-2.5">
                  <!-- Whipped Cream Toggle -->
                  <button
                    type="button"
                    class="p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-center justify-between group"
                    :class="withCream
                      ? 'bg-amber-500/15 border-amber-500/40 text-white'
                      : 'bg-black/30 border-white/10 text-coffee-muted hover:border-white/20'"
                    @click="toggleCream"
                  >
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-coffee-sand flex items-center gap-1.5">
                        <span>🍦</span>
                        <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'ក្រែម Whip Cream' : 'Whipped Cream' }}</span>
                      </div>
                      <span class="text-[11px] text-teal-accent font-mono font-semibold">+ $0.50</span>
                    </div>
                    <div
                      class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
                      :class="withCream ? 'bg-amber-400 border-amber-400 text-black' : 'border-white/20'"
                    >
                      <Check v-if="withCream" class="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>

                  <!-- Extra Espresso Shot Toggle -->
                  <button
                    type="button"
                    class="p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-center justify-between group"
                    :class="withExtraShot
                      ? 'bg-teal-accent/15 border-teal-accent/40 text-white'
                      : 'bg-black/30 border-white/10 text-coffee-muted hover:border-white/20'"
                    @click="toggleExtraShot"
                  >
                    <div class="min-w-0">
                      <div class="text-xs font-bold text-coffee-sand flex items-center gap-1.5">
                        <span>☕</span>
                        <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'ថែមស្ហុតកាហ្វេ' : 'Extra Shot' }}</span>
                      </div>
                      <span class="text-[11px] text-teal-accent font-mono font-semibold">+ $0.60</span>
                    </div>
                    <div
                      class="w-5 h-5 rounded-full border flex items-center justify-center transition-colors"
                      :class="withExtraShot ? 'bg-teal-accent border-teal-accent text-black' : 'border-white/20'"
                    >
                      <Check v-if="withExtraShot" class="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                </div>

                <!-- Secondary Topping Toggles (Cocoa / Caramel) -->
                <div class="grid grid-cols-2 gap-2.5 pt-1">
                  <!-- Cocoa Dusting -->
                  <button
                    type="button"
                    class="px-3 py-2 rounded-xl text-left border text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-between"
                    :class="withCocoa ? 'bg-coffee-sand/20 border-coffee-sand/40 text-white' : 'bg-black/20 border-white/5 text-coffee-muted hover:text-white'"
                    @click="toggleCocoa"
                  >
                    <span :class="isKhmer ? 'font-khmer' : ''">✨ {{ isKhmer ? 'រោយម្សៅកាកាវ' : 'Cocoa Dusting' }}</span>
                    <span v-if="withCocoa" class="text-teal-accent font-bold">✓</span>
                  </button>

                  <!-- Caramel Drizzle -->
                  <button
                    type="button"
                    class="px-3 py-2 rounded-xl text-left border text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-between"
                    :class="withCaramel ? 'bg-coffee-sand/20 border-coffee-sand/40 text-white' : 'bg-black/20 border-white/5 text-coffee-muted hover:text-white'"
                    @click="toggleCaramel"
                  >
                    <span :class="isKhmer ? 'font-khmer' : ''">🍯 {{ isKhmer ? 'ទឹកការ៉ាមែល' : 'Caramel Drizzle' }}</span>
                    <span v-if="withCaramel" class="text-teal-accent font-bold">✓</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Bottom Action Bar: Quantity & Add to Cart -->
            <div class="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
              <!-- Quantity Stepper -->
              <div class="flex items-center gap-3 bg-black/40 rounded-full px-3 py-1.5 border border-white/10">
                <button
                  type="button"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-coffee-sand hover:text-white hover:bg-white/10 transition-colors active:scale-90"
                  :disabled="quantity <= 1"
                  @click="quantity = Math.max(1, quantity - 1)"
                >
                  <Minus class="w-3.5 h-3.5" />
                </button>
                <span class="text-sm font-black text-white min-w-4 text-center">
                  {{ quantity }}
                </span>
                <button
                  type="button"
                  class="w-7 h-7 rounded-full flex items-center justify-center text-coffee-sand hover:text-white hover:bg-white/10 transition-colors active:scale-90"
                  @click="quantity += 1"
                >
                  <Plus class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Big Order Button -->
              <button
                type="button"
                class="flex-1 py-3.5 px-6 rounded-full liquid-glass-button font-extrabold text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                :class="{ 'bg-emerald-500 scale-102': isOrderAdded }"
                @click="handleAddToCart"
              >
                <Check v-if="isOrderAdded" class="w-4 h-4 stroke-[3]" />
                <ShoppingBag v-else class="w-4 h-4" />
                <span :class="isKhmer ? 'font-khmer' : ''">
                  {{ isOrderAdded ? (isKhmer ? 'បានបញ្ចូល!' : 'Added!') : (isKhmer ? 'ដាក់កុម្ម៉ង់' : 'Add to Order') }}
                </span>
                <span>•</span>
                <span class="font-mono">{{ formattedTotalPrice }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

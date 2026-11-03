<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import {
  X,
  Star,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Check,
  Coffee,
  Eye,
  RotateCcw
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'
import type { CartCustomization } from '~/stores/cart'
import InteractiveGlassCup from './InteractiveGlassCup.vue'

const cartStore = useCartStore()
const { t, isKhmer } = useI18n()

// Active Product
const product = computed(() => cartStore.selectedProductForDetail)

// Customization State
const selectedSize = ref<'S' | 'M' | 'L'>('M')
const selectedIce = ref<'none' | 'less' | 'regular' | 'extra'>('regular')
const selectedSweetness = ref<string>('50%')
const withCream = ref(false)
const withExtraShot = ref(false)
const withCocoa = ref(false)
const withCaramel = ref(false)
const quantity = ref(1)

// Empty Cup vs Crafted Drink Preview Mode
const isCupEmpty = ref(false)

// Animation Triggers
const isEspressoPouring = ref(false)
const isOrderAdded = ref(false)

// 3D Tilt State
const tiltX = ref(0)
const tiltY = ref(0)

// Reset state when a new product opens
watch(
  () => cartStore.selectedProductForDetail,
  (newProduct) => {
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
      isCupEmpty.value = false
      isEspressoPouring.value = false
    }
  }
)

// Mouse 3D Tilt handlers with smooth physics
const handleMouseMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  const mouseX = e.clientX - (rect.left + rect.width / 2)
  const mouseY = e.clientY - (rect.top + rect.height / 2)

  tiltX.value = -Math.round((mouseY / (rect.height / 2)) * 12)
  tiltY.value = Math.round((mouseX / (rect.width / 2)) * 14)
}

const handleMouseLeave = () => {
  tiltX.value = 0
  tiltY.value = 0
}

// Interactive triggers
const setIce = (level: 'none' | 'less' | 'regular' | 'extra') => {
  isCupEmpty.value = false
  selectedIce.value = level
}

const toggleCream = () => {
  isCupEmpty.value = false
  withCream.value = !withCream.value
}

const toggleExtraShot = () => {
  isCupEmpty.value = false
  withExtraShot.value = !withExtraShot.value
  if (withExtraShot.value) {
    isEspressoPouring.value = true
    setTimeout(() => {
      isEspressoPouring.value = false
    }, 1200)
  }
}

const toggleCocoa = () => {
  isCupEmpty.value = false
  withCocoa.value = !withCocoa.value
}

const toggleCaramel = () => {
  isCupEmpty.value = false
  withCaramel.value = !withCaramel.value
}

// Reset / Empty cup toggle
const toggleEmptyCup = () => {
  isCupEmpty.value = !isCupEmpty.value
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

          <!-- LEFT COLUMN: Interactive Liquid Glass Cup & 3D Physics Showcase -->
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

            <!-- Top Tag: Rating Pill & Empty/Fill Interactive Switch -->
            <div class="w-full flex items-center justify-between z-20">
              <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full liquid-glass-pill text-xs font-bold text-white shadow-sm">
                <Star class="w-3.5 h-3.5 fill-[#EAA34B] text-[#EAA34B]" />
                <span>{{ product.rating.toFixed(1) }}</span>
                <span class="text-coffee-muted font-normal">({{ product.reviewsCount || 128 }})</span>
              </div>

              <!-- Interactive Empty/Filled Cup Toggle Pill -->
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border active:scale-95"
                :class="isCupEmpty
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm'
                  : 'bg-white/10 text-coffee-sand border-white/15 hover:bg-white/15'"
                @click="toggleEmptyCup"
              >
                <RotateCcw v-if="isCupEmpty" class="w-3.5 h-3.5 animate-spin-once" />
                <Eye v-else class="w-3.5 h-3.5 text-teal-accent" />
                <span :class="isKhmer ? 'font-khmer' : ''">
                  {{ isCupEmpty ? (isKhmer ? 'កែវទទេ (Empty)' : 'Empty Cup') : (isKhmer ? 'ភេសជ្ជៈពេញ' : 'Filled Cup') }}
                </span>
              </button>
            </div>

            <!-- 3D Spatial Cup Canvas with Transparent Glass Tumbler -->
            <div class="relative w-full my-4 z-10 flex items-center justify-center min-h-[340px]">
              <InteractiveGlassCup
                :product-id="product.id"
                :product-name="product.name"
                :size="selectedSize"
                :ice-level="selectedIce"
                :with-cream="withCream"
                :with-extra-shot="withExtraShot"
                :with-cocoa="withCocoa"
                :with-caramel="withCaramel"
                :is-pouring="isEspressoPouring"
                :tilt-x="tiltX"
                :tilt-y="tiltY"
                :is-empty="isCupEmpty"
              />
            </div>

            <!-- Bottom Spatial 3D Hint -->
            <div class="flex items-center gap-2 text-[11px] text-coffee-muted/70 z-20">
              <Sparkles class="w-3.5 h-3.5 text-teal-accent" />
              <span>{{ isKhmer ? 'អូសដើម្បីមើលមុំ 3D នៃកែវកែវថ្លា' : 'Hover / touch to tilt the glass cup in 3D' }}</span>
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
                    @click="selectedSize = size; isCupEmpty = false"
                  >
                    <span>{{ size }}</span>
                    <span class="text-[10px] font-normal opacity-80 font-mono">
                      {{ size === 'S' ? '8 oz' : size === 'M' ? '12 oz' : '16 oz' }}
                    </span>
                  </button>
                </div>
              </div>

              <!-- 2. Ice Selection with Animated Submerged 3D Cubes -->
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
                    ] as const"
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

              <!-- 4. Interactive 3D Add-ons (Whipped Cream, Extra Shot, Cocoa & Caramel Drizzle) -->
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
                      ? 'bg-amber-500/15 border-amber-500/40 text-white shadow-sm'
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
                      ? 'bg-teal-accent/15 border-teal-accent/40 text-white shadow-sm'
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

                <!-- Secondary Topping Toggles (Cocoa Powder / Caramel Drizzle) -->
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

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
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
  RotateCcw,
  Flame,
  Snowflake,
  ChevronDown,
  Droplets,
  Milk,
  Layers,
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'
import { useFlyToCart } from '~/composables/useFlyToCart'
import { use8DAudio } from '~/composables/use8DAudio'
import type { CartCustomization } from '~/stores/cart'
import ThreeIcedCoffeeCup from './ThreeIcedCoffeeCup.vue'
import AnimatedPrice from './ui/AnimatedPrice.vue'
import AnimatedCounter from './ui/AnimatedCounter.vue'
import SlidingSegmentedControl from './ui/SlidingSegmentedControl.vue'
import SpringCheckbox from './ui/SpringCheckbox.vue'

const cartStore = useCartStore()
const { t, isKhmer } = useI18n()
const { flyToCart } = useFlyToCart()
const { playAddToCart, playQuantityClick } = use8DAudio()

// Cached Active Product for smooth leave transitions
const product = ref<any>(null)
watch(
  () => cartStore.selectedProductForDetail,
  (newVal) => {
    if (newVal !== null && newVal !== undefined) {
      product.value = newVal
    }
  },
  { immediate: true }
)

// Customization State
const selectedSize = ref<'S' | 'M' | 'L'>('M')
const selectedTemp = ref<'hot' | 'iced'>('iced')
const selectedFlavor = ref<string>('classic')
const selectedMilk = ref<string>('whole')
const selectedIce = ref<'none' | 'less' | 'regular' | 'extra'>('regular')
const selectedSweetness = ref<string>('50%')

// Extras
const withCream = ref(false)
const withExtraShot = ref(false)
const withCocoa = ref(false)
const withCaramel = ref(false)
const withBakeryButter = ref(false)
const bakeryServingStyle = ref<'toasted' | 'fresh'>('toasted')
const quantity = ref(1)

// Empty Cup vs Crafted Drink Preview Mode
const isCupEmpty = ref(false)
const isOrderAdded = ref(false)
const isAddingToCart = ref(false)

// Section Accordion Collapsed States
const openSections = ref<Record<string, boolean>>({
  size: true,
  flavor: true,
  iceSweet: true,
  extras: true,
  notes: false,
})

const toggleSection = (section: string) => {
  openSections.value[section] = !openSections.value[section]
}

// Cup Showcase & Visual Refs for Flying Product Animation
const showcaseRef = ref<HTMLElement | null>(null)
const cupVisualRef = ref<HTMLElement | null>(null)

// Dynamic Ambient Glow Color based on product & selected variant
const ambientGlowColor = computed(() => {
  if (!product.value) return 'bg-amber-600/20'
  const id = product.value.id.toLowerCase()

  if (selectedFlavor.value === 'caramel') return 'bg-amber-500/30'
  if (selectedFlavor.value === 'vanilla') return 'bg-amber-200/20'
  if (selectedFlavor.value === 'hazelnut') return 'bg-amber-700/25'
  if (selectedFlavor.value === 'coconut') return 'bg-teal-300/20'

  if (id.includes('matcha')) return 'bg-emerald-500/25'
  if (id.includes('mocha')) return 'bg-amber-700/30'
  if (selectedTemp.value === 'iced' || id.includes('cold') || id.includes('iced')) return 'bg-teal-400/25'
  if (withCream.value) return 'bg-amber-400/25'
  return 'bg-[#EAA34B]/20'
})

const isDrinkIced = computed(() => {
  if (!product.value) return false
  if (product.value.category === 'bakery') return false
  return selectedTemp.value === 'iced' || product.value.id.includes('iced') || product.value.id.includes('cold') || product.value.category === 'iced'
})

// Smooth 3D Tilt State with Lerp Physics
const targetTiltX = ref(0)
const targetTiltY = ref(0)
const tiltX = ref(0)
const tiltY = ref(0)
let tiltFrameId: number | null = null

function updateTilt() {
  const lerpFactor = 0.12
  tiltX.value += (targetTiltX.value - tiltX.value) * lerpFactor
  tiltY.value += (targetTiltY.value - tiltY.value) * lerpFactor
  tiltFrameId = requestAnimationFrame(updateTilt)
}

// Reset & Barista "Build" Intro Sequence when a new product opens
let introTimers: ReturnType<typeof setTimeout>[] = []
function clearIntroTimers() {
  introTimers.forEach(id => clearTimeout(id))
  introTimers = []
}

watch(
  () => cartStore.selectedProductForDetail,
  (newProduct) => {
    clearIntroTimers()
    if (newProduct) {
      selectedSize.value = 'M'
      selectedFlavor.value = 'classic'
      selectedMilk.value = 'whole'
      selectedSweetness.value = '50%'
      quantity.value = 1
      isOrderAdded.value = false
      isAddingToCart.value = false
      withBakeryButter.value = false
      bakeryServingStyle.value = 'toasted'

      selectedTemp.value = 'iced'

      if (newProduct.category === 'bakery') {
        isCupEmpty.value = false
        return
      }

      // Initialize beverage fully poured, iced, and crafted immediately
      isCupEmpty.value = false
      selectedIce.value = 'regular'
      withCream.value = newProduct.id.includes('mocha') || newProduct.id.includes('cappuccino')
      withCocoa.value = newProduct.id.includes('cappuccino') || newProduct.id.includes('mocha')
      withCaramel.value = newProduct.id.includes('macchiato') || newProduct.id.includes('caramel')
    }
  }
)

// When customer switches between Hot & Iced Cold, automatically sync ice
watch(selectedTemp, (newTemp) => {
  if (newTemp === 'iced') {
    if (selectedIce.value === 'none') {
      selectedIce.value = 'regular'
    }
  } else if (newTemp === 'hot') {
    selectedIce.value = 'none'
  }
})

// Mouse & Touch 3D Tilt Handlers
const handleMouseMove = (e: MouseEvent) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = e.currentTarget as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  const mouseX = e.clientX - (rect.left + rect.width / 2)
  const mouseY = e.clientY - (rect.top + rect.height / 2)
  targetTiltX.value = -Math.max(-12, Math.min(12, (mouseY / (rect.height / 2)) * 12))
  targetTiltY.value = Math.max(-14, Math.min(14, (mouseX / (rect.width / 2)) * 14))
}

const handleMouseLeave = () => {
  targetTiltX.value = 0
  targetTiltY.value = 0
}

const handleTouchMove = (e: TouchEvent) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (!e.touches.length) return
  const touch = e.touches[0]
  const el = e.currentTarget as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  const touchX = touch.clientX - (rect.left + rect.width / 2)
  const touchY = touch.clientY - (rect.top + rect.height / 2)
  targetTiltX.value = -Math.max(-12, Math.min(12, (touchY / (rect.height / 2)) * 12))
  targetTiltY.value = Math.max(-14, Math.min(14, (touchX / (rect.width / 2)) * 14))
}

const handleTouchEnd = () => {
  targetTiltX.value = 0
  targetTiltY.value = 0
}

function handleOrientation(e: DeviceOrientationEvent) {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (e.gamma !== null && e.beta !== null) {
    targetTiltY.value = (Math.max(-20, Math.min(20, e.gamma)) / 20) * 12
    targetTiltX.value = -(Math.max(-20, Math.min(20, e.beta - 45)) / 20) * 10
  }
}

// Keyboard close
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && cartStore.isProductDetailOpen) close()
}

onMounted(() => {
  tiltFrameId = requestAnimationFrame(updateTilt)
  window.addEventListener('keydown', handleKeydown)
  if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation)
  }
})

onBeforeUnmount(() => {
  clearIntroTimers()
  if (tiltFrameId !== null) cancelAnimationFrame(tiltFrameId)
  if (typeof window !== 'undefined') {
    window.removeEventListener('deviceorientation', handleOrientation)
    window.removeEventListener('keydown', handleKeydown)
  }
})

// Interactive triggers
const toggleEmptyCup = () => {
  isCupEmpty.value = !isCupEmpty.value
}

// Dynamic Price Calculation
const unitPrice = computed(() => {
  if (!product.value) return 0
  let price = product.value.price
  if (selectedSize.value === 'S') price -= 0.30
  if (selectedSize.value === 'L') price += 0.50
  if (selectedFlavor.value !== 'classic') price += 0.40
  if (selectedMilk.value !== 'whole') price += 0.50
  if (withCream.value) price += 0.50
  if (withExtraShot.value) price += 0.60
  if (withCaramel.value) price += 0.25
  if (withBakeryButter.value) price += 0.40
  return Math.max(price, 0.50)
})

const totalPrice = computed(() => unitPrice.value * quantity.value)

// Dynamic Flavor options
const flavorOptions = computed(() => [
  { id: 'classic', label: isKhmer.value ? 'ដើម' : 'Classic', subtitle: '+$0.00' },
  { id: 'vanilla', label: isKhmer.value ? 'វ៉ានីឡា' : 'Vanilla', subtitle: '+$0.40' },
  { id: 'caramel', label: isKhmer.value ? 'ការ៉ាមែល' : 'Caramel', subtitle: '+$0.40' },
  { id: 'hazelnut', label: isKhmer.value ? 'ហាស្សែលណាត់' : 'Hazelnut', subtitle: '+$0.40' },
  { id: 'coconut', label: isKhmer.value ? 'ដូងលីង' : 'Coconut', subtitle: '+$0.40' },
])

// Milk options
const milkOptions = computed(() => [
  { id: 'whole', label: isKhmer.value ? 'ទឹកដោះគោស្រស់' : 'Whole Milk', subtitle: 'Standard' },
  { id: 'oat', label: isKhmer.value ? 'ទឹកដោះគោ Oat' : 'Oat Milk', subtitle: '+$0.50' },
  { id: 'almond', label: isKhmer.value ? 'អាល់ម៉ុន' : 'Almond Milk', subtitle: '+$0.50' },
])

// Size options
const sizeOptions = computed(() => [
  { id: 'S', label: 'S', subtitle: '8 oz (−$0.30)' },
  { id: 'M', label: 'M', subtitle: '12 oz (Regular)' },
  { id: 'L', label: 'L', subtitle: '16 oz (+$0.50)' },
])

// Ice options
const iceOptions = computed(() => [
  { id: 'none', label: isKhmer.value ? 'គ្មាន' : 'None', subtitle: '0 cubes' },
  { id: 'less', label: isKhmer.value ? 'តិច' : 'Less', subtitle: '5 cubes' },
  { id: 'regular', label: isKhmer.value ? 'ធម្មតា' : 'Regular', subtitle: '9 cubes' },
  { id: 'extra', label: isKhmer.value ? 'ច្រើន' : 'Extra', subtitle: '14 cubes' },
])

// Temperature options
const tempOptions = computed(() => [
  { id: 'iced', label: isKhmer.value ? 'ត្រជាក់ (Iced)' : 'Iced Cold', subtitle: '❄️ Chilled' },
  { id: 'hot', label: isKhmer.value ? 'ក្តៅ (Hot)' : 'Steamed Hot', subtitle: '☕ Warm' },
])

// Sweetness options
const sweetOptions = ['0%', '25%', '50%', '75%', '100%'].map(s => ({
  id: s,
  label: s,
}))

// Realistic Add to Cart with Flying Arc Animation
const handleAddToCart = async () => {
  if (!product.value || isAddingToCart.value) return
  isAddingToCart.value = true

  const toppings: string[] = []
  if (withCocoa.value) toppings.push('Cocoa Dust')
  if (withCaramel.value) toppings.push('Caramel Drizzle')
  if (withBakeryButter.value) toppings.push('French Butter')

  const customization: CartCustomization = {
    size: selectedSize.value,
    temperature: selectedTemp.value,
    flavor: selectedFlavor.value !== 'classic' ? selectedFlavor.value : undefined,
    milk: selectedMilk.value !== 'whole' ? selectedMilk.value : undefined,
    iceLevel: selectedIce.value !== 'none' ? `Ice: ${selectedIce.value}` : 'No Ice',
    sweetness: `Sugar: ${selectedSweetness.value}`,
    cream: withCream.value,
    extraShot: withExtraShot.value,
    toppings,
  }

  // 1. Play tactile spatial Add to Cart acoustic chime
  playAddToCart(0.5)

  // 2. Launch parabolic flying product animation directly from the cup
  const sourceElement = cupVisualRef.value || showcaseRef.value
  if (sourceElement) {
    flyToCart({
      sourceEl: sourceElement,
      imageSrc: product.value.image,
      glowColor: 'rgba(234, 163, 75, 0.45)',
      duration: 0.76,
    })
  }

  // 3. Commit to Pinia store
  cartStore.addCustomizedItem(product.value, customization, unitPrice.value, quantity.value)

  // 4. Tactile button state feedback
  isOrderAdded.value = true

  setTimeout(() => {
    isOrderAdded.value = false
    isAddingToCart.value = false
    cartStore.closeProductDetail()
  }, 780)
}

const close = () => {
  if (isAddingToCart.value) return
  cartStore.closeProductDetail()
}
</script>

<template>
  <ClientOnly>
    <teleport to="body">
      <!-- =====================================================
           BACKDROP — Soft, Natural Depth Blur Fade
           ===================================================== -->
      <Transition
        enter-active-class="transition-opacity duration-350 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-250 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="cartStore.isProductDetailOpen && product"
          class="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
          aria-hidden="true"
          @click="close"
        />
      </Transition>

      <!-- =====================================================
           MODAL / BOTTOM SHEET PANEL
           Responsive: Native Bottom-Sheet on mobile, Centered Dialog on desktop
           ===================================================== -->
      <Transition
        enter-active-class="transition-modal-enter"
        enter-from-class="modal-hidden"
        enter-to-class="modal-visible"
        leave-active-class="transition-modal-leave"
        leave-from-class="modal-visible"
        leave-to-class="modal-hidden"
      >
        <div
          v-if="cartStore.isProductDetailOpen && product"
          class="fixed inset-0 z-[60] flex items-end lg:items-center justify-center p-0 sm:p-4 lg:p-6 pointer-events-none"
          aria-modal="true"
          role="dialog"
          :aria-label="product?.name"
        >
          <!-- Modal Container -->
          <div
            class="relative w-full max-w-4xl rounded-t-[2.5rem] lg:rounded-[2.5rem] liquid-glass-modal flex flex-col lg:flex-row overflow-hidden shadow-2xl border border-white/15 pointer-events-auto max-h-[92dvh] lg:max-h-[90dvh]"
            @click.stop
          >
            <!-- Mobile Drag Handle Bar Indicator -->
            <div class="lg:hidden w-full flex items-center justify-center pt-3 pb-1 shrink-0">
              <div class="w-12 h-1.5 rounded-full bg-white/20" />
            </div>

            <!-- Close Button -->
            <button
              type="button"
              class="absolute top-4 sm:top-5 right-4 sm:right-5 z-40 p-2.5 rounded-full text-coffee-sand/80 hover:text-white bg-black/40 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer active:scale-90"
              @click="close"
              aria-label="Close product details"
            >
              <X class="w-5 h-5 transition-transform duration-200 hover:rotate-90" />
            </button>

            <!-- ================================================
                 LEFT COLUMN: Realistic 3D Showcase & Variant Preview
                 ================================================ -->
            <div
              ref="showcaseRef"
              class="lg:w-1/2 p-5 sm:p-7 flex flex-col items-center justify-between relative bg-gradient-to-b from-[#2B1D16]/70 via-[#1F140E]/85 to-[#120B07] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden select-none shrink-0 min-h-[330px] lg:min-h-auto"
            >
              <!-- Dynamic Ambient Spotlight -->
              <div
                class="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-0 opacity-70"
                :class="ambientGlowColor"
              />

              <!-- Physically Believable Floor Shadows (breathing with size) -->
              <div
                class="absolute bottom-9 rounded-[100%] bg-black/65 blur-md pointer-events-none -z-0 transition-all duration-300 ease-out"
                :style="{
                  width: `${selectedSize === 'S' ? 180 : selectedSize === 'M' ? 210 : 235}px`,
                  height: '36px',
                }"
              />
              <div
                class="absolute bottom-11 rounded-[100%] blur-lg pointer-events-none -z-0 transition-all duration-500"
                :class="ambientGlowColor"
                :style="{
                  width: `${selectedSize === 'S' ? 140 : selectedSize === 'M' ? 160 : 185}px`,
                  height: '24px',
                }"
              />

              <!-- Top Badges & Temperature Switcher -->
              <div class="w-full flex items-center justify-between z-20 gap-2 pr-10 lg:pr-0">
                <div class="flex items-center gap-2">
                  <!-- Rating Pill -->
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full liquid-glass-pill text-xs font-bold text-white shadow-sm border border-white/10">
                    <Star class="w-3.5 h-3.5 fill-[#EAA34B] text-[#EAA34B]" />
                    <span>{{ product.rating.toFixed(1) }}</span>
                    <span class="text-coffee-muted font-normal text-[11px]">({{ product.reviewsCount || 142 }})</span>
                  </div>

                  <!-- Temperature Badge -->
                  <div
                    v-if="product.category !== 'bakery'"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md transition-colors duration-300"
                    :class="isDrinkIced
                      ? 'bg-teal-500/15 text-teal-300 border-teal-400/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-400/30'"
                  >
                    <Snowflake v-if="isDrinkIced" class="w-3 h-3 text-teal-300" />
                    <Flame v-else class="w-3 h-3 text-amber-400" />
                    <span>{{ isDrinkIced ? (isKhmer ? 'ត្រជាក់' : 'Iced') : (isKhmer ? 'ក្តៅ' : 'Hot') }}</span>
                  </div>
                </div>

                <!-- Empty / Filled Re-craft Toggle -->
                <button
                  v-if="product.category !== 'bakery'"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border active:scale-95 shadow-sm"
                  :class="isCupEmpty
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50'
                    : 'bg-white/10 text-coffee-sand border-white/15 hover:bg-white/20'"
                  :title="isCupEmpty ? 'Re-craft beverage' : 'View empty glass'"
                  @click="toggleEmptyCup"
                >
                  <RotateCcw v-if="isCupEmpty" class="w-3.5 h-3.5 text-amber-300" />
                  <Eye v-else class="w-3.5 h-3.5 text-teal-accent" />
                  <span :class="isKhmer ? 'font-khmer' : ''">
                    {{ isCupEmpty ? (isKhmer ? 'កែវទទេ' : 'Empty Glass') : (isKhmer ? 'ភេសជ្ជៈពេញ' : 'Filled Cup') }}
                  </span>
                </button>
              </div>

              <!-- Product Visualizer Viewport with Smooth Crossfade -->
              <div
                ref="cupVisualRef"
                class="relative w-full my-auto z-10 flex items-center justify-center min-h-[280px] lg:min-h-[320px]"
              >
                <Transition name="product-crossfade" mode="out-in">
                  <!-- Bakery Item Presentation -->
                  <div
                    v-if="product.category === 'bakery'"
                    :key="`bakery-${product.id}`"
                    class="relative w-full h-64 sm:h-72 flex flex-col items-center justify-center"
                  >
                    <div class="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center group">
                      <div class="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />
                      <NuxtImg
                        :src="product.image"
                        :alt="product.name"
                        width="240"
                        height="240"
                        class="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  <!-- 8D WebGL 3D Interactive Coffee Canvas -->
                  <div
                    v-else
                    :key="`three-${product.id}`"
                    class="w-full flex items-center justify-center"
                  >
                    <ClientOnly>
                      <ThreeIcedCoffeeCup
                        :product-id="product.id"
                        :product-name="product.name"
                        :size="selectedSize"
                        :temperature="selectedTemp"
                        :ice-level="selectedIce"
                        :milk="selectedMilk"
                        :with-cream="withCream"
                        :with-extra-shot="withExtraShot"
                        :with-cocoa="withCocoa"
                        :with-caramel="withCaramel"
                        :sweetness="selectedSweetness"
                        :flavor="selectedFlavor"
                        :is-empty="isCupEmpty"
                      />
                    </ClientOnly>
                  </div>
                </Transition>
              </div>
            </div>

            <!-- ================================================
                 RIGHT COLUMN: Refined Customization Accordion
                 ================================================ -->
            <div class="lg:w-1/2 flex flex-col overflow-y-auto bg-[#1C120C]/90">
              <!-- Scrollable content -->
              <div class="flex-1 p-5 sm:p-7 space-y-5 overflow-y-auto scrollbar-thin">
                <!-- Title & Description Header -->
                <div class="pb-2 border-b border-white/10">
                  <div class="flex items-baseline justify-between gap-3">
                    <h2
                      class="text-2xl sm:text-3xl font-extrabold text-[#E5B588] tracking-tight"
                      :class="isKhmer ? 'font-khmer' : ''"
                    >
                      {{ product.name }}
                    </h2>
                    <span class="text-xs font-mono uppercase tracking-widest text-[#9C7F69] font-bold shrink-0">
                      {{ product.nameEn }}
                    </span>
                  </div>

                  <p
                    class="text-xs sm:text-[13px] text-coffee-muted leading-relaxed mt-2"
                    :class="isKhmer ? 'font-khmer' : ''"
                  >
                    {{ product.description }}
                  </p>
                </div>

                <!-- Customizer Sections (Drink Products) -->
                <div v-if="product.category !== 'bakery'" class="space-y-4">
                  <!-- SECTION 1: Size & Serving Temperature -->
                  <div class="rounded-2xl bg-black/30 border border-white/10 overflow-hidden shadow-inner">
                    <button
                      type="button"
                      class="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-coffee-sand hover:text-white transition-colors cursor-pointer"
                      @click="toggleSection('size')"
                    >
                      <div class="flex items-center gap-2">
                        <Layers class="w-4 h-4 text-teal-accent" />
                        <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'ទំហំកែវ និងកម្ដៅ' : 'Size & Temperature' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-[11px] font-mono text-teal-accent">Size {{ selectedSize }}</span>
                        <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="openSections.size ? 'rotate-180' : ''" />
                      </div>
                    </button>

                    <div
                      class="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      :class="openSections.size ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                    >
                      <div class="overflow-hidden px-4 pb-4 space-y-3.5">
                        <!-- Cup Size Sliding Segmented Control -->
                        <div>
                          <span class="text-[11px] text-coffee-muted font-medium mb-1.5 block">
                            {{ isKhmer ? 'ជ្រើសរើសទំហំ:' : 'Select Size:' }}
                          </span>
                          <SlidingSegmentedControl
                            v-model="selectedSize"
                            :options="sizeOptions"
                          />
                        </div>

                        <!-- Hot / Iced Temperature Switcher -->
                        <div>
                          <span class="text-[11px] text-coffee-muted font-medium mb-1.5 block">
                            {{ isKhmer ? 'កម្ដៅភេសជ្ជៈ:' : 'Serving Style:' }}
                          </span>
                          <SlidingSegmentedControl
                            v-model="selectedTemp"
                            :options="tempOptions"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- SECTION 2: Flavors & Milk Customization -->
                  <div class="rounded-2xl bg-black/30 border border-white/10 overflow-hidden shadow-inner">
                    <button
                      type="button"
                      class="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-coffee-sand hover:text-white transition-colors cursor-pointer"
                      @click="toggleSection('flavor')"
                    >
                      <div class="flex items-center gap-2">
                        <Droplets class="w-4 h-4 text-teal-accent" />
                        <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'រសជាតិស៊ីរ៉ូ និងទឹកដោះគោ' : 'Flavor Syrup & Milk' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-[11px] font-mono text-teal-accent capitalize">{{ selectedFlavor }}</span>
                        <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="openSections.flavor ? 'rotate-180' : ''" />
                      </div>
                    </button>

                    <div
                      class="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      :class="openSections.flavor ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                    >
                      <div class="overflow-hidden px-4 pb-4 space-y-3.5">
                        <!-- Flavor Syrup Selector -->
                        <div>
                          <span class="text-[11px] text-coffee-muted font-medium mb-1.5 block">
                            {{ isKhmer ? 'ស៊ីរ៉ូបន្ថែម:' : 'Flavor Profile (+ $0.40):' }}
                          </span>
                          <SlidingSegmentedControl
                            v-model="selectedFlavor"
                            :options="flavorOptions"
                          />
                        </div>

                        <!-- Milk Base Selector -->
                        <div>
                          <span class="text-[11px] text-coffee-muted font-medium mb-1.5 block">
                            {{ isKhmer ? 'ជម្រើសទឹកដោះគោ:' : 'Milk Alternative:' }}
                          </span>
                          <SlidingSegmentedControl
                            v-model="selectedMilk"
                            :options="milkOptions"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- SECTION 3: Ice Level & Sweetness Balance -->
                  <div class="rounded-2xl bg-black/30 border border-white/10 overflow-hidden shadow-inner">
                    <button
                      type="button"
                      class="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-coffee-sand hover:text-white transition-colors cursor-pointer"
                      @click="toggleSection('iceSweet')"
                    >
                      <div class="flex items-center gap-2">
                        <Snowflake class="w-4 h-4 text-teal-accent" />
                        <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'ទឹកកក និងកម្រិតផ្អែម' : 'Ice & Sweetness Balance' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-[11px] font-mono text-teal-accent">{{ selectedSweetness }} sugar</span>
                        <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="openSections.iceSweet ? 'rotate-180' : ''" />
                      </div>
                    </button>

                    <div
                      class="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      :class="openSections.iceSweet ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                    >
                      <div class="overflow-hidden px-4 pb-4 space-y-3.5">
                        <!-- Ice Level (if drink is iced) -->
                        <div v-if="isDrinkIced">
                          <span class="text-[11px] text-coffee-muted font-medium mb-1.5 block">
                            {{ isKhmer ? 'កម្រិតទឹកកក:' : 'Ice Level:' }}
                          </span>
                          <SlidingSegmentedControl
                            v-model="selectedIce"
                            :options="iceOptions"
                          />
                        </div>

                        <!-- Sweetness Percentage -->
                        <div>
                          <span class="text-[11px] text-coffee-muted font-medium mb-1.5 block">
                            {{ isKhmer ? 'កម្រិតជាតិស្ករ:' : 'Sweetness Level:' }}
                          </span>
                          <SlidingSegmentedControl
                            v-model="selectedSweetness"
                            :options="sweetOptions"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- SECTION 4: Barista Extras & Toppings -->
                  <div class="rounded-2xl bg-black/30 border border-white/10 overflow-hidden shadow-inner">
                    <button
                      type="button"
                      class="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-coffee-sand hover:text-white transition-colors cursor-pointer"
                      @click="toggleSection('extras')"
                    >
                      <div class="flex items-center gap-2">
                        <Sparkles class="w-4 h-4 text-teal-accent" />
                        <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'គ្រឿងបន្ថែមពិសេស (Barista Extras)' : 'Barista Extras & Toppings' }}</span>
                      </div>
                      <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="openSections.extras ? 'rotate-180' : ''" />
                    </button>

                    <div
                      class="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      :class="openSections.extras ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                    >
                      <div class="overflow-hidden px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <!-- Whipped Cream Checkbox -->
                        <SpringCheckbox
                          v-model="withCream"
                          :label="isKhmer ? 'ក្រែមវីប Whip' : 'Whipped Cream'"
                          price-extra="+$0.50"
                          icon-emoji="🍦"
                          active-color="amber"
                          @update:model-value="isCupEmpty = false"
                        />

                        <!-- Extra Espresso Shot Checkbox -->
                        <SpringCheckbox
                          v-model="withExtraShot"
                          :label="isKhmer ? 'ថែមស្ហុតកាហ្វេ' : 'Extra Shot'"
                          price-extra="+$0.60"
                          icon-emoji="☕"
                          active-color="teal"
                          @update:model-value="isCupEmpty = false"
                        />

                        <!-- Cocoa Dusting Checkbox -->
                        <SpringCheckbox
                          v-model="withCocoa"
                          :label="isKhmer ? 'រោយម្សៅកាកាវ' : 'Cocoa Dusting'"
                          price-extra="Free"
                          icon-emoji="✨"
                          active-color="amber"
                          @update:model-value="isCupEmpty = false"
                        />

                        <!-- Caramel Drizzle Checkbox -->
                        <SpringCheckbox
                          v-model="withCaramel"
                          :label="isKhmer ? 'ទឹកការ៉ាមែល' : 'Caramel Drizzle'"
                          price-extra="+$0.25"
                          icon-emoji="🍯"
                          active-color="amber"
                          @update:model-value="isCupEmpty = false"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- SECTION 5: Barista Composition Notes -->
                  <div v-if="product.composition" class="rounded-2xl bg-black/30 border border-white/10 overflow-hidden shadow-inner">
                    <button
                      type="button"
                      class="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-bold text-coffee-sand hover:text-white transition-colors cursor-pointer"
                      @click="toggleSection('notes')"
                    >
                      <div class="flex items-center gap-2">
                        <Coffee class="w-4 h-4 text-teal-accent" />
                        <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'រូបមន្តផ្សំប្រចាំហាង' : 'Barista Recipe Notes' }}</span>
                      </div>
                      <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="openSections.notes ? 'rotate-180' : ''" />
                    </button>

                    <div
                      class="grid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      :class="openSections.notes ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                    >
                      <div class="overflow-hidden px-4 pb-4">
                        <p class="text-xs text-[#D1B8A3] leading-relaxed font-medium" :class="isKhmer ? 'font-khmer' : ''">
                          {{ product.composition }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bakery Customizer Controls -->
                <div v-else class="space-y-4">
                  <div class="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 shadow-inner">
                    <span class="text-xs font-bold text-coffee-sand block" :class="isKhmer ? 'font-khmer' : ''">
                      {{ isKhmer ? 'សេវាកម្មដុតកម្ដៅ:' : 'Bakery Serving Option:' }}
                    </span>
                    <SlidingSegmentedControl
                      v-model="bakeryServingStyle"
                      :options="[
                        { id: 'toasted', label: isKhmer ? 'ដុតក្តៅៗ' : 'Warm Toasted', subtitle: 'Crispy & Flaky' },
                        { id: 'fresh', label: isKhmer ? 'សីតុណ្ហភាពបន្ទប់' : 'Room Temp', subtitle: 'Standard' },
                      ]"
                    />

                    <!-- Add Butter / Clotted Cream -->
                    <div class="pt-2">
                      <SpringCheckbox
                        v-model="withBakeryButter"
                        :label="isKhmer ? 'ប៊ឺបារាំងពិសេស' : 'French Clotted Butter'"
                        price-extra="+$0.40"
                        icon-emoji="🧈"
                        active-color="amber"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- =====================================================
                   STICKY BOTTOM ACTION BAR
                   ===================================================== -->
              <div class="p-4 sm:p-6 lg:px-8 lg:pb-8 pt-3 border-t border-white/10 flex items-center justify-between gap-3.5 shrink-0 bg-[#1C120C]/95 backdrop-blur-md">
                <!-- Quantity Stepper with Direction-aware Rolling Numbers -->
                <div class="flex items-center gap-2 bg-black/60 rounded-full px-3 py-1.5 border border-white/15 shadow-inner shrink-0">
                  <button
                    type="button"
                    class="w-7 h-7 rounded-full flex items-center justify-center text-coffee-sand hover:text-white hover:bg-white/15 transition-all duration-150 active:scale-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="quantity <= 1 || isAddingToCart"
                    @click="quantity > 1 && (quantity -= 1, playQuantityClick('down'))"
                    aria-label="Decrease quantity"
                  >
                    <Minus class="w-3.5 h-3.5" />
                  </button>

                  <AnimatedCounter :value="quantity" />

                  <button
                    type="button"
                    class="w-7 h-7 rounded-full flex items-center justify-center text-coffee-sand hover:text-white hover:bg-white/15 transition-all duration-150 active:scale-90 cursor-pointer disabled:opacity-40"
                    :disabled="isAddingToCart"
                    @click="quantity += 1, playQuantityClick('up')"
                    aria-label="Increase quantity"
                  >
                    <Plus class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Add to Order Button with Parabolic Flight Trigger -->
                <button
                  type="button"
                  class="flex-1 py-3.5 px-6 rounded-full font-black text-xs sm:text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 select-none will-change-transform"
                  :class="isOrderAdded
                    ? 'bg-emerald-500 text-white scale-[1.02] shadow-emerald-500/40'
                    : 'liquid-glass-button'"
                  :disabled="isAddingToCart"
                  @click="handleAddToCart"
                >
                  <Check v-if="isOrderAdded" class="w-4 h-4 stroke-[3] shrink-0 animate-scaleIn" />
                  <ShoppingBag v-else class="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />

                  <span :class="isKhmer ? 'font-khmer' : ''">
                    {{ isOrderAdded ? (isKhmer ? 'បានបញ្ចូល!' : 'Added!') : (isKhmer ? 'ដាក់កុម្ម៉ង់' : 'Add to Order') }}
                  </span>

                  <span class="opacity-60">•</span>

                  <!-- Smooth Animated Price Tween -->
                  <AnimatedPrice :value="totalPrice" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </teleport>
  </ClientOnly>
</template>

<style scoped>
/* =========================================================
   Realistic Modal / Bottom-Sheet Transitions
   Desktop: Smooth spring scale & soft fade
   Mobile: Native bottom sheet slide-up
   ========================================================= */
.transition-modal-enter {
  transition:
    opacity 0.38s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
}

.transition-modal-leave {
  transition:
    opacity 0.24s cubic-bezier(0.4, 0, 1, 1),
    transform 0.24s cubic-bezier(0.4, 0, 1, 1);
}

/* Desktop dialog styling */
.modal-hidden {
  opacity: 0;
  transform: scale(0.95) translateY(18px);
}

.modal-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* Mobile bottom sheet translation */
@media (max-width: 1023px) {
  .modal-hidden {
    opacity: 0;
    transform: translateY(100%);
  }
  .modal-visible {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Product crossfade transitions between variants */
.product-crossfade-enter-active,
.product-crossfade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.product-crossfade-enter-from {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
}

.product-crossfade-leave-to {
  opacity: 0;
  transform: scale(1.02) translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .transition-modal-enter,
  .transition-modal-leave,
  .product-crossfade-enter-active,
  .product-crossfade-leave-active {
    transition: opacity 0.15s ease-out !important;
    transform: none !important;
  }
}

/* Thin scrollbar for customizer column */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: #4E3A2F transparent;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #4E3A2F;
  border-radius: 2px;
}
</style>

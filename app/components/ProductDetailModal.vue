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
} from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'
import type { CartCustomization } from '~/stores/cart'
import InteractiveGlassCup from './InteractiveGlassCup.vue'

const cartStore = useCartStore()
const { t, isKhmer } = useI18n()

// Cached Active Product — only ever written with a non-null value so that child
// components (InteractiveGlassCup, NuxtImg, etc.) always have valid props during
// the exit transition. Vue's v-if gate handles actual unmounting.
const product = ref<any>(null)
watch(
  () => cartStore.selectedProductForDetail,
  (newVal) => {
    // Never set to null — the cached value keeps child vnodes stable while the
    // leave transition plays. Once isProductDetailOpen is false the whole subtree
    // is removed by v-if and the stale value no longer matters.
    if (newVal !== null && newVal !== undefined) {
      product.value = newVal
    }
  },
  { immediate: true }
)

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
const pricePulse = ref(false)

// Trigger pulse on price/option change
watch([selectedSize, selectedIce, withCream, withExtraShot, withCaramel, quantity], () => {
  pricePulse.value = true
  setTimeout(() => { pricePulse.value = false }, 280)
})

// Dynamic Ambient Glow Color
const ambientGlowColor = computed(() => {
  if (!product.value) return 'bg-amber-600/20'
  const id = product.value.id.toLowerCase()
  if (id.includes('matcha')) return 'bg-emerald-500/25'
  if (id.includes('mocha')) return 'bg-amber-700/30'
  if (id.includes('cold') || id.includes('iced')) return 'bg-teal-400/25'
  if (withCream.value) return 'bg-amber-400/25'
  return 'bg-[#EAA34B]/20'
})

const isDrinkIced = computed(() => {
  if (!product.value) return false
  return product.value.id.includes('iced') || product.value.id.includes('cold') || product.value.category === 'iced'
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
      selectedSweetness.value = '50%'
      quantity.value = 1
      isOrderAdded.value = false
      isEspressoPouring.value = false

      if (newProduct.category === 'bakery') {
        isCupEmpty.value = false
        return
      }

      // 1. Start with clean empty glass
      isCupEmpty.value = true
      selectedIce.value = 'none'
      withCream.value = false
      withExtraShot.value = false
      withCocoa.value = false
      withCaramel.value = false

      // 2. Liquid fills in
      const t1 = setTimeout(() => { isCupEmpty.value = false }, 100)
      // 3. Drop default ice
      const isIced = newProduct.id.includes('iced') || newProduct.id.includes('cold') || newProduct.category === 'iced'
      const t2 = setTimeout(() => { selectedIce.value = isIced ? 'regular' : 'none' }, 280)
      // 4. Barista default toppings
      const t3 = setTimeout(() => {
        withCream.value = newProduct.id.includes('mocha')
        withCocoa.value = newProduct.id.includes('cappuccino')
        withCaramel.value = newProduct.id.includes('macchiato')
      }, 540)

      introTimers.push(t1, t2, t3)
    }
  }
)

// Mouse & Touch 3D Tilt Handlers
const handleMouseMove = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  const mouseX = e.clientX - (rect.left + rect.width / 2)
  const mouseY = e.clientY - (rect.top + rect.height / 2)
  targetTiltX.value = -Math.max(-14, Math.min(14, (mouseY / (rect.height / 2)) * 14))
  targetTiltY.value = Math.max(-16, Math.min(16, (mouseX / (rect.width / 2)) * 16))
}

const handleMouseLeave = () => {
  targetTiltX.value = 0
  targetTiltY.value = 0
}

const handleTouchMove = (e: TouchEvent) => {
  if (!e.touches.length) return
  const touch = e.touches[0]
  const el = e.currentTarget as HTMLElement
  if (!el) return
  const rect = el.getBoundingClientRect()
  const touchX = touch.clientX - (rect.left + rect.width / 2)
  const touchY = touch.clientY - (rect.top + rect.height / 2)
  targetTiltX.value = -Math.max(-14, Math.min(14, (touchY / (rect.height / 2)) * 14))
  targetTiltY.value = Math.max(-16, Math.min(16, (touchX / (rect.width / 2)) * 16))
}

const handleTouchEnd = () => {
  targetTiltX.value = 0
  targetTiltY.value = 0
}

// Device Orientation Tilt
function handleOrientation(e: DeviceOrientationEvent) {
  if (e.gamma !== null && e.beta !== null) {
    targetTiltY.value = (Math.max(-25, Math.min(25, e.gamma)) / 25) * 14
    targetTiltX.value = -(Math.max(-25, Math.min(25, e.beta - 45)) / 25) * 12
  }
}

function initDeviceOrientation() {
  if (!import.meta.client || typeof window === 'undefined') return
  if (window.DeviceOrientationEvent) {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      const requestPerm = () => {
        ;(DeviceOrientationEvent as any).requestPermission()
          .then((permissionState: string) => {
            if (permissionState === 'granted') window.addEventListener('deviceorientation', handleOrientation)
          })
          .catch(() => {})
        window.removeEventListener('click', requestPerm)
      }
      window.addEventListener('click', requestPerm, { once: true })
    } else {
      window.addEventListener('deviceorientation', handleOrientation)
    }
  }
}

// Keyboard close
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && cartStore.isProductDetailOpen) close()
}

onMounted(() => {
  tiltFrameId = requestAnimationFrame(updateTilt)
  initDeviceOrientation()
  window.addEventListener('keydown', handleKeydown)
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
const setIce = (level: 'none' | 'less' | 'regular' | 'extra') => {
  isCupEmpty.value = false
  selectedIce.value = level
}

const setSweetness = (sweet: string) => {
  isCupEmpty.value = false
  selectedSweetness.value = sweet
}

const toggleCream = () => { isCupEmpty.value = false; withCream.value = !withCream.value }
const toggleExtraShot = () => {
  isCupEmpty.value = false
  withExtraShot.value = !withExtraShot.value
  if (withExtraShot.value) {
    isEspressoPouring.value = true
    setTimeout(() => { isEspressoPouring.value = false }, 1200)
  }
}
const toggleCocoa = () => { isCupEmpty.value = false; withCocoa.value = !withCocoa.value }
const toggleCaramel = () => { isCupEmpty.value = false; withCaramel.value = !withCaramel.value }
const toggleEmptyCup = () => { isCupEmpty.value = !isCupEmpty.value }

// Dynamic Price
const unitPrice = computed(() => {
  if (!product.value) return 0
  let price = product.value.price
  if (selectedSize.value === 'S') price -= 0.30
  if (selectedSize.value === 'L') price += 0.50
  if (withCream.value) price += 0.50
  if (withExtraShot.value) price += 0.60
  if (withCaramel.value) price += 0.25
  return Math.max(price, 0.50)
})

const totalPrice = computed(() => unitPrice.value * quantity.value)
const formattedTotalPrice = computed(() => `$${totalPrice.value.toFixed(2)}`)

// Sweetness label
const sweetnessLabel = computed(() => {
  const km = isKhmer.value
  switch (selectedSweetness.value) {
    case '0%':   return km ? 'ឥតស្ករ (Sugar-Free)' : 'Sugar-Free (0%)'
    case '25%':  return km ? 'ផ្អែមតិច (Light)' : 'Light Sweet (25%)'
    case '50%':  return km ? 'ផ្អែមល្មម (Balanced)' : 'Balanced (50%)'
    case '75%':  return km ? 'ផ្អែមច្រើន (Sweet)' : 'Sweet (75%)'
    case '100%': return km ? 'ផ្អែមខ្លាំង (Extra)' : 'Extra Sweet (100%)'
    default:     return selectedSweetness.value
  }
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

const close = () => cartStore.closeProductDetail()
</script>

<template>
  <ClientOnly>
    <teleport to="body">
      <!-- =====================================================
           BACKDROP — handles fade in/out of the overlay
           ===================================================== -->
      <Transition
        enter-active-class="transition-opacity duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-250 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="cartStore.isProductDetailOpen && product"
          class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
          @click="close"
        />
      </Transition>

      <!-- =====================================================
           MODAL PANEL — separate transition for panel motion
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
          class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 pointer-events-none"
          aria-modal="true"
          role="dialog"
          :aria-label="product?.name"
        >
          <!-- Modal Container -->
          <div
            class="relative w-full max-w-4xl rounded-[2.5rem] liquid-glass-modal flex flex-col lg:flex-row overflow-hidden shadow-2xl border border-white/15 pointer-events-auto max-h-[95dvh]"
            @click.stop
          >
            <!-- Close Button -->
            <button
              type="button"
              class="absolute top-5 right-5 z-40 p-2.5 rounded-full text-coffee-sand/80 hover:text-white bg-black/30 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer active:scale-90"
              @click="close"
              aria-label="Close product details"
            >
              <X class="w-5 h-5 transition-transform duration-200 hover:rotate-90" />
            </button>

            <!-- ================================================
                 LEFT COLUMN: Interactive 3D Drink Showcase
                 ================================================ -->
            <div
              class="lg:w-1/2 p-6 sm:p-8 flex flex-col items-center justify-between relative bg-gradient-to-b from-[#2B1D16]/60 via-[#1F140E]/80 to-[#120B07] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden cursor-grab active:cursor-grabbing select-none shrink-0"
              @mousemove="handleMouseMove"
              @mouseleave="handleMouseLeave"
              @touchmove.passive="handleTouchMove"
              @touchend="handleTouchEnd"
              @touchcancel="handleTouchEnd"
            >
              <!-- Ambient Radial Spotlight -->
              <div
                class="absolute w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-700 -z-0 opacity-70"
                :class="ambientGlowColor"
              />
              <!-- Caustic floor shadow -->
              <div class="absolute bottom-10 w-52 h-10 rounded-[100%] bg-black/60 blur-md pointer-events-none -z-0" />
              <div class="absolute bottom-12 w-40 h-6 rounded-[100%] bg-amber-500/10 blur-lg pointer-events-none -z-0" />

              <!-- Top Badges -->
              <div class="w-full flex items-center justify-between z-20 gap-2">
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
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md"
                    :class="isDrinkIced
                      ? 'bg-teal-500/15 text-teal-300 border-teal-400/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-400/30'"
                  >
                    <Snowflake v-if="isDrinkIced" class="w-3 h-3 text-teal-300" />
                    <Flame v-else class="w-3 h-3 text-amber-400" />
                    <span>{{ isDrinkIced ? (isKhmer ? 'ត្រជាក់' : 'Iced') : (isKhmer ? 'ក្តៅ' : 'Hot') }}</span>
                  </div>
                </div>

                <!-- Empty/Filled Toggle -->
                <button
                  type="button"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border active:scale-95 shadow-sm"
                  :class="isCupEmpty
                    ? 'bg-amber-500/25 text-amber-200 border-amber-400/50'
                    : 'bg-white/10 text-coffee-sand border-white/15 hover:bg-white/20'"
                  :title="isCupEmpty ? 'Re-craft beverage' : 'View empty glass'"
                  @click="toggleEmptyCup"
                >
                  <RotateCcw v-if="isCupEmpty" class="w-3.5 h-3.5 text-amber-300 animate-spin-once" />
                  <Eye v-else class="w-3.5 h-3.5 text-teal-accent" />
                  <span :class="isKhmer ? 'font-khmer' : ''">
                    {{ isCupEmpty ? (isKhmer ? 'កែវទទេ' : 'Empty Glass') : (isKhmer ? 'ភេសជ្ជៈពេញ' : 'Crafted Cup') }}
                  </span>
                </button>
              </div>

              <!-- 3D Cup Viewport -->
              <div class="relative w-full my-4 z-10 flex items-center justify-center min-h-[300px]">
                <!-- Bakery Display -->
                <div
                  v-if="product.category === 'bakery'"
                  class="relative w-full h-72 flex flex-col items-center justify-center"
                >
                  <div class="relative w-60 h-60 flex items-center justify-center group">
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

                <!-- Interactive Glass Cup -->
                <InteractiveGlassCup
                  v-else
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
                  :sweetness="selectedSweetness"
                />
              </div>

              <!-- 3D Hint Badge -->
              <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] text-coffee-sand/80 backdrop-blur-md z-20 shadow-sm">
                <Sparkles class="w-3.5 h-3.5 text-teal-accent animate-pulse" />
                <span>{{ isKhmer ? 'អូស ឬបង្វិលទូរសព្ទដើម្បីមើលមុំ 3D' : 'Drag or tilt phone to inspect in 3D' }}</span>
              </div>
            </div>

            <!-- ================================================
                 RIGHT COLUMN: Customization Panel
                 ================================================ -->
            <div class="lg:w-1/2 flex flex-col overflow-y-auto bg-[#1C120C]/90">
              <!-- Scrollable content -->
              <div class="flex-1 p-6 sm:p-8 space-y-5 overflow-y-auto scrollbar-thin">
                <!-- Title & Description -->
                <div>
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

                  <!-- Barista Composition Notes -->
                  <div v-if="product.composition" class="mt-3.5 p-3 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-2.5 shadow-inner">
                    <Coffee class="w-4 h-4 text-teal-accent shrink-0 mt-0.5" />
                    <p class="text-xs text-[#D1B8A3] leading-normal font-medium" :class="isKhmer ? 'font-khmer' : ''">
                      {{ product.composition }}
                    </p>
                  </div>
                </div>

                <!-- Customizer Controls (drinks only) -->
                <div v-if="product.category !== 'bakery'" class="space-y-5">
                  <!-- 1. Size -->
                  <div>
                    <div class="flex items-center justify-between text-xs font-bold text-coffee-sand mb-2">
                      <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'ទំហំកែវ:' : 'Cup Size:' }}</span>
                      <span class="text-teal-accent font-mono text-[11px]">
                        {{ selectedSize === 'S' ? 'Small 8 oz (−$0.30)' : selectedSize === 'M' ? 'Regular 12 oz' : 'Large 16 oz (+$0.50)' }}
                      </span>
                    </div>
                    <div class="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
                      <button
                        v-for="size in (['S', 'M', 'L'] as const)"
                        :key="size"
                        type="button"
                        class="py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
                        :class="selectedSize === size
                          ? 'liquid-glass-button text-teal-darkText shadow-md scale-[1.02]'
                          : 'text-coffee-muted hover:text-white hover:bg-white/5'"
                        @click="selectedSize = size; isCupEmpty = false"
                      >
                        <span>{{ size }}</span>
                        <span class="text-[10px] font-normal opacity-85 font-mono">
                          {{ size === 'S' ? '8 oz' : size === 'M' ? '12 oz' : '16 oz' }}
                        </span>
                      </button>
                    </div>
                  </div>

                  <!-- 2. Ice Level -->
                  <div>
                    <div class="flex items-center justify-between text-xs font-bold text-coffee-sand mb-2">
                      <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'កម្រិតទឹកកក:' : 'Ice Level:' }}</span>
                      <span class="text-teal-accent text-[11px] font-mono">
                        {{ selectedIce === 'none' ? '0 cubes' : selectedIce === 'less' ? '3 cubes' : selectedIce === 'regular' ? '5 cubes' : '7 cubes' }}
                      </span>
                    </div>
                    <div class="grid grid-cols-4 gap-2">
                      <button
                        v-for="ice in [
                          { id: 'none' as const,    label: isKhmer ? 'គ្មាន' : 'None',    icon: '0' },
                          { id: 'less' as const,    label: isKhmer ? 'តិច' : 'Less',      icon: '3' },
                          { id: 'regular' as const, label: isKhmer ? 'ធម្មតា' : 'Reg',    icon: '5' },
                          { id: 'extra' as const,   label: isKhmer ? 'ច្រើន' : 'Extra',   icon: '7' },
                        ]"
                        :key="ice.id"
                        type="button"
                        class="py-2.5 px-1 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5 border active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
                        :class="selectedIce === ice.id
                          ? 'bg-teal-accent text-teal-darkText border-teal-accent font-extrabold shadow-md scale-[1.02]'
                          : 'bg-[#261811] text-coffee-muted border-white/5 hover:text-white hover:border-white/15'"
                        @click="setIce(ice.id)"
                      >
                        <span>{{ ice.label }}</span>
                        <span class="text-[10px] opacity-80 font-mono">{{ ice.icon }}</span>
                      </button>
                    </div>
                  </div>

                  <!-- 3. Sweetness -->
                  <div>
                    <div class="flex items-center justify-between text-xs font-bold text-coffee-sand mb-2">
                      <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'កម្រិតផ្អែម:' : 'Sweetness:' }}</span>
                      <span class="text-teal-accent font-mono text-[11px]">{{ sweetnessLabel }}</span>
                    </div>
                    <div class="flex items-center justify-between gap-1 p-1.5 rounded-2xl bg-black/50 border border-white/10 shadow-inner">
                      <button
                        v-for="sweet in ['0%', '25%', '50%', '75%', '100%']"
                        :key="sweet"
                        type="button"
                        class="flex-1 py-1.5 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
                        :class="selectedSweetness === sweet
                          ? 'bg-coffee-sand text-[#1A1009] shadow-md'
                          : 'text-coffee-muted hover:text-white hover:bg-white/5'"
                        @click="setSweetness(sweet)"
                      >
                        {{ sweet }}
                      </button>
                    </div>
                  </div>

                  <!-- 4. Barista Add-ons -->
                  <div class="space-y-2.5">
                    <span class="text-xs font-bold text-coffee-sand block" :class="isKhmer ? 'font-khmer' : ''">
                      {{ isKhmer ? 'បន្ថែមពិសេស:' : 'Barista Add-ons:' }}
                    </span>

                    <div class="grid grid-cols-2 gap-2.5">
                      <!-- Whipped Cream -->
                      <button
                        type="button"
                        class="p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
                        :class="withCream
                          ? 'bg-amber-500/20 border-amber-400/50 text-white shadow-md ring-1 ring-amber-400/30'
                          : 'bg-black/35 border-white/10 text-coffee-muted hover:border-white/20 hover:text-white'"
                        @click="toggleCream"
                      >
                        <div class="min-w-0">
                          <div class="text-xs font-bold text-coffee-sand flex items-center gap-1.5">
                            <span class="text-base">🍦</span>
                            <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'ក្រែម Whip' : 'Whip Cream' }}</span>
                          </div>
                          <span class="text-[11px] text-teal-accent font-mono font-bold">+ $0.50</span>
                        </div>
                        <div
                          class="w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0"
                          :class="withCream ? 'bg-amber-400 border-amber-400 text-black shadow-sm' : 'border-white/20'"
                        >
                          <Check v-if="withCream" class="w-3 h-3 stroke-[3]" />
                        </div>
                      </button>

                      <!-- Extra Espresso Shot -->
                      <button
                        type="button"
                        class="p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
                        :class="withExtraShot
                          ? 'bg-teal-accent/20 border-teal-accent/50 text-white shadow-md ring-1 ring-teal-accent/30'
                          : 'bg-black/35 border-white/10 text-coffee-muted hover:border-white/20 hover:text-white'"
                        @click="toggleExtraShot"
                      >
                        <div class="min-w-0">
                          <div class="text-xs font-bold text-coffee-sand flex items-center gap-1.5">
                            <span class="text-base">☕</span>
                            <span :class="isKhmer ? 'font-khmer' : ''">{{ isKhmer ? 'ថែមស្ហុតកាហ្វេ' : 'Extra Shot' }}</span>
                          </div>
                          <span class="text-[11px] text-teal-accent font-mono font-bold">+ $0.60</span>
                        </div>
                        <div
                          class="w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 shrink-0"
                          :class="withExtraShot ? 'bg-teal-accent border-teal-accent text-black shadow-sm' : 'border-white/20'"
                        >
                          <Check v-if="withExtraShot" class="w-3 h-3 stroke-[3]" />
                        </div>
                      </button>

                      <!-- Cocoa Dusting -->
                      <button
                        type="button"
                        class="p-2.5 rounded-xl text-left border text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
                        :class="withCocoa
                          ? 'bg-amber-600/20 border-amber-500/40 text-white shadow-sm'
                          : 'bg-black/25 border-white/10 text-coffee-muted hover:text-white hover:border-white/20'"
                        @click="toggleCocoa"
                      >
                        <span :class="isKhmer ? 'font-khmer' : ''">✨ {{ isKhmer ? 'រោយម្សៅកាកាវ' : 'Cocoa Dusting' }}</span>
                        <span v-if="withCocoa" class="text-teal-accent font-bold ml-2 shrink-0">✓</span>
                      </button>

                      <!-- Caramel Drizzle -->
                      <button
                        type="button"
                        class="p-2.5 rounded-xl text-left border text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
                        :class="withCaramel
                          ? 'bg-amber-600/20 border-amber-500/40 text-white shadow-sm'
                          : 'bg-black/25 border-white/10 text-coffee-muted hover:text-white hover:border-white/20'"
                        @click="toggleCaramel"
                      >
                        <div class="flex items-center gap-1 min-w-0">
                          <span :class="isKhmer ? 'font-khmer' : ''">🍯 {{ isKhmer ? 'ទឹកការ៉ាមែល' : 'Caramel Drizzle' }}</span>
                          <span class="text-[10px] text-teal-accent font-mono font-semibold shrink-0">+$0.25</span>
                        </div>
                        <span v-if="withCaramel" class="text-teal-accent font-bold ml-2 shrink-0">✓</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Bakery Serving Option -->
                <div v-else class="py-4">
                  <div class="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2 shadow-inner">
                    <span class="text-xs font-bold text-coffee-sand block" :class="isKhmer ? 'font-khmer' : ''">
                      {{ isKhmer ? 'សេវាកម្មដុតកម្ដៅ:' : 'Bakery Serving Option:' }}
                    </span>
                    <p class="text-xs text-[#D1B8A3] leading-relaxed" :class="isKhmer ? 'font-khmer' : ''">
                      {{ isKhmer ? 'នំប៉័ងដុតក្តៅៗថ្មីៗពីចង្ក្រាន ស្រួយស្រទាប់ខាងក្រៅ និងឈ្ងុយប៊័រខាងក្នុង ជូនលោកអ្នកភ្លាមៗ។' : 'Freshly toasted warm upon request for maximum flakiness and aroma.' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- =====================================================
                   STICKY BOTTOM ACTION BAR
                   ===================================================== -->
              <div class="p-6 sm:px-8 sm:pb-8 pt-4 border-t border-white/10 flex items-center justify-between gap-4 shrink-0 bg-[#1C120C]/95 backdrop-blur-sm">
                <!-- Quantity Stepper -->
                <div class="flex items-center gap-2.5 bg-black/50 rounded-full px-3 py-1.5 border border-white/15 shadow-inner shrink-0">
                  <button
                    type="button"
                    class="w-7 h-7 rounded-full flex items-center justify-center text-coffee-sand hover:text-white hover:bg-white/15 transition-all duration-150 active:scale-90 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="quantity <= 1"
                    @click="quantity = Math.max(1, quantity - 1)"
                    aria-label="Decrease quantity"
                  >
                    <Minus class="w-3.5 h-3.5" />
                  </button>
                  <span class="text-sm font-black text-white min-w-5 text-center font-mono tabular-nums">
                    {{ quantity }}
                  </span>
                  <button
                    type="button"
                    class="w-7 h-7 rounded-full flex items-center justify-center text-coffee-sand hover:text-white hover:bg-white/15 transition-all duration-150 active:scale-90 cursor-pointer"
                    @click="quantity += 1"
                    aria-label="Increase quantity"
                  >
                    <Plus class="w-3.5 h-3.5" />
                  </button>
                </div>

                <!-- Add to Order Button -->
                <button
                  type="button"
                  class="flex-1 py-3.5 px-6 rounded-full font-black text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2 active:scale-95 transition-all duration-300 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  :class="isOrderAdded
                    ? 'bg-emerald-500 text-white scale-[1.02] shadow-emerald-500/30'
                    : 'liquid-glass-button'"
                  @click="handleAddToCart"
                >
                  <Check v-if="isOrderAdded" class="w-4 h-4 stroke-[3] shrink-0" />
                  <ShoppingBag v-else class="w-4 h-4 shrink-0" />
                  <span :class="isKhmer ? 'font-khmer' : ''">
                    {{ isOrderAdded ? (isKhmer ? 'បានបញ្ចូល!' : 'Added!') : (isKhmer ? 'ដាក់កុម្ម៉ង់' : 'Add to Order') }}
                  </span>
                  <span class="opacity-60">•</span>
                  <span
                    class="font-mono transition-all duration-300 inline-block tabular-nums"
                    :class="pricePulse ? 'scale-110 text-white font-bold' : ''"
                  >
                    {{ formattedTotalPrice }}
                  </span>
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
   Modal enter/leave transitions — smooth scale + fade + slide
   ========================================================= */
.transition-modal-enter {
  transition:
    opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.transition-modal-leave {
  transition:
    opacity 0.22s cubic-bezier(0.4, 0, 1, 1),
    transform 0.22s cubic-bezier(0.4, 0, 1, 1);
}

.modal-hidden {
  opacity: 0;
  transform: scale(0.96) translateY(16px);
}

.modal-visible {
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* =========================================================
   Right column thin scrollbar
   ========================================================= */
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

/* Spin-once animation for the RotateCcw icon */
@keyframes spinOnce {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.animate-spin-once {
  animation: spinOnce 0.55s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Trash2, Plus, Minus, ShoppingBag, CheckCircle, ArrowRight, Utensils, Bike, Coffee, Clock, Receipt } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'
import { use8DAudio } from '~/composables/use8DAudio'

const cartStore = useCartStore()
const { t, isKhmer } = useI18n()
const { playOrderSuccess, playQuantityClick } = use8DAudio()

const sugarLevels = ['100%', '70%', '50%', '0%']
const iceLevels = ['Normal', 'Less Ice', 'No Ice']

const handleCheckout = () => {
  playOrderSuccess()
  cartStore.checkout()
}

const closeAndReset = () => {
  cartStore.closeCart()
  cartStore.resetOrderSuccess()
}
</script>

<template>
  <teleport to="body">
    <!-- Backdrop -->
    <transition
      enter-active-class="transition-opacity duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cartStore.isOpen"
        class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl gpu-accel"
        @click="closeAndReset"
      />
    </transition>

    <!-- Slide-in Drawer (Liquid Glass) -->
    <transition
      enter-active-class="transition-transform duration-450 ease-[cubic-bezier(0.16,1,0.3,1)] transform"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] transform"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="cartStore.isOpen"
        class="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg liquid-glass-modal flex flex-col justify-between overflow-hidden gpu-accel"
      >
        <!-- Header -->
        <div class="p-6 border-b border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-xl shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-teal-accent/20 flex items-center justify-center text-teal-accent shadow-[0_0_12px_rgba(111,168,163,0.3)]">
              <ShoppingBag class="w-5 h-5" />
            </div>
            <div>
              <h2
                class="text-xl font-bold text-coffee-sand leading-tight"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ t.cart.title }}
              </h2>
              <span class="text-xs text-coffee-muted">
                {{ cartStore.totalItems }} {{ isKhmer ? 'កែវក្នុងកន្ត្រក' : 'items in bag' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="p-2.5 rounded-full text-coffee-muted hover:text-white hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-white/10"
            @click="closeAndReset"
            aria-label="Close cart"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Order Success State -->
        <div
          v-if="cartStore.isOrderSuccess"
          class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5"
        >
          <div class="w-20 h-20 rounded-full bg-teal-accent/20 text-teal-accent flex items-center justify-center animate-bounce">
            <CheckCircle class="w-12 h-12 stroke-[2.2]" />
          </div>

          <div class="space-y-2">
            <h3
              class="text-2xl sm:text-3xl font-extrabold text-coffee-sand"
              :class="isKhmer ? 'font-khmer' : ''"
            >
              {{ t.cart.orderSuccessTitle }}
            </h3>
            <p
              class="text-xs sm:text-sm text-coffee-muted max-w-sm leading-relaxed mx-auto"
              :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
            >
              {{ t.cart.orderSuccessDesc }}
            </p>
          </div>

          <!-- Estimated time pill -->
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coffee-mid/70 border border-coffee-sand/20 text-xs font-semibold text-coffee-sand">
            <Clock class="w-4 h-4 text-teal-accent" />
            <span>{{ isKhmer ? 'រយៈពេលរៀបចំប្រហែល: ៧ នាទី' : 'Estimated preparation: ~7 mins' }}</span>
          </div>

          <button
            type="button"
            class="mt-4 px-8 py-3.5 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-bold text-sm shadow-glow transition-all active:scale-95 cursor-pointer"
            @click="closeAndReset"
          >
            {{ t.cart.orderSuccessBtn }}
          </button>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="cartStore.isEmpty"
          class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4"
        >
          <div class="w-20 h-20 rounded-full bg-coffee-mid/50 text-coffee-muted/70 flex items-center justify-center">
            <ShoppingBag class="w-10 h-10 stroke-[1.5]" />
          </div>
          <h3
            class="text-xl font-bold text-coffee-sand"
            :class="isKhmer ? 'font-khmer' : ''"
          >
            {{ t.cart.emptyTitle }}
          </h3>
          <p
            class="text-xs sm:text-sm text-coffee-muted max-w-xs leading-relaxed"
            :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
          >
            {{ t.cart.emptyDesc }}
          </p>
          <button
            type="button"
            class="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 cursor-pointer"
            @click="cartStore.closeCart(); cartStore.openFullMenu()"
          >
            <span>{{ t.cart.emptyBtn }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Items List & Order Config -->
        <div v-else class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Order Type Segment (Takeaway / Dine-in / Delivery) -->
          <div class="p-1 rounded-2xl bg-[#180F0A] border border-[#3D281C] grid grid-cols-3 gap-1">
            <button
              type="button"
              class="py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              :class="cartStore.orderType === 'takeaway'
                ? 'bg-teal-accent text-teal-darkText font-bold shadow-sm'
                : 'text-coffee-muted hover:text-coffee-sand'"
              @click="cartStore.orderType = 'takeaway'"
            >
              <Coffee class="w-3.5 h-3.5" />
              <span>{{ isKhmer ? 'ខ្ចប់ទៅ' : 'Takeaway' }}</span>
            </button>
            <button
              type="button"
              class="py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              :class="cartStore.orderType === 'dinein'
                ? 'bg-teal-accent text-teal-darkText font-bold shadow-sm'
                : 'text-coffee-muted hover:text-coffee-sand'"
              @click="cartStore.orderType = 'dinein'"
            >
              <Utensils class="w-3.5 h-3.5" />
              <span>{{ isKhmer ? 'ញ៉ាំនៅហាង' : 'Dine-In' }}</span>
            </button>
            <button
              type="button"
              class="py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              :class="cartStore.orderType === 'delivery'
                ? 'bg-teal-accent text-teal-darkText font-bold shadow-sm'
                : 'text-coffee-muted hover:text-coffee-sand'"
              @click="cartStore.orderType = 'delivery'"
            >
              <Bike class="w-3.5 h-3.5" />
              <span>{{ isKhmer ? 'ដឹកជញ្ជូន' : 'Delivery' }}</span>
            </button>
          </div>

          <!-- Items list with Staggered Transition Group -->
          <TransitionGroup
            name="cart-item-list"
            tag="div"
            class="space-y-4 divide-y divide-[#3D281C]/70"
          >
            <div
              v-for="item in cartStore.items"
              :key="item.product.id + (item.note || '')"
              class="pt-4 first:pt-0 flex items-start gap-4 transition-all duration-300"
            >
              <!-- Thumbnail with soft lift on hover -->
              <div class="w-16 h-16 rounded-2xl bg-[#2A1C15] p-2 flex items-center justify-center shrink-0 border border-coffee-sand/10 shadow-sm">
                <NuxtImg
                  :src="item.product.image"
                  :alt="item.product.name"
                  width="56"
                  height="56"
                  class="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-1">
                  <div>
                    <h4
                      class="text-sm font-bold text-coffee-sand truncate"
                      :class="isKhmer ? 'font-khmer' : ''"
                    >
                      {{ item.product.name }}
                    </h4>
                    <!-- Customization note badges if present -->
                    <p v-if="item.note" class="text-[10px] text-teal-accent font-medium mt-0.5 truncate max-w-[200px]">
                      {{ item.note }}
                    </p>
                    <span class="text-[11px] text-coffee-subtle font-mono block">
                      {{ item.product.formattedPrice }} {{ t.cart.perCup }}
                    </span>
                  </div>

                  <button
                    type="button"
                    class="text-coffee-muted hover:text-red-400 p-1.5 transition-colors active:scale-90 rounded-full hover:bg-white/5 cursor-pointer"
                    :aria-label="'Remove ' + item.product.name"
                    @click="cartStore.removeItem(item.product.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <!-- Quantity adjust & Subtotal -->
                <div class="flex items-center justify-between mt-3">
                  <div class="flex items-center gap-2 bg-[#180F0A] rounded-full px-2.5 py-1 border border-coffee-sand/15 shadow-inner">
                    <button
                      type="button"
                      class="w-5 h-5 rounded-full flex items-center justify-center text-coffee-sand hover:text-white active:scale-90 cursor-pointer disabled:opacity-40"
                      :disabled="item.quantity <= 1"
                      :aria-label="'Decrease quantity ' + item.product.name"
                      @click="cartStore.decrement(item.product.id), playQuantityClick('down')"
                    >
                      <Minus class="w-3.5 h-3.5" />
                    </button>

                    <span class="text-xs font-mono font-black text-white min-w-4 text-center tabular-nums">
                      {{ item.quantity }}
                    </span>

                    <button
                      type="button"
                      class="w-5 h-5 rounded-full flex items-center justify-center text-coffee-sand hover:text-white active:scale-90 cursor-pointer"
                      :aria-label="'Increase quantity ' + item.product.name"
                      @click="cartStore.increment(item.product.id), playQuantityClick('up')"
                    >
                      <Plus class="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div class="text-right">
                    <div class="text-sm font-extrabold text-white font-mono">
                      ${{ (item.product.price * item.quantity).toFixed(2) }}
                    </div>
                    <div class="text-[10px] text-coffee-subtle font-mono">
                      {{ ((item.product.price * item.quantity) * 4000).toLocaleString() }} ៛
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TransitionGroup>

          <!-- Special Note Input -->
          <div class="pt-2">
            <label
              class="text-xs text-coffee-muted block mb-1.5 font-medium"
              :class="isKhmer ? 'font-khmer' : ''"
            >
              {{ isKhmer ? 'ចំណាំបន្ថែម (កម្រិតផ្អែម / ទឹកកក):' : 'Special instructions (sugar / ice):' }}
            </label>
            <input
              v-model="cartStore.orderNotes"
              type="text"
              :placeholder="isKhmer ? 'ឧទាហរណ៍: ផ្អែម 50%, ទឹកកកតិច...' : 'e.g. 50% sugar, less ice...'"
              class="w-full px-3.5 py-2.5 rounded-xl bg-[#180F0A] border border-[#3D281C] text-xs text-coffee-cream placeholder:text-coffee-muted/60 focus:outline-none focus:border-teal-accent"
              :class="isKhmer ? 'font-khmer' : ''"
            >
          </div>
        </div>

        <!-- Footer / Checkout Breakdown -->
        <div v-if="!cartStore.isEmpty && !cartStore.isOrderSuccess" class="p-6 border-t border-[#3D281C] bg-[#180F0A]/95 shrink-0 space-y-4">
          <div class="space-y-2 text-xs text-coffee-muted">
            <div class="flex justify-between">
              <span>{{ t.cart.subtotal }}</span>
              <span class="text-coffee-cream font-medium">{{ cartStore.formattedTotalPrice }}</span>
            </div>
            <div class="flex justify-between">
              <span>{{ t.cart.packaging }}</span>
              <span class="text-teal-accent font-semibold">{{ t.cart.free }}</span>
            </div>
            <div class="flex justify-between items-baseline pt-2 border-t border-[#3D281C]">
              <div>
                <span class="text-sm font-bold text-coffee-sand block">{{ t.cart.total }}</span>
                <span class="text-xs text-coffee-subtle">{{ cartStore.totalPriceKhr }}</span>
              </div>
              <span class="text-2xl font-black text-teal-accent">
                {{ cartStore.formattedTotalPrice }}
              </span>
            </div>
          </div>

          <button
            type="button"
            class="w-full py-4 rounded-full liquid-glass-button font-extrabold text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2"
            @click="handleCheckout"
          >
            <Receipt class="w-4 h-4 stroke-[2.5]" />
            <span>{{ t.cart.checkoutBtn }} • {{ cartStore.formattedTotalPrice }}</span>
          </button>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.cart-item-list-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.cart-item-list-leave-active {
  transition: all 0.22s ease-in;
}
.cart-item-list-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.cart-item-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Search, Sparkles, Filter } from 'lucide-vue-next'
import { useProducts } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'

const cartStore = useCartStore()
const { products } = useProducts()
const { t, isKhmer } = useI18n()

const selectedCategory = ref<string>('all')
const searchQuery = ref('')

const categories = computed(() => [
  { id: 'all', label: t.value.fullMenu.all },
  { id: 'hot', label: t.value.fullMenu.catHot },
  { id: 'iced', label: t.value.fullMenu.catIced },
  { id: 'specialty', label: t.value.fullMenu.catSpecialty },
  { id: 'bakery', label: t.value.fullMenu.catBakery },
])

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesCategory = selectedCategory.value === 'all' || product.category === selectedCategory.value
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query ||
      product.name.toLowerCase().includes(query) ||
      product.nameEn.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)

    return matchesCategory && matchesSearch
  })
})
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cartStore.isFullMenuOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
        @click.self="cartStore.closeFullMenu()"
      >
        <div
          class="relative w-full max-w-6xl h-[92vh] rounded-[2.5rem] border border-[#442E20] shadow-2xl flex flex-col overflow-hidden bg-[#1E130D]"
        >
          <!-- Modal Header -->
          <div class="p-6 sm:p-8 border-b border-[#3D281C] bg-[#1A100A]/90 shrink-0 z-30">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-accent/15 text-teal-accent text-xs font-semibold mb-2">
                  <Sparkles class="w-3.5 h-3.5" />
                  <span>{{ t.fullMenu.tag }}</span>
                </div>
                <h2
                  class="text-2xl sm:text-3xl font-extrabold text-[#E5B588]"
                  :class="isKhmer ? 'font-khmer' : ''"
                >
                  {{ t.fullMenu.title }}
                </h2>
                <p
                  class="text-xs sm:text-sm text-coffee-muted mt-1"
                  :class="isKhmer ? 'font-khmer' : ''"
                >
                  {{ t.fullMenu.subtitle }}
                </p>
              </div>

              <!-- Close button -->
              <button
                type="button"
                class="p-2.5 rounded-full text-coffee-muted hover:text-white hover:bg-white/10 transition-colors"
                @click="cartStore.closeFullMenu()"
                aria-label="Close menu modal"
              >
                <X class="w-6 h-6" />
              </button>
            </div>

            <!-- Controls bar: Search & Category Pills -->
            <div class="mt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <!-- Search Input -->
              <div class="relative flex-1 max-w-md">
                <Search class="w-4 h-4 text-coffee-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t.fullMenu.searchPlaceholder"
                  class="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#2A1C15] border border-coffee-sand/20 text-xs sm:text-sm text-coffee-cream placeholder:text-coffee-muted/70 focus:outline-none focus:border-teal-accent transition-colors"
                  :class="isKhmer ? 'font-khmer' : ''"
                >
                <button
                  v-if="searchQuery"
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-coffee-muted hover:text-white"
                  @click="searchQuery = ''"
                >
                  <X class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Category filter pills -->
              <div class="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  type="button"
                  class="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border"
                  :class="selectedCategory === cat.id
                    ? 'bg-teal-accent text-teal-darkText border-teal-accent shadow-sm'
                    : 'bg-[#2A1C15] text-coffee-muted border-[#442E20] hover:text-coffee-sand hover:border-coffee-sand/40'"
                  @click="selectedCategory = cat.id"
                >
                  {{ cat.label }}
                </button>
              </div>
            </div>
          </div>

          <!-- Product Grid View using the exact card style from screenshot -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-8 pt-2">
            <!-- Empty search state -->
            <div
              v-if="filteredProducts.length === 0"
              class="py-20 text-center space-y-3"
            >
              <Filter class="w-12 h-12 text-coffee-muted/50 mx-auto stroke-[1.5]" />
              <p
                class="text-base font-semibold text-coffee-sand"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ t.fullMenu.noResults }}
              </p>
              <button
                type="button"
                class="text-xs text-teal-accent underline"
                @click="searchQuery = ''; selectedCategory = 'all'"
              >
                Reset filters
              </button>
            </div>

            <!-- Grid of Cards (Matching the screenshot layout) -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6 lg:gap-8 pt-6 pb-12">
              <div
                v-for="product in filteredProducts"
                :key="product.id"
              >
                <ProductCard :product="product" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

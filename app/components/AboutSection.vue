<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'

const cartStore = useCartStore()
const { t, isKhmer } = useI18n()

const features = computed(() => [
  {
    num: '01',
    title: t.value.about.f1Title,
    description: t.value.about.f1Desc,
    side: 'left',
  },
  {
    num: '02',
    title: t.value.about.f2Title,
    description: t.value.about.f2Desc,
    side: 'left',
  },
  {
    num: '03',
    title: t.value.about.f3Title,
    description: t.value.about.f3Desc,
    side: 'right',
  },
  {
    num: '04',
    title: t.value.about.f4Title,
    description: t.value.about.f4Desc,
    side: 'right',
  },
])
</script>

<template>
  <section id="about" class="relative py-20 sm:py-28 overflow-hidden">
    <!-- Background Watermark -->
    <div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
      <span class="watermark-text transform -rotate-3">
        ABOUT
      </span>
    </div>

    <!-- Falling coffee beans decoration at the bottom right -->
    <div class="absolute bottom-6 right-6 sm:right-16 w-24 sm:w-36 opacity-60 animate-float-slow pointer-events-none z-10">
      <NuxtImg
        src="/images/coffee-beans.svg"
        alt="Coffee Beans"
        width="144"
        height="144"
        class="w-full h-auto filter drop-shadow-xl rotate-12"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-20">
      <!-- Section Title -->
      <div class="text-center mb-16 sm:mb-20">
        <h2
          class="text-3xl sm:text-5xl font-extrabold text-coffee-sand tracking-tight"
          :class="isKhmer ? 'font-khmer' : ''"
        >
          {{ t.about.title }}
        </h2>
        <div class="w-16 h-1 bg-teal-accent mx-auto mt-4 rounded-full" />
      </div>

      <!-- Grid Layout: Left 2 items, Center Cup with button, Right 2 items -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-6 items-center">
        <!-- Left Features (1 & 2) -->
        <div class="lg:col-span-4 space-y-10 sm:space-y-14">
          <div
            v-for="feature in features.filter(f => f.side === 'left')"
            :key="feature.num"
            class="relative liquid-glass-card p-6 sm:p-7 rounded-3xl transition-transform hover:-translate-y-1"
          >
            <!-- Big Faint Number behind title -->
            <span class="absolute -top-6 left-4 text-6xl sm:text-7xl font-black text-coffee-sand/15 select-none font-mono pointer-events-none">
              {{ feature.num }}
            </span>

            <div class="relative z-10 pt-2">
              <h3
                class="text-lg sm:text-xl font-bold text-coffee-sand mb-2.5"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ feature.title }}
              </h3>
              <p
                class="text-xs sm:text-sm text-coffee-muted leading-relaxed font-normal"
                :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
              >
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Center Cup Image with teal order button underneath (Resized to Big) -->
        <div class="lg:col-span-4 flex flex-col items-center justify-center my-6 lg:my-0 relative z-20">
          <div class="relative w-72 sm:w-96 lg:w-[420px] h-80 sm:h-[420px] lg:h-[480px] flex items-center justify-center">
            <!-- Glow circle -->
            <div class="absolute w-64 sm:w-80 lg:w-[360px] h-64 sm:h-80 lg:h-[360px] rounded-full bg-teal-accent/20 blur-3xl -z-10 pointer-events-none" />

            <!-- Center Cup - Big & Prominent -->
            <div class="w-full h-full animate-float flex items-center justify-center">
              <NuxtImg
                src="/images/cup-hero-brown.svg"
                alt="Sne Kafe signature cup"
                width="420"
                height="480"
                class="w-full max-w-[300px] sm:max-w-[360px] lg:max-w-[410px] h-auto object-contain filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.7)]"
              />
            </div>
          </div>

          <!-- Teal Order Button (Liquid Glass) -->
          <button
            type="button"
            class="mt-6 px-12 py-4 rounded-full liquid-glass-button font-extrabold text-sm sm:text-base tracking-wide cursor-pointer"
            @click="cartStore.openCart()"
          >
            {{ t.about.orderBtn }}
          </button>
        </div>

        <!-- Right Features (3 & 4) -->
        <div class="lg:col-span-4 space-y-10 sm:space-y-14">
          <div
            v-for="feature in features.filter(f => f.side === 'right')"
            :key="feature.num"
            class="relative liquid-glass-card p-6 sm:p-7 rounded-3xl transition-transform hover:-translate-y-1"
          >
            <!-- Big Faint Number behind title -->
            <span class="absolute -top-6 left-4 text-6xl sm:text-7xl font-black text-coffee-sand/15 select-none font-mono pointer-events-none">
              {{ feature.num }}
            </span>

            <div class="relative z-10 pt-2">
              <h3
                class="text-lg sm:text-xl font-bold text-coffee-sand mb-2.5"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ feature.title }}
              </h3>
              <p
                class="text-xs sm:text-sm text-coffee-muted leading-relaxed font-normal"
                :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
              >
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

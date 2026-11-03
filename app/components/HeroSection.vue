<script setup lang="ts">
import { ArrowRight, Sparkles } from 'lucide-vue-next'
import { useI18n } from '~/composables/useI18n'

const { t, isKhmer } = useI18n()

const scrollToMenu = () => {
  const menuEl = document.getElementById('menu')
  if (menuEl) {
    menuEl.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="hero" class="relative min-h-[92vh] flex items-center pt-28 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
    <!-- Large faint watermark text in background -->
    <div class="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
      <span class="watermark-text transform -rotate-6 translate-y-12">
        SNE KAFE
      </span>
    </div>

    <!-- Floating Coffee Beans Decoration -->
    <div class="absolute top-20 left-8 sm:left-24 w-12 sm:w-16 opacity-60 animate-float pointer-events-none z-10">
      <NuxtImg
        src="/images/coffee-beans.svg"
        alt="Coffee Beans"
        width="64"
        height="64"
        class="w-full h-auto filter drop-shadow-lg"
      />
    </div>

    <div class="absolute bottom-24 left-1/4 w-10 sm:w-14 opacity-40 animate-float-slow pointer-events-none z-10">
      <NuxtImg
        src="/images/coffee-beans.svg"
        alt="Coffee Beans"
        width="56"
        height="56"
        class="w-full h-auto filter drop-shadow-md rotate-45"
      />
    </div>

    <div class="absolute top-36 right-10 sm:right-28 w-14 sm:w-20 opacity-55 animate-float-reverse pointer-events-none z-10">
      <NuxtImg
        src="/images/coffee-beans.svg"
        alt="Coffee Beans"
        width="80"
        height="80"
        class="w-full h-auto filter drop-shadow-lg -rotate-12"
      />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <!-- Left Column: Copy & CTA -->
        <div class="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left">
          <!-- Subtle tag / badge (Liquid Glass Pill) -->
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold text-coffee-sand">
            <Sparkles class="w-3.5 h-3.5 text-teal-accent animate-pulse" />
            <span>{{ t.hero.tag }}</span>
          </div>

          <!-- Primary Heading -->
          <h1
            class="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-coffee-sand tracking-tight leading-[1.25]"
            :class="isKhmer ? 'font-khmer' : ''"
          >
            {{ t.hero.title1 }}
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-coffee-sand via-coffee-caramel to-teal-accent">
              {{ t.hero.titleHighlight }}
            </span>
            {{ t.hero.title2 }}
          </h1>

          <!-- Body Text -->
          <p
            class="text-coffee-muted text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal"
            :class="isKhmer ? 'font-khmer leading-loose' : ''"
          >
            {{ t.hero.description }}
          </p>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              type="button"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full liquid-glass-button font-bold text-sm sm:text-base tracking-wide cursor-pointer group"
              @click="scrollToMenu"
            >
              <span>{{ t.hero.btnChoose }}</span>
              <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <a
              href="#about"
              class="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full liquid-glass-pill text-coffee-sand hover:text-white font-medium text-sm transition-all hover:scale-105"
            >
              {{ t.hero.btnAbout }}
            </a>
          </div>

          <!-- Highlights strip -->
          <div class="grid grid-cols-3 gap-4 pt-4 sm:pt-6 border-t border-coffee-sand/10 max-w-lg mx-auto lg:mx-0">
            <div>
              <p class="text-xl sm:text-2xl font-bold text-coffee-sand">{{ t.hero.statVarieties }}</p>
              <p class="text-xs text-coffee-muted mt-0.5">{{ t.hero.statVarietiesLabel }}</p>
            </div>
            <div>
              <p class="text-xl sm:text-2xl font-bold text-coffee-sand">{{ t.hero.statBeans }}</p>
              <p class="text-xs text-coffee-muted mt-0.5">{{ t.hero.statBeansLabel }}</p>
            </div>
            <div>
              <p class="text-xl sm:text-2xl font-bold text-coffee-sand">{{ t.hero.statRating }}</p>
              <p class="text-xs text-coffee-muted mt-0.5">{{ t.hero.statRatingLabel }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Visual Coffee Composition (Bigger Prominent Cups) -->
        <div class="lg:col-span-6 relative flex items-center justify-center pt-6 lg:pt-0">
          <!-- Background radial glow -->
          <div class="absolute w-80 h-80 sm:w-[500px] sm:h-[500px] rounded-full bg-coffee-sand/20 blur-3xl -z-10 animate-pulseGlow pointer-events-none" />

          <!-- Splash liquid background -->
          <div class="absolute inset-0 flex items-center justify-center -z-10 scale-125 sm:scale-150 opacity-80 pointer-events-none">
            <NuxtImg
              src="/images/coffee-splash.svg"
              alt="Coffee splash"
              width="600"
              height="600"
              class="w-full max-w-[480px] sm:max-w-[580px] h-auto object-contain"
            />
          </div>

          <!-- Cup Composition: Two overlapping branded cups (Resized to Big) -->
          <div class="relative w-full max-w-[460px] sm:max-w-[540px] lg:max-w-[620px] h-[380px] sm:h-[480px] lg:h-[560px] flex items-center justify-center">
            <!-- Cream Cup (Behind) -->
            <div class="absolute -left-2 sm:-left-6 bottom-4 sm:bottom-10 w-64 sm:w-80 lg:w-[350px] animate-float-slow transform -rotate-6">
              <NuxtImg
                src="/images/cup-hero-cream.svg"
                alt="Sne Kafe ceramic mug"
                width="400"
                height="460"
                class="w-full h-auto filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.65)]"
              />
            </div>

            <!-- Brown Takeaway Cup (Front) -->
            <div class="absolute right-0 sm:right-2 top-0 w-72 sm:w-96 lg:w-[420px] animate-float transform rotate-6 z-10">
              <NuxtImg
                src="/images/cup-hero-brown.svg"
                alt="Sne Kafe takeaway coffee cup"
                width="440"
                height="520"
                class="w-full h-auto filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.75)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

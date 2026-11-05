<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles, HelpCircle } from 'lucide-vue-next'
import { useI18n } from '~/composables/useI18n'

const { t, isKhmer } = useI18n()
const isQuizOpen = ref(false)
</script>

<template>
  <section id="promo" class="relative py-16 sm:py-24">
    <div class="max-w-7xl mx-auto px-4 sm:px-8">
      <!-- Wide Liquid Glass Card with 8D Scroll Reveal -->
      <div class="reveal-on-scroll relative liquid-glass-card rounded-4xl p-8 sm:p-12 lg:p-16 overflow-visible shadow-glass transition-all duration-500">
        <!-- Background subtle glow -->
        <div class="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-teal-accent/15 blur-3xl pointer-events-none" />

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Text and CTA Button -->
          <div class="lg:col-span-7 space-y-5 text-center lg:text-left relative z-20">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full liquid-glass-pill text-xs font-semibold text-teal-accent">
              <Sparkles class="w-3.5 h-3.5" />
              <span>{{ t.quiz.tag }}</span>
            </div>

            <h2
              class="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-coffee-sand tracking-tight leading-tight"
              :class="isKhmer ? 'font-khmer leading-snug' : ''"
            >
              {{ t.quiz.title }}
            </h2>

            <p
              class="text-xs sm:text-sm lg:text-base text-coffee-muted max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed"
              :class="isKhmer ? 'font-khmer leading-relaxed' : ''"
            >
              {{ t.quiz.description }}
            </p>

            <div class="pt-2">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full liquid-glass-button font-bold text-sm sm:text-base tracking-wide cursor-pointer"
                @click="isQuizOpen = true"
              >
                <HelpCircle class="w-5 h-5 stroke-[2.2]" />
                <span>{{ t.quiz.btnStart }}</span>
              </button>
            </div>
          </div>

          <!-- Wooden spoon full of coffee beans on the right, overflowing the card -->
          <div class="lg:col-span-5 relative flex items-center justify-center">
            <div class="relative lg:absolute lg:-right-14 lg:-top-16 lg:-bottom-16 w-64 sm:w-80 lg:w-[440px] pointer-events-none z-10 transition-transform duration-500 hover:scale-105">
              <NuxtImg
                src="/images/coffee-spoon.svg"
                alt="Wooden spoon loaded with coffee beans"
                width="440"
                height="320"
                loading="lazy"
                class="w-full h-auto filter drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Modal -->
    <QuizModal :is-open="isQuizOpen" @close="isQuizOpen = false" />
  </section>
</template>

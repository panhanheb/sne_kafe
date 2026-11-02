<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'
import { useI18n } from '~/composables/useI18n'

const { t, isKhmer } = useI18n()

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer id="reviews" class="relative border-t border-coffee-sand/10 bg-coffee-darkest/80 pt-16 pb-12 overflow-hidden">
    <!-- Subtle background glow -->
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-coffee-sand/5 blur-3xl pointer-events-none" />

    <div class="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 pb-12 border-b border-coffee-sand/10">
        <!-- Logo: ស្នេហ៍កាហ្វេ (Sne Kafe) -->
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-full bg-coffee-mid/80 border border-coffee-sand/30 flex items-center justify-center text-teal-accent shadow-md">
            <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M4 19h16v2H4v-2zm14-9V5H2v10a4 4 0 004 4h8a4 4 0 004-4v-2h2a3 3 0 003-3v-2a3 3 0 00-3-3h-2zm0 3h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v-4zM4 7h12v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/>
            </svg>
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-extrabold text-coffee-sand tracking-wide font-khmer leading-tight">
              ស្នេហ៍កាហ្វេ
            </span>
            <span class="text-[11px] font-semibold tracking-widest uppercase text-teal-accent/90 -mt-0.5">
              Sne Kafe
            </span>
          </div>
        </div>

        <!-- Small Underlined Links -->
        <nav class="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          <a
            href="#promo"
            class="text-xs sm:text-sm text-coffee-muted hover:text-coffee-sand underline underline-offset-4 decoration-coffee-sand/30 hover:decoration-teal-accent transition-colors"
            :class="isKhmer ? 'font-khmer' : ''"
          >
            {{ t.footer.news }}
          </a>
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs sm:text-sm text-coffee-muted hover:text-coffee-sand underline underline-offset-4 decoration-coffee-sand/30 hover:decoration-teal-accent transition-colors"
            :class="isKhmer ? 'font-khmer' : ''"
          >
            {{ t.footer.telegram }}
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs sm:text-sm text-coffee-muted hover:text-coffee-sand underline underline-offset-4 decoration-coffee-sand/30 hover:decoration-teal-accent transition-colors"
            :class="isKhmer ? 'font-khmer' : ''"
          >
            {{ t.footer.instagram }}
          </a>
          <a
            href="#hero"
            class="text-xs sm:text-sm text-coffee-muted hover:text-coffee-sand underline underline-offset-4 decoration-coffee-sand/30 hover:decoration-teal-accent transition-colors"
            :class="isKhmer ? 'font-khmer' : ''"
          >
            {{ t.footer.loyalty }}
          </a>
        </nav>

        <!-- Back to Top Button -->
        <button
          type="button"
          class="p-3 rounded-full glass-card hover:border-teal-accent/50 text-coffee-sand hover:text-teal-accent transition-all duration-200 active:scale-95"
          aria-label="Back to top"
          @click="scrollToTop"
        >
          <ArrowUp class="w-4 h-4" />
        </button>
      </div>

      <!-- Bottom Info -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-subtle">
        <p :class="isKhmer ? 'font-khmer' : ''">{{ t.footer.copyright }}</p>
        <p :class="isKhmer ? 'font-khmer' : ''">{{ t.footer.hours }}</p>
      </div>
    </div>
  </footer>
</template>

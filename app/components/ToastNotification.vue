<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, X, ShoppingBag } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'
import { useI18n } from '~/composables/useI18n'

const { toasts, remove } = useToast()
const { isKhmer } = useI18n()
</script>

<template>
  <teleport to="body">
    <div
      class="fixed bottom-6 right-6 z-[80] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      <TransitionGroup
        enter-active-class="transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
        enter-from-class="opacity-0 translate-y-6 scale-90"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-3 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto relative overflow-hidden rounded-2xl p-4 liquid-glass-card shadow-2xl flex items-center justify-between gap-3 border border-white/20 will-change-transform"
        >
          <!-- Background subtle accent glow -->
          <div
            class="absolute -left-4 -top-4 w-16 h-16 rounded-full blur-xl pointer-events-none -z-0"
            :class="toast.type === 'success' ? 'bg-teal-400/20' : toast.type === 'error' ? 'bg-red-400/20' : 'bg-amber-400/20'"
          />

          <div class="flex items-center gap-3 min-w-0 z-10">
            <!-- Icon with spring bounce -->
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm"
              :class="toast.type === 'success'
                ? 'bg-teal-accent/25 text-teal-accent shadow-[0_0_12px_rgba(111,168,163,0.35)]'
                : toast.type === 'error'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-amber-500/20 text-amber-300'"
            >
              <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5 stroke-[2.4]" />
              <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 text-red-400" />
              <Info v-else class="w-5 h-5 text-coffee-sand" />
            </div>

            <!-- Content -->
            <div class="min-w-0 flex-1">
              <h4
                class="text-xs sm:text-sm font-bold text-coffee-sand truncate"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ toast.title }}
              </h4>
              <p
                v-if="toast.message"
                class="text-[11px] text-coffee-muted truncate mt-0.5"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ toast.message }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 shrink-0 z-10">
            <button
              v-if="toast.actionText && toast.onAction"
              type="button"
              class="px-3.5 py-1.5 rounded-full liquid-glass-button text-xs font-bold transition-transform active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm"
              @click="toast.onAction(); remove(toast.id)"
            >
              <ShoppingBag class="w-3 h-3" />
              <span>{{ toast.actionText }}</span>
            </button>

            <button
              type="button"
              class="p-1 rounded-full text-coffee-muted hover:text-white hover:bg-white/10 transition-colors active:scale-90"
              @click="remove(toast.id)"
              aria-label="Dismiss toast"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </teleport>
</template>


<script setup lang="ts">
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'
import { useI18n } from '~/composables/useI18n'

const { toasts, remove } = useToast()
const { isKhmer } = useI18n()
</script>

<template>
  <teleport to="body">
    <div
      class="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0"
    >
      <transition-group
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto rounded-2xl p-4 liquid-glass-card shadow-2xl flex items-center justify-between gap-3 border border-white/20"
        >
          <div class="flex items-center gap-3 min-w-0">
            <!-- Icon -->
            <div class="w-8 h-8 rounded-full bg-teal-accent/20 text-teal-accent flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(111,168,163,0.3)]">
              <CheckCircle2 v-if="toast.type === 'success'" class="w-5 h-5" />
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
          <div class="flex items-center gap-2 shrink-0">
            <button
              v-if="toast.actionText && toast.onAction"
              type="button"
              class="px-3 py-1 rounded-full liquid-glass-button text-xs font-bold transition-transform active:scale-95 cursor-pointer"
              @click="toast.onAction(); remove(toast.id)"
            >
              {{ toast.actionText }}
            </button>

            <button
              type="button"
              class="p-1 rounded-full text-coffee-muted hover:text-white transition-colors"
              @click="remove(toast.id)"
              aria-label="Dismiss toast"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>


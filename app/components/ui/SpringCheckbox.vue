<script setup lang="ts">
import { Check } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    label: string
    subtitle?: string
    priceExtra?: string
    iconEmoji?: string
    activeColor?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    subtitle: '',
    priceExtra: '',
    iconEmoji: '',
    activeColor: 'amber',
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

const toggle = () => {
  if (props.disabled) return
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    type="button"
    class="w-full p-3 rounded-2xl text-left border transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent select-none group"
    :class="[
      modelValue
        ? (activeColor === 'teal'
            ? 'bg-teal-accent/20 border-teal-accent/50 text-white shadow-[0_4px_16px_rgba(111,168,163,0.25)] ring-1 ring-teal-accent/30'
            : 'bg-amber-500/20 border-amber-400/50 text-white shadow-[0_4px_16px_rgba(234,163,75,0.25)] ring-1 ring-amber-400/30')
        : 'bg-black/35 border-white/10 text-coffee-muted hover:border-white/25 hover:text-white hover:bg-black/45',
      disabled ? 'opacity-40 cursor-not-allowed' : ''
    ]"
    @click="toggle"
  >
    <!-- Left text/icon -->
    <div class="min-w-0 flex items-center gap-2.5">
      <span
        v-if="iconEmoji"
        class="text-lg shrink-0 transition-transform duration-200 group-hover:scale-110"
        :class="modelValue ? 'scale-110' : ''"
      >
        {{ iconEmoji }}
      </span>
      <div class="min-w-0">
        <div class="text-xs font-bold text-coffee-sand truncate flex items-center gap-1.5">
          <span>{{ label }}</span>
        </div>
        <div class="flex items-center gap-2 mt-0.5">
          <span v-if="priceExtra" class="text-[11px] text-teal-accent font-mono font-bold">
            {{ priceExtra }}
          </span>
          <span v-if="subtitle" class="text-[10px] text-coffee-muted truncate">
            {{ subtitle }}
          </span>
        </div>
      </div>
    </div>

    <!-- Right Animated Check Box -->
    <div
      class="w-5 h-5 rounded-lg border flex items-center justify-center transition-all duration-300 shrink-0"
      :class="modelValue
        ? (activeColor === 'teal'
            ? 'bg-teal-accent border-teal-accent text-[#101F1D] shadow-[0_0_8px_rgba(111,168,163,0.5)] scale-105'
            : 'bg-amber-400 border-amber-400 text-[#1A1009] shadow-[0_0_8px_rgba(234,163,75,0.5)] scale-105')
        : 'border-white/25 bg-white/5 group-hover:border-white/40'"
    >
      <Transition name="check-spring">
        <Check
          v-if="modelValue"
          class="w-3.5 h-3.5 stroke-[3] check-icon"
        />
      </Transition>
    </div>
  </button>
</template>

<style scoped>
.check-spring-enter-active {
  animation: springDraw 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.check-spring-leave-active {
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}
.check-spring-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

@keyframes springDraw {
  0% {
    opacity: 0;
    transform: scale(0.3) rotate(-15deg);
  }
  60% {
    transform: scale(1.2) rotate(4deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
</style>


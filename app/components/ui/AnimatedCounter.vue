<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  value: number
}>()

const direction = ref<'up' | 'down'>('up')

watch(
  () => props.value,
  (newVal, oldVal) => {
    direction.value = newVal > (oldVal ?? 0) ? 'up' : 'down'
  }
)
</script>

<template>
  <div class="relative overflow-hidden inline-flex items-center justify-center min-w-[1.75rem] h-6 font-mono font-black select-none">
    <Transition :name="direction === 'up' ? 'roll-up' : 'roll-down'" mode="out-in">
      <span :key="value" class="inline-block tabular-nums text-white">
        {{ value }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
/* Roll Up Transition (Increment) */
.roll-up-enter-active,
.roll-up-leave-active {
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out;
}
.roll-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.roll-up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

/* Roll Down Transition (Decrement) */
.roll-down-enter-active,
.roll-down-leave-active {
  transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease-out;
}
.roll-down-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}
.roll-down-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

@media (prefers-reduced-motion: reduce) {
  .roll-up-enter-active,
  .roll-up-leave-active,
  .roll-down-enter-active,
  .roll-down-leave-active {
    transition: opacity 0.1s ease-out;
    transform: none !important;
  }
}
</style>


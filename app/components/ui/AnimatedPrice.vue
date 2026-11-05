<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import gsap from 'gsap'

const props = withDefaults(
  defineProps<{
    value: number
    currency?: string
    decimals?: number
    showKhr?: boolean
    rate?: number
  }>(),
  {
    currency: '$',
    decimals: 2,
    showKhr: false,
    rate: 4000,
  }
)

const displayValue = ref(props.value)
const isIncreasing = ref(false)
const isPulsing = ref(false)
let pulseTimeout: any = null

watch(
  () => props.value,
  (newVal, oldVal) => {
    isIncreasing.value = newVal > (oldVal ?? 0)
    isPulsing.value = true
    if (pulseTimeout) clearTimeout(pulseTimeout)
    pulseTimeout = setTimeout(() => {
      isPulsing.value = false
    }, 450)

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      displayValue.value = newVal
      return
    }

    gsap.to(displayValue, {
      value: newVal,
      duration: 0.38,
      ease: 'power2.out',
    })
  }
)

const formattedUsd = computed(() => {
  return `${props.currency}${displayValue.value.toFixed(props.decimals)}`
})

const formattedKhr = computed(() => {
  const khr = Math.round(displayValue.value * props.rate)
  return `${khr.toLocaleString()} ៛`
})
</script>

<template>
  <span
    class="inline-flex items-baseline gap-1.5 font-mono tabular-nums transition-colors duration-300"
    :class="isPulsing ? 'text-teal-accent' : ''"
  >
    <span
      class="inline-block transition-transform duration-300 ease-out will-change-transform"
      :class="isPulsing ? (isIncreasing ? '-translate-y-0.5 scale-105' : 'translate-y-0.5 scale-95') : ''"
    >
      {{ formattedUsd }}
    </span>
    <span
      v-if="showKhr"
      class="text-[11px] font-normal text-coffee-muted/70 tracking-normal"
    >
      ({{ formattedKhr }})
    </span>
  </span>
</template>


<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  sweetness?: string
  liquidTopY: number
  isEmpty: boolean
}>()

const swirlPathEl = ref<SVGPathElement | null>(null)
const activeTl = ref<gsap.core.Timeline | null>(null)

watch(
  () => props.sweetness,
  (val) => {
    if (!val || val === '0%' || props.isEmpty) return

    if (activeTl.value) activeTl.value.kill()

    // Intensity based on %
    const pct = parseInt(val) || 50
    const intensity = pct / 100

    const tl = gsap.timeline({
      onComplete: () => {
        activeTl.value = null
      }
    })
    activeTl.value = tl

    if (swirlPathEl.value) {
      tl.fromTo(
        swirlPathEl.value,
        {
          strokeDasharray: 240,
          strokeDashoffset: 240,
          opacity: 0.9 * intensity,
          strokeWidth: 2 + intensity * 2.5,
        },
        {
          strokeDashoffset: 0,
          duration: 0.85,
          ease: 'power1.inOut',
        }
      )
      .to(swirlPathEl.value, {
        opacity: 0,
        duration: 0.6,
        ease: 'power1.out',
      })
    }
  }
)

onBeforeUnmount(() => {
  if (activeTl.value) activeTl.value.kill()
})
</script>

<template>
  <g class="sugar-swirl-group pointer-events-none">
    <!-- Golden Amber Cane Sugar Syrup Spiral -->
    <path
      ref="swirlPathEl"
      :d="`M 160,${liquidTopY} Q 175,${liquidTopY + 30} 150,${liquidTopY + 60} T 165,${liquidTopY + 110} T 155,${liquidTopY + 160}`"
      stroke="url(#realCaramel)"
      stroke-width="3"
      stroke-linecap="round"
      fill="none"
      opacity="0"
      filter="drop-shadow(0 0 4px rgba(217, 127, 36, 0.6))"
    />
  </g>
</template>


<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  isPouring: boolean
  withExtraShot: boolean
  liquidTopY: number
}>()

const emit = defineEmits<{
  (e: 'streamDone'): void
}>()

const streamEl = ref<SVGPathElement | null>(null)
const impactRingEl = ref<SVGEllipseElement | null>(null)
const activeTl = ref<gsap.core.Timeline | null>(null)

watch(
  () => props.isPouring,
  (val) => {
    if (activeTl.value) {
      activeTl.value.kill()
    }

    if (val) {
      const tl = gsap.timeline({
        onComplete: () => {
          emit('streamDone')
          activeTl.value = null
        }
      })
      activeTl.value = tl

      // Stream shoots down with slight wobble
      tl.fromTo(
        streamEl.value,
        {
          strokeDasharray: 200,
          strokeDashoffset: 200,
          opacity: 0,
        },
        {
          strokeDashoffset: 0,
          opacity: 0.95,
          duration: 0.35,
          ease: 'power2.in',
        }
      )
      // Stream flows while pouring (~0.7s)
      .to(streamEl.value, {
        opacity: 0.95,
        duration: 0.65,
      })
      // Stream tails off
      .to(streamEl.value, {
        strokeDashoffset: -200,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      })

      // Impact ring expands continuously during pour
      tl.fromTo(
        impactRingEl.value,
        {
          scale: 0.3,
          opacity: 0.9,
          transformOrigin: '160px ' + props.liquidTopY + 'px',
        },
        {
          scale: 2.2,
          opacity: 0,
          duration: 0.6,
          repeat: 2,
          ease: 'power1.out',
        },
        0.25
      )
    } else {
      if (streamEl.value) {
        gsap.to(streamEl.value, { opacity: 0, duration: 0.2 })
      }
    }
  }
)

onBeforeUnmount(() => {
  if (activeTl.value) activeTl.value.kill()
})
</script>

<template>
  <g class="pour-stream-group pointer-events-none">
    <!-- Flowing Espresso Jet -->
    <path
      ref="streamEl"
      :d="`M 160,-20 Q 158,${(liquidTopY - 20) / 2} 160,${liquidTopY}`"
      stroke="url(#pourStreamGrad)"
      stroke-width="5"
      stroke-linecap="round"
      fill="none"
      opacity="0"
      filter="drop-shadow(0 0 6px rgba(80, 40, 16, 0.7))"
    />

    <!-- Impact Ripple Ring on Surface -->
    <ellipse
      ref="impactRingEl"
      cx="160"
      :cy="liquidTopY"
      rx="12"
      ry="4"
      fill="none"
      stroke="rgba(255, 255, 255, 0.75)"
      stroke-width="1.8"
      opacity="0"
    />
  </g>
</template>

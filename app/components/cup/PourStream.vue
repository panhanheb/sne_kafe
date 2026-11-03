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
          if (impactRingEl.value) {
            gsap.set(impactRingEl.value, { opacity: 0 })
          }
        }
      })
      activeTl.value = tl

      // Stream shoots down with slight wobble
      tl.fromTo(
        streamEl.value,
        {
          strokeDasharray: 220,
          strokeDashoffset: 220,
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
        strokeDashoffset: -220,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.out',
      })

      // Surface impact ripple ring
      if (impactRingEl.value) {
        tl.fromTo(
          impactRingEl.value,
          {
            opacity: 0.9,
            attr: { rx: 6, ry: 2 },
          },
          {
            opacity: 0,
            attr: { rx: 28, ry: 8 },
            duration: 0.65,
            repeat: 1,
            ease: 'power1.out',
          },
          0.2
        )
      }
    } else {
      if (streamEl.value) {
        gsap.to(streamEl.value, { opacity: 0, duration: 0.2 })
      }
      if (impactRingEl.value) {
        gsap.set(impactRingEl.value, { opacity: 0 })
      }
    }
  }
)

onBeforeUnmount(() => {
  if (activeTl.value) activeTl.value.kill()
  if (impactRingEl.value) gsap.set(impactRingEl.value, { opacity: 0 })
})
</script>

<template>
  <g v-if="isPouring" class="pour-stream-group pointer-events-none">
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
      rx="6"
      ry="2"
      fill="none"
      stroke="rgba(255, 255, 255, 0.8)"
      stroke-width="1.8"
      opacity="0"
    />
  </g>
</template>

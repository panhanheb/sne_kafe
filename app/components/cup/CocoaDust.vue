<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  withCocoa: boolean
  withCream: boolean
  isEmpty: boolean
}>()

const sifterEl = ref<SVGGElement | null>(null)
const dustGroupEl = ref<SVGGElement | null>(null)
const activeTl = ref<gsap.core.Timeline | null>(null)

// 24 fine cocoa speckles with natural positions
const speckles = [
  { cx: 146, cy: 42, r: 1.5, fill: '#431E0D' },
  { cx: 152, cy: 36, r: 1.2, fill: '#582C15' },
  { cx: 162, cy: 40, r: 1.6, fill: '#361708' },
  { cx: 170, cy: 48, r: 1.3, fill: '#65341A' },
  { cx: 134, cy: 70, r: 1.4, fill: '#431E0D' },
  { cx: 148, cy: 66, r: 1.7, fill: '#582C15' },
  { cx: 166, cy: 68, r: 1.5, fill: '#361708' },
  { cx: 180, cy: 74, r: 1.6, fill: '#65341A' },
  { cx: 122, cy: 80, r: 1.3, fill: '#431E0D' },
  { cx: 196, cy: 82, r: 1.4, fill: '#582C15' },
  { cx: 138, cy: 88, r: 1.5, fill: '#361708' },
  { cx: 172, cy: 86, r: 1.3, fill: '#582C15' },
  { cx: 156, cy: 60, r: 1.6, fill: '#431E0D' },
  { cx: 142, cy: 52, r: 1.2, fill: '#65341A' },
  { cx: 164, cy: 54, r: 1.4, fill: '#361708' },
  { cx: 130, cy: 76, r: 1.5, fill: '#582C15' },
]

watch(
  () => props.withCocoa,
  (val) => {
    if (activeTl.value) activeTl.value.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        activeTl.value = null
      }
    })
    activeTl.value = tl

    if (val && !props.isEmpty) {
      if (sifterEl.value && dustGroupEl.value) {
        // Sifter moves in, shakes back and forth
        gsap.set(sifterEl.value, { y: -60, opacity: 0 })
        gsap.set(dustGroupEl.value, { opacity: 0, y: -15 })

        tl.to(sifterEl.value, {
          y: 0,
          opacity: 1,
          duration: 0.25,
          ease: 'power2.out',
        })
        // Sifter shaking
        .to(sifterEl.value, {
          x: '+=8',
          rotation: 6,
          repeat: 4,
          yoyo: true,
          duration: 0.08,
          ease: 'sine.inOut',
        })
        // Dust shower drifts down and settles
        .to(
          dustGroupEl.value,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power1.out',
          },
          `-0.2`
        )
        // Sifter exits
        .to(sifterEl.value, {
          y: -70,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
      }
    } else {
      if (dustGroupEl.value) {
        tl.to(dustGroupEl.value, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
      }
    }
  },
  { immediate: false }
)

onBeforeUnmount(() => {
  if (activeTl.value) activeTl.value.kill()
})
</script>

<template>
  <g class="cocoa-dust-group pointer-events-none">
    <!-- Shaking Mesh Sifter -->
    <g ref="sifterEl" opacity="0" transform="translate(160, 15)">
      <!-- Sifter Handle -->
      <line x1="25" y1="-8" x2="55" y2="-12" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" />
      <!-- Sifter Bowl -->
      <path d="M -24,-10 C -24,8 24,8 24,-10 Z" fill="rgba(203, 213, 225, 0.45)" stroke="#64748B" stroke-width="1.4" />
      <!-- Wire Mesh -->
      <line x1="-16" y1="-2" x2="16" y2="-2" stroke="#94A3B8" stroke-width="0.8" stroke-dasharray="2 2" />
      <line x1="-12" y1="2" x2="12" y2="2" stroke="#94A3B8" stroke-width="0.8" stroke-dasharray="2 2" />
    </g>

    <!-- Settled Cocoa Powder Speckles -->
    <g
      ref="dustGroupEl"
      :style="{ display: withCocoa && !isEmpty ? 'block' : 'none' }"
    >
      <circle
        v-for="(s, idx) in speckles"
        :key="idx"
        :cx="s.cx"
        :cy="withCream ? s.cy : s.cy + 30"
        :r="s.r"
        :fill="s.fill"
      />
    </g>
  </g>
</template>


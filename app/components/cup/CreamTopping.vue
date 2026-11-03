<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  withCream: boolean
  liquidTopY: number
  tiltX: number
  tiltY: number
  isEmpty: boolean
}>()

const creamGroupEl = ref<SVGGElement | null>(null)
const nozzleEl = ref<SVGGElement | null>(null)
const spiralPathEl = ref<SVGPathElement | null>(null)
const activeTl = ref<gsap.core.Timeline | null>(null)
const isPipingComplete = ref(false)

watch(
  () => props.withCream,
  (val) => {
    if (activeTl.value) {
      activeTl.value.kill()
    }

    const tl = gsap.timeline({
      onComplete: () => {
        activeTl.value = null
      }
    })
    activeTl.value = tl

    if (val && !props.isEmpty) {
      isPipingComplete.value = false

      // 1. Piping nozzle swoops in from above
      if (nozzleEl.value && spiralPathEl.value && creamGroupEl.value) {
        gsap.set(nozzleEl.value, { y: -80, opacity: 1, scale: 0.9 })
        gsap.set(creamGroupEl.value, { opacity: 0, scale: 0.3 })

        // Nozzle descends into position
        tl.to(nozzleEl.value, {
          y: 0,
          opacity: 1,
          duration: 0.28,
          ease: 'power2.out',
        })
        // Spiral piping path draws out while nozzle swirls
        .fromTo(
          spiralPathEl.value,
          { strokeDasharray: 260, strokeDashoffset: 260, opacity: 1 },
          { strokeDashoffset: 0, duration: 0.55, ease: 'power1.inOut' }
        )
        // Nozzle retracts upward
        .to(nozzleEl.value, {
          y: -100,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
        })
        // Cream body blooms and settles with soft jelly-like spring bounce
        .fromTo(
          creamGroupEl.value,
          { opacity: 0, scale: 0.5, y: 15, transformOrigin: '160px 90px' },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.55,
            ease: 'back.out(1.8)',
            onStart: () => {
              isPipingComplete.value = true
            }
          },
          `-0.2`
        )
      }
    } else {
      // Removing cream: scales down and melts into drink
      if (creamGroupEl.value) {
        tl.to(creamGroupEl.value, {
          scale: 0.1,
          y: 20,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.in',
          onComplete: () => {
            isPipingComplete.value = false
          }
        })
      }
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (activeTl.value) activeTl.value.kill()
})
</script>

<template>
  <g class="cream-topping-group pointer-events-none">
    <!-- Stylized Piping Bag Nozzle (Star Fluted Tip) -->
    <g ref="nozzleEl" opacity="0" transform="translate(160, 20)">
      <!-- Pastry Bag Triangle -->
      <polygon points="-16,-55 16,-55 10,-12 -10,-12" fill="#E8EDF2" stroke="#CBD5E1" stroke-width="1.2" />
      <path d="M -16,-55 L 16,-55" stroke="#94A3B8" stroke-width="2" />
      <!-- Metallic Star Tip -->
      <polygon points="-9,-12 9,-12 6,0 -6,0" fill="#94A3B8" />
      <line x1="-3" y1="-12" x2="-2" y2="0" stroke="#F1F5F9" stroke-width="0.8" />
      <line x1="3" y1="-12" x2="2" y2="0" stroke="#475569" stroke-width="0.8" />
    </g>

    <!-- Spiral Piping Trajectory Ribbon -->
    <path
      ref="spiralPathEl"
      d="M 120,88 Q 140,94 160,86 Q 185,76 195,88 Q 180,68 155,62 Q 135,68 150,50 Q 165,34 160,18"
      stroke="#FFFFFF"
      stroke-width="12"
      stroke-linecap="round"
      fill="none"
      opacity="0"
    />

    <!-- ==========================================
         SCULPTED MATTE STAR-FLUTED WHIPPED CREAM BODY
         ========================================== -->
    <g
      ref="creamGroupEl"
      :style="{
        transform: `translate(${(tiltY / 15) * 3}px, ${(tiltX / 12) * -1.5}px)`,
        display: withCream ? 'block' : 'none',
      }"
      class="transition-transform duration-200 ease-out"
    >
      <!-- Base Contact Shadow over Coffee -->
      <ellipse
        cx="160"
        cy="90"
        rx="62"
        ry="15"
        fill="rgba(0, 0, 0, 0.32)"
        filter="url(#shadowBlur)"
      />

      <!-- Deep fold crevice shadows (Occlusion) -->
      <path
        d="M 102,90 Q 116,74 130,86 Q 148,70 165,85 Q 185,72 200,85 Q 212,78 220,90"
        stroke="url(#creamDeepShadow)"
        stroke-width="7"
        stroke-linecap="round"
        fill="none"
        filter="url(#creamDeepBlur)"
      />

      <!-- Tier 1: Base Voluptuous Star Lobes -->
      <path d="M 100,90 C 100,68 118,60 132,74 C 122,86 112,94 100,90 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />
      <path d="M 124,80 C 126,56 148,50 160,68 C 146,78 135,85 124,80 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />
      <path d="M 152,70 C 160,50 184,54 196,74 C 182,82 168,82 152,70 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />
      <path d="M 188,76 C 198,62 218,68 220,90 C 208,94 198,88 188,76 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />

      <!-- Tier 2: Mid Spiral Lobes -->
      <path d="M 116,68 C 120,44 142,34 158,48 C 144,58 130,65 116,68 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />
      <path d="M 142,50 C 150,30 174,32 186,52 C 172,60 156,60 142,50 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />
      <path d="M 174,54 C 184,38 200,44 204,64 C 194,70 184,66 174,54 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />

      <!-- Tier 3: Crown Peak & Curled Tip -->
      <path d="M 136,40 C 142,20 156,12 162,28 C 154,36 144,40 136,40 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />
      <path d="M 150,30 C 156,12 170,14 174,32 C 166,36 158,36 150,30 Z" fill="url(#realCreamBody)" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.2" />
      <!-- Star Peak Tip Horn -->
      <path d="M 152,26 C 156,10 166,-4 163,-8 C 158,-7 154,2 152,14 Z" fill="#FFFFFF" stroke="rgba(255, 255, 255, 0.95)" stroke-width="1" />

      <!-- Fluted Star Ridges (Highlights) -->
      <path d="M 112,82 Q 130,68 152,78" stroke="url(#creamHighlight)" stroke-width="2.6" stroke-linecap="round" fill="none" />
      <path d="M 136,70 Q 158,54 182,66" stroke="url(#creamHighlight)" stroke-width="2.8" stroke-linecap="round" fill="none" />
      <path d="M 126,52 Q 150,34 172,46" stroke="url(#creamHighlight)" stroke-width="2.6" stroke-linecap="round" fill="none" />
      <path d="M 144,34 Q 160,18 174,28" stroke="url(#creamHighlight)" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <path d="M 155,16 Q 161,2 163,-6" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" fill="none" />
    </g>
  </g>
</template>


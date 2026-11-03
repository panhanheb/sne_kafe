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

// Component Refs
const creamContainerEl = ref<SVGGElement | null>(null)
const tier1El = ref<SVGGElement | null>(null)
const tier2El = ref<SVGGElement | null>(null)
const tier3El = ref<SVGGElement | null>(null)
const nozzleEl = ref<SVGGElement | null>(null)
const creamHaloEl = ref<SVGEllipseElement | null>(null)

const activeTl = ref<gsap.core.Timeline | null>(null)
const isPiped = ref(false)

// Watch withCream prop to trigger realistic barista piping or melting removal
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
      isPiped.value = true

      // Reset initial states before animation
      if (creamContainerEl.value && tier1El.value && tier2El.value && tier3El.value && nozzleEl.value && creamHaloEl.value) {
        gsap.set(creamContainerEl.value, { opacity: 1, scale: 1, y: 0 })
        gsap.set(tier1El.value, { opacity: 0, scale: 0.2, transformOrigin: '160px 88px' })
        gsap.set(tier2El.value, { opacity: 0, scale: 0.1, transformOrigin: '160px 65px' })
        gsap.set(tier3El.value, { opacity: 0, scale: 0.1, y: 20, transformOrigin: '160px 35px' })
        gsap.set(creamHaloEl.value, { opacity: 0, scale: 0.4, transformOrigin: '160px 90px' })
        gsap.set(nozzleEl.value, { opacity: 0, x: 200, y: -60, rotation: 15, scale: 0.9 })

        // 1. Barista Stainless Steel Star Nozzle swoops in
        tl.to(nozzleEl.value, {
          opacity: 1,
          x: 195,
          y: 75,
          rotation: -8,
          duration: 0.32,
          ease: 'power2.out',
        })

        // 2. Nozzle pipes Tier 1 (Base Ring around cup rim)
        .to(nozzleEl.value, {
          x: 125,
          y: 84,
          rotation: 12,
          duration: 0.45,
          ease: 'sine.inOut',
        })
        .to(
          tier1El.value,
          {
            opacity: 1,
            scale: 1,
            duration: 0.48,
            ease: 'back.out(1.4)',
          },
          `-0.4`
        )
        // Milk contact halo diffuses into coffee
        .to(
          creamHaloEl.value,
          {
            opacity: 0.85,
            scale: 1,
            duration: 0.4,
            ease: 'power1.out',
          },
          `-0.35`
        )

        // 3. Nozzle spirals inward and upward to pipe Tier 2 (Middle Swirl)
        .to(nozzleEl.value, {
          x: 172,
          y: 52,
          rotation: -14,
          duration: 0.42,
          ease: 'sine.inOut',
        })
        .to(
          tier2El.value,
          {
            opacity: 1,
            scale: 1,
            duration: 0.44,
            ease: 'back.out(1.5)',
          },
          `-0.38`
        )

        // 4. Nozzle swirls to center peak to pipe Tier 3 (Crown & Tip)
        .to(nozzleEl.value, {
          x: 160,
          y: 18,
          rotation: 0,
          duration: 0.38,
          ease: 'sine.out',
        })
        .to(
          tier3El.value,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.42,
            ease: 'back.out(1.6)',
          },
          `-0.32`
        )

        // 5. Authentic Barista Pull-off Flick (Nozzle lifts away)
        .to(nozzleEl.value, {
          x: 163,
          y: 6,
          duration: 0.12,
          ease: 'power1.in',
        })
        .to(nozzleEl.value, {
          x: 170,
          y: -90,
          opacity: 0,
          duration: 0.28,
          ease: 'power2.in',
        })

        // 6. Luscious Organic Cream Jiggle & Recoil (settling onto coffee)
        .to(
          creamContainerEl.value,
          {
            scaleY: 1.07,
            scaleX: 0.96,
            duration: 0.12,
            ease: 'sine.in',
          },
          `-0.25`
        )
        .to(
          creamContainerEl.value,
          {
            scaleY: 1,
            scaleX: 1,
            duration: 0.65,
            ease: 'elastic.out(1.4, 0.4)',
          }
        )
      }
    } else {
      // Removing cream: melts and dissolves smoothly into coffee
      if (creamContainerEl.value && creamHaloEl.value) {
        tl.to(creamContainerEl.value, {
          scaleY: 0.2,
          scaleX: 0.7,
          y: 20,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.in',
          onComplete: () => {
            isPiped.value = false
          }
        })
        .to(
          creamHaloEl.value,
          {
            opacity: 0,
            scale: 0.6,
            duration: 0.3,
            ease: 'power1.out',
          },
          `-0.3`
        )
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
    <!-- ==========================================
         1. CONTACT SHADOW & COFFEE MILK DIFFUSION HALO
         ========================================== -->
    <ellipse
      ref="creamHaloEl"
      cx="160"
      cy="90"
      rx="63"
      ry="16"
      fill="rgba(245, 235, 222, 0.4)"
      stroke="rgba(255, 255, 255, 0.45)"
      stroke-width="1.5"
      filter="url(#shadowBlur)"
      opacity="0"
    />
    <ellipse
      v-if="withCream && isPiped"
      cx="160"
      cy="91"
      rx="61"
      ry="14.5"
      fill="rgba(35, 18, 8, 0.38)"
      filter="url(#shadowBlur)"
    />

    <!-- ==========================================
         2. MULTI-TIER REALISTIC WHIPPED CREAM BILLOWS
         ========================================== -->
    <g
      ref="creamContainerEl"
      :style="{
        transform: `translate(${(tiltY / 15) * 3}px, ${(tiltX / 12) * -1.5}px)`,
        display: withCream ? 'block' : 'none',
        transformOrigin: '160px 90px',
      }"
      class="transition-transform duration-200 ease-out"
    >
      <!-- ====================================================
           TIER 1: WIDE VOLUPTUOUS BASE LOBES (Rests on Coffee Rim)
           ==================================================== -->
      <g ref="tier1El">
        <!-- Deep Under-Crevice Occlusion Shadows -->
        <path
          d="M 101,90 Q 116,73 130,86 Q 148,70 165,85 Q 185,72 200,85 Q 212,78 221,90"
          stroke="url(#creamDeepShadow)"
          stroke-width="8"
          stroke-linecap="round"
          fill="none"
          filter="url(#creamDeepBlur)"
        />

        <!-- Base Lobe 1 (Left Rim Pillow) -->
        <path
          d="M 98,90 C 98,66 118,58 132,74 C 122,86 112,94 98,90 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />
        <!-- Base Lobe 2 (Left-Center Lobe) -->
        <path
          d="M 124,80 C 126,55 148,48 160,68 C 146,78 135,86 124,80 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />
        <!-- Base Lobe 3 (Right-Center Lobe) -->
        <path
          d="M 152,70 C 160,48 184,52 196,74 C 182,82 168,82 152,70 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />
        <!-- Base Lobe 4 (Right Rim Pillow) -->
        <path
          d="M 188,76 C 198,60 220,66 222,90 C 208,94 198,88 188,76 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />

        <!-- Tier 1 Specular Star Ridges -->
        <path d="M 108,84 Q 128,70 148,80" stroke="url(#creamHighlight)" stroke-width="2.6" stroke-linecap="round" fill="none" />
        <path d="M 134,72 Q 158,56 182,68" stroke="url(#creamHighlight)" stroke-width="2.8" stroke-linecap="round" fill="none" />
      </g>

      <!-- ====================================================
           TIER 2: SPIRALING MIDDLE LAYER (Stacked Above Base)
           ==================================================== -->
      <g ref="tier2El">
        <!-- Mid Occlusion Shadow -->
        <path
          d="M 115,70 Q 138,52 160,64 Q 182,50 205,68"
          stroke="url(#creamDeepShadow)"
          stroke-width="6"
          stroke-linecap="round"
          fill="none"
          filter="url(#creamDeepBlur)"
        />

        <!-- Mid Lobe Left -->
        <path
          d="M 116,68 C 120,44 142,34 158,48 C 144,58 130,65 116,68 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />
        <!-- Mid Lobe Center -->
        <path
          d="M 142,50 C 150,28 174,30 186,52 C 172,60 156,60 142,50 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />
        <!-- Mid Lobe Right -->
        <path
          d="M 174,54 C 184,36 200,42 204,64 C 194,70 184,66 174,54 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />

        <!-- Tier 2 Specular Star Ridges -->
        <path d="M 124,54 Q 148,36 172,48" stroke="url(#creamHighlight)" stroke-width="2.8" stroke-linecap="round" fill="none" />
        <path d="M 152,44 Q 174,30 196,44" stroke="url(#creamHighlight)" stroke-width="2.4" stroke-linecap="round" fill="none" />
      </g>

      <!-- ====================================================
           TIER 3: CROWN SOFT-SERVE PEAK & CURLED TIP HORN
           ==================================================== -->
      <g ref="tier3El">
        <!-- Crown Peak Billow Left -->
        <path
          d="M 136,40 C 142,18 156,10 162,26 C 154,34 144,38 136,40 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />
        <!-- Crown Peak Billow Right -->
        <path
          d="M 150,30 C 156,10 170,12 174,30 C 166,34 158,34 150,30 Z"
          fill="url(#realCreamBody)"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.2"
        />
        <!-- Hand-Piped Swirling Curled Tip Peak -->
        <path
          d="M 152,24 C 156,8 166,-6 163,-10 C 158,-9 154,0 152,12 Z"
          fill="#FFFFFF"
          stroke="rgba(255, 255, 255, 0.98)"
          stroke-width="1.1"
          filter="drop-shadow(0 2px 4px rgba(200, 180, 160, 0.4))"
        />

        <!-- Crown Specular Glints -->
        <path d="M 142,32 Q 158,16 172,26" stroke="url(#creamHighlight)" stroke-width="2.2" stroke-linecap="round" fill="none" />
        <path d="M 155,14 Q 161,0 163,-8" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" fill="none" />
      </g>
    </g>

    <!-- ==========================================
         3. REALISTIC STAINLESS STEEL STAR NOZZLE (Barista Dispenser Tip)
         ========================================== -->
    <g ref="nozzleEl" opacity="0" class="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]">
      <!-- Metallic Canister Pipe Tube -->
      <path
        d="M -14,-75 L 14,-75 L 11,-22 L -11,-22 Z"
        fill="url(#metallicTubeGrad)"
        stroke="#64748B"
        stroke-width="1"
      />
      <!-- Specular Highlight Streak on Tube -->
      <line x1="-3" y1="-75" x2="-2" y2="-22" stroke="rgba(255, 255, 255, 0.85)" stroke-width="2" />

      <!-- Serrated Star Piping Tip Nozzle -->
      <path
        d="M -11,-22 L 11,-22 L 7,0 L -7,0 Z"
        fill="url(#metallicStarTipGrad)"
        stroke="#475569"
        stroke-width="1.2"
      />
      <!-- Fluted Star Teeth on Nozzle Edge -->
      <polygon points="-7,0 -5,-4 -3,0 -1,-4 1,0 3,-4 5,0 7,-4 7,0" fill="#334155" />
      <line x1="0" y1="-22" x2="0" y2="-1" stroke="rgba(255, 255, 255, 0.9)" stroke-width="1.5" />
    </g>
  </g>
</template>

<style scoped>
/* Gradient defs for stainless steel nozzle */
</style>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, nextTick } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  withCream: boolean
  liquidTopY: number
  tiltX: number
  tiltY: number
  isEmpty: boolean
}>()

const creamContainerEl = ref<SVGGElement | null>(null)
const creamHaloEl = ref<SVGEllipseElement | null>(null)
const activeTl = ref<gsap.core.Timeline | null>(null)
const isPiped = ref(false)

watch(
  () => props.withCream,
  async (val) => {
    if (activeTl.value) {
      activeTl.value.kill()
      activeTl.value = null
    }

    if (val && !props.isEmpty) {
      isPiped.value = true
      await nextTick()

      if (creamContainerEl.value && creamHaloEl.value) {
        // Reset to initial extrusion state
        gsap.set(creamContainerEl.value, {
          opacity: 0,
          scaleX: 0.35,
          scaleY: 0.08,
          transformOrigin: '0px 0px',
        })
        gsap.set(creamHaloEl.value, {
          opacity: 0,
          scaleX: 0.5,
          scaleY: 0.5,
          transformOrigin: '0px 0px',
        })

        const tl = gsap.timeline({
          onComplete: () => {
            activeTl.value = null
          }
        })
        activeTl.value = tl

        // 1. Soft-serve cream begins extruding upwards and expanding onto coffee surface
        tl.to(creamContainerEl.value, {
          opacity: 1,
          scaleX: 1.05,
          scaleY: 1.1,
          duration: 0.5,
          ease: 'power2.out',
        })
        // Contact shadow & milk halo diffuses smoothly into coffee
        .to(
          creamHaloEl.value,
          {
            opacity: 0.85,
            scaleX: 1,
            scaleY: 1,
            duration: 0.42,
            ease: 'power1.out',
          },
          0.08
        )
        // 2. Realistic Dairy Cream Recoil & Jiggle (natural soft-serve settlement)
        .to(
          creamContainerEl.value,
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.72,
            ease: 'elastic.out(1.2, 0.36)',
          },
          `-0.08`
        )
      }
    } else {
      if (creamContainerEl.value && creamHaloEl.value && isPiped.value) {
        const tl = gsap.timeline({
          onComplete: () => {
            isPiped.value = false
            activeTl.value = null
          }
        })
        activeTl.value = tl

        // Cream smoothly melts and dissolves down into the coffee
        tl.to(creamContainerEl.value, {
          scaleX: 0.7,
          scaleY: 0.1,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.in',
        })
        .to(
          creamHaloEl.value,
          {
            opacity: 0,
            scaleX: 0.6,
            scaleY: 0.6,
            duration: 0.28,
            ease: 'power1.out',
          },
          `-0.2`
        )
      } else {
        isPiped.value = false
      }
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (activeTl.value) {
    activeTl.value.kill()
    activeTl.value = null
  }
})
</script>

<template>
  <!-- Outer group anchored directly to liquid surface (160, liquidTopY) -->
  <g
    v-if="withCream || isPiped"
    :transform="`translate(${160 + (tiltY / 15) * 4}, ${liquidTopY}) rotate(${tiltY * 0.2})`"
    class="cream-topping-group pointer-events-none select-none"
  >
    <!-- Soft Contact Shadow & Cream Meniscus Anchor on Coffee Surface -->
    <ellipse
      ref="creamHaloEl"
      cx="0"
      cy="2"
      rx="58"
      ry="13"
      fill="rgba(30, 15, 6, 0.45)"
      filter="url(#shadowBlur)"
      opacity="0"
    />

    <!-- Inner Cream Container animated by GSAP from origin (0, 0) -->
    <g ref="creamContainerEl" style="transform-origin: 0px 0px">
      <!-- ====================================================
           1. BASE BLEND POOL (Touches coffee with warm dairy transition)
           ==================================================== -->
      <ellipse
        cx="0"
        cy="0"
        rx="56"
        ry="13"
        fill="url(#creamBaseContactGrad)"
        opacity="0.95"
      />

      <!-- ====================================================
           2. SOLID VOLUMETRIC SCULPTED CREAM SILHOUETTE
              (100% continuous, zero gaps, perfectly opaque foundation)
           ==================================================== -->
      <path
        d="M -56,0
           C -62,-14 -56,-26 -46,-34
           C -52,-44 -42,-56 -32,-64
           C -36,-72 -22,-84 -8,-94
           C -2,-99 6,-101 12,-95
           C 16,-91 14,-85 10,-81
           C 20,-75 28,-63 26,-53
           C 38,-47 48,-35 44,-24
           C 54,-18 58,-8 56,0
           C 38,10 -38,10 -56,0 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.85)"
        stroke-width="1.2"
        filter="drop-shadow(0 4px 10px rgba(40, 20, 8, 0.28))"
      />

      <!-- Ambient Occlusion Shadow for Coil Separation -->
      <path
        d="M -48,-28 Q 0,-18 46,-26 Q 0,-34 -48,-28 Z"
        fill="url(#creamCoilShadow)"
        opacity="0.75"
      />
      <path
        d="M -34,-58 Q 0,-50 30,-54 Q 0,-64 -34,-58 Z"
        fill="url(#creamCoilShadow)"
        opacity="0.7"
      />

      <!-- ====================================================
           3. TIER 1: FLUTED STAR-NOZZLE BASE BILLOWS (Bottom Ring)
           ==================================================== -->
      <!-- Left Outer Fluted Lobe -->
      <path
        d="M -54,-2 C -60,-16 -44,-28 -32,-24 C -42,-14 -46,-2 -54,-2 Z"
        fill="url(#creamTier1Lobe)"
        stroke="rgba(255, 255, 255, 0.9)"
        stroke-width="1.4"
      />
      <!-- Mid-Left Billow Lobe -->
      <path
        d="M -36,-22 C -24,-30 -4,-28 4,-20 C -8,-10 -24,-12 -36,-22 Z"
        fill="url(#creamTier1Lobe)"
        stroke="rgba(255, 255, 255, 0.9)"
        stroke-width="1.4"
      />
      <!-- Mid-Right Billow Lobe -->
      <path
        d="M 2,-20 C 16,-28 36,-26 44,-16 C 32,-8 14,-10 2,-20 Z"
        fill="url(#creamTier1Lobe)"
        stroke="rgba(255, 255, 255, 0.9)"
        stroke-width="1.4"
      />
      <!-- Right Outer Fluted Lobe -->
      <path
        d="M 38,-18 C 50,-24 58,-12 54,0 C 46,2 34,-8 38,-18 Z"
        fill="url(#creamTier1Lobe)"
        stroke="rgba(255, 255, 255, 0.9)"
        stroke-width="1.4"
      />

      <!-- Tier 1 Soft Star-Crevice Shadows -->
      <path d="M -34,-20 Q -38,-10 -42,2" stroke="url(#creamCreviceGrad)" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8" />
      <path d="M 2,-18 Q -2,-8 -4,4" stroke="url(#creamCreviceGrad)" stroke-width="2.8" stroke-linecap="round" fill="none" opacity="0.85" />
      <path d="M 38,-16 Q 34,-6 32,4" stroke="url(#creamCreviceGrad)" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8" />

      <!-- Tier 1 Specular Ridge Glints -->
      <path d="M -48,-16 Q -40,-24 -32,-22" stroke="url(#creamSpecularGlint)" stroke-width="2.4" stroke-linecap="round" fill="none" />
      <path d="M -22,-24 Q -8,-28 2,-18" stroke="url(#creamSpecularGlint)" stroke-width="2.4" stroke-linecap="round" fill="none" />
      <path d="M 12,-20 Q 26,-26 40,-16" stroke="url(#creamSpecularGlint)" stroke-width="2.4" stroke-linecap="round" fill="none" />

      <!-- ====================================================
           4. TIER 2: SWIRLING MID-COIL BODY (Smooth Spiral Wave)
           ==================================================== -->
      <!-- Mid-Coil Solid Spiral Body -->
      <path
        d="M -44,-32
           C -48,-48 -28,-58 -10,-52
           C 10,-46 32,-46 38,-34
           C 22,-38 2,-40 -12,-36
           C -26,-32 -38,-28 -44,-32 Z"
        fill="url(#creamTier2Body)"
        stroke="rgba(255, 255, 255, 0.92)"
        stroke-width="1.3"
      />
      <!-- Mid-Tier Fluted Star Ridge Lines -->
      <path
        d="M -28,-36 C -20,-50 -2,-52 14,-44"
        stroke="url(#creamSpecularGlint)"
        stroke-width="2.6"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M -8,-50 Q 12,-52 26,-42"
        stroke="url(#creamSpecularGlint)"
        stroke-width="2.2"
        stroke-linecap="round"
        fill="none"
      />
      <!-- Mid-Tier Crevice Shadow -->
      <path
        d="M -12,-36 Q -6,-46 8,-44"
        stroke="url(#creamCreviceGrad)"
        stroke-width="2.2"
        stroke-linecap="round"
        fill="none"
        opacity="0.75"
      />

      <!-- ====================================================
           5. TIER 3: CROWN PEAK & CURLED BARISTA SWIRL TIP
           ==================================================== -->
      <!-- Crown Swirl Cone -->
      <path
        d="M -26,-56
           C -30,-72 -14,-86 -2,-92
           C 4,-95 10,-91 8,-84
           C 16,-76 22,-64 22,-52
           C 10,-58 -8,-60 -26,-56 Z"
        fill="url(#creamCrownBody)"
        stroke="rgba(255, 255, 255, 0.95)"
        stroke-width="1.2"
      />

      <!-- Hand-Piped Swirling Curled Tip Horn (The Iconic Barista Flick!) -->
      <path
        d="M -4,-86
           C -6,-95 0,-102 6,-101
           C 12,-100 13,-93 8,-86
           C 4,-80 -2,-78 -4,-86 Z"
        fill="#FFFFFF"
        stroke="rgba(255, 255, 255, 0.98)"
        stroke-width="1.4"
        filter="drop-shadow(0 2px 4px rgba(180, 140, 110, 0.35))"
      />

      <!-- Crown Specular Glints & Wet Gloss Streak -->
      <path
        d="M -18,-64 Q -4,-80 4,-90"
        stroke="url(#creamSpecularGlint)"
        stroke-width="2.5"
        stroke-linecap="round"
        fill="none"
      />
      <path
        d="M 2,-98 Q 7,-100 9,-94"
        stroke="#FFFFFF"
        stroke-width="2.4"
        stroke-linecap="round"
        fill="none"
      />
      <!-- Soft Cream Crease on Peak -->
      <path
        d="M -6,-68 Q 2,-78 6,-84"
        stroke="url(#creamCreviceGrad)"
        stroke-width="1.8"
        stroke-linecap="round"
        fill="none"
        opacity="0.7"
      />
    </g>
  </g>
</template>

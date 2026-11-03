<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import { useSlosh } from '~/composables/useSlosh'
import GlassBody from './cup/GlassBody.vue'
import LiquidLayers from './cup/LiquidLayers.vue'
import IceCubes from './cup/IceCubes.vue'
import CreamTopping from './cup/CreamTopping.vue'
import CaramelDrizzle from './cup/CaramelDrizzle.vue'
import CocoaDust from './cup/CocoaDust.vue'
import PourStream from './cup/PourStream.vue'
import SugarSwirl from './cup/SugarSwirl.vue'

const props = withDefaults(
  defineProps<{
    productId: string
    productName: string
    size: 'S' | 'M' | 'L'
    iceLevel: 'none' | 'less' | 'regular' | 'extra'
    withCream: boolean
    withExtraShot: boolean
    withCocoa: boolean
    withCaramel: boolean
    isPouring?: boolean
    tiltX?: number
    tiltY?: number
    isEmpty?: boolean
    sweetness?: string
  }>(),
  {
    isPouring: false,
    tiltX: 0,
    tiltY: 0,
    isEmpty: false,
    sweetness: '50%',
  }
)

// Tilt Slosh Physics
const { surfaceAngle, sloshWave, liquidOffsetX } = useSlosh(
  () => props.tiltX || 0,
  () => props.tiltY || 0
)

// Smooth Morphing Scale for Cup Sizes (S / M / L)
const animatedScale = ref(1.0)
watch(
  () => props.size,
  (newSize) => {
    const targetScale = newSize === 'S' ? 0.92 : newSize === 'M' ? 1.0 : 1.08
    gsap.to(animatedScale, {
      value: targetScale,
      duration: 0.45,
      ease: 'back.out(1.5)',
    })
  },
  { immediate: true }
)

// Drink categorization
const isIced = computed(() => {
  const id = props.productId.toLowerCase()
  return id.includes('iced') || id.includes('cold') || props.iceLevel !== 'none'
})

const isHot = computed(() => {
  return !isIced.value
})

// Dynamic Liquid Level & Volume Displacement
const liquidHeightPercentage = computed(() => {
  if (props.isEmpty) return 0
  
  // Standard cafe full cup baseline
  let pct = 86
  if (props.size === 'S') pct = 83
  if (props.size === 'L') pct = 89

  // Ice displacement volume
  if (props.iceLevel === 'less') pct = 85
  if (props.iceLevel === 'regular') pct = 88
  if (props.iceLevel === 'extra') pct = 91

  // Extra shot displacement
  if (props.withExtraShot) pct += 3

  // Whipped cream fills drink right up to rim
  if (props.withCream) pct = Math.max(pct, 88)

  return Math.min(pct, 93)
})

// Liquid Top Y coordinate in SVG viewBox (range: base 310 to top 95)
const targetLiquidTopY = computed(() => {
  if (props.isEmpty) return 310
  const base = 310
  const maxFill = 95
  const height = (base - maxFill) * (liquidHeightPercentage.value / 100)
  return Math.round(base - height)
})

// Smoothly animated liquidTopY
const animatedLiquidTopY = ref(targetLiquidTopY.value)
watch(
  targetLiquidTopY,
  (newY) => {
    gsap.to(animatedLiquidTopY, {
      value: newY,
      duration: 0.45,
      ease: 'power2.out',
    })
  },
  { immediate: true }
)

// Splash Particle Burst when Ice hits liquid
const splashDroplets = ref<Array<{ id: number; cx: number; cy: number; r: number; fill: string }>>([])
const splashRing = ref<{ cx: number; cy: number; rx: number; ry: number; opacity: number } | null>(null)
let splashId = 0

function handleIceSplash({ x, y }: { x: number; y: number }) {
  // Spawn ripple ring on surface
  splashRing.value = {
    cx: x,
    cy: y,
    rx: 6,
    ry: 2,
    opacity: 0.9,
  }

  gsap.to(splashRing.value, {
    rx: 26,
    ry: 8,
    opacity: 0,
    duration: 0.6,
    ease: 'power1.out',
    onComplete: () => {
      splashRing.value = null
    }
  })

  // Spawn 4 coffee splash droplets
  const drops = [
    { id: ++splashId, cx: x - 6, cy: y - 8, r: 2.2, fill: '#D4A373' },
    { id: ++splashId, cx: x - 2, cy: y - 14, r: 2.8, fill: '#BA7A46' },
    { id: ++splashId, cx: x + 4, cy: y - 16, r: 2.5, fill: '#D4A373' },
    { id: ++splashId, cx: x + 8, cy: y - 10, r: 2.0, fill: '#BA7A46' },
  ]
  splashDroplets.value = drops

  drops.forEach((d, i) => {
    const vx = (i - 1.5) * 5
    gsap.to(d, {
      cx: d.cx + vx,
      cy: y + 4,
      duration: 0.45,
      ease: 'power2.in',
    })
  })

  setTimeout(() => {
    splashDroplets.value = []
  }, 480)
}
</script>

<template>
  <div
    class="relative w-full max-w-[340px] aspect-[320/400] flex items-center justify-center select-none"
    style="perspective: 1200px"
  >
    <!-- 3D Transform Wrapper -->
    <div
      class="relative w-full h-full flex items-center justify-center transition-transform duration-150 ease-out preserve-3d will-change-transform"
      :style="{
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${animatedScale})`,
      }"
    >
      <!-- Ambient Liquid Glow behind glass cup -->
      <div
        class="absolute inset-x-8 top-12 bottom-8 rounded-full blur-2xl opacity-40 transition-colors duration-700 pointer-events-none -z-10 bg-amber-700/25"
      />

      <!-- Main Layered SVG Canvas -->
      <svg
        viewBox="0 0 320 400"
        class="w-full h-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.48)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- Interior Cup Clip Path (keeps liquid, ice, and drips strictly inside) -->
          <clipPath id="cupInteriorClip">
            <path
              d="M 97,90 L 121,308 Q 123,326 160,326 Q 197,326 199,308 L 223,90 Q 160,105 97,90 Z"
            />
          </clipPath>

          <!-- Glass Refraction Displacement Filter -->
          <filter id="glassRefract" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          <!-- Glass Wall Specular Wash -->
          <linearGradient id="glassWallWash" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.45)" />
            <stop offset="15%" stop-color="rgba(255, 255, 255, 0.12)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.03)" />
            <stop offset="85%" stop-color="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.35)" />
          </linearGradient>

          <!-- Cylindrical Highlights -->
          <linearGradient id="leftSpecularStreak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.75)" />
            <stop offset="70%" stop-color="rgba(255, 255, 255, 0.25)" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>

          <linearGradient id="rightSpecularStreak" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.5)" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>

          <linearGradient id="rimHighlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.85)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.8)" />
          </linearGradient>

          <!-- Glass Base Lens -->
          <linearGradient id="glassBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.25)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.08)" />
          </linearGradient>

          <!-- Caustic Light Pool -->
          <radialGradient id="causticGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(235, 175, 110, 0.45)" />
            <stop offset="60%" stop-color="rgba(15, 118, 110, 0.15)" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>

          <!-- Photorealistic 3D Ice Shading -->
          <linearGradient id="realIceRefract" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.8)" />
            <stop offset="30%" stop-color="rgba(255, 255, 255, 0.35)" />
            <stop offset="65%" stop-color="rgba(215, 170, 130, 0.28)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.85)" />
          </linearGradient>

          <radialGradient id="iceFrostCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.95)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.55)" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>

          <!-- Photorealistic 3D Whipped Cream System Gradients -->
          <radialGradient id="creamBaseContactGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFFDFB" stop-opacity="0.95" />
            <stop offset="60%" stop-color="#F7EFE4" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#DFCBBA" stop-opacity="0.4" />
          </radialGradient>

          <linearGradient id="realCreamBody" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="35%" stop-color="#FFFDF9" />
            <stop offset="65%" stop-color="#FAF1E5" />
            <stop offset="85%" stop-color="#EFE1CF" />
            <stop offset="100%" stop-color="#E2D0BC" />
          </linearGradient>

          <linearGradient id="creamCoilShadow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(180, 150, 125, 0.45)" />
            <stop offset="100%" stop-color="rgba(220, 195, 175, 0.05)" />
          </linearGradient>

          <linearGradient id="creamTier1Lobe" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="40%" stop-color="#FFFDF9" />
            <stop offset="75%" stop-color="#F7EEE2" />
            <stop offset="100%" stop-color="#EBDCCB" />
          </linearGradient>

          <linearGradient id="creamTier2Body" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="45%" stop-color="#FFFDFB" />
            <stop offset="80%" stop-color="#F8F0E6" />
            <stop offset="100%" stop-color="#ECDDCF" />
          </linearGradient>

          <linearGradient id="creamCrownBody" x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="60%" stop-color="#FFFDF9" />
            <stop offset="100%" stop-color="#F5EBE0" />
          </linearGradient>

          <linearGradient id="creamCreviceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(190, 160, 135, 0.75)" />
            <stop offset="60%" stop-color="rgba(210, 185, 165, 0.5)" />
            <stop offset="100%" stop-color="rgba(230, 210, 195, 0.15)" />
          </linearGradient>

          <linearGradient id="creamSpecularGlint" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.95)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.7)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.1)" />
          </linearGradient>

          <!-- Caramel Sauce -->
          <linearGradient id="realCaramel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F7BA65" />
            <stop offset="35%" stop-color="#D97F24" />
            <stop offset="75%" stop-color="#9C4A08" />
            <stop offset="100%" stop-color="#5E2703" />
          </linearGradient>

          <linearGradient id="caramelSpecular" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.85)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>

          <!-- Espresso Pour Stream -->
          <linearGradient id="pourStreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3A1504" stop-opacity="0.95" />
            <stop offset="80%" stop-color="#5C3116" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#C89264" stop-opacity="1" />
          </linearGradient>

          <!-- Stainless Steel Barista Dispenser Star Tip Gradients -->
          <linearGradient id="metallicTubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#94A3B8" />
            <stop offset="25%" stop-color="#E2E8F0" />
            <stop offset="50%" stop-color="#FFFFFF" />
            <stop offset="75%" stop-color="#CBD5E1" />
            <stop offset="100%" stop-color="#64748B" />
          </linearGradient>

          <linearGradient id="metallicStarTipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#475569" />
            <stop offset="30%" stop-color="#CBD5E1" />
            <stop offset="60%" stop-color="#FFFFFF" />
            <stop offset="85%" stop-color="#94A3B8" />
            <stop offset="100%" stop-color="#334155" />
          </linearGradient>

          <!-- Filter Definitions -->
          <filter id="shadowBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
          <filter id="creamDeepBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <filter id="steamBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="iceDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.32" />
          </filter>
        </defs>

        <!-- ==========================================
             LAYER 1: Glass Cup Back Rim & Base Lens
             ========================================== -->
        <ellipse
          cx="160"
          cy="90"
          rx="63"
          ry="15"
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(255, 255, 255, 0.3)"
          stroke-width="1.5"
        />

        <!-- ==========================================
             LAYER 2: INSIDE CUP (Clipped by Interior Tumbler)
             ========================================== -->
        <g clip-path="url(#cupInteriorClip)">
          <!-- Clean Glass Refraction Interior Depth -->
          <rect x="90" y="85" width="140" height="245" fill="rgba(255, 255, 255, 0.02)" />

          <!-- 2A. Liquid Layers (Coffee / Milk / Crema) -->
          <LiquidLayers
            :product-id="productId"
            :liquid-top-y="animatedLiquidTopY"
            :surface-angle="surfaceAngle"
            :slosh-wave="sloshWave"
            :liquid-offset-x="liquidOffsetX"
            :is-empty="isEmpty"
            :with-extra-shot="withExtraShot"
          />

          <!-- 2B. Cane Sugar Swirl -->
          <SugarSwirl
            :sweetness="sweetness"
            :liquid-top-y="animatedLiquidTopY"
            :is-empty="isEmpty"
          />

          <!-- 2C. Submerged 3D Ice Cubes (0 / 3 / 5 / 7) -->
          <IceCubes
            :ice-level="iceLevel"
            :liquid-top-y="animatedLiquidTopY"
            :tilt-y="tiltY"
            :is-empty="isEmpty"
            @splash="handleIceSplash"
          />

          <!-- 2D. Splash Droplets & Ripple Ring -->
          <g v-if="splashRing" class="pointer-events-none">
            <ellipse
              :cx="splashRing.cx"
              :cy="splashRing.cy"
              :rx="splashRing.rx"
              :ry="splashRing.ry"
              fill="none"
              stroke="rgba(255, 255, 255, 0.85)"
              stroke-width="1.8"
              :opacity="splashRing.opacity"
            />
          </g>
          <g v-if="splashDroplets.length" class="pointer-events-none">
            <circle
              v-for="d in splashDroplets"
              :key="d.id"
              :cx="d.cx"
              :cy="d.cy"
              :r="d.r"
              :fill="d.fill"
            />
          </g>
        </g>

        <!-- ==========================================
             LAYER 3: TOPPING LAYERS (Cream, Caramel, Cocoa)
             ========================================== -->
        <!-- 3A. Whipped Cream (Star Fluted Nozzle Piping) -->
        <CreamTopping
          :with-cream="withCream"
          :liquid-top-y="animatedLiquidTopY"
          :tilt-x="tiltX"
          :tilt-y="tiltY"
          :is-empty="isEmpty"
        />

        <!-- 3B. Caramel Drizzle & Inside Wall Drips -->
        <CaramelDrizzle
          :with-caramel="withCaramel"
          :with-cream="withCream"
          :is-empty="isEmpty"
        />

        <!-- 3C. Cocoa Dusting (Sifter Shaking Shower) -->
        <CocoaDust
          :with-cocoa="withCocoa"
          :with-cream="withCream"
          :is-empty="isEmpty"
        />

        <!-- 3D. Espresso Pour Stream -->
        <PourStream
          :is-pouring="isPouring"
          :with-extra-shot="withExtraShot"
          :liquid-top-y="animatedLiquidTopY"
        />

        <!-- ==========================================
             LAYER 4: FRONT GLASS BODY, REFLECTIONS & CONDENSATION
             ========================================== -->
        <GlassBody
          :width="320"
          :height="400"
          :is-iced="isIced"
          :is-hot="isHot"
          :is-empty="isEmpty"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.preserve-3d {
  transform-style: preserve-3d;
}
</style>

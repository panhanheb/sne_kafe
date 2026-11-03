<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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
  }>(),
  {
    isPouring: false,
    tiltX: 0,
    tiltY: 0,
    isEmpty: false,
  }
)

// Animation trigger states
const isDroppingIce = ref(false)
const isBloomingCream = ref(false)
const isSplashing = ref(false)

// Re-trigger realistic ice drop + liquid splash physics
watch(
  () => props.iceLevel,
  (newVal, oldVal) => {
    if (newVal !== 'none' && newVal !== oldVal) {
      isDroppingIce.value = true
      isSplashing.value = true
      setTimeout(() => {
        isSplashing.value = false
      }, 700)
      setTimeout(() => {
        isDroppingIce.value = false
      }, 1100)
    }
  }
)

// Re-trigger realistic barista star-piping cream animation
watch(
  () => props.withCream,
  (newVal) => {
    if (newVal) {
      isBloomingCream.value = true
      setTimeout(() => {
        isBloomingCream.value = false
      }, 1000)
    }
  }
)

// Liquid Height and Colors based on drink type and customization
const liquidHeightPercentage = computed(() => {
  if (props.isEmpty) return 0
  let pct = 76
  if (props.size === 'S') pct = 65
  if (props.size === 'L') pct = 88
  if (props.iceLevel === 'extra') pct = Math.min(pct + 5, 92)
  if (props.withExtraShot) pct = Math.min(pct + 4, 94)
  return pct
})

// Top Y coordinate of liquid in SVG viewBox (range: base Y 308 down to top Y 100)
const liquidTopY = computed(() => {
  if (props.isEmpty) return 308
  const base = 308
  const maxFill = 100
  const height = (base - maxFill) * (liquidHeightPercentage.value / 100)
  return Math.round(base - height)
})

// Color Schemes per drink with authentic coffee tones
const drinkThemes = computed(() => {
  const id = props.productId.toLowerCase()
  if (id.includes('latte')) {
    return {
      topColor: '#FFF8F0', // Steamed milk microfoam
      midColor: '#C89264', // Golden espresso blend
      bottomColor: '#7A431D', // Dense espresso base
      foamColor: '#FFFDF8',
      swirlColor: '#B6733E',
      streamColor: '#5C3116',
      iceRefraction: '#C28B5E',
    }
  }
  if (id.includes('cappuccino')) {
    return {
      topColor: '#FFF5E8', // Silky velvety foam
      midColor: '#A3683A', // Crema
      bottomColor: '#4E240D', // Dark espresso roast
      foamColor: '#FFFDF9',
      swirlColor: '#8C4D20',
      streamColor: '#4A1F08',
      iceRefraction: '#94582D',
    }
  }
  if (id.includes('mocha')) {
    return {
      topColor: '#E6D3C2', // Chocolate cream
      midColor: '#5C2F18', // Mocha blend
      bottomColor: '#2B1107', // Dark melted chocolate
      foamColor: '#EADCCE',
      swirlColor: '#36180C',
      streamColor: '#2E1205',
      iceRefraction: '#4F2312',
    }
  }
  if (id.includes('coldbrew') || id.includes('iced')) {
    return {
      topColor: '#7C4322', // Amber iced brew
      midColor: '#4A2310', // Deep roast
      bottomColor: '#250F05', // Bottom cold extraction
      foamColor: '#C68759',
      swirlColor: '#421E0B',
      streamColor: '#3A1808',
      iceRefraction: '#613217',
    }
  }
  if (id.includes('matcha')) {
    return {
      topColor: '#E8F5E1', // Oat foam
      midColor: '#6B9E5A', // Jade matcha
      bottomColor: '#3D6F2F', // Rich ceremonial matcha
      foamColor: '#F0F8EC',
      swirlColor: '#4D823E',
      streamColor: '#3B6B2B',
      iceRefraction: '#558744',
    }
  }
  if (id.includes('macchiato')) {
    return {
      topColor: '#F8ECE0', // Vanilla foam
      midColor: '#B06E34', // Espresso mark
      bottomColor: '#E8CAAC', // Sweet vanilla milk
      foamColor: '#FFF8F0',
      swirlColor: '#C97A28',
      streamColor: '#5A2A0E',
      iceRefraction: '#A8662F',
    }
  }
  // Default Americano / Espresso
  return {
    topColor: '#96552B', // Golden Crema
    midColor: '#4A2311', // Espresso body
    bottomColor: '#1F0B03', // Dense roast
    foamColor: '#C6804E',
    swirlColor: '#52230B',
    streamColor: '#3A1504',
    iceRefraction: '#4C2411',
  }
})

// Number of ice cubes based on level
const iceCount = computed(() => {
  if (props.isEmpty) return 0
  switch (props.iceLevel) {
    case 'less':
      return 2
    case 'regular':
      return 4
    case 'extra':
      return 6
    default:
      return 0
  }
})

// Realistic Ice Cube positions & physical dimensions inside glass
const iceCubes = [
  { id: 1, x: 130, y: 228, w: 32, h: 28, rot: 14, delay: '0.0s', bobDelay: '0s' },
  { id: 2, x: 168, y: 206, w: 34, h: 30, rot: -16, delay: '0.12s', bobDelay: '0.6s' },
  { id: 3, x: 125, y: 162, w: 36, h: 32, rot: 24, delay: '0.24s', bobDelay: '1.2s' },
  { id: 4, x: 166, y: 146, w: 35, h: 30, rot: -12, delay: '0.36s', bobDelay: '1.8s' },
  { id: 5, x: 134, y: 114, w: 33, h: 29, rot: 32, delay: '0.48s', bobDelay: '0.4s' },
  { id: 6, x: 170, y: 116, w: 34, h: 30, rot: -22, delay: '0.58s', bobDelay: '1.4s' },
]

// Visible ice cubes
const visibleIceCubes = computed(() => {
  return iceCubes.slice(0, iceCount.value)
})

// Overall 3D scale based on size
const cupScale = computed(() => {
  if (props.size === 'S') return 0.92
  if (props.size === 'L') return 1.08
  return 1.0
})
</script>

<template>
  <div
    class="relative w-full max-w-[340px] aspect-[320/400] flex items-center justify-center select-none"
    style="perspective: 1200px"
  >
    <!-- 3D Transform Wrapper with GPU Acceleration -->
    <div
      class="relative w-full h-full flex items-center justify-center transition-transform duration-200 ease-out preserve-3d will-change-transform"
      :style="{
        transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${cupScale})`,
      }"
    >
      <!-- Ambient Liquid Glow behind glass cup -->
      <div
        class="absolute inset-x-8 top-12 bottom-8 rounded-full blur-2xl opacity-40 transition-colors duration-700 pointer-events-none -z-10"
        :style="{
          backgroundColor: isEmpty ? 'rgba(255, 255, 255, 0.08)' : drinkThemes.midColor,
        }"
      />

      <!-- Main SVG Scene -->
      <svg
        viewBox="0 0 320 400"
        class="w-full h-full filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- Interior Cup Clip Path (strictly clamps liquid, submerged ice, and inner drips) -->
          <clipPath id="cupInteriorClip">
            <path
              d="M 97,90 L 121,308 Q 123,322 160,322 Q 197,322 199,308 L 223,90 Q 160,105 97,90 Z"
            />
          </clipPath>

          <!-- Glass Wall Outer Specular Gradients -->
          <linearGradient id="glassWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.45)" />
            <stop offset="15%" stop-color="rgba(255, 255, 255, 0.12)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.03)" />
            <stop offset="85%" stop-color="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.35)" />
          </linearGradient>

          <!-- Glass Left Cylindrical Reflection Highlight -->
          <linearGradient id="glassReflectLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.6)" />
            <stop offset="60%" stop-color="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>

          <!-- Glass Right Subtle Reflection Highlight -->
          <linearGradient id="glassReflectRight" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>

          <!-- Dynamic Drink Liquid Gradient -->
          <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="drinkThemes.topColor" />
            <stop offset="18%" :stop-color="drinkThemes.topColor" />
            <stop offset="30%" :stop-color="drinkThemes.midColor" />
            <stop offset="70%" :stop-color="drinkThemes.bottomColor" />
            <stop offset="100%" :stop-color="drinkThemes.bottomColor" />
          </linearGradient>

          <!-- Liquid Surface Crema / Foam Oval Gradient -->
          <radialGradient id="liquidSurfaceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" :stop-color="drinkThemes.foamColor" stop-opacity="0.95" />
            <stop offset="65%" :stop-color="drinkThemes.swirlColor" stop-opacity="0.8" />
            <stop offset="100%" :stop-color="drinkThemes.bottomColor" stop-opacity="0.6" />
          </radialGradient>

          <!-- =========================================================
               PHOTOREALISTIC REAL WHIPPED CREAM SHADING (Fluted Star Creams)
               ========================================================= -->
          <!-- Whipped Cream Main Body Lustrous Gradient -->
          <linearGradient id="realCreamBody" x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="30%" stop-color="#FFFDF9" />
            <stop offset="65%" stop-color="#FBF2E7" />
            <stop offset="85%" stop-color="#EFE0CE" />
            <stop offset="100%" stop-color="#E0CEBA" />
          </linearGradient>

          <!-- Whipped Cream Ambient Occlusion Shadow between folds -->
          <linearGradient id="creamDeepShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#CBB39C" stop-opacity="0.9" />
            <stop offset="60%" stop-color="#E2D0BD" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#FFFDF9" stop-opacity="0" />
          </linearGradient>

          <!-- Whipped Cream Star Ridge Specular Highlight -->
          <linearGradient id="creamHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
            <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.3" />
          </linearGradient>

          <!-- =========================================================
               PHOTOREALISTIC REAL ICE CUBE REFRACTION & FROST
               ========================================================= -->
          <!-- Ice Glass Shell & Refraction -->
          <linearGradient id="realIceRefract" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.75)" />
            <stop offset="25%" stop-color="rgba(255, 255, 255, 0.3)" />
            <stop offset="55%" :stop-color="drinkThemes.iceRefraction" stop-opacity="0.25" />
            <stop offset="85%" stop-color="rgba(255, 255, 255, 0.45)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.85)" />
          </linearGradient>

          <!-- Ice Frost Inner Core -->
          <radialGradient id="iceFrostCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.9)" />
            <stop offset="45%" stop-color="rgba(255, 255, 255, 0.5)" />
            <stop offset="80%" stop-color="rgba(240, 248, 255, 0.1)" />
            <stop offset="100%" stop-color="transparent" />
          </radialGradient>

          <!-- Real Caramel Syrup Viscous Gradient -->
          <linearGradient id="realCaramel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F7BA65" />
            <stop offset="35%" stop-color="#D97F24" />
            <stop offset="75%" stop-color="#9C4A08" />
            <stop offset="100%" stop-color="#5E2703" />
          </linearGradient>

          <!-- Caramel Specular Glaze Ribbon -->
          <linearGradient id="caramelSpecular" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.85)" />
            <stop offset="50%" stop-color="rgba(255, 255, 255, 0.4)" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>

          <!-- Espresso Pour Stream -->
          <linearGradient id="pourStreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="drinkThemes.streamColor" stop-opacity="0.95" />
            <stop offset="80%" :stop-color="drinkThemes.midColor" stop-opacity="0.9" />
            <stop offset="100%" :stop-color="drinkThemes.topColor" stop-opacity="1" />
          </linearGradient>

          <!-- Drop shadows -->
          <filter id="iceDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.32" />
          </filter>
          <filter id="creamDeepBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        <!-- ==========================================
             LAYER 1: Glass Cup Back Wall & Bottom Base
             ========================================== -->
        <!-- Glass Back Rim -->
        <ellipse
          cx="160"
          cy="90"
          rx="63"
          ry="15"
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(255, 255, 255, 0.3)"
          stroke-width="1.5"
        />

        <!-- Glass Base Lens (Heavy Glass Foot) -->
        <ellipse
          cx="160"
          cy="312"
          rx="39"
          ry="9"
          fill="rgba(255, 255, 255, 0.14)"
          stroke="rgba(255, 255, 255, 0.35)"
          stroke-width="1.5"
        />
        <ellipse
          cx="160"
          cy="318"
          rx="36"
          ry="7"
          fill="rgba(255, 255, 255, 0.08)"
        />

        <!-- ==========================================
             LAYER 2: INSIDE CUP (Clipped by cupInteriorClip)
             ========================================== -->
        <g clip-path="url(#cupInteriorClip)">
          <!-- Empty Cup Depth Gradient (Shows clean transparent depth when empty) -->
          <rect
            x="90"
            y="85"
            width="140"
            height="240"
            fill="rgba(255, 255, 255, 0.02)"
          />

          <!-- 2A. Submerged Liquid (Animated Smooth Height Transition) -->
          <g
            class="transition-all duration-700 ease-out"
            :style="{
              opacity: isEmpty ? 0 : 1,
              transform: `translateY(${isEmpty ? 180 : 0}px)`,
            }"
          >
            <!-- Liquid Body -->
            <rect
              x="90"
              :y="liquidTopY"
              width="140"
              :height="325 - liquidTopY"
              fill="url(#liquidGrad)"
              class="transition-all duration-600 ease-out"
            />

            <!-- Liquid Internal Milk/Espresso Marbling Waves -->
            <path
              v-if="!isEmpty"
              :d="`M 105,${liquidTopY + 30} Q 135,${liquidTopY + 20} 160,${liquidTopY + 35} T 215,${liquidTopY + 25} L 215,315 L 105,315 Z`"
              fill="rgba(255, 255, 255, 0.08)"
              class="transition-all duration-500"
            />
            <path
              v-if="!isEmpty"
              :d="`M 112,${liquidTopY + 60} Q 145,${liquidTopY + 75} 175,${liquidTopY + 55} T 208,${liquidTopY + 65} L 208,315 L 112,315 Z`"
              fill="rgba(0, 0, 0, 0.12)"
              class="transition-all duration-500"
            />

            <!-- Liquid Top Elliptical Meniscus Surface -->
            <ellipse
              v-if="!isEmpty"
              cx="160"
              :cy="liquidTopY"
              :rx="59 - ((liquidTopY - 90) * 0.09)"
              :ry="13 - ((liquidTopY - 90) * 0.02)"
              fill="url(#liquidSurfaceGrad)"
              stroke="rgba(255, 255, 255, 0.35)"
              stroke-width="1.2"
              class="transition-all duration-600 ease-out"
            />

            <!-- Top Crema Latte Swirl Art -->
            <ellipse
              v-if="!isEmpty && liquidHeightPercentage > 30"
              cx="160"
              :cy="liquidTopY"
              :rx="28 - ((liquidTopY - 90) * 0.04)"
              :ry="6 - ((liquidTopY - 90) * 0.01)"
              :fill="drinkThemes.topColor"
              opacity="0.85"
            />
            <circle
              v-if="!isEmpty && liquidHeightPercentage > 30"
              cx="160"
              :cy="liquidTopY"
              r="3.5"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>

          <!-- 2B. PHOTOREALISTIC 3D ICE CUBES (Submerged Inside Liquid!) -->
          <g v-if="!isEmpty && iceCount > 0" class="transition-opacity duration-300">
            <g
              v-for="cube in visibleIceCubes"
              :key="cube.id"
              :class="isDroppingIce ? 'animate-real-ice-plunge' : 'animate-real-ice-bob'"
              :style="{
                animationDelay: cube.delay,
                transformOrigin: `${cube.x}px ${cube.y}px`,
              }"
              filter="url(#iceDropShadow)"
            >
              <!-- Realistic Chamfered 3D Ice Cube -->
              <g :transform="`translate(${cube.x}, ${cube.y}) rotate(${cube.rot})`">
                <!-- Main Refracting Ice Body (Soft Rounded Chamfer) -->
                <rect
                  :x="-cube.w / 2"
                  :y="-cube.h / 2"
                  :width="cube.w"
                  :height="cube.h"
                  rx="6"
                  ry="6"
                  fill="url(#realIceRefract)"
                  stroke="rgba(255, 255, 255, 0.8)"
                  stroke-width="1.4"
                />

                <!-- Frosted Crystalline Core -->
                <ellipse
                  cx="0"
                  cy="0"
                  :rx="cube.w * 0.36"
                  :ry="cube.h * 0.36"
                  fill="url(#iceFrostCore)"
                  opacity="0.75"
                />

                <!-- Internal Micro Fissure / Crystal Cracks -->
                <path
                  d="M -7,-5 L -1,1 L 5,-2"
                  stroke="rgba(255, 255, 255, 0.85)"
                  stroke-width="1.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                />
                <path
                  d="M -3,3 L 2,8"
                  stroke="rgba(255, 255, 255, 0.65)"
                  stroke-width="1"
                  stroke-linecap="round"
                  fill="none"
                />

                <!-- Bright Specular Corner Glint & Highlights -->
                <path
                  :d="`M ${-cube.w / 2 + 5},${-cube.h / 2 + 1} L ${cube.w / 2 - 5},${-cube.h / 2 + 1}`"
                  stroke="rgba(255, 255, 255, 0.95)"
                  stroke-width="1.8"
                  stroke-linecap="round"
                />
                <path
                  :d="`M ${-cube.w / 2 + 1},${-cube.h / 2 + 5} L ${-cube.w / 2 + 1},${cube.h / 2 - 5}`"
                  stroke="rgba(255, 255, 255, 0.75)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />

                <!-- Trapped Air Micro-bubbles -->
                <circle cx="5" cy="4" r="1.4" fill="#FFFFFF" opacity="0.85" />
                <circle cx="-5" cy="-2" r="1" fill="#FFFFFF" opacity="0.75" />
                <circle cx="2" cy="-6" r="0.8" fill="#FFFFFF" opacity="0.9" />
              </g>
            </g>
          </g>

          <!-- 2C. Liquid Splash Droplets when Ice plunges in -->
          <g v-if="isSplashing" class="pointer-events-none animate-splash-burst">
            <circle cx="140" :cy="liquidTopY - 12" r="2.5" :fill="drinkThemes.topColor" class="animate-droplet-1" />
            <circle cx="152" :cy="liquidTopY - 22" r="3" :fill="drinkThemes.midColor" class="animate-droplet-2" />
            <circle cx="168" :cy="liquidTopY - 26" r="3.2" :fill="drinkThemes.topColor" class="animate-droplet-3" />
            <circle cx="180" :cy="liquidTopY - 16" r="2.8" :fill="drinkThemes.midColor" class="animate-droplet-4" />
          </g>

          <!-- 2D. Inner Wall Caramel / Mocha Drips (when drizzle active) -->
          <g v-if="!isEmpty && withCaramel" class="animate-drip-flow">
            <!-- Caramel Ribbon Drip 1 with Teardrop pooling -->
            <path
              d="M 115,92 Q 117,130 119,165 Q 120,185 118,205"
              stroke="url(#realCaramel)"
              stroke-width="3.5"
              stroke-linecap="round"
              fill="none"
              opacity="0.9"
            />
            <ellipse cx="118" cy="207" rx="2.5" ry="3.5" fill="url(#realCaramel)" />

            <!-- Caramel Ribbon Drip 2 with Teardrop pooling -->
            <path
              d="M 198,92 Q 196,120 193,155 Q 191,170 194,185"
              stroke="url(#realCaramel)"
              stroke-width="3"
              stroke-linecap="round"
              fill="none"
              opacity="0.85"
            />
            <ellipse cx="194" cy="187" rx="2.2" ry="3" fill="url(#realCaramel)" />
          </g>
        </g>

        <!-- ========================================================
             LAYER 3: PHOTOREALISTIC 3D WHIPPED CREAM (Star-Piped Barista Swirl)
             ======================================================== -->
        <g
          v-if="!isEmpty && withCream"
          class="transform transition-all duration-500 ease-out preserve-3d"
          :class="isBloomingCream ? 'animate-real-cream-pipe' : 'animate-cream-settle'"
          style="transform-origin: 160px 88px"
        >
          <!-- Soft Ambient Contact Shadow Under Cream -->
          <ellipse
            cx="160"
            cy="90"
            rx="62"
            ry="16"
            fill="rgba(0, 0, 0, 0.35)"
            filter="blur(5px)"
          />

          <!-- ====================================================
               FLUTED STAR NOZZLE PIPING PETALS (Tier 1: Base Lobes)
               ==================================================== -->
          <!-- Deep Fold Crevice Shadows (Layered beneath) -->
          <path
            d="M 100,90 Q 115,75 130,86 Q 148,72 165,85 Q 185,73 200,85 Q 212,78 220,90"
            stroke="url(#creamDeepShadow)"
            stroke-width="8"
            stroke-linecap="round"
            fill="none"
            filter="url(#creamDeepBlur)"
          />

          <!-- Base Lobe 1 (Left Wing) -->
          <path
            d="M 100,90 C 100,68 118,60 132,74 C 122,86 112,94 100,90 Z"
            fill="url(#realCreamBody)"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />
          <!-- Base Lobe 2 (Left Mid) -->
          <path
            d="M 124,80 C 126,56 148,50 160,68 C 146,78 135,85 124,80 Z"
            fill="url(#realCreamBody)"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />
          <!-- Base Lobe 3 (Right Mid) -->
          <path
            d="M 152,70 C 160,50 184,54 196,74 C 182,82 168,82 152,70 Z"
            fill="url(#realCreamBody)"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />
          <!-- Base Lobe 4 (Right Wing) -->
          <path
            d="M 188,76 C 198,62 218,68 220,90 C 208,94 198,88 188,76 Z"
            fill="url(#realCreamBody)"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />

          <!-- ====================================================
               FLUTED STAR NOZZLE PIPING PETALS (Tier 2: Mid Spiral)
               ==================================================== -->
          <!-- Mid Swirl Left -->
          <path
            d="M 116,68 C 120,44 142,34 158,48 C 144,58 130,65 116,68 Z"
            fill="url(#realCreamBody)"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />
          <!-- Mid Swirl Center -->
          <path
            d="M 142,50 C 150,30 174,32 186,52 C 172,60 156,60 142,50 Z"
            fill="url(#realCreamBody)"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />
          <!-- Mid Swirl Right -->
          <path
            d="M 174,54 C 184,38 200,44 204,64 C 194,70 184,66 174,54 Z"
            fill="url(#realCreamBody)"
            fill-opacity="0.95"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />

          <!-- ====================================================
               FLUTED STAR NOZZLE PIPING PETALS (Tier 3: Crown Peak)
               ==================================================== -->
          <!-- Crown Billow Left -->
          <path
            d="M 136,40 C 142,20 156,12 162,28 C 154,36 144,40 136,40 Z"
            fill="url(#realCreamBody)"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />
          <!-- Crown Billow Center & Hand-Piped Swirling Curl Tip -->
          <path
            d="M 152,26 C 156,10 166,-4 163,-8 C 158,-7 154,2 152,14 C 148,22 150,25 152,26 Z"
            fill="#FFFFFF"
            stroke="rgba(255, 255, 255, 0.95)"
            stroke-width="1"
          />
          <path
            d="M 150,30 C 156,12 170,14 174,32 C 166,36 158,36 150,30 Z"
            fill="url(#realCreamBody)"
            stroke="rgba(255, 255, 255, 0.9)"
            stroke-width="1.2"
          />

          <!-- ====================================================
               CRISP SPECULAR STAR RIDGES (Gives the authentic star-nozzle fluting)
               ==================================================== -->
          <!-- Ridge 1 -->
          <path
            d="M 112,82 Q 130,68 152,78"
            stroke="url(#creamHighlight)"
            stroke-width="2.5"
            stroke-linecap="round"
            fill="none"
          />
          <!-- Ridge 2 -->
          <path
            d="M 136,70 Q 158,54 182,66"
            stroke="url(#creamHighlight)"
            stroke-width="2.8"
            stroke-linecap="round"
            fill="none"
          />
          <!-- Ridge 3 -->
          <path
            d="M 126,52 Q 150,34 172,46"
            stroke="url(#creamHighlight)"
            stroke-width="2.6"
            stroke-linecap="round"
            fill="none"
          />
          <!-- Ridge 4 -->
          <path
            d="M 144,34 Q 160,18 174,28"
            stroke="url(#creamHighlight)"
            stroke-width="2.2"
            stroke-linecap="round"
            fill="none"
          />
          <!-- Peak Glint -->
          <path
            d="M 155,16 Q 161,2 163,-6"
            stroke="#FFFFFF"
            stroke-width="2.2"
            stroke-linecap="round"
            fill="none"
          />

          <!-- ====================================================
               REAL VISCOUS CARAMEL DRIZZLE RIBBONS OVER CREAM
               ==================================================== -->
          <g v-if="withCaramel" class="animate-drizzle-reveal">
            <!-- Caramel Ribbon 1 (Base Tier) -->
            <path
              d="M 106,82 Q 128,94 154,76 Q 180,60 214,84"
              stroke="url(#realCaramel)"
              stroke-width="4.5"
              stroke-linecap="round"
              fill="none"
              filter="url(#iceDropShadow)"
            />
            <path
              d="M 108,82 Q 128,93 154,75 Q 180,59 212,83"
              stroke="url(#caramelSpecular)"
              stroke-width="1.6"
              stroke-linecap="round"
              fill="none"
            />

            <!-- Caramel Ribbon 2 (Mid Tier) -->
            <path
              d="M 126,58 Q 152,72 178,50 Q 192,42 202,56"
              stroke="url(#realCaramel)"
              stroke-width="3.8"
              stroke-linecap="round"
              fill="none"
              filter="url(#iceDropShadow)"
            />
            <path
              d="M 128,58 Q 152,71 178,49 Q 192,41 200,55"
              stroke="url(#caramelSpecular)"
              stroke-width="1.4"
              stroke-linecap="round"
              fill="none"
            />

            <!-- Caramel Ribbon 3 (Crown Peak) -->
            <path
              d="M 142,32 Q 158,44 176,28"
              stroke="url(#realCaramel)"
              stroke-width="3.2"
              stroke-linecap="round"
              fill="none"
            />
          </g>

          <!-- ====================================================
               REAL COCOA / CINNAMON POWDER SHOWER OVER CREAM
               ==================================================== -->
          <g v-if="withCocoa" class="animate-dust-shower">
            <!-- Fine Cocoa Powder Speckles nestled in star folds -->
            <circle cx="146" cy="42" r="1.6" fill="#431E0D" />
            <circle cx="152" cy="36" r="1.3" fill="#582C15" />
            <circle cx="162" cy="40" r="1.8" fill="#361708" />
            <circle cx="170" cy="48" r="1.4" fill="#65341A" />
            <circle cx="134" cy="70" r="1.5" fill="#431E0D" />
            <circle cx="148" cy="66" r="1.7" fill="#582C15" />
            <circle cx="166" cy="68" r="1.5" fill="#361708" />
            <circle cx="180" cy="74" r="1.6" fill="#65341A" />
            <circle cx="122" cy="80" r="1.4" fill="#431E0D" />
            <circle cx="196" cy="82" r="1.5" fill="#582C15" />
          </g>
        </g>

        <!-- ==========================================
             LAYER 4: ESPRESSO POUR STREAM (Active on Extra Shot / Pour)
             ========================================== -->
        <g v-if="isPouring || withExtraShot" class="animate-pour-stream pointer-events-none">
          <!-- Flowing Espresso Jet -->
          <path
            d="M 160,-20 L 160,110"
            stroke="url(#pourStreamGrad)"
            stroke-width="5"
            stroke-linecap="round"
            filter="drop-shadow(0 0 6px rgba(90, 45, 20, 0.8))"
          />
          <!-- Liquid Impact Splash Rings -->
          <ellipse
            cx="160"
            :cy="liquidTopY"
            rx="14"
            ry="4"
            fill="none"
            stroke="rgba(255, 255, 255, 0.7)"
            stroke-width="2"
            class="animate-ripple-ring"
          />
        </g>

        <!-- ==========================================
             LAYER 5: FRONT GLASS REFLECTIONS & EMBOSSING
             ========================================== -->
        <!-- Front Glass Silhouette & Gradient Body -->
        <path
          d="M 97,90 L 121,308 Q 123,322 160,322 Q 197,322 199,308 L 223,90 Z"
          fill="url(#glassWallGrad)"
          stroke="rgba(255, 255, 255, 0.35)"
          stroke-width="1.8"
        />

        <!-- High-gloss Left Curved Specular Highlight -->
        <path
          d="M 104,95 L 124,302"
          stroke="url(#glassReflectLeft)"
          stroke-width="4.5"
          stroke-linecap="round"
          opacity="0.85"
        />
        <path
          d="M 110,105 L 127,290"
          stroke="rgba(255, 255, 255, 0.4)"
          stroke-width="1.8"
          stroke-linecap="round"
        />

        <!-- Right Rim Subtle Specular Line -->
        <path
          d="M 216,95 L 196,302"
          stroke="url(#glassReflectRight)"
          stroke-width="3"
          stroke-linecap="round"
          opacity="0.6"
        />

        <!-- Top Glass Front Rim Curve -->
        <ellipse
          cx="160"
          cy="90"
          rx="63"
          ry="15"
          fill="none"
          stroke="rgba(255, 255, 255, 0.65)"
          stroke-width="2"
        />
        <!-- Top Rim Inner Glaze -->
        <ellipse
          cx="160"
          cy="90"
          rx="60"
          ry="13"
          fill="none"
          stroke="rgba(255, 255, 255, 0.25)"
          stroke-width="1"
        />

        <!-- Glass Wall Etched Measurement Lines -->
        <g opacity="0.35" stroke="rgba(255, 255, 255, 0.8)" stroke-width="1.2">
          <!-- 16 oz Line -->
          <line x1="210" y1="130" x2="218" y2="130" />
          <text x="206" y="133" font-size="7.5" font-weight="700" fill="rgba(255, 255, 255, 0.7)" text-anchor="end" font-family="'JetBrains Mono', monospace">16 oz</text>
          <!-- 12 oz Line -->
          <line x1="204" y1="180" x2="212" y2="180" />
          <text x="200" y="183" font-size="7.5" font-weight="700" fill="rgba(255, 255, 255, 0.7)" text-anchor="end" font-family="'JetBrains Mono', monospace">12 oz</text>
          <!-- 8 oz Line -->
          <line x1="198" y1="230" x2="206" y2="230" />
          <text x="194" y="233" font-size="7.5" font-weight="700" fill="rgba(255, 255, 255, 0.7)" text-anchor="end" font-family="'JetBrains Mono', monospace">8 oz</text>
        </g>

        <!-- Frosted Cafe Brand Emblem on Glass Face -->
        <g opacity="0.45">
          <rect
            x="126"
            y="175"
            width="68"
            height="22"
            rx="6"
            fill="rgba(255, 255, 255, 0.12)"
            stroke="rgba(255, 255, 255, 0.3)"
            stroke-width="0.8"
          />
          <text
            x="160"
            y="190"
            font-family="'Inter', sans-serif"
            font-size="9"
            font-weight="900"
            letter-spacing="1.5"
            fill="#FFFFFF"
            text-anchor="middle"
          >
            SNE KAFE
          </text>
        </g>

        <!-- Cold Condensation Droplets for Iced drinks -->
        <g v-if="!isEmpty && iceCount > 0" opacity="0.65">
          <ellipse cx="120" cy="140" rx="1.6" ry="2.6" fill="rgba(255, 255, 255, 0.85)" />
          <ellipse cx="128" cy="195" rx="2" ry="3.4" fill="rgba(255, 255, 255, 0.8)" />
          <ellipse cx="192" cy="160" rx="1.8" ry="3" fill="rgba(255, 255, 255, 0.85)" />
          <ellipse cx="185" cy="225" rx="1.5" ry="2.4" fill="rgba(255, 255, 255, 0.8)" />
        </g>
      </svg>
    </div>
  </div>
</template>

<style scoped>
/* 3D Glass & Physics Keyframe Animations */
.preserve-3d {
  transform-style: preserve-3d;
}

/* ==========================================================
   REAL ICE PHYSICS: Plunge deep into liquid -> buoyancy bounce
   ========================================================== */
@keyframes realIcePlunge {
  0% {
    transform: translate3d(0, -220px, 60px) scale(0.4) rotate(-65deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  68% {
    /* Plunge deep into coffee */
    transform: translate3d(0, 32px, 20px) scale(1.1) rotate(14deg);
  }
  82% {
    /* Buoyancy pushes it back up */
    transform: translate3d(0, -10px, 12px) scale(0.97) rotate(-5deg);
  }
  92% {
    transform: translate3d(0, 3px, 6px) scale(1.02) rotate(2deg);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-real-ice-plunge {
  animation: realIcePlunge 0.85s cubic-bezier(0.2, 0.85, 0.35, 1.25) forwards;
}

/* Authentic gentle floating buoyancy in liquid */
@keyframes realIceBob {
  0%, 100% {
    transform: translate3d(0, 0px, 0) rotate(0deg);
  }
  50% {
    transform: translate3d(0, -7px, 6px) rotate(2.5deg);
  }
}

.animate-real-ice-bob {
  animation: realIceBob 4.2s ease-in-out infinite;
}

/* Splash droplets burst upwards when ice plunges */
@keyframes dropletShoot1 {
  0% { transform: translate(0, 0) scale(0); opacity: 1; }
  50% { transform: translate(-12px, -36px) scale(1.2); opacity: 0.9; }
  100% { transform: translate(-18px, 6px) scale(0.4); opacity: 0; }
}
@keyframes dropletShoot2 {
  0% { transform: translate(0, 0) scale(0); opacity: 1; }
  50% { transform: translate(-5px, -48px) scale(1.3); opacity: 0.95; }
  100% { transform: translate(-8px, 10px) scale(0.3); opacity: 0; }
}
@keyframes dropletShoot3 {
  0% { transform: translate(0, 0) scale(0); opacity: 1; }
  50% { transform: translate(8px, -52px) scale(1.4); opacity: 0.95; }
  100% { transform: translate(12px, 12px) scale(0.3); opacity: 0; }
}
@keyframes dropletShoot4 {
  0% { transform: translate(0, 0) scale(0); opacity: 1; }
  50% { transform: translate(16px, -38px) scale(1.1); opacity: 0.9; }
  100% { transform: translate(22px, 8px) scale(0.4); opacity: 0; }
}

.animate-droplet-1 { animation: dropletShoot1 0.65s ease-out forwards; }
.animate-droplet-2 { animation: dropletShoot2 0.7s ease-out forwards; }
.animate-droplet-3 { animation: dropletShoot3 0.72s ease-out forwards; }
.animate-droplet-4 { animation: dropletShoot4 0.68s ease-out forwards; }

/* ==========================================================
   REAL BARISTA CREAM PIPING: Spiral extrusion & luscious jiggle
   ========================================================== */
@keyframes realCreamPipeIn {
  0% {
    transform: scale3d(0.1, 0.1, 0.1) rotate(-140deg) translateY(60px);
    opacity: 0;
    filter: blur(8px);
  }
  55% {
    opacity: 1;
    filter: blur(0);
  }
  70% {
    /* Billows out with soft star folds */
    transform: scale3d(1.14, 1.14, 1.14) rotate(8deg) translateY(-10px);
  }
  85% {
    /* Luscious creamy recoil */
    transform: scale3d(0.96, 0.96, 0.96) rotate(-3deg) translateY(3px);
  }
  94% {
    transform: scale3d(1.02, 1.02, 1.02) rotate(1deg) translateY(-1px);
  }
  100% {
    transform: scale3d(1, 1, 1) rotate(0deg) translateY(0);
    opacity: 1;
  }
}

.animate-real-cream-pipe {
  animation: realCreamPipeIn 0.95s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Drizzle Ribbon Reveal */
@keyframes drizzleReveal {
  0% {
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.animate-drizzle-reveal path {
  stroke-dasharray: 220;
  animation: drizzleReveal 0.95s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Drip Flow down glass wall */
@keyframes dripSlide {
  0% {
    stroke-dasharray: 180;
    stroke-dashoffset: 180;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0.9;
  }
}

.animate-drip-flow path {
  stroke-dasharray: 180;
  animation: dripSlide 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

/* Espresso Pour Jet */
@keyframes pourStreamFlow {
  0% {
    stroke-dasharray: 160;
    stroke-dashoffset: 160;
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 0.95;
  }
}

.animate-pour-stream path {
  stroke-dasharray: 160;
  animation: pourStreamFlow 0.8s ease-out forwards;
}

/* Ripple ring at impact */
@keyframes rippleExpand {
  0% {
    transform: scale(0.2);
    opacity: 0.9;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

.animate-ripple-ring {
  transform-origin: 160px 100px;
  animation: rippleExpand 0.9s ease-out infinite;
}

/* Cocoa Powder Particle Drift */
@keyframes dustSettle {
  0% {
    transform: translateY(-24px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-dust-shower {
  animation: dustSettle 0.65s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
}
</style>

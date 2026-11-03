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

// Re-trigger ice drop animation when ice level changes
watch(
  () => props.iceLevel,
  (newVal, oldVal) => {
    if (newVal !== 'none' && newVal !== oldVal) {
      isDroppingIce.value = true
      setTimeout(() => {
        isDroppingIce.value = false
      }, 1000)
    }
  }
)

// Re-trigger cream swirl when cream toggled ON
watch(
  () => props.withCream,
  (newVal) => {
    if (newVal) {
      isBloomingCream.value = true
      setTimeout(() => {
        isBloomingCream.value = false
      }, 900)
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

// Color Schemes per drink
const drinkThemes = computed(() => {
  const id = props.productId.toLowerCase()
  if (id.includes('latte')) {
    return {
      topColor: '#FFF8F0', // Milk foam
      midColor: '#C89264', // Creamy espresso
      bottomColor: '#7A431D', // Rich coffee base
      foamColor: '#FFFDF8',
      swirlColor: '#B6733E',
      streamColor: '#5C3116',
    }
  }
  if (id.includes('cappuccino')) {
    return {
      topColor: '#FFF5E8', // Thick silky foam
      midColor: '#A3683A', // Crema
      bottomColor: '#4E240D', // Dark espresso
      foamColor: '#FFFDF9',
      swirlColor: '#8C4D20',
      streamColor: '#4A1F08',
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
    }
  }
  if (id.includes('matcha')) {
    return {
      topColor: '#E8F5E1', // Sweet oat froth
      midColor: '#6B9E5A', // Jade matcha
      bottomColor: '#3D6F2F', // Rich ceremonial matcha
      foamColor: '#F0F8EC',
      swirlColor: '#4D823E',
      streamColor: '#3B6B2B',
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

// Ice cube coordinates inside the cup (strictly placed to fit inside the tapered glass)
const iceCubes = [
  { id: 1, x: 132, y: 230, r: 14, rot: 12, delay: '0.0s' },
  { id: 2, x: 168, y: 210, r: 15, rot: -18, delay: '0.12s' },
  { id: 3, x: 126, y: 165, r: 16, rot: 22, delay: '0.22s' },
  { id: 4, x: 166, y: 150, r: 17, rot: -10, delay: '0.32s' },
  { id: 5, x: 135, y: 115, r: 16, rot: 34, delay: '0.42s' },
  { id: 6, x: 168, y: 118, r: 15, rot: -25, delay: '0.52s' },
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
          <!-- Interior Cup Clip Path (strictly clamps liquid, ice, and inner drips) -->
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

          <!-- Whipped Cream 3D Gloss Shading -->
          <linearGradient id="creamGlossShade" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="40%" stop-color="#FFFDF8" />
            <stop offset="75%" stop-color="#F6EADE" />
            <stop offset="100%" stop-color="#E5D0BC" />
          </linearGradient>

          <!-- Caramel / Chocolate Sauce Gradients -->
          <linearGradient id="caramelDrizzle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EAA34B" />
            <stop offset="60%" stop-color="#C57522" />
            <stop offset="100%" stop-color="#803E0B" />
          </linearGradient>
          <linearGradient id="chocolateDrizzle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#4B2011" />
            <stop offset="100%" stop-color="#1E0A03" />
          </linearGradient>

          <!-- Espresso Pour Stream -->
          <linearGradient id="pourStreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" :stop-color="drinkThemes.streamColor" stop-opacity="0.95" />
            <stop offset="80%" :stop-color="drinkThemes.midColor" stop-opacity="0.9" />
            <stop offset="100%" :stop-color="drinkThemes.topColor" stop-opacity="1" />
          </linearGradient>

          <!-- 3D Ice Cube Face Shading -->
          <linearGradient id="iceFaceTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.85)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0.45)" />
          </linearGradient>
          <linearGradient id="iceFaceFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.55)" />
            <stop offset="100%" stop-color="rgba(235, 245, 255, 0.25)" />
          </linearGradient>
          <linearGradient id="iceFaceSide" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(240, 248, 255, 0.45)" />
            <stop offset="100%" stop-color="rgba(210, 230, 255, 0.15)" />
          </linearGradient>

          <!-- Soft drop shadow for ice cubes and cream -->
          <filter id="iceDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000000" flood-opacity="0.25" />
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

          <!-- 2B. 3D Submerged Ice Cubes (Visible INSIDE the glass!) -->
          <g v-if="!isEmpty && iceCount > 0" class="transition-opacity duration-300">
            <g
              v-for="cube in visibleIceCubes"
              :key="cube.id"
              :class="isDroppingIce ? 'animate-ice-splash' : 'animate-ice-float'"
              :style="{
                animationDelay: cube.delay,
                transformOrigin: `${cube.x}px ${cube.y}px`,
              }"
              filter="url(#iceDropShadow)"
            >
              <!-- 3D Faceted Isometric Ice Cube -->
              <g :transform="`translate(${cube.x}, ${cube.y}) rotate(${cube.rot})`">
                <!-- Top Face -->
                <polygon
                  points="0,-10 13,-4 0,2 -13,-4"
                  fill="url(#iceFaceTop)"
                  stroke="rgba(255, 255, 255, 0.85)"
                  stroke-width="1.2"
                  stroke-linejoin="round"
                />
                <!-- Front Left Face -->
                <polygon
                  points="-13,-4 0,2 0,16 -13,10"
                  fill="url(#iceFaceFront)"
                  stroke="rgba(255, 255, 255, 0.65)"
                  stroke-width="1.2"
                  stroke-linejoin="round"
                />
                <!-- Front Right Face -->
                <polygon
                  points="0,2 13,-4 13,10 0,16"
                  fill="url(#iceFaceSide)"
                  stroke="rgba(255, 255, 255, 0.5)"
                  stroke-width="1.2"
                  stroke-linejoin="round"
                />
                <!-- Specular Reflection Diagonal Highlight -->
                <line
                  x1="-7"
                  y1="3"
                  x2="-2"
                  y2="13"
                  stroke="rgba(255, 255, 255, 0.9)"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <!-- Micro Air Bubble inside ice -->
                <circle cx="4" cy="5" r="1.2" fill="#FFFFFF" opacity="0.8" />
                <circle cx="-3" cy="-1" r="0.8" fill="#FFFFFF" opacity="0.7" />
              </g>
            </g>
          </g>

          <!-- 2C. Inner Wall Caramel / Mocha Drips (when drizzle active) -->
          <g v-if="!isEmpty && withCaramel" class="animate-drip-flow">
            <path
              d="M 115,92 Q 117,130 119,165 Q 120,185 118,205"
              stroke="url(#caramelDrizzle)"
              stroke-width="3"
              stroke-linecap="round"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M 198,92 Q 196,120 193,155 Q 191,170 194,185"
              stroke="url(#caramelDrizzle)"
              stroke-width="2.5"
              stroke-linecap="round"
              fill="none"
              opacity="0.8"
            />
          </g>
        </g>

        <!-- ==========================================
             LAYER 3: TOP WHIPPED CREAM CROWN (Sits on Rim)
             ========================================== -->
        <g
          v-if="!isEmpty && withCream"
          class="transform transition-all duration-500 ease-out preserve-3d"
          :class="isBloomingCream ? 'animate-cream-bloom' : 'animate-cream-settle'"
          style="transform-origin: 160px 88px"
        >
          <!-- Soft Drop Shadow under cream -->
          <ellipse
            cx="160"
            cy="90"
            rx="58"
            ry="14"
            fill="rgba(0, 0, 0, 0.28)"
            filter="blur(4px)"
          />

          <!-- Tier 1: Wide Pillow Base -->
          <path
            d="M 102,90 C 102,68 125,58 160,54 C 195,58 218,68 218,90 C 218,96 195,102 160,102 C 125,102 102,96 102,90 Z"
            fill="url(#creamGlossShade)"
            stroke="rgba(255, 255, 255, 0.8)"
            stroke-width="1.2"
          />

          <!-- Tier 2: Mid Swirl -->
          <path
            d="M 118,72 C 120,48 138,36 160,30 C 182,36 200,48 202,72 C 195,78 180,82 160,82 C 140,82 125,78 118,72 Z"
            fill="url(#creamGlossShade)"
          />

          <!-- Tier 3: Soft-serve Billowing Top Peak -->
          <path
            d="M 140,46 C 144,24 154,12 160,4 C 166,12 176,24 180,46 C 174,50 168,52 160,52 C 152,52 146,50 140,46 Z"
            fill="url(#creamGlossShade)"
          />

          <!-- 3D Swirl Ribs & Highlights -->
          <path
            d="M 118,84 Q 160,65 200,84"
            stroke="#EFE1D2"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"
          />
          <path
            d="M 130,62 Q 160,45 190,62"
            stroke="#EFE1D2"
            stroke-width="3"
            stroke-linecap="round"
            fill="none"
          />
          <path
            d="M 148,34 Q 160,22 172,34"
            stroke="#FFFFFF"
            stroke-width="2.5"
            stroke-linecap="round"
            fill="none"
          />

          <!-- Caramel / Chocolate Ribbon over Cream -->
          <g v-if="withCaramel" class="animate-drizzle-reveal">
            <path
              d="M 120,80 Q 140,94 160,78 Q 180,62 198,82"
              stroke="url(#caramelDrizzle)"
              stroke-width="3.5"
              stroke-linecap="round"
              fill="none"
              filter="url(#iceDropShadow)"
            />
            <path
              d="M 136,56 Q 155,70 174,52"
              stroke="url(#caramelDrizzle)"
              stroke-width="3"
              stroke-linecap="round"
              fill="none"
            />
          </g>

          <!-- Cocoa / Cinnamon Dusting Particles on Cream -->
          <g v-if="withCocoa" class="animate-dust-shower">
            <!-- Fine Cocoa Powder Speckles -->
            <circle cx="148" cy="45" r="1.5" fill="#4B2412" />
            <circle cx="155" cy="38" r="1.2" fill="#5A2E16" />
            <circle cx="164" cy="42" r="1.8" fill="#3D1C0C" />
            <circle cx="170" cy="50" r="1.3" fill="#6A361C" />
            <circle cx="138" cy="72" r="1.5" fill="#4B2412" />
            <circle cx="152" cy="68" r="1.7" fill="#5A2E16" />
            <circle cx="168" cy="70" r="1.4" fill="#3D1C0C" />
            <circle cx="182" cy="75" r="1.5" fill="#6A361C" />
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
        <g v-if="!isEmpty && iceCount > 0" opacity="0.6">
          <ellipse cx="120" cy="140" rx="1.5" ry="2.5" fill="rgba(255, 255, 255, 0.8)" />
          <ellipse cx="128" cy="195" rx="1.8" ry="3.2" fill="rgba(255, 255, 255, 0.75)" />
          <ellipse cx="192" cy="160" rx="1.6" ry="2.8" fill="rgba(255, 255, 255, 0.8)" />
          <ellipse cx="185" cy="225" rx="1.4" ry="2.2" fill="rgba(255, 255, 255, 0.75)" />
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

/* Ice splash & drop entrance */
@keyframes iceSplashIn {
  0% {
    transform: translate3d(0, -180px, 40px) scale(0.4) rotate(-45deg);
    opacity: 0;
  }
  60% {
    transform: translate3d(0, 15px, 15px) scale(1.1) rotate(10deg);
    opacity: 1;
  }
  80% {
    transform: translate3d(0, -6px, 10px) scale(0.96) rotate(-4deg);
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animate-ice-splash {
  animation: iceSplashIn 0.75s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}

/* Gentle natural liquid buoyancy for submerged ice */
@keyframes iceBobFloat {
  0%, 100% {
    transform: translate3d(0, 0px, 0);
  }
  50% {
    transform: translate3d(0, -6px, 8px);
  }
}

.animate-ice-float {
  animation: iceBobFloat 4s ease-in-out infinite;
}

/* Whipped Cream Bloom Entrance */
@keyframes creamBloomIn {
  0% {
    transform: scale3d(0.2, 0.2, 0.2) translateY(50px) rotate(-30deg);
    opacity: 0;
    filter: blur(6px);
  }
  65% {
    transform: scale3d(1.12, 1.12, 1.12) translateY(-8px) rotate(4deg);
    opacity: 1;
    filter: blur(0);
  }
  85% {
    transform: scale3d(0.97, 0.97, 0.97) translateY(2px) rotate(-1deg);
  }
  100% {
    transform: scale3d(1, 1, 1) translateY(0) rotate(0deg);
    opacity: 1;
  }
}

.animate-cream-bloom {
  animation: creamBloomIn 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Drizzle Ribbon Reveal */
@keyframes drizzleReveal {
  0% {
    stroke-dasharray: 200;
    stroke-dashoffset: 200;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.animate-drizzle-reveal path {
  stroke-dasharray: 200;
  animation: drizzleReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
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
    opacity: 0.85;
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
    transform: translateY(-20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-dust-shower {
  animation: dustSettle 0.6s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
}
</style>

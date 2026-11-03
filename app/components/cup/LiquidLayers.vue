<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  productId: string
  liquidTopY: number
  surfaceAngle: number
  sloshWave: number
  liquidOffsetX: number
  isEmpty: boolean
  withExtraShot: boolean
  isDraining?: boolean
  isRefilling?: boolean
}>()

// Dynamic gradient colors per product recipe
const theme = computed(() => {
  const id = props.productId.toLowerCase()
  if (id.includes('latte')) {
    return {
      top: '#FFF7ED',       // Silky milk froth
      layer1: '#E8CAAC',    // Steamed milk blend
      layer2: '#BA7A46',    // Crema / golden espresso
      bottom: '#6B3A18',    // Deep roasted espresso base
      surface: '#FDF6ED',
      swirl: '#C0814D',
      cremaBubble: '#FFFBF5',
    }
  }
  if (id.includes('cappuccino')) {
    return {
      top: '#FFFDF7',       // Thick dense foam
      layer1: '#D4A373',    // Espresso crema ring
      layer2: '#8C4D22',    // Espresso body
      bottom: '#451D0A',    // Dark roast extraction
      surface: '#FFF9F0',
      swirl: '#A65D2B',
      cremaBubble: '#FFF8EB',
    }
  }
  if (id.includes('mocha')) {
    return {
      top: '#E6D2C0',       // Cocoa foam
      layer1: '#6E3A20',    // Espresso cocoa blend
      layer2: '#4A2312',    // Dutch dark chocolate
      bottom: '#250E06',    // Melted rich chocolate foundation
      surface: '#EADCCE',
      swirl: '#3E1C0D',
      cremaBubble: '#F2E5D8',
    }
  }
  if (id.includes('coldbrew') || id.includes('iced')) {
    return {
      top: '#7D4423',       // Amber cold brew surface
      layer1: '#542913',    // Slow-steeped extraction
      layer2: '#3A1909',    // Dense dark roast
      bottom: '#1E0B04',    // Mahogany base
      surface: '#8F532E',
      swirl: '#4A200B',
      cremaBubble: '#D8996C',
    }
  }
  if (id.includes('matcha')) {
    return {
      top: '#E8F5E1',       // Sweet oat foam
      layer1: '#7CB269',    // Frothy jade matcha
      layer2: '#4E883A',    // Uji ceremonial matcha
      bottom: '#2F611E',    // Rich intense matcha
      surface: '#F0F8EC',
      swirl: '#4D823E',
      cremaBubble: '#E2F0DA',
    }
  }
  if (id.includes('macchiato')) {
    return {
      top: '#F9EDE1',       // Vanilla microfoam
      layer1: '#AF6C31',    // Bold espresso mark
      layer2: '#E7CAA8',    // Sweet vanilla milk layer
      bottom: '#7D4217',    // Caramel bottom
      surface: '#FFF8F0',
      swirl: '#C97A28',
      cremaBubble: '#FFF5E8',
    }
  }
  // Default Americano
  return {
    top: '#99592F',         // Golden Crema
    layer1: '#5A2E15',      // Espresso blend
    layer2: '#3D1C0A',      // Full body roast
    bottom: '#1A0B04',      // Deep black espresso
    surface: '#A8683B',
    swirl: '#5C2B10',
    cremaBubble: '#DB9E72',
  }
})

// Radius of liquid surface ellipse at current Y height
const surfaceRx = computed(() => {
  return 59 - ((props.liquidTopY - 90) * 0.088)
})
const surfaceRy = computed(() => {
  return 13.5 - ((props.liquidTopY - 90) * 0.02)
})
</script>

<template>
  <g class="liquid-layers-group">
    <!-- Masked inside cupInteriorClip -->
    <g
      class="liquid-container transition-all duration-500 ease-out"
      :style="{
        opacity: isEmpty ? 0 : 1,
        transform: `translateY(${isEmpty ? 160 : 0}px)`,
      }"
    >
      <!-- Base Layer 4: Deep Roast / Chocolate Bottom -->
      <path
        :d="`M 116,${Math.max(liquidTopY + 120, 240)} L 121,310 Q 123,326 160,326 Q 197,326 199,310 L 204,${Math.max(liquidTopY + 120, 240)} Z`"
        :fill="theme.bottom"
        class="transition-colors duration-700"
      />

      <!-- Layer 3: Body Espresso Layer (Soft Wave Blend) -->
      <path
        :d="`M 108,${Math.max(liquidTopY + 70, 180)} Q 135,${Math.max(liquidTopY + 60, 170)} 160,${Math.max(liquidTopY + 74, 184)} T 212,${Math.max(liquidTopY + 65, 175)} L 204,260 Q 160,270 116,260 Z`"
        :fill="theme.layer2"
        class="transition-colors duration-700"
      />

      <!-- Layer 2: Steamed Milk / Crema Mid Layer -->
      <path
        :d="`M 102,${liquidTopY + 30} Q 135,${liquidTopY + 18} 160,${liquidTopY + 34} T 218,${liquidTopY + 24} L 212,${liquidTopY + 80} Q 160,${liquidTopY + 90} 108,${liquidTopY + 80} Z`"
        :fill="theme.layer1"
        class="transition-colors duration-700"
      />

      <!-- Layer 1: Top Soft Microfoam Crown -->
      <rect
        x="95"
        :y="liquidTopY"
        width="130"
        :height="35"
        :fill="theme.top"
        class="transition-colors duration-700"
      />

      <!-- ==========================================
           LIQUID SURFACE MENISCUS (Reacts to Slosh Tilt)
           ========================================== -->
      <g
        :transform="`translate(${160 + liquidOffsetX}, ${liquidTopY}) rotate(${surfaceAngle})`"
        style="transform-origin: 0px 0px"
      >
        <!-- Liquid Top Meniscus Ellipse -->
        <ellipse
          cx="0"
          cy="0"
          :rx="surfaceRx"
          :ry="surfaceRy + sloshWave * 0.4"
          :fill="theme.surface"
          stroke="rgba(255, 255, 255, 0.4)"
          stroke-width="1.2"
        />

        <!-- Swirling Crema Art Ellipse -->
        <ellipse
          cx="0"
          cy="0"
          :rx="surfaceRx * 0.55"
          :ry="(surfaceRy * 0.55) + sloshWave * 0.2"
          :fill="theme.swirl"
          opacity="0.82"
        />
        <circle
          cx="0"
          cy="0"
          r="3.5"
          :fill="theme.cremaBubble"
          opacity="0.9"
        />

        <!-- Micro Crema Bubbles on Surface -->
        <g opacity="0.65">
          <circle :cx="-surfaceRx * 0.35" :cy="-surfaceRy * 0.2" r="1.5" :fill="theme.cremaBubble" />
          <circle :cx="surfaceRx * 0.4" :cy="surfaceRy * 0.15" r="1.8" :fill="theme.cremaBubble" />
          <circle :cx="surfaceRx * 0.2" :cy="-surfaceRy * 0.3" r="1.2" :fill="theme.cremaBubble" />
          <circle :cx="-surfaceRx * 0.2" :cy="surfaceRy * 0.3" r="1.4" :fill="theme.cremaBubble" />
        </g>
      </g>
    </g>
  </g>
</template>


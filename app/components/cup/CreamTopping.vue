<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue'
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

// Vertical anchor offset so cream always rests seamlessly on liquid surface
const verticalOffset = computed(() => {
  // 94 is reference rim Y; offsets cream so its base touches liquidTopY
  return (props.liquidTopY - 94)
})

watch(
  () => props.withCream,
  (val) => {
    if (activeTl.value) activeTl.value.kill()

    const tl = gsap.timeline({
      onComplete: () => {
        activeTl.value = null
      }
    })
    activeTl.value = tl

    if (val && !props.isEmpty) {
      isPiped.value = true

      if (creamContainerEl.value && creamHaloEl.value) {
        gsap.set(creamContainerEl.value, {
          opacity: 0,
          scaleX: 0.3,
          scaleY: 0.1,
          y: verticalOffset.value + 15,
          transformOrigin: '160px 96px',
        })
        gsap.set(creamHaloEl.value, { opacity: 0, scale: 0.5, transformOrigin: '160px 96px' })

        // 1. Soft-serve cream begins extruding and expanding onto coffee surface
        tl.to(creamContainerEl.value, {
          opacity: 1,
          scaleX: 1.05,
          scaleY: 1.12,
          y: verticalOffset.value - 4,
          duration: 0.55,
          ease: 'power2.out',
        })
        // Coffee surface contact shadow & milk halo diffuses
        .to(
          creamHaloEl.value,
          {
            opacity: 0.9,
            scale: 1,
            duration: 0.45,
            ease: 'power1.out',
          },
          0.1
        )
        // 2. Realistic Dairy Cream Recoil & Jiggle (settling like freshly aerated cream)
        .to(
          creamContainerEl.value,
          {
            scaleX: 1,
            scaleY: 1,
            y: verticalOffset.value,
            duration: 0.75,
            ease: 'elastic.out(1.25, 0.38)',
          },
          `-0.1`
        )
      }
    } else {
      // Removing cream: smoothly melts and dissolves down into the coffee
      if (creamContainerEl.value && creamHaloEl.value) {
        tl.to(creamContainerEl.value, {
          scaleX: 0.7,
          scaleY: 0.15,
          y: verticalOffset.value + 12,
          opacity: 0,
          duration: 0.38,
          ease: 'power2.in',
          onComplete: () => {
            isPiped.value = false
          }
        })
        .to(
          creamHaloEl.value,
          {
            opacity: 0,
            scale: 0.7,
            duration: 0.28,
            ease: 'power1.out',
          },
          `-0.25`
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
         1. CONTACT SHADOW & LIQUID MENISCUS ANCHOR
         ========================================== -->
    <ellipse
      ref="creamHaloEl"
      cx="160"
      :cy="liquidTopY + 2"
      rx="62"
      ry="15"
      fill="rgba(35, 18, 8, 0.45)"
      filter="url(#shadowBlur)"
      opacity="0"
    />

    <!-- ==========================================
         2. SOLID VOLUMETRIC SCULPTED 3D WHIPPED CREAM
         ========================================== -->
    <g
      ref="creamContainerEl"
      :style="{
        transform: `translate(${(tiltY / 15) * 3}px, ${verticalOffset + (tiltX / 12) * -1.5}px)`,
        display: withCream ? 'block' : 'none',
        transformOrigin: '160px 96px',
      }"
      class="transition-transform duration-200 ease-out"
    >
      <!-- Base Contact Soft Occlusion Under Cream -->
      <ellipse
        cx="160"
        cy="96"
        rx="62"
        ry="14.5"
        fill="rgba(24, 12, 5, 0.38)"
        filter="url(#shadowBlur)"
      />

      <!-- ====================================================
           LAYER A: SOLID CONTINUOUS CREAM SILHOUETTE (No holes/gaps!)
           ==================================================== -->
      <path
        d="M 97,94 C 96,70 106,62 118,52 C 130,42 142,28 154,12 C 158,5 166,8 168,16 C 178,32 192,46 205,60 C 218,72 223,82 223,94 C 223,103 195,106 160,106 C 125,106 97,103 97,94 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.95)"
        stroke-width="1.2"
        filter="drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))"
      />

      <!-- ====================================================
           LAYER B: SCULPTED 3D STAR-NOZZLE OCCLUSION CREVICES
           ==================================================== -->
      <!-- Tier 1 Base Crevice Shadow Wave -->
      <path
        d="M 100,94 Q 116,78 132,88 Q 148,74 165,86 Q 184,74 200,86 Q 212,80 220,94"
        stroke="url(#creamDeepShadow)"
        stroke-width="7"
        stroke-linecap="round"
        fill="none"
        filter="url(#creamDeepBlur)"
      />
      <!-- Tier 2 Mid Crevice Shadow Wave -->
      <path
        d="M 115,72 Q 138,54 160,66 Q 182,52 205,70"
        stroke="url(#creamDeepShadow)"
        stroke-width="6"
        stroke-linecap="round"
        fill="none"
        filter="url(#creamDeepBlur)"
      />
      <!-- Tier 3 Crown Crevice Shadow -->
      <path
        d="M 135,46 Q 152,28 174,40"
        stroke="url(#creamDeepShadow)"
        stroke-width="4.5"
        stroke-linecap="round"
        fill="none"
        filter="url(#creamDeepBlur)"
      />

      <!-- ====================================================
           LAYER C: TIER 1 - VOLUPTUOUS BASE FLUTED BILLOWS
           ==================================================== -->
      <!-- Base Billow 1 (Left Rim) -->
      <path
        d="M 97,94 C 97,72 116,66 132,78 C 122,90 110,98 97,94 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.9)"
        stroke-width="1"
      />
      <!-- Base Billow 2 (Left-Center) -->
      <path
        d="M 122,84 C 126,60 148,54 160,72 C 146,84 134,90 122,84 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.9)"
        stroke-width="1"
      />
      <!-- Base Billow 3 (Right-Center) -->
      <path
        d="M 152,74 C 162,54 186,56 196,78 C 182,86 168,86 152,74 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.9)"
        stroke-width="1"
      />
      <!-- Base Billow 4 (Right Rim) -->
      <path
        d="M 186,80 C 196,64 220,70 223,94 C 208,100 196,92 186,80 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.9)"
        stroke-width="1"
      />

      <!-- Tier 1 Specular Ridge Highlights -->
      <path d="M 108,88 Q 126,74 146,84" stroke="url(#creamHighlight)" stroke-width="2.6" stroke-linecap="round" fill="none" />
      <path d="M 134,76 Q 156,60 180,72" stroke="url(#creamHighlight)" stroke-width="2.8" stroke-linecap="round" fill="none" />

      <!-- ====================================================
           LAYER D: TIER 2 - SPIRALING MID-TIER STAR FLUTES
           ==================================================== -->
      <!-- Mid Flute Left -->
      <path
        d="M 115,70 C 120,46 142,36 158,50 C 144,60 130,66 115,70 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.95)"
        stroke-width="1"
      />
      <!-- Mid Flute Center -->
      <path
        d="M 142,52 C 150,30 174,32 186,54 C 172,62 156,62 142,52 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.95)"
        stroke-width="1"
      />
      <!-- Mid Flute Right -->
      <path
        d="M 172,56 C 182,38 198,44 204,66 C 194,72 182,68 172,56 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.95)"
        stroke-width="1"
      />

      <!-- Tier 2 Specular Ridge Highlights -->
      <path d="M 124,56 Q 146,38 170,50" stroke="url(#creamHighlight)" stroke-width="2.6" stroke-linecap="round" fill="none" />
      <path d="M 152,46 Q 172,32 194,46" stroke="url(#creamHighlight)" stroke-width="2.4" stroke-linecap="round" fill="none" />

      <!-- ====================================================
           LAYER E: TIER 3 - CROWN PEAK & CURLING TIP
           ==================================================== -->
      <!-- Crown Body Left -->
      <path
        d="M 136,42 C 142,20 156,12 162,28 C 154,36 144,40 136,42 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.95)"
        stroke-width="1"
      />
      <!-- Crown Body Right -->
      <path
        d="M 148,32 C 154,12 168,14 172,32 C 164,36 156,36 148,32 Z"
        fill="url(#realCreamBody)"
        stroke="rgba(255, 255, 255, 0.95)"
        stroke-width="1"
      />
      <!-- Hand-Piped Swirling Curled Tip Horn -->
      <path
        d="M 152,24 C 156,8 165,-4 162,-8 C 157,-7 153,2 151,14 Z"
        fill="#FFFFFF"
        stroke="rgba(255, 255, 255, 0.98)"
        stroke-width="1.2"
        filter="drop-shadow(0 2px 4px rgba(200, 180, 160, 0.45))"
      />

      <!-- Crown Specular Glints -->
      <path d="M 144,34 Q 158,18 170,28" stroke="url(#creamHighlight)" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <path d="M 154,16 Q 160,2 162,-6" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" fill="none" />
    </g>
  </g>
</template>

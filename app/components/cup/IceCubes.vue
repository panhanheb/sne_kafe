<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  iceLevel: 'none' | 'less' | 'regular' | 'extra'
  liquidTopY: number
  tiltY: number
  isEmpty: boolean
  coffeeColorTint?: string
}>()

const emit = defineEmits<{
  (e: 'splash', data: { x: number; y: number }): void
}>()

// Target counts: none=0, less=3, regular=5, extra=7
const targetCount = computed(() => {
  if (props.isEmpty) return 0
  switch (props.iceLevel) {
    case 'less': return 3
    case 'regular': return 5
    case 'extra': return 7
    default: return 0
  }
})

// Cube definitions with natural physical variations & stacking slots
interface CubeData {
  id: number
  w: number
  h: number
  r: number
  baseX: number
  baseYOffset: number
  rot: number
  rotSpeed: number
  phase: number
}

const cubeConfigs: CubeData[] = [
  { id: 1, w: 32, h: 28, r: 5, baseX: 130, baseYOffset: 12, rot: 14, rotSpeed: 0.003, phase: 0 },
  { id: 2, w: 34, h: 30, r: 6, baseX: 172, baseYOffset: 18, rot: -18, rotSpeed: -0.003, phase: 1.2 },
  { id: 3, w: 36, h: 31, r: 6, baseX: 144, baseYOffset: -8, rot: 28, rotSpeed: 0.002, phase: 2.1 },
  { id: 4, w: 33, h: 29, r: 5, baseX: 182, baseYOffset: -4, rot: -14, rotSpeed: -0.004, phase: 3.4 },
  { id: 5, w: 35, h: 30, r: 6, baseX: 126, baseYOffset: -22, rot: 34, rotSpeed: 0.003, phase: 4.2 },
  { id: 6, w: 33, h: 28, r: 5, baseX: 168, baseYOffset: -20, rot: -26, rotSpeed: -0.003, phase: 5.1 },
  { id: 7, w: 32, h: 27, r: 5, baseX: 148, baseYOffset: -34, rot: 10, rotSpeed: 0.002, phase: 0.8 },
]

// Element refs
const cubeRefs = ref<SVGGElement[]>([])
const activeTimeline = ref<gsap.core.Timeline | null>(null)

// Current number of rendered cubes
const visibleCount = ref(0)

// Watch targetCount and animate changes cleanly with GSAP
watch(targetCount, (newCount, oldCount) => {
  if (activeTimeline.value) {
    activeTimeline.value.kill()
  }

  const tl = gsap.timeline({
    onComplete: () => {
      activeTimeline.value = null
    }
  })
  activeTimeline.value = tl

  if (newCount > visibleCount.value) {
    // Add ice cubes with staggered gravity plunge
    const startIdx = visibleCount.value
    visibleCount.value = newCount

    for (let i = startIdx; i < newCount; i++) {
      const el = cubeRefs.value[i]
      if (!el) continue

      const cfg = cubeConfigs[i]
      const targetWaterLine = props.liquidTopY + cfg.baseYOffset
      const startY = 40 + (i * 8) // Start above the rim

      gsap.set(el, {
        y: startY,
        opacity: 0,
        scale: 0.7,
        rotation: cfg.rot - 45,
      })

      // Staggered drop timeline (90ms spacing)
      tl.to(
        el,
        {
          y: targetWaterLine + 24, // Plunge into liquid
          opacity: 1,
          scale: 1,
          rotation: cfg.rot + 12,
          duration: 0.38,
          ease: 'power2.in',
          onComplete: () => {
            emit('splash', { x: cfg.baseX, y: targetWaterLine })
          }
        },
        (i - startIdx) * 0.09
      )
      .to(
        el,
        {
          y: targetWaterLine - 8, // Buoyant pop-up
          rotation: cfg.rot - 4,
          duration: 0.28,
          ease: 'power1.out'
        },
        `>-0.05`
      )
      .to(
        el,
        {
          y: targetWaterLine,
          rotation: cfg.rot,
          duration: 0.24,
          ease: 'sine.inOut'
        }
      )
    }
  } else if (newCount < visibleCount.value) {
    // Removing ice cubes: lift out and fade
    const removeIdx = newCount
    for (let i = removeIdx; i < visibleCount.value; i++) {
      const el = cubeRefs.value[i]
      if (!el) continue

      tl.to(
        el,
        {
          y: `-=40`,
          opacity: 0,
          scale: 0.6,
          duration: 0.3,
          ease: 'power2.in'
        },
        (i - removeIdx) * 0.05
      )
    }

    tl.add(() => {
      visibleCount.value = newCount
    })
  }
})

// Idle sinusoidal bobbing and tilt drift loop
let idleFrameId: number | null = null
let idleTime = 0

function runIdleLoop() {
  idleTime += 0.025
  const tiltDriftX = (props.tiltY / 15) * 6

  for (let i = 0; i < visibleCount.value; i++) {
    const el = cubeRefs.value[i]
    if (!el || (activeTimeline.value && activeTimeline.value.isActive())) continue

    const cfg = cubeConfigs[i]
    const targetY = props.liquidTopY + cfg.baseYOffset
    const bobY = Math.sin(idleTime * 2 + cfg.phase) * 2.5
    const driftX = cfg.baseX + tiltDriftX + (Math.sin(idleTime + cfg.phase) * 1.5)

    gsap.set(el, {
      x: driftX - cfg.baseX,
      y: targetY + bobY,
    })
  }

  idleFrameId = requestAnimationFrame(runIdleLoop)
}

onMounted(() => {
  visibleCount.value = targetCount.value
  idleFrameId = requestAnimationFrame(runIdleLoop)
})

onBeforeUnmount(() => {
  if (idleFrameId !== null) cancelAnimationFrame(idleFrameId)
  if (activeTimeline.value) activeTimeline.value.kill()
})
</script>

<template>
  <g class="ice-cubes-group pointer-events-none">
    <!-- Render pooled cubes up to max 7 -->
    <g
      v-for="(cfg, idx) in cubeConfigs"
      :key="cfg.id"
      ref="cubeRefs"
      :style="{ display: idx < visibleCount ? 'block' : 'none' }"
      filter="url(#iceDropShadow)"
    >
      <!-- 3D Realistic Chamfered Ice Cube -->
      <g :transform="`translate(${cfg.baseX}, 0) rotate(${cfg.rot})`">
        <!-- Main Refracting Clear/Frost Ice Shell -->
        <rect
          :x="-cfg.w / 2"
          :y="-cfg.h / 2"
          :width="cfg.w"
          :height="cfg.h"
          :rx="cfg.r"
          :ry="cfg.r"
          fill="url(#realIceRefract)"
          stroke="rgba(255, 255, 255, 0.82)"
          stroke-width="1.4"
        />

        <!-- Frosted Center Core -->
        <ellipse
          cx="0"
          cy="0"
          :rx="cfg.w * 0.35"
          :ry="cfg.h * 0.35"
          fill="url(#iceFrostCore)"
          opacity="0.8"
        />

        <!-- Internal Crystalline Micro-Fracture Lines -->
        <path
          d="M -7,-5 L -1,1 L 5,-2"
          stroke="rgba(255, 255, 255, 0.9)"
          stroke-width="1.2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
        />
        <path
          d="M -3,3 L 3,7"
          stroke="rgba(255, 255, 255, 0.7)"
          stroke-width="1"
          stroke-linecap="round"
          fill="none"
        />

        <!-- Bright Specular Edge Highlight -->
        <path
          :d="`M ${-cfg.w / 2 + 5},${-cfg.h / 2 + 1} L ${cfg.w / 2 - 5},${-cfg.h / 2 + 1}`"
          stroke="rgba(255, 255, 255, 0.95)"
          stroke-width="1.8"
          stroke-linecap="round"
        />
        <path
          :d="`M ${-cfg.w / 2 + 1},${-cfg.h / 2 + 5} L ${-cfg.w / 2 + 1},${cfg.h / 2 - 5}`"
          stroke="rgba(255, 255, 255, 0.75)"
          stroke-width="1.4"
          stroke-linecap="round"
        />

        <!-- Micro Air Bubbles -->
        <circle cx="5" cy="4" r="1.3" fill="#FFFFFF" opacity="0.85" />
        <circle cx="-5" cy="-2" r="1.0" fill="#FFFFFF" opacity="0.75" />
        <circle cx="2" cy="-6" r="0.8" fill="#FFFFFF" opacity="0.9" />
      </g>
    </g>
  </g>
</template>


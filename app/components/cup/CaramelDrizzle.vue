<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import gsap from 'gsap'

const props = defineProps<{
  withCaramel: boolean
  withCream: boolean
  isEmpty: boolean
}>()

const ribbonGroupEl = ref<SVGGElement | null>(null)
const dripsGroupEl = ref<SVGGElement | null>(null)
const pathEls = ref<SVGPathElement[]>([])
const activeTl = ref<gsap.core.Timeline | null>(null)

watch(
  () => props.withCaramel,
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
      // Animate zig-zag ribbon drawing over top
      if (ribbonGroupEl.value && dripsGroupEl.value) {
        gsap.set(ribbonGroupEl.value, { opacity: 1 })
        gsap.set(dripsGroupEl.value, { opacity: 1 })

        pathEls.value.forEach((path, i) => {
          if (!path) return
          const length = path.getTotalLength() || 180
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })

          tl.to(
            path,
            {
              strokeDashoffset: 0,
              duration: 0.65,
              ease: 'power2.out',
            },
            i * 0.12
          )
        })

        // Drips slowly slide down inside glass wall
        tl.fromTo(
          dripsGroupEl.value,
          { strokeDasharray: 140, strokeDashoffset: 140 },
          { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut' },
          `-0.2`
        )
      }
    } else {
      // Retract drips and fade ribbon
      if (ribbonGroupEl.value && dripsGroupEl.value) {
        tl.to(dripsGroupEl.value, {
          strokeDashoffset: 140,
          duration: 0.35,
          ease: 'power2.in',
        })
        tl.to(
          ribbonGroupEl.value,
          {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          },
          `-0.2`
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
  <g class="caramel-drizzle-group pointer-events-none">
    <!-- Top Zig-Zag Amber Sauce Ribbons -->
    <g
      ref="ribbonGroupEl"
      :style="{ display: withCaramel && !isEmpty ? 'block' : 'none' }"
    >
      <!-- Ribbon 1 (Base/Mid) -->
      <path
        ref="pathEls"
        :d="withCream
          ? 'M 106,82 Q 128,94 154,76 Q 180,60 214,84'
          : 'M 112,88 Q 134,96 160,86 Q 186,76 208,88'"
        stroke="url(#realCaramel)"
        stroke-width="4.5"
        stroke-linecap="round"
        fill="none"
        filter="url(#iceDropShadow)"
      />
      <!-- Specular Highlight Line on Ribbon 1 -->
      <path
        :d="withCream
          ? 'M 108,82 Q 128,93 154,75 Q 180,59 212,83'
          : 'M 114,88 Q 134,95 160,85 Q 186,75 206,87'"
        stroke="url(#caramelSpecular)"
        stroke-width="1.6"
        stroke-linecap="round"
        fill="none"
      />

      <!-- Ribbon 2 (Higher Tier) -->
      <path
        ref="pathEls"
        :d="withCream
          ? 'M 126,58 Q 152,72 178,50 Q 192,42 202,56'
          : 'M 124,84 Q 150,74 176,82 Q 190,88 198,84'"
        stroke="url(#realCaramel)"
        stroke-width="3.8"
        stroke-linecap="round"
        fill="none"
        filter="url(#iceDropShadow)"
      />
      <path
        :d="withCream
          ? 'M 128,58 Q 152,71 178,49 Q 192,41 200,55'
          : 'M 126,84 Q 150,73 176,81 Q 190,87 196,83'"
        stroke="url(#caramelSpecular)"
        stroke-width="1.4"
        stroke-linecap="round"
        fill="none"
      />

      <!-- Crown Peak Ribbon if Cream -->
      <path
        v-if="withCream"
        ref="pathEls"
        d="M 142,32 Q 158,44 176,28"
        stroke="url(#realCaramel)"
        stroke-width="3.2"
        stroke-linecap="round"
        fill="none"
      />
    </g>

    <!-- Caramel Drips Running Down Inside Glass Wall -->
    <g
      ref="dripsGroupEl"
      :style="{ display: withCaramel && !isEmpty ? 'block' : 'none' }"
    >
      <!-- Drip 1 with Teardrop Pool -->
      <path
        d="M 115,92 Q 117,130 119,165 Q 120,185 118,205"
        stroke="url(#realCaramel)"
        stroke-width="3.2"
        stroke-linecap="round"
        fill="none"
        opacity="0.9"
      />
      <ellipse cx="118" cy="207" rx="2.5" ry="3.5" fill="url(#realCaramel)" />

      <!-- Drip 2 with Teardrop Pool -->
      <path
        d="M 198,92 Q 196,120 193,155 Q 191,170 194,185"
        stroke="url(#realCaramel)"
        stroke-width="2.8"
        stroke-linecap="round"
        fill="none"
        opacity="0.85"
      />
      <ellipse cx="194" cy="187" rx="2.2" ry="3" fill="url(#realCaramel)" />
    </g>
  </g>
</template>


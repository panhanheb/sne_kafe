<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  width: number
  height: number
  isIced: boolean
  isHot: boolean
  isEmpty: boolean
}>()
</script>

<template>
  <g class="glass-body-group pointer-events-none">
    <!-- ==========================================
         1. CAUSTIC LIGHT POOL & SOFT CONTACT SHADOW
         ========================================== -->
    <!-- Soft Contact Shadow -->
    <ellipse
      cx="160"
      cy="342"
      rx="54"
      ry="12"
      fill="rgba(24, 12, 6, 0.42)"
      filter="url(#shadowBlur)"
    />
    <!-- Faint Golden/Teal Caustic Light Pool -->
    <ellipse
      cx="160"
      cy="340"
      rx="48"
      ry="9"
      fill="url(#causticGlow)"
      opacity="0.6"
    />

    <!-- ==========================================
         2. THICK GLASS BASE LENS
         ========================================== -->
    <path
      d="M 121,308 Q 123,326 160,326 Q 197,326 199,308 L 199,322 Q 197,338 160,338 Q 123,338 121,322 Z"
      fill="url(#glassBaseGrad)"
      stroke="rgba(255, 255, 255, 0.45)"
      stroke-width="1.2"
    />
    <!-- Bottom base rim -->
    <ellipse
      cx="160"
      cy="326"
      rx="38"
      ry="8.5"
      fill="rgba(255, 255, 255, 0.12)"
      stroke="rgba(255, 255, 255, 0.35)"
      stroke-width="1.4"
    />

    <!-- ==========================================
         3. CLEAR TUMBLER WALLS & SPECULAR REFLECTIONS
         ========================================== -->
    <!-- Front Glass Wall Specular Wash -->
    <path
      d="M 97,90 L 121,310 Q 123,326 160,326 Q 197,326 199,310 L 223,90 Z"
      fill="url(#glassWallWash)"
      stroke="rgba(255, 255, 255, 0.35)"
      stroke-width="1.6"
    />

    <!-- Left Bright Cylindrical Specular Streak -->
    <path
      d="M 103,96 L 123,304"
      stroke="url(#leftSpecularStreak)"
      stroke-width="5"
      stroke-linecap="round"
      opacity="0.9"
    />
    <path
      d="M 108,102 L 126,292"
      stroke="rgba(255, 255, 255, 0.45)"
      stroke-width="1.8"
      stroke-linecap="round"
    />

    <!-- Right Softer Specular Streak -->
    <path
      d="M 217,96 L 197,304"
      stroke="url(#rightSpecularStreak)"
      stroke-width="3.5"
      stroke-linecap="round"
      opacity="0.65"
    />

    <!-- Top Rim Front Glaze -->
    <ellipse
      cx="160"
      cy="90"
      rx="63"
      ry="15"
      fill="none"
      stroke="url(#rimHighlightGrad)"
      stroke-width="2.2"
    />
    <ellipse
      cx="160"
      cy="90"
      rx="60"
      ry="13.2"
      fill="none"
      stroke="rgba(255, 255, 255, 0.3)"
      stroke-width="1"
    />

    <!-- Subtle Etched 8/12/16 oz Measurements -->
    <g opacity="0.32" stroke="rgba(255, 255, 255, 0.85)" stroke-width="1">
      <line x1="210" y1="130" x2="218" y2="130" />
      <text x="206" y="133" font-size="7.5" font-weight="700" fill="rgba(255, 255, 255, 0.7)" text-anchor="end" font-family="'JetBrains Mono', monospace">16 oz</text>
      <line x1="204" y1="180" x2="212" y2="180" />
      <text x="200" y="183" font-size="7.5" font-weight="700" fill="rgba(255, 255, 255, 0.7)" text-anchor="end" font-family="'JetBrains Mono', monospace">12 oz</text>
      <line x1="198" y1="230" x2="206" y2="230" />
      <text x="194" y="233" font-size="7.5" font-weight="700" fill="rgba(255, 255, 255, 0.7)" text-anchor="end" font-family="'JetBrains Mono', monospace">8 oz</text>
    </g>

    <!-- Frosted Brand Logo -->
    <g opacity="0.4">
      <rect
        x="126"
        y="174"
        width="68"
        height="22"
        rx="6"
        fill="rgba(255, 255, 255, 0.12)"
        stroke="rgba(255, 255, 255, 0.3)"
        stroke-width="0.8"
      />
      <text
        x="160"
        y="189"
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

    <!-- ==========================================
         4. CONDENSATION DROPLETS (For Iced Drinks)
         ========================================== -->
    <g v-if="isIced && !isEmpty" class="condensation-group" opacity="0.75">
      <ellipse cx="118" cy="138" rx="1.6" ry="2.6" fill="rgba(255, 255, 255, 0.9)" />
      <ellipse cx="123" cy="170" rx="1.4" ry="2.2" fill="rgba(255, 255, 255, 0.85)" />
      <ellipse cx="127" cy="205" rx="2" ry="3.2" fill="rgba(255, 255, 255, 0.85)" />
      <ellipse cx="132" cy="245" rx="1.8" ry="2.8" fill="rgba(255, 255, 255, 0.8)" />
      <ellipse cx="193" cy="155" rx="1.8" ry="2.9" fill="rgba(255, 255, 255, 0.9)" />
      <ellipse cx="188" cy="215" rx="1.5" ry="2.4" fill="rgba(255, 255, 255, 0.85)" />
      <ellipse cx="178" cy="265" rx="2.2" ry="3.6" fill="rgba(255, 255, 255, 0.8)" />
      <ellipse cx="145" cy="190" rx="1.2" ry="1.8" fill="rgba(255, 255, 255, 0.8)" />
      <ellipse cx="172" cy="180" rx="1.3" ry="2" fill="rgba(255, 255, 255, 0.8)" />

      <!-- Single Slowly Dripping Tear Droplet -->
      <g class="animate-slow-drip">
        <ellipse cx="122" cy="150" rx="1.8" ry="2.8" fill="rgba(255, 255, 255, 0.95)" />
        <line x1="122" y1="140" x2="122" y2="150" stroke="rgba(255, 255, 255, 0.4)" stroke-width="0.8" />
      </g>
    </g>

    <!-- ==========================================
         5. WISPY STEAM (For Hot Drinks)
         ========================================== -->
    <g v-if="isHot && !isEmpty" class="steam-group" opacity="0.35">
      <path
        d="M 145,85 Q 138,55 148,30 T 142,5"
        stroke="rgba(255, 255, 255, 0.8)"
        stroke-width="5"
        stroke-linecap="round"
        fill="none"
        filter="url(#steamBlur)"
        class="animate-steam-1"
      />
      <path
        d="M 162,85 Q 170,50 158,25 T 166,-2"
        stroke="rgba(255, 255, 255, 0.8)"
        stroke-width="6"
        stroke-linecap="round"
        fill="none"
        filter="url(#steamBlur)"
        class="animate-steam-2"
      />
      <path
        d="M 178,85 Q 182,58 172,35 T 176,10"
        stroke="rgba(255, 255, 255, 0.7)"
        stroke-width="4.5"
        stroke-linecap="round"
        fill="none"
        filter="url(#steamBlur)"
        class="animate-steam-3"
      />
    </g>
  </g>
</template>

<style scoped>
@keyframes slowDrip {
  0% { transform: translateY(0); opacity: 0; }
  20% { opacity: 1; }
  85% { transform: translateY(68px); opacity: 0.9; }
  100% { transform: translateY(85px); opacity: 0; }
}

.animate-slow-drip {
  animation: slowDrip 7.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes steamRise1 {
  0% { transform: translateY(0) scaleX(1); opacity: 0; }
  35% { opacity: 0.45; }
  100% { transform: translateY(-40px) scaleX(1.4); opacity: 0; }
}

@keyframes steamRise2 {
  0% { transform: translateY(0) scaleX(1); opacity: 0; }
  45% { opacity: 0.5; }
  100% { transform: translateY(-48px) scaleX(1.3); opacity: 0; }
}

.animate-steam-1 {
  animation: steamRise1 3.2s ease-in-out infinite;
}
.animate-steam-2 {
  animation: steamRise2 3.8s 0.6s ease-in-out infinite;
}
.animate-steam-3 {
  animation: steamRise1 3.5s 1.2s ease-in-out infinite;
}
</style>


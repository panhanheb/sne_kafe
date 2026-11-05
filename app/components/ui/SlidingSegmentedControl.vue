<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'
import { useResizeObserver } from '@vueuse/core'

export interface SegmentOption {
  id: string
  label: string
  subtitle?: string
  badge?: string
}

const props = defineProps<{
  options: SegmentOption[]
  modelValue: string
  activeColor?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const containerEl = ref<HTMLElement | null>(null)
const buttonEls = ref<Record<string, HTMLElement | null>>({})

const pillStyle = ref({
  width: '0px',
  height: '0px',
  transform: 'translate3d(0, 0, 0)',
  opacity: 0,
})

const updatePill = async () => {
  await nextTick()
  if (!containerEl.value) return

  const activeBtn = buttonEls.value[props.modelValue]
  if (!activeBtn || activeBtn.offsetWidth === 0) return

  pillStyle.value = {
    width: `${activeBtn.offsetWidth}px`,
    height: `${activeBtn.offsetHeight}px`,
    transform: `translate3d(${activeBtn.offsetLeft}px, ${activeBtn.offsetTop}px, 0)`,
    opacity: 1,
  }
}

watch(
  () => props.modelValue,
  () => {
    updatePill()
  }
)

watch(
  () => props.options,
  () => {
    updatePill()
  },
  { deep: true }
)

// Auto-recalculate pill dimensions on container resize or accordion expansion
useResizeObserver(containerEl, () => {
  updatePill()
})

onMounted(() => {
  updatePill()
  // Slight delay for entrance transitions
  setTimeout(updatePill, 100)
  setTimeout(updatePill, 350)
})

const selectOption = (id: string) => {
  emit('update:modelValue', id)
}
</script>

<template>
  <div
    ref="containerEl"
    class="relative grid gap-1.5 p-1.5 rounded-2xl bg-black/55 border border-white/10 shadow-inner select-none"
    :style="{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }"
  >
    <!-- Sliding spring pill indicator -->
    <div
      class="absolute top-0 left-0 rounded-xl pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] z-0"
      :class="activeColor || 'liquid-glass-button text-teal-darkText shadow-md'"
      :style="pillStyle"
    />

    <!-- Option Buttons -->
    <button
      v-for="opt in options"
      :key="opt.id"
      :ref="(el) => { buttonEls[opt.id] = el as HTMLElement }"
      type="button"
      class="relative z-10 py-2 px-1 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-accent"
      :class="modelValue === opt.id ? 'text-teal-darkText font-black' : 'text-coffee-muted hover:text-white'"
      @click="selectOption(opt.id)"
    >
      <span class="truncate">{{ opt.label }}</span>
      <span
        v-if="opt.subtitle"
        class="text-[10px] font-normal opacity-85 font-mono"
      >
        {{ opt.subtitle }}
      </span>
      <span
        v-if="opt.badge"
        class="text-[9px] px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 font-semibold mt-0.5"
      >
        {{ opt.badge }}
      </span>
    </button>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Sparkles, ShoppingBag, RotateCcw } from 'lucide-vue-next'
import { useProducts, type DisplayProduct } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useI18n } from '~/composables/useI18n'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { products } = useProducts()
const cartStore = useCartStore()
const { t, isKhmer, locale } = useI18n()

const currentStep = ref(0)
const answers = ref<number[]>([])
const isFinished = ref(false)

const quizQuestions = computed(() => t.value.quiz.questions)

const selectOption = (type: string, index: number) => {
  answers.value[currentStep.value] = index
  if (currentStep.value < quizQuestions.value.length - 1) {
    currentStep.value++
  } else {
    isFinished.value = true
  }
}

const recommendedDrink = computed<DisplayProduct>(() => {
  const votes: Record<string, number> = { cappuccino: 0, latte: 0, mocha: 0 }
  answers.value.forEach((answerIndex, questionIndex) => {
    const opt = quizQuestions.value[questionIndex]?.options[answerIndex]
    if (opt?.type) {
      votes[opt.type] = (votes[opt.type] || 0) + 1
    }
  })

  let highestType = 'cappuccino'
  let maxCount = -1
  for (const key of ['cappuccino', 'latte', 'mocha']) {
    if (votes[key] > maxCount) {
      maxCount = votes[key]
      highestType = key
    }
  }

  return products.value.find(p => p.id === highestType) || products.value[0]
})

const restartQuiz = () => {
  currentStep.value = 0
  answers.value = []
  isFinished.value = false
}

const handleAddToCart = () => {
  if (recommendedDrink.value) {
    cartStore.addItem(recommendedDrink.value)
    cartStore.openCart()
    emit('close')
  }
}
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        @click.self="emit('close')"
      >
        <div
          class="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 border border-coffee-sand/30 shadow-2xl animate-scaleIn overflow-hidden"
        >
          <!-- Close button -->
          <button
            type="button"
            class="absolute top-5 right-5 p-2 rounded-full text-coffee-muted hover:text-white hover:bg-white/10 transition-colors"
            @click="emit('close')"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- Step Progress indicator (if quiz in progress) -->
          <div v-if="!isFinished" class="mb-6">
            <div class="flex items-center justify-between text-xs font-semibold text-coffee-sand mb-2">
              <span :class="isKhmer ? 'font-khmer' : ''">
                {{ t.quiz.qProgress }} {{ currentStep + 1 }} / {{ quizQuestions.length }}
              </span>
              <span>{{ Math.round(((currentStep + 1) / quizQuestions.length) * 100) }}%</span>
            </div>
            <div class="w-full h-1.5 bg-coffee-dark rounded-full overflow-hidden">
              <div
                class="h-full bg-teal-accent transition-all duration-300"
                :style="{ width: `${((currentStep + 1) / quizQuestions.length) * 100}%` }"
              />
            </div>
          </div>

          <!-- Quiz Questions -->
          <div v-if="!isFinished">
            <h3
              class="text-xl sm:text-2xl font-bold text-coffee-sand mb-5 leading-snug"
              :class="isKhmer ? 'font-khmer leading-snug' : ''"
            >
              {{ quizQuestions[currentStep].title }}
            </h3>

            <div class="space-y-3">
              <button
                v-for="(option, idx) in quizQuestions[currentStep].options"
                :key="idx"
                type="button"
                class="w-full text-left p-4 rounded-2xl bg-coffee-dark/70 hover:bg-coffee-light/60 border border-coffee-sand/15 hover:border-teal-accent/50 text-coffee-cream text-xs sm:text-sm font-medium transition-all duration-200 hover:translate-x-1 flex items-center justify-between group"
                @click="selectOption(option.type, idx)"
              >
                <span :class="isKhmer ? 'font-khmer' : ''">{{ option.text }}</span>
                <span class="w-5 h-5 rounded-full border border-coffee-sand/30 flex items-center justify-center text-teal-accent group-hover:border-teal-accent group-hover:bg-teal-accent/10 shrink-0 ml-3">
                  <span class="w-2 h-2 rounded-full bg-transparent group-hover:bg-teal-accent transition-colors" />
                </span>
              </button>
            </div>
          </div>

          <!-- Result View -->
          <div v-else class="text-center py-2 space-y-6">
            <div
              class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-accent/15 text-teal-accent text-xs font-bold"
              :class="isKhmer ? 'font-khmer' : ''"
            >
              <Sparkles class="w-4 h-4" />
              <span>{{ t.quiz.resultTag }}</span>
            </div>

            <div class="w-36 h-36 mx-auto animate-float">
              <NuxtImg
                :src="recommendedDrink.image"
                :alt="recommendedDrink.name"
                width="144"
                height="144"
                class="w-full h-full object-contain filter drop-shadow-cup"
              />
            </div>

            <div>
              <h3
                class="text-2xl sm:text-3xl font-extrabold text-coffee-sand"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ recommendedDrink.name }}
              </h3>
              <p
                class="text-xs sm:text-sm text-coffee-muted mt-2 max-w-sm mx-auto"
                :class="isKhmer ? 'font-khmer' : ''"
              >
                {{ recommendedDrink.description }}
              </p>
              <p class="text-lg font-bold text-white mt-2">
                {{ recommendedDrink.formattedPrice }}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-teal-accent hover:bg-teal-hover text-teal-darkText font-bold text-sm tracking-wide shadow-glow transition-all"
                @click="handleAddToCart"
              >
                <ShoppingBag class="w-4 h-4" />
                <span :class="isKhmer ? 'font-khmer' : ''">{{ t.quiz.resultBtnOrder }}</span>
              </button>

              <button
                type="button"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-coffee-sand/30 hover:border-coffee-sand text-coffee-sand text-xs font-medium transition-colors"
                @click="restartQuiz"
              >
                <RotateCcw class="w-3.5 h-3.5" />
                <span :class="isKhmer ? 'font-khmer' : ''">{{ t.quiz.resultBtnRestart }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

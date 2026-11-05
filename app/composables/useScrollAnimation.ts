import { ref, onMounted, onBeforeUnmount } from 'vue'
import { use8DAudio } from './use8DAudio'

export const useScrollAnimation = () => {
  const { triggerScroll8D, playCardCue, resumeAudio } = use8DAudio()

  const scrollY = ref(0)
  const scrollVelocity = ref(0)
  const scrollDirection = ref<'down' | 'up'>('down')
  const isScrolling = ref(false)

  let lastScrollY = 0
  let lastScrollTime = 0
  let scrollStopTimer: ReturnType<typeof setTimeout> | null = null
  let observer: IntersectionObserver | null = null

  const handleScroll = () => {
    if (typeof window === 'undefined') return

    const currentY = window.scrollY
    const now = performance.now()
    const dt = Math.max(1, now - lastScrollTime)
    const dy = currentY - lastScrollY

    const velocity = Math.abs(dy) / (dt / 1000) // pixels per second
    const direction: 'down' | 'up' = dy >= 0 ? 'down' : 'up'

    scrollY.value = currentY
    scrollVelocity.value = velocity
    scrollDirection.value = direction
    isScrolling.value = true

    lastScrollY = currentY
    lastScrollTime = now

    // Trigger subtle 8D acoustic cue as customer scrolls
    triggerScroll8D(velocity, direction)

    if (scrollStopTimer) clearTimeout(scrollStopTimer)
    scrollStopTimer = setTimeout(() => {
      isScrolling.value = false
      scrollVelocity.value = 0
    }, 150)
  }

  // Setup IntersectionObserver for smooth 8D scroll reveal
  const initScrollObserver = (selector = '.reveal-on-scroll') => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

    if (observer) {
      observer.disconnect()
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')

            // If the element is a product card, trigger spatial 8D acoustic chime at its X position
            if (entry.target.classList.contains('spatial-8d-card')) {
              const rect = entry.target.getBoundingClientRect()
              const screenXRatio = (rect.left + rect.width / 2) / window.innerWidth
              playCardCue(screenXRatio)
            }
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    )

    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => observer!.observe(el))
  }

  const refreshObserver = () => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        initScrollObserver()
      }, 80)
    }
  }

  onMounted(() => {
    lastScrollY = window.scrollY
    lastScrollTime = performance.now()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('pointerdown', resumeAudio, { once: true, passive: true })

    initScrollObserver()
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll)
    }
    if (scrollStopTimer) clearTimeout(scrollStopTimer)
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    scrollY,
    scrollVelocity,
    scrollDirection,
    isScrolling,
    initScrollObserver,
    refreshObserver,
  }
}


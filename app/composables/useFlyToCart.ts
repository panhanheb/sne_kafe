import { ref } from 'vue'
import gsap from 'gsap'

export interface FlyToCartOptions {
  sourceEl?: HTMLElement | SVGElement | null
  sourceRect?: DOMRect | null
  imageSrc?: string
  targetSelector?: string
  glowColor?: string
  duration?: number
  onComplete?: () => void
}

// Global active flight counter to coordinate cart bounces
const isFlying = ref(false)
const cartBounceTrigger = ref(0)

export function useFlyToCart() {
  /**
   * Triggers a physically believable parabolic arc animation of a product
   * flying from the source (e.g. modal cup or card image) to the cart icon in the header.
   */
  const flyToCart = (options: FlyToCartOptions): Promise<void> => {
    return new Promise((resolve) => {
      if (!import.meta.client || typeof window === 'undefined') {
        options.onComplete?.()
        resolve()
        return
      }

      // Check prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReducedMotion) {
        // Immediate fallback: skip projectile motion, trigger cart bounce directly
        cartBounceTrigger.value++
        options.onComplete?.()
        resolve()
        return
      }

      // 1. Locate Target (Header Cart Button)
      const targetSelector = options.targetSelector || '#app-cart-button'
      const targetEl = document.querySelector(targetSelector) as HTMLElement | null

      if (!targetEl) {
        // If target not found, fallback gracefully
        cartBounceTrigger.value++
        options.onComplete?.()
        resolve()
        return
      }

      const targetRect = targetEl.getBoundingClientRect()

      // 2. Locate Source Rect
      let startRect: DOMRect | null = options.sourceRect || null
      if (!startRect && options.sourceEl) {
        startRect = options.sourceEl.getBoundingClientRect()
      }

      // If no valid source rect, pick center screen
      if (!startRect || startRect.width === 0 || startRect.height === 0) {
        startRect = new DOMRect(
          window.innerWidth / 2 - 40,
          window.innerHeight / 2 - 40,
          80,
          80
        )
      }

      isFlying.value = true

      // 3. Create Flying Proxy Element
      const startX = startRect.left + startRect.width / 2
      const startY = startRect.top + startRect.height / 2
      const targetX = targetRect.left + targetRect.width / 2
      const targetY = targetRect.top + targetRect.height / 2

      const flyerSize = Math.min(Math.max(startRect.width * 0.75, 64), 140)

      const flyer = document.createElement('div')
      flyer.className = 'fly-to-cart-proxy'
      flyer.setAttribute('aria-hidden', 'true')

      // Styling for the flying proxy
      Object.assign(flyer.style, {
        position: 'fixed',
        left: `${startX - flyerSize / 2}px`,
        top: `${startY - flyerSize / 2}px`,
        width: `${flyerSize}px`,
        height: `${flyerSize}px`,
        zIndex: '99999',
        pointerEvents: 'none',
        transformOrigin: 'center center',
        willChange: 'transform, opacity',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })

      // Inner image wrapper with glass backdrop and warm glow
      const inner = document.createElement('div')
      Object.assign(inner.style, {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(234, 163, 75, 0.35) 0%, rgba(43, 29, 22, 0.8) 75%)',
        boxShadow: `0 12px 30px ${options.glowColor || 'rgba(234, 163, 75, 0.45)'}, inset 0 1px 2px rgba(255,255,255,0.4)`,
        border: '1px solid rgba(217, 168, 124, 0.4)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '12%',
      })

      if (options.imageSrc) {
        const img = document.createElement('img')
        img.src = options.imageSrc
        img.alt = 'Flying product'
        Object.assign(img.style, {
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))',
        })
        inner.appendChild(img)
      } else {
        // Fallback coffee cup SVG icon if no image provided
        inner.innerHTML = `
          <svg class="w-8 h-8 text-[#EAA34B]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 19h16v2H4v-2zm14-9V5H2v10a4 4 0 004 4h8a4 4 0 004-4v-2h2a3 3 0 003-3v-2a3 3 0 00-3-3h-2zm0 3h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v-4zM4 7h12v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/>
          </svg>
        `
      }

      flyer.appendChild(inner)
      document.body.appendChild(flyer)

      // Optional trail particle emitter
      const spawnSparkle = (x: number, y: number) => {
        const p = document.createElement('div')
        const size = Math.random() * 6 + 3
        Object.assign(p.style, {
          position: 'fixed',
          left: `${x}px`,
          top: `${y}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#F5C27A',
          boxShadow: '0 0 8px #EAA34B',
          pointerEvents: 'none',
          zIndex: '99998',
          opacity: '0.9',
          transform: 'translate(-50%, -50%)',
        })
        document.body.appendChild(p)

        gsap.to(p, {
          scale: 0,
          opacity: 0,
          y: '+=18',
          duration: 0.45,
          ease: 'power1.out',
          onComplete: () => p.remove(),
        })
      }

      // 4. Parabolic Curved Physics Path Calculation
      // Horizontal delta and vertical delta
      const deltaX = targetX - startX
      const deltaY = targetY - startY

      // Arc apex: Lift slightly upwards first to feel physically plucked and tossed
      // If moving upwards (deltaY < 0), apex is higher than target. If moving downwards, apex lifts above start.
      const arcLift = Math.max(90, Math.abs(deltaX) * 0.22)
      const apexY = Math.max(16, Math.min(startY, targetY) - arcLift)

      // Timeline for smooth curved trajectory
      const duration = options.duration || 0.78
      const tl = gsap.timeline({
        onComplete: () => {
          flyer.remove()
          isFlying.value = false

          // Trigger target bounce & cart count pop
          cartBounceTrigger.value++
          options.onComplete?.()
          resolve()
        },
      })

      // Interpolation progress object
      const motion = { progress: 0 }
      let lastSparkleTime = 0

      tl.to(motion, {
        progress: 1,
        duration,
        ease: 'power1.inOut',
        onUpdate: () => {
          const t = motion.progress

          // Quadratic Bézier curve: B(t) = (1-t)^2 * P0 + 2*(1-t)*t * P1 + t^2 * P2
          // Control point P1 has x at halfway, y at apex
          const p0x = startX
          const p0y = startY
          const p1x = startX + deltaX * 0.45
          const p1y = apexY
          const p2x = targetX
          const p2y = targetY

          const currentX = (1 - t) * (1 - t) * p0x + 2 * (1 - t) * t * p1x + t * t * p2x
          const currentY = (1 - t) * (1 - t) * p0y + 2 * (1 - t) * t * p1y + t * t * p2y

          // Aerodynamic tilt tangent: derivative of quadratic curve
          const dx = 2 * (1 - t) * (p1x - p0x) + 2 * t * (p2x - p1x)
          const dy = 2 * (1 - t) * (p1y - p0y) + 2 * t * (p2y - p1y)
          const angleDeg = Math.max(-28, Math.min(28, (Math.atan2(dy, dx) * 180) / Math.PI * 0.4))

          // Realistic Scale:
          // 0% -> 20%: swell slightly to 1.15 (feeling of being picked up)
          // 20% -> 100%: smooth shrink down to 0.22 as it enters the cart opening
          let scale = 1.0
          if (t < 0.2) {
            scale = 1.0 + (t / 0.2) * 0.18
          } else {
            const shrinkT = (t - 0.2) / 0.8
            scale = 1.18 - shrinkT * 0.94 // ends at ~0.24
          }

          // Opacity: high until final 12% then drops to 0
          const opacity = t > 0.88 ? 1 - (t - 0.88) / 0.12 : 1

          flyer.style.left = `${currentX - flyerSize / 2}px`
          flyer.style.top = `${currentY - flyerSize / 2}px`
          flyer.style.transform = `scale(${scale}) rotate(${angleDeg}deg)`
          flyer.style.opacity = `${opacity}`

          // Spawn occasional subtle sparkles
          const now = Date.now()
          if (now - lastSparkleTime > 70 && t < 0.85) {
            lastSparkleTime = now
            spawnSparkle(currentX, currentY)
          }
        },
      })
    })
  }

  return {
    flyToCart,
    isFlying,
    cartBounceTrigger,
  }
}


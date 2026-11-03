import { ref, watch, onBeforeUnmount } from 'vue'

export function useSlosh(
  getTiltX: () => number,
  getTiltY: () => number
) {
  const surfaceAngle = ref(0)
  const sloshWave = ref(0)
  const liquidOffsetX = ref(0)

  let animationFrameId: number | null = null
  let currentAngle = 0
  let targetAngle = 0
  let sloshVelocity = 0
  let sloshDisplacement = 0

  const springK = 0.08
  const damping = 0.82

  function update() {
    // Target angle counteracts cup tilt Y so liquid surface stays level with ground
    const tiltY = getTiltY()
    const tiltX = getTiltX()

    targetAngle = -tiltY * 0.95
    liquidOffsetX.value = (tiltY / 15) * 8

    // Spring physics for slosh wobble
    const force = (targetAngle - currentAngle) * springK
    sloshVelocity = (sloshVelocity + force) * damping
    currentAngle += sloshVelocity

    surfaceAngle.value = currentAngle

    // Slosh wave amplitude
    sloshDisplacement = Math.abs(sloshVelocity) * 2.5
    sloshWave.value = sloshDisplacement

    animationFrameId = requestAnimationFrame(update)
  }

  // Start loop on client
  if (import.meta.client) {
    animationFrameId = requestAnimationFrame(update)
  }

  onBeforeUnmount(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    surfaceAngle,
    sloshWave,
    liquidOffsetX,
  }
}


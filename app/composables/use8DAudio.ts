import { ref, computed } from 'vue'

// Global shared state for 8D Spatial Audio
const is8DAudioMuted = ref(false)
const is8DActive = ref(false)
const current8DPan = ref(0)
const lastScrollSoundTime = ref(0)
const scrollPanAngle = ref(0)
const activePreviewProductId = ref<string | null>(null)

class Global8DSpatialAudioEngine {
  private ctx: AudioContext | null = null
  private compressor: DynamicsCompressorNode | null = null
  private cafeConvolver: ConvolverNode | null = null
  private convolverGain: GainNode | null = null

  public init() {
    if (typeof window === 'undefined') return
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      this.ctx = new AudioCtx()

      // Studio Master Compressor to keep 8D audio warm, crisp, and prevent digital clipping
      this.compressor = this.ctx.createDynamicsCompressor()
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime)
      this.compressor.knee.setValueAtTime(6, this.ctx.currentTime)
      this.compressor.ratio.setValueAtTime(3.2, this.ctx.currentTime)
      this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime)
      this.compressor.release.setValueAtTime(0.12, this.ctx.currentTime)
      this.compressor.connect(this.ctx.destination)

      // Cafe Room Impulse Convolver for 8D binaural acoustic depth
      try {
        const sr = this.ctx.sampleRate
        const irLen = Math.floor(sr * 0.24)
        const irBuf = this.ctx.createBuffer(2, irLen, sr)
        const left = irBuf.getChannelData(0)
        const right = irBuf.getChannelData(1)
        const decay = 9.0

        for (let i = 0; i < irLen; i++) {
          const t = i / sr
          const env = Math.exp(-t * decay)
          left[i] = (Math.random() * 2 - 1) * env * 0.3
          right[i] = (Math.random() * 2 - 1) * env * 0.3
        }

        this.cafeConvolver = this.ctx.createConvolver()
        this.cafeConvolver.buffer = irBuf

        this.convolverGain = this.ctx.createGain()
        this.convolverGain.gain.setValueAtTime(0.12, this.ctx.currentTime)
        this.cafeConvolver.connect(this.convolverGain)
        this.convolverGain.connect(this.compressor)
      } catch (e) {
        // Fallback gracefully
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public resume() {
    this.init()
  }

  // Create an 8D spatial node with stereo panning + head-shadow filter
  private create8DNode(panValue: number, duration: number) {
    if (!this.ctx || !this.compressor) return null
    const clampedPan = Math.max(-0.95, Math.min(0.95, panValue))
    current8DPan.value = clampedPan

    const now = this.ctx.currentTime
    const panner = this.ctx.createStereoPanner()
    panner.pan.setValueAtTime(clampedPan, now)

    // Head-shadow HRTF acoustic filter (slight high-frequency attenuation for far ear)
    const headFilter = this.ctx.createBiquadFilter()
    headFilter.type = 'lowpass'
    headFilter.frequency.setValueAtTime(14000 - Math.abs(clampedPan) * 4500, now)

    const dryGain = this.ctx.createGain()
    dryGain.gain.setValueAtTime(1.0, now)

    dryGain.connect(headFilter)
    headFilter.connect(panner)
    panner.connect(this.compressor)

    if (this.cafeConvolver) {
      const wetGain = this.ctx.createGain()
      wetGain.gain.setValueAtTime(0.2, now)
      dryGain.connect(wetGain)
      wetGain.connect(this.cafeConvolver)
    }

    return { input: dryGain, panner, now }
  }

  // 1. Delicate 8D Spatial Scroll Acoustic Cue
  // Subtle hydrodynamic wisp + micro-modal resonance orbiting across ears on scroll
  public playScrollAcoustic(velocity: number, direction: 'down' | 'up') {
    if (is8DAudioMuted.value) return
    this.init()
    if (!this.ctx) return

    // Advance 8D soundstage orbit angle based on scroll direction
    const deltaAngle = (direction === 'down' ? 0.35 : -0.35)
    scrollPanAngle.value += deltaAngle
    const pan = Math.sin(scrollPanAngle.value)

    const node = this.create8DNode(pan, 0.14)
    if (!node) return
    const { input, now } = node

    is8DActive.value = true
    setTimeout(() => { is8DActive.value = false }, 180)

    // Gentle filtered fluid whisper
    const sr = this.ctx.sampleRate
    const dur = 0.11
    const len = Math.floor(sr * dur)
    const buf = this.ctx.createBuffer(1, len, sr)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) {
      const env = Math.sin((i / len) * Math.PI)
      data[i] = (Math.random() * 2 - 1) * env * 0.28
    }

    const src = this.ctx.createBufferSource()
    src.buffer = buf

    const bandpass = this.ctx.createBiquadFilter()
    bandpass.type = 'bandpass'
    bandpass.frequency.setValueAtTime(2600 + Math.abs(pan) * 400, now)
    bandpass.Q.setValueAtTime(3.2, now)

    const gain = this.ctx.createGain()
    const volume = Math.min(0.08, 0.02 + (velocity / 1200) * 0.06)
    gain.gain.setValueAtTime(0.005, now)
    gain.gain.linearRampToValueAtTime(volume, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur)

    src.connect(bandpass)
    bandpass.connect(gain)
    gain.connect(input)
    src.start(now)

    // Subtle glass micro-resonance harmonic
    const osc = this.ctx.createOscillator()
    const oscGain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(2150, now)

    oscGain.gain.setValueAtTime(0.001, now)
    oscGain.gain.linearRampToValueAtTime(volume * 0.35, now + 0.01)
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    osc.connect(oscGain)
    oscGain.connect(input)
    osc.start(now)
    osc.stop(now + dur)
  }

  // 2. Spatial Card Focus Sound (placed at normalized screen X position: -0.8 to +0.8)
  public playCardCue(screenXRatio: number) {
    if (is8DAudioMuted.value) return
    this.init()
    if (!this.ctx) return

    const pan = Math.max(-0.85, Math.min(0.85, (screenXRatio - 0.5) * 1.7))
    const node = this.create8DNode(pan, 0.22)
    if (!node) return
    const { input, now } = node

    is8DActive.value = true
    setTimeout(() => { is8DActive.value = false }, 250)

    // Double organic glass clink at card position
    const f0 = 2240
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(f0, now)
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(f0 * 1.62, now)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(input)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.22)
    osc2.stop(now + 0.22)
  }

  // 3. Full 1.5s 8D Spatial Audio Preview for a Specific Product Card
  public playProduct8DExperience(productId: string, screenXRatio = 0.5) {
    if (is8DAudioMuted.value) return
    this.init()
    if (!this.ctx) return

    activePreviewProductId.value = productId
    is8DActive.value = true

    const now = this.ctx.currentTime
    const duration = 1.6

    // Animate 8D panner sweeping 360° binaurally from screen location around user
    const startPan = Math.max(-0.8, Math.min(0.8, (screenXRatio - 0.5) * 1.6))
    const panner = this.ctx.createStereoPanner()
    panner.pan.setValueAtTime(startPan, now)
    panner.pan.linearRampToValueAtTime(0.9, now + 0.5)
    panner.pan.linearRampToValueAtTime(-0.9, now + 1.1)
    panner.pan.linearRampToValueAtTime(0, now + duration)
    panner.connect(this.compressor!)

    const master = this.ctx.createGain()
    master.gain.setValueAtTime(0.8, now)
    master.connect(panner)

    const id = productId.toLowerCase()

    if (id.includes('cold') || id.includes('americano') || id.includes('iced')) {
      // 8D Cold Brew / Ice Experience: Ice tumble clinks + cold fluid splash
      const clinkTimes = [0.0, 0.22, 0.48, 0.75, 1.05]
      clinkTimes.forEach((tOffset, idx) => {
        const clinkNow = now + tOffset
        const osc = this.ctx!.createOscillator()
        const oscGain = this.ctx!.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(2180 + idx * 110, clinkNow)
        oscGain.gain.setValueAtTime(0.01, clinkNow)
        oscGain.gain.linearRampToValueAtTime(0.22, clinkNow + 0.006)
        oscGain.gain.exponentialRampToValueAtTime(0.001, clinkNow + 0.16)
        osc.connect(oscGain)
        oscGain.connect(master)
        osc.start(clinkNow)
        osc.stop(clinkNow + 0.16)
      })
    } else if (id.includes('latte') || id.includes('cappuccino')) {
      // 8D Steamed Milk Froth & Espresso Stream: Warm velvety aeration + rich espresso extraction
      const osc = this.ctx.createOscillator()
      const oscGain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(145, now)
      osc.frequency.linearRampToValueAtTime(120, now + duration)

      oscGain.gain.setValueAtTime(0.01, now)
      oscGain.gain.linearRampToValueAtTime(0.18, now + 0.2)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
      osc.connect(oscGain)
      oscGain.connect(master)
      osc.start(now)
      osc.stop(now + duration)

      // Steam whisper
      const sr = this.ctx.sampleRate
      const len = Math.floor(sr * duration)
      const buf = this.ctx.createBuffer(1, len, sr)
      const data = buf.getChannelData(0)
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.2
      }
      const steamSrc = this.ctx.createBufferSource()
      steamSrc.buffer = buf
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(2800, now)
      filter.Q.setValueAtTime(1.8, now)
      const steamGain = this.ctx.createGain()
      steamGain.gain.setValueAtTime(0.01, now)
      steamGain.gain.linearRampToValueAtTime(0.14, now + 0.3)
      steamGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
      steamSrc.connect(filter)
      filter.connect(steamGain)
      steamGain.connect(master)
      steamSrc.start(now)
    } else {
      // 8D Specialty / Mocha / Caramel: Rich roasted extraction + golden drizzle
      const osc = this.ctx.createOscillator()
      const oscGain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(180, now)
      osc.frequency.exponentialRampToValueAtTime(95, now + duration)
      oscGain.gain.setValueAtTime(0.01, now)
      oscGain.gain.linearRampToValueAtTime(0.2, now + 0.15)
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration)
      osc.connect(oscGain)
      oscGain.connect(master)
      osc.start(now)
      osc.stop(now + duration)
    }

    setTimeout(() => {
      if (activePreviewProductId.value === productId) {
        activePreviewProductId.value = null
        is8DActive.value = false
      }
    }, duration * 1000)
  }

  // 4. Tactile "Add to Cart" Acoustic Chime with Spatial Flight Panning
  // Synchronized with the visual parabolic flight arc from the cup to the header cart button
  public playAddToCart(screenXRatio = 0.5) {
    if (is8DAudioMuted.value) return
    this.init()
    if (!this.ctx || !this.compressor) return

    is8DActive.value = true
    setTimeout(() => { is8DActive.value = false }, 450)

    const now = this.ctx.currentTime
    const duration = 0.55

    // Spatial flight path: from product location to top-right cart badge (+0.75)
    const startPan = Math.max(-0.85, Math.min(0.85, (screenXRatio - 0.5) * 1.6))
    const panner = this.ctx.createStereoPanner()
    panner.pan.setValueAtTime(startPan, now)
    panner.pan.exponentialRampToValueAtTime ? panner.pan.linearRampToValueAtTime(0.72, now + 0.45) : panner.pan.setValueAtTime(0.72, now + 0.45)
    panner.connect(this.compressor)

    const master = this.ctx.createGain()
    master.gain.setValueAtTime(0.85, now)
    master.connect(panner)

    // Component A: Liquid Droplet Pop (rising pitch bubble)
    const popOsc = this.ctx.createOscillator()
    const popGain = this.ctx.createGain()
    popOsc.type = 'sine'
    popOsc.frequency.setValueAtTime(360, now)
    popOsc.frequency.exponentialRampToValueAtTime(820, now + 0.05)
    popOsc.frequency.exponentialRampToValueAtTime(480, now + 0.12)

    popGain.gain.setValueAtTime(0.01, now)
    popGain.gain.linearRampToValueAtTime(0.24, now + 0.02)
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14)

    popOsc.connect(popGain)
    popGain.connect(master)
    popOsc.start(now)
    popOsc.stop(now + 0.15)

    // Component B: Shimmering Crystal Cart Chime (E6 + B6 + E7 chord with golden decay)
    const chordFrequencies = [1318.5, 1975.5, 2637.0]
    chordFrequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const oscGain = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.025)

      const startT = now + idx * 0.025
      oscGain.gain.setValueAtTime(0.01, startT)
      oscGain.gain.linearRampToValueAtTime(0.18 - idx * 0.03, startT + 0.01)
      oscGain.gain.exponentialRampToValueAtTime(0.001, startT + 0.42)

      osc.connect(oscGain)
      oscGain.connect(master)
      osc.start(startT)
      osc.stop(startT + 0.45)
    })

    // Component C: Crisp Glass Rim Clink (high harmonic tick)
    const tickOsc = this.ctx.createOscillator()
    const tickGain = this.ctx.createGain()
    tickOsc.type = 'sine'
    tickOsc.frequency.setValueAtTime(3520, now)

    tickGain.gain.setValueAtTime(0.01, now)
    tickGain.gain.linearRampToValueAtTime(0.12, now + 0.005)
    tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    tickOsc.connect(tickGain)
    tickGain.connect(master)
    tickOsc.start(now)
    tickOsc.stop(now + 0.2)
  }

  // 5. Triumphant Barista Order Success Celebration
  // Celebratory ascending warm cafe arpeggio + brass bell + delicate steam hiss
  public playOrderSuccess() {
    if (is8DAudioMuted.value) return
    this.init()
    if (!this.ctx || !this.compressor) return

    is8DActive.value = true
    setTimeout(() => { is8DActive.value = false }, 1500)

    const now = this.ctx.currentTime
    const duration = 1.4

    // Center-to-wide binaural stereo expansion
    const panner = this.ctx.createStereoPanner()
    panner.pan.setValueAtTime(0, now)
    panner.connect(this.compressor)

    const master = this.ctx.createGain()
    master.gain.setValueAtTime(0.9, now)
    master.connect(panner)

    // Celebratory Ascending Arpeggio: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
    const arpeggioNotes = [
      { f: 523.25, time: 0.00, dur: 0.5 },
      { f: 659.25, time: 0.11, dur: 0.5 },
      { f: 783.99, time: 0.22, dur: 0.6 },
      { f: 1046.50, time: 0.35, dur: 1.1 },
    ]

    arpeggioNotes.forEach((note) => {
      const startT = now + note.time
      const osc = this.ctx!.createOscillator()
      const oscGain = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(note.f, startT)

      oscGain.gain.setValueAtTime(0.01, startT)
      oscGain.gain.linearRampToValueAtTime(0.22, startT + 0.015)
      oscGain.gain.exponentialRampToValueAtTime(0.001, startT + note.dur)

      osc.connect(oscGain)
      oscGain.connect(master)
      osc.start(startT)
      osc.stop(startT + note.dur)

      // Add octave harmonic for warmth and brilliance
      const harm = this.ctx!.createOscillator()
      const harmGain = this.ctx!.createGain()
      harm.type = 'sine'
      harm.frequency.setValueAtTime(note.f * 2, startT)

      harmGain.gain.setValueAtTime(0.005, startT)
      harmGain.gain.linearRampToValueAtTime(0.08, startT + 0.01)
      harmGain.gain.exponentialRampToValueAtTime(0.001, startT + note.dur * 0.7)

      harm.connect(harmGain)
      harmGain.connect(master)
      harm.start(startT)
      harm.stop(startT + note.dur)
    })

    // Delicate warm cafe steam hiss in the background
    const sr = this.ctx.sampleRate
    const len = Math.floor(sr * 0.6)
    const buf = this.ctx.createBuffer(1, len, sr)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) {
      const env = Math.sin((i / len) * Math.PI)
      data[i] = (Math.random() * 2 - 1) * env * 0.15
    }

    const steamSrc = this.ctx.createBufferSource()
    steamSrc.buffer = buf
    const steamFilter = this.ctx.createBiquadFilter()
    steamFilter.type = 'bandpass'
    steamFilter.frequency.setValueAtTime(3200, now + 0.3)
    steamFilter.Q.setValueAtTime(1.5, now + 0.3)

    const steamGain = this.ctx.createGain()
    steamGain.gain.setValueAtTime(0.01, now + 0.3)
    steamGain.gain.linearRampToValueAtTime(0.12, now + 0.45)
    steamGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9)

    steamSrc.connect(steamFilter)
    steamFilter.connect(steamGain)
    steamGain.connect(master)
    steamSrc.start(now + 0.3)
  }

  // 6. Tactile Quantity / Option Adjustment Micro-pop
  public playQuantityClick(direction: 'up' | 'down' = 'up') {
    if (is8DAudioMuted.value) return
    this.init()
    if (!this.ctx || !this.compressor) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    const freq = direction === 'up' ? 880 : 580
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(direction === 'up' ? 1200 : 420, now + 0.04)

    gain.gain.setValueAtTime(0.01, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

    osc.connect(gain)
    gain.connect(this.compressor)
    osc.start(now)
    osc.stop(now + 0.07)
  }
}

// Global Singleton Instance
let audioEngineInstance: Global8DSpatialAudioEngine | null = null

function getEngine(): Global8DSpatialAudioEngine {
  if (!audioEngineInstance) {
    audioEngineInstance = new Global8DSpatialAudioEngine()
  }
  return audioEngineInstance
}

export const use8DAudio = () => {
  const toggleMute = () => {
    is8DAudioMuted.value = !is8DAudioMuted.value
    if (!is8DAudioMuted.value) {
      getEngine().resume()
      getEngine().playCardCue(0.5)
    }
  }

  const triggerScroll8D = (velocity: number, direction: 'down' | 'up') => {
    if (is8DAudioMuted.value) return
    const now = performance.now()
    // Smooth throttling: at most once every 130ms during scrolling
    if (now - lastScrollSoundTime.value > 130 && velocity > 18) {
      lastScrollSoundTime.value = now
      getEngine().playScrollAcoustic(velocity, direction)
    }
  }

  const playCardCue = (screenXRatio: number) => {
    getEngine().playCardCue(screenXRatio)
  }

  const playProduct8DExperience = (productId: string, screenXRatio?: number) => {
    getEngine().playProduct8DExperience(productId, screenXRatio)
  }

  const playAddToCart = (screenXRatio?: number) => {
    getEngine().playAddToCart(screenXRatio)
  }

  const playOrderSuccess = () => {
    getEngine().playOrderSuccess()
  }

  const playQuantityClick = (direction: 'up' | 'down' = 'up') => {
    getEngine().playQuantityClick(direction)
  }

  const resumeAudio = () => {
    getEngine().resume()
  }

  return {
    is8DAudioMuted,
    is8DActive,
    current8DPan,
    activePreviewProductId,
    toggleMute,
    triggerScroll8D,
    playCardCue,
    playProduct8DExperience,
    playAddToCart,
    playOrderSuccess,
    playQuantityClick,
    resumeAudio,
  }
}


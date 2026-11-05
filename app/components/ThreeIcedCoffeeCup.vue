<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import gsap from 'gsap'
import { use8DAudio } from '~/composables/use8DAudio'

const props = withDefaults(
  defineProps<{
    productId?: string
    productName?: string
    size?: 'S' | 'M' | 'L'
    temperature?: 'hot' | 'iced'
    iceLevel?: 'none' | 'less' | 'regular' | 'extra'
    milk?: 'whole' | 'oat' | 'almond'
    withCream?: boolean
    withExtraShot?: boolean
    withCocoa?: boolean
    withCaramel?: boolean
    sweetness?: string
    flavor?: string
    isEmpty?: boolean
  }>(),
  {
    productId: 'cold-brew',
    productName: 'Iced Coffee',
    size: 'M',
    temperature: 'iced',
    iceLevel: 'regular',
    milk: 'whole',
    withCream: false,
    withExtraShot: false,
    withCocoa: false,
    withCaramel: false,
    sweetness: '50%',
    flavor: 'classic',
    isEmpty: false,
  }
)

const containerRef = ref<HTMLDivElement | null>(null)
const { is8DAudioMuted, toggleMute } = use8DAudio()
const isInteracting = ref(false)

// =========================================================================
// 1. PROCEDURAL 8D SPATIAL AUDIO ENGINE (Physical Acoustic Synthesizer)
// =========================================================================
class Spatial8DAudioEngine {
  private ctx: AudioContext | null = null
  public muted: boolean = false
  private getAzimuth: () => number
  private activePanners: StereoPannerNode[] = []
  private activeHeadShadowFilters: BiquadFilterNode[] = []
  private masterCompressor: DynamicsCompressorNode | null = null
  private cafeConvolver: ConvolverNode | null = null
  private convolverGain: GainNode | null = null

  // Pre-computed physical acoustic impulse buffers for zero-latency, realistic playback
  private iceClinkBuffers: AudioBuffer[] = []
  private splashBuffers: AudioBuffer[] = []

  constructor(getAzimuth: () => number) {
    this.getAzimuth = getAzimuth
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()

        // Master Studio Dynamics Limiter / Compressor for warm, punchy clarity without digital distortion
        this.masterCompressor = this.ctx.createDynamicsCompressor()
        this.masterCompressor.threshold.setValueAtTime(-14, this.ctx.currentTime)
        this.masterCompressor.knee.setValueAtTime(6, this.ctx.currentTime)
        this.masterCompressor.ratio.setValueAtTime(3.5, this.ctx.currentTime)
        this.masterCompressor.attack.setValueAtTime(0.002, this.ctx.currentTime)
        this.masterCompressor.release.setValueAtTime(0.10, this.ctx.currentTime)
        this.masterCompressor.connect(this.ctx.destination)

        // Synthetic Acoustic Cafe Room Convolver (Gives real acoustic physical presence)
        try {
          const sampleRate = this.ctx.sampleRate
          const irLen = Math.floor(sampleRate * 0.28)
          const irBuf = this.ctx.createBuffer(2, irLen, sampleRate)
          const left = irBuf.getChannelData(0)
          const right = irBuf.getChannelData(1)
          const decay = 8.5

          for (let i = 0; i < irLen; i++) {
            const t = i / sampleRate
            const env = Math.exp(-t * decay)
            left[i] = (Math.random() * 2 - 1) * env * 0.35
            right[i] = (Math.random() * 2 - 1) * env * 0.35
          }

          // Early acoustic reflections from table and cafe glass walls
          const r1 = Math.floor(0.012 * sampleRate)
          const r2 = Math.floor(0.024 * sampleRate)
          const r3 = Math.floor(0.044 * sampleRate)
          if (r1 < irLen) { left[r1] += 0.32; right[r1] += 0.24 }
          if (r2 < irLen) { left[r2] += 0.18; right[r2] += 0.26 }
          if (r3 < irLen) { left[r3] += 0.12; right[r3] += 0.15 }

          this.cafeConvolver = this.ctx.createConvolver()
          this.cafeConvolver.buffer = irBuf

          this.convolverGain = this.ctx.createGain()
          this.convolverGain.gain.setValueAtTime(0.14, this.ctx.currentTime)

          this.cafeConvolver.connect(this.convolverGain)
          this.convolverGain.connect(this.masterCompressor)
        } catch (e) {
          // Fallback if convolver fails
        }

        // Pre-build 3 distinct physical ice clink variations
        this.buildIceClinkVariations()
        this.buildSplashVariations()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public resumeContext() {
    this.initCtx()
  }

  // Pre-computes 3 organic, non-repeating Physical Ice Clink AudioBuffers
  // Models inharmonic glass tumbler circumferential modes + fluid damping + ice mass thump + double rebound
  private buildIceClinkVariations() {
    if (!this.ctx) return
    const sr = this.ctx.sampleRate
    const dur = 0.16
    const len = Math.floor(sr * dur)

    const baseFrequencies = [2150, 2280, 2090]

    this.iceClinkBuffers = baseFrequencies.map((f0) => {
      const buf = this.ctx!.createBuffer(1, len, sr)
      const data = buf.getChannelData(0)

      // Frequency split for glass acoustic beating
      const f0_split = f0 + (16 + Math.random() * 8)
      const f1 = f0 * 1.62
      const f2 = f0 * 2.38

      for (let i = 0; i < len; i++) {
        const t = i / sr

        // 1. Initial 2ms acoustic shock impact (Hertzian contact click)
        let shock = 0
        if (t < 0.003) {
          shock = (Math.random() * 2 - 1) * Math.exp(-t * 1200) * 0.45
        }

        // 2. Liquid-damped glass shell resonant modes with acoustic beating
        // A glass full of iced coffee decays in ~55ms due to viscous liquid boundary damping
        const glassDamp = Math.exp(-t * 52)
        const mode0 = Math.sin(2 * Math.PI * f0 * t) * 0.28 * glassDamp
        const mode0_beat = Math.sin(2 * Math.PI * f0_split * t) * 0.24 * glassDamp
        const mode1 = Math.sin(2 * Math.PI * f1 * t) * 0.14 * Math.exp(-t * 75)
        const mode2 = Math.sin(2 * Math.PI * f2 * t) * 0.08 * Math.exp(-t * 110)

        // 3. Submerged fluid mass impact thump (dull 360Hz body)
        const thump = Math.sin(2 * Math.PI * 360 * t) * 0.20 * Math.exp(-t * 85)

        // 4. Physical micro-rebound strike at +32ms (cube bouncing off glass wall)
        let rebound = 0
        if (t >= 0.032) {
          const rt = t - 0.032
          const rDamp = Math.exp(-rt * 65)
          rebound = (
            Math.sin(2 * Math.PI * (f0 * 1.05) * rt) * 0.16 +
            Math.sin(2 * Math.PI * (f1 * 1.05) * rt) * 0.08
          ) * rDamp
        }

        // 5. Thermal fracture micro-snap at +52ms (ice thermal stress tick)
        let thermalTick = 0
        if (t >= 0.052 && t < 0.054) {
          thermalTick = (Math.random() * 2 - 1) * Math.exp(-(t - 0.052) * 2000) * 0.18
        }

        data[i] = (shock + mode0 + mode0_beat + mode1 + mode2 + thump + rebound + thermalTick) * 0.85
      }
      return buf
    })
  }

  // Pre-computes 2 physical hydrodynamic splash AudioBuffers
  private buildSplashVariations() {
    if (!this.ctx) return
    const sr = this.ctx.sampleRate
    const dur = 0.22
    const len = Math.floor(sr * dur)

    this.splashBuffers = [0, 1].map((varIdx) => {
      const buf = this.ctx!.createBuffer(1, len, sr)
      const data = buf.getChannelData(0)

      for (let i = 0; i < len; i++) {
        const t = i / sr

        // A. 14ms Meniscus entry slap (fluid displacement impulse)
        let slap = 0
        if (t < 0.016) {
          const slapEnv = Math.exp(-t * 220)
          slap = (Math.random() * 2 - 1) * Math.sin(2 * Math.PI * 280 * t) * slapEnv * 0.38
        }

        // B. Damped fluid cavitation wavelets (natural decaying resonant wavelets, NOT synth pitch sweeps!)
        const b1 = Math.sin(2 * Math.PI * 440 * t) * Math.exp(-t * 55) * 0.22
        const b2 = t > 0.018 ? Math.sin(2 * Math.PI * 620 * (t - 0.018)) * Math.exp(-(t - 0.018) * 65) * 0.16 : 0
        const b3 = t > 0.038 ? Math.sin(2 * Math.PI * 780 * (t - 0.038)) * Math.exp(-(t - 0.038) * 80) * 0.12 : 0

        // C. Liquid wave slosh against glass interior
        const sloshEnv = t < 0.04 ? t / 0.04 : Math.exp(-(t - 0.04) * 18)
        const slosh = (Math.random() * 2 - 1) * 0.14 * sloshEnv

        data[i] = (slap + b1 + b2 + b3 + slosh) * 0.82
      }
      return buf
    })
  }

  // Generates silky Paul Kellet 7-pole 1/f Pink Noise for natural fluid turbulence
  private createPinkNoiseBuffer(duration: number): AudioBuffer | null {
    if (!this.ctx) return null
    const bufferSize = Math.floor(this.ctx.sampleRate * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12
      b6 = white * 0.115926
    }
    return buffer
  }

  // Creates an 8D spatial binaural routing node with HRTF head-shadowing
  private createSpatialNode(durationSeconds = 0.5): { input: GainNode; panner: StereoPannerNode; filter: BiquadFilterNode } {
    if (!this.ctx || !this.masterCompressor) return {} as any

    const input = this.ctx.createGain()
    const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : (this.ctx.createGain() as any)

    // HRTF Cranial Acoustic Occlusion Filter (Simulates ear-shadow damping on far side)
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(18000, this.ctx.currentTime)
    filter.Q.setValueAtTime(0.7, this.ctx.currentTime)

    const azimuth = this.getAzimuth()
    const panVal = Math.max(-0.95, Math.min(0.95, Math.sin(azimuth)))
    if (panner.pan) {
      panner.pan.setValueAtTime(panVal, this.ctx.currentTime)
      this.activePanners.push(panner)
      this.activeHeadShadowFilters.push(filter)

      setTimeout(() => {
        const pIdx = this.activePanners.indexOf(panner)
        if (pIdx !== -1) this.activePanners.splice(pIdx, 1)
        const fIdx = this.activeHeadShadowFilters.indexOf(filter)
        if (fIdx !== -1) this.activeHeadShadowFilters.splice(fIdx, 1)
      }, durationSeconds * 1000 + 150)
    }

    input.connect(filter)
    filter.connect(panner)

    // Route direct sound to master dynamics limiter
    panner.connect(this.masterCompressor)

    // Route subtle wet reflection to cafe room acoustic space
    if (this.cafeConvolver) {
      panner.connect(this.cafeConvolver)
    }

    return { input, panner, filter }
  }

  // Continuously track OrbitControls camera rotation for 8D binaural positioning
  public updateSpatialPanning() {
    if (!this.ctx || this.activePanners.length === 0) return
    const azimuth = this.getAzimuth()
    const panVal = Math.max(-0.95, Math.min(0.95, Math.sin(azimuth)))
    // Head-shadow cutoff: when sound is panned hard, shadow upper frequencies
    const shadowFreq = 18000 - Math.abs(panVal) * 4500

    for (let i = this.activePanners.length - 1; i >= 0; i--) {
      try {
        this.activePanners[i].pan.setValueAtTime(panVal, this.ctx.currentTime)
        if (this.activeHeadShadowFilters[i]) {
          this.activeHeadShadowFilters[i].frequency.setValueAtTime(shadowFreq, this.ctx.currentTime)
        }
      } catch (e) {
        this.activePanners.splice(i, 1)
        this.activeHeadShadowFilters.splice(i, 1)
      }
    }
  }

  // 1. Authentic Physical Crystal Ice Clink on Glass
  public playIceClink() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx || this.iceClinkBuffers.length === 0) return

    const now = this.ctx.currentTime
    const { input } = this.createSpatialNode(0.25)

    const randomBuf = this.iceClinkBuffers[Math.floor(Math.random() * this.iceClinkBuffers.length)]
    const src = this.ctx.createBufferSource()
    src.buffer = randomBuf
    // Micro-pitch randomization for organic non-repeating acoustic variation
    src.playbackRate.setValueAtTime(0.96 + Math.random() * 0.08, now)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.38, now)

    src.connect(gain)
    gain.connect(input)
    src.start(now)
  }

  // 2. Realistic Hydrodynamic Splash (Ice Plunging into Iced Coffee)
  public playSplash() {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx || this.splashBuffers.length === 0) return

    const now = this.ctx.currentTime
    const { input } = this.createSpatialNode(0.3)

    const randomBuf = this.splashBuffers[Math.floor(Math.random() * this.splashBuffers.length)]
    const src = this.ctx.createBufferSource()
    src.buffer = randomBuf
    src.playbackRate.setValueAtTime(0.95 + Math.random() * 0.1, now)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.42, now)

    src.connect(gain)
    gain.connect(input)
    src.start(now)
  }

  // 3. Authentic Velvety Barista Pour Stream (Chaotic Rayleigh Droplet Breakup + Cavity Formant Shift)
  public playPourStream(duration = 1.6) {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const { input } = this.createSpatialNode(duration)

    // Synthesize physical chaotic droplet stream buffer (thousands of micro-droplet impacts)
    const sr = this.ctx.sampleRate
    const bufLen = Math.floor(sr * duration)
    const streamBuf = this.ctx.createBuffer(1, bufLen, sr)
    const streamData = streamBuf.getChannelData(0)

    for (let i = 0; i < bufLen; i++) {
      const progress = i / bufLen
      const envelope = progress < 0.15 ? progress / 0.15 : progress > 0.8 ? (1 - progress) / 0.2 : 1.0
      // Stochastic droplet impacts (Poisson distributed fluid wavelets)
      if (Math.random() < 0.08) {
        streamData[i] = (Math.random() * 2 - 1) * envelope * 0.45
      } else {
        streamData[i] = 0
      }
    }

    const streamSrc = this.ctx.createBufferSource()
    streamSrc.buffer = streamBuf

    // Dynamic cup air-column cavity resonance (rising from 420Hz to 680Hz as liquid fills cup)
    const cavityFilter = this.ctx.createBiquadFilter()
    cavityFilter.type = 'bandpass'
    cavityFilter.frequency.setValueAtTime(420, now)
    cavityFilter.frequency.linearRampToValueAtTime(680, now + duration)
    cavityFilter.Q.setValueAtTime(3.2, now)

    // Velvety fluid surface sheen formant
    const sheenFilter = this.ctx.createBiquadFilter()
    sheenFilter.type = 'bandpass'
    sheenFilter.frequency.setValueAtTime(1450, now)
    sheenFilter.Q.setValueAtTime(2.0, now)

    const streamGain = this.ctx.createGain()
    streamGain.gain.setValueAtTime(0.01, now)
    streamGain.gain.linearRampToValueAtTime(0.32, now + 0.18)
    streamGain.gain.setValueAtTime(0.30, now + duration - 0.22)
    streamGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    streamSrc.connect(cavityFilter)
    cavityFilter.connect(streamGain)
    streamSrc.connect(sheenFilter)
    sheenFilter.connect(streamGain)

    streamGain.connect(input)
    streamSrc.start(now)
  }

  // 4. Granular Crystalline Sugar Cascade (Thousands of microscopic sucrose grain impacts)
  public playSugarStream(duration = 1.2) {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const { input } = this.createSpatialNode(duration)

    const sr = this.ctx.sampleRate
    const bufferSize = Math.floor(sr * duration)
    const buffer = this.ctx.createBuffer(1, bufferSize, sr)
    const data = buffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize
      // Realistic Gaussian cascade density
      const density = progress < 0.25 ? progress * 0.2 : progress > 0.75 ? (1 - progress) * 0.2 : 0.05
      if (Math.random() < density) {
        data[i] = (Math.random() * 2 - 1) * (0.3 + Math.random() * 0.7)
      } else {
        data[i] = 0
      }
    }

    const grainSrc = this.ctx.createBufferSource()
    grainSrc.buffer = buffer

    // Sharp crystalline sugar glass resonance
    const crystalFilter = this.ctx.createBiquadFilter()
    crystalFilter.type = 'bandpass'
    crystalFilter.frequency.setValueAtTime(5600, now)
    crystalFilter.Q.setValueAtTime(5.8, now)

    const sugarGain = this.ctx.createGain()
    sugarGain.gain.setValueAtTime(0.01, now)
    sugarGain.gain.linearRampToValueAtTime(0.35, now + 0.14)
    sugarGain.gain.setValueAtTime(0.32, now + duration - 0.18)
    sugarGain.gain.exponentialRampToValueAtTime(0.002, now + duration)

    grainSrc.connect(crystalFilter)
    crystalFilter.connect(sugarGain)
    sugarGain.connect(input)
    grainSrc.start(now)
  }

  // 5. Authentic Barista Espresso Machine Extraction Stream (9-bar hydraulic stream + crema sizzle)
  public playEspressoStream(duration = 1.4) {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const { input } = this.createSpatialNode(duration)

    const pinkBuf = this.createPinkNoiseBuffer(duration)
    if (pinkBuf) {
      const streamSrc = this.ctx.createBufferSource()
      streamSrc.buffer = pinkBuf

      const bodyFilter = this.ctx.createBiquadFilter()
      bodyFilter.type = 'lowpass'
      bodyFilter.frequency.setValueAtTime(920, now)
      bodyFilter.Q.setValueAtTime(2.2, now)

      // Crema emulsion sizzle
      const cremaFilter = this.ctx.createBiquadFilter()
      cremaFilter.type = 'bandpass'
      cremaFilter.frequency.setValueAtTime(2600, now)
      cremaFilter.Q.setValueAtTime(1.8, now)

      const streamGain = this.ctx.createGain()
      streamGain.gain.setValueAtTime(0.01, now)
      streamGain.gain.linearRampToValueAtTime(0.28, now + 0.12)
      streamGain.gain.setValueAtTime(0.25, now + duration - 0.2)
      streamGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      streamSrc.connect(bodyFilter)
      bodyFilter.connect(streamGain)
      streamSrc.connect(cremaFilter)
      cremaFilter.connect(streamGain)

      streamGain.connect(input)
      streamSrc.start(now)
    }

    // Warm bubbling espresso low-end hydraulic rumble
    const gurgleOsc = this.ctx.createOscillator()
    const gurgleGain = this.ctx.createGain()
    gurgleOsc.type = 'sine'
    gurgleOsc.frequency.setValueAtTime(135, now)
    gurgleOsc.frequency.linearRampToValueAtTime(115, now + duration)

    gurgleGain.gain.setValueAtTime(0.01, now)
    gurgleGain.gain.linearRampToValueAtTime(0.14, now + 0.1)
    gurgleGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

    gurgleOsc.connect(gurgleGain)
    gurgleGain.connect(input)
    gurgleOsc.start(now)
    gurgleOsc.stop(now + duration)
  }

  // 6. Delicate Warm Steam Whisper (Steamed Hot Servings)
  public playSteamHiss(duration = 0.9) {
    if (this.muted) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const { input } = this.createSpatialNode(duration)

    const pinkBuf = this.createPinkNoiseBuffer(duration)
    if (pinkBuf) {
      const steamSrc = this.ctx.createBufferSource()
      steamSrc.buffer = pinkBuf

      const steamFilter = this.ctx.createBiquadFilter()
      steamFilter.type = 'bandpass'
      steamFilter.frequency.setValueAtTime(2200, now)
      steamFilter.Q.setValueAtTime(1.2, now)

      const steamGain = this.ctx.createGain()
      steamGain.gain.setValueAtTime(0.01, now)
      steamGain.gain.linearRampToValueAtTime(0.18, now + 0.18)
      steamGain.gain.exponentialRampToValueAtTime(0.001, now + duration)

      steamSrc.connect(steamFilter)
      steamFilter.connect(steamGain)
      steamGain.connect(input)
      steamSrc.start(now)
    }
  }

  public destroy() {
    if (this.ctx) {
      try { this.ctx.close() } catch (e) {}
      this.ctx = null
    }
  }
}

// =========================================================================
// 2. THREE.JS 3D SCENE & ENGINE REFS
// =========================================================================
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationFrameId: number | null = null
let audioEngine: Spatial8DAudioEngine | null = null

// Meshes & Groups
let cupGroup: THREE.Group
let liquidGroup: THREE.Group
let iceGroup: THREE.Group | null = null
let lidGroup: THREE.Group | null = null
let strawMesh: THREE.Mesh | null = null
let foamGroup: THREE.Group | null = null
let cocoaGroup: THREE.Group | null = null
let caramelGroup: THREE.Group | null = null
let steamGroup: THREE.Group | null = null
let condensationGroup: THREE.Group | null = null
let liquidMesh: THREE.Mesh | null = null
let surfaceMesh: THREE.Mesh | null = null
let creamStreamMesh: THREE.Mesh | null = null
let espressoStreamMesh: THREE.Mesh | null = null
let sugarPoints: THREE.Points | null = null

let iceGeo: RoundedBoxGeometry | null = null
let iceMat: THREE.MeshPhysicalMaterial | null = null

const iceCubes: THREE.Mesh[] = []
const creamBlobs: THREE.Mesh[] = []
const bubbles: THREE.Mesh[] = []

let rippleStrength = 0
let clock: THREE.Clock

// Geometry Constants
const cupHeight = 3.3
const cupTopRadius = 1.35
const cupBottomRadius = 0.98
const baseLiquidTopRadius = 1.31
const baseLiquidBottomRadius = 0.94
let currentLiquidHeight = 3.12 // Generous, barista-crafted full fill level (95% full to the rim)

// Recipe Color Mapping with rich, authentic coffee & milk tones
function getDrinkColor(
  productId: string,
  flavor = 'classic',
  milk = 'whole',
  withCream = false,
  withExtraShot = false
): THREE.Color {
  const id = (productId || '').toLowerCase()

  let col: THREE.Color

  if (id.includes('matcha')) {
    col = withCream ? new THREE.Color(0x7fae71) : new THREE.Color(0x2d6325)
  } else if (id.includes('mocha')) {
    col = withCream ? new THREE.Color(0x5a3118) : new THREE.Color(0x281208)
  } else if (id.includes('latte')) {
    if (milk === 'oat') col = new THREE.Color(0xb58055)
    else if (milk === 'almond') col = new THREE.Color(0xd4a77e)
    else col = new THREE.Color(0xcfa682)
  } else if (id.includes('cappuccino')) {
    if (milk === 'oat') col = new THREE.Color(0xbe8b60)
    else if (milk === 'almond') col = new THREE.Color(0xdbb28c)
    else col = new THREE.Color(0xd4ad87)
  } else if (id.includes('macchiato')) {
    col = new THREE.Color(0xcc9360)
  } else {
    // Default Cold Brew / Americano / Espresso
    let hex = 0x2a1408
    if (flavor === 'caramel') hex = 0x3d1c08
    else if (flavor === 'vanilla') hex = 0x34180c
    else if (flavor === 'hazelnut') hex = 0x311608
    else if (flavor === 'coconut') hex = 0x381e10

    col = new THREE.Color(hex)

    // When cream or milk is added to cold brew
    if (withCream) {
      if (milk === 'oat') col = new THREE.Color(0xbe885d)
      else if (milk === 'almond') col = new THREE.Color(0xd0a57e)
      else col = new THREE.Color(0xc49774)
    }
  }

  // Extra espresso shot gives deeper roasted tone
  if (withExtraShot) {
    col.r *= 0.76
    col.g *= 0.74
    col.b *= 0.72
  }

  return col
}

// Rebuild Liquid Volume Cylinder (Rich, solid opaque PBR body rendered perfectly in transmissionRenderTarget)
function rebuildLiquid(height: number, color: THREE.Color) {
  if (!liquidGroup) return

  // Dispose & remove previous liquid and surface meshes (preserves micro bubbles & cream marbling)
  if (liquidMesh) {
    liquidGroup.remove(liquidMesh)
    liquidMesh.geometry.dispose()
    if (Array.isArray(liquidMesh.material)) liquidMesh.material.forEach((m) => m.dispose())
    else liquidMesh.material.dispose()
    liquidMesh = null
  }
  if (surfaceMesh) {
    liquidGroup.remove(surfaceMesh)
    surfaceMesh.geometry.dispose()
    if (Array.isArray(surfaceMesh.material)) surfaceMesh.material.forEach((m) => m.dispose())
    else surfaceMesh.material.dispose()
    surfaceMesh = null
  }

  const topR = baseLiquidBottomRadius + (baseLiquidTopRadius - baseLiquidBottomRadius) * (height / cupHeight)

  const geo = new THREE.CylinderGeometry(topR, baseLiquidBottomRadius, height, 96)
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.16,
    metalness: 0.03,
    transparent: false, // Must be opaque so Three.js includes it in the transmission pass for the glass cup!
  })

  liquidMesh = new THREE.Mesh(geo, mat)
  liquidMesh.position.y = -cupHeight / 2 + height / 2 + 0.04
  liquidMesh.castShadow = true
  liquidMesh.receiveShadow = true
  liquidGroup.add(liquidMesh)

  // Top Surface Wave Disc with subtle froth tone
  const surfGeo = new THREE.CircleGeometry(topR * 0.99, 96)
  const surfMat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.12,
    metalness: 0.04,
    side: THREE.DoubleSide,
    transparent: false,
  })

  surfaceMesh = new THREE.Mesh(surfGeo, surfMat)
  surfaceMesh.rotation.x = -Math.PI / 2
  surfaceMesh.position.y = -cupHeight / 2 + height + 0.04
  liquidGroup.add(surfaceMesh)
}

// 3D Artisanal Milk Foam / Whipped Cream Swirl (8K Velvety Physical Micro-sheen)
function buildFoamSwirl() {
  if (foamGroup && cupGroup) cupGroup.remove(foamGroup)
  foamGroup = new THREE.Group()

  const foamMat = new THREE.MeshPhysicalMaterial({
    color: 0xfffcf6,
    roughness: 0.62,
    metalness: 0.0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.35,
    sheen: 0.85,
    sheenRoughness: 0.45,
    sheenColor: new THREE.Color(0xffffff),
  })

  const surfaceY = -cupHeight / 2 + currentLiquidHeight + 0.04

  // Tier 1: Base ring of soft billowing clouds
  const t1Geo = new THREE.SphereGeometry(0.32, 16, 12)
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2
    const radius = 0.58
    const m = new THREE.Mesh(t1Geo, foamMat)
    m.position.set(Math.cos(angle) * radius, surfaceY + 0.12, Math.sin(angle) * radius)
    m.scale.set(1.1, 0.7, 1.1)
    foamGroup.add(m)
  }

  // Tier 2: Mid spiral ring
  const t2Geo = new THREE.SphereGeometry(0.26, 16, 12)
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 + 0.35
    const radius = 0.36
    const m = new THREE.Mesh(t2Geo, foamMat)
    m.position.set(Math.cos(angle) * radius, surfaceY + 0.32, Math.sin(angle) * radius)
    m.scale.set(1.0, 0.75, 1.0)
    foamGroup.add(m)
  }

  // Tier 3: Upper puff
  const t3Geo = new THREE.SphereGeometry(0.20, 16, 12)
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2 + 0.7
    const radius = 0.18
    const m = new THREE.Mesh(t3Geo, foamMat)
    m.position.set(Math.cos(angle) * radius, surfaceY + 0.50, Math.sin(angle) * radius)
    foamGroup.add(m)
  }

  // Tier 4: Swirl peak tip
  const tipGeo = new THREE.ConeGeometry(0.14, 0.30, 16)
  const tipMesh = new THREE.Mesh(tipGeo, foamMat)
  tipMesh.position.set(0.04, surfaceY + 0.68, 0.02)
  tipMesh.rotation.z = -0.15
  tipMesh.rotation.x = 0.1
  foamGroup.add(tipMesh)

  const shouldShowFoam = props.withCream || 
    (props.productId && (props.productId.includes('cappuccino') || props.productId.includes('mocha') || props.productId.includes('frappe')))
  
  foamGroup.visible = !props.isEmpty && Boolean(shouldShowFoam)
  cupGroup.add(foamGroup)
}

// Dedicated Real-time Cocoa Dusting (floats on foam OR liquid surface)
function buildCocoaDusting() {
  if (cocoaGroup && cupGroup) cupGroup.remove(cocoaGroup)
  cocoaGroup = new THREE.Group()

  const isCocoa = props.withCocoa || (props.productId && props.productId.includes('cappuccino'))
  if (!isCocoa) {
    cocoaGroup.visible = false
    cupGroup.add(cocoaGroup)
    return
  }

  const surfaceY = -cupHeight / 2 + currentLiquidHeight + 0.04
  const hasFoam = props.withCream || (props.productId && (props.productId.includes('cappuccino') || props.productId.includes('mocha')))
  const baseY = hasFoam ? surfaceY + 0.55 : surfaceY + 0.06

  const cocoaCount = 75
  const cocoaGeo = new THREE.BufferGeometry()
  const cocoaPositions = new Float32Array(cocoaCount * 3)
  for (let i = 0; i < cocoaCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * (hasFoam ? 0.6 : 0.85)
    cocoaPositions[i * 3 + 0] = Math.cos(angle) * r
    cocoaPositions[i * 3 + 1] = baseY + Math.random() * 0.12 - (r * 0.1)
    cocoaPositions[i * 3 + 2] = Math.sin(angle) * r
  }
  cocoaGeo.setAttribute('position', new THREE.BufferAttribute(cocoaPositions, 3))
  const cocoaMat = new THREE.PointsMaterial({
    color: 0x3d1a08,
    size: 0.042,
    transparent: false,
  })
  const points = new THREE.Points(cocoaGeo, cocoaMat)
  cocoaGroup.add(points)
  cocoaGroup.visible = !props.isEmpty
  cupGroup.add(cocoaGroup)
}

// Dedicated Real-time Golden Caramel Ribbon Drizzle
function buildCaramelDrizzle() {
  if (caramelGroup && cupGroup) cupGroup.remove(caramelGroup)
  caramelGroup = new THREE.Group()

  const isCaramel = props.withCaramel || props.flavor === 'caramel'
  if (!isCaramel) {
    caramelGroup.visible = false
    cupGroup.add(caramelGroup)
    return
  }

  const surfaceY = -cupHeight / 2 + currentLiquidHeight + 0.04
  const hasFoam = props.withCream || (props.productId && (props.productId.includes('cappuccino') || props.productId.includes('mocha')))

  const curve = hasFoam
    ? new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.45, surfaceY + 0.20, -0.35),
        new THREE.Vector3(-0.15, surfaceY + 0.38, 0.25),
        new THREE.Vector3(0.20, surfaceY + 0.48, 0.10),
        new THREE.Vector3(0.05, surfaceY + 0.62, -0.12),
        new THREE.Vector3(0.35, surfaceY + 0.25, 0.30),
      ])
    : new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.65, surfaceY + 0.06, -0.45),
        new THREE.Vector3(-0.25, surfaceY + 0.07, 0.40),
        new THREE.Vector3(0.15, surfaceY + 0.06, -0.35),
        new THREE.Vector3(0.55, surfaceY + 0.07, 0.25),
      ])

  const caramelGeo = new THREE.TubeGeometry(curve, 32, 0.026, 8, false)
  const caramelMat = new THREE.MeshStandardMaterial({
    color: 0xc97c26, // rich golden caramel
    roughness: 0.15,
    metalness: 0.1,
    transparent: false,
  })
  const mesh = new THREE.Mesh(caramelGeo, caramelMat)
  caramelGroup.add(mesh)
  caramelGroup.visible = !props.isEmpty
  cupGroup.add(caramelGroup)
}

// Delicate Rising Warm Steam Wisps for Steamed Hot Servings
function buildSteam() {
  if (steamGroup && cupGroup) cupGroup.remove(steamGroup)
  steamGroup = new THREE.Group()

  const count = 24
  const steamGeo = new THREE.SphereGeometry(0.12, 8, 8)
  const steamMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.18,
  })

  const surfaceY = -cupHeight / 2 + currentLiquidHeight + 0.04

  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(steamGeo, steamMat.clone())
    m.position.set(
      (Math.random() - 0.5) * 0.8,
      surfaceY + Math.random() * 0.9,
      (Math.random() - 0.5) * 0.8
    )
    m.scale.setScalar(0.6 + Math.random() * 0.8)
    m.userData = {
      speedY: 0.005 + Math.random() * 0.007,
      driftX: (Math.random() - 0.5) * 0.002,
      initialY: surfaceY,
      maxHeight: surfaceY + 1.5,
    }
    steamGroup.add(m)
  }

  steamGroup.visible = props.temperature === 'hot' && !props.isEmpty
  cupGroup.add(steamGroup)
}

function triggerRipple() {
  rippleStrength = 1.0
  gsap.to({ val: 1.0 }, {
    val: 0,
    duration: 1.2,
    ease: 'power2.out',
    onUpdate: function () {
      rippleStrength = (this.targets()[0] as any).val
    },
  })
}

// Smooth real-time color morphing without destroying liquid geometry
function updateDrinkAppearance(animateColor = true) {
  const targetColor = getDrinkColor(props.productId, props.flavor, props.milk, props.withCream, props.withExtraShot)

  if (liquidMesh) {
    const mat = liquidMesh.material as THREE.MeshStandardMaterial
    if (animateColor) {
      gsap.to(mat.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.6,
        ease: 'power2.out',
      })
    } else {
      mat.color.copy(targetColor)
    }
  }

  if (surfaceMesh) {
    const surfMat = surfaceMesh.material as THREE.MeshStandardMaterial
    if (animateColor) {
      gsap.to(surfMat.color, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.6,
        ease: 'power2.out',
      })
    } else {
      surfMat.color.copy(targetColor)
    }
  }

  buildFoamSwirl()
  buildCocoaDusting()
  buildCaramelDrizzle()
}

// Real-time Extra Espresso Shot Pour Animation
function triggerEspressoPour() {
  if (!espressoStreamMesh || !liquidMesh || !surfaceMesh) return
  audioEngine?.resumeContext()
  audioEngine?.playEspressoStream(1.4)

  espressoStreamMesh.visible = true
  espressoStreamMesh.scale.set(1, 0.01, 1)
  espressoStreamMesh.position.y = 3.6

  gsap.to(espressoStreamMesh.scale, {
    y: 1,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      triggerRipple()
      updateDrinkAppearance(true)
    },
  })

  gsap.to(espressoStreamMesh.position, {
    y: 4.8,
    duration: 0.5,
    delay: 1.1,
    ease: 'power2.in',
    onComplete: () => {
      if (espressoStreamMesh) espressoStreamMesh.visible = false
    },
  })
}

// Add Cream Pour & Marbling Stream
function triggerCreamPour() {
  if (!scene || !liquidMesh || !surfaceMesh) return
  audioEngine?.resumeContext()
  audioEngine?.playPourStream(1.8)

  if (creamStreamMesh) {
    creamStreamMesh.visible = true
    creamStreamMesh.scale.set(1, 0.01, 1)
    creamStreamMesh.position.y = 3.6

    gsap.to(creamStreamMesh.scale, {
      y: 1,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        triggerRipple()

        // Swirling Marbling Blobs
        creamBlobs.forEach((blob, idx) => {
          blob.visible = true
          blob.scale.set(0.1, 0.1, 0.1)
          ;(blob.material as THREE.MeshStandardMaterial).opacity = 0.95
          blob.position.set(
            (Math.random() - 0.5) * 0.4,
            surfaceMesh ? surfaceMesh.position.y - 0.1 : 0.8,
            (Math.random() - 0.5) * 0.4
          )

          const targetY = -0.5 + idx * 0.14
          const targetAngle = idx * 0.75
          const targetRadius = 0.32 + idx * 0.07

          gsap.to(blob.position, {
            x: Math.cos(targetAngle) * targetRadius,
            y: targetY,
            z: Math.sin(targetAngle) * targetRadius,
            duration: 2.2 + idx * 0.2,
            ease: 'power1.out',
          })

          gsap.to(blob.scale, {
            x: 1.2 + Math.random() * 0.5,
            y: 0.6 + Math.random() * 0.4,
            z: 1.2 + Math.random() * 0.5,
            duration: 2.4,
            ease: 'sine.out',
          })

          gsap.to(blob.material, {
            opacity: 0,
            duration: 1.8,
            delay: 1.4 + idx * 0.1,
            onComplete: () => { blob.visible = false },
          })
        })

        updateDrinkAppearance(true)
      },
    })

    gsap.to(creamStreamMesh.position, {
      y: 4.8,
      duration: 0.6,
      delay: 1.2,
      ease: 'power2.in',
      onComplete: () => {
        if (creamStreamMesh) creamStreamMesh.visible = false
      },
    })
  }
}

// 14 Natural 3D Multi-Tier Floating Cluster Coordinates for Ice Cubes (All Prominently Visible)
const ICE_CONFIGS = [
  // Tier 1: Surface Meniscus (buoyant, glistening crystal peaks)
  { x: -0.24, z: 0.16, yOffset: 0.15, rot: [0.25, 0.4, 0.15] },
  { x: 0.26, z: -0.14, yOffset: 0.14, rot: [-0.3, 0.8, 0.2] },
  { x: -0.06, z: 0.30, yOffset: 0.16, rot: [0.15, -0.6, 0.35] },
  { x: 0.14, z: -0.30, yOffset: 0.13, rot: [-0.2, 1.2, -0.1] },
  { x: 0.02, z: -0.02, yOffset: 0.18, rot: [0.35, -0.25, 0.2] },
  { x: -0.30, z: -0.14, yOffset: 0.14, rot: [0.1, 0.9, -0.3] },
  { x: 0.30, z: 0.20, yOffset: 0.13, rot: [-0.25, -0.4, 0.18] },

  // Tier 2: Mid Meniscus Layer (nestled along perimeter, glistening through surface)
  { x: -0.18, z: -0.26, yOffset: 0.08, rot: [0.4, 0.3, -0.2] },
  { x: 0.22, z: 0.28, yOffset: 0.07, rot: [-0.35, 0.5, 0.3] },
  { x: -0.32, z: 0.06, yOffset: 0.09, rot: [0.1, -0.7, 0.4] },
  { x: 0.28, z: -0.06, yOffset: 0.08, rot: [0.25, 0.6, -0.15] },
  { x: 0.02, z: 0.22, yOffset: 0.06, rot: [-0.15, 0.9, 0.25] },

  // Tier 3: Supporting Float Layer (submerged rim floaters bobbing at water line)
  { x: -0.12, z: 0.08, yOffset: 0.02, rot: [0.3, -0.4, 0.2] },
  { x: 0.14, z: -0.10, yOffset: 0.01, rot: [-0.2, 0.7, -0.3] },
]

// Add/Update Crystal Ice Cubes with Gravity Plunge & Bobbing Physics
function updateIceCubes(count: number, animate = true) {
  if (!iceGroup) return

  // Kill tweens on previous cubes
  iceCubes.forEach((cube) => {
    gsap.killTweensOf(cube.position)
    gsap.killTweensOf(cube.rotation)
    gsap.killTweensOf(cube.scale)
  })

  // Clean old cubes from group
  while (iceGroup.children.length > 0) {
    const child = iceGroup.children[0]
    iceGroup.remove(child)
  }
  iceCubes.length = 0

  if (count <= 0 || props.temperature === 'hot') return

  if (!iceGeo) {
    iceGeo = new RoundedBoxGeometry(0.44, 0.44, 0.44, 6, 0.08)
  }
  if (!iceMat) {
    iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xf0f7fc, // Frosted glacial crystal ice
      roughness: 0.035,
      metalness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.015,
      reflectivity: 0.99,
      transparent: false, // Ensures ice is rendered in transmissionRenderTarget
    })
  }

  const surfaceY = -cupHeight / 2 + currentLiquidHeight + 0.04

  for (let i = 0; i < count; i++) {
    const cfg = ICE_CONFIGS[i % ICE_CONFIGS.length]
    const cube = new THREE.Mesh(iceGeo, iceMat)
    cube.castShadow = true
    cube.receiveShadow = true

    const targetY = surfaceY + cfg.yOffset
    cube.userData = {
      baseY: targetY,
      phase: Math.random() * Math.PI * 2,
      rotSpeed: 0.002 + Math.random() * 0.003,
      isAnimating: animate,
    }

    if (animate) {
      cube.position.set(cfg.x, surfaceY + 0.85 + i * 0.08, cfg.z)
      cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      iceGroup.add(cube)
      iceCubes.push(cube)

      gsap.to(cube.position, {
        y: targetY - 0.16,
        duration: 0.36 + i * 0.03,
        delay: i * 0.04,
        ease: 'power2.in',
        onComplete: () => {
          if (i === 0 || i % 3 === 0) {
            audioEngine?.playSplash()
            audioEngine?.playIceClink()
            triggerRipple()
          } else {
            audioEngine?.playIceClink()
          }
        },
      })
      gsap.to(cube.position, {
        y: targetY,
        duration: 0.34,
        delay: (i * 0.04) + 0.36 + (i * 0.03),
        ease: 'bounce.out',
        onComplete: () => {
          cube.userData.isAnimating = false
        },
      })
      gsap.to(cube.rotation, {
        x: cfg.rot[0],
        y: cfg.rot[1],
        z: cfg.rot[2],
        duration: 0.65,
        delay: i * 0.04,
        ease: 'power1.out',
      })
    } else {
      cube.userData.isAnimating = false
      cube.position.set(cfg.x, targetY, cfg.z)
      cube.rotation.set(cfg.rot[0], cfg.rot[1], cfg.rot[2])
      iceGroup.add(cube)
      iceCubes.push(cube)
    }
  }
}

// Sugar Particles Stream
function triggerSugarStream() {
  if (!scene || !sugarPoints || !surfaceMesh) return
  audioEngine?.playSugarStream(1.2)
  sugarPoints.visible = true

  const pos = sugarPoints.geometry.attributes.position.array as Float32Array
  const count = pos.length / 3

  for (let i = 0; i < count; i++) {
    pos[i * 3 + 0] = (Math.random() - 0.5) * 0.3
    pos[i * 3 + 1] = 3.6 + Math.random() * 0.7
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3
  }
  sugarPoints.geometry.attributes.position.needsUpdate = true

  const sugarMat = sugarPoints.material as THREE.PointsMaterial
  sugarMat.opacity = 0.95

  const progress = { val: 0 }
  gsap.to(progress, {
    val: 1,
    duration: 1.6,
    ease: 'power1.inOut',
    onUpdate: () => {
      const targetY = surfaceMesh ? surfaceMesh.position.y : 0.8
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] -= 0.055
        if (pos[i * 3 + 1] < targetY) {
          pos[i * 3 + 0] += (Math.random() - 0.5) * 0.012
          pos[i * 3 + 2] += (Math.random() - 0.5) * 0.012
        }
      }
      if (sugarPoints) sugarPoints.geometry.attributes.position.needsUpdate = true
    },
    onComplete: () => {
      triggerRipple()
      gsap.to(sugarMat, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          if (sugarPoints) sugarPoints.visible = false
        },
      })
    },
  })
}

// Reset Camera View
const resetCamera = () => {
  if (!camera || !controls) return
  gsap.to(camera.position, {
    x: 0,
    y: 1.1,
    z: 7.2,
    duration: 0.8,
    ease: 'power2.inOut',
  })
  controls.target.set(0, 0.2, 0)
}

const toggleAudio = () => {
  toggleMute()
  if (audioEngine) {
    audioEngine.muted = is8DAudioMuted.value
  }
}

watch(is8DAudioMuted, (val) => {
  if (audioEngine) {
    audioEngine.muted = val
  }
})

// =========================================================================
// 3. MOUNT & BUILD 3D WEBGL SCENE
// =========================================================================
const initThreeScene = () => {
  if (!containerRef.value || typeof window === 'undefined') return

  const container = containerRef.value
  const width = container.clientWidth || 340
  const height = container.clientHeight || 380

  // Audio Engine linked to orbit camera azimuth
  audioEngine = new Spatial8DAudioEngine(() => {
    return controls ? controls.getAzimuthalAngle() : 0
  })
  audioEngine.muted = is8DAudioMuted.value

  scene = new THREE.Scene()
  clock = new THREE.Clock()

  // Camera
  camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
  camera.position.set(0, 1.1, 7.2)

  // WebGL Renderer (8K Ultra High Definition & Tone Mapping)
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  container.innerHTML = ''
  container.appendChild(renderer.domElement)

  // OrbitControls with Silky Inertial Damping
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.045
  controls.maxPolarAngle = Math.PI / 2 + 0.1
  controls.minDistance = 3.6
  controls.maxDistance = 9.5
  controls.target.set(0, 0.2, 0)
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.7

  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    controls.autoRotate = false
  }

  controls.addEventListener('start', () => {
    isInteracting.value = true
    controls.autoRotate = false
    audioEngine?.resumeContext()
  })

  // Pointer click vs drag detection for tactile cup tapping
  let pointerDownX = 0
  let pointerDownY = 0
  let pointerDownTime = 0

  container.addEventListener('pointerdown', (e: PointerEvent) => {
    pointerDownX = e.clientX
    pointerDownY = e.clientY
    pointerDownTime = performance.now()
    audioEngine?.resumeContext()
  })

  container.addEventListener('pointerup', (e: PointerEvent) => {
    const dist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY)
    const elapsed = performance.now() - pointerDownTime
    if (dist < 6 && elapsed < 350) {
      triggerCupTap()
    }
  })

  // Cinematic Studio Lighting
  const ambientLight = new THREE.AmbientLight(0xfff5eb, 0.8)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.5)
  keyLight.position.set(4, 7, 5)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.width = 2048
  keyLight.shadow.mapSize.height = 2048
  keyLight.shadow.bias = -0.0003
  keyLight.shadow.radius = 3.5
  scene.add(keyLight)

  const fillLight = new THREE.DirectionalLight(0xdef2f6, 0.6)
  fillLight.position.set(-5, 3, 2)
  scene.add(fillLight)

  const rimLight = new THREE.DirectionalLight(0xffeedd, 1.25)
  rimLight.position.set(0, 5, -6)
  scene.add(rimLight)

  // Contact Floor Shadow
  const floorGeo = new THREE.PlaneGeometry(20, 20)
  const floorMat = new THREE.ShadowMaterial({ opacity: 0.18 })
  const floor = new THREE.Mesh(floorGeo, floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.72
  floor.receiveShadow = true
  scene.add(floor)

  // 4. Cup Group
  cupGroup = new THREE.Group()
  scene.add(cupGroup)

  // Glass Material with real refractive transmission (8K Optical Clarity)
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.98,
    opacity: 1.0,
    transparent: true,
    roughness: 0.04,
    ior: 1.50,
    thickness: 0.35,
    reflectivity: 0.70,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    side: THREE.DoubleSide,
  })

  // Tapered Glass Body (128 Radial Tessellations for Silky 8K Geometries)
  const cupGeo = new THREE.CylinderGeometry(cupTopRadius, cupBottomRadius, cupHeight, 128, 1, true)
  const cupMesh = new THREE.Mesh(cupGeo, glassMaterial)
  cupMesh.castShadow = true
  cupGroup.add(cupMesh)

  // Solid Base Lens
  const baseGeo = new THREE.CylinderGeometry(cupBottomRadius, cupBottomRadius * 0.95, 0.08, 128)
  const baseMesh = new THREE.Mesh(baseGeo, glassMaterial)
  baseMesh.position.y = -cupHeight / 2 + 0.04
  cupGroup.add(baseMesh)

  // Top Glass Rim Ring
  const rimGeo = new THREE.TorusGeometry(cupTopRadius, 0.035, 24, 128)
  const rimMesh = new THREE.Mesh(rimGeo, glassMaterial)
  rimMesh.rotation.x = Math.PI / 2
  rimMesh.position.y = cupHeight / 2
  cupGroup.add(rimMesh)

  // Domed Lid Group
  lidGroup = new THREE.Group()
  cupGroup.add(lidGroup)

  const lidMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.95,
    transparent: true,
    roughness: 0.08,
    ior: 1.48,
    thickness: 0.22,
    clearcoat: 0.95,
    clearcoatRoughness: 0.03,
    side: THREE.DoubleSide,
  })

  // Exact Dome Geometry: snaps seamlessly directly on top of the cup rim
  const domeRadius = 1.385
  const domeCutAngle = Math.PI * 0.44 // ~79.2 degrees
  const domeBaseOffset = domeRadius * Math.cos(domeCutAngle) // 0.2587
  const lidGeo = new THREE.SphereGeometry(domeRadius, 96, 32, 0, Math.PI * 2, 0, domeCutAngle)
  const lidMesh = new THREE.Mesh(lidGeo, lidMat)
  lidMesh.position.y = cupHeight / 2 - domeBaseOffset
  lidGroup.add(lidMesh)

  // Lid Rim Lip Torus: encircles the top rim of the cup tightly
  const lidLipGeo = new THREE.TorusGeometry(cupTopRadius * 1.01, 0.035, 24, 128)
  const lidLipMesh = new THREE.Mesh(lidLipGeo, lidMat)
  lidLipMesh.rotation.x = Math.PI / 2
  lidLipMesh.position.y = cupHeight / 2
  lidGroup.add(lidLipMesh)

  // Straw Collar Ring at the dome apex
  const collarGeo = new THREE.TorusGeometry(0.16, 0.03, 24, 64)
  const collarMesh = new THREE.Mesh(collarGeo, lidMat)
  collarMesh.rotation.x = Math.PI / 2
  collarMesh.position.y = cupHeight / 2 - domeBaseOffset + domeRadius
  lidGroup.add(collarMesh)

  // Emerald Straw
  const strawMat = new THREE.MeshStandardMaterial({
    color: 0x0f766e,
    roughness: 0.35,
    metalness: 0.05,
  })
  const strawGeo = new THREE.CylinderGeometry(0.075, 0.075, 4.4, 48)
  strawMesh = new THREE.Mesh(strawGeo, strawMat)
  strawMesh.position.set(0.12, 0.7, 0.08)
  strawMesh.rotation.z = -0.16
  strawMesh.rotation.x = 0.08
  strawMesh.castShadow = true
  cupGroup.add(strawMesh)

  // Condensation Droplets Group
  condensationGroup = new THREE.Group()
  cupGroup.add(condensationGroup)

  const dropGeo = new THREE.SphereGeometry(0.024, 8, 8)
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.98,
    transparent: true,
    roughness: 0.04,
    ior: 1.33,
  })

  for (let i = 0; i < 55; i++) {
    const drop = new THREE.Mesh(dropGeo, dropMat)
    const angle = Math.random() * Math.PI * 2
    const t = Math.random()
    const y = -1.2 + t * 2.4
    const radiusAtY = cupBottomRadius + (cupTopRadius - cupBottomRadius) * ((y + cupHeight / 2) / cupHeight) + 0.015

    drop.position.set(Math.cos(angle) * radiusAtY, y, Math.sin(angle) * radiusAtY)
    const scale = 0.5 + Math.random() * 0.9
    drop.scale.set(scale, scale * (1 + Math.random() * 0.6), scale * 0.6)
    drop.rotation.y = angle
    condensationGroup.add(drop)
  }

  // 5. Liquid Group
  liquidGroup = new THREE.Group()
  cupGroup.add(liquidGroup)

  const initialColor = getDrinkColor(props.productId, props.flavor, props.milk, props.withCream, props.withExtraShot)
  rebuildLiquid(currentLiquidHeight, initialColor)

  // 6. Ice Cubes Group
  iceGroup = new THREE.Group()
  cupGroup.add(iceGroup)

  // Initial Ice & Temperature Setup
  const isHotInitial = props.temperature === 'hot'
  if (isHotInitial) {
    if (condensationGroup) condensationGroup.visible = false
    if (strawMesh) strawMesh.visible = false
    if (lidGroup) lidGroup.visible = false
  }

  const initialCubes = (isHotInitial || props.iceLevel === 'none') ? 0 : props.iceLevel === 'less' ? 5 : props.iceLevel === 'regular' ? 9 : 14
  updateIceCubes(initialCubes, false) // Immediate placement on load!

  // 3D Artisanal Milk Foam / Whipped Cream Swirl
  buildFoamSwirl()

  // Real-time Toppings & Steam
  buildCocoaDusting()
  buildCaramelDrizzle()
  buildSteam()

  // Micro Bubbles
  const bubbleGeo = new THREE.SphereGeometry(0.018, 8, 8)
  const bubbleMat = new THREE.MeshBasicMaterial({ color: 0xffeedd, transparent: true, opacity: 0.6 })
  for (let i = 0; i < 20; i++) {
    const b = new THREE.Mesh(bubbleGeo, bubbleMat)
    const r = Math.random() * (baseLiquidTopRadius * 0.65)
    const a = Math.random() * Math.PI * 2
    b.position.set(Math.cos(a) * r, 0.6 + Math.random() * 0.5, Math.sin(a) * r)
    b.userData = { speed: 0.002 + Math.random() * 0.003 }
    liquidGroup.add(b)
    bubbles.push(b)
  }

  // Cream / Milk Stream Mesh (hidden by default)
  const creamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 })
  const creamGeo = new THREE.CylinderGeometry(0.065, 0.04, 3.2, 16)
  creamStreamMesh = new THREE.Mesh(creamGeo, creamMat)
  creamStreamMesh.position.set(0, 3.4, 0)
  creamStreamMesh.visible = false
  scene.add(creamStreamMesh)

  // Extra Espresso Pour Stream Mesh
  const espressoMat = new THREE.MeshStandardMaterial({ color: 0x1a0902, roughness: 0.25 })
  const espressoGeo = new THREE.CylinderGeometry(0.045, 0.035, 3.2, 16)
  espressoStreamMesh = new THREE.Mesh(espressoGeo, espressoMat)
  espressoStreamMesh.position.set(0, 3.4, 0)
  espressoStreamMesh.visible = false
  scene.add(espressoStreamMesh)

  // Cream Marbling Blobs
  const blobGeo = new THREE.SphereGeometry(0.24, 16, 16)
  const blobMat = new THREE.MeshStandardMaterial({
    color: 0xfffaea,
    roughness: 0.4,
    transparent: true,
    opacity: 0.92,
  })
  for (let i = 0; i < 9; i++) {
    const blob = new THREE.Mesh(blobGeo, blobMat.clone())
    blob.visible = false
    liquidGroup.add(blob)
    creamBlobs.push(blob)
  }

  // Sugar Particles System
  const sugarCount = 80
  const sugarGeo = new THREE.BufferGeometry()
  const sugarPositions = new Float32Array(sugarCount * 3)
  sugarGeo.setAttribute('position', new THREE.BufferAttribute(sugarPositions, 3))
  const sugarMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.045,
    transparent: true,
    opacity: 0.95,
  })
  sugarPoints = new THREE.Points(sugarGeo, sugarMat)
  sugarPoints.visible = false
  scene.add(sugarPoints)

  // Tactile Glass Tap Feedback
  function triggerCupTap() {
    audioEngine?.resumeContext()
    audioEngine?.playIceClink()
    triggerRipple()
    if (cupGroup) {
      gsap.to(cupGroup.rotation, {
        z: 0.03,
        duration: 0.08,
        yoyo: true,
        repeat: 1,
        ease: 'power1.inOut',
      })
    }
    iceCubes.forEach((cube) => {
      if (cube.userData && cube.userData.baseY !== undefined) {
        gsap.to(cube.position, {
          y: cube.userData.baseY - 0.06,
          duration: 0.12,
          yoyo: true,
          repeat: 1,
          ease: 'power1.out',
        })
      }
    })
  }

  // 6. 60fps Render Loop
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate)

    const elapsedTime = clock.getElapsedTime()
    controls.update()
    audioEngine?.updateSpatialPanning()

    // Floating perpetual bobbing for ice cubes (Dual-frequency harmonic fluid wave superposition)
    iceCubes.forEach((cube) => {
      if (cube.userData && cube.userData.baseY !== undefined && !cube.userData.isAnimating) {
        cube.position.y = cube.userData.baseY +
          Math.sin(elapsedTime * 2.2 + cube.userData.phase) * 0.016 +
          Math.cos(elapsedTime * 1.4 + cube.userData.phase * 1.6) * 0.007
        cube.rotation.y += cube.userData.rotSpeed
        cube.rotation.x += cube.userData.rotSpeed * 0.5
      }
    })

    // Delicate rising warm steam wisps (when hot)
    if (steamGroup && steamGroup.visible) {
      steamGroup.children.forEach((s) => {
        s.position.y += s.userData.speedY
        s.position.x += s.userData.driftX
        const progress = (s.position.y - s.userData.initialY) / (s.userData.maxHeight - s.userData.initialY)
        ;(s as THREE.Mesh<any, THREE.MeshBasicMaterial>).material.opacity = Math.max(0, 0.18 * (1 - progress))
        if (s.position.y > s.userData.maxHeight) {
          s.position.y = s.userData.initialY
          s.position.x = (Math.random() - 0.5) * 0.8
        }
      })
    }

    // Surface wave ripples
    if (surfaceMesh) {
      surfaceMesh.position.y = (-cupHeight / 2 + currentLiquidHeight + 0.04) + Math.sin(elapsedTime * 3) * (0.008 * rippleStrength)
      surfaceMesh.rotation.z = Math.sin(elapsedTime * 2) * (0.015 * rippleStrength)
    }

    // Rising micro bubbles
    bubbles.forEach((b) => {
      b.position.y += b.userData.speed
      if (b.position.y > (surfaceMesh ? surfaceMesh.position.y : 1.2)) {
        b.position.y = -0.7
      }
    })

    renderer.render(scene, camera)
  }

  animate()
}

// Watchers for Real-time Interactive Reactivity
watch(
  () => props.iceLevel,
  (newLevel) => {
    audioEngine?.resumeContext()
    const isHot = props.temperature === 'hot'
    const count = (isHot || newLevel === 'none') ? 0 : newLevel === 'less' ? 5 : newLevel === 'regular' ? 9 : 14
    updateIceCubes(count, true)
  }
)

watch(
  () => props.temperature,
  (newTemp) => {
    audioEngine?.resumeContext()
    const isHot = newTemp === 'hot'
    if (condensationGroup) condensationGroup.visible = !isHot
    if (strawMesh) strawMesh.visible = !isHot
    if (lidGroup) lidGroup.visible = !isHot
    if (steamGroup) steamGroup.visible = isHot && !props.isEmpty

    if (isHot) {
      audioEngine?.playSteamHiss()
      updateIceCubes(0, true)
    } else {
      audioEngine?.playIceClink()
      const count = props.iceLevel === 'none' ? 0 : props.iceLevel === 'less' ? 5 : props.iceLevel === 'regular' ? 9 : 14
      updateIceCubes(count, true)
    }
  }
)

watch(
  () => props.withCream,
  (val) => {
    audioEngine?.resumeContext()
    if (val) {
      triggerCreamPour()
      if (foamGroup) {
        foamGroup.visible = true
        gsap.fromTo(foamGroup.scale, { x: 0.1, y: 0.1, z: 0.1 }, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'back.out(1.5)' })
      }
    } else {
      if (foamGroup) {
        gsap.to(foamGroup.scale, {
          x: 0.01,
          y: 0.01,
          z: 0.01,
          duration: 0.28,
          onComplete: () => {
            if (foamGroup) foamGroup.visible = false
          },
        })
      }
      updateDrinkAppearance(true)
    }
    buildCocoaDusting()
    buildCaramelDrizzle()
  }
)

watch(
  () => props.withExtraShot,
  (val) => {
    audioEngine?.resumeContext()
    if (val) {
      triggerEspressoPour()
    } else {
      updateDrinkAppearance(true)
    }
  }
)

watch(
  () => props.withCocoa,
  () => {
    audioEngine?.resumeContext()
    buildCocoaDusting()
  }
)

watch(
  () => props.withCaramel,
  () => {
    audioEngine?.resumeContext()
    buildCaramelDrizzle()
  }
)

watch(
  () => [props.flavor, props.milk],
  ([newFlavor, newMilk], [oldFlavor, oldMilk]) => {
    audioEngine?.resumeContext()
    if (newMilk !== oldMilk) {
      triggerCreamPour()
    } else {
      triggerRipple()
    }
    updateDrinkAppearance(true)
  }
)

watch(
  () => props.sweetness,
  (newSweet) => {
    audioEngine?.resumeContext()
    if (newSweet !== '0%') {
      triggerSugarStream()
    }
  }
)

watch(
  () => props.size,
  (newSize) => {
    if (!cupGroup) return
    audioEngine?.resumeContext()
    const scale = newSize === 'S' ? 0.92 : newSize === 'M' ? 1.0 : 1.08
    gsap.to(cupGroup.scale, {
      x: scale,
      y: scale,
      z: scale,
      duration: 0.45,
      ease: 'back.out(1.5)',
    })
    audioEngine?.playIceClink()
  }
)

watch(
  () => props.productId,
  () => {
    const col = getDrinkColor(props.productId, props.flavor, props.milk, props.withCream, props.withExtraShot)
    rebuildLiquid(currentLiquidHeight, col)
    updateDrinkAppearance(false)
  }
)

watch(
  () => props.isEmpty,
  (empty) => {
    audioEngine?.resumeContext()
    if (empty) {
      audioEngine?.playIceClink()
    } else {
      audioEngine?.playPourStream(1.2)
      audioEngine?.playIceClink()
    }
    const list = [liquidGroup, iceGroup, foamGroup, cocoaGroup, caramelGroup, steamGroup]
    list.forEach((g) => {
      if (g) {
        gsap.to(g.position, {
          y: empty ? -3.0 : 0,
          duration: 0.5,
          ease: 'power2.inOut',
        })
      }
    })
  }
)

let resizeObserver: ResizeObserver | null = null

const handleResize = () => {
  if (!containerRef.value || !camera || !renderer) return
  const width = containerRef.value.clientWidth || 340
  const height = containerRef.value.clientHeight || 380
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

onMounted(() => {
  nextTick(() => {
    initThreeScene()
    window.addEventListener('resize', handleResize)
    if (typeof ResizeObserver !== 'undefined' && containerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        handleResize()
      })
      resizeObserver.observe(containerRef.value)
    }
  })
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', handleResize)

  // Clean WebGL resources
  audioEngine?.destroy()
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<template>
  <div class="relative w-full h-[330px] sm:h-[380px] lg:h-[420px] flex items-center justify-center select-none overflow-hidden">
    <!-- WebGL Canvas Container -->
    <div
      ref="containerRef"
      class="w-full h-full cursor-grab active:cursor-grabbing"
      title="Drag to orbit 360° in 8D • Scroll to zoom"
    />

    <!-- Top Right 8D Controls Bar -->
    <div class="absolute top-2 right-2 flex items-center gap-1.5 z-30">
      <!-- 8D Sound Toggle -->
      <button
        type="button"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all duration-200 cursor-pointer shadow-md active:scale-90"
        :class="is8DAudioMuted
          ? 'bg-black/50 text-coffee-muted border-white/10 hover:text-white'
          : 'bg-teal-500/25 text-teal-300 border-teal-400/50 shadow-[0_0_10px_rgba(111,168,163,0.3)]'"
        :title="is8DAudioMuted ? 'Unmute 8D Spatial Audio' : 'Mute 8D Spatial Audio'"
        @click="toggleAudio"
      >
        <span class="text-xs">{{ is8DAudioMuted ? '🔇' : '🔊' }}</span>
        <span class="font-mono text-[10px] tracking-wide">{{ is8DAudioMuted ? 'Muted' : '8D Audio' }}</span>
      </button>

      <!-- Reset Camera Angle -->
      <button
        type="button"
        class="p-1.5 rounded-full bg-black/40 hover:bg-white/15 border border-white/10 text-coffee-sand hover:text-white transition-all cursor-pointer active:scale-90"
        title="Reset 360° Angle"
        @click="resetCamera"
      >
        <span class="text-xs block">🔄</span>
      </button>
    </div>

    <!-- 8D Spatial Badge Bottom Center -->
    <div class="absolute bottom-2 inset-x-0 flex items-center justify-center pointer-events-none z-20">
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/50 border border-white/15 text-[11px] text-coffee-sand font-medium backdrop-blur-md shadow-lg">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
          <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500" />
        </span>
        <span>🎧 360° WebGL 8D View • Drag to rotate</span>
      </div>
    </div>
  </div>
</template>

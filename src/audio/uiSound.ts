export interface EnvelopePoint {
  time: number
  gain: number
}

export function buildClickEnvelope(peakGain: number, attack: number, decay: number): EnvelopePoint[] {
  return [
    { time: 0, gain: 0 },
    { time: attack, gain: peakGain },
    { time: Math.round((attack + decay) * 1e10) / 1e10, gain: 0 },
  ]
}

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

function playTone(frequency: number, peakGain: number, attack: number, decay: number): void {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  const now = ctx.currentTime
  const envelope = buildClickEnvelope(peakGain, attack, decay)
  gainNode.gain.setValueAtTime(envelope[0].gain, now + envelope[0].time)
  gainNode.gain.linearRampToValueAtTime(envelope[1].gain, now + envelope[1].time)
  gainNode.gain.linearRampToValueAtTime(envelope[2].gain, now + envelope[2].time)

  oscillator.start(now)
  oscillator.stop(now + envelope[2].time)
}

export function playHoverTick(): void {
  playTone(880, 0.05, 0.005, 0.04)
}

export function playSelectChime(): void {
  playTone(1320, 0.08, 0.005, 0.12)
}

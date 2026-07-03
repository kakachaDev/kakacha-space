import { createParticles, stepParticles, type Particle } from './particleSim'

let particles: Particle[] = []
let width = 0
let height = 0
let lastTime = 0
let stopped = false

self.onmessage = (e: MessageEvent) => {
  const msg = e.data
  if (msg.type === 'init') {
    width = msg.width
    height = msg.height
    particles = createParticles(msg.count, width, height)
    lastTime = performance.now()
    stopped = false
    tick()
  } else if (msg.type === 'resize') {
    width = msg.width
    height = msg.height
  } else if (msg.type === 'stop') {
    stopped = true
  }
}

function tick() {
  if (stopped) return
  const now = performance.now()
  const dt = Math.min((now - lastTime) / 1000, 0.1)
  lastTime = now
  particles = stepParticles(particles, dt, width, height)
  self.postMessage({ type: 'tick', particles })
  setTimeout(tick, 1000 / 60)
}

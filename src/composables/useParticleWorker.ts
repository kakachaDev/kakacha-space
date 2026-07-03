import { onBeforeUnmount, ref, type Ref } from 'vue'
import type { Particle } from '../workers/particleSim'

export function useParticleWorker(width: number, height: number, count = 50): { particles: Ref<Particle[]> } {
  const particles = ref<Particle[]>([]) as Ref<Particle[]>
  const worker = new Worker(new URL('../workers/particles.worker.ts', import.meta.url), { type: 'module' })

  worker.onmessage = (e: MessageEvent) => {
    if (e.data.type === 'tick') {
      particles.value = e.data.particles
    }
  }
  worker.postMessage({ type: 'init', width, height, count })

  onBeforeUnmount(() => {
    worker.postMessage({ type: 'stop' })
    worker.terminate()
  })

  return { particles }
}

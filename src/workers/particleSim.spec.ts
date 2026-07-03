import { describe, it, expect } from 'vitest'
import { createParticles, stepParticles, type Particle } from './particleSim'

describe('createParticles', () => {
  it('creates the requested number of particles', () => {
    const particles = createParticles(10, 800, 600)
    expect(particles).toHaveLength(10)
  })

  it('places particles within the given bounds', () => {
    const particles = createParticles(20, 800, 600)
    for (const p of particles) {
      expect(p.x).toBeGreaterThanOrEqual(0)
      expect(p.x).toBeLessThanOrEqual(800)
      expect(p.y).toBeGreaterThanOrEqual(0)
      expect(p.y).toBeLessThanOrEqual(600)
    }
  })
})

describe('stepParticles', () => {
  it('moves a particle by velocity * dt', () => {
    const particles: Particle[] = [{ x: 10, y: 10, vx: 5, vy: 2, radius: 1, opacity: 0.5 }]
    const [result] = stepParticles(particles, 1, 800, 600)
    expect(result.x).toBe(15)
    expect(result.y).toBe(12)
  })

  it('wraps a particle back below the bottom edge once it drifts above the top', () => {
    const particles: Particle[] = [{ x: 10, y: 5, vx: 0, vy: -20, radius: 1, opacity: 0.5 }]
    const [result] = stepParticles(particles, 1, 800, 600)
    expect(result.y).toBe(610)
  })

  it('wraps a particle to the right edge once it drifts past the left', () => {
    const particles: Particle[] = [{ x: 5, y: 10, vx: -20, vy: 0, radius: 1, opacity: 0.5 }]
    const [result] = stepParticles(particles, 1, 800, 600)
    expect(result.x).toBe(810)
  })

  it('does not mutate the input array', () => {
    const particles: Particle[] = [{ x: 10, y: 10, vx: 5, vy: 2, radius: 1, opacity: 0.5 }]
    stepParticles(particles, 1, 800, 600)
    expect(particles[0].x).toBe(10)
  })
})

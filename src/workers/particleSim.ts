export interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export function createParticles(count: number, width: number, height: number): Particle[] {
  const particles: Particle[] = []
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 10,
      vy: -5 - Math.random() * 10,
      radius: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.5,
    })
  }
  return particles
}

export function stepParticles(particles: Particle[], dt: number, width: number, height: number): Particle[] {
  return particles.map((p) => {
    let x = p.x + p.vx * dt
    let y = p.y + p.vy * dt
    if (y < -10) y = height + 10
    if (x < -10) x = width + 10
    if (x > width + 10) x = -10
    return { ...p, x, y }
  })
}

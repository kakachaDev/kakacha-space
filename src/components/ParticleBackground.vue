<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useParticleWorker } from '../composables/useParticleWorker'
import { theme } from '../theme'

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

const { r, g, b } = hexToRgb(theme.colors.accentGold)

const canvasRef = ref<HTMLCanvasElement | null>(null)
const { particles } = useParticleWorker(
  typeof window !== 'undefined' ? window.innerWidth : 800,
  typeof window !== 'undefined' ? window.innerHeight : 600,
  50
)

function draw() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth
  if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (const p of particles.value) {
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`
    ctx.fill()
  }
  requestAnimationFrame(draw)
}

onMounted(() => {
  requestAnimationFrame(draw)
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-bg" aria-hidden="true" />
</template>

<style scoped>
.particle-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
</style>

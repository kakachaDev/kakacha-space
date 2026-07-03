import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('../composables/useParticleWorker', () => ({
  useParticleWorker: () => ({
    particles: ref([{ x: 10, y: 10, vx: 0, vy: 0, radius: 2, opacity: 0.5 }]),
  }),
}))

import ParticleBackground from './ParticleBackground.vue'

describe('ParticleBackground', () => {
  it('renders a canvas element', () => {
    const wrapper = mount(ParticleBackground)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})

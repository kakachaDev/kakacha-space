import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

vi.mock('../composables/useParticleWorker', () => ({
  useParticleWorker: () => ({
    particles: ref([{ x: 10, y: 10, vx: 0, vy: 0, radius: 2, opacity: 0.5 }]),
  }),
}))

vi.mock('../webgl/particleRenderer', () => ({
  ParticleGLRenderer: vi.fn().mockImplementation(function () {
    return { draw: vi.fn() }
  }),
}))

import ParticleBackground from './ParticleBackground.vue'
import { ParticleGLRenderer } from '../webgl/particleRenderer'

describe('ParticleBackground', () => {
  it('renders a canvas element', () => {
    const wrapper = mount(ParticleBackground)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('does not construct the WebGL renderer when no WebGL context is available (jsdom has none by default)', () => {
    vi.mocked(ParticleGLRenderer).mockClear()
    mount(ParticleBackground)
    expect(ParticleGLRenderer).not.toHaveBeenCalled()
  })

  it('constructs the WebGL renderer when a WebGL context is available', () => {
    vi.mocked(ParticleGLRenderer).mockClear()
    const fakeGl = {} as WebGLRenderingContext
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(((type: string) => (type === 'webgl' ? fakeGl : null)) as typeof HTMLCanvasElement.prototype.getContext)

    mount(ParticleBackground)

    expect(ParticleGLRenderer).toHaveBeenCalledWith(fakeGl, expect.any(String))
    getContextSpy.mockRestore()
  })
})

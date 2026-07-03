import { describe, it, expect } from 'vitest'
import { hexToRgbFloat } from './particleRenderer'

describe('hexToRgbFloat', () => {
  it('converts a hex color to normalized RGB floats', () => {
    const [r, g, b] = hexToRgbFloat('#c9a15a')
    expect(r).toBeCloseTo(201 / 255, 5)
    expect(g).toBeCloseTo(161 / 255, 5)
    expect(b).toBeCloseTo(90 / 255, 5)
  })

  it('handles pure black', () => {
    expect(hexToRgbFloat('#000000')).toEqual([0, 0, 0])
  })

  it('handles pure white', () => {
    const [r, g, b] = hexToRgbFloat('#ffffff')
    expect(r).toBeCloseTo(1, 5)
    expect(g).toBeCloseTo(1, 5)
    expect(b).toBeCloseTo(1, 5)
  })
})

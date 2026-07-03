import { describe, it, expect } from 'vitest'
import { manifestConfig } from './manifestConfig'

describe('manifestConfig', () => {
  it('has the required PWA manifest fields', () => {
    expect(manifestConfig.name).toBeTruthy()
    expect(manifestConfig.short_name).toBeTruthy()
    expect(manifestConfig.start_url).toBe('/')
    expect(manifestConfig.display).toBe('standalone')
    expect(manifestConfig.theme_color).toMatch(/^#[0-9a-f]{6}$/i)
    expect(manifestConfig.background_color).toMatch(/^#[0-9a-f]{6}$/i)
  })

  it('declares the 192 and 512 icon sizes', () => {
    const sizes = manifestConfig.icons.map((icon) => icon.sizes)
    expect(sizes).toContain('192x192')
    expect(sizes).toContain('512x512')
  })
})

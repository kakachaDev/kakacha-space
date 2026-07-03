import { describe, it, expect } from 'vitest'
import { theme } from './theme'

describe('theme', () => {
  it('exposes the core color tokens', () => {
    expect(theme.colors.bg).toBeDefined()
    expect(theme.colors.panel).toBeDefined()
    expect(theme.colors.accentRed).toBeDefined()
    expect(theme.colors.accentGold).toBeDefined()
    expect(theme.colors.text).toBeDefined()
    expect(theme.colors.textDim).toBeDefined()
  })

  it('colors are valid hex strings', () => {
    const hex = /^#[0-9a-f]{6}$/i
    for (const value of Object.values(theme.colors)) {
      expect(value).toMatch(hex)
    }
  })
})

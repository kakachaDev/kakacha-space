import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../audio/uiSound', () => ({
  playHoverTick: vi.fn(),
  playSelectChime: vi.fn(),
}))

import { useMenuSound } from './useMenuSound'
import { playHoverTick, playSelectChime } from '../audio/uiSound'

describe('useMenuSound', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('defaults to disabled when nothing is stored', () => {
    const { enabled } = useMenuSound()
    expect(enabled.value).toBe(false)
  })

  it('reads a previously stored enabled state', () => {
    localStorage.setItem('sound-enabled', 'true')
    const { enabled } = useMenuSound()
    expect(enabled.value).toBe(true)
  })

  it('toggle flips enabled and persists it', () => {
    const { enabled, toggle } = useMenuSound()
    toggle()
    expect(enabled.value).toBe(true)
    expect(localStorage.getItem('sound-enabled')).toBe('true')
  })

  it('playHover only calls the tone when enabled', () => {
    const { toggle, playHover } = useMenuSound()
    playHover()
    expect(playHoverTick).not.toHaveBeenCalled()
    toggle()
    playHover()
    expect(playHoverTick).toHaveBeenCalledTimes(1)
  })

  it('playSelect only calls the chime when enabled', () => {
    const { toggle, playSelect } = useMenuSound()
    playSelect()
    expect(playSelectChime).not.toHaveBeenCalled()
    toggle()
    playSelect()
    expect(playSelectChime).toHaveBeenCalledTimes(1)
  })
})

import { describe, it, expect, vi, afterEach } from 'vitest'
import { useIsWidePane } from './useIsWidePane'

function mockMatchMedia(matches: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = []
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.push(cb),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia
  return listeners
}

describe('useIsWidePane', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is wide when the media query matches', () => {
    mockMatchMedia(true)
    const { isWide } = useIsWidePane()
    expect(isWide.value).toBe(true)
  })

  it('is not wide when the media query does not match', () => {
    mockMatchMedia(false)
    const { isWide } = useIsWidePane()
    expect(isWide.value).toBe(false)
  })

  it('builds the query from the given breakpoint', () => {
    mockMatchMedia(true)
    useIsWidePane(1024)
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)')
  })
})

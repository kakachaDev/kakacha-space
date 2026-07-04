import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { usePostHits } from './usePostHits'

const ENDPOINT = 'https://hits.example.com'

describe('usePostHits', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('stays null when no endpoint is configured', () => {
    const { hits } = usePostHits('post-a', '')
    expect(hits.value).toBeNull()
  })

  it('POSTs on first view and stores the dedupe flag', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ hits: 7 }) })
    vi.stubGlobal('fetch', fetchMock)

    const { hits } = usePostHits('post-a', ENDPOINT)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(`${ENDPOINT}/api/hits?slug=post-a`, { method: 'POST' })
    expect(hits.value).toBe(7)
    expect(sessionStorage.getItem('hits-seen:post-a')).toBe('1')
  })

  it('GETs on repeat views within the session', async () => {
    sessionStorage.setItem('hits-seen:post-a', '1')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ hits: 7 }) })
    vi.stubGlobal('fetch', fetchMock)

    usePostHits('post-a', ENDPOINT)
    await flushPromises()

    expect(fetchMock).toHaveBeenCalledWith(`${ENDPOINT}/api/hits?slug=post-a`, { method: 'GET' })
  })

  it('stays null when the service is down', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    const { hits } = usePostHits('post-a', ENDPOINT)
    await flushPromises()

    expect(hits.value).toBeNull()
  })
})

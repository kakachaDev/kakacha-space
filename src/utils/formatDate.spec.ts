import { describe, expect, it } from 'vitest'
import { formatDateRu } from './formatDate'

describe('formatDateRu', () => {
  it('formats ISO dates into Russian', () => {
    expect(formatDateRu('2026-05-24')).toBe('24 мая 2026')
    expect(formatDateRu('2026-02-01')).toBe('1 февраля 2026')
  })

  it('returns input unchanged when not an ISO date', () => {
    expect(formatDateRu('вчера')).toBe('вчера')
    expect(formatDateRu('')).toBe('')
  })

  it('returns input unchanged for impossible months', () => {
    expect(formatDateRu('2026-13-01')).toBe('2026-13-01')
  })
})

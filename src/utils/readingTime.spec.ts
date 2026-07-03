import { describe, expect, it } from 'vitest'
import { readingMinutes } from './readingTime'

describe('readingMinutes', () => {
  it('returns at least 1 minute for short text', () => {
    expect(readingMinutes('пара слов')).toBe(1)
  })

  it('rounds by ~180 words per minute', () => {
    const words = Array.from({ length: 540 }, (_, i) => `слово${i}`).join(' ')
    expect(readingMinutes(words)).toBe(3)
  })

  it('does not count fenced code blocks word by word', () => {
    const code = '```\n' + Array.from({ length: 400 }, () => 'x = 1').join('\n') + '\n```'
    expect(readingMinutes(`короткий текст ${code}`)).toBe(1)
  })

  it('handles empty input', () => {
    expect(readingMinutes('')).toBe(1)
  })
})

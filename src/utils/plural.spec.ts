import { describe, expect, it } from 'vitest'
import { ruPlural } from './plural'

const forms: [string, string, string] = ['просмотр', 'просмотра', 'просмотров']

describe('ruPlural', () => {
  it('picks the right form for views', () => {
    expect(ruPlural(1, ...forms)).toBe('просмотр')
    expect(ruPlural(2, ...forms)).toBe('просмотра')
    expect(ruPlural(5, ...forms)).toBe('просмотров')
    expect(ruPlural(11, ...forms)).toBe('просмотров')
    expect(ruPlural(21, ...forms)).toBe('просмотр')
    expect(ruPlural(104, ...forms)).toBe('просмотра')
    expect(ruPlural(0, ...forms)).toBe('просмотров')
  })
})

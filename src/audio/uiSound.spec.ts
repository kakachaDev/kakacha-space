import { describe, it, expect } from 'vitest'
import { buildClickEnvelope } from './uiSound'

describe('buildClickEnvelope', () => {
  it('starts silent, peaks at the attack time, and returns to silent after decay', () => {
    const envelope = buildClickEnvelope(0.1, 0.01, 0.05)
    expect(envelope).toEqual([
      { time: 0, gain: 0 },
      { time: 0.01, gain: 0.1 },
      { time: 0.06, gain: 0 },
    ])
  })
})

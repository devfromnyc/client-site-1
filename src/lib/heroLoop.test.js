import { describe, expect, it } from 'vitest'
import { shouldRestartHeroLoop } from './heroLoop.js'

describe('shouldRestartHeroLoop', () => {
  it('restarts at or past the end timestamp', () => {
    expect(shouldRestartHeroLoop(40, 4, 40)).toBe(true)
    expect(shouldRestartHeroLoop(40.2, 4, 40)).toBe(true)
    expect(shouldRestartHeroLoop(39.9, 4, 40)).toBe(false)
  })

  it('restarts if playback drifts before the start window', () => {
    expect(shouldRestartHeroLoop(0, 4, 40)).toBe(true)
    expect(shouldRestartHeroLoop(3.4, 4, 40)).toBe(true)
    expect(shouldRestartHeroLoop(4, 4, 40)).toBe(false)
    expect(shouldRestartHeroLoop(12, 4, 40)).toBe(false)
  })
})

/** Restart when playback reaches/passes the end, or drifts before the start window. */
export function shouldRestartHeroLoop(currentTime, startSeconds, endSeconds) {
  if (!Number.isFinite(currentTime)) return false
  return currentTime >= endSeconds || currentTime < startSeconds - 0.5
}

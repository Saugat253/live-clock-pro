import { useCallback, useEffect, useRef, useState } from 'react'
import type { Lap, StopwatchStatus } from '../types'

export interface StopwatchApi {
  status: StopwatchStatus
  /** Elapsed time in milliseconds. */
  elapsedMs: number
  laps: Lap[]
  start: () => void
  pause: () => void
  resume: () => void
  reset: () => void
  /** Record a lap (works while running or paused). */
  lap: () => void
}

/**
 * Stopwatch with millisecond resolution and lap support. Elapsed time is
 * computed from `performance.now()` deltas (monotonic, unaffected by clock
 * changes) and refreshed each animation frame for a smooth millisecond display.
 */
export function useStopwatch(): StopwatchApi {
  const [status, setStatus] = useState<StopwatchStatus>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [laps, setLaps] = useState<Lap[]>([])

  // `baseRef` is the perf.now() value such that elapsed = perf.now() - baseRef.
  const baseRef = useRef(0)
  const elapsedRef = useRef(0)
  const statusRef = useRef(status)

  useEffect(() => {
    statusRef.current = status
  }, [status])

  // Animation-frame ticker — only mounted while running.
  useEffect(() => {
    if (status !== 'running') return
    let raf: number
    const tick = () => {
      const e = performance.now() - baseRef.current
      elapsedRef.current = e
      setElapsedMs(e)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [status])

  const start = useCallback(() => {
    if (statusRef.current === 'running') return
    baseRef.current = performance.now()
    elapsedRef.current = 0
    setElapsedMs(0)
    setLaps([])
    setStatus('running')
  }, [])

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') return
    elapsedRef.current = performance.now() - baseRef.current
    setElapsedMs(elapsedRef.current)
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return
    baseRef.current = performance.now() - elapsedRef.current
    setStatus('running')
  }, [])

  const reset = useCallback(() => {
    elapsedRef.current = 0
    setElapsedMs(0)
    setLaps([])
    setStatus('idle')
  }, [])

  const lap = useCallback(() => {
    const total =
      statusRef.current === 'running'
        ? performance.now() - baseRef.current
        : elapsedRef.current
    if (total <= 0) return
    setLaps((prev) => {
      const prevTotal = prev.length ? prev[prev.length - 1].total : 0
      return [
        ...prev,
        { index: prev.length + 1, split: total - prevTotal, total },
      ]
    })
  }, [])

  return { status, elapsedMs, laps, start, pause, resume, reset, lap }
}

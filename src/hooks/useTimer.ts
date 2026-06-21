import { useCallback, useEffect, useRef, useState } from 'react'
import type { TimerStatus } from '../types'

const TICK_MS = 100

export interface TimerApi {
  status: TimerStatus
  /** Milliseconds left on the clock. */
  remainingMs: number
  /** Configured total duration in milliseconds. */
  durationMs: number
  /** Fraction of time remaining, 0..1 (1 = full, 0 = done). */
  progress: number
  /** Start counting down; optionally (re)set the duration first. */
  start: (seconds?: number) => void
  pause: () => void
  resume: () => void
  /** Re-arm to the configured duration (idle). */
  reset: () => void
  /** Stop and clear back to the configured duration (idle). */
  stop: () => void
  /** Set the configured duration while idle. */
  setDurationSeconds: (seconds: number) => void
}

interface UseTimerOptions {
  initialSeconds: number
  onComplete?: () => void
}

/**
 * Countdown timer. Remaining time is always derived from a target end
 * timestamp (`Date.now()`-based), so accuracy is independent of timer-callback
 * jitter — it stays within the spec's ±100ms even if a tick is delayed.
 */
export function useTimer({
  initialSeconds,
  onComplete,
}: UseTimerOptions): TimerApi {
  const initialMs = Math.max(0, Math.round(initialSeconds * 1000))
  const [durationMs, setDurationMs] = useState(initialMs)
  const [remainingMs, setRemainingMs] = useState(initialMs)
  const [status, setStatus] = useState<TimerStatus>('idle')

  const endTimeRef = useRef(0)
  const statusRef = useRef(status)
  const remainingRef = useRef(remainingMs)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    statusRef.current = status
  }, [status])
  useEffect(() => {
    remainingRef.current = remainingMs
  }, [remainingMs])
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Ticker — only mounted while running.
  useEffect(() => {
    if (status !== 'running') return
    let id: number
    const tick = () => {
      const remaining = endTimeRef.current - Date.now()
      if (remaining <= 0) {
        setRemainingMs(0)
        setStatus('finished')
        onCompleteRef.current?.()
        return
      }
      setRemainingMs(remaining)
      id = window.setTimeout(tick, TICK_MS)
    }
    id = window.setTimeout(tick, TICK_MS)
    return () => window.clearTimeout(id)
  }, [status])

  const start = useCallback(
    (seconds?: number) => {
      const ms =
        seconds != null ? Math.max(0, Math.round(seconds * 1000)) : durationMs
      if (ms <= 0) return
      setDurationMs(ms)
      setRemainingMs(ms)
      endTimeRef.current = Date.now() + ms
      setStatus('running')
    },
    [durationMs],
  )

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') return
    setRemainingMs(Math.max(0, endTimeRef.current - Date.now()))
    setStatus('paused')
  }, [])

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return
    endTimeRef.current = Date.now() + remainingRef.current
    setStatus('running')
  }, [])

  const reset = useCallback(() => {
    setRemainingMs(durationMs)
    setStatus('idle')
  }, [durationMs])

  // `stop` and `reset` are intentionally equivalent for a single timer: both
  // halt counting and return the display to the configured duration.
  const stop = reset

  const setDurationSeconds = useCallback((seconds: number) => {
    if (statusRef.current === 'running') return
    const ms = Math.max(0, Math.round(seconds * 1000))
    setDurationMs(ms)
    setRemainingMs(ms)
    setStatus('idle')
  }, [])

  const progress = durationMs > 0 ? remainingMs / durationMs : 0

  return {
    status,
    remainingMs,
    durationMs,
    progress,
    start,
    pause,
    resume,
    reset,
    stop,
    setDurationSeconds,
  }
}

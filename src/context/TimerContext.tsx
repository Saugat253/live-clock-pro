import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import { useTimer } from '../hooks/useTimer'
import type { TimerApi } from '../hooks/useTimer'
import { useSettings } from './SettingsContext'
import { playAlarm } from '../services/audio'
import { showNotification } from '../services/notifications'

interface TimerContextValue extends TimerApi {
  /** True while the completion alert (flash + message) is showing. */
  alerting: boolean
  dismissAlert: () => void
  /** Space-bar convenience: start / pause / resume depending on state. */
  toggle: () => void
}

const TimerContext = createContext<TimerContextValue | null>(null)

export function TimerProvider({ children }: { children: ReactNode }) {
  const { settings, setLastTimerSeconds } = useSettings()
  const [alerting, setAlerting] = useState(false)

  const handleComplete = useCallback(() => {
    setAlerting(true)
    playAlarm()
    showNotification("Time's Up!", 'Your Live Clock Pro timer has finished.')
  }, [])

  const timer = useTimer({
    initialSeconds: settings.lastTimerSeconds,
    onComplete: handleComplete,
  })

  // Persist the configured duration so it is restored on next visit.
  useEffect(() => {
    setLastTimerSeconds(Math.round(timer.durationMs / 1000))
  }, [timer.durationMs, setLastTimerSeconds])

  // Clear the alert whenever we leave the finished state.
  useEffect(() => {
    if (timer.status !== 'finished') setAlerting(false)
  }, [timer.status])

  const dismissAlert = useCallback(() => setAlerting(false), [])

  const toggle = useCallback(() => {
    if (timer.status === 'running') timer.pause()
    else if (timer.status === 'paused') timer.resume()
    else if (timer.status === 'idle') timer.start()
  }, [timer])

  const value: TimerContextValue = {
    ...timer,
    alerting,
    dismissAlert,
    toggle,
  }

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTimerContext(): TimerContextValue {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimerContext must be used within a TimerProvider')
  return ctx
}

import { useEffect, useState } from 'react'

/**
 * Returns the current time, updating once per second. The next tick is
 * scheduled to land just after the upcoming whole-second boundary, which keeps
 * the displayed seconds accurate and prevents the slow drift you get from a
 * fixed `setInterval(1000)`.
 */
export function useClock(): Date {
  const [now, setNow] = useState<Date>(() => new Date())

  useEffect(() => {
    let timeoutId: number

    const schedule = () => {
      const current = new Date()
      // Delay until the start of the next second (+5ms safety margin).
      const delay = 1000 - current.getMilliseconds() + 5
      timeoutId = window.setTimeout(() => {
        setNow(new Date())
        schedule()
      }, delay)
    }

    schedule()
    return () => window.clearTimeout(timeoutId)
  }, [])

  return now
}

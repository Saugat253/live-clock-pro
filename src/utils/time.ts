import type { ClockFormat } from '../types'

const pad = (n: number, len = 2): string => String(n).padStart(len, '0')

const DAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export interface ClockParts {
  /** Hours, minutes and (optionally) seconds joined by ":" — e.g. "09:45:12". */
  time: string
  /** "AM"/"PM" for 12-hour format, otherwise an empty string. */
  meridiem: string
}

/** Format a Date for the digital clock display. */
export function formatClock(
  date: Date,
  format: ClockFormat,
  showSeconds: boolean,
): ClockParts {
  const h24 = date.getHours()
  const minutes = pad(date.getMinutes())
  const seconds = pad(date.getSeconds())

  if (format === '24h') {
    const time = showSeconds
      ? `${pad(h24)}:${minutes}:${seconds}`
      : `${pad(h24)}:${minutes}`
    return { time, meridiem: '' }
  }

  const meridiem = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const time = showSeconds
    ? `${pad(h12)}:${minutes}:${seconds}`
    : `${pad(h12)}:${minutes}`
  return { time, meridiem }
}

/** Format a Date as e.g. "Sunday, June 21, 2026". */
export function formatLongDate(date: Date): string {
  return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

/** Split a number of seconds into hours / minutes / seconds. */
export function splitSeconds(totalSeconds: number): {
  hours: number
  minutes: number
  seconds: number
} {
  const safe = Math.max(0, Math.floor(totalSeconds))
  return {
    hours: Math.floor(safe / 3600),
    minutes: Math.floor((safe % 3600) / 60),
    seconds: safe % 60,
  }
}

/**
 * Format a duration (in milliseconds) as a countdown string.
 * Always shows MM:SS; includes HH only when there is at least one hour.
 * Rounds up so a timer reads "00:01" until it truly hits zero.
 */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000)
  const { hours, minutes, seconds } = splitSeconds(totalSeconds)
  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  return `${pad(minutes)}:${pad(seconds)}`
}

/**
 * Format elapsed time (in milliseconds) for the stopwatch as
 * HH:MM:SS.mmm (3-digit milliseconds).
 */
export function formatStopwatch(ms: number): string {
  const safe = Math.max(0, ms)
  const totalSeconds = Math.floor(safe / 1000)
  const millis = Math.floor(safe % 1000)
  const { hours, minutes, seconds } = splitSeconds(totalSeconds)
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`
}

/** Convert hours/minutes/seconds into total milliseconds. */
export function hmsToMs(hours: number, minutes: number, seconds: number): number {
  return ((hours * 60 + minutes) * 60 + seconds) * 1000
}

/** Human-readable label for a preset, e.g. 90 -> "1m 30s", 3600 -> "1h". */
export function presetLabel(totalSeconds: number): string {
  const { hours, minutes, seconds } = splitSeconds(totalSeconds)
  const parts: string[] = []
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (seconds) parts.push(`${seconds}s`)
  return parts.join(' ') || '0s'
}

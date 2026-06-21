// Shared application types.
// Note: the project uses `erasableSyntaxOnly`, so we model enums as string
// union types + const lookup objects rather than TS `enum`s.

export type Theme = 'light' | 'dark' | 'high-contrast'

export const THEMES: Theme[] = ['light', 'dark', 'high-contrast']

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  'high-contrast': 'High Contrast',
}

export type ClockFormat = '12h' | '24h'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished'

export type StopwatchStatus = 'idle' | 'running' | 'paused'

export type TabId = 'clock' | 'timer' | 'stopwatch'

/** User preferences persisted to localStorage. */
export interface Settings {
  theme: Theme
  clockFormat: ClockFormat
  showSeconds: boolean
  showDate: boolean
  /** Last timer duration the user configured, in seconds. */
  lastTimerSeconds: number
}

/** A single recorded stopwatch lap. */
export interface Lap {
  /** 1-based lap index. */
  index: number
  /** Time for this lap alone (split), in milliseconds. */
  split: number
  /** Total elapsed time when the lap was taken, in milliseconds. */
  total: number
}

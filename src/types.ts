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
  /** User-customizable timer quick presets, in seconds (ascending). */
  timerPresets: number[]
}

/** Default timer quick presets in seconds: 5m, 15m, 30m. */
export const DEFAULT_TIMER_PRESETS: number[] = [300, 900, 1800]

/**
 * The previous default set (1m, 5m, 10m, 15m, 30m, 1h, 2h). Used only to detect
 * users who never customized their presets so we can migrate them to the new,
 * smaller default — customized sets are left untouched.
 */
export const LEGACY_DEFAULT_TIMER_PRESETS: number[] = [
  60, 300, 600, 900, 1800, 3600, 7200,
]

/** Maximum number of quick presets a user can keep. */
export const MAX_TIMER_PRESETS = 12

/** Largest allowed preset, in seconds (24 hours). */
export const MAX_PRESET_SECONDS = 24 * 3600

/** A single recorded stopwatch lap. */
export interface Lap {
  /** 1-based lap index. */
  index: number
  /** Time for this lap alone (split), in milliseconds. */
  split: number
  /** Total elapsed time when the lap was taken, in milliseconds. */
  total: number
}

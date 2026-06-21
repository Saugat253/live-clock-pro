import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { ClockFormat, Settings, Theme } from '../types'
import {
  DEFAULT_TIMER_PRESETS,
  MAX_PRESET_SECONDS,
  MAX_TIMER_PRESETS,
  THEMES,
} from '../types'
import { loadJSON, saveJSON } from '../utils/storage'

const STORAGE_KEY = 'lcp.settings.v1'

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  clockFormat: '12h',
  showSeconds: true,
  showDate: true,
  lastTimerSeconds: 5 * 60,
  timerPresets: DEFAULT_TIMER_PRESETS,
}

interface SettingsContextValue {
  settings: Settings
  setTheme: (theme: Theme) => void
  cycleTheme: () => void
  toggleDarkMode: () => void
  toggleFormat: () => void
  toggleSeconds: () => void
  toggleDate: () => void
  setLastTimerSeconds: (seconds: number) => void
  /** Add a quick preset (seconds); ignores duplicates and respects the cap. */
  addTimerPreset: (seconds: number) => void
  removeTimerPreset: (seconds: number) => void
  resetTimerPresets: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() =>
    loadJSON(STORAGE_KEY, DEFAULT_SETTINGS),
  )

  // Persist on every change.
  useEffect(() => {
    saveJSON(STORAGE_KEY, settings)
  }, [settings])

  // Reflect the active theme on <html data-theme="...">.
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme
  }, [settings.theme])

  const setTheme = useCallback(
    (theme: Theme) => setSettings((s) => ({ ...s, theme })),
    [],
  )

  const cycleTheme = useCallback(
    () =>
      setSettings((s) => {
        const i = THEMES.indexOf(s.theme)
        return { ...s, theme: THEMES[(i + 1) % THEMES.length] }
      }),
    [],
  )

  const toggleDarkMode = useCallback(
    () =>
      setSettings((s) => ({
        ...s,
        theme: s.theme === 'dark' ? 'light' : 'dark',
      })),
    [],
  )

  const toggleFormat = useCallback(
    () =>
      setSettings((s) => ({
        ...s,
        clockFormat: (s.clockFormat === '12h' ? '24h' : '12h') as ClockFormat,
      })),
    [],
  )

  const toggleSeconds = useCallback(
    () => setSettings((s) => ({ ...s, showSeconds: !s.showSeconds })),
    [],
  )

  const toggleDate = useCallback(
    () => setSettings((s) => ({ ...s, showDate: !s.showDate })),
    [],
  )

  const setLastTimerSeconds = useCallback(
    (lastTimerSeconds: number) =>
      setSettings((s) =>
        s.lastTimerSeconds === lastTimerSeconds
          ? s
          : { ...s, lastTimerSeconds },
      ),
    [],
  )

  const addTimerPreset = useCallback((seconds: number) => {
    const value = Math.round(seconds)
    if (value <= 0 || value > MAX_PRESET_SECONDS) return
    setSettings((s) => {
      if (
        s.timerPresets.includes(value) ||
        s.timerPresets.length >= MAX_TIMER_PRESETS
      ) {
        return s
      }
      return {
        ...s,
        timerPresets: [...s.timerPresets, value].sort((a, b) => a - b),
      }
    })
  }, [])

  const removeTimerPreset = useCallback((seconds: number) => {
    setSettings((s) => ({
      ...s,
      timerPresets: s.timerPresets.filter((p) => p !== seconds),
    }))
  }, [])

  const resetTimerPresets = useCallback(
    () => setSettings((s) => ({ ...s, timerPresets: DEFAULT_TIMER_PRESETS })),
    [],
  )

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      setTheme,
      cycleTheme,
      toggleDarkMode,
      toggleFormat,
      toggleSeconds,
      toggleDate,
      setLastTimerSeconds,
      addTimerPreset,
      removeTimerPreset,
      resetTimerPresets,
    }),
    [
      settings,
      setTheme,
      cycleTheme,
      toggleDarkMode,
      toggleFormat,
      toggleSeconds,
      toggleDate,
      setLastTimerSeconds,
      addTimerPreset,
      removeTimerPreset,
      resetTimerPresets,
    ],
  )

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider')
  return ctx
}

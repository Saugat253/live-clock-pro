import { useSettings } from '../../context/SettingsContext'
import { THEMES, THEME_LABELS } from '../../types'
import type { Theme } from '../../types'
import { ContrastIcon, MoonIcon, SunIcon } from '../ui/icons'

const ICONS: Record<Theme, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  'high-contrast': ContrastIcon,
}

export function ThemeSwitcher() {
  const { settings, setTheme } = useSettings()

  return (
    <div
      role="group"
      aria-label="Color theme"
      className="inline-flex items-center gap-1 rounded-xl border border-line bg-surface p-1"
    >
      {THEMES.map((theme) => {
        const ThemeIcon = ICONS[theme]
        const active = settings.theme === theme
        return (
          <button
            key={theme}
            type="button"
            onClick={() => setTheme(theme)}
            aria-pressed={active}
            aria-label={`${THEME_LABELS[theme]} theme`}
            title={`${THEME_LABELS[theme]} theme`}
            className={`rounded-lg p-2 transition-colors ${
              active
                ? 'bg-accent text-on-accent'
                : 'text-muted hover:bg-surface-2 hover:text-fg'
            }`}
          >
            <ThemeIcon />
          </button>
        )
      })}
    </div>
  )
}

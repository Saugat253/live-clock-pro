import { useSettings } from '../../context/SettingsContext'
import { useClock } from '../../hooks/useClock'
import { ClockDisplay } from './ClockDisplay'

interface FullscreenClockProps {
  onExit: () => void
}

/**
 * A CSS full-viewport overlay showing only the time and date, sized to be
 * readable from a distance. Native fullscreen is handled by the parent; this
 * works even if the browser denies the Fullscreen API.
 */
export function FullscreenClock({ onExit }: FullscreenClockProps) {
  const now = useClock()
  const { settings } = useSettings()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base p-6">
      <button
        type="button"
        onClick={onExit}
        className="absolute right-5 top-5 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
      >
        Exit (Esc)
      </button>
      <ClockDisplay
        date={now}
        format={settings.clockFormat}
        showSeconds={settings.showSeconds}
        showDate={settings.showDate}
        size="fullscreen"
      />
    </div>
  )
}

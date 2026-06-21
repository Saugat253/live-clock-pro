import { useSettings } from '../../context/SettingsContext'
import { useClock } from '../../hooks/useClock'
import type { TabId } from '../../types'
import { ClockDisplay } from '../Clock/ClockDisplay'
import { Stopwatch } from '../Stopwatch/Stopwatch'
import { Timer } from '../Timer/Timer'

interface FullscreenViewProps {
  tab: TabId
  onExit: () => void
}

function FullscreenClockContent() {
  const now = useClock()
  const { settings } = useSettings()
  return (
    <ClockDisplay
      date={now}
      format={settings.clockFormat}
      showSeconds={settings.showSeconds}
      showDate={settings.showDate}
      size="fullscreen"
    />
  )
}

/**
 * A full-viewport overlay that shows the active tab's content enlarged and
 * distraction-free. Native fullscreen is handled by the parent; this works
 * even where the Fullscreen API is unavailable.
 */
export function FullscreenView({ tab, onExit }: FullscreenViewProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 overflow-y-auto bg-base p-6">
      <button
        type="button"
        onClick={onExit}
        className="absolute right-5 top-5 z-10 rounded-xl border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-fg"
      >
        Exit (Esc)
      </button>

      {tab === 'clock' && <FullscreenClockContent />}
      {tab === 'timer' && <Timer fullscreen />}
      {tab === 'stopwatch' && <Stopwatch fullscreen />}
    </div>
  )
}

import { useSettings } from '../../context/SettingsContext'
import { useClock } from '../../hooks/useClock'
import { Button } from '../ui/Button'
import { ExpandIcon } from '../ui/icons'
import { ClockDisplay } from './ClockDisplay'

interface ClockProps {
  onFullscreen: () => void
}

export function Clock({ onFullscreen }: ClockProps) {
  const now = useClock()
  const { settings, toggleFormat, toggleSeconds, toggleDate } = useSettings()

  return (
    <section className="flex flex-col items-center gap-10">
      <div className="flex w-full items-center justify-center rounded-3xl border border-line bg-surface px-6 py-14 shadow-sm sm:py-20">
        <ClockDisplay
          date={now}
          format={settings.clockFormat}
          showSeconds={settings.showSeconds}
          showDate={settings.showDate}
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={toggleFormat} aria-label="Toggle 12 or 24 hour format">
          {settings.clockFormat === '12h' ? '12-Hour' : '24-Hour'}
        </Button>
        <Button onClick={toggleSeconds} aria-pressed={settings.showSeconds}>
          Seconds: {settings.showSeconds ? 'On' : 'Off'}
        </Button>
        <Button onClick={toggleDate} aria-pressed={settings.showDate}>
          Date: {settings.showDate ? 'On' : 'Off'}
        </Button>
        <Button variant="primary" onClick={onFullscreen}>
          <ExpandIcon />
          Full Screen
        </Button>
      </div>
    </section>
  )
}

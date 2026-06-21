import { useStopwatchContext } from '../../context/StopwatchContext'
import { exportLapsCSV, exportLapsTXT } from '../../utils/export'
import { formatStopwatch } from '../../utils/time'
import { Button } from '../ui/Button'
import {
  DownloadIcon,
  FlagIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
} from '../ui/icons'
import { LapList } from './LapList'

export function Stopwatch() {
  const sw = useStopwatchContext()
  const isIdle = sw.status === 'idle'
  const isRunning = sw.status === 'running'
  const isPaused = sw.status === 'paused'

  const [main, ms] = formatStopwatch(sw.elapsedMs).split('.')
  const hasLaps = sw.laps.length > 0

  return (
    <section className="flex flex-col items-center gap-9">
      <div
        role="timer"
        aria-label="Stopwatch"
        className="flex w-full items-baseline justify-center rounded-3xl border border-line bg-surface px-6 py-12 shadow-sm sm:py-16"
      >
        <span className="tabular text-[clamp(2.75rem,12vw,7rem)] font-bold leading-none text-clock">
          {main}
        </span>
        <span className="tabular text-[clamp(1.25rem,5vw,3rem)] font-semibold text-muted">
          .{ms}
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isIdle && (
          <Button variant="primary" size="lg" onClick={sw.start}>
            <PlayIcon />
            Start
          </Button>
        )}

        {isRunning && (
          <>
            <Button variant="primary" size="lg" onClick={sw.pause}>
              <PauseIcon />
              Pause
            </Button>
            <Button size="lg" onClick={sw.lap}>
              <FlagIcon />
              Lap
            </Button>
          </>
        )}

        {isPaused && (
          <>
            <Button variant="primary" size="lg" onClick={sw.resume}>
              <PlayIcon />
              Resume
            </Button>
            <Button size="lg" onClick={sw.lap}>
              <FlagIcon />
              Lap
            </Button>
          </>
        )}

        {!isIdle && (
          <Button variant="danger" size="lg" onClick={sw.reset}>
            <ResetIcon />
            Reset
          </Button>
        )}
      </div>

      <div className="w-full max-w-md">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Laps
          </h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => exportLapsCSV(sw.laps)}
              disabled={!hasLaps}
            >
              <DownloadIcon />
              CSV
            </Button>
            <Button
              size="sm"
              onClick={() => exportLapsTXT(sw.laps)}
              disabled={!hasLaps}
            >
              <DownloadIcon />
              TXT
            </Button>
          </div>
        </div>
        <LapList laps={sw.laps} />
      </div>
    </section>
  )
}

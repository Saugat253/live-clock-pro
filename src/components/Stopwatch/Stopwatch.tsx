import { useStopwatchContext } from '../../context/StopwatchContext'
import { exportLapsCSV, exportLapsTXT } from '../../utils/export'
import { formatStopwatch } from '../../utils/time'
import { Button } from '../ui/Button'
import {
  DownloadIcon,
  ExpandIcon,
  FlagIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
} from '../ui/icons'
import { LapList } from './LapList'

interface StopwatchProps {
  /** Render the large, distraction-free full-screen layout. */
  fullscreen?: boolean
  /** Enter full-screen mode (shown only in the normal layout). */
  onFullscreen?: () => void
}

export function Stopwatch({ fullscreen = false, onFullscreen }: StopwatchProps) {
  const sw = useStopwatchContext()
  const isIdle = sw.status === 'idle'
  const isRunning = sw.status === 'running'
  const isPaused = sw.status === 'paused'

  const [main, ms] = formatStopwatch(sw.elapsedMs).split('.')
  const hasLaps = sw.laps.length > 0

  const mainClass = fullscreen
    ? 'text-[clamp(3rem,15vw,13rem)]'
    : 'text-[clamp(2.75rem,12vw,7rem)]'
  const msClass = fullscreen
    ? 'text-[clamp(1.5rem,6vw,5rem)]'
    : 'text-[clamp(1.25rem,5vw,3rem)]'

  return (
    <section className="flex flex-col items-center gap-9">
      <div
        role="timer"
        aria-label="Stopwatch"
        className={
          fullscreen
            ? 'flex w-full items-baseline justify-center'
            : 'flex w-full items-baseline justify-center rounded-3xl border border-line bg-surface px-6 py-12 shadow-sm sm:py-16'
        }
      >
        <span className={`tabular font-bold leading-none text-clock ${mainClass}`}>
          {main}
        </span>
        <span className={`tabular font-semibold text-muted ${msClass}`}>.{ms}</span>
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

      {/* Laps, export and full-screen — hidden in the full-screen layout. */}
      {!fullscreen && (
        <>
          {onFullscreen && (
            <Button onClick={onFullscreen}>
              <ExpandIcon />
              Full Screen
            </Button>
          )}

          <div className="w-full max-w-md">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                Laps
              </h2>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => exportLapsCSV(sw.laps)} disabled={!hasLaps}>
                  <DownloadIcon />
                  CSV
                </Button>
                <Button size="sm" onClick={() => exportLapsTXT(sw.laps)} disabled={!hasLaps}>
                  <DownloadIcon />
                  TXT
                </Button>
              </div>
            </div>
            <LapList laps={sw.laps} />
          </div>
        </>
      )}
    </section>
  )
}

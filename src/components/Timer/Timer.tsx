import { useState } from 'react'
import { useTimerContext } from '../../context/TimerContext'
import { unlockAudio } from '../../services/audio'
import {
  notificationPermission,
  notificationsSupported,
  requestNotificationPermission,
} from '../../services/notifications'
import { formatCountdown } from '../../utils/time'
import { Button } from '../ui/Button'
import {
  BellIcon,
  ExpandIcon,
  PauseIcon,
  PlayIcon,
  ResetIcon,
  StopIcon,
} from '../ui/icons'
import { PresetButtons } from './PresetButtons'
import { ProgressRing } from './ProgressRing'
import { TimerInput } from './TimerInput'

interface TimerProps {
  /** Render the large, distraction-free full-screen layout. */
  fullscreen?: boolean
  /** Enter full-screen mode (shown only in the normal layout). */
  onFullscreen?: () => void
}

export function Timer({ fullscreen = false, onFullscreen }: TimerProps) {
  const timer = useTimerContext()
  const { status } = timer
  const isIdle = status === 'idle'
  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isFinished = status === 'finished'

  const [permission, setPermission] = useState<NotificationPermission>(() =>
    notificationPermission(),
  )

  const startWith = (seconds: number) => {
    unlockAudio()
    timer.start(seconds)
  }

  const enableNotifications = async () => {
    setPermission(await requestNotificationPermission())
  }

  const displayMs = isIdle ? timer.durationMs : timer.remainingMs
  const hasHours = displayMs >= 3_600_000
  const percentLeft = Math.round(timer.progress * 100)

  // Size the countdown text to the ring and the value's length so that
  // HH:MM:SS stays roomy instead of cramped.
  const countdownClass = fullscreen
    ? hasHours
      ? 'text-[clamp(2.5rem,11vw,9rem)]'
      : 'text-[clamp(3.5rem,15vw,12rem)]'
    : hasHours
      ? 'text-4xl sm:text-5xl md:text-6xl'
      : 'text-6xl sm:text-7xl'
  const timesUpClass = fullscreen
    ? 'text-[clamp(2.5rem,9vw,8rem)]'
    : 'text-3xl sm:text-4xl'
  const subTextClass = fullscreen ? 'text-base sm:text-xl' : 'text-sm'

  return (
    <section className="flex flex-col items-center gap-9">
      <ProgressRing progress={isIdle ? 1 : timer.progress} size={fullscreen ? 'lg' : 'md'}>
        <div className="flex flex-col items-center gap-1.5">
          {isFinished ? (
            <span role="alert" className={`font-extrabold text-accent ${timesUpClass}`}>
              Time&apos;s Up!
            </span>
          ) : (
            <>
              <span className={`tabular font-bold leading-none text-clock ${countdownClass}`}>
                {formatCountdown(displayMs)}
              </span>
              {(isRunning || isPaused) && (
                <span className={`font-medium text-muted ${subTextClass}`}>
                  {percentLeft}% left
                </span>
              )}
              {isIdle && (
                <span className={`font-medium text-muted ${subTextClass}`}>ready</span>
              )}
            </>
          )}
        </div>
      </ProgressRing>

      {/* Controls — vary by status. */}
      <div className="flex min-h-[3.5rem] flex-wrap items-center justify-center gap-3">
        {isIdle && (
          <TimerInput
            durationSeconds={Math.round(timer.durationMs / 1000)}
            onStart={startWith}
          />
        )}

        {isRunning && (
          <>
            <Button variant="primary" size="lg" onClick={timer.pause}>
              <PauseIcon />
              Pause
            </Button>
            <Button size="lg" onClick={timer.reset}>
              <ResetIcon />
              Reset
            </Button>
            <Button variant="danger" size="lg" onClick={timer.stop}>
              <StopIcon />
              Stop
            </Button>
          </>
        )}

        {isPaused && (
          <>
            <Button variant="primary" size="lg" onClick={timer.resume}>
              <PlayIcon />
              Resume
            </Button>
            <Button size="lg" onClick={timer.reset}>
              <ResetIcon />
              Reset
            </Button>
            <Button variant="danger" size="lg" onClick={timer.stop}>
              <StopIcon />
              Stop
            </Button>
          </>
        )}

        {isFinished && (
          <Button variant="primary" size="lg" onClick={timer.reset}>
            <ResetIcon />
            Reset
          </Button>
        )}
      </div>

      {/* Extras — hidden in the distraction-free full-screen layout. */}
      {!fullscreen && (
        <>
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-muted">Quick presets</p>
            <PresetButtons onSelect={startWith} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {onFullscreen && (
              <Button onClick={onFullscreen}>
                <ExpandIcon />
                Full Screen
              </Button>
            )}
            {notificationsSupported() && permission === 'default' && (
              <Button variant="ghost" onClick={enableNotifications}>
                <BellIcon />
                Enable completion notifications
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  )
}

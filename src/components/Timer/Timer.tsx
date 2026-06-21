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
  PauseIcon,
  PlayIcon,
  ResetIcon,
  StopIcon,
} from '../ui/icons'
import { PresetButtons } from './PresetButtons'
import { ProgressRing } from './ProgressRing'
import { TimerInput } from './TimerInput'

export function Timer() {
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
    // Unlock audio inside the user gesture so the completion tone can play.
    unlockAudio()
    timer.start(seconds)
  }

  const enableNotifications = async () => {
    setPermission(await requestNotificationPermission())
  }

  const displayMs = isIdle ? timer.durationMs : timer.remainingMs
  const percentLeft = Math.round(timer.progress * 100)

  return (
    <section className="flex flex-col items-center gap-10">
      <ProgressRing progress={isIdle ? 1 : timer.progress}>
        <div className="flex flex-col items-center gap-1">
          {isFinished ? (
            <span
              role="alert"
              className="text-3xl font-extrabold text-accent sm:text-4xl"
            >
              Time&apos;s Up!
            </span>
          ) : (
            <>
              <span className="tabular text-5xl font-bold text-clock sm:text-6xl">
                {formatCountdown(displayMs)}
              </span>
              {(isRunning || isPaused) && (
                <span className="text-sm font-medium text-muted">
                  {percentLeft}% left
                </span>
              )}
              {isIdle && (
                <span className="text-sm font-medium text-muted">
                  ready
                </span>
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

      <div className="flex flex-col items-center gap-4">
        <p className="text-sm font-medium text-muted">Quick presets</p>
        <PresetButtons onSelect={startWith} />
      </div>

      {notificationsSupported() && permission === 'default' && (
        <Button variant="ghost" size="sm" onClick={enableNotifications}>
          <BellIcon />
          Enable completion notifications
        </Button>
      )}
    </section>
  )
}

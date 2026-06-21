import { useTimerContext } from '../../context/TimerContext'
import { Button } from '../ui/Button'

/**
 * Full-screen flashing overlay shown when the countdown reaches zero.
 * Rendered at the app root so it appears regardless of the active tab.
 */
export function TimerAlert() {
  const { alerting, dismissAlert } = useTimerContext()
  if (!alerting) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Static dim backdrop. */}
      <div aria-hidden="true" className="absolute inset-0 bg-base/75" />
      {/* Flash layer — flashes a few times then fades out. */}
      <div
        aria-hidden="true"
        className="animate-flash pointer-events-none absolute inset-0 bg-accent"
      />
      <div
        role="alertdialog"
        aria-label="Timer finished"
        className="relative mx-4 flex flex-col items-center gap-5 rounded-3xl border border-line bg-surface px-10 py-9 text-center shadow-2xl"
      >
        <span className="text-5xl font-extrabold text-accent sm:text-6xl">
          Time&apos;s Up!
        </span>
        <p className="text-muted">Your countdown timer has finished.</p>
        <Button variant="primary" size="lg" onClick={dismissAlert} autoFocus>
          Dismiss
        </Button>
      </div>
    </div>
  )
}

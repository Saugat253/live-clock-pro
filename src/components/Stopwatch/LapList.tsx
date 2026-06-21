import type { Lap } from '../../types'
import { formatStopwatch } from '../../utils/time'

interface LapListProps {
  laps: Lap[]
}

export function LapList({ laps }: LapListProps) {
  if (laps.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted">
        No laps recorded yet.
      </p>
    )
  }

  // Highlight fastest / slowest splits once there is something to compare.
  const splits = laps.map((l) => l.split)
  const fastest = Math.min(...splits)
  const slowest = Math.max(...splits)
  const compare = laps.length > 1

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-line">
      <div className="grid grid-cols-3 gap-2 border-b border-line bg-surface-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
        <span>Lap</span>
        <span className="text-right">Lap time</span>
        <span className="text-right">Total</span>
      </div>
      <ul className="max-h-72 overflow-y-auto">
        {[...laps].reverse().map((lap) => {
          const splitColor =
            compare && lap.split === fastest
              ? 'text-success'
              : compare && lap.split === slowest
                ? 'text-danger'
                : 'text-fg'
          return (
            <li
              key={lap.index}
              className="grid grid-cols-3 gap-2 border-b border-line px-4 py-2.5 text-sm last:border-b-0"
            >
              <span className="font-medium text-muted">Lap {lap.index}</span>
              <span className={`tabular text-right font-semibold ${splitColor}`}>
                {formatStopwatch(lap.split)}
              </span>
              <span className="tabular text-right text-muted">
                {formatStopwatch(lap.total)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

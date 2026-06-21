import type { ClockFormat } from '../../types'
import { formatClock, formatLongDate } from '../../utils/time'

interface ClockDisplayProps {
  date: Date
  format: ClockFormat
  showSeconds: boolean
  showDate: boolean
  /** `fullscreen` uses much larger, viewport-relative type. */
  size?: 'normal' | 'fullscreen'
}

export function ClockDisplay({
  date,
  format,
  showSeconds,
  showDate,
  size = 'normal',
}: ClockDisplayProps) {
  const { time, meridiem } = formatClock(date, format, showSeconds)

  const timeSize =
    size === 'fullscreen'
      ? 'text-[clamp(3rem,18vw,17rem)]'
      : 'text-[clamp(2.75rem,13vw,8rem)]'
  const meridiemSize =
    size === 'fullscreen'
      ? 'text-[clamp(1.25rem,4vw,4rem)]'
      : 'text-[clamp(1rem,3vw,2rem)]'
  const dateSize =
    size === 'fullscreen'
      ? 'mt-6 text-[clamp(1rem,3.5vw,2.5rem)]'
      : 'mt-3 text-[clamp(0.9rem,2.5vw,1.5rem)]'

  return (
    <div
      role="timer"
      aria-label={`Current time ${time}${meridiem ? ` ${meridiem}` : ''}${
        showDate ? `, ${formatLongDate(date)}` : ''
      }`}
      className="flex flex-col items-center text-center"
    >
      <div className="flex items-baseline justify-center gap-2 sm:gap-4">
        <span className={`tabular font-bold leading-none text-clock ${timeSize}`}>
          {time}
        </span>
        {meridiem && (
          <span className={`font-semibold text-muted ${meridiemSize}`}>
            {meridiem}
          </span>
        )}
      </div>
      {showDate && (
        <p className={`font-medium text-muted ${dateSize}`}>
          {formatLongDate(date)}
        </p>
      )}
    </div>
  )
}

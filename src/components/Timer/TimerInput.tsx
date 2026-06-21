import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { splitSeconds } from '../../utils/time'
import { Button } from '../ui/Button'
import { PlayIcon } from '../ui/icons'

interface TimerInputProps {
  durationSeconds: number
  onStart: (totalSeconds: number) => void
}

const FIELDS = [
  { key: 'hours', label: 'Hours', max: 99 },
  { key: 'minutes', label: 'Minutes', max: 59 },
  { key: 'seconds', label: 'Seconds', max: 59 },
] as const

export function TimerInput({ durationSeconds, onStart }: TimerInputProps) {
  const initial = splitSeconds(durationSeconds)
  const [values, setValues] = useState(initial)

  // Keep the inputs in sync if the configured duration changes externally.
  useEffect(() => {
    setValues(splitSeconds(durationSeconds))
  }, [durationSeconds])

  const total = values.hours * 3600 + values.minutes * 60 + values.seconds

  const update = (key: (typeof FIELDS)[number]['key'], raw: string, max: number) => {
    const n = Number.parseInt(raw, 10)
    const clamped = Number.isNaN(n) ? 0 : Math.max(0, Math.min(n, max))
    setValues((v) => ({ ...v, [key]: clamped }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (total > 0) onStart(total)
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col items-center gap-5"
      aria-label="Custom timer"
    >
      <div className="flex items-end justify-center gap-3">
        {FIELDS.map(({ key, label, max }, i) => (
          <div key={key} className="flex items-end gap-3">
            <label className="flex flex-col items-center gap-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                {label}
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={max}
                value={values[key]}
                onChange={(e) => update(key, e.target.value, max)}
                onFocus={(e) => e.target.select()}
                className="tabular w-20 rounded-xl border border-line bg-surface-2 py-3 text-center text-2xl font-bold text-fg focus-visible:outline-none sm:w-24 sm:text-3xl"
              />
            </label>
            {i < FIELDS.length - 1 && (
              <span aria-hidden="true" className="pb-3 text-2xl font-bold text-muted">
                :
              </span>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={total <= 0}>
        <PlayIcon />
        Start
      </Button>
    </form>
  )
}

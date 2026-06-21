import { useState } from 'react'
import type { FormEvent } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { MAX_PRESET_SECONDS, MAX_TIMER_PRESETS } from '../../types'
import { presetLabel } from '../../utils/time'
import { Button } from '../ui/Button'
import { CloseIcon, PlusIcon } from '../ui/icons'

interface PresetButtonsProps {
  onSelect: (seconds: number) => void
}

const clampInt = (raw: string, max: number): number => {
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.min(n, max)
}

export function PresetButtons({ onSelect }: PresetButtonsProps) {
  const { settings, addTimerPreset, removeTimerPreset, resetTimerPresets } =
    useSettings()
  const presets = settings.timerPresets

  const [hours, setHours] = useState('')
  const [minutes, setMinutes] = useState('')

  const atCapacity = presets.length >= MAX_TIMER_PRESETS
  const totalSeconds = clampInt(hours, 24) * 3600 + clampInt(minutes, 59) * 60
  const valid = totalSeconds > 0 && totalSeconds <= MAX_PRESET_SECONDS

  const handleAdd = (e: FormEvent) => {
    e.preventDefault()
    if (!valid || atCapacity) return
    addTimerPreset(totalSeconds)
    setHours('')
    setMinutes('')
  }

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-4">
      {/* Preset chips: tap the label to start, the × to remove. */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {presets.length === 0 ? (
          <span className="text-sm text-muted">No presets — add one below.</span>
        ) : (
          presets.map((seconds) => (
            <div
              key={seconds}
              className="inline-flex items-center rounded-full border border-line bg-surface transition-colors hover:border-accent"
            >
              <button
                type="button"
                onClick={() => onSelect(seconds)}
                className="py-2 pl-4 pr-2 text-sm font-medium text-fg hover:text-accent"
              >
                {presetLabel(seconds)}
              </button>
              <button
                type="button"
                onClick={() => removeTimerPreset(seconds)}
                aria-label={`Remove ${presetLabel(seconds)} preset`}
                className="rounded-full py-2 pl-1 pr-3 text-muted hover:text-danger"
              >
                <CloseIcon width={14} height={14} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add a custom preset combining hours and minutes (e.g. 2h 30m). */}
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-end justify-center gap-2"
        aria-label="Add a custom preset"
      >
        <label className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Hours
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={24}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="0"
            disabled={atCapacity}
            className="tabular w-20 rounded-xl border border-line bg-surface-2 px-3 py-2 text-center text-sm text-fg focus-visible:outline-none disabled:opacity-40"
          />
        </label>
        <span aria-hidden="true" className="pb-2 text-lg font-bold text-muted">
          :
        </span>
        <label className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Minutes
          </span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="0"
            disabled={atCapacity}
            className="tabular w-20 rounded-xl border border-line bg-surface-2 px-3 py-2 text-center text-sm text-fg focus-visible:outline-none disabled:opacity-40"
          />
        </label>
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!valid || atCapacity}
        >
          <PlusIcon width={16} height={16} />
          Add
        </Button>
      </form>

      <div className="flex h-4 items-center text-xs text-muted">
        {atCapacity ? (
          <span>Maximum of {MAX_TIMER_PRESETS} presets reached.</span>
        ) : (
          <button
            type="button"
            onClick={resetTimerPresets}
            className="underline-offset-2 hover:text-fg hover:underline"
          >
            Restore default presets
          </button>
        )}
      </div>
    </div>
  )
}

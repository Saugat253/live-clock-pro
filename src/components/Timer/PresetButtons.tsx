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

type Unit = 'minutes' | 'hours'

export function PresetButtons({ onSelect }: PresetButtonsProps) {
  const { settings, addTimerPreset, removeTimerPreset, resetTimerPresets } =
    useSettings()
  const presets = settings.timerPresets

  const [value, setValue] = useState('')
  const [unit, setUnit] = useState<Unit>('minutes')

  const atCapacity = presets.length >= MAX_TIMER_PRESETS
  const parsed = Number.parseInt(value, 10)
  const validAmount = Number.isFinite(parsed) && parsed > 0

  const handleAdd = (e: FormEvent) => {
    e.preventDefault()
    if (!validAmount) return
    const seconds = unit === 'hours' ? parsed * 3600 : parsed * 60
    addTimerPreset(Math.min(seconds, MAX_PRESET_SECONDS))
    setValue('')
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

      {/* Add a custom preset in minutes or hours. */}
      <form
        onSubmit={handleAdd}
        className="flex flex-wrap items-center justify-center gap-2"
        aria-label="Add a custom preset"
      >
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={unit === 'hours' ? 24 : 1440}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 45"
          aria-label="Preset amount"
          disabled={atCapacity}
          className="tabular w-24 rounded-xl border border-line bg-surface-2 px-3 py-2 text-center text-sm text-fg focus-visible:outline-none disabled:opacity-40"
        />
        <div
          role="group"
          aria-label="Unit"
          className="inline-flex rounded-xl border border-line bg-surface p-1"
        >
          {(['minutes', 'hours'] as Unit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              aria-pressed={unit === u}
              disabled={atCapacity}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40 ${
                unit === u
                  ? 'bg-accent text-on-accent'
                  : 'text-muted hover:text-fg'
              }`}
            >
              {u === 'minutes' ? 'Min' : 'Hr'}
            </button>
          ))}
        </div>
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!validAmount || atCapacity}
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

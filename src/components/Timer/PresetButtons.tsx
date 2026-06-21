import { presetLabel } from '../../utils/time'

const PRESETS_SECONDS = [60, 300, 600, 900, 1800, 3600, 7200]

interface PresetButtonsProps {
  onSelect: (seconds: number) => void
}

export function PresetButtons({ onSelect }: PresetButtonsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {PRESETS_SECONDS.map((seconds) => (
        <button
          key={seconds}
          type="button"
          onClick={() => onSelect(seconds)}
          className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
        >
          {presetLabel(seconds)}
        </button>
      ))}
    </div>
  )
}

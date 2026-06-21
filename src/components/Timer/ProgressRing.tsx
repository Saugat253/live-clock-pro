import type { CSSProperties, ReactNode } from 'react'

interface ProgressRingProps {
  /** Fraction filled, 0..1. */
  progress: number
  /** `md` for the page, `lg` for full-screen mode. */
  size?: 'md' | 'lg'
  children: ReactNode
}

const RADIUS = 130
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const MD_CLASS = 'h-72 w-72 sm:h-80 sm:w-80 md:h-[23rem] md:w-[23rem]'

// Full-screen ring size, constrained by BOTH viewport width and height (so it
// fits short laptop screens) and capped. Exposed as `--ring-size` so the
// centered content can scale to the circle rather than to the raw viewport.
const LG_RING = 'min(82vw, 58vh, 34rem)'

export function ProgressRing({ progress, size = 'md', children }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress))
  const offset = CIRCUMFERENCE * (1 - clamped)

  const lgStyle = {
    '--ring-size': LG_RING,
    width: 'var(--ring-size)',
    height: 'var(--ring-size)',
  } as CSSProperties

  return (
    <div
      className={`relative grid place-items-center ${size === 'md' ? MD_CLASS : ''}`}
      style={size === 'lg' ? lgStyle : undefined}
    >
      <svg viewBox="0 0 300 300" className="h-full w-full -rotate-90">
        <circle
          cx="150"
          cy="150"
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          className="stroke-surface-2"
        />
        <circle
          cx="150"
          cy="150"
          r={RADIUS}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="stroke-accent transition-[stroke-dashoffset] duration-200 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center px-4">{children}</div>
    </div>
  )
}

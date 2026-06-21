import type { ReactNode } from 'react'

interface ProgressRingProps {
  /** Fraction filled, 0..1. */
  progress: number
  children: ReactNode
}

const RADIUS = 130
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ProgressRing({ progress, children }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress))
  const offset = CIRCUMFERENCE * (1 - clamped)

  return (
    <div className="relative grid h-64 w-64 place-items-center sm:h-72 sm:w-72">
      <svg viewBox="0 0 300 300" className="h-full w-full -rotate-90">
        <circle
          cx="150"
          cy="150"
          r={RADIUS}
          fill="none"
          strokeWidth="14"
          className="stroke-surface-2"
        />
        <circle
          cx="150"
          cy="150"
          r={RADIUS}
          fill="none"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className="stroke-accent transition-[stroke-dashoffset] duration-200 ease-linear"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

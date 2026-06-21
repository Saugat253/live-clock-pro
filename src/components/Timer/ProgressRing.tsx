import type { ReactNode } from 'react'

interface ProgressRingProps {
  /** Fraction filled, 0..1. */
  progress: number
  /** `md` for the page, `lg` for full-screen mode. */
  size?: 'md' | 'lg'
  children: ReactNode
}

const RADIUS = 130
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const SIZE_CLASSES: Record<'md' | 'lg', string> = {
  md: 'h-72 w-72 sm:h-80 sm:w-80 md:h-[23rem] md:w-[23rem]',
  lg: 'h-[min(80vw,60vh)] w-[min(80vw,60vh)] max-h-[36rem] max-w-[36rem]',
}

export function ProgressRing({ progress, size = 'md', children }: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress))
  const offset = CIRCUMFERENCE * (1 - clamped)

  return (
    <div className={`relative grid place-items-center ${SIZE_CLASSES[size]}`}>
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
      <div className="absolute inset-0 grid place-items-center px-6">{children}</div>
    </div>
  )
}

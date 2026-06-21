import { Clock } from '../components/Clock/Clock'

interface ClockPageProps {
  onFullscreen: () => void
}

export function ClockPage({ onFullscreen }: ClockPageProps) {
  return <Clock onFullscreen={onFullscreen} />
}

import { Timer } from '../components/Timer/Timer'

interface TimerPageProps {
  onFullscreen: () => void
}

export function TimerPage({ onFullscreen }: TimerPageProps) {
  return <Timer onFullscreen={onFullscreen} />
}

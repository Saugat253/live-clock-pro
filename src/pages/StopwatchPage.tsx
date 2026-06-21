import { Stopwatch } from '../components/Stopwatch/Stopwatch'

interface StopwatchPageProps {
  onFullscreen: () => void
}

export function StopwatchPage({ onFullscreen }: StopwatchPageProps) {
  return <Stopwatch onFullscreen={onFullscreen} />
}

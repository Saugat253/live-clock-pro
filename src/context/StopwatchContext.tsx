import { createContext, useCallback, useContext } from 'react'
import type { ReactNode } from 'react'
import { useStopwatch } from '../hooks/useStopwatch'
import type { StopwatchApi } from '../hooks/useStopwatch'

interface StopwatchContextValue extends StopwatchApi {
  /** Keyboard convenience: start / pause / resume depending on state. */
  toggle: () => void
}

const StopwatchContext = createContext<StopwatchContextValue | null>(null)

export function StopwatchProvider({ children }: { children: ReactNode }) {
  const sw = useStopwatch()

  const toggle = useCallback(() => {
    if (sw.status === 'idle') sw.start()
    else if (sw.status === 'running') sw.pause()
    else sw.resume()
  }, [sw])

  const value: StopwatchContextValue = { ...sw, toggle }

  return (
    <StopwatchContext.Provider value={value}>
      {children}
    </StopwatchContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStopwatchContext(): StopwatchContextValue {
  const ctx = useContext(StopwatchContext)
  if (!ctx)
    throw new Error('useStopwatchContext must be used within a StopwatchProvider')
  return ctx
}

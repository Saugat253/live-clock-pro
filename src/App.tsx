import { useCallback, useEffect, useRef, useState } from 'react'
import { Header } from './components/Header/Header'
import { FullscreenView } from './components/Fullscreen/FullscreenView'
import { KeyboardShortcuts } from './components/KeyboardShortcuts/KeyboardShortcuts'
import { TimerAlert } from './components/Timer/TimerAlert'
import { CopyrightIcon } from './components/ui/icons'
import { SettingsProvider } from './context/SettingsContext'
import { StopwatchProvider } from './context/StopwatchContext'
import { TimerProvider } from './context/TimerContext'
import { useFullscreen } from './hooks/useFullscreen'
import { ClockPage } from './pages/ClockPage'
import { StopwatchPage } from './pages/StopwatchPage'
import { TimerPage } from './pages/TimerPage'
import type { TabId } from './types'

function AppShell() {
  const [tab, setTab] = useState<TabId>('clock')
  const [fullscreen, setFullscreen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const getRoot = useCallback(() => rootRef.current, [])
  const { isFullscreen, enter, exit } = useFullscreen(getRoot)

  const openFullscreen = useCallback(() => {
    setFullscreen(true)
    void enter()
  }, [enter])

  const closeFullscreen = useCallback(() => {
    setFullscreen(false)
    void exit()
  }, [exit])

  const toggleFullscreen = useCallback(() => {
    setFullscreen((open) => {
      if (open) void exit()
      else void enter()
      return !open
    })
  }, [enter, exit])

  // If native fullscreen ends (Esc / F11 / browser UI), close the overlay too.
  useEffect(() => {
    if (!isFullscreen) setFullscreen(false)
  }, [isFullscreen])

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col bg-base text-fg">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to content
      </a>

      <Header activeTab={tab} onTabChange={setTab} />

      <main
        id="main-content"
        role="tabpanel"
        aria-label={`${tab} panel`}
        tabIndex={-1}
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 focus-visible:outline-none sm:py-16"
      >
        {tab === 'clock' && <ClockPage onFullscreen={openFullscreen} />}
        {tab === 'timer' && <TimerPage onFullscreen={openFullscreen} />}
        {tab === 'stopwatch' && <StopwatchPage onFullscreen={openFullscreen} />}
      </main>

      <footer className="border-t border-line px-4 py-5 text-center text-xs text-muted">
        <p className="flex flex-wrap items-center justify-center gap-1.5 font-medium text-fg">
          <CopyrightIcon width={14} height={14} aria-hidden="true" />
          <span>{new Date().getFullYear()} Live Clock Pro · by Saugat253</span>
        </p>
        <p className="mt-1.5">
          Shortcuts: <kbd className="font-mono">Space</kbd> timer ·{' '}
          <kbd className="font-mono">S</kbd> stopwatch ·{' '}
          <kbd className="font-mono">L</kbd> lap ·{' '}
          <kbd className="font-mono">F</kbd> full screen ·{' '}
          <kbd className="font-mono">D</kbd> dark mode
        </p>
      </footer>

      {fullscreen && <FullscreenView tab={tab} onExit={closeFullscreen} />}
      <TimerAlert />
      <KeyboardShortcuts
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        onExitFullscreen={closeFullscreen}
      />
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <TimerProvider>
        <StopwatchProvider>
          <AppShell />
        </StopwatchProvider>
      </TimerProvider>
    </SettingsProvider>
  )
}

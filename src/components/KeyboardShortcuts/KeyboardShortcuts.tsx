import { useEffect, useRef } from 'react'
import { useSettings } from '../../context/SettingsContext'
import { useStopwatchContext } from '../../context/StopwatchContext'
import { useTimerContext } from '../../context/TimerContext'

interface KeyboardShortcutsProps {
  fullscreen: boolean
  onToggleFullscreen: () => void
  onExitFullscreen: () => void
}

function isTypingTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  )
}

/**
 * Global keyboard shortcuts (renders nothing):
 *   Space start/pause timer · R reset timer · S start/pause stopwatch ·
 *   L save lap · F full screen · D toggle dark mode · Esc exit full screen.
 * The listener binds once; the latest handlers are read through a ref.
 */
export function KeyboardShortcuts({
  fullscreen,
  onToggleFullscreen,
  onExitFullscreen,
}: KeyboardShortcutsProps) {
  const { toggleDarkMode } = useSettings()
  const timer = useTimerContext()
  const stopwatch = useStopwatchContext()

  const ref = useRef({
    timer,
    stopwatch,
    toggleDarkMode,
    fullscreen,
    onToggleFullscreen,
    onExitFullscreen,
  })
  ref.current = {
    timer,
    stopwatch,
    toggleDarkMode,
    fullscreen,
    onToggleFullscreen,
    onExitFullscreen,
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const h = ref.current

      if (e.key === 'Escape') {
        if (h.fullscreen) {
          e.preventDefault()
          h.onExitFullscreen()
        }
        return
      }

      // Ignore while typing or with modifier keys held.
      if (isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return

      switch (e.key) {
        case ' ':
        case 'Spacebar':
          e.preventDefault()
          h.timer.toggle()
          break
        case 'r':
        case 'R':
          h.timer.reset()
          break
        case 's':
        case 'S':
          h.stopwatch.toggle()
          break
        case 'l':
        case 'L':
          h.stopwatch.lap()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          h.onToggleFullscreen()
          break
        case 'd':
        case 'D':
          h.toggleDarkMode()
          break
        default:
          break
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}

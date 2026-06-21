import { useCallback, useEffect, useState } from 'react'

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void>
}

interface FullscreenElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>
}

function currentFullscreenElement(): Element | null {
  const doc = document as FullscreenDocument
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null
}

/**
 * Drives the native Fullscreen API for a given element. Falls back gracefully
 * (returns `isFullscreen: false`) where the API is unavailable; callers can
 * still render a CSS-based fullscreen overlay on top.
 */
export function useFullscreen(getElement: () => HTMLElement | null) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => setIsFullscreen(currentFullscreenElement() != null)
    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    return () => {
      document.removeEventListener('fullscreenchange', handler)
      document.removeEventListener('webkitfullscreenchange', handler)
    }
  }, [])

  const enter = useCallback(async (): Promise<boolean> => {
    const el = getElement() as FullscreenElement | null
    if (!el) return false
    try {
      if (el.requestFullscreen) await el.requestFullscreen()
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen()
      else return false
      return true
    } catch {
      return false
    }
  }, [getElement])

  const exit = useCallback(async (): Promise<void> => {
    const doc = document as FullscreenDocument
    try {
      if (currentFullscreenElement()) {
        if (doc.exitFullscreen) await doc.exitFullscreen()
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen()
      }
    } catch {
      /* ignore */
    }
  }, [])

  return { isFullscreen, enter, exit }
}

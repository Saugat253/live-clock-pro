import type { Lap } from '../types'
import { formatStopwatch } from './time'

/** Trigger a client-side download of a text file. */
export function downloadTextFile(
  filename: string,
  content: string,
  mime: string,
): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Revoke on the next tick so the download has time to start.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function lapsToCSV(laps: Lap[]): string {
  const header = 'Lap,Split,Total'
  const rows = laps.map(
    (lap) => `${lap.index},${formatStopwatch(lap.split)},${formatStopwatch(lap.total)}`,
  )
  return [header, ...rows].join('\r\n')
}

export function lapsToTXT(laps: Lap[]): string {
  return laps
    .map(
      (lap) =>
        `Lap ${lap.index} - ${formatStopwatch(lap.split)} (total ${formatStopwatch(lap.total)})`,
    )
    .join('\n')
}

export function exportLapsCSV(laps: Lap[]): void {
  downloadTextFile('stopwatch-laps.csv', lapsToCSV(laps), 'text/csv')
}

export function exportLapsTXT(laps: Lap[]): void {
  downloadTextFile('stopwatch-laps.txt', lapsToTXT(laps), 'text/plain')
}

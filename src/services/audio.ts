// Generates the timer-completion alert tone with the Web Audio API so the app
// ships with no binary audio assets. The AudioContext is created lazily on the
// first call (which happens in response to a user gesture, satisfying browser
// autoplay policies).

type WindowWithWebkitAudio = Window &
  typeof globalThis & { webkitAudioContext?: typeof AudioContext }

let ctx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (ctx) return ctx
  const w = window as WindowWithWebkitAudio
  const Ctor = w.AudioContext ?? w.webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  return ctx
}

function beep(context: AudioContext, startAt: number, frequency: number): void {
  const osc = context.createOscillator()
  const gain = context.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequency

  // Short envelope to avoid clicks.
  gain.gain.setValueAtTime(0.0001, startAt)
  gain.gain.exponentialRampToValueAtTime(0.4, startAt + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.32)

  osc.connect(gain)
  gain.connect(context.destination)
  osc.start(startAt)
  osc.stop(startAt + 0.34)
}

/** Play a short three-tone alert. Safe to call anytime; no-ops if unavailable. */
export function playAlarm(): void {
  const context = getContext()
  if (!context) return
  if (context.state === 'suspended') void context.resume()
  const now = context.currentTime
  // Rising three-note chime.
  beep(context, now, 880)
  beep(context, now + 0.4, 1046)
  beep(context, now + 0.8, 1318)
}

/**
 * Prime the audio context inside a user gesture (e.g. clicking "Start") so the
 * later completion tone is allowed to play even if the tab is backgrounded.
 */
export function unlockAudio(): void {
  const context = getContext()
  if (context && context.state === 'suspended') void context.resume()
}

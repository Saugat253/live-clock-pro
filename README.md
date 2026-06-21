# Live Clock Pro

A modern, responsive web app with a real-time **digital clock**, **countdown timer**, and **stopwatch** — plus light, dark, and high-contrast themes. Built with React 19, TypeScript, Vite, and Tailwind CSS. No backend, fully static, deployable to GitHub Pages.

🔗 **Live demo:** https://saugat253.github.io/live-clock-pro/

## Features

### 🕒 Clock
- Real-time digital clock, updates every second (self-correcting to avoid drift)
- 12-hour / 24-hour format toggle
- Show/hide seconds and date (e.g. `Sunday, June 21, 2026`)
- One-click full-screen mode, readable from a distance

### ⏲️ Timer
- Quick presets: 1m, 5m, 10m, 15m, 30m, 1h, 2h
- Custom hours / minutes / seconds entry
- Start, Pause, Resume, Reset, Stop
- Animated circular progress ring with “% left”
- On completion: screen flash, **Time's Up!** dialog, alert tone, and a browser notification (if permitted)

### ⏱️ Stopwatch
- Millisecond precision (`HH:MM:SS.mmm`), driven by `performance.now()`
- Start, Pause, Resume, Reset
- Lap times with per-lap splits; fastest/slowest highlighted
- Export laps to **CSV** or **TXT**

### 🎨 Themes & accessibility
- Light, Dark, and High-Contrast (accessibility) themes
- Theme and all preferences persist via `localStorage`
- Keyboard navigable, ARIA-labelled, visible focus rings, respects reduced-motion
- Fully responsive from 320px mobile up to large desktops — no horizontal scroll

### ⌨️ Keyboard shortcuts
| Key | Action |
| --- | --- |
| `Space` | Start / pause timer |
| `R` | Reset timer |
| `S` | Start / pause stopwatch |
| `L` | Save lap |
| `F` | Toggle full screen |
| `D` | Toggle dark mode |
| `Esc` | Exit full screen |

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · Web Audio API · Notification API · Local Storage. No backend, no tracking, no data collection.

## Getting started

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check and build to dist/
npm run preview  # preview the production build locally
```

Requires Node.js 20+.

## Project structure

```
src/
├── components/      Clock, Timer, Stopwatch, Header, ThemeSwitcher, KeyboardShortcuts, ui/
├── context/         Settings, Timer, and Stopwatch React contexts (global state)
├── hooks/           useClock, useTimer, useStopwatch, useFullscreen
├── pages/           ClockPage, TimerPage, StopwatchPage
├── services/        audio (Web Audio alarm), notifications (browser notifications)
├── utils/           time formatting, localStorage, lap export (CSV/TXT)
└── types.ts         shared types
```

## Deployment (GitHub Pages)

Deployment is automated with GitHub Actions (`.github/workflows/deploy.yml`):

1. Push to the `main` branch.
2. The workflow installs dependencies, runs `npm run build`, and publishes `dist/` to GitHub Pages.
3. In the repository settings, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions** (one-time).

The app is served from `/live-clock-pro/`; this base path is configured in `vite.config.ts`. If you rename the repository, update `base` to match.

## License

[MIT](./LICENSE)

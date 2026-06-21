import type { KeyboardEvent } from 'react'
import type { TabId } from '../../types'
import { ThemeSwitcher } from '../ThemeSwitcher/ThemeSwitcher'
import { ClockIcon, StopwatchIcon, TimerIcon } from '../ui/icons'

const TABS = [
  { id: 'clock', label: 'Clock', Icon: ClockIcon },
  { id: 'timer', label: 'Timer', Icon: TimerIcon },
  { id: 'stopwatch', label: 'Stopwatch', Icon: StopwatchIcon },
] as const

interface HeaderProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  // Left / Right arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const i = TABS.findIndex((t) => t.id === activeTab)
    const next =
      e.key === 'ArrowRight'
        ? (i + 1) % TABS.length
        : (i - 1 + TABS.length) % TABS.length
    onTabChange(TABS[next].id)
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-on-accent"
          >
            <ClockIcon />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Live Clock <span className="text-accent">Pro</span>
          </span>
        </div>

        <nav
          role="tablist"
          aria-label="Sections"
          onKeyDown={onKeyDown}
          className="order-3 flex w-full items-center justify-center gap-1 rounded-2xl border border-line bg-surface p-1 sm:order-none sm:w-auto"
        >
          {TABS.map(({ id, label, Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                id={`tab-${id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls="main-content"
                tabIndex={active ? 0 : -1}
                onClick={() => onTabChange(id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
                  active
                    ? 'bg-accent text-on-accent'
                    : 'text-muted hover:bg-surface-2 hover:text-fg'
                }`}
              >
                <Icon />
                <span>{label}</span>
              </button>
            )
          })}
        </nav>

        <ThemeSwitcher />
      </div>
    </header>
  )
}

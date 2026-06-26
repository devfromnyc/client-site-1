import { useState } from 'react'
import content from '../data/site-content.json'

function LogoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="text-ink"
    >
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <path
        d="M12 2C12 6 8 8 8 12C8 16 12 18 12 22M12 2C12 6 16 8 16 12C16 16 12 18 12 22M2 12C6 12 8 8 12 8C16 8 18 12 22 12M2 12C6 12 8 16 12 16C16 16 18 12 22 12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { logoBefore, logoAfter, nav } = content.header

  return (
    <header className="sticky top-0 z-50">
      <div className="relative">
        <div className="relative z-10 bg-beige py-4">
          <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
            <button
              type="button"
              className="flex flex-col gap-1.5 p-2 lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span
                className={`block h-0.5 w-6 bg-ink transition-transform duration-300 ease-in ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block h-0.5 w-6 bg-ink transition-opacity duration-300 ease-in ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block h-0.5 w-6 bg-ink transition-transform duration-300 ease-in ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>

            <a
              href="#home"
              className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 lg:static lg:translate-x-0"
              onClick={() => setMenuOpen(false)}
            >
              <span className="font-serif text-xl font-semibold tracking-tight text-ink">
                {logoBefore}
              </span>
              <LogoIcon />
              <span className="font-serif text-xl font-semibold tracking-tight text-ink">
                {logoAfter}
              </span>
            </a>

            <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-ink/80 transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="w-10 lg:hidden" aria-hidden="true" />
          </div>
        </div>

        <nav
          id="mobile-nav"
          className={`absolute left-0 right-0 top-full border-t border-ink/10 bg-beige px-6 py-6 transition-transform duration-300 ease-in lg:hidden ${
            menuOpen
              ? 'pointer-events-auto translate-y-0'
              : 'pointer-events-none -translate-y-full'
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!menuOpen}
        >
          <ul className="flex flex-col items-center gap-5">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  tabIndex={menuOpen ? 0 : -1}
                  className="text-base font-medium text-ink/80 transition-colors hover:text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

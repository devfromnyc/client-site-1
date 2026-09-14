import { Link, useLocation } from 'react-router-dom'
import content from '../data/site-content.json'

function FooterLink({ href, children }) {
  const location = useLocation()
  const isExternal = href.startsWith('/') && !href.startsWith('/#')
  
  if (isExternal) {
    return (
      <Link
        to={href}
        className="text-sm text-white/70 transition-colors hover:text-white"
      >
        {children}
      </Link>
    )
  }

  if (location.pathname !== '/') {
    const hashHref = href.startsWith('#') ? `/${href}` : href
    return (
      <Link
        to={hashHref}
        className="text-sm text-white/70 transition-colors hover:text-white"
      >
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className="text-sm text-white/70 transition-colors hover:text-white"
    >
      {children}
    </a>
  )
}

export default function Footer() {
  const { brandName, tagline, nav, social, copyrightName } = content.footer

  return (
    <footer className="bg-charcoal text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <p className="font-serif text-2xl font-medium">{brandName}</p>
            <p className="mt-2 text-sm text-white/60">{tagline}</p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap justify-center gap-6 md:justify-end">
              {nav.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-wrap justify-center gap-6">
            {social.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} {copyrightName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

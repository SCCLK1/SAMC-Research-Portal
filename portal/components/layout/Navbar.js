'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: GridIcon },
  { href: '/history', label: 'History', icon: ClockIcon },
  { href: '/profile', label: 'My Profile', icon: UserIcon },
]

const adminItems = [
  { href: '/admin', label: 'Overview', icon: ChartIcon },
  { href: '/admin/users', label: 'Users', icon: UsersIcon },
  { href: '/admin/runs', label: 'Agent Runs', icon: BotIcon },
  { href: '/admin/config', label: 'System Config', icon: CogIcon },
]

export default function Navbar({ user }) {
  const pathname = usePathname()
  const [theme, setTheme] = useState('dark')
  const initials = user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2) ?? 'FM'
  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') ?? 'dark'
    setTheme(savedTheme)
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [])

  function toggleTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link href="/dashboard" className="navbar-logo">
          <span style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>AMC</span>
          <span style={{ marginLeft: 4, fontWeight: 500 }}>Research</span>
        </Link>

        {/* Navigation items */}
        <nav className="navbar-nav">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className={`navbar-item ${active ? 'active' : ''}`}>
                {item.label}
              </Link>
            )
          })}

          {isAdmin && (
            <div className="navbar-admin-group">
              <span className="navbar-admin-separator">|</span>
              {adminItems.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href} className={`navbar-item navbar-item-admin ${active ? 'active' : ''}`}>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </nav>

        {/* Right side options: Theme + User details */}
        <div className="navbar-right">
          <button
            id="navbar-theme-toggle"
            className="btn-icon btn-ghost"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ padding: 6 }}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <div className="navbar-user">
            <div className="navbar-avatar" title={user?.name}>{initials}</div>
            <div className="navbar-user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.designation ?? user?.role}</div>
            </div>
            <button
              id="navbar-signout"
              className="btn-icon btn-ghost"
              onClick={() => signOut({ callbackUrl: '/login' })}
              title="Sign out"
              style={{ padding: 6, marginLeft: 8 }}
            >
              <LogOutIcon />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ── Icons (inline SVG) ── */
function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}
function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
}
function ChartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  )
}
function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  )
}
function BotIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  )
}
function CogIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
    </svg>
  )
}
function LogOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
function SunIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

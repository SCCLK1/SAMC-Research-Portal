'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function AppLayoutShell({ user, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="app-layout">
      {/* Mobile Topbar */}
      <header className="mobile-header">
        <button
          className="btn-icon btn-ghost"
          onClick={() => setIsSidebarOpen(true)}
          title="Open sidebar"
          style={{ padding: 6 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <div className="mobile-header-title" style={{ fontSize: '0.875rem', fontWeight: 600 }}>
          <span style={{ color: 'var(--color-primary-light)', fontWeight: 700 }}>AMC</span> Research
        </div>
      </header>

      {/* Sidebar navigation */}
      <Sidebar user={user} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content pane */}
      <div className="main-area">
        <main className="page-content">{children}</main>
      </div>

      {/* Mobile Bottom Tabbar */}
      <nav className="mobile-tabbar">
        <Link href="/dashboard" className={`tab-item ${pathname === '/dashboard' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
          </svg>
          <span>Hub</span>
        </Link>
        <Link href="/dashboard/events" className={`tab-item ${pathname?.startsWith('/dashboard/events') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>Events</span>
        </Link>
        <Link href="/profile" className={`tab-item ${pathname === '/profile' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>Profile</span>
        </Link>
      </nav>

      {/* Click-away mobile backdrop overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay mobile-only" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  )
}

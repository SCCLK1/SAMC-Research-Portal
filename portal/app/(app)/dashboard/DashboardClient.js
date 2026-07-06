'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import EventCard from '@/components/dashboard/EventCard'
import EventDetailDrawer from '@/components/dashboard/EventDetailDrawer'
import EventDetailView from '@/components/dashboard/EventDetailView'
import DailyDigestTable from '@/components/dashboard/DailyDigestTable'
import SectorHeatmap from '@/components/dashboard/SectorHeatmap'
import AgentRunProgress from '@/components/dashboard/AgentRunProgress'
import { NIFTY_500 } from '@/lib/nifty500'

const FILTERS = ['All Events', 'My Stocks', 'My Sectors', 'Critical']

export default function DashboardClient({ user, profile, initialEvents, initialMetadata, initialStates, latestRun }) {
  const [events, setEvents] = useState(initialEvents)
  const [metadata, setMetadata] = useState(initialMetadata)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All Events')
  const [viewMode, setViewMode] = useState('cards') // cards | table | heatmap
  const [isRunning, setIsRunning] = useState(false)
  const [runProgress, setRunProgress] = useState([])
  const [currentRun, setCurrentRun] = useState(latestRun)
  const [showKpiGuide, setShowKpiGuide] = useState(false)
  const [sortKey, setSortKey] = useState('actionability')
  const [sortOrder, setSortOrder] = useState('desc')

  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const activeCompany = searchParams.get('company')
  const mobileShowDetail = !!activeCompany

  const [eventStates, setEventStates] = useState(initialStates ?? [])
  const [stocks, setStocks] = useState(profile ? JSON.parse(profile.stocks ?? '[]') : [])

  const watchlistTickers = stocks.map((s) => s.ticker)
  const coveredSectors = profile ? JSON.parse(profile.industries ?? '[]') : []

  // Update Event Status & Notes API Caller
  const updateEventState = useCallback(async (eventKey, data) => {
    // Optimistically update client state
    setEventStates((prev) => {
      const existing = prev.find((s) => s.eventKey === eventKey)
      if (existing) {
        return prev.map((s) => (s.eventKey === eventKey ? { ...s, ...data } : s))
      }
      return [...prev, { eventKey, status: 'NEW', notes: '', ...data }]
    })

    try {
      await fetch('/api/events/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventKey, ...data }),
      })
    } catch (err) {
      console.error('Error updating event state:', err)
    }
  }, [])

  // Toggle watchlist stocks directly from Event Detail View
  const toggleWatchlist = useCallback(async (stock) => {
    let updatedStocks
    const exists = stocks.some((s) => s.ticker === stock.ticker)
    if (exists) {
      updatedStocks = stocks.filter((s) => s.ticker !== stock.ticker)
    } else {
      updatedStocks = [...stocks, stock]
    }
    
    setStocks(updatedStocks)

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industries: profile ? JSON.parse(profile.industries ?? '[]') : [],
          stocks: updatedStocks,
          minActionability: profile?.minActionability ?? 40,
          minSeverity: profile?.minSeverity ?? 3,
          eventCategories: profile ? JSON.parse(profile.eventCategories ?? '[]') : [],
          alertScope: profile?.alertScope ?? 'ALL'
        }),
      })
      router.refresh()
    } catch (err) {
      console.error('Error updating watchlist:', err)
    }
  }, [stocks, profile, router])

  // Filter and sort events based on active tab and sort options
  const filteredEvents = events.filter((event) => {
    if (activeFilter === 'My Stocks') {
      return watchlistTickers.some(
        (ticker) =>
          event.company?.toUpperCase().includes(ticker) ||
          ticker.includes(event.company?.toUpperCase())
      )
    }
    if (activeFilter === 'My Sectors') {
      const matchedStock = NIFTY_500.find(
        (s) =>
          event.company?.toLowerCase().includes(s.ticker.toLowerCase()) ||
          event.company?.toLowerCase().includes(s.name.toLowerCase().replace(/ (ltd|limited)$/i, '')) ||
          s.name.toLowerCase().includes(event.company?.toLowerCase().replace(/ (ltd|limited)$/i, ''))
      )
      const eventSector = matchedStock ? matchedStock.sector : null
      return eventSector && coveredSectors.some(
        (sec) => sec.toLowerCase() === eventSector.toLowerCase()
      )
    }
    if (activeFilter === 'Critical') {
      return (event.actionability ?? 0) >= 80 || event.severity >= 5
    }
    return true
  }).sort((a, b) => {
    let valA, valB

    if (sortKey === 'time') {
      const getAgeValue = (ageStr) => {
        if (!ageStr) return 999
        const s = ageStr.toLowerCase().trim()
        if (s === 'today') return 1
        if (s === 'yesterday') return 2
        const match = s.match(/(\d+)\s+day/)
        if (match) return parseInt(match[1])
        const wMatch = s.match(/(\d+)\s+week/)
        if (wMatch) return parseInt(wMatch[1]) * 7
        return 999
      }
      valA = getAgeValue(a.age)
      valB = getAgeValue(b.age)

      if (valA < valB) return sortOrder === 'desc' ? -1 : 1
      if (valA > valB) return sortOrder === 'desc' ? 1 : -1
      return 0
    }

    if (sortKey === 'company') {
      valA = a.company || ''
      valB = b.company || ''
    } else {
      valA = a[sortKey] ?? 0
      valB = b[sortKey] ?? 0
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  // Synchronise selected event with the query parameter 'company'
  useEffect(() => {
    if (activeCompany) {
      const found = filteredEvents.find((e) => e.company === activeCompany)
      if (found) {
        setSelectedEvent(found)
        return
      }
    }

    // Auto-select on desktop, clear selection on mobile
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024
    if (isDesktop && filteredEvents.length > 0) {
      // Find index or default to first
      setSelectedEvent(filteredEvents[0])
    } else {
      setSelectedEvent(null)
    }
  }, [activeCompany, filteredEvents])

  // Reset selected company parameter when activeFilter changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (params.has('company')) {
      params.delete('company')
      router.push(pathname, { scroll: false })
    }
  }, [activeFilter])

  // Mobile body scroll lock and view top scrolling
  useEffect(() => {
    if (mobileShowDetail) {
      document.body.classList.add('no-scroll')
      // Snap details overlay content to top
      window.scrollTo({ top: 0, behavior: 'instant' })
      const rightPane = document.querySelector('.dashboard-split-right')
      if (rightPane) {
        rightPane.scrollTop = 0
      }
    } else {
      document.body.classList.remove('no-scroll')
    }
    return () => document.body.classList.remove('no-scroll')
  }, [mobileShowDetail, selectedEvent])

  // Stats
  const totalEvents = events.length
  const criticalCount = events.filter((e) => (e.actionability ?? 0) >= 80 || e.severity >= 5).length
  const highCount = events.filter((e) => (e.actionability ?? 0) >= 60 && (e.actionability ?? 0) < 80).length
  const myStockEvents = events.filter((e) =>
    watchlistTickers.some((t) => e.company?.toUpperCase().includes(t))
  ).length

  // On-demand run trigger
  const triggerRun = useCallback(async () => {
    setIsRunning(true)
    setRunProgress(['Initialising agent run...'])

    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ runType: 'ON_DEMAND' }),
      })

      if (!response.ok) throw new Error('Failed to start agent run')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let finalResult = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === 'progress') {
                setRunProgress((prev) => [...prev, data.message])
              } else if (data.type === 'done') {
                finalResult = data
              }
            } catch {}
          }
        }
      }

      if (finalResult) {
        setEvents(finalResult.events ?? [])
        setMetadata(finalResult.metadata ?? null)
        setCurrentRun({
          id: finalResult.runId,
          status: 'DONE',
          completedAt: new Date().toISOString(),
          llmProvider: finalResult.llmProvider,
          runType: 'ON_DEMAND',
        })
      }
    } catch (err) {
      setRunProgress((prev) => [...prev, `Error: ${err.message}`])
    } finally {
      setIsRunning(false)
    }
  }, [])

  const lastUpdated = currentRun?.completedAt
    ? new Date(currentRun.completedAt).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
      })
    : null

  return (
    <>
      {/* Page header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2">
            Good morning, <span style={{ color: 'var(--color-primary-light)' }}>{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-secondary text-sm" style={{ marginTop: 4 }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · IST
            {lastUpdated && <> · Last updated: {lastUpdated}</>}
            {currentRun && <> · via <span className="badge badge-primary" style={{ verticalAlign: 'middle' }}>{currentRun.llmProvider}</span></>}
          </p>
        </div>

        <div className="flex gap-2">
          {/* KPI Guide Trigger Button */}
          <button
            id="kpi-guide-btn"
            className="btn btn-secondary"
            onClick={() => setShowKpiGuide(true)}
            style={{ fontWeight: 500 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ marginRight: 2 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            KPI Guide
          </button>

          <button
            id="dashboard-refresh"
            className="btn btn-primary"
            onClick={triggerRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 12a9 9 0 00-9-9" />
                </svg>
                Running...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                </svg>
                Refresh Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Agent run progress */}
      {isRunning && (
        <AgentRunProgress messages={runProgress} style={{ marginBottom: 'var(--space-6)' }} />
      )}

      {/* Stats bar */}
      <div className="stats-bar" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-item">
          <div className="stat-value">{totalEvents}</div>
          <div className="stat-label">Total Events</div>
          <div className="stat-sub">All Covered Stocks</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-bearish)' }}>{criticalCount}</div>
          <div className="stat-label">Critical</div>
          <div className="stat-sub">Actionability ≥ 80</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-accent)' }}>{highCount}</div>
          <div className="stat-label">High Impact</div>
          <div className="stat-sub">Score 60–79</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-primary-light)' }}>{myStockEvents}</div>
          <div className="stat-label">My Stocks</div>
          <div className="stat-sub">Watchlist hits</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-bullish)' }}>
            {events.filter((e) => e.sentiment === 'Bullish').length}
          </div>
          <div className="stat-label">Bullish</div>
          <div className="stat-sub">Positive sentiment</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-bearish)' }}>
            {events.filter((e) => e.sentiment === 'Bearish').length}
          </div>
          <div className="stat-label">Bearish</div>
          <div className="stat-sub">Negative sentiment</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-5)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              id={`filter-${f.toLowerCase().replace(/\s/g, '-')}`}
              className={`filter-tab ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
              {f === 'My Stocks' && myStockEvents > 0 && (
                <span className="badge badge-accent" style={{ marginLeft: 4, padding: '1px 5px' }}>{myStockEvents}</span>
              )}
              {f === 'Critical' && criticalCount > 0 && (
                <span className="badge badge-bearish" style={{ marginLeft: 4, padding: '1px 5px' }}>{criticalCount}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1" style={{ marginRight: '8px' }}>
            <span className="text-secondary text-xs" style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>Sort:</span>
            <select
              value={`${sortKey}-${sortOrder}`}
              onChange={(e) => {
                const [key, order] = e.target.value.split('-')
                setSortKey(key)
                setSortOrder(order)
              }}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-text)',
                fontSize: '0.75rem',
                padding: '4px 8px',
                outline: 'none',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              <option value="time-desc">Time (Newest First)</option>
              <option value="time-asc">Time (Oldest First)</option>
              <option value="actionability-desc">Actionability (High to Low)</option>
              <option value="actionability-asc">Actionability (Low to High)</option>
              <option value="severity-desc">Severity (High to Low)</option>
              <option value="severity-asc">Severity (Low to High)</option>
              <option value="confidence-desc">Confidence (High to Low)</option>
              <option value="confidence-asc">Confidence (Low to High)</option>
              <option value="company-asc">Company Name (A to Z)</option>
              <option value="company-desc">Company Name (Z to A)</option>
            </select>
          </div>

          {['cards', 'table', 'heatmap'].map((mode) => (
            <button
              key={mode}
              id={`view-${mode}`}
              className={`btn btn-secondary btn-sm ${viewMode === mode ? 'btn-primary' : ''}`}
              onClick={() => {
                setViewMode(mode)
                setMobileShowDetail(false)
              }}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {!isRunning && filteredEvents.length === 0 && (
        <div className="card" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-4)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
          </div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>No events yet</h3>
          <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)' }}>
            {events.length === 0
              ? 'Click "Refresh Now" to run the intelligence agent and populate today\'s brief.'
              : 'No events match the current filter. Try switching to "All Events".'}
          </p>
          {events.length === 0 && (
            <button id="empty-refresh" className="btn btn-primary" onClick={triggerRun} disabled={isRunning}>
              Run Intelligence Agent
            </button>
          )}
        </div>
      )}

      {/* Split Screen Cards View */}
      {viewMode === 'cards' && filteredEvents.length > 0 && (
        <div className={`dashboard-split ${mobileShowDetail ? 'show-detail' : ''}`}>
          {/* Left Feed */}
          <div className="dashboard-split-left">
            {filteredEvents.map((event, i) => {
              const isActive = selectedEvent && selectedEvent.company === event.company && selectedEvent.whatHappened === event.whatHappened
              const activeState = eventStates.find((s) => s.eventKey === event.company)
              return (
                <EventCard
                  key={`${event.company}-${i}`}
                  event={event}
                  isActive={isActive}
                  status={activeState?.status ?? 'NEW'}
                  isWatchlist={watchlistTickers.some((t) => event.company?.toUpperCase().includes(t))}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams)
                    params.set('company', event.company)
                    router.push(`${pathname}?${params.toString()}`, { scroll: false })
                  }}
                />
              )
            })}
          </div>

          {/* Right Detail Pane */}
          <div className="dashboard-split-right">
            {/* Sticky mobile header takeover bar */}
            <div className="split-mobile-only" style={{
              position: 'sticky',
              top: -16,
              left: 0,
              right: 0,
              background: 'var(--color-surface)',
              borderBottom: '1px solid var(--color-border)',
              padding: '12px var(--space-4)',
              margin: '-16px -16px var(--space-4) -16px',
              zIndex: 10,
              alignItems: 'center',
              gap: 'var(--space-3)'
            }}>
              <button
                className="btn-icon btn-ghost"
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.delete('company')
                  router.push(pathname, { scroll: false })
                }}
                title="Back to Feed"
                style={{ flexShrink: 0 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>Event Details</span>
            </div>

            {selectedEvent ? (
              <EventDetailView
                event={selectedEvent}
                isWatchlist={watchlistTickers.some((t) => selectedEvent.company?.toUpperCase().includes(t))}
                activeState={eventStates.find(s => s.eventKey === selectedEvent.company)}
                onUpdateState={(data) => updateEventState(selectedEvent.company, data)}
                onToggleWatchlist={toggleWatchlist}
              />
            ) : (
              <div className="card" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                <div>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" style={{ marginBottom: 12 }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <h4>Select an event to view full details</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table view */}
      {viewMode === 'table' && filteredEvents.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <DailyDigestTable
            events={filteredEvents}
            watchlistTickers={watchlistTickers}
            onRowClick={(event) => setSelectedEvent(event)}
          />
        </div>
      )}

      {/* Heatmap view */}
      {viewMode === 'heatmap' && (
        <SectorHeatmap events={events} coveredSectors={coveredSectors} />
      )}

      {/* Drawer (only fallback trigger for Table / Heatmap rows click) */}
      {selectedEvent && viewMode !== 'cards' && (
        <EventDetailDrawer
          event={selectedEvent}
          isWatchlist={watchlistTickers.some((t) => selectedEvent.company?.toUpperCase().includes(t))}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {/* KPI Reference Guide Modal */}
      {showKpiGuide && (
        <>
          <div className="drawer-overlay" onClick={() => setShowKpiGuide(false)} />
          <div
            className="drawer"
            style={{ width: '85%', maxWidth: 700 }}
            role="dialog"
            aria-modal="true"
            aria-label="KPI Reference Guide"
          >
            <div className="drawer-header">
              <div>
                <h2>KPI & Score Framework Guide</h2>
                <p className="text-secondary text-sm" style={{ marginTop: 4 }}>Institutional-grade equities event-intelligence metric glossary</p>
              </div>
              <button className="btn-icon btn-ghost" onClick={() => setShowKpiGuide(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {/* Actionability */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
                <h3 style={{ color: 'var(--color-primary-light)', marginBottom: 'var(--space-2)' }}>1. Actionability Score (0 - 100)</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                  The primary sorting metric. Represents the probability that a fund manager must make an active portfolio decision.
                </p>
                <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div className="label">Composition Weights</div>
                  <table style={{ width: '100%', fontSize: '0.75rem', marginTop: 4 }}>
                    <tbody>
                      <tr><td style={{ padding: '3px 0', fontWeight: 600 }}>Freshness</td><td style={{ color: 'var(--color-text-secondary)' }}>30% weight</td></tr>
                      <tr><td style={{ padding: '3px 0', fontWeight: 600 }}>Source Confidence</td><td style={{ color: 'var(--color-text-secondary)' }}>25% weight</td></tr>
                      <tr><td style={{ padding: '3px 0', fontWeight: 600 }}>Fundamental Magnitude</td><td style={{ color: 'var(--color-text-secondary)' }}>20% weight</td></tr>
                      <tr><td style={{ padding: '3px 0', fontWeight: 600 }}>Social Sentiment</td><td style={{ color: 'var(--color-text-secondary)' }}>15% weight</td></tr>
                      <tr><td style={{ padding: '3px 0', fontWeight: 600 }}>Historical Analogs</td><td style={{ color: 'var(--color-text-secondary)' }}>10% weight</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Severity */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
                <h3 style={{ color: 'var(--color-bearish)', marginBottom: 'var(--space-2)' }}>2. Severity Scale (1 - 5)</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                  Measures the intrinsic importance of the event type itself, regardless of the size of the target company:
                </p>
                <ul style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text-secondary)' }}>
                  <li><strong>Score 5 (Critical)</strong>: Fraud, regulator bans (SEBI/RBI), CEO departure, forensic audit, earnings shock &gt;20%.</li>
                  <li><strong>Score 4 (Major)</strong>: Substantial capex expansion, key corporate merger, rating changes.</li>
                  <li><strong>Score 3 (Moderate)</strong>: General sector/policy changes, industrial guidelines.</li>
                  <li><strong>Score 1-2 (Minor)</strong>: Routine meeting disclosures, normal operations updates.</li>
                </ul>
              </div>

              {/* Magnitude */}
              <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
                <h3 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)' }}>3. Fundamental Magnitude (1 - 5)</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: 1.5 }}>
                  Measures the impact on the target company's assets, cash flow, and market share relative to its size. For example, a Rs 500 crore order win has a Magnitude of 4 for a mid-cap company but a Magnitude of 1 for a mega-cap company.
                </p>
              </div>

              {/* Confidence */}
              <div>
                <h3 style={{ color: 'var(--color-bullish)', marginBottom: 'var(--space-2)' }}>4. Source Confidence (0 - 100)</h3>
                <p className="text-secondary text-sm" style={{ lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
                  Evaluates the reliability of news source verification. Major events require 2+ independent trusted sources, and Critical events require an official exchange filing.
                </p>
                <ul style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--color-text-secondary)' }}>
                  <li><strong>Official Exchange Filings</strong>: 70% weight towards confidence.</li>
                  <li><strong>Consensus Media Reports</strong>: 20% weight.</li>
                  <li><strong>Precedents / Analogs</strong>: 10% weight.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

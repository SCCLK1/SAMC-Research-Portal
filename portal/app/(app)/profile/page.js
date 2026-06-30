'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SECTORS, EVENT_CATEGORIES, searchNifty500 } from '@/lib/nifty500'

const TABS = ['Personal', 'Coverage', 'Watchlist', 'Alert Settings']


export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Coverage')
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Form state
  const [industries, setIndustries] = useState([])
  const [stocks, setStocks] = useState([])
  const [minActionability, setMinActionability] = useState(40)
  const [minSeverity, setMinSeverity] = useState(3)
  const [eventCategories, setEventCategories] = useState([])
  const [alertScope, setAlertScope] = useState('ALL')

  // Watchlist autocomplete
  const [stockQuery, setStockQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    fetch('/api/profile').then((r) => r.json()).then((data) => {
      if (data) {
        setProfile(data)
        setIndustries(data.industries ?? [])
        setStocks(data.stocks ?? [])
        setMinActionability(data.minActionability ?? 40)
        setMinSeverity(data.minSeverity ?? 3)
        setEventCategories(data.eventCategories ?? [])
        setAlertScope(data.alertScope ?? 'ALL')
      }
    })
  }, [])

  useEffect(() => {
    if (stockQuery.length >= 1) {
      setSuggestions(searchNifty500(stockQuery))
    } else {
      setSuggestions([])
    }
  }, [stockQuery])

  function toggleIndustry(sector) {
    setIndustries((prev) =>
      prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]
    )
  }

  function addStock(stock) {
    if (!stocks.find((s) => s.ticker === stock.ticker)) {
      setStocks((prev) => [...prev, stock])
    }
    setStockQuery('')
    setSuggestions([])
  }

  function removeStock(ticker) {
    setStocks((prev) => prev.filter((s) => s.ticker !== ticker))
  }

  function toggleCategory(cat) {
    setEventCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  async function handleSave() {
    setSaving(true)
    await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ industries, stocks, minActionability, minSeverity, eventCategories, alertScope }),
    })
    router.refresh() // Refetch server components layout data (Research Hub / Sidebar)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2">My Profile</h1>
          <p className="text-secondary text-sm" style={{ marginTop: 4 }}>
            Configure your coverage, watchlist, and alert preferences
          </p>
        </div>
        <button
          id="profile-save"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab.toLowerCase().replace(/\s/g, '-')}`}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab: Coverage ── */}
      {activeTab === 'Coverage' && (
        <div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Industry Coverage</h3>
          <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)' }}>
            Select the sectors you analyse. Events from these sectors will be prioritised in your dashboard.
          </p>
          <div className="sector-grid">
            {SECTORS.map((sector) => {
              const isSelected = industries.includes(sector)
              return (
                <div
                  key={sector}
                  id={`sector-${sector.replace(/\s|&/g, '-').toLowerCase()}`}
                  className={`sector-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleIndustry(sector)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === ' ' && toggleIndustry(sector)}
                >
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: isSelected ? 'var(--color-primary-light)' : 'var(--color-border-strong)',
                    display: 'inline-block', flexShrink: 0
                  }} />
                  <div>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{sector}</div>
                  </div>
                  {isSelected && (
                    <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary-light)" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
              )
            })}
          </div>
          {industries.length > 0 && (
            <p className="text-secondary text-sm" style={{ marginTop: 'var(--space-4)' }}>
              {industries.length} sector{industries.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>
      )}

      {/* ── Tab: Watchlist ── */}
      {activeTab === 'Watchlist' && (
        <div>
          <h3 style={{ marginBottom: 'var(--space-2)' }}>Stock Watchlist</h3>
          <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)' }}>
            Add stocks to your watchlist. Events matching these stocks will be highlighted with a gold border in your dashboard.
          </p>

          {/* Search */}
          <div className="autocomplete" style={{ marginBottom: 'var(--space-4)' }}>
            <label className="label" htmlFor="stock-search">Search & Add Stocks</label>
            <input
              id="stock-search"
              ref={inputRef}
              className="input"
              type="text"
              placeholder="Search by company name or ticker (e.g. HDFC, Infosys)"
              value={stockQuery}
              onChange={(e) => setStockQuery(e.target.value)}
              autoComplete="off"
            />
            {suggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {suggestions.map((stock) => (
                  <div
                    key={stock.ticker}
                    className="autocomplete-item"
                    onClick={() => addStock(stock)}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{stock.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{stock.ticker}</div>
                    </div>
                    <span className="chip">{stock.sector}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current watchlist */}
          <div className="form-group">
            <label className="label">Current Watchlist ({stocks.length} stocks)</label>
            <div className="watchlist-chips">
              {stocks.length === 0 && (
                <span className="text-muted text-sm" style={{ padding: 'var(--space-2)' }}>
                  No stocks added yet. Search above to add.
                </span>
              )}
              {stocks.map((stock) => (
                <div key={stock.ticker} className="watchlist-chip">
                  <div>
                    <span style={{ fontWeight: 600 }}>{stock.ticker}</span>
                    <span className="text-muted" style={{ marginLeft: 4, fontSize: '0.6875rem' }}>{stock.name}</span>
                  </div>
                  <button
                    id={`remove-${stock.ticker}`}
                    className="watchlist-chip-remove"
                    onClick={() => removeStock(stock.ticker)}
                    aria-label={`Remove ${stock.ticker}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Alert Settings ── */}
      {activeTab === 'Alert Settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Actionability threshold */}
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Actionability Threshold</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)' }}>
              Only show events with Actionability score at or above this value.
            </p>
            <div className="form-group">
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-2)' }}>
                <label className="label" htmlFor="actionability-slider">Minimum Actionability</label>
                <span style={{
                  fontWeight: 700, fontSize: '1.25rem',
                  color: minActionability >= 60 ? 'var(--color-accent)' : 'var(--color-primary-light)',
                }}>
                  {minActionability}
                </span>
              </div>
              <input
                id="actionability-slider"
                type="range"
                min="0" max="100" step="5"
                value={minActionability}
                onChange={(e) => setMinActionability(Number(e.target.value))}
              />
              <div className="flex justify-between text-xs text-muted" style={{ marginTop: 4 }}>
                <span>0 — All</span>
                <span>40 — Medium+</span>
                <span>60 — High+</span>
                <span>80 — Critical</span>
              </div>
            </div>
          </div>

          {/* Severity filter */}
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Minimum Severity</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)' }}>
              Filter events by intrinsic importance level (1 = lowest, 5 = highest).
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((sev) => (
                <button
                  key={sev}
                  id={`sev-${sev}`}
                  className={`btn ${minSeverity === sev ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setMinSeverity(sev)}
                  style={{ minWidth: 56 }}
                >
                  {sev}
                </button>
              ))}
            </div>
            <p className="text-muted text-xs" style={{ marginTop: 'var(--space-3)' }}>
              Sev 5: Fraud, SEBI action, CEO exit · Sev 4: Order wins, rating changes · Sev 3: Sector updates
            </p>
          </div>

          {/* Event categories */}
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Event Categories</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)' }}>
              Select the types of events you want to see. Leave all unchecked to receive all categories.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  id={`cat-${cat.toLowerCase().replace(/&\s/g, '').replace(/\s/g, '-')}`}
                  className={`chip ${eventCategories.includes(cat) ? 'chip-active' : ''}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                  {eventCategories.includes(cat) && <span style={{ marginLeft: 2 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Alert scope */}
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Alert Scope</h3>
            <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-6)' }}>
              Control whether the dashboard shows all events or only events relevant to your profile.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { value: 'ALL', label: 'All Covered Equities', desc: 'See every event across all monitored constituents' },
                { value: 'MY_SECTORS', label: 'My Sectors Only', desc: 'Filter to events in your covered industries' },
                { value: 'MY_STOCKS', label: 'My Watchlist Only', desc: 'Only events affecting your watchlist stocks' },
              ].map((opt) => (
                <div
                  key={opt.value}
                  className={`card ${alertScope === opt.value ? 'card-watchlist' : ''}`}
                  style={{ padding: 'var(--space-4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}
                  onClick={() => setAlertScope(opt.value)}
                  role="radio"
                  aria-checked={alertScope === opt.value}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                    border: `2px solid ${alertScope === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: alertScope === opt.value ? 'var(--color-primary)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {alertScope === opt.value && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{opt.label}</div>
                    <div className="text-secondary text-xs">{opt.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Personal ── */}
      {activeTab === 'Personal' && (
        <div style={{ maxWidth: 520 }}>
          <h3 style={{ marginBottom: 'var(--space-6)' }}>Personal Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="label" htmlFor="personal-email">Email</label>
              <input id="personal-email" className="input" type="email" disabled
                value={profile?.email ?? ''} placeholder="Loading..."
                style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              <span className="text-muted text-xs">Email cannot be changed. Contact admin to update.</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <div className="form-group flex-1">
                <label className="label">Role</label>
                <span className="badge badge-primary" style={{ width: 'fit-content', fontSize: '0.75rem', padding: '4px 10px' }}>
                  {profile?.role ?? 'FUND_MANAGER'}
                </span>
              </div>
            </div>
            <div style={{
              padding: 'var(--space-4)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
            }}>
              To update your name, designation, or password, contact your system administrator.
            </div>
          </div>
        </div>
      )}
    </>
  )
}

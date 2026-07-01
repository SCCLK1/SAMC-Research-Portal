'use client'

function Section({ title, children }) {
  return (
    <div className="detail-section" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      <div className="detail-section-title">{title}</div>
      {children}
    </div>
  )
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="metric-card" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)' }}>
      <div className="label" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{value ?? 'NM'}</div>
      {sub && <div className="text-muted text-xs" style={{ marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function DataTable({ rows }) {
  return (
    <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
      <tbody>
        {rows.map(([label, value], i) => (
          <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
            <td style={{ padding: '8px 0', color: 'var(--color-text-secondary)', fontWeight: 500, width: '40%' }}>{label}</td>
            <td style={{ padding: '8px 0', color: 'var(--color-text)' }}>{value ?? <span className="text-muted">NM</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

import { NIFTY_500 } from '@/lib/nifty500'
import { useState, useEffect } from 'react'

function formatEvidence(evidence) {
  if (!evidence) return null
  
  // 1. Strip raw "Source URL: ..." text if present
  let cleanText = evidence.replace(/(?:Source URL:\s*https?:\/\/[^\s\n|]+|Source URL:[^\n]+)/gi, '').trim()
  // Clean up trailing periods or separators
  cleanText = cleanText.replace(/[\s.·,;-]+$/, '').trim()
  
  // 2. Parse any markdown links like [Text](url)
  const parts = []
  let lastIndex = 0
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  let match
  
  while ((match = regex.exec(cleanText)) !== null) {
    const textBefore = cleanText.slice(lastIndex, match.index)
    if (textBefore) parts.push(textBefore)
    parts.push(
      <a 
        key={match.index} 
        href={match[2]} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ color: 'var(--color-primary-light)', textDecoration: 'underline' }}
      >
        {match[1]}
      </a>
    )
    lastIndex = regex.lastIndex
  }
  
  const textAfter = cleanText.slice(lastIndex)
  if (textAfter) parts.push(textAfter)
  
  return parts.length > 0 ? parts : cleanText
}

export default function EventDetailView({
  event,
  isWatchlist,
  activeState,
  onUpdateState,
  onToggleWatchlist
}) {
  const [localNotes, setLocalNotes] = useState(activeState?.notes ?? '')
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    setLocalNotes(activeState?.notes ?? '')
  }, [activeState])

  const actionColor = (event.actionability ?? 0) >= 80 ? 'var(--color-bearish)' :
                      (event.actionability ?? 0) >= 60 ? 'var(--color-accent)' :
                      'var(--color-primary-light)'

  // Match company to stock constituent for watchlist quick toggles
  const cleanComp = event.company.toLowerCase().replace(/limited|ltd|co|corporation/g, '').trim()
  const matchedStock = NIFTY_500.find(s =>
    s.name.toLowerCase().includes(cleanComp) ||
    cleanComp.includes(s.name.toLowerCase().replace(/limited|ltd|co|corporation/g, '').trim())
  )

  return (
    <div className="card event-detail-view" style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <div className="flex items-center gap-2">
            {isWatchlist && <span className="badge badge-accent">Watchlist</span>}
            {event.eventType && <span className="badge badge-primary">{event.eventType}</span>}
            <span className="badge" style={{
              background: event.sentiment === 'Bullish' ? 'var(--color-bullish-dim)' : event.sentiment === 'Bearish' ? 'var(--color-bearish-dim)' : 'var(--color-neutral-dim)',
              color: event.sentiment === 'Bullish' ? 'var(--color-bullish)' : event.sentiment === 'Bearish' ? 'var(--color-bearish)' : 'var(--color-neutral)',
            }}>
              {event.sentiment}
            </span>
          </div>

          {matchedStock && onToggleWatchlist && (
            <button
              className={`btn btn-sm ${isWatchlist ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => onToggleWatchlist(matchedStock)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={isWatchlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {isWatchlist ? 'Watching' : 'Watch Stock'}
            </button>
          )}
        </div>

        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em', marginTop: 4 }}>
          {event.company}
        </h2>
        {event.verdict && (
          <p className="text-secondary text-sm" style={{ marginTop: 8, lineHeight: 1.5 }}>
            {event.verdict}
          </p>
        )}
      </div>

      {/* Analyst Workspace Panel */}
      {onUpdateState && (
        <div style={{
          padding: 'var(--space-4)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>📝</span> Analyst Workspace
            </div>

            {/* Status select dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="text-secondary text-xs" style={{ fontWeight: 500 }}>Status:</span>
              <select
                value={activeState?.status ?? 'NEW'}
                onChange={(e) => onUpdateState({ status: e.target.value })}
                className="input"
                style={{
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  width: 'auto',
                  height: 'auto',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-sm)',
                  background: (activeState?.status === 'ACTION_REQUIRED') ? 'var(--color-bearish-dim)' :
                              (activeState?.status === 'COMPLETED') ? 'var(--color-bullish-dim)' :
                              (activeState?.status === 'REVIEWING') ? 'rgba(245,158,11,0.1)' : 'var(--color-surface)',
                  color: (activeState?.status === 'ACTION_REQUIRED') ? 'var(--color-bearish)' :
                         (activeState?.status === 'COMPLETED') ? 'var(--color-bullish)' :
                         (activeState?.status === 'REVIEWING') ? 'var(--color-accent)' : 'var(--color-text)',
                  borderColor: 'var(--color-border)'
                }}
              >
                <option value="NEW">🆕 New / Unassigned</option>
                <option value="REVIEWING">⏳ Under Review</option>
                <option value="ACTION_REQUIRED">🚨 Action Required</option>
                <option value="COMPLETED">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div className="flex justify-between" style={{ marginBottom: 'var(--space-2)' }}>
              <label className="label" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Thesis & Portfolio Target Notes</label>
              {isSaved && <span style={{ color: 'var(--color-bullish)', fontSize: '0.75rem', fontWeight: 600 }}>✓ Saved to DB</span>}
            </div>
            <textarea
              className="input"
              rows="3"
              placeholder="Enter custom valuation targets, trim limits, management call notes, or portfolio action items..."
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              onBlur={() => {
                onUpdateState({ notes: localNotes })
                setIsSaved(true)
                setTimeout(() => setIsSaved(false), 2000)
              }}
              style={{ fontSize: '0.8125rem', fontFamily: 'inherit', resize: 'vertical', lineHeight: 1.5 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span className="text-muted text-xs">Auto-saves on blur</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  onUpdateState({ notes: localNotes })
                  setIsSaved(true)
                  setTimeout(() => setIsSaved(false), 2000)
                }}
                style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: 600 }}
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Key metrics */}
        <Section title="Key Metrics">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)' }}>
            <MetricCard
              label="Actionability"
              value={<span style={{ color: actionColor }}>{event.actionability} / 100</span>}
              sub={(event.actionability ?? 0) >= 80 ? 'Critical' : (event.actionability ?? 0) >= 60 ? 'High' : 'Medium'}
            />
            <MetricCard
              label="Severity"
              value={`${event.severity} / 5`}
              sub="Event Type Scale"
            />
            <MetricCard
              label="Magnitude"
              value={`${event.magnitude} / 5`}
              sub="Fundamental Impact"
            />
          </div>
        </Section>

        {/* What happened */}
        {event.whatHappened && (
          <Section title="What Happened">
            <p className="text-secondary text-sm" style={{ lineHeight: 1.5 }}>
              {event.whatHappened}
            </p>
          </Section>
        )}

        {/* Why it matters */}
        {event.whyItMatters && typeof event.whyItMatters === 'object' && Object.keys(event.whyItMatters).length > 0 && (
          <Section title="Why It Matters (Fundamental Impact Vectors)">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {Object.entries(event.whyItMatters).map(([key, val]) => (
                <li key={key} style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--color-text)' }}>{key}:</strong> {val}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Evidence & Sources */}
        {event.evidence && (
          <Section title="Verification & Sources">
            <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
              <div>{formatEvidence(event.evidence)}</div>
              {event.url && (
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--color-primary-light)',
                      textDecoration: 'underline',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    View Source Article ↗
                  </a>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Market context */}
        {event.marketContext && typeof event.marketContext === 'object' && Object.keys(event.marketContext).length > 0 && (
          <Section title="Market context (Backward realized returns)">
            <DataTable rows={Object.entries(event.marketContext)} />
          </Section>
        )}

        {/* Spillover */}
        {event.spillover && (
          <Section title="Index & Spillover Transmission">
            <DataTable rows={[
              ['Spillover Beneficiaries', event.spillover.beneficiaries],
              ['Spillover Risks', event.spillover.atRisk]
            ]} />
          </Section>
        )}

        {/* Historical analogs */}
        {event.historicalAnalogs && event.historicalAnalogs.length > 0 && (
          <Section title="Verifiable Historical Analogs">
            <table className="digest-table" style={{ fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '4px 8px' }}>Precedent Event</th>
                  <th style={{ padding: '4px 8px' }}>Date</th>
                  <th style={{ padding: '4px 8px' }}>Realized Outcome</th>
                </tr>
              </thead>
              <tbody>
                {event.historicalAnalogs.map((a, i) => (
                  <tr key={i}>
                    <td style={{ padding: '6px 8px' }}>{a.event}</td>
                    <td style={{ padding: '6px 8px' }} className="text-muted">{a.date}</td>
                    <td style={{ padding: '6px 8px' }}>{a.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>
        )}

        {/* Risks */}
        {event.risks && event.risks.length > 0 && (
          <Section title="Risks to the Thesis">
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {event.risks.map((risk, i) => (
                <li key={i} style={{ display: 'flex', gap: 8, fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--color-bearish)', flexShrink: 0 }}>▸</span>
                  {risk}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Compliance note */}
        <div style={{
          padding: 'var(--space-3)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.6875rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
        }}>
          This output provides event intelligence and analytical context only — not investment advice or research recommendations. Actionability rankings and named spillovers are analytical signals about information salience, not solicitations to transact.
        </div>
      </div>
    </div>
  )
}

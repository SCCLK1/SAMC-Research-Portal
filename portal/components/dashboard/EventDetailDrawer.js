'use client'

import { useEffect } from 'react'

function Section({ title, children }) {
  return (
    <div className="drawer-section">
      <div className="drawer-section-title">{title}</div>
      {children}
    </div>
  )
}

function MetricCard({ label, value, sub }) {
  return (
    <div className="metric-card">
      <div className="metric-label" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{value ?? 'NM'}</div>
      {sub && <div className="text-muted text-xs" style={{ marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function DataTable({ rows }) {
  return (
    <table className="data-table">
      <tbody>
        {rows.map(([label, value], i) => (
          <tr key={i}>
            <td>{label}</td>
            <td>{value ?? <span className="text-muted">NM</span>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

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

export default function EventDetailDrawer({ event, isWatchlist, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const actionColor = (event.actionability ?? 0) >= 80 ? 'var(--sev-5)' :
                      (event.actionability ?? 0) >= 60 ? 'var(--color-accent)' :
                      'var(--color-primary)'

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" role="dialog" aria-modal="true" aria-label="Event Full Brief">

        {/* Header */}
        <div className="drawer-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              {isWatchlist && <span className="badge badge-accent">Watchlist</span>}
              {event.eventType && <span className="badge badge-primary">{event.eventType}</span>}
              <span className="badge" style={{
                background: event.sentiment === 'Bullish' ? 'var(--color-bullish-dim)' : event.sentiment === 'Bearish' ? 'var(--color-bearish-dim)' : 'var(--color-neutral-dim)',
                color: event.sentiment === 'Bullish' ? 'var(--color-bullish)' : event.sentiment === 'Bearish' ? 'var(--color-bearish)' : 'var(--color-neutral)',
              }}>
                {event.sentiment}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.375rem', lineHeight: 1.3 }}>
              {event.company}
            </h2>
            {event.verdict && (
              <p className="text-secondary text-sm" style={{ marginTop: 6, lineHeight: 1.5 }}>
                {event.verdict}
              </p>
            )}
          </div>
          <button
            id="drawer-close"
            className="btn-icon btn-ghost"
            onClick={onClose}
            aria-label="Close"
            style={{ flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">

          {/* Key metrics */}
          <Section title="Key Metrics">
            <div className="metrics-grid-3">
              <MetricCard
                label="Actionability"
                value={<span style={{ color: actionColor }}>{event.actionability} / 100</span>}
                sub={(event.actionability ?? 0) >= 80 ? 'Critical' : (event.actionability ?? 0) >= 60 ? 'High' : 'Medium'}
              />
              <MetricCard label="Confidence" value={`${event.confidence ?? 'NM'} / 100`} />
              <MetricCard label="Severity" value={`${event.severity ?? 'NM'} / 5`} />
              <MetricCard label="Magnitude" value={`${event.magnitude ?? 'NM'} / 5`} />
              <MetricCard label="Freshness" value={`${event.freshness ?? 'NM'} / 100`} sub={event.age} />
              <MetricCard label="Time Horizon" value={event.timeHorizon ?? 'NM'} sub={event.nifty500Impact ? `Nifty impact: ${event.nifty500Impact}` : null} />
            </div>
          </Section>

          {/* What happened */}
          {event.whatHappened && (
            <Section title="What Happened">
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                {event.whatHappened}
              </p>
            </Section>
          )}

          {/* Why it matters */}
          {event.whyItMatters && Object.keys(event.whyItMatters).length > 0 && (
            <Section title="Why It Matters">
              <DataTable
                rows={Object.entries(event.whyItMatters).map(([k, v]) => [
                  k.charAt(0).toUpperCase() + k.slice(1), v
                ])}
              />
            </Section>
          )}

          {/* Confidence composition */}
          {event.confidenceComposition && event.confidenceComposition.length > 0 && (
            <Section title="Confidence Composition">
              <table className="data-table">
                <thead>
                  <tr>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Component</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Score</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Weight</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Contribution</td>
                  </tr>
                </thead>
                <tbody>
                  {event.confidenceComposition.map((c, i) => (
                    <tr key={i}>
                      <td>{c.component}</td>
                      <td>{c.score === 'NM' ? <span className="text-muted">NM</span> : c.score}</td>
                      <td className="text-muted">{c.weight}</td>
                      <td>{c.contribution}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Reaction lean */}
          {event.reactionLean && (
            <Section title="Reaction Lean">
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>
                {event.reactionLean}
              </p>
            </Section>
          )}

          {/* Evidence */}
          {event.evidence && (
            <Section title="Evidence Sources">
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: event.url ? '10px' : 0 }}>
                {formatEvidence(event.evidence)}
              </p>
              {event.url && (
                <div style={{ marginTop: '8px' }}>
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.8125rem',
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
            </Section>
          )}

          {/* Market context */}
          {event.marketContext && Object.keys(event.marketContext).length > 0 && (
            <Section title="Market Context (Backward-Looking)">
              <DataTable
                rows={Object.entries(event.marketContext)}
              />
            </Section>
          )}

          {/* Spillover */}
          {event.spillover && (
            <Section title="Spillover">
              <DataTable rows={[
                ['Beneficiaries', event.spillover.beneficiaries],
                ['At Risk', event.spillover.atRisk],
              ]} />
            </Section>
          )}

          {/* Historical analogs */}
          {event.historicalAnalogs && event.historicalAnalogs.length > 0 && (
            <Section title="Historical Analogs">
              <table className="data-table">
                <thead>
                  <tr>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Event</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Date</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-muted)', fontSize: '0.6875rem', textTransform: 'uppercase' }}>Outcome</td>
                  </tr>
                </thead>
                <tbody>
                  {event.historicalAnalogs.map((a, i) => (
                    <tr key={i}>
                      <td>{a.event}</td>
                      <td className="text-muted">{a.date}</td>
                      <td>{a.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Section>
          )}

          {/* Risks */}
          {event.risks && event.risks.length > 0 && (
            <Section title="Risks to the Thesis">
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {event.risks.map((risk, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: 'var(--space-3)',
                    fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5,
                  }}>
                    <span style={{ color: 'var(--color-bearish)', flexShrink: 0, marginTop: 3 }}>▸</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Compliance note */}
          <div style={{
            padding: 'var(--space-4)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.6875rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
          }}>
            This output provides event intelligence and analytical context only — not investment advice or research recommendations. Actionability rankings and named spillovers are analytical signals about information salience, not solicitations to transact.
          </div>
        </div>
      </div>
    </>
  )
}

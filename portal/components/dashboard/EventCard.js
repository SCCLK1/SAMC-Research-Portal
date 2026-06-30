'use client'

function ActionabilityRing({ score }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const progress = circumference - (score / 100) * circumference
  const color = score >= 80 ? 'var(--sev-5)' : score >= 60 ? 'var(--color-accent)' : score >= 40 ? 'var(--color-primary)' : 'var(--color-neutral)'

  return (
    <div className="action-ring">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={radius}
          fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="action-ring-value" style={{ color }}>{score ?? 'NM'}</div>
    </div>
  )
}

function getSentimentClass(sentiment) {
  if (sentiment === 'Bullish') return 'badge-bullish'
  if (sentiment === 'Bearish') return 'badge-bearish'
  return 'badge-neutral'
}

function getSeverityClass(sev) {
  if (sev >= 5) return 'badge-sev-5'
  if (sev === 4) return 'badge-sev-4'
  if (sev === 3) return 'badge-sev-3'
  if (sev === 2) return 'badge-sev-2'
  return 'badge-sev-1'
}

const getStatusBadge = (status) => {
  if (status === 'REVIEWING') return <span className="badge" style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-accent)', border: '1px solid rgba(245,158,11,0.25)', fontSize: '0.625rem', padding: '1px 5px', flexShrink: 0 }}>⏳ Reviewing</span>
  if (status === 'ACTION_REQUIRED') return <span className="badge" style={{ background: 'var(--color-bearish-dim)', color: 'var(--color-bearish)', border: '1px solid rgba(239,68,68,0.25)', fontSize: '0.625rem', padding: '1px 5px', flexShrink: 0 }}>🚨 Action Req</span>
  if (status === 'COMPLETED') return <span className="badge" style={{ background: 'var(--color-bullish-dim)', color: 'var(--color-bullish)', border: '1px solid rgba(16,185,129,0.25)', fontSize: '0.625rem', padding: '1px 5px', flexShrink: 0 }}>✅ Done</span>
  return null
}

export default function EventCard({ event, isWatchlist, onClick, isActive, status }) {
  const isCritical = (event.actionability ?? 0) >= 80 || event.severity >= 5
  const cardClass = `card event-card ${isWatchlist ? 'card-watchlist' : ''} ${isCritical && !isWatchlist ? 'card-critical' : ''} ${isActive ? 'event-card-active' : ''}`

  return (
    <div
      className={cardClass}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={isCritical ? { animation: 'pulse-glow 3s ease-in-out infinite' } : undefined}
    >
      <div className="event-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Company name + watchlist badge */}
          <div className="flex items-center gap-2" style={{ marginBottom: 4, flexWrap: 'wrap' }}>
            <span className="event-card-company truncate">{event.company}</span>
            {isWatchlist && (
              <span className="badge badge-accent" style={{ flexShrink: 0 }}>Watchlist</span>
            )}
            {getStatusBadge(status)}
          </div>

          {/* Event type + category */}
          <div className="flex items-center gap-2 event-card-type">
            <span className={`badge ${getSentimentClass(event.sentiment)}`}>{event.sentiment}</span>
            {event.eventType && (
              <span className="badge badge-primary">{event.eventType}</span>
            )}
            {event.age && (
              <span className="text-muted text-xs">{event.age}</span>
            )}
          </div>
        </div>

        {/* Actionability ring */}
        <ActionabilityRing score={event.actionability} />
      </div>

      {/* Metrics row */}
      <div className="event-card-metrics">
        <div className="metric-cell">
          <span className="metric-label">Confidence</span>
          <span className="metric-value">{event.confidence ?? 'NM'}</span>
          <span className="metric-sub">/ 100</span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Severity</span>
          <span className={`badge ${getSeverityClass(event.severity)}`} style={{ fontSize: '0.875rem', padding: '2px 8px' }}>
            {event.severity ?? 'NM'} / 5
          </span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Magnitude</span>
          <span className="metric-value">{event.magnitude ?? 'NM'}</span>
          <span className="metric-sub">/ 5</span>
        </div>
        <div className="metric-cell">
          <span className="metric-label">Horizon</span>
          <span className="text-secondary text-sm" style={{ fontWeight: 500 }}>{event.timeHorizon ?? '—'}</span>
        </div>
      </div>

      {/* Verdict */}
      {event.verdict && (
        <div className="event-card-verdict">
          {event.verdict}
        </div>
      )}

      {/* Footer */}
      <div className="event-card-footer">
        <span
          className="text-xs"
          style={{
            color: (event.actionability ?? 0) >= 80 ? 'var(--color-bearish)' :
                   (event.actionability ?? 0) >= 60 ? 'var(--color-accent)' :
                   'var(--color-text-muted)',
            fontWeight: 600,
          }}
        >
          {(event.actionability ?? 0) >= 80 ? '● CRITICAL' :
           (event.actionability ?? 0) >= 60 ? '● HIGH' :
           (event.actionability ?? 0) >= 40 ? '● MEDIUM' : '● LOW'}
        </span>
        <button
          className="btn btn-ghost btn-sm"
          onClick={(e) => { e.stopPropagation(); onClick() }}
          style={{ color: 'var(--color-primary-light)', fontSize: '0.75rem' }}
        >
          Full Brief →
        </button>
      </div>
    </div>
  )
}

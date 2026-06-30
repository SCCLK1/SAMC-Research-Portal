'use client'

function getSentimentBadge(sentiment) {
  if (sentiment === 'Bullish') return { bg: 'var(--color-bullish-dim)', color: 'var(--color-bullish)' }
  if (sentiment === 'Bearish') return { bg: 'var(--color-bearish-dim)', color: 'var(--color-bearish)' }
  return { bg: 'var(--color-neutral-dim)', color: 'var(--color-neutral)' }
}

function getSevColor(sev) {
  if (sev >= 5) return 'var(--sev-5)'
  if (sev === 4) return 'var(--sev-4)'
  if (sev === 3) return 'var(--sev-3)'
  return 'var(--sev-1)'
}

function getActionColor(score) {
  if (score >= 80) return 'var(--sev-5)'
  if (score >= 60) return 'var(--color-accent)'
  if (score >= 40) return 'var(--color-primary-light)'
  return 'var(--color-neutral)'
}

export default function DailyDigestTable({ events, watchlistTickers, onRowClick }) {
  return (
    <table className="digest-table">
      <thead>
        <tr>
          <th style={{ width: 40 }}>#</th>
          <th>Company</th>
          <th>Event</th>
          <th>Sentiment</th>
          <th style={{ textAlign: 'center' }}>Sev</th>
          <th style={{ textAlign: 'center' }}>Conf</th>
          <th style={{ textAlign: 'center' }}>Actionability</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event, i) => {
          const isWatchlist = watchlistTickers.some((t) => event.company?.toUpperCase().includes(t))
          const sentBadge = getSentimentBadge(event.sentiment)

          return (
            <tr
              key={`${event.company}-${i}`}
              className={isWatchlist ? 'row-watchlist' : ''}
              onClick={() => onRowClick(event)}
            >
              <td className="text-muted">{i + 1}</td>
              <td>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 600 }}>{event.company}</span>
                  {isWatchlist && <span className="badge badge-accent">Watchlist</span>}
                </div>
              </td>
              <td>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                  {event.eventType ?? event.eventSummary ?? '—'}
                </span>
              </td>
              <td>
                <span
                  className="badge"
                  style={{ background: sentBadge.bg, color: sentBadge.color }}
                >
                  {event.sentiment ?? 'NM'}
                </span>
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ color: getSevColor(event.severity), fontWeight: 700, fontSize: '0.875rem' }}>
                  {event.severity ?? 'NM'}
                </span>
              </td>
              <td style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                {event.confidence ?? 'NM'}
              </td>
              <td style={{ textAlign: 'center' }}>
                <span style={{ color: getActionColor(event.actionability), fontWeight: 700 }}>
                  {event.actionability ?? 'NM'}
                </span>
              </td>
              <td className="text-muted text-xs">{event.age ?? '—'}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

'use client'

const SECTORS = [
  'Banking & Finance', 'Information Technology', 'Energy', 'Pharmaceuticals',
  'FMCG', 'Telecom', 'Automobile', 'Metals & Mining',
  'Capital Goods', 'Real Estate', 'Consumer Discretionary', 'Healthcare',
]

function getHeatColor(score) {
  if (!score) return 'rgba(255,255,255,0.02)'
  if (score >= 80) return 'rgba(239,68,68,0.15)'
  if (score >= 60) return 'rgba(245,158,11,0.15)'
  if (score >= 40) return 'rgba(99,102,241,0.15)'
  return 'rgba(255,255,255,0.03)'
}

function getTextColor(score) {
  if (!score) return 'var(--color-text-muted)'
  if (score >= 80) return 'var(--color-bearish)'
  if (score >= 60) return 'var(--color-accent)'
  if (score >= 40) return 'var(--color-primary-light)'
  return 'var(--color-text-secondary)'
}

export default function SectorHeatmap({ events, coveredSectors }) {
  // Build per-sector average actionability
  const sectorData = {}

  for (const sector of SECTORS) {
    const sectorKeywords = sector.toLowerCase().split(' ')
    const sectorEvents = events.filter((e) =>
      sectorKeywords.some(
        (kw) =>
          e.company?.toLowerCase().includes(kw) ||
          e.eventType?.toLowerCase().includes(kw)
      )
    )

    const scores = sectorEvents
      .map((e) => e.actionability)
      .filter((s) => s != null)

    sectorData[sector] = {
      count: sectorEvents.length,
      avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
      maxScore: scores.length ? Math.max(...scores) : null,
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div>
        <h3 style={{ marginBottom: 'var(--space-2)' }}>Sector Activity Heatmap</h3>
        <p className="text-secondary text-sm">Average Actionability score by sector. Your covered sectors are highlighted.</p>
      </div>

      <div className="heatmap-grid">
        {SECTORS.map((sector) => {
          const data = sectorData[sector]
          const isCovered = coveredSectors.includes(sector)
          const bg = getHeatColor(data.avgScore)
          const textColor = getTextColor(data.avgScore)

          return (
            <div
              key={sector}
              className={`heatmap-cell ${isCovered ? 'heatmap-covered' : ''}`}
              style={{ background: bg }}
            >
              {isCovered && (
                <div style={{
                  position: 'absolute', top: 8, right: 8,
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--color-primary)',
                }} />
              )}
              <div className="heatmap-cell-name" style={{ color: 'var(--color-text-secondary)' }}>
                {sector}
              </div>
              <div className="heatmap-cell-score" style={{ color: textColor }}>
                {data.avgScore ?? '—'}
              </div>
              <div className="heatmap-cell-label">
                {data.count} event{data.count !== 1 ? 's' : ''}
                {data.maxScore ? ` · max ${data.maxScore}` : ''}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-6" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(239,68,68,0.3)' }} />
          Critical (≥80)
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(245,158,11,0.3)' }} />
          High (60–79)
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(99,102,241,0.3)' }} />
          Medium (40–59)
        </div>
        <div className="flex items-center gap-2">
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-primary)' }} />
          Your covered sector
        </div>
      </div>
    </div>
  )
}

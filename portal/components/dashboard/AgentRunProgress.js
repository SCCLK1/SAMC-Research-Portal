'use client'

export default function AgentRunProgress({ messages, style }) {
  return (
    <div
      className="card"
      style={{
        padding: 'var(--space-5)',
        borderColor: 'rgba(99,102,241,0.3)',
        ...style,
      }}
    >
      <div className="flex items-center gap-3" style={{ marginBottom: 'var(--space-4)' }}>
        <svg
          className="animate-spin"
          width="16" height="16"
          viewBox="0 0 24 24" fill="none"
          stroke="var(--color-primary-light)" strokeWidth="2.5"
        >
          <path d="M21 12a9 9 0 00-9-9" />
        </svg>
        <span style={{ fontWeight: 600, color: 'var(--color-primary-light)', fontSize: '0.875rem' }}>
          Intelligence Agent Running...
        </span>
      </div>

      <div className="progress-bar progress-indeterminate" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="progress-bar-fill" />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
        maxHeight: 120, overflowY: 'auto',
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              fontSize: '0.75rem',
              color: i === messages.length - 1 ? 'var(--color-text)' : 'var(--color-text-muted)',
              display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start',
              transition: 'color 0.3s',
            }}
          >
            <span style={{ color: 'var(--color-primary-light)', flexShrink: 0 }}>
              {i === messages.length - 1 ? '▶' : '✓'}
            </span>
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}

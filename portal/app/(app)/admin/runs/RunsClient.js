'use client'

import { useState } from 'react'

export default function RunsClient({ runs }) {
  const [selectedRun, setSelectedRun] = useState(null)

  return (
    <>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="h2">Agent Runs Log</h1>
        <p className="text-secondary text-sm" style={{ marginTop: 4 }}>
          Comprehensive execution logs of all system and manual run operations.
        </p>
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Start Time</th>
              <th>Type</th>
              <th>Triggered By</th>
              <th>LLM Provider</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>
                  No runs logged yet.
                </td>
              </tr>
            )}
            {runs.map((run) => {
              const start = new Date(run.startedAt)
              const duration = run.completedAt
                ? Math.round((new Date(run.completedAt) - start) / 1000)
                : null

              return (
                <tr key={run.id}>
                  <td>
                    <div style={{ fontWeight: 500 }}>
                      {start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-muted text-xs">
                      {start.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{run.runType}</span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{run.userName}</div>
                    {run.userEmail && <div className="text-muted text-xs">{run.userEmail}</div>}
                  </td>
                  <td className="text-secondary text-sm">
                    {run.llmProvider ?? '—'}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background:
                          run.status === 'DONE' ? 'var(--color-bullish-dim)' :
                          run.status === 'FAILED' ? 'var(--color-bearish-dim)' :
                          'var(--color-neutral-dim)',
                        color:
                          run.status === 'DONE' ? 'var(--color-bullish)' :
                          run.status === 'FAILED' ? 'var(--color-bearish)' :
                          'var(--color-neutral)',
                      }}
                    >
                      {run.status}
                    </span>
                  </td>
                  <td className="text-muted text-sm">
                    {duration != null ? `${duration}s` : 'running...'}
                  </td>
                  <td>
                    <button
                      id={`inspect-run-${run.id}`}
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedRun(run)}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedRun && (
        <>
          <div className="drawer-overlay" onClick={() => setSelectedRun(null)} />
          <div
            className="drawer"
            style={{ width: '80%', maxWidth: 900 }}
            role="dialog"
            aria-modal="true"
            aria-label="Agent Run Logs"
          >
            <div className="drawer-header">
              <div>
                <span className="badge badge-primary" style={{ marginBottom: 6 }}>Run: {selectedRun.id}</span>
                <h2>Run Details & LLM Transcript</h2>
              </div>
              <button className="btn-icon btn-ghost" onClick={() => setSelectedRun(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="drawer-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              {/* Metadata */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div className="text-muted text-xs">Status</div>
                  <div style={{ fontWeight: 600, color: selectedRun.status === 'DONE' ? 'var(--color-bullish)' : 'var(--color-bearish)' }}>
                    {selectedRun.status}
                  </div>
                </div>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div className="text-muted text-xs">Model Used</div>
                  <div style={{ fontWeight: 600 }}>{selectedRun.llmProvider ?? '—'}</div>
                </div>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div className="text-muted text-xs">Triggered By</div>
                  <div style={{ fontWeight: 600 }}>{selectedRun.userName}</div>
                </div>
                <div style={{ background: 'var(--color-surface)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <div className="text-muted text-xs">Start Time</div>
                  <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>
                    {new Date(selectedRun.startedAt).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Error messages if failed */}
              {selectedRun.status === 'FAILED' && (
                <div
                  style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-bearish-dim)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-bearish)',
                  }}
                >
                  <h4 style={{ marginBottom: 4 }}>Error details</h4>
                  <pre style={{ fontFamily: 'monospace', fontSize: '0.8125rem', whiteSpace: 'pre-wrap' }}>
                    {selectedRun.errorMessage}
                  </pre>
                </div>
              )}

              {/* Raw markdown output */}
              <div>
                <h3 style={{ marginBottom: 'var(--space-2)' }}>Raw LLM Markdown Output</h3>
                <p className="text-secondary text-sm" style={{ marginBottom: 'var(--space-3)' }}>
                  The markdown response returned by the LLM containing the formatted analysis tables.
                </p>
                {selectedRun.rawOutput ? (
                  <pre
                    style={{
                      padding: 'var(--space-4)',
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      maxHeight: 400,
                      overflowY: 'auto',
                      fontSize: '0.8125rem',
                      fontFamily: 'monospace',
                      color: 'var(--color-text-secondary)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {selectedRun.rawOutput}
                  </pre>
                ) : (
                  <div className="text-muted text-sm" style={{ padding: 'var(--space-4)', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                    No output logs captured for this run.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

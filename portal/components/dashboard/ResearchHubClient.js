'use client'

import { useState } from 'react'
import Link from 'next/link'

const indexData = [
  { name: 'Nifty 50', value: '24,016.40', change: '+0.54%', isPositive: true },
  { name: 'Nifty 500', value: '22,230.15', change: '+0.62%', isPositive: true },
  { name: 'Nifty Bank', value: '52,342.90', change: '+0.85%', isPositive: true },
  { name: 'Nifty IT', value: '38,125.40', change: '-1.12%', isPositive: false },
]

export default function ResearchHubClient({ user, profile, events }) {
  const watchlist = profile ? JSON.parse(profile.stocks ?? '[]') : []
  const sectors = profile ? JSON.parse(profile.industries ?? '[]') : []

  // Top 3 highest actionability events
  const topEvents = [...events]
    .sort((a, b) => (b.actionability ?? 0) - (a.actionability ?? 0))
    .slice(0, 3)

  // Watchlist alerts: count how many events match watchlist stocks
  const watchlistAlerts = events.filter((event) =>
    watchlist.some((s) => event.company?.toUpperCase().includes(s.ticker.toUpperCase()))
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div>
        <h1 className="h2">
          Research Hub — <span style={{ color: 'var(--color-primary-light)' }}>Dashboard</span>
        </h1>
        <p className="text-secondary text-sm" style={{ marginTop: 4 }}>
          Institutional-grade research dashboard, equity trackers, and intelligence alerts.
        </p>
      </div>

      {/* Market Pulse Index Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        {indexData.map((idx) => (
          <div key={idx.name} className="card" style={{ padding: 'var(--space-4)' }}>
            <div className="label" style={{ fontSize: '0.6875rem' }}>{idx.name}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, margin: '4px 0' }}>{idx.value}</div>
            <div style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: idx.isPositive ? 'var(--color-bullish)' : 'var(--color-bearish)'
            }}>
              {idx.change}
            </div>
          </div>
        ))}
      </div>

      {/* Grid: Watchlist + Sectors (Aligned Fixed Heights) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)' }} className="md-grid-2">
        {/* Watchlist card */}
        <div className="card hub-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minHeight: '200px', height: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>My Watchlist Stocks</h3>
            <span className="badge badge-accent">{watchlist.length} Monitored</span>
          </div>

          {watchlist.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {watchlist.slice(0, 2).map((stock) => {
                const stockAlerts = watchlistAlerts.filter((a) => a.company?.toUpperCase().includes(stock.ticker.toUpperCase()))
                return (
                  <div key={stock.ticker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{stock.name}</div>
                      <div className="text-muted text-xs">{stock.ticker} · NSE</div>
                    </div>
                    {stockAlerts.length > 0 ? (
                      <Link href="/dashboard/events" className="badge badge-bearish" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                        {stockAlerts.length} Event Alerts
                      </Link>
                    ) : (
                      <span className="badge badge-neutral">No Alerts</span>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-muted text-sm" style={{ padding: 'var(--space-4) 0', flex: 1, display: 'flex', alignItems: 'center' }}>
              No stocks in watchlist. Add stocks in &nbsp;<Link href="/profile" style={{ color: 'var(--color-primary-light)' }}>My Profile</Link>&nbsp; to track specific alerts.
            </div>
          )}
        </div>

        {/* Sectors Card */}
        <div className="card hub-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', minHeight: '200px', height: 'auto' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Focus Sector Coverages</h3>
          
          {sectors.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 'var(--space-2)' }}>
              {sectors.slice(0, 4).map((sec) => (
                <div key={sec} style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 10px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }} className="truncate">{sec}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-bullish)' }}></span>
                    <span className="text-muted text-xs">Active</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted text-sm" style={{ padding: 'var(--space-4) 0', flex: 1, display: 'flex', alignItems: 'center' }}>
              No focus sectors configured. Select industries in &nbsp;<Link href="/profile" style={{ color: 'var(--color-primary-light)' }}>My Profile</Link>.
            </div>
          )}
        </div>
      </div>

      {/* Latest Event Intelligence Section (Redesigned Bloomberg-style list) */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Latest Event Intelligence</h3>
            <p className="text-secondary text-xs" style={{ marginTop: 2 }}>Top 3 highest-actionability market events scanned by the agent</p>
          </div>
          <Link href="/dashboard/events" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
            View Full News Feed →
          </Link>
        </div>

        {topEvents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topEvents.map((event, idx) => (
              <div
                key={event.company}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-5) var(--space-6)',
                  borderBottom: idx === topEvents.length - 1 ? 'none' : '1px solid var(--color-border)',
                  background: 'var(--color-bg-secondary)',
                  transition: 'background var(--transition-fast)'
                }}
              >
                {/* Left side content */}
                <div style={{ flex: 1, minWidth: 0, paddingRight: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text)' }}>{event.company}</span>
                    <span className="badge badge-primary" style={{ fontSize: '0.6875rem' }}>{event.eventType}</span>
                  </div>
                  {event.verdict && (
                    <p className="text-secondary text-xs" style={{ lineHeight: 1.4, margin: 0 }}>
                      {event.verdict}
                    </p>
                  )}
                </div>

                {/* Right side scores + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexShrink: 0 }}>
                  <span className="badge" style={{
                    background: event.sentiment === 'Bullish' ? 'var(--color-bullish-dim)' : event.sentiment === 'Bearish' ? 'var(--color-bearish-dim)' : 'var(--color-neutral-dim)',
                    color: event.sentiment === 'Bullish' ? 'var(--color-bullish)' : event.sentiment === 'Bearish' ? 'var(--color-bearish)' : 'var(--color-neutral)',
                    fontSize: '0.6875rem',
                    padding: '2px 8px'
                  }}>
                    {event.sentiment}
                  </span>
                  
                  <div style={{ textAlign: 'right', minWidth: 70 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-accent)', lineHeight: 1 }}>
                      {event.actionability}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.5625rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 3 }}>
                      Actionability
                    </div>
                  </div>

                  <Link href={`/dashboard/events?company=${encodeURIComponent(event.company)}`} className="btn btn-ghost btn-sm" style={{ padding: '6px 12px', fontSize: '0.75rem', color: 'var(--color-primary-light)', textDecoration: 'none' }}>
                    Analyze →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted text-sm" style={{ padding: 'var(--space-8) 0', textAlign: 'center' }}>
            No event data available yet. Please run an agent scan.
          </div>
        )}
      </div>

      {/* CSS grid helper */}
      <style jsx>{`
        @media (min-width: 768px) {
          .md-grid-2 {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

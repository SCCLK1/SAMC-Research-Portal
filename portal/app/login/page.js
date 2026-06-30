'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />

      <div className="card login-card">
        {/* Logo */}
        <div className="login-logo">
          <span style={{ color: 'var(--color-primary-light)' }}>AMC</span>{' '}
          <span>Research</span>
        </div>
        <p className="login-tagline">Nifty 500 Event Intelligence Portal</p>

        {/* Market status strip */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 'var(--space-2)', marginBottom: 'var(--space-8)',
          padding: 'var(--space-2) var(--space-4)',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.6875rem', color: 'var(--color-text-secondary)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-bullish)', display: 'inline-block' }} />
          Institutional Research Platform · India Equities
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="you@amcportal.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-bearish-dim)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-bearish)',
              fontSize: '0.8125rem',
            }}>
              {error}
            </div>
          )}

          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ marginTop: 'var(--space-2)', justifyContent: 'center' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity="0.25" />
                  <path d="M21 12a9 9 0 00-9-9" />
                </svg>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: 0 }}>
          Access restricted to authorised fund managers.
          <br />Contact your system administrator for access.
        </p>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-5)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', fontSize: '0.8125rem' }}>
          <span className="text-secondary">New analyst?</span>{' '}
          <Link href="/register" className="text-primary" style={{ fontWeight: 600, color: 'var(--color-primary-light)', textDecoration: 'none' }}>
            Create an Account →
          </Link>
        </div>
      </div>
    </div>
  )
}

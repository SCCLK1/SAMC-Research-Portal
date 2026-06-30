'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      let data
      try {
        data = await res.json()
      } catch {
        const text = await res.text().catch(() => '(no body)')
        setError(`Server error (${res.status}): ${text.substring(0, 200)}`)
        setLoading(false)
        return
      }

      if (!res.ok) {
        setError(`[${res.status}] ${data.error ?? 'Registration failed'}`)
        setLoading(false)
      } else {
        setSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          router.push('/login')
        }, 2500)
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(`Connection failed: ${err.message}`)
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-glow login-bg-glow-1" />
      <div className="login-bg-glow login-bg-glow-2" />

      <div className="card login-card" style={{ maxWidth: 460 }}>
        {/* Logo */}
        <div className="login-logo" style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-2)' }}>
          <img 
            src="/amc.svg" 
            alt="Shriram AMC Logo" 
            style={{ height: '52px', width: 'auto', display: 'block' }} 
          />
        </div>
        <p className="login-tagline" style={{ textAlign: 'center', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-primary-light)', marginTop: 'var(--space-2)', marginBottom: 'var(--space-4)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Intelligence Portal
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-group">
            <label className="label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="input"
              type="text"
              placeholder="Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="email">Email Address</label>
            <input
              id="email"
              className="input"
              type="email"
              placeholder="rahul.sharma@amcportal.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
            />
          </div>

          <div className="form-group">
            <label className="label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              className="input"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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

          {success && (
            <div style={{
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--color-bullish-dim)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-bullish)',
              fontSize: '0.8125rem',
            }}>
              {success}
            </div>
          )}

          <button
            id="register-submit"
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            style={{ marginTop: 'var(--space-2)', justifyContent: 'center' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.8125rem' }}>
          <span className="text-secondary">Already have an account?</span>{' '}
          <Link href="/login" className="text-primary" style={{ fontWeight: 600, color: 'var(--color-primary-light)', textDecoration: 'none' }}>
            Sign In →
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

export default function AdminConfigPage() {
  const [config, setConfig] = useState({
    ACTIVE_LLM: 'gemini',
    GEMINI_API_KEY: '',
    OPENAI_API_KEY: '',
    ANTHROPIC_API_KEY: '',
    NVIDIA_NIM_API_KEY: '',
    NVIDIA_NIM_MODEL: 'meta/llama-3.1-70b-instruct',
    SEARCH_PROVIDER: 'serper',
    SEARCH_API_KEY: '',
    SCHEDULER_ENABLED: 'true',
    SCHEDULER_CRON: '30 1 * * *',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/config')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load system config')
        return r.json()
      })
      .then((data) => {
        setConfig(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError('')

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      if (!res.ok) throw new Error('Failed to save config')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleChange(key, val) {
    setConfig((prev) => ({ ...prev, [key]: val }))
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 12a9 9 0 00-9-9" />
        </svg>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2">System Configuration</h1>
          <p className="text-secondary text-sm" style={{ marginTop: 4 }}>
            Manage the global AI models, search providers, API keys, and scheduler settings.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {/* ── LLM Settings ── */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
            AI Model Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="label" htmlFor="active-llm">Active LLM Provider</label>
              <select
                id="active-llm"
                className="input"
                value={config.ACTIVE_LLM}
                onChange={(e) => handleChange('ACTIVE_LLM', e.target.value)}
              >
                <option value="gemini">Google Gemini (gemini-2.0-flash)</option>
                <option value="openai">OpenAI (gpt-4o)</option>
                <option value="claude">Anthropic Claude (claude-sonnet-4-5)</option>
                <option value="nvidia">NVIDIA NIM (LLaMA-3.1-70B)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="gemini-key">Gemini API Key</label>
              <input
                id="gemini-key"
                className="input"
                type="password"
                placeholder={config.has_GEMINI_API_KEY ? '••••••••' : 'Enter Gemini API key'}
                value={config.GEMINI_API_KEY}
                onChange={(e) => handleChange('GEMINI_API_KEY', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="openai-key">OpenAI API Key</label>
              <input
                id="openai-key"
                className="input"
                type="password"
                placeholder={config.has_OPENAI_API_KEY ? '••••••••' : 'Enter OpenAI API key'}
                value={config.OPENAI_API_KEY}
                onChange={(e) => handleChange('OPENAI_API_KEY', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="anthropic-key">Anthropic API Key</label>
              <input
                id="anthropic-key"
                className="input"
                type="password"
                placeholder={config.has_ANTHROPIC_API_KEY ? '••••••••' : 'Enter Anthropic API key'}
                value={config.ANTHROPIC_API_KEY}
                onChange={(e) => handleChange('ANTHROPIC_API_KEY', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="nvidia-key">NVIDIA NIM API Key</label>
              <input
                id="nvidia-key"
                className="input"
                type="password"
                placeholder={config.has_NVIDIA_NIM_API_KEY ? '••••••••' : 'Enter NVIDIA NIM API key'}
                value={config.NVIDIA_NIM_API_KEY}
                onChange={(e) => handleChange('NVIDIA_NIM_API_KEY', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="nvidia-model">NVIDIA NIM Model Name</label>
              <input
                id="nvidia-model"
                className="input"
                type="text"
                placeholder="meta/llama-3.1-70b-instruct"
                value={config.NVIDIA_NIM_MODEL}
                onChange={(e) => handleChange('NVIDIA_NIM_MODEL', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Search Settings ── */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
            Search Engine Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="label" htmlFor="search-provider">Search Provider</label>
              <select
                id="search-provider"
                className="input"
                value={config.SEARCH_PROVIDER}
                onChange={(e) => handleChange('SEARCH_PROVIDER', e.target.value)}
              >
                <option value="serper">Serper API (Google Search)</option>
                <option value="brave">Brave Search API</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="search-key">Search API Key</label>
              <input
                id="search-key"
                className="input"
                type="password"
                placeholder={config.has_SEARCH_API_KEY ? '••••••••' : 'Enter Search API key'}
                value={config.SEARCH_API_KEY}
                onChange={(e) => handleChange('SEARCH_API_KEY', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ── Scheduler Settings ── */}
        <div className="card">
          <h3 style={{ marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-2)' }}>
            Daily Intelligence Scheduler
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="label" htmlFor="scheduler-enabled">Automatic Daily Scan</label>
              <select
                id="scheduler-enabled"
                className="input"
                value={config.SCHEDULER_ENABLED}
                onChange={(e) => handleChange('SCHEDULER_ENABLED', e.target.value)}
              >
                <option value="true">Enabled (Runs in background daily)</option>
                <option value="false">Disabled (On-demand only)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="scheduler-cron">Scheduler Cron Expression (UTC)</label>
              <input
                id="scheduler-cron"
                className="input"
                type="text"
                placeholder="30 1 * * *"
                value={config.SCHEDULER_CRON}
                onChange={(e) => handleChange('SCHEDULER_CRON', e.target.value)}
              />
              <span className="text-muted text-xs">
                Default: <code>30 1 * * *</code> executes at 7:00 AM IST (1:30 AM UTC) daily.
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        {error && (
          <div style={{ color: 'var(--color-bearish)', fontSize: '0.875rem' }}>{error}</div>
        )}

        <div className="flex gap-4">
          <button id="config-submit" type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            {saving ? 'Saving Config...' : saved ? '✓ Settings Saved' : 'Save Configurations'}
          </button>
        </div>
      </form>
    </div>
  )
}

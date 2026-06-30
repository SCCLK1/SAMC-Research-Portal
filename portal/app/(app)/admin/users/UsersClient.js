'use client'

import { useState } from 'react'

export default function UsersClient({ users: initialUsers, currentUserId }) {
  const [users, setUsers] = useState(initialUsers)
  const [creating, setCreating] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', designation: '', role: 'FUND_MANAGER', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function toggleActive(userId, isActive) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })
    if (res.ok) {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isActive: !isActive } : u))
    }
  }

  async function createUser(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
    if (res.ok) {
      const created = await res.json()
      setUsers((prev) => [created, ...prev])
      setCreating(false)
      setNewUser({ name: '', email: '', designation: '', role: 'FUND_MANAGER', password: '' })
    } else {
      const data = await res.json()
      setError(data.error ?? 'Failed to create user')
    }
    setSaving(false)
  }

  return (
    <>
      <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="h2">User Management</h1>
          <p className="text-secondary text-sm" style={{ marginTop: 4 }}>{users.length} users total</p>
        </div>
        <button id="create-user-btn" className="btn btn-primary" onClick={() => setCreating(true)}>
          + Add User
        </button>
      </div>

      {/* Create user modal */}
      {creating && (
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)', borderColor: 'rgba(99,102,241,0.3)' }}>
          <h3 style={{ marginBottom: 'var(--space-5)' }}>New Fund Manager</h3>
          <form onSubmit={createUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="label" htmlFor="new-name">Full Name</label>
              <input id="new-name" className="input" required value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="new-email">Email</label>
              <input id="new-email" className="input" type="email" required value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="new-designation">Designation</label>
              <input id="new-designation" className="input" value={newUser.designation}
                onChange={(e) => setNewUser({ ...newUser, designation: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label" htmlFor="new-role">Role</label>
              <select id="new-role" className="input" value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="FUND_MANAGER">Fund Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label" htmlFor="new-password">Temporary Password</label>
              <input id="new-password" className="input" type="password" required value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            </div>

            {error && (
              <div style={{ gridColumn: '1/-1', color: 'var(--color-bearish)', fontSize: '0.8125rem' }}>{error}</div>
            )}

            <div className="flex gap-3" style={{ gridColumn: '1/-1' }}>
              <button id="save-new-user" type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Creating...' : 'Create User'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Watchlist</th>
              <th>Sectors</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{user.name}</div>
                  {user.designation && <div className="text-muted text-xs">{user.designation}</div>}
                </td>
                <td className="text-secondary text-sm">{user.email}</td>
                <td><span className={`badge ${user.role === 'ADMIN' ? 'badge-bearish' : 'badge-primary'}`}>{user.role}</span></td>
                <td className="text-muted text-sm">{user.stockCount} stocks</td>
                <td className="text-muted text-sm">{user.sectorCount} sectors</td>
                <td className="text-muted text-sm">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString('en-IN') : 'Never'}
                </td>
                <td>
                  <span className={`badge ${user.isActive ? 'badge-bullish' : 'badge-neutral'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  {user.id !== currentUserId && (
                    <button
                      id={`toggle-user-${user.id}`}
                      className={`btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => toggleActive(user.id, user.isActive)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

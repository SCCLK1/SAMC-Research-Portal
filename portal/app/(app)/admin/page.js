import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export const metadata = { title: 'Admin — AMC Research Portal' }

export default async function AdminPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const [userCount, runCount, recentRuns] = await Promise.all([
    prisma.user.count(),
    prisma.agentRun.count(),
    prisma.agentRun.findMany({
      orderBy: { startedAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true } } },
    }),
  ])

  const successRate = await prisma.agentRun.count({ where: { status: 'DONE' } })

  return (
    <>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="h2">Admin Overview</h1>
        <p className="text-secondary text-sm" style={{ marginTop: 4 }}>System status and activity</p>
      </div>

      {/* Stats */}
      <div className="stats-bar" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-item">
          <div className="stat-value">{userCount}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{runCount}</div>
          <div className="stat-label">Agent Runs</div>
        </div>
        <div className="stat-item">
          <div className="stat-value" style={{ color: 'var(--color-bullish)' }}>
            {runCount > 0 ? Math.round((successRate / runCount) * 100) : 0}%
          </div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>

      {/* Recent runs */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-5) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
          <h3>Recent Agent Runs</h3>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>User</th>
              <th>LLM</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentRuns.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>No runs yet</td></tr>
            )}
            {recentRuns.map((run) => (
              <tr key={run.id}>
                <td className="text-muted text-sm">
                  {new Date(run.startedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td><span className="badge badge-primary">{run.runType}</span></td>
                <td>{run.user?.name ?? 'System'}</td>
                <td className="text-muted text-sm">{run.llmProvider ?? '—'}</td>
                <td>
                  <span className={`badge ${run.status === 'DONE' ? 'badge-bullish' : run.status === 'FAILED' ? 'badge-bearish' : 'badge-neutral'}`}>
                    {run.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

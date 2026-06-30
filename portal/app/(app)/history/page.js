import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export const metadata = { title: 'History — AMC Research Portal' }

export default async function HistoryPage() {
  const session = await auth()

  const runs = await prisma.agentRun.findMany({
    where: { status: 'DONE' },
    orderBy: { startedAt: 'desc' },
    take: 60,
    select: {
      id: true, runType: true, llmProvider: true,
      startedAt: true, completedAt: true, parsedOutput: true,
      user: { select: { name: true } },
    },
  })

  const serialized = runs.map((r) => ({
    id: r.id,
    runType: r.runType,
    llmProvider: r.llmProvider,
    startedAt: r.startedAt.toISOString(),
    completedAt: r.completedAt?.toISOString(),
    userName: r.user?.name ?? 'System',
    eventCount: r.parsedOutput ? JSON.parse(r.parsedOutput).events?.length ?? 0 : 0,
  }))

  return (
    <>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 className="h2">History</h1>
        <p className="text-secondary text-sm" style={{ marginTop: 4 }}>
          Past intelligence briefings — last {runs.length} completed runs
        </p>
      </div>

      {runs.length === 0 ? (
        <div className="card" style={{ padding: 'var(--space-16)', textAlign: 'center' }}>
          <p className="text-secondary">No completed runs yet. Run the intelligence agent from the dashboard.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Type</th>
                <th>Triggered By</th>
                <th>LLM</th>
                <th>Events Found</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {serialized.map((run) => {
                const duration = run.completedAt
                  ? Math.round((new Date(run.completedAt) - new Date(run.startedAt)) / 1000)
                  : null
                return (
                  <tr key={run.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {new Date(run.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="text-muted text-xs">
                        {new Date(run.startedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{run.runType}</span></td>
                    <td className="text-secondary text-sm">{run.userName}</td>
                    <td className="text-muted text-sm">{run.llmProvider ?? '—'}</td>
                    <td style={{ fontWeight: 600 }}>{run.eventCount}</td>
                    <td className="text-muted text-sm">
                      {duration != null ? `${duration}s` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

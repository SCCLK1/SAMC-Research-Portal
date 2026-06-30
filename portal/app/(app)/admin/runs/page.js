import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import RunsClient from './RunsClient'

export const metadata = { title: 'Agent Runs — AMC Research Portal' }

export default async function AdminRunsPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const runs = await prisma.agentRun.findMany({
    orderBy: { startedAt: 'desc' },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  })

  const serialized = runs.map((r) => ({
    id: r.id,
    runType: r.runType,
    status: r.status,
    llmProvider: r.llmProvider,
    startedAt: r.startedAt.toISOString(),
    completedAt: r.completedAt?.toISOString() ?? null,
    errorMessage: r.errorMessage,
    userName: r.user?.name ?? 'System Scheduler',
    userEmail: r.user?.email ?? null,
    rawOutput: r.rawOutput, // Send to let admin view raw output logs
  }))

  return <RunsClient runs={serialized} />
}

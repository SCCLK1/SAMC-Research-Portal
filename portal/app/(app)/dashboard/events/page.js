import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import DashboardClient from '../DashboardClient'

export const metadata = {
  title: 'News & Events — AMC Research Portal',
  description: 'Real-time verified equities market news and SEBI intelligence alerts',
}

export default async function NewsEventsPage() {
  const session = await auth()

  // Load fund manager profile
  const profile = await prisma.fundManagerProfile.findUnique({
    where: { userId: session.user.id },
  })

  // Load latest agent run
  const latestRun = await prisma.agentRun.findFirst({
    where: { status: 'DONE' },
    orderBy: { startedAt: 'desc' },
  })

  // Load user-specific event states (notes & statuses)
  const eventStates = await prisma.eventState.findMany({
    where: { userId: session.user.id },
  })

  const parsedOutput = latestRun?.parsedOutput ? JSON.parse(latestRun.parsedOutput) : null

  return (
    <DashboardClient
      user={session.user}
      profile={profile}
      initialEvents={parsedOutput?.events ?? []}
      initialMetadata={parsedOutput?.metadata ?? null}
      initialStates={eventStates.map(s => ({
        eventKey: s.eventKey,
        status: s.status,
        notes: s.notes,
      }))}
      latestRun={latestRun ? {
        id: latestRun.id,
        status: latestRun.status,
        completedAt: latestRun.completedAt?.toISOString(),
        llmProvider: latestRun.llmProvider,
        runType: latestRun.runType,
      } : null}
    />
  )
}

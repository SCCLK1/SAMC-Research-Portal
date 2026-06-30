import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import ResearchHubClient from '@/components/dashboard/ResearchHubClient'

export const metadata = {
  title: 'Research Hub — Shriram AMC Intelligence Portal',
  description: 'Your institutional equity research and intelligence hub',
}

export default async function DashboardPage() {
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

  const parsedOutput = latestRun?.parsedOutput ? JSON.parse(latestRun.parsedOutput) : null

  return (
    <ResearchHubClient
      user={session.user}
      profile={profile}
      events={parsedOutput?.events ?? []}
    />
  )
}

import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'


export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.fundManagerProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) return NextResponse.json(null)

  return NextResponse.json({
    ...profile,
    industries: JSON.parse(profile.industries ?? '[]'),
    stocks: JSON.parse(profile.stocks ?? '[]'),
    eventCategories: JSON.parse(profile.eventCategories ?? '[]'),
  })
}

export async function PUT(request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { industries, stocks, minActionability, minSeverity, eventCategories, alertScope } = body

  const profile = await prisma.fundManagerProfile.upsert({
    where: { userId: session.user.id },
    update: {
      industries: JSON.stringify(industries ?? []),
      stocks: JSON.stringify(stocks ?? []),
      minActionability: minActionability ?? 40,
      minSeverity: minSeverity ?? 3,
      eventCategories: JSON.stringify(eventCategories ?? []),
      alertScope: alertScope ?? 'ALL',
    },
    create: {
      userId: session.user.id,
      industries: JSON.stringify(industries ?? []),
      stocks: JSON.stringify(stocks ?? []),
      minActionability: minActionability ?? 40,
      minSeverity: minSeverity ?? 3,
      eventCategories: JSON.stringify(eventCategories ?? []),
      alertScope: alertScope ?? 'ALL',
    },
  })

  // Invalidate Next.js cache for the dashboard and event list pages
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/events')

  return NextResponse.json({ success: true, profile })
}

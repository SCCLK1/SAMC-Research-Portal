import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import UsersClient from './UsersClient'

export const metadata = { title: 'User Management — AMC Research Portal' }

export default async function UsersPage() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { profile: { select: { industries: true, stocks: true } } },
  })

  const serialized = users.map((u) => ({
    id: u.id, email: u.email, name: u.name,
    designation: u.designation, role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    lastLoginAt: u.lastLoginAt?.toISOString() ?? null,
    stockCount: u.profile ? JSON.parse(u.profile.stocks ?? '[]').length : 0,
    sectorCount: u.profile ? JSON.parse(u.profile.industries ?? '[]').length : 0,
  }))

  return <UsersClient users={serialized} currentUserId={session.user.id} />
}

import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await request.json()

  const allowed = {}
  if (typeof body.isActive === 'boolean') allowed.isActive = body.isActive
  if (body.role) allowed.role = body.role
  if (body.designation) allowed.designation = body.designation

  const user = await prisma.user.update({ where: { id }, data: allowed })
  return NextResponse.json({ success: true, user })
}

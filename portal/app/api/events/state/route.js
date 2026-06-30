import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PUT(request) {
  const session = await auth()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  try {
    const { eventKey, status, notes } = await request.json()
    if (!eventKey) return new NextResponse('eventKey is required', { status: 400 })

    const data = {}
    if (status !== undefined) data.status = status
    if (notes !== undefined) data.notes = notes

    const state = await prisma.eventState.upsert({
      where: {
        userId_eventKey: {
          userId: session.user.id,
          eventKey,
        },
      },
      update: data,
      create: {
        userId: session.user.id,
        eventKey,
        status: status ?? 'NEW',
        notes: notes ?? '',
      },
    })

    return NextResponse.json(state)
  } catch (error) {
    console.error('Error saving event state:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

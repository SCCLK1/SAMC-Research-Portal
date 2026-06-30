import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { name, email, designation, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email address is already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Create user and a default profile together in a database transaction
    const user = await prisma.user.create({
      data: {
        name,
        email,
        designation: designation || null,
        passwordHash,
        role: 'FUND_MANAGER',
        profile: {
          create: {
            industries: '[]',
            stocks: '[]',
            eventCategories: '[]',
            minActionability: 40,
            minSeverity: 3,
            alertScope: 'ALL',
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    // Prisma unique constraint violation — email already exists
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email address is already registered' }, { status: 409 })
    }
    const message = process.env.NODE_ENV === 'development'
      ? `${error.message} (${error.code ?? error.constructor.name})`
      : 'Registration failed. Please try again.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

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
        designation: designation || 'Research Analyst',
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

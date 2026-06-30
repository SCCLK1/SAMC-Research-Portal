import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const password = searchParams.get('password')
  
  const logs = []
  
  try {
    logs.push('Debug login simulation started')
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password parameters are required', logs })
    }
    
    logs.push(`Searching for user with email: ${email}`)
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    logs.push(`User query complete. Found user: ${!!user}`)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found in database', logs })
    }
    
    logs.push(`User details: id=${user.id}, isActive=${user.isActive}, role=${user.role}`)
    logs.push(`Comparing passwords using bcrypt...`)
    const match = await bcrypt.compare(password, user.passwordHash)
    
    logs.push(`Bcrypt comparison complete. Match: ${match}`)
    if (!match) {
      return NextResponse.json({ success: false, error: 'Password does not match passwordHash', logs })
    }
    
    logs.push(`Updating lastLoginAt for user...`)
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })
    logs.push(`Last login update complete. lastLoginAt=${updated.lastLoginAt}`)
    
    return NextResponse.json({
      success: true,
      message: 'Simulation complete. Login would succeed.',
      logs,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        designation: updated.designation
      }
    })
  } catch (error) {
    logs.push(`ERROR encountered: ${error.message}`)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      logs
    }, { status: 500 })
  }
}

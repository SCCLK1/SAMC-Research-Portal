import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const kpPassword = await bcrypt.hash('Shriram@123', 12)
    const adminPassword = await bcrypt.hash('Admin@123', 12)
    
    // Reset admin user password
    await prisma.user.updateMany({
      where: { email: 'admin@amcportal.in' },
      data: { passwordHash: adminPassword }
    })
    
    // Reset Karthikeyan user password and enforce admin role
    const kp = await prisma.user.update({
      where: { email: 'karthikeyan.parthiban@shriramcredit.in' },
      data: { 
        passwordHash: kpPassword,
        role: 'ADMIN'
      }
    })
    
    return NextResponse.json({
      success: true,
      message: `Passwords successfully reset for admin users.`,
      user: kp.email,
      role: kp.role
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}

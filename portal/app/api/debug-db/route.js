import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const start = Date.now()
    
    // Test count of users
    const count = await prisma.user.count()
    
    const duration = Date.now() - start
    
    return NextResponse.json({
      success: true,
      message: 'Database query executed successfully',
      user_count: count,
      duration_ms: duration
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 })
  }
}

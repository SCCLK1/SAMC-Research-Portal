import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({
    has_DATABASE_URL: !!process.env.DATABASE_URL,
    has_POSTGRES_PRISMA_URL: !!process.env.POSTGRES_PRISMA_URL,
    keys: Object.keys(process.env).filter(k => k.includes('DB') || k.includes('URL') || k.includes('POSTGRES')),
    env_keys_count: Object.keys(process.env).length
  })
}

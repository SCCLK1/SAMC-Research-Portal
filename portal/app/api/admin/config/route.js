import { auth } from '@/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import { setConfigValue, getConfigValue } from '@/lib/config'

export const dynamic = 'force-dynamic'


const CONFIG_KEYS = [
  'ACTIVE_LLM',
  'GEMINI_API_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'NVIDIA_NIM_API_KEY',
  'NVIDIA_NIM_MODEL',
  'SEARCH_PROVIDER',
  'SEARCH_API_KEY',
  'SCHEDULER_ENABLED',
  'SCHEDULER_CRON',
]

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const config = {}
  for (const key of CONFIG_KEYS) {
    const rawVal = await getConfigValue(key)
    if (key.endsWith('_KEY') && rawVal) {
      // Mask key for UI
      config[key] = rawVal.length > 8 ? `${rawVal.slice(0, 4)}...${rawVal.slice(-4)}` : '••••••••'
      config[`has_${key}`] = true
    } else {
      config[key] = rawVal ?? ''
      if (key.endsWith('_KEY')) {
        config[`has_${key}`] = false
      }
    }
  }

  return NextResponse.json(config)
}

export async function PUT(request) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()

  for (const key of CONFIG_KEYS) {
    if (body[key] !== undefined) {
      const val = body[key]
      // If a masked key is sent back, don't update it (unless it's changed)
      if (key.endsWith('_KEY') && (val === '••••••••' || val.includes('...'))) {
        continue
      }
      await setConfigValue(key, val)
    }
  }

  return NextResponse.json({ success: true })
}

import cron from 'node-cron'
import { runAgent } from '@/lib/agent'
import { prisma } from '@/lib/db'

let scheduledTask = null

export function startScheduler() {
  if (scheduledTask) return // already running

  const cronExpression = process.env.SCHEDULER_CRON ?? '30 1 * * *' // 7 AM IST = 01:30 UTC

  console.log(`[Scheduler] Starting with cron: ${cronExpression} (7 AM IST daily)`)

  scheduledTask = cron.schedule(cronExpression, async () => {
    const enabled = await isSchedulerEnabled()
    if (!enabled) {
      console.log('[Scheduler] Scheduler is disabled in config — skipping run')
      return
    }

    console.log('[Scheduler] Starting scheduled morning agent run...')
    try {
      await runAgent({
        userId: null,
        runType: 'SCHEDULED',
        profile: null, // system-wide run for all constituents
        onProgress: (msg) => console.log(`[Scheduler] ${msg}`),
      })
      console.log('[Scheduler] Morning run completed successfully')
    } catch (err) {
      console.error('[Scheduler] Morning run failed:', err.message)
    }
  })
}

export function stopScheduler() {
  if (scheduledTask) {
    scheduledTask.destroy()
    scheduledTask = null
    console.log('[Scheduler] Stopped')
  }
}

async function isSchedulerEnabled() {
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'SCHEDULER_ENABLED' },
    })
    return config?.value !== 'false'
  } catch {
    return true
  }
}

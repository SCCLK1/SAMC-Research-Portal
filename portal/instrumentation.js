// Next.js instrumentation hook — runs once on server startup.
// Used to initialize the scheduler so the daily 7 AM IST run kicks in.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startScheduler } = await import('@/lib/scheduler')
    startScheduler()
  }
}

const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const { PrismaLibSql } = require('@prisma/adapter-libsql')

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db'
const url = dbUrl.startsWith('file:') ? dbUrl : `file:${dbUrl}`
const adapter = new PrismaLibSql({ url })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Inserting a new AgentRun with 100 news events for today...')

  // Load the 100 events from demoEvents50.json
  const eventsPath = path.join(__dirname, '../lib/agent/demoEvents50.json')
  if (!fs.existsSync(eventsPath)) {
    console.error(`Error: demoEvents50.json not found at ${eventsPath}`)
    process.exit(1)
  }

  const demoEvents = JSON.parse(fs.readFileSync(eventsPath, 'utf8'))
  console.log(`Loaded ${demoEvents.length} events from demoEvents50.json`)

  // Update timestamps/ages of events to reflect "today" (July 15, 2026)
  const updatedEvents = demoEvents.map(event => {
    // If the event has an age or date, we can anchor it to today
    // E.g., make it "Today" or "Just now" or "2 hours ago"
    return {
      ...event,
      age: "Just now",
      // If it contains a date in description or text, we can leave it or adapt it.
    }
  })

  // Prepare metadata
  const demoMetadata = {
    scanDate: new Date().toISOString(),
    indexAnalyzed: "Nifty 500",
    totalScannedSources: 250,
    totalEventsIdentified: 120,
    totalEventsReported: updatedEvents.length,
    avgConfidenceScore: "91.5",
    processingDurationMs: 12500
  }

  // Create the run
  const run = await prisma.agentRun.create({
    data: {
      userId: null, // system run
      runType: 'ON_DEMAND',
      status: 'DONE',
      llmProvider: 'gemini (simulated)',
      rawOutput: 'SIMULATED RUN OUTPUT FOR JULY 15, 2026',
      parsedOutput: JSON.stringify({ events: updatedEvents, metadata: demoMetadata }),
      startedAt: new Date(),
      completedAt: new Date(),
    }
  })

  console.log(`✅ AgentRun created successfully! Run ID: ${run.id}`)
  console.log(`Timestamps set to: ${run.startedAt}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

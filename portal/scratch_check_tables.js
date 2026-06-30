const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function run() {
  const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`
  console.log('DB Tables:', tables.map(t => t.name).join(', '))
  await prisma.$disconnect()
}

run().catch(e => console.error('ERROR:', e.message))

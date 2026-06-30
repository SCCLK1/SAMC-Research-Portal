const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')
const bcrypt = require('bcryptjs')

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function run() {
  try {
    const h = await bcrypt.hash('test123', 12)
    const u = await prisma.user.create({
      data: {
        name: 'AdminTest',
        email: `admintest${Date.now()}@amcportal.in`,
        designation: null,
        role: 'FUND_MANAGER',
        passwordHash: h
        // NOTE: no profile created here — same as admin users API
      }
    })
    console.log('SUCCESS (no profile):', u.id, u.email)
  } catch (e) {
    console.error('ERROR:', e.message, '| Code:', e.code, '| Type:', e.constructor.name)
  } finally {
    await prisma.$disconnect()
  }
}

run()

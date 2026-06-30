const { PrismaClient } = require('@prisma/client')
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3')

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function run() {
  const user = await prisma.user.findUnique({ where: { email: 'karthikeyan.parthiban@shriramcredit.in' } })
  if (!user) {
    console.log('User NOT found. Existing users:')
    const all = await prisma.user.findMany({ select: { email: true, role: true } })
    all.forEach(u => console.log(' -', u.email, '|', u.role))
  } else {
    const updated = await prisma.user.update({
      where: { email: 'karthikeyan.parthiban@shriramcredit.in' },
      data: { role: 'ADMIN' },
    })
    console.log('SUCCESS: Updated', updated.email, '→ role:', updated.role)
  }
  await prisma.$disconnect()
}

run().catch(e => console.error('ERROR:', e.message))

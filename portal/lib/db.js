import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    const rawUrl = process.env.DATABASE_URL || 'file:./dev.db'
    const url = rawUrl.startsWith('file:') ? rawUrl : `file:${rawUrl}`
    
    const adapter = new PrismaLibSql({ url })
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  return globalForPrisma.prisma
}

export const prisma = new Proxy({}, {
  get(target, prop) {
    const client = getPrismaClient()
    return Reflect.get(client, prop)
  }
})



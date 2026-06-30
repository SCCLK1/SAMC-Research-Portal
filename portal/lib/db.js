import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock'
    const isMock = connectionString.includes('localhost') || connectionString.includes('mock')
    
    const pool = new Pool({ 
      connectionString,
      ssl: isMock ? false : { rejectUnauthorized: false }
    })
    
    const adapter = new PrismaPg(pool)
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



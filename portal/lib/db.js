import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis

function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    const connectionString = 
      process.env.DATABASE_URL_UNPOOLED || 
      process.env.DATABASE_URL || 
      process.env.POSTGRES_PRISMA_URL || 
      'postgresql://mock:mock@localhost:5432/mock'
      
    const isMock = connectionString.includes('localhost') || connectionString.includes('mock')
    
    const pool = new Pool({ 
      connectionString,
      ssl: isMock ? false : { rejectUnauthorized: false },
      max: 1,                     // Serverless environment: use 1 connection max per container
      idleTimeoutMillis: 1000,    // Close connections quickly when idle to avoid Neon exhaustion
      connectionTimeoutMillis: 5000 // Fail fast if Neon connections are exhausted
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



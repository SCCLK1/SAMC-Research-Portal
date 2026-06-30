import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  return new PrismaClient()
}

const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


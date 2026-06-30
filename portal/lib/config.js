import { prisma } from './db'

/**
 * Gets a system configuration value, checking DB first, then process.env
 */
export async function getConfigValue(key, fallback = '') {
  try {
    const dbConfig = await prisma.systemConfig.findUnique({
      where: { key },
    })
    if (dbConfig && dbConfig.value) {
      return dbConfig.value
    }
  } catch (error) {
    console.error(`Error reading config key ${key} from database:`, error)
  }
  return process.env[key] ?? fallback
}

/**
 * Sets a system configuration value in the DB
 */
export async function setConfigValue(key, value) {
  return prisma.systemConfig.upsert({
    where: { key },
    update: { value: String(value) },
    create: { key, value: String(value) },
  })
}

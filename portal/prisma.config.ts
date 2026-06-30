import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// Prisma v7 configuration — database URL moved here from schema.prisma
// To migrate to PostgreSQL later:
//   1. Change datasource.url to your PostgreSQL connection string
//   2. Update the provider in schema.prisma to "postgresql"
//   3. Install @prisma/adapter-pg and update lib/db.js
//   4. Run: npx prisma migrate deploy
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
})

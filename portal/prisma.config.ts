import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// Prisma v7 configuration — database URL moved here from schema.prisma
// To migrate to PostgreSQL later:
//   1. Change datasource.url to your PostgreSQL connection string
//   2. Update the provider in schema.prisma to "postgresql"
//   3. Install @prisma/adapter-pg and update lib/db.js
//   4. Run: npx prisma migrate deploy
let url
if (process.env.POSTGRES_PRISMA_URL) {
  url = env('POSTGRES_PRISMA_URL')
} else if (process.env.DATABASE_URL) {
  url = env('DATABASE_URL')
} else {
  url = 'postgresql://mock:mock@localhost:5432/mock'
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url,
  },
})

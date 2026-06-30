const { defineConfig } = require('prisma/config')

// Allow DATABASE_URL env var to override the default dev path.
// In production (EC2) the deploy workflow sets DATABASE_URL=file:./prod.db.
module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
})

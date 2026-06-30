const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()


async function main() {
  console.log('🌱 Seeding database...')

  // Default system config
  const configs = [
    { key: 'ACTIVE_LLM', value: 'gemini' },
    { key: 'SCHEDULER_ENABLED', value: 'true' },
    { key: 'SCHEDULER_CRON', value: '30 1 * * *' },
    { key: 'SEARCH_PROVIDER', value: 'serper' },
  ]

  for (const config of configs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: {},
      create: config,
    })
  }

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@amcportal.in' },
    update: {},
    create: {
      email: 'admin@amcportal.in',
      name: 'System Admin',
      designation: 'Administrator',
      role: 'ADMIN',
      passwordHash: adminPassword,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Sample Fund Manager 1
  const fm1Password = await bcrypt.hash('FundMgr@123', 12)
  const fm1 = await prisma.user.upsert({
    where: { email: 'rahul.sharma@amcportal.in' },
    update: {},
    create: {
      email: 'rahul.sharma@amcportal.in',
      name: 'Rahul Sharma',
      designation: 'Fund Manager — Equities',
      role: 'FUND_MANAGER',
      passwordHash: fm1Password,
      profile: {
        create: {
          industries: JSON.stringify(['Banking & Finance', 'Information Technology', 'Telecom']),
          stocks: JSON.stringify([
            { ticker: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking & Finance' },
            { ticker: 'INFY', name: 'Infosys Ltd', sector: 'Information Technology' },
            { ticker: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy' },
            { ticker: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom' },
          ]),
          minActionability: 40,
          minSeverity: 3,
          eventCategories: JSON.stringify(['Earnings', 'Regulatory', 'M&A', 'Business Expansion']),
          alertScope: 'ALL',
        },
      },
    },
  })
  console.log('✅ Fund Manager created:', fm1.email)

  // Sample Fund Manager 2
  const fm2Password = await bcrypt.hash('FundMgr@123', 12)
  const fm2 = await prisma.user.upsert({
    where: { email: 'priya.nair@amcportal.in' },
    update: {},
    create: {
      email: 'priya.nair@amcportal.in',
      name: 'Priya Nair',
      designation: 'Fund Manager — Pharma & Healthcare',
      role: 'FUND_MANAGER',
      passwordHash: fm2Password,
      profile: {
        create: {
          industries: JSON.stringify(['Pharmaceuticals', 'Healthcare', 'FMCG']),
          stocks: JSON.stringify([
            { ticker: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', sector: 'Pharmaceuticals' },
            { ticker: 'DRREDDY', name: "Dr. Reddy's Laboratories Ltd", sector: 'Pharmaceuticals' },
            { ticker: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG' },
          ]),
          minActionability: 50,
          minSeverity: 3,
          eventCategories: JSON.stringify(['Earnings', 'Regulatory', 'Legal', 'Sector']),
          alertScope: 'MY_SECTORS',
        },
      },
    },
  })
  console.log('✅ Fund Manager created:', fm2.email)

  console.log('\n🎉 Seed complete!')
  console.log('\nDefault credentials:')
  console.log('  Admin:        admin@amcportal.in / Admin@123')
  console.log('  Fund Manager: rahul.sharma@amcportal.in / FundMgr@123')
  console.log('  Fund Manager: priya.nair@amcportal.in / FundMgr@123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

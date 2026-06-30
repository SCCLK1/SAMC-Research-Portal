import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const results = []
    
    // 1. Read and execute the SQL schema
    const schemaPath = path.join(process.cwd(), 'schema.sql')
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8')
      // Split by semicolon, filter out comments and empty statements
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

      results.push(`Executing ${statements.length} schema SQL statements...`)
      
      for (const statement of statements) {
        try {
          await prisma.$executeRawUnsafe(statement)
        } catch (err) {
          // If table already exists, ignore and continue
          if (!err.message.includes('already exists') && !err.message.includes('already a primary key')) {
            results.push(`SQL Error: ${err.message} (Statement: ${statement.substring(0, 50)}...)`)
          }
        }
      }
      results.push('Schema setup queries executed.')
    } else {
      return NextResponse.json({ error: 'schema.sql not found in project root' }, { status: 404 })
    }

    // 2. Default System Config
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
    results.push('System config seeded.')

    // 3. Admin User
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
    results.push(`Admin user: ${admin.email}`)

    // 4. Karthikeyan Parthiban (Admin)
    const kpPassword = await bcrypt.hash('Shriram@123', 12)
    const kp = await prisma.user.upsert({
      where: { email: 'karthikeyan.parthiban@shriramcredit.in' },
      update: { role: 'ADMIN' },
      create: {
        email: 'karthikeyan.parthiban@shriramcredit.in',
        name: 'Karthikeyan Parthiban',
        designation: 'Administrator',
        role: 'ADMIN',
        passwordHash: kpPassword,
      },
    })
    results.push(`Karthikeyan Parthiban: ${kp.email} (role: ${kp.role})`)

    // 5. Rahul Sharma (FM 1)
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
    results.push(`Rahul Sharma: ${fm1.email}`)

    // 6. Priya Nair (FM 2)
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
    results.push(`Priya Nair: ${fm2.email}`)

    return NextResponse.json({
      success: true,
      message: 'Database migrated and seeded successfully',
      logs: results
    })
  } catch (error) {
    console.error('Migration endpoint error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}

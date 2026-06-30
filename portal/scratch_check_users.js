const fs = require('fs')
const sqlite3 = require('better-sqlite3')

let dbPath = './dev.db'
if (!fs.existsSync(dbPath)) {
  dbPath = './prisma/dev.db'
}

if (!fs.existsSync(dbPath)) {
  console.log('Database file not found in ./dev.db or ./prisma/dev.db')
  process.exit(1)
}

console.log('Using database file: ' + dbPath)
const db = new sqlite3(dbPath)
const users = db.prepare('SELECT id, email, name, role, designation FROM User').all()
console.log('--- USERS IN DATABASE ---')
console.log(users)
db.close()

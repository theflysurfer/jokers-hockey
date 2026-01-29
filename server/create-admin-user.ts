import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { users } from '@shared/schema'
import { eq } from 'drizzle-orm'

async function createAdminUser() {
  const email = 'admin'
  const password = 'JokersAdmin2026!'

  console.log('🔐 Creating admin user...')

  try {
    // Check if admin already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, email))
      .limit(1)
      .then(rows => rows[0])

    if (existingUser) {
      console.log('⚠️  Admin user already exists')
      console.log(`   Username: ${email}`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    await db.insert(users).values({
      username: email,
      password: hashedPassword,
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   Username: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('')
    console.log('🔐 IMPORTANT: Change this password after first login!')
    console.log('   Access: https://jokers.srv759970.hstgr.cloud/admin')

    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to create admin user:', error)
    process.exit(1)
  }
}

createAdminUser()

import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { users } from '@shared/schema'
import { eq } from 'drizzle-orm'

async function createAdminUser() {
  const email = 'dirjokersrha@outlook.fr'
  const username = 'admin'
  const password = 'JokersAdmin2026!'

  console.log('🔐 Creating admin user...')

  try {
    // Check if admin already exists (check by email since it's the unique constraint)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then(rows => rows[0])

    if (existingUser) {
      console.log('⚠️  Admin user already exists')
      console.log(`   Email: ${email}`)
      console.log(`   Username: ${username}`)
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    await db.insert(users).values({
      email: email,
      username: username,
      password: hashedPassword,
      role: 'admin',
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

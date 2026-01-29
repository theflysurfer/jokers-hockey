import { getPayload } from 'payload'
import config from '../payload.config'

const createAdmin = async () => {
  const payload = await getPayload({ config })

  try {
    // Check if admin already exists
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: 'dirjokersrha@outlook.fr',
        },
      },
    })

    if (existingUsers.docs.length > 0) {
      console.log('⚠️  Admin user already exists')
      process.exit(0)
    }

    // Create admin user
    await payload.create({
      collection: 'users',
      data: {
        email: 'dirjokersrha@outlook.fr',
        password: process.env.ADMIN_PASSWORD || 'change-me-asap-jokers2025',
        username: 'admin',
        role: 'admin',
      },
    })

    console.log('✅ Admin user created successfully')
    console.log('   Email: dirjokersrha@outlook.fr')
    console.log('   Password:', process.env.ADMIN_PASSWORD || 'change-me-asap-jokers2025')
    console.log('   ⚠️  Please change the password after first login!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to create admin user:', error)
    process.exit(1)
  }
}

createAdmin()

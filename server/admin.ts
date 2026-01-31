import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from '@adminjs/sql'
import { db } from './db'
import * as schema from '@shared/schema'
import session from 'express-session'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { Express } from 'express'

// Register SQL adapter
AdminJS.registerAdapter({ Database, Resource })

// Create AdminJS instance
export const createAdminJS = async () => {
  // Create database instance for AdminJS
  const adminDb = await new Database('postgresql', {
    connectionString: process.env.DATABASE_URL!,
    database: 'jokers_prod',
  })

  const admin = new AdminJS({
    databases: [adminDb],
    rootPath: '/admin',
    branding: {
      companyName: 'Jokers Aubagne',
      logo: '/assets/logo.svg',
      favicon: '/assets/logo.svg',
      softwareBrothers: false,
    },
    resources: [],
  })

  return admin
}

// Setup AdminJS with authentication
export const setupAdminJS = async (app: Express) => {
  const admin = await createAdminJS()

  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (emailOrUsername, password) => {
        // Find user by email or username
        let user = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.email, emailOrUsername))
          .limit(1)
          .then(rows => rows[0])

        // If not found by email, try username
        if (!user) {
          user = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.username, emailOrUsername))
            .limit(1)
            .then(rows => rows[0])
        }

        if (!user) {
          return null
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          email: user.email || user.username,
          id: user.id,
        }
      },
      cookieName: 'adminjs',
      cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'super-secret-and-long-cookie-password-change-in-production',
    },
    null,
    {
      store: undefined, // Using default memory store for now
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || 'super-secret-session-password-change-in-production',
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      },
      name: 'adminjs.sid',
    }
  )

  app.use(admin.options.rootPath, router)

  return admin
}

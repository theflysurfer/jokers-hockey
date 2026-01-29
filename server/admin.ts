import AdminJS from 'adminjs'
import AdminJSExpress from '@adminjs/express'
import { Database, Resource } from 'adminjs-drizzle'
import { db } from './db'
import * as schema from '@shared/schema'
import session from 'express-session'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import type { Express } from 'express'

// Register Drizzle adapter
AdminJS.registerAdapter({ Database, Resource })

// Create AdminJS instance
export const createAdminJS = () => {
  const admin = new AdminJS({
    databases: [{
      db,
      schema,
    }],
    rootPath: '/admin',
    branding: {
      companyName: 'Jokers Aubagne',
      logo: '/assets/logo.svg',
      favicon: '/assets/logo.svg',
      softwareBrothers: false,
    },
    resources: [
      {
        resource: schema.matches,
        options: {
          navigation: {
            name: 'Matchs',
            icon: 'Calendar',
          },
          properties: {
            id: { isVisible: { list: false, filter: false, show: true, edit: false } },
            createdAt: { isVisible: { list: true, filter: true, show: true, edit: false } },
          },
        },
      },
      {
        resource: schema.photos,
        options: {
          navigation: {
            name: 'Médias',
            icon: 'Camera',
          },
          properties: {
            id: { isVisible: { list: false, filter: false, show: true, edit: false } },
            imageUrl: {
              type: 'string',
              isVisible: { list: true, filter: false, show: true, edit: true },
            },
          },
        },
      },
      {
        resource: schema.videos,
        options: {
          navigation: {
            name: 'Médias',
            icon: 'Video',
          },
          properties: {
            id: { isVisible: { list: false, filter: false, show: true, edit: false } },
          },
        },
      },
      {
        resource: schema.staff,
        options: {
          navigation: {
            name: 'Équipe',
            icon: 'Users',
          },
          properties: {
            id: { isVisible: { list: false, filter: false, show: true, edit: false } },
            order: { type: 'number' },
          },
        },
      },
      {
        resource: schema.announcements,
        options: {
          navigation: {
            name: 'Actualités',
            icon: 'Megaphone',
          },
          properties: {
            id: { isVisible: { list: false, filter: false, show: true, edit: false } },
            content: { type: 'textarea' },
            isPublished: { type: 'boolean' },
          },
        },
      },
      {
        resource: schema.newsletters,
        options: {
          navigation: {
            name: 'Newsletter',
            icon: 'Mail',
          },
          properties: {
            id: { isVisible: { list: false, filter: false, show: true, edit: false } },
          },
        },
      },
      {
        resource: schema.users,
        options: {
          navigation: {
            name: 'Administration',
            icon: 'Settings',
          },
          properties: {
            id: { isVisible: { list: false, filter: false, show: true, edit: false } },
            password: {
              type: 'password',
              isVisible: { list: false, filter: false, show: false, edit: true },
            },
          },
        },
      },
    ],
  })

  return admin
}

// Setup AdminJS with authentication
export const setupAdminJS = (app: Express) => {
  const admin = createAdminJS()

  const router = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
      authenticate: async (email, password) => {
        // Find user by username or email
        const user = await db
          .select()
          .from(schema.users)
          .where(eq(schema.users.username, email))
          .limit(1)
          .then(rows => rows[0])

        if (!user) {
          return null
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          email: user.username,
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

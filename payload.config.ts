import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Import collections
import { Users } from './collections/Users'
import { Teams } from './collections/Teams'
import { Players } from './collections/Players'
import { Matches } from './collections/Matches'
import { MatchEvents } from './collections/MatchEvents'
import { Stadiums } from './collections/Stadiums'
import { Media } from './collections/Media'
import { Photos } from './collections/Photos'
import { Videos } from './collections/Videos'
import { Staff } from './collections/Staff'
import { NewsletterSubscriptions } from './collections/NewsletterSubscriptions'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'your-super-secret-key-change-this',
  routes: {
    api: '/api',
    admin: '/admin',
    graphQL: '/graphql',
  },
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Jokers Aubagne Admin',
      favicon: '/assets/logo.svg',
      ogImage: '/assets/logo.svg',
    },
  },
  collections: [
    Users,
    Teams,
    Players,
    Matches,
    MatchEvents,
    Stadiums,
    Media,
    Photos,
    Videos,
    Staff,
    NewsletterSubscriptions,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:5000',
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:5000',
  ].filter(Boolean),
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:5000',
  ].filter(Boolean),
})

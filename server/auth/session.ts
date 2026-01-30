import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import pkg from 'pg';
const { Pool } = pkg;

const PgSession = connectPgSimple(session);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const sessionStore = new PgSession({
  pool,
  tableName: 'user_sessions',
  createTableIfMissing: true,
});

export const sessionConfig: session.SessionOptions = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET || 'jokers-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  },
  name: 'jokers.sid',
};

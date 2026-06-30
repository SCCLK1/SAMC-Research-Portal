// auth.config.js — Edge-compatible auth config (no Node.js modules)
// Used ONLY by middleware.js (Edge Runtime).
// The full auth.js with Prisma adapter is used by server components.
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authConfig = {
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'shriram-amc-intelligence-portal-secret-key-1234567890',
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  // Credentials provider stub — actual auth logic lives in auth.js.
  // This is edge-safe: no Prisma, no bcrypt, no fs.
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      // authorize is intentionally empty here — it runs in auth.js (Node.js runtime)
      authorize: () => null,
    }),
  ],
  callbacks: {
    // jwt and session callbacks are needed so the middleware can read the token
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.designation = user.designation
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.designation = token.designation
      }
      return session
    },
  },
}

export const { auth: edgeAuth } = NextAuth(authConfig)

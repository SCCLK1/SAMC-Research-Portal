// Full auth.js — runs in Node.js runtime only (server components, API routes).
// Uses JWT strategy — no database adapter needed (no Account/Session tables required).
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { authConfig } from '@/auth.config'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // No adapter — JWT strategy stores session in signed cookie, no DB tables required.
  // Override providers here with the real authorize implementation
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.isActive) return null

        const passwordMatch = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!passwordMatch) return null

        // Update last login timestamp
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          designation: user.designation,
        }
      },
    }),
  ],
})

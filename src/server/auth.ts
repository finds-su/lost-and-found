import { type GetServerSidePropsContext } from 'next'
import { getServerSession, type NextAuthOptions, type DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/server/db'
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google'
import { nicknameValidation } from '@/lib/nicknameValidation'
import GithubProvider, { type GithubProfile } from 'next-auth/providers/github'
import { type Role } from '@prisma/client'
import { env } from '@/env.mjs'

interface ArUser {
  ID: string
  NAME: string
  LAST_NAME: string
  SECOND_NAME: string
  PHOTO: string
  EMAIL: string
  LOGIN: string
}

interface MireaProfile {
  ID: number
  arUser: ArUser
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      nickname: string
      role?: Role
      userInfo?: string
      telegramLink?: string
      isBlockedUntil?: Date
    } & DefaultSession['user']
  }

  interface User {
    nickname: string
    role?: Role
    userInfo?: string
    telegramLink?: string
    isBlockedUntil?: Date
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        session.user.nickname = user.nickname
        session.user.userInfo = user.userInfo
        session.user.role = user.role
        session.user.isBlockedUntil = user.isBlockedUntil
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      async profile(profile: GithubProfile) {
        return {
          id: profile.id.toString(),
          nickname: await nicknameValidation(profile.login),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      async profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          nickname: await nicknameValidation(profile.email.split('@')[0] ?? ''),
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    {
      id: 'mirea',
      name: 'Mirea',
      type: 'oauth',
      version: '2.0',
      accessTokenUrl: 'https://lks.mirea.ninja/oauth/token',
      requestTokenUrl: 'https://lks.mirea.ninja/oauth/token',
      authorization: {
        url: 'https://lks.mirea.ninja/oauth/authorize',
        params: { scope: 'profile' },
      },
      token: {
        url: 'https://lks.mirea.ninja/oauth/token',
      },
      userinfo: {
        url: 'https://lks.mirea.ninja/api/?action=getData&url=https://lk.mirea.ru/profile/',
      },
      checks: ['state'],
      async profile(profile: MireaProfile) {
        const name = [profile.arUser.NAME, profile.arUser.LAST_NAME].join(' ')
        return {
          id: profile.arUser.ID,
          name,
          nickname: await nicknameValidation(name),
          email: profile.arUser.LOGIN,
          image: 'https://lk.mirea.ru' + profile.arUser.PHOTO,
        }
      },
      clientId: env.MIREA_CLIENT_ID,
      clientSecret: env.MIREA_CLIENT_SECRET,
    },
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}

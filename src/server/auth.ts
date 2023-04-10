import { type GetServerSidePropsContext } from 'next'
import { getServerSession, type NextAuthOptions, type DefaultSession, DefaultUser } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/server/db'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import { DateTime } from 'next-auth/providers/kakao'
import { mockProviders, mockSession } from 'next-auth/client/__tests__/helpers/mocks'
import authorize = mockProviders.credentials.authorize
import { OAuthConfig } from 'next-auth/providers'
import { User } from '@prisma/client'
import image = mockSession.user.image

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
      telegramLink?: string
    } & DefaultSession['user'] & { user: { name: unknown } }
  }

  interface User {
    nickname: string
    firstName: string
    secondName?: string
    lastName: string
    role?: Role
    telegramLink?: string
  }
}

enum Role {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
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
        session.user.role = user.role
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GOOGLE_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      profile(profile: GoogleProfile) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: profile.at_hash,
          nickname: profile.name,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified ? new Date() : null,
          firstName: profile.given_name,
          lastName: profile.family_name,
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
      profile(profile: MireaProfile) {
        let name =
          profile.arUser.NAME + ' ' + profile.arUser.SECOND_NAME + ' ' + profile.arUser.LAST_NAME
        if (profile.arUser.SECOND_NAME == '') {
          name = profile.arUser.NAME + ' ' + profile.arUser.LAST_NAME
        }
        return {
          id: profile.arUser.ID,
          name,
          nickname:
            profile.arUser.NAME +
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            (profile.arUser.LAST_NAME ? ` ${profile.arUser.LAST_NAME.at(0)}.` : ''),
          firstName: profile.arUser.NAME,
          secondName: profile.arUser.SECOND_NAME,
          lastName: profile.arUser.LAST_NAME,
          email: profile.arUser.LOGIN,
          image: 'https://lk.mirea.ru' + profile.arUser.PHOTO,
        }
      },
      clientId: process.env.MIREA_CLIENT_ID,
      clientSecret: process.env.MIREA_CLIENT_SECRET,
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

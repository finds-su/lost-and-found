import { type GetServerSidePropsContext } from 'next'
import { getServerSession, type NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/server/db'
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google'
import { nicknameValidation } from '@/lib/nickname-validation'
import GithubProvider, { type GithubProfile } from 'next-auth/providers/github'
import { Role } from '@prisma/client'
import { env } from '@/env.mjs'
import { type User as PrismaUser } from '@prisma/client'
import MireaNinjaLksProvider from '@/server/auth-providers/mirea-ninja-lks-provider'
import MireaProvider from './auth-providers/mirea-provider'
import DarkMireaLoginProvider from './auth-providers/dark-mirea-login'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends Omit<PrismaUser, 'secretSocialNetworksAuthPayload'> {}

  interface Session {
    user: User
  }
}

const getProviders = () => {
  const providers = []
  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GithubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        async profile(profile: GithubProfile) {
          return {
            id: profile.id.toString(),
            name: profile.name ?? profile.login,
            nickname: await nicknameValidation(profile.login),
            email: profile.email,
            emailVerified: new Date(),
            userInfo: null,
            role: Role.USER,
            image: profile.avatar_url,
            isBlocked: false,
            blockReason: null,
          }
        },
      }),
    )
  }
  if (env.MIREA_CLIENT_ID && env.MIREA_CLIENT_SECRET) {
    providers.push(
      MireaProvider({ clientId: env.MIREA_CLIENT_ID, clientSecret: env.MIREA_CLIENT_SECRET }),
    )
  }
  if (env.MIREA_LKS_CLIENT_ID && env.MIREA_LKS_CLIENT_SECRET) {
    providers.push(
      MireaNinjaLksProvider({
        clientId: env.MIREA_LKS_CLIENT_ID,
        clientSecret: env.MIREA_LKS_CLIENT_SECRET,
      }),
    )
  }
  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.push(
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
            name: profile.name,
            nickname: await nicknameValidation(profile.email.split('@')[0] ?? ''),
            email: profile.email,
            emailVerified: new Date(),
            userInfo: null,
            role: Role.USER,
            image: profile.picture,
            isBlocked: false,
            blockReason: null,
          }
        },
      }),
    )
  }

  providers.push(DarkMireaLoginProvider())

  return providers
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
        session.user.name = user.name
        session.user.nickname = user.nickname
        session.user.email = user.email
        session.user.userInfo = user.userInfo
        session.user.role = user.role
        session.user.image = user.image
        session.user.isBlocked = user.isBlocked
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    ...getProviders(),
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

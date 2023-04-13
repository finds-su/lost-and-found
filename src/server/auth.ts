import { type GetServerSidePropsContext } from 'next'
import { getServerSession, type NextAuthOptions, type DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/server/db'
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google'
import { getUniqueNickname } from '@/utils/getUniqueNickname'
import GithubProvider, { type GithubProfile } from 'next-auth/providers/github'

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
    } & DefaultSession['user'] & { user: { name: unknown } }
  }

  interface User {
    nickname: string
    role?: Role
    userInfo?: string
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
        session.user.userInfo = user.userInfo
        session.user.role = user.role
      }
      return session
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GITHUB_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      async profile(profile: GithubProfile) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: profile.id.toString(),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          nickname: await getUniqueNickname(profile.login),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
    }),
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
      async profile(profile: GoogleProfile) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          id: profile.sub,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          nickname: await getUniqueNickname(profile.email.split('@')[0]!),
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
        let name =
          profile.arUser.NAME + ' ' + profile.arUser.SECOND_NAME + ' ' + profile.arUser.LAST_NAME
        if (profile.arUser.SECOND_NAME == '') {
          name = profile.arUser.NAME + ' ' + profile.arUser.LAST_NAME
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const nickname = await getUniqueNickname(profile.arUser.LOGIN.split('@')[0]!)
        return {
          id: profile.arUser.ID,
          name,
          nickname,
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

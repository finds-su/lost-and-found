import type { OAuthConfig, Provider } from 'next-auth/providers'
import { nicknameValidation } from '@/lib/nickname-validation'
import { Role } from '@prisma/client'

interface MireaProfile {
  id: number
  name: string
  email: string
  group: string
  personal_number: string
  full_name: string
}

export default function DarkMireaLoginProvider(): Provider {
  return {
    id: 'ninja',
    name: 'Dark Mirea Login',
    type: 'oauth',
    version: '2.0',
    accessTokenUrl: 'https://login.mirea.ninja/oauth/token',
    requestTokenUrl: 'https://login.mirea.ninja/oauth/token',
    authorization: {
      url: 'https://login.mirea.ninja/oauth/authorize',
      params: { scope: 'all' },
    },
    token: {
      url: 'https://login.mirea.ninja/oauth/token',
    },
    userinfo: {
      url: 'https://login.mirea.ninja/oauth/userinfo',
    },
    checks: ['state'],
    async profile(profile: MireaProfile) {
      const nickname = await nicknameValidation(profile.email.split('@')[0] as string)
      return {
        id: profile.id.toString(),
        name: profile.full_name,
        nickname: nickname,
        email: profile.email,
        emailVerified: new Date(),
        userInfo: null,
        role: Role.USER,
        isBlocked: false,
        blockReason: null,
      }
    },
    clientId: 'public',
    clientSecret: 'public',
  }
}

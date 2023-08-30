import type { OAuthConfig, Provider } from 'next-auth/providers'
import { nicknameValidation } from '@/lib/nickname-validation'
import { Role } from '@prisma/client'

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

type MireaNinjaLKSProviderConfig = Required<Pick<OAuthConfig<any>, 'clientId' | 'clientSecret'>>

export default function MireaNinjaLksProvider(options: MireaNinjaLKSProviderConfig): Provider {
  return {
    id: 'mirea',
    name: 'Mirea',
    type: 'oauth',
    version: '2.0',
    accessTokenUrl: 'https://auth-app.mirea.ru/oauth/token',
    requestTokenUrl: 'https://auth-app.mirea.ru/oauth/token',
    authorization: {
      url: 'https://auth-app.mirea.ru/oauth/authorize',
      params: { scope: 'profile' },
    },
    token: {
      url: 'https://auth-app.mirea.ru/oauth/token',
    },
    userinfo: {
      url: 'https://auth-app.mirea.ru/api/?action=getData&url=https://lk.mirea.ru/profile/',
    },
    checks: ['state'],
    async profile(profile: MireaProfile) {
      const name = [profile.arUser.NAME, profile.arUser.LAST_NAME].join(' ')
      return {
        id: profile.arUser.ID,
        name,
        nickname: await nicknameValidation(name),
        email: profile.arUser.LOGIN,
        emailVerified: new Date(),
        userInfo: null,
        role: Role.USER,
        image: 'https://lk.mirea.ru' + profile.arUser.PHOTO,
        isBlocked: false,
        blockReason: null,
        secretSocialNetworksAuthPayload: '',
      }
    },
    clientId: options.clientId,
    clientSecret: options.clientSecret,
  }
}

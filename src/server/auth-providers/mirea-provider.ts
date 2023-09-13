import type { OAuthConfig, Provider } from 'next-auth/providers'
import { nicknameValidation } from '@/lib/nickname-validation'
import { Role } from '@prisma/client'

interface UserInfo {
  username: string
  email: string
  name: string
  lastname: string
  middlename: string
  uid: string
}

type MireaProviderConfig = Required<Pick<OAuthConfig<any>, 'clientId' | 'clientSecret'>>

export default function MireaProvider(options: MireaProviderConfig): Provider {
  return {
    id: 'mirea',
    name: 'RTU MIREA',
    type: 'oauth',
    version: '2.0',
    accessTokenUrl: 'https://login.mirea.ru/oauth2/v1/token/',
    requestTokenUrl: 'https://login.mirea.ru/oauth2/v1/token/',
    authorization: {
      url: 'https://login.mirea.ru/oauth2/v1/authorize/',
      params: { scope: 'basic' },
    },
    token: {
      url: 'https://login.mirea.ru/oauth2/v1/token/',
    },
    userinfo: {
      url: 'https://login.mirea.ru/resources/v1/userinfo',
    },
    checks: ['state'],
    async profile(profile: UserInfo) {
      const name = [profile.name, profile.lastname].join(' ')
      return {
        id: profile.uid,
        name,
        nickname: await nicknameValidation(name),
        email: profile.email,
        emailVerified: new Date(),
        userInfo: null,
        role: Role.USER,
        image: null,
        isBlocked: false,
        blockReason: null,
        secretSocialNetworksAuthPayload: '',
      }
    },
    clientId: options.clientId,
    clientSecret: options.clientSecret,
  }
}

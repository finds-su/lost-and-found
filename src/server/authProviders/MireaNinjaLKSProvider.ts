import type { Provider } from 'next-auth/providers'
import { nicknameValidation } from '@/lib/nicknameValidation'

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

export default function MireaNinjaLKSProvider({
  clientId,
  clientSecret,
}: {
  clientId: string
  clientSecret: string
}): Provider {
  return {
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
        isBlocked: false,
      }
    },
    clientId,
    clientSecret,
  }
}

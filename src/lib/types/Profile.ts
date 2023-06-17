import { type User, type UserSocialNetwork } from '@prisma/client'

export type Profile = Pick<User, 'name' | 'nickname' | 'userInfo' | 'role' | 'image'> &
  Partial<Pick<User, 'email' | 'isBlocked' | 'blockReason'>> & {
    socialNetworks: Pick<UserSocialNetwork, 'socialNetwork' | 'link'>[]
  }

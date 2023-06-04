import { type User, type UserSessionNetwork } from '@prisma/client'

export type Profile = Pick<User, 'name' | 'nickname' | 'userInfo' | 'role' | 'image'> &
  Partial<Pick<User, 'email' | 'isBlocked' | 'blockReason'>> & {
    socialNetworks: Pick<UserSessionNetwork, 'socialNetwork' | 'link'>[]
  }

import { type User } from 'next-auth'
import { type UserSessionNetwork } from '@prisma/client'

export type EditableSocialNetwork = Pick<UserSessionNetwork, 'socialNetwork' | 'link'>

export type EditableProfile = Pick<User, 'name' | 'nickname' | 'email' | 'userInfo' | 'image'> & {
  socialNetworks?: EditableSocialNetwork[]
}

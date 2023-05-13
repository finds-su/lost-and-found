import { type User } from '@prisma/client'

export type PublicUser = Pick<User, 'name' | 'nickname' | 'role' | 'userInfo' | 'image'>

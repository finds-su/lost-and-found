import { type User } from '@prisma/client'

export type SeoUser = Pick<User, 'name' | 'nickname' | 'image'>

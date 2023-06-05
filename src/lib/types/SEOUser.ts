import { type User } from '@prisma/client'

export type SEOUser = Pick<User, 'name' | 'nickname' | 'image'>

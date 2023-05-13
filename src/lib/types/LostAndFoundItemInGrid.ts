import { type LostAndFoundItem as PrismaLostAndFoundItem, type User } from '@prisma/client'

export type LostAndFoundItemInGrid = Pick<
  PrismaLostAndFoundItem,
  'id' | 'name' | 'campus' | 'reason' | 'images' | 'created'
> & {
  user: Pick<User, 'name' | 'nickname' | 'role' | 'userInfo' | 'image'>
}

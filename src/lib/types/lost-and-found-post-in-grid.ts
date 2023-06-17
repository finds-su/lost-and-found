import { type LostAndFoundItem as PrismaLostAndFoundItem, type User } from '@prisma/client'

export type LostAndFoundPostInGrid = Pick<
  PrismaLostAndFoundItem,
  'id' | 'name' | 'campus' | 'images' | 'created'
> & {
  user: Pick<User, 'name' | 'nickname' | 'image'>
}

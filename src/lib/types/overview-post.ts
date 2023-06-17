import { type LostAndFoundItem, type User } from '@prisma/client'

export type OverviewPost = Pick<
  LostAndFoundItem,
  'id' | 'name' | 'description' | 'campus' | 'images' | 'created' | 'expires'
> & {
  user: Pick<User, 'name' | 'nickname' | 'image'>
}

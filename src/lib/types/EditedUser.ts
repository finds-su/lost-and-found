import { type User } from 'next-auth'

export type EditedUser = Pick<User, 'name' | 'nickname' | 'email' | 'userInfo' | 'image'>

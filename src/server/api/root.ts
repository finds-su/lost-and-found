import { createTRPCRouter } from '@/server/api/trpc'
import { usersRouter } from '@/server/api/routers/users'
import { itemsRouter } from '@/server/api/routers/items'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  items: itemsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

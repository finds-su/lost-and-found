import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'
import { prisma } from '@/server/db'

export const itemsRouter = createTRPCRouter({
  infiniteItems: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
        reason: z.enum(['LOST', 'FOUND']),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50
      const { cursor } = input
      const items = await prisma.lostAndFoundItem.findMany({
        select: {
          id: true,
          name: true,
          campus: true,
          reason: true,
          images: true,
          user: {
            select: {
              name: true,
              nickname: true,
              role: true,
              userInfo: true,
              image: true,
            },
          },
        },
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          reason: input.reason,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          created: 'desc',
        },
      })
      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }
      return {
        items,
        nextCursor,
      }
    }),
})

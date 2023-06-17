import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'
import { prisma } from '@/server/db'
import { Campus, PostItemReason } from '@prisma/client'
import { SortOption } from '@/lib/types/sort-option'
import { TRPCError } from '@trpc/server'

export const postsRouter = createTRPCRouter({
  infiniteItems: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(16, 'Превышен лимит запроса').nullish(),
        cursor: z.string().nullish(), // <-- "cursor" needs to exist, but can be any type
        reason: z.nativeEnum(PostItemReason),
        orderByCreationDate: z.nativeEnum(SortOption),
        filters: z.array(z.string()).max(30),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50
      const campusFilters = input.filters.filter((filter) =>
        Object.values(Campus).includes(filter as Campus),
      ) as Array<Campus>
      const { cursor, reason } = input
      const items = await prisma.lostAndFoundItem.findMany({
        select: {
          id: true,
          name: true,
          campus: true,
          images: true,
          created: true,
          user: {
            select: {
              name: true,
              nickname: true,
              image: true,
            },
          },
        },
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where: {
          reason,
          campus: {
            in: campusFilters,
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          created: input.orderByCreationDate,
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

  createPost: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(5, 'Название должно содержать 5 или больше символов')
          .max(100, 'Название должно содержать 100 или меньше символов'),
        description: z.string().max(512, 'Описание должно содержать не больше 512 символов'),
        images: z.array(z.string()).max(10),
        campus: z.nativeEnum(Campus),
        reason: z.nativeEnum(PostItemReason),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.lostAndFoundItem.create({
        data: {
          name: input.name,
          description: input.description,
          reason: input.reason,
          campus: input.campus,
          images: input.images,
          userId: ctx.session.user.id,
        },
      })
    }),

  getPost: publicProcedure
    .input(z.object({ postId: z.string(), reason: z.nativeEnum(PostItemReason) }))
    .query(async ({ input }) => {
      const post = await prisma.lostAndFoundItem.findFirst({
        where: { id: input.postId, reason: input.reason },
        select: {
          id: true,
          name: true,
          description: true,
          campus: true,
          images: true,
          created: true,
          expires: true,
          user: {
            select: {
              name: true,
              nickname: true,
              image: true,
            },
          },
        },
      })
      if (post) {
        return post
      }
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Пост не найден.',
      })
    }),
})

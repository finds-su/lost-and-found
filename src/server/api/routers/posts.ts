import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc'
import { z } from 'zod'
import { prisma } from '@/server/db'
import { Campus, LostAndFoundItemStatus, PostItemReason } from '@prisma/client'
import { SortOption } from '@/lib/types/sort-option'
import { TRPCError } from '@trpc/server'

export const postsRouter = createTRPCRouter({
  infinitePosts: publicProcedure
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
          status: true,
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

  getMyPosts: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(), // cursor is required for infinite query
        limit: z.number().min(1).max(25),
        reason: z.nativeEnum(PostItemReason),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit, reason } = input
      const items = await prisma.lostAndFoundItem.findMany({
        where: {
          userId: ctx.session.user.id,
          reason,
        },
        orderBy: {
          created: 'desc',
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
      })
      const previousCursor = (
        await prisma.lostAndFoundItem.findFirst({
          select: {
            id: true,
          },
          where: {
            userId: ctx.session.user.id,
            reason,
          },
          orderBy: {
            created: 'desc',
          },
          take: -limit,
          cursor: cursor ? { id: cursor } : undefined,
        })
      )?.id
      let nextCursor: typeof cursor | undefined = undefined
      if (items.length > limit) {
        const nextItem = items.pop()
        nextCursor = nextItem?.id
      }
      return { items, nextCursor, previousCursor, hasMore: nextCursor !== undefined }
    }),

  countMyPosts: protectedProcedure
    .input(
      z.object({
        reason: z.nativeEnum(PostItemReason),
      }),
    )
    .query(({ ctx, input }) => {
      const { reason } = input
      const countMyPosts = prisma.lostAndFoundItem.count({
        where: {
          userId: ctx.session.user.id,
          reason,
        },
      })
      return countMyPosts
    }),

  searchPosts: publicProcedure.input(z.object({ query: z.string() })).query(async ({ input }) => {
    const { query } = input
    const result = []
    const finds = await searchPosts(query, PostItemReason.FOUND)
    if (finds.length > 0) {
      result.push({ name: 'Находки', reason: PostItemReason.FOUND, posts: finds })
    }
    const losses = await searchPosts(query, PostItemReason.LOST)
    if (losses.length > 0) {
      result.push({ name: 'Пропажи', reason: PostItemReason.LOST, posts: losses })
    }
    return result
  }),
})

async function searchPosts(query: string, reason: PostItemReason) {
  const limit = 20
  const status = LostAndFoundItemStatus.ACTIVE
  const createdOrderBy = 'desc'

  // full text se
  if (query.includes(' ')) {
    return prisma.lostAndFoundItem.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        reason: true,
      },
      where: {
        status,
        reason,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
      orderBy: {
        created: createdOrderBy,
      },
    })
  } else {
    return prisma.lostAndFoundItem.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        reason: true,
      },
      where: {
        status,
        reason,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { name: { search: query } },
          { description: { search: query } },
        ],
      },
      take: limit,
      orderBy: {
        created: createdOrderBy,
      },
    })
  }
}

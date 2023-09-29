import {
  aIRateLimiter,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'
import { z } from 'zod'
import { prisma } from '@/server/db'
import { Campus, LostAndFoundItemStatus, PostItemReason, Role } from '@prisma/client'
import { SortOption } from '@/lib/types/sort-option'
import { TRPCError } from '@trpc/server'
import { slugify } from 'transliteration'
import { generateImageCaption } from '@/server/image-captions'
import generateRssFeed from '@/lib/generateRssFeed'

export const postsRouter = createTRPCRouter({
  infinitePosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100, 'Превышен лимит запроса').nullish(),
        cursor: z.number().nullish(), // <-- "cursor" needs to exist, but can be any type
        reason: z.nativeEnum(PostItemReason).or(z.literal('ANY')), // if ANY, then we don't filter by reason
        orderByCreationDate: z.nativeEnum(SortOption),
        filters: z.array(z.string()).max(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      const statusSelector = {
        status:
          ctx.session?.user?.role === Role.ADMIN || ctx.session?.user?.role === Role.MODERATOR
            ? {
                in: [
                  LostAndFoundItemStatus.ACTIVE,
                  LostAndFoundItemStatus.BLOCKED,
                  LostAndFoundItemStatus.EXPIRED,
                ],
              }
            : { in: [LostAndFoundItemStatus.ACTIVE] },
      }
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
          isInStoragePlace: true,
          user: {
            select: {
              name: true,
              nickname: true,
              image: true,
            },
          },
          slug: true,
          reason: true,
        },
        take: limit + 1, // get an extra item at the end which we'll use as next cursor
        where:
          reason !== PostItemReason.LOST && reason !== PostItemReason.FOUND
            ? { campus: { in: campusFilters }, ...statusSelector }
            : { reason, campus: { in: campusFilters }, ...statusSelector },

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
        isInStoragePlace: z.boolean().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newPost = await prisma.lostAndFoundItem.create({
        data: {
          name: input.name,
          description: input.description,
          reason: input.reason,
          campus: input.campus,
          images: input.images,
          userId: ctx.session.user.id,
          isInStoragePlace: input.isInStoragePlace,
        },
      })

      await prisma.lostAndFoundItem.update({
        where: {
          id: newPost.id,
        },
        data: {
          slug: `${slugify(newPost.name)}.${newPost.id}`,
        },
      })

      await generateRssFeed()
    }),

  getPost: publicProcedure.input(z.object({ postId: z.number() })).query(async ({ input }) => {
    const post = await prisma.lostAndFoundItem.findFirst({
      where: { id: input.postId },
      select: {
        id: true,
        name: true,
        description: true,
        campus: true,
        images: true,
        status: true,
        created: true,
        expires: true,
        reason: true,
        isInStoragePlace: true,
        user: {
          select: {
            id: true,
            name: true,
            nickname: true,
            image: true,
          },
        },
        slug: true,
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

  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string(), reason: z.nativeEnum(PostItemReason) }))
    .query(async ({ input }) => {
      const post = await prisma.lostAndFoundItem.findFirst({
        where: {
          slug: input.slug,
          reason: input.reason,
        },
        select: {
          id: true,
          name: true,
          description: true,
          campus: true,
          images: true,
          status: true,
          created: true,
          expires: true,
          isInStoragePlace: true,
          user: {
            select: {
              id: true,
              name: true,
              nickname: true,
              image: true,
              socialNetworks: true,
            },
          },
          slug: true,
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
        cursor: z.number().nullish(), // cursor is required for infinite query
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
      return prisma.lostAndFoundItem.count({
        where: {
          userId: ctx.session.user.id,
          reason,
        },
      })
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

  deletePost: protectedProcedure
    .input(z.object({ postId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { postId } = input

      const post = await prisma.lostAndFoundItem.findFirst({
        where:
          ctx.session.user.role !== Role.ADMIN && ctx.session.user.role !== Role.MODERATOR
            ? { id: postId, userId: ctx.session.user.id }
            : { id: postId },
      })

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Пост не найден.',
        })
      }
      if (post.status === LostAndFoundItemStatus.BLOCKED) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Пост уже удален.',
        })
      }
      await prisma.lostAndFoundItem.update({
        where: {
          id: post.id,
        },
        data: {
          status: LostAndFoundItemStatus.BLOCKED,
        },
      })

      await generateRssFeed()
    }),

  updatePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        reason: z.nativeEnum(PostItemReason),
        name: z.string().max(64, 'Название должно содержать не больше 64 символов'),
        description: z.string().max(512, 'Описание должно содержать не больше 512 символов'),
        images: z.array(z.string()).max(10),
        campus: z.nativeEnum(Campus),
        isInStoragePlace: z.boolean().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, reason, name, description, images, campus, isInStoragePlace } = input
      const post = await prisma.lostAndFoundItem.findFirst({
        where: {
          id: postId,
          userId:
            ctx.session.user.role !== Role.ADMIN && ctx.session.user.role !== Role.MODERATOR
              ? undefined
              : ctx.session.user.id,
          reason,
        },
      })
      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Пост не найден.',
        })
      }

      if (
        post.userId !== ctx.session.user.id &&
        ctx.session.user.role !== Role.ADMIN &&
        ctx.session.user.role !== Role.MODERATOR
      ) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Нет доступа.',
        })
      }

      const updated = await prisma.lostAndFoundItem.update({
        where: {
          id: post.id,
        },
        data: {
          name,
          description,
          images,
          campus,
          isInStoragePlace,
          slug: `${slugify(name)}.${post.id}`,
        },
      })

      await generateRssFeed()

      return updated
    }),

  generateImageCaption: protectedProcedure
    .input(
      z.object({
        imageUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // await aIRateLimiter(ctx.session.user.id)
      return await generateImageCaption(input.imageUrl)
    }),
})

async function searchPosts(query: string, reason: PostItemReason) {
  const status = LostAndFoundItemStatus.ACTIVE
  const limit = 20
  const orderByCreated = 'desc'
  let posts

  // if query contains space, full text search throws error
  if (query.includes(' ')) {
    // no full text search
    posts = prisma.lostAndFoundItem.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        reason: true,
        slug: true,
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
        created: orderByCreated,
      },
    })
  } else {
    // with full text search
    posts = prisma.lostAndFoundItem.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        reason: true,
        slug: true,
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
        created: orderByCreated,
      },
    })
  }
  return posts
}

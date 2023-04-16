import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { TRPCError } from '@trpc/server'
import { type Role } from '@prisma/client'

export interface PublicUser {
  nickname: string
  role: Role
  userInfo?: string
  image?: string
}

export const usersRouter = createTRPCRouter({
  getOne: publicProcedure
    .input(z.object({ nickname: z.string() }))
    .query(async ({ ctx, input }) => {
      const publicUser = (await ctx.prisma.user.findUnique({
        where: {
          nickname: input.nickname,
        },
        select: {
          nickname: true,
          role: true,
          userInfo: true,
          image: true,
        },
      })) as PublicUser
      if (publicUser) {
        return publicUser
      } else {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Пользователь не найден.' })
      }
    }),
})

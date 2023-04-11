import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export interface PublicUser {
  nickname: string
  role: string
  image?: string
}

export const usersRouter = createTRPCRouter({
  getOne: publicProcedure.input(z.object({ nickname: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: {
        nickname: input.nickname,
      },
      select: {
        nickname: true,
        role: true,
        image: true,
      },
    }) as Promise<PublicUser>
  }),
})

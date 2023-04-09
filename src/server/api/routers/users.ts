import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

import type { User } from '@prisma/client'

export const usersRouter = createTRPCRouter({
  getOne: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: input.id,
      },
    }) as Promise<User>
  }),
})

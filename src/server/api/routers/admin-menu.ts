import { createTRPCRouter, moderatorOrAdminProcedure } from '@/server/api/trpc'
import { z } from 'zod'
import { prisma } from '@/server/db'
import { Simulate } from 'react-dom/test-utils'
import select = Simulate.select

export const adminMenuRouter = createTRPCRouter({
  getUsers: moderatorOrAdminProcedure.query(async ({ input }) => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        nickname: true,
        email: true,
        emailVerified: true,
        userInfo: true,
        role: true,
        isBlocked: true,
        blockReason: true,
      },
    })
    return users
  }),
})

import { createTRPCRouter, moderatorOrAdminProcedure } from '@/server/api/trpc'
import { prisma } from '@/server/db'

export const adminMenuRouter = createTRPCRouter({
  getUsers: moderatorOrAdminProcedure.query(async () => {
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
        socialNetworks: {
          select: {
            socialNetwork: true,
            username: true,
            externalId: true,
          },
        },
      },
    })
    return users
  }),
})

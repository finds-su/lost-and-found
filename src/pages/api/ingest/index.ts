import { prisma } from '@/server/db'
import { LostAndFoundItemStatus, SocialNetwork } from '@prisma/client'
import VkApi from '@/server/messengers-api/vk'
import TelegramApi from '@/server/messengers-api/telegram'
import { Inngest } from 'inngest'
import { serve } from 'inngest/next'

const inngest = new Inngest({ name: 'finds.mirea.ru' })

const deleteOutdatedPosts = inngest.createFunction(
  { name: 'Delete outdated posts every day at 18:00' },
  { cron: '0 18 * * *' },
  async () => {
    const allPosts = await prisma.lostAndFoundItem.findMany({
      select: {
        id: true,
        name: true,
        user: {
          select: {
            id: true,
          },
        },
        status: true,
        expires: true,
      },
    })

    const date = new Date()

    const expiredPosts = allPosts.filter((post) => {
      return post.expires < date && post.status === LostAndFoundItemStatus.ACTIVE
    })

    for (const post of expiredPosts) {
      const userId = post.user.id

      const userSocialNetworks = await prisma.userSocialNetwork.findMany({
        where: {
          userId: userId,
        },
      })

      const notificationText = `Ваше объявление "${post.name}" было удалено, так как срок его действия истёк.`

      for (const userSocialNetwork of userSocialNetworks) {
        switch (userSocialNetwork.socialNetwork) {
          case SocialNetwork.VK:
            await VkApi.sendMessage(userSocialNetwork.externalId, notificationText)
            break

          case SocialNetwork.TELEGRAM:
            await TelegramApi.sendMessage(userSocialNetwork.externalId, notificationText)
            break
        }
      }

      await prisma.lostAndFoundItem.update({
        where: {
          id: post.id,
        },
        data: {
          status: LostAndFoundItemStatus.BLOCKED,
        },
      })
    }

    return {
      message: `Deleted ${expiredPosts.length} posts`,
    }
  },
)
export default serve(inngest, [deleteOutdatedPosts])

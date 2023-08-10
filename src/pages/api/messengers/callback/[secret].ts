import type { NextApiRequest, NextApiResponse } from 'next'
import VkApi from '@/server/messengers-api/vk'

import { api } from '@/lib/api'
import { prisma } from '@/server/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // check for secret substring in callback url
  if (!req.url?.includes(process.env.CALLBACK_SECRET_URL_STRING as string)) {
    return res.status(404).send('Not found')
  }

  if ((req.body as Record<string, unknown>).type === 'confirmation') {
    const confirmation = await VkApi.getCallbackConfirmationCode()
    return res.status(200).send(confirmation)
  }

  if (req.headers['user-agent']?.includes('VKCallback')) {
    const { type, object } = req.body as Record<string, unknown>

    if (type === 'message_new') {
      type EventObject = {
        message: {
          text: string
          from_id: number
        }
      }

      const { message } = object as EventObject

      console.log('VK Callback message', message)

      if (message.text.startsWith('/') && message.text.length > 1) {
        const user = await prisma.user.findFirst({
          where: {
            secretSocialNetworksAuthPayload: message.text.slice(1),
          },
        })

        if (!user) {
          await VkApi.sendMessage(
            message.from_id,
            'Вы ввели неверную команду. Скопируйте её полностью и повторите попытку.',
          )
          return res.status(200).send('ok')
        }

        const isAlreadyVkConnected =
          (await prisma.userSocialNetwork.findFirst({
            where: {
              userId: user.id,
              socialNetwork: 'VK',
            },
          })) !== null

        if (isAlreadyVkConnected) {
          await VkApi.sendMessage(
            message.from_id,
            'Вы уже подключили свой аккаунт ВКонтакте. Сперва отвяжите его в настройках профиля.',
          )
          return res.status(200).send('ok')
        }

        await prisma.userSocialNetwork.create({
          data: {
            userId: user.id,
            username: message.from_id.toString(),
            socialNetwork: 'VK',
            externalId: message.from_id.toString(),
          },
        })

        await VkApi.sendMessage(
          message.from_id,
          'Ваш аккаунт ВКонтакте успешно подключен. Теперь вы можете получать уведомления о новых объявлениях.',
        )
      }
    }
  }

  return res.status(200).send('ok')
}

import type { NextApiRequest, NextApiResponse } from 'next'
import VkApi from '@/server/messengers-api/vk'
import TelegramApi from '@/server/messengers-api/telegram'

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

  // VK event
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
  } else {
    const { message } = req.body as Record<string, unknown>

    if (message) {
      const { text, from } = message as {
        text: string
        from: {
          id: number
          username: string
        }
      }

      if (text.startsWith('/start ')) {
        const user = await prisma.user.findFirst({
          where: {
            secretSocialNetworksAuthPayload: text.slice(7),
          },
        })

        if (!user) {
          await TelegramApi.sendMessage(
            from.id.toString(),
            'Не удалось подключить аккаунт. Попробуйте ещё раз.',
          )
          return res.status(200).send('ok')
        }

        const isAlreadyTelegramConnected =
          (await prisma.userSocialNetwork.findFirst({
            where: {
              userId: user.id,
              socialNetwork: 'TELEGRAM',
            },
          })) !== null

        if (isAlreadyTelegramConnected) {
          await TelegramApi.sendMessage(
            from.id.toString(),
            'Вы уже подключили свой аккаунт Telegram. Сперва отвяжите его в настройках профиля.',
          )

          return res.status(200).send('ok')
        }

        await prisma.userSocialNetwork.create({
          data: {
            userId: user.id,
            username: from.username,
            socialNetwork: 'TELEGRAM',
            externalId: from.id.toString(),
          },
        })

        await TelegramApi.sendMessage(
          from.id.toString(),
          'Ваш аккаунт Telegram успешно подключен. Теперь вы можете получать уведомления о новых объявлениях.',
        )
      }
    }
  }

  return res.status(200).send('ok')
}

import type { NextApiRequest, NextApiResponse } from 'next'
import VkApi from '@/server/messengers-api/vk'
import TelegramApi from '@/server/messengers-api/telegram'
import { api } from '@/lib/api'
import { prisma } from '@/server/db'

type VkMessage = {
  message: {
    text: string
    from_id: number
  }
}

type TelegramMessage = {
  message: {
    text: string
    from: {
      id: number
      username: string
    }
  }
}

function isVkEvent(req: NextApiRequest): boolean {
  return Boolean(req.headers['user-agent']?.includes('VKCallback'))
}

async function confirmVkCallback(req: NextApiRequest, res: NextApiResponse) {
  const confirmation = await VkApi.getCallbackConfirmationCode()
  res.status(200).send(confirmation)
}

async function handleVkEvent(req: NextApiRequest, res: NextApiResponse) {
  const { type, object } = req.body as Record<string, unknown>

  if (type !== 'message_new') {
    return res.status(200).send('ok')
  }

  const { message } = object as VkMessage

  if (!message.text.startsWith('/') || message.text.length <= 1) {
    return res.status(200).send('ok')
  }

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

  const userSocialNetwork = await prisma.userSocialNetwork.findFirst({
    where: {
      userId: user.id,
      socialNetwork: 'VK',
    },
  })

  if (userSocialNetwork) {
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
    'Ваш аккаунт ВКонтакте успешно подключен. Теперь вы можете получать уведомления и обратную связь.',
  )

  return res.status(200).send('ok')
}

async function handleTelegramEvent(req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body as TelegramMessage

  if (!message || !message.text.startsWith('/start ')) {
    return res.status(200).send('ok')
  }

  const user = await prisma.user.findFirst({
    where: {
      secretSocialNetworksAuthPayload: message.text.slice(7),
    },
  })

  if (!user) {
    await TelegramApi.sendMessage(
      message.from.id.toString(),
      'Не удалось подключить аккаунт. Попробуйте ещё раз.',
    )
    return res.status(200).send('ok')
  }

  const userSocialNetwork = await prisma.userSocialNetwork.findFirst({
    where: {
      userId: user.id,
      socialNetwork: 'TELEGRAM',
    },
  })

  if (userSocialNetwork) {
    await TelegramApi.sendMessage(
      message.from.id.toString(),
      'Вы уже подключили свой аккаунт Telegram. Сперва отвяжите его в настройках профиля.',
    )
    return res.status(200).send('ok')
  }

  await prisma.userSocialNetwork.create({
    data: {
      userId: user.id,
      username: message.from.username,
      socialNetwork: 'TELEGRAM',
      externalId: message.from.id.toString(),
    },
  })

  await TelegramApi.sendMessage(
    message.from.id.toString(),
    'Ваш аккаунт Telegram успешно подключен. Теперь вы можете получать уведомления и обратную связь.',
  )

  return res.status(200).send('ok')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.url?.includes(process.env.CALLBACK_SECRET_URL_STRING as string)) {
    return res.status(404).send('Not found')
  }

  if ((req.body as Record<string, unknown>).type === 'confirmation') {
    return confirmVkCallback(req, res)
  }

  if (isVkEvent(req)) {
    return handleVkEvent(req, res)
  }

  return handleTelegramEvent(req, res)
}

import { prisma } from '@/server/db'
import { slugify } from 'transliteration'
import {
  uniqueNamesGenerator,
  type Config as UniqueNamesGeneratorConfig,
  adjectives,
} from 'unique-names-generator'
import { telegramUsernameRegex } from '@/constants.mjs'

const uniqueNamesGeneratorConfig: UniqueNamesGeneratorConfig = {
  dictionaries: [adjectives],
  length: 1,
  separator: '_',
}

const isValidNickname = async (nickname: string) =>
  telegramUsernameRegex.test(nickname) &&
  (await prisma.user.findUnique({ where: { nickname: nickname } })) === null

export async function nicknameValidation(name: string) {
  const nickname = slugify(name, { separator: '_' })
  let nicknameWithPostfix = nickname
  for (let i = 0; i < 10; i++) {
    if (await isValidNickname(nicknameWithPostfix)) {
      return nicknameWithPostfix
    } else {
      nicknameWithPostfix = `${nickname}_${uniqueNamesGenerator(uniqueNamesGeneratorConfig)}`
    }
  }
  nicknameWithPostfix = uniqueNamesGenerator(uniqueNamesGeneratorConfig)
  if (await isValidNickname(nicknameWithPostfix)) {
    return nicknameWithPostfix
  }
  throw new Error('Нет уникальных никнеймов')
}

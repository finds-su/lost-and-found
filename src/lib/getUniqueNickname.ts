import { prisma } from '@/server/db'
import {
  uniqueNamesGenerator,
  NumberDictionary,
  type Config as UniqueNamesGeneratorConfig,
  adjectives,
} from 'unique-names-generator'

const numberDictionary = NumberDictionary.generate({ min: 0, max: 999 })
const uniqueNamesGeneratorConfig: UniqueNamesGeneratorConfig = {
  dictionaries: [adjectives, numberDictionary],
  length: 2,
  separator: '-',
}

export async function getUniqueNickname() {
  let nickname = uniqueNamesGenerator(uniqueNamesGeneratorConfig)
  for (let i = 0; i < 10; i++) {
    if ((await prisma.user.findUnique({ where: { nickname } })) !== null) {
      nickname = uniqueNamesGenerator(uniqueNamesGeneratorConfig)
    } else {
      return nickname
    }
  }
  throw new Error('Нет уникальных никнеймов')
}

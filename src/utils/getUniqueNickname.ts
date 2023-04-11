import { prisma } from '@/server/db'

export async function getUniqueNickname(nickname: string) {
  if ((await prisma.user.findUnique({ where: { nickname } })) !== null) {
    nickname = `${nickname}_${Math.random() * (99999 - 10000) + 10000}`
  }
  return nickname
}

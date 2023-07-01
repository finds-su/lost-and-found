import { type Session } from 'next-auth'
import { Role } from '@prisma/client'

export function isModeratorOrAdmin(session: Session) {
  return [Role.MODERATOR.toString(), Role.ADMIN.toString()].includes(session.user.role.toString())
}

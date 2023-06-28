import { type User } from '@prisma/client'
import { NextSeo } from 'next-seo'
import { env } from '@/env.mjs'

export type SeoUser = Pick<User, 'name' | 'nickname' | 'image'>

interface UserSeoProps {
  user: SeoUser
}

export default function UserSeo({ user }: UserSeoProps) {
  return (
    <NextSeo
      title={user.name ?? undefined}
      openGraph={{
        url: `${env.NEXT_PUBLIC_NEXTAUTH_URL}/u/${user.nickname}`,
        title: user.name ?? undefined,
        description: `@${user.nickname}`,
        ...(user.image && {
          images: [
            {
              url: user.image,
              width: 300,
              height: 300,
              alt: user.nickname,
            },
          ],
        }),
      }}
    />
  )
}

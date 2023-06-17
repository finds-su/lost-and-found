import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'

import { type ReactElement } from 'react'
import DynamicError from '@/components/error/dynamic-error'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicProfileBody from '@/components/profile/profile-body/dynamic-profile-body'
import { type ErrorProps } from '@/lib/types/error-props'
import { NextSeo } from 'next-seo'
import { env } from '@/env.mjs'
import { type SeoUser } from '@/lib/types/seo-user'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const nickname = context.params?.nickname as string
  if (session && session.user.nickname === nickname) {
    return {
      props: {
        session,
        user: {
          name: session.user.name,
          nickname: session.user.nickname,
          image: session.user.image,
        } as SeoUser,
      },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      nickname,
    },
    select: {
      name: true,
      nickname: true,
      image: true,
    },
  })
  if (user === null) {
    return {
      props: {
        error: {
          code: 404,
          name: 'Пользователь не найден',
          description: `Пользователя с ником ${nickname} не существует.`,
        } as ErrorProps,
      },
    }
  }
  return {
    props: { session, user },
  }
}

const Profile: NextPageWithLayout = ({ user }: { user: SeoUser }) => {
  return (
    <>
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
      <DynamicProfileBody />
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement, options: NextPageOptions) {
  if (options.error) {
    return <DynamicError {...options.error} />
  }
  return (
    <DynamicLayout pageName='Профиль' session={options.session} hideTitle>
      {page}
    </DynamicLayout>
  )
}

export default Profile

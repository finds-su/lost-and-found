import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'
import { type ProfileProps } from '@/components/profile/ProfileBody'

import { type ReactElement } from 'react'
import Error, { type ErrorProps } from '@/components/Error'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicProfileBody from '@/components/profile/DynamicProfileBody'
import { type PublicUser } from '@/lib/types/PublicUser'
import { NextSeo } from 'next-seo'
import { env } from '../../../env.mjs'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const nickname = context.params?.nickname as string
  if (session && session?.user.nickname === nickname) {
    return {
      props: { isOwner: true, user: session.user, session } as ProfileProps,
    }
  }

  const user = (await prisma.user.findUnique({
    where: {
      nickname,
    },
    select: {
      name: true,
      nickname: true,
      role: true,
      userInfo: true,
      image: true,
    },
  })) as PublicUser | null
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
    props: { isOwner: false, user, session } as ProfileProps,
  }
}

const Profile: NextPageWithLayout = (props: ProfileProps) => {
  return (
    <>
      <NextSeo
        title={props.user.name ?? undefined}
        openGraph={{
          url: `${env.NEXT_PUBLIC_NEXTAUTH_URL}/u/${props.user.nickname}`,
          title: props.user.name ?? undefined,
          description: `@${props.user.nickname}`,
          ...(props.user.image && {
            images: [
              {
                url: props.user.image,
                width: 300,
                height: 300,
                alt: props.user.nickname,
              },
            ],
          }),
        }}
      />
      <DynamicProfileBody {...props} />
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement, options: NextPageOptions) {
  if (options.error) {
    return <Error {...options.error} />
  }
  return (
    <DynamicLayout pageName='Профиль' hideTitle session={options.session}>
      {page}
    </DynamicLayout>
  )
}

export default Profile

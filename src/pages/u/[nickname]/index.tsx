import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'

import { type ReactElement } from 'react'
import DynamicError from '@/components/error/dynamic-error'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicProfileBody from '@/components/profile/profile-body/dynamic-profile-body'
import { type ErrorProps } from '@/lib/types/error-props'
import { type SeoUser } from '@/lib/types/seo-user'
import UserSeo from '@/components/seo/user-seo'

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
      <UserSeo user={user} />
      <DynamicProfileBody />
    </>
  )
}

Profile.getLayout = function getLayout(page: ReactElement, options: NextPageOptions) {
  if (options.error) {
    return <DynamicError {...options.error} />
  }
  return (
    <DynamicLayout title='Профиль' session={options.session} hideTitle>
      {page}
    </DynamicLayout>
  )
}

export default Profile

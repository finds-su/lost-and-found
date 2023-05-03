import Layout from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'
import { type Role } from '@prisma/client'
import ProfileBody, { type ProfileProps } from '@/components/profile/ProfileBody'

import { type ReactElement } from 'react'
import Error, { type ErrorProps } from '@/components/Error'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'

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
          name: 'Пользователь не найден.',
          description: `Пользователя с ником ${nickname} не существует.`,
        } as ErrorProps,
      },
    }
  }
  return {
    props: { isOwner: false, user, session } as ProfileProps,
  }
}

export interface PublicUser {
  name: string
  nickname: string
  role: Role
  userInfo: string
  image?: string | null
}

const Profile: NextPageWithLayout = (props: ProfileProps) => {
  return <ProfileBody {...props} />
}

Profile.getLayout = function getLayout(page: ReactElement, options: NextPageOptions) {
  if (options.error) {
    return <Error {...options.error} />
  }
  return (
    <Layout pageName='Профиль' hideTitle session={options.session}>
      {page}
    </Layout>
  )
}

export default Profile

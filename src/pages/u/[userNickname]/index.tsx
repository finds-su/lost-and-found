import Layout from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'
import { type Role } from '@prisma/client'
import ProfileBody, { type ProfileProps } from '@/components/profile/ProfileBody'

import { type ReactElement } from 'react'

export interface PublicUser {
  name: string
  nickname: string
  role: Role
  userInfo: string
  image?: string | null
}

export default function Profile(props: ProfileProps) {
  return <ProfileBody {...props} />
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout pageName='Профиль' hideTitle>
      {page}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const nickname = context.params?.userNickname as string
  if (session && session?.user.nickname === nickname) {
    return {
      props: { isOwner: true, user: session.user, nickname } as ProfileProps,
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
      redirect: {
        destination: `/u/${nickname}/error`,
        permanent: false,
      },
    }
  }
  return {
    props: { isOwner: false, user, nickname } as ProfileProps,
  }
}

import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'

import { type ReactElement } from 'react'
import DynamicError from '@/components/error/DynamicError'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicProfileBody from '@/components/profile/profileBody/DynamicProfileBody'
import { type ErrorProps } from '@/lib/types/ErrorProps'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const nickname = context.params?.nickname as string
  if (session && session?.user.nickname === nickname) {
    return {
      props: { session },
    }
  }

  const user = await prisma.user.findUnique({
    where: {
      nickname,
    },
    select: {
      id: true,
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
    props: { session },
  }
}

const Profile: NextPageWithLayout = () => {
  return <DynamicProfileBody />
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

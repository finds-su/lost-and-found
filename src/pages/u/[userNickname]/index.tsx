import Layout from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'
import { useRouter } from 'next/router'
import { api } from '@/utils/api'
import { useEffect, useState } from 'react'
import { Spinner } from 'flowbite-react'
import { useSession } from 'next-auth/react'
import { type User } from '@/components/profile/ProfileBody'
import dynamic from 'next/dynamic'
import { type GetServerSideProps } from 'next'

const ProfileBody = dynamic(() => import('@/components/profile/ProfileBody'), {
  ssr: false,
})

export default function Profile(props: { isOwner: boolean }) {
  const router = useRouter()
  const userNickname = router.query.userNickname as string
  const getUser = api.users.getOne.useQuery(
    { nickname: userNickname },
    {
      enabled: !props.isOwner,
      onSuccess: (user) => setUser(user),
      onError: () => void router.push(`/u/${userNickname}/error`),
    },
  )
  const session = useSession()
  const [user, setUser] = useState<User>()

  useEffect(() => {
    if (session.data && session.data.user.nickname === userNickname) {
      const sessionUser = session.data.user
      setUser(sessionUser as User)
    }
  }, [session.data, userNickname])

  if (user) {
    return <ProfileBody user={user} isOwner={props.isOwner} />
  }

  if (
    (!props.isOwner && getUser.status === 'loading') ||
    (props.isOwner && session.status === 'loading')
  ) {
    return (
      <div className='flex h-[40vh] items-center justify-center'>
        <Spinner size='xl' />
      </div>
    )
  }

  return <div className='flex h-[40vh] items-center justify-center' />
}

Profile.getLayout = function getLayout(page: any) {
  return <Layout pageName='Профиль'>{page}</Layout>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
  const session = await getServerAuthSession(context)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const userNickname = context.params?.userNickname as string
  if (session?.user.nickname === userNickname) {
    return {
      props: { isOwner: true },
    }
  }
  return {
    props: { isOwner: false },
  }
}

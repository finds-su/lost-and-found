import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return {
    redirect: {
      destination: `/u/${session.user.nickname}/`,
      permanent: false,
    },
  }
}

export default function Me() {
  return
}

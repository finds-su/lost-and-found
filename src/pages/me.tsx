import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'
import { type GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  if (session) {
    return {
      redirect: {
        destination: `/u/${session.user.nickname}/`,
        permanent: false,
      },
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}

export default function Me() {
  return
}

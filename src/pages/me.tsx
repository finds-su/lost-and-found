import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'
import { type GetServerSideProps } from 'next'

export default function Me() {
  return
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
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

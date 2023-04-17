import Layout from '@/components/layout/Layout'
import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'
import { GetServerSideProps } from 'next'

export default function Me() {
  return
}

Me.getLayout = function getLayout(page: any) {
  return <Layout pageName='Профиль'>{page}</Layout>
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

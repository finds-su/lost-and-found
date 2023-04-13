import Layout from '@/components/Layout'
import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'

export default function Me() {
  return
}

Me.getLayout = function getLayout(page: any) {
  return <Layout pageName='Профиль'>{page}</Layout>
}

export async function getServerSideProps(context: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
  const session = await getServerSession(context.req, context.res, authOptions)
  if (session) {
    return {
      redirect: {
        destination: `/u/${session.user.nickname}/edit`,
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

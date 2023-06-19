import dynamic from 'next/dynamic'
import { GetServerSideProps } from 'next'
import { getServerAuthSession } from '@/server/auth'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      props: {},
    }
  }
  return {
    redirect: {
      destination: `/finds`,
      permanent: false,
    },
  }
}

const Landing = dynamic(() => import('@/components/landing/landing'), { ssr: false })

export default function LandingPage() {
  return <Landing />
}

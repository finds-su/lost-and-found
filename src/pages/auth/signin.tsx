import { getServerAuthSession } from '@/server/auth'
import Head from 'next/head'
import { type GetServerSideProps } from 'next'
import SignIn from '@/components/sign-in'

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Войти в Бюро находок</title>
      </Head>
      <SignIn />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return { props: {} }
}

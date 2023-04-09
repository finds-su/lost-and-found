import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { api } from '@/utils/api'

import '@/styles/globals.css'
import { type ReactElement, type ReactNode } from 'react'
import { type NextPage } from 'next'

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const getLayout = (Component as NextPageWithLayout).getLayout ?? ((page) => page)
  return (
    <SessionProvider session={session}>{getLayout(<Component {...pageProps} />)}</SessionProvider>
  )
}

export default api.withTRPC(MyApp)

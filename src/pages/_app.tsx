import { type AppProps, type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { Inter } from 'next/font/google'

import { api } from '@/lib/api'

import '@/styles/globals.css'
import React, { type ReactElement, type ReactNode, useEffect } from 'react'
import { type NextPage } from 'next'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar'
import useSessionStore from '@/lib/hooks/store/session-store'
import { type ErrorProps } from '@/lib/types/error-props'
import Providers from '@/components/providers'

const inter = Inter({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-inter',
})

export interface NextPageOptions {
  session: Session | null
  error?: ErrorProps
}

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement, options: NextPageOptions) => ReactNode
}

type AppPropsWithLayout = AppProps<{ session: Session | null; error?: ErrorProps }> & {
  Component: NextPageWithLayout
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, error, ...pageProps },
}: AppPropsWithLayout) => {
  const { setSession } = useSessionStore()
  useEffect(() => {
    setSession(session)
  }, [session, setSession])

  const getLayout = Component.getLayout
  return (
    <Providers session={session}>
      <Head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5'
        />
        <link rel='manifest' href='/manifest.json' />
        <link href='/logo-icons/favicon-16x16.png' rel='icon' type='image/png' sizes='16x16' />
        <link href='/logo-icons/favicon-32x32.png' rel='icon' type='image/png' sizes='32x32' />
        <link href='/logo-icons/apple-touch-icon.png' rel='apple-touch-icon' />
        <link href='/logo-icons/safari-pinned-tab.svg' rel='mask-icon' color='#000000' />
        <meta name='msapplication-TileColor' content='#1f2937' />
        <meta name='msapplication-TileImage' content='/logo-icons/mstile-150x150.png' />
        <meta name='theme-color' content='#0f172a' />
      </Head>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <main className={`${inter.variable} font-sans`}>
        <NextNProgress height={3} color='#0ea5e9' options={{ showSpinner: false, speed: 500 }} />
        {getLayout ? (
          getLayout(<Component {...pageProps} />, { error, session })
        ) : (
          <Component {...pageProps} />
        )}
        <Toaster position='bottom-left' reverseOrder={false} />
      </main>
    </Providers>
  )
}

export default api.withTRPC(MyApp)

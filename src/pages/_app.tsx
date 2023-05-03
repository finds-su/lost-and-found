import { type AppProps, type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

import { api } from '@/utils/api'

import '@/styles/globals.css'
import React, { type ReactElement, type ReactNode } from 'react'
import { type NextPage } from 'next'
import { Toaster } from 'react-hot-toast'
import Head from 'next/head'
import { type ErrorProps } from '@/components/Error'
import NextProgress from 'next-progress'

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
  const getLayout = Component.getLayout
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Бюро находок Mirea Ninja</title>

        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5'
        />
        <meta name='description' content='Сайт Бюро находок Mirea Ninja' />

        <meta property='og:image' content='/assets/ninja-logo-black.svg' />
        <meta
          name='keywords'
          content='Стромынка, Проспект Вернадского, Бюро находок в МИРЭА, Находки на кампусе, Потерянные вещи в МИРЭА, Регистрация находок в МИРЭА, Объявления о находках в МИРЭА, База данных находок в МИРЭА, Находки в аудиториях, Поиск потерянных вещей в университете, Находки в библиотеке университета, Утерянные документы в университете, Находки в спортивном зале МИРЭА, Находки в столовой университета, Бесплатная регистрация находок в университете, Находки в учебных кабинетах, Поиск утерянных вещей на территории РТУ МИРЭА'
        />
        <link rel='manifest' href='/manifest.json' />
        <link href='/icons/favicon-16x16.png' rel='icon' type='image/png' sizes='16x16' />
        <link href='/icons/favicon-32x32.png' rel='icon' type='image/png' sizes='32x32' />
        <link href='/icons/apple-touch-icon.png' rel='apple-touch-icon' />
        <link href='/icons/safari-pinned-tab.svg' rel='mask-icon' color='#000000' />
        <meta name='msapplication-TileColor' content='#1f2937' />
        <meta name='msapplication-TileImage' content='/icons/mstile-150x150.png' />
        <meta name='theme-color' content='#0f172a' />
      </Head>
      <NextProgress height={3} delay={300} color='#7dd3fc' options={{ showSpinner: false }} />
      {getLayout ? (
        getLayout(<Component {...pageProps} />, { session, error })
      ) : (
        <Component {...pageProps} />
      )}
      <Toaster position='top-center' reverseOrder={false} />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)

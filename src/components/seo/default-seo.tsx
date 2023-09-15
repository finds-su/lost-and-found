import { NextSeo } from 'next-seo'
import { env } from '@/env.mjs'
import React from 'react'

type DefaultSeoProps = Partial<Pick<React.ComponentProps<typeof NextSeo>, 'title' | 'description'>>

export default function DefaultSeo(props: DefaultSeoProps) {
  return (
    <NextSeo
      title={props.title ?? 'Бюро находок РТУ МИРЭА'}
      description={props.description ?? 'Приложение для агрегации находок и объявлений пропаж'}
      canonical='https://finds.mirea.ru/'
      openGraph={{
        url: env.NEXT_PUBLIC_NEXTAUTH_URL,
        title: 'Бюро находок РТУ МИРЭА',
        description: 'Приложение для агрегации находок и объявлений пропаж',
        images: [
          {
            url: '/logo-icons/apple-touch-icon-precomposed.png',
            width: 300,
            height: 300,
            alt: `Логотип Mirea Ninja`,
          },
        ],
      }}
    />
  )
}

import { NextSeo } from 'next-seo'
import { env } from '@/env.mjs'
import React from 'react'

type DefaultSeoProps = Partial<Pick<React.ComponentProps<typeof NextSeo>, 'title' | 'description'>>

export default function DefaultSeo(props: DefaultSeoProps) {
  return (
    <NextSeo
      title={props.title ?? 'Бюро находок Mirea Ninja'}
      description={
        props.description ?? 'Приложение для поиска потерянных и размещения найденных вещей'
      }
      canonical='https://finds.mirea.ninja/'
      openGraph={{
        url: env.NEXT_PUBLIC_NEXTAUTH_URL,
        title: 'Бюро находок Mirea Ninja',
        description: 'Приложение для поиска потерянных и размещения найденных вещей',
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

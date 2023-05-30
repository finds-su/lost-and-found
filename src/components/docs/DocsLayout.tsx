import React, { type ReactNode } from 'react'
import Head from 'next/head'
import DocsNavigation from '@/components/docs/DocsNavigation'
import { NextSeo } from 'next-seo'

interface DocsLayoutProps {
  children: ReactNode
  meta: {
    title: string
    description: string
  }
}

export default function DocsLayout(props: DocsLayoutProps) {
  return (
    <>
      <NextSeo
        title={props.meta.title}
        openGraph={{
          title: props.meta.title,
          description: props.meta.description,
        }}
      />
      <div className='relative h-full min-h-screen overflow-hidden bg-white py-16'>
        <div className='relative px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-prose text-lg'>
            <h1>
              <div className='pb-3'>
                <DocsNavigation />
              </div>
              <span className='block text-center text-lg font-semibold text-blue-600'>
                Бюро находок Mirea Ninja
              </span>
              <span className='mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl'>
                {props.meta.title}
              </span>
            </h1>
          </div>
          <div className='prose prose-lg prose-blue mx-auto mt-6 text-gray-500'>
            {props.children}
          </div>
        </div>
      </div>
    </>
  )
}

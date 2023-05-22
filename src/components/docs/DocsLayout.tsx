import { type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowSmallLeftIcon } from '@heroicons/react/24/outline'
import Head from 'next/head'

interface DocsLayoutProps {
  children: ReactNode
  meta: {
    title: string
  }
}

export default function DocsLayout(props: DocsLayoutProps) {
  return (
    <>
      <Head>
        <title>{props.meta.title}</title>
      </Head>
      <div className='relative overflow-hidden bg-white py-16'>
        <div className='relative px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-prose text-lg'>
            <h1>
              <Link href='/' className='flex flex-row items-center text-left text-gray-700'>
                <ArrowSmallLeftIcon className='h-5 w-5' /> Назад к сайту
              </Link>
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

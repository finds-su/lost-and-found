import { FlagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import Head from 'next/head'
import { type ErrorProps } from '@/lib/types/error-props'
import Link from 'next/link'
import Logo from '@/components/logo'

const recommendationLinks = [
  {
    title: 'Найденные вещи',
    description: 'Если нашли забытую вещь, воспользуйтесь этим разделом',
    href: '/finds',
    icon: FlagIcon,
  },
  {
    title: 'Потерянные вещи',
    description: 'Создайте запись здесь, если что-то потеряли',
    href: '/losses',
    icon: MagnifyingGlassIcon,
  },
]

export default function Error(props: ErrorProps) {
  return (
    <>
      <Head>
        <title>{props.name}</title>
      </Head>
      <div className='h-full min-h-screen bg-white'>
        <main className='mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8'>
          <div className='pt-16'>
            <Logo />
          </div>
          <div className='mx-auto max-w-xl py-10 sm:py-24'>
            <div className='text-center'>
              {props.code && <p className='text-base font-semibold text-blue-700'>{props.code}</p>}
              <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                {props.name}
              </h1>
              <p className='mt-2 text-lg text-gray-500'>{props.description}</p>
            </div>
            {!props.hideRecommendationLinks && (
              <div className='mt-12'>
                <h2 className='text-base font-semibold text-gray-500'>Популярные станицы</h2>
                <ul
                  role='list'
                  className='mt-4 divide-y divide-gray-200 border-b border-t border-gray-200'
                >
                  {recommendationLinks.map((link, linkIdx) => (
                    <li key={linkIdx} className='relative flex items-start space-x-4 py-6'>
                      <div className='flex-shrink-0'>
                        <span className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50'>
                          <link.icon className='h-6 w-6 text-blue-700' aria-hidden='true' />
                        </span>
                      </div>
                      <div className='min-w-0 flex-1'>
                        <h3 className='text-base font-medium text-gray-900'>
                          <span className='rounded-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2'>
                            <Link href={link.href} className='focus:outline-none'>
                              <span className='absolute inset-0' aria-hidden='true' />
                              {link.title}
                            </Link>
                          </span>
                        </h3>
                        <p className='text-base text-gray-500'>{link.description}</p>
                      </div>
                      <div className='flex-shrink-0 self-center'>
                        <ChevronRightIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className='mt-8'>
                  <Link
                    href='/'
                    className='text-base font-medium text-blue-700 hover:text-blue-600'
                  >
                    Или идите на начальную страницу
                    <span aria-hidden='true'> &rarr;</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

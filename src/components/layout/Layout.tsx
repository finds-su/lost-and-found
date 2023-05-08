import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import Image from 'next/image'
import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { type Session } from 'next-auth'
import LayoutFooter from '@/components/layout/LayoutFooter'
import classNames from 'classnames/dedupe'

export type Navigation = { name: string; href: string }[]
export const navigation: Navigation = [
  { name: 'Найденные вещи', href: '/finds' },
  { name: 'Потерянные вещи', href: '/losses' },
]

export interface LayoutProps {
  session: Session | null
  pageName: string
  hideTitle?: boolean
  children: React.ReactNode
}

export type UserNavigation = { name: string; func?: () => void; href?: string }[]

const LayoutProfile = dynamic(() => import('@/components/layout/LayoutProfile'), { ssr: true })
const DynamicMobileLayoutMenu = dynamic(() => import('@/components/layout/MobileLayoutMenu'), {
  ssr: false,
})

export default function Layout(props: LayoutProps) {
  const router = useRouter()
  const session = props.session

  const userNavigation: UserNavigation = [
    {
      name: 'Ваш профиль',
      func: () => void router.push(session ? `/u/${session.user.nickname}/` : '/'),
      href: '/u/[nickname]',
    },
    {
      name: 'Ваши пропажи',
      func: () => void router.push(session ? '/losses/my' : '/losses'),
      href: '/losses/my',
    },
    {
      name: 'Ваши находки',
      func: () => void router.push(session ? '/finds/my' : '/finds'),
      href: '/finds/my',
    },
    { name: 'Выйти', func: () => void signOut() },
  ]

  return (
    <>
      <Head>{!props.hideTitle && <title>{props.pageName}</title>}</Head>
      <div className='min-h-full'>
        <Disclosure as='nav' className='bg-gray-800'>
          {({ open }) => (
            <>
              <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                  <div className='flex items-center'>
                    <Link className='flex-shrink-0' href='/'>
                      <Image
                        priority
                        className='h-8 w-8'
                        src='/assets/ninja-logo-white.svg'
                        alt='Mirea Ninja'
                        width={10}
                        height={10}
                      />
                    </Link>
                    <div className='hidden md:block'>
                      <div className='ml-10 flex items-baseline space-x-4'>
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              router.pathname === item.href
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium',
                            )}
                            aria-current={router.pathname === item.href ? 'page' : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  {props.session ? (
                    <LayoutProfile session={props.session} userNavigation={userNavigation} />
                  ) : (
                    <button
                      onClick={() => {
                        void signIn()
                      }}
                      className='rounded-md border px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                    >
                      Войти
                    </button>
                  )}
                  <div className='-mr-2 flex md:hidden'>
                    {/* Mobile menu button */}
                    <Disclosure.Button className='inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                      <span className='sr-only'>Открыть главное меню</span>
                      {open ? (
                        <XMarkIcon className='block h-6 w-6' aria-hidden='true' />
                      ) : (
                        <Bars3Icon className='block h-6 w-6' aria-hidden='true' />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <DynamicMobileLayoutMenu
                session={session}
                navigation={navigation}
                userNavigation={userNavigation}
              />
            </>
          )}
        </Disclosure>

        <header className='bg-white shadow-sm'>
          <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
            <h1 className='text-lg font-semibold leading-6 text-gray-900'>{props.pageName}</h1>
          </div>
        </header>
        <div className='mx-4 min-h-[78vh] max-w-7xl py-6 sm:px-6 md:mx-auto lg:px-8'>
          {props.children}
        </div>
        <LayoutFooter />
      </div>
    </>
  )
}

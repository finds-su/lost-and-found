import { Disclosure } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import React from 'react'
import Image from 'next/image'
import { signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import classNames from '@/utils/classNames'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Avatar from '@/components/profile/Avatar'
import { type Session } from 'next-auth'

const social = [
  {
    name: 'Форум',
    href: 'https://mirea.ninja',
  },
  {
    name: 'Группа в ВК',
    href: 'https://vk.com/mirea.ninja',
  },
  {
    name: 'Чат в ТГ',
    href: 'https://t.me/+4Cfo9i7_N404NjUy',
  },
]

export const navigation = [
  { name: 'Найденные вещи', href: '/finds' },
  { name: 'Потерянные вещи', href: '/losses' },
]

export interface LayoutProps {
  session: Session | null
  pageName: string
  hideTitle?: boolean
  children: React.ReactNode
}

export type UserNavigation = { name: string; href?: string; func?: () => void }[]

const LayoutProfile = dynamic(() => import('@/components/layout/LayoutProfile'), { ssr: true })

export default function Layout(props: LayoutProps) {
  const router = useRouter()
  const session = props.session

  const userNavigation: UserNavigation = [
    { name: 'Ваш профиль', href: session ? `/u/${session.user.nickname}/` : '/' },
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

              <Disclosure.Panel className='md:hidden'>
                <div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as='a'
                      href={item.href}
                      className={classNames(
                        router.pathname === item.href
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium',
                      )}
                      aria-current={router.pathname === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className='border-t border-gray-700 pb-3 pt-4'>
                  {session && (
                    <>
                      <div className='flex items-center px-5'>
                        <Avatar
                          size='sm'
                          placeholderInitials={session.user.nickname.slice(0, 2).toUpperCase()}
                          src={session.user.image}
                          rounded
                        />
                        <div className='ml-3'>
                          <div className='text-base font-medium text-white'>
                            {session.user.name}
                          </div>
                          <div className='text-sm font-medium text-gray-400'>
                            {session.user.email}
                          </div>
                        </div>
                        <button
                          type='button'
                          className='ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                        >
                          <span className='sr-only'>Просмотреть уведомления</span>
                          <BellIcon className='h-6 w-6' aria-hidden='true' />
                        </button>
                      </div>
                      <div className='mt-3 space-y-1 px-2'>
                        {userNavigation.map((item) => (
                          <React.Fragment key={item.name}>
                            {item.href && (
                              <Disclosure.Button
                                as='a'
                                href={item.href}
                                className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
                              >
                                {item.name}
                              </Disclosure.Button>
                            )}
                            {item.func && (
                              <Disclosure.Button
                                as='a'
                                onClick={item.func}
                                className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
                              >
                                {item.name}
                              </Disclosure.Button>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className='bg-white shadow-sm'>
          <div className='mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8'>
            <h1 className='text-lg font-semibold leading-6 text-gray-900'>{props.pageName}</h1>
          </div>
        </header>
        <main>
          <div className='mx-4 max-w-7xl py-6 sm:px-6 md:mx-auto lg:px-8'>{props.children}</div>
        </main>
        <footer className='pt-4'>
          <div className='mx-auto w-full px-6'>
            <div className='-mx-3 flex flex-wrap items-center lg:justify-between'>
              <div className='mb-6 mt-0 w-full max-w-full shrink-0 px-3 lg:mb-0 lg:w-1/2 lg:flex-none'>
                <div className='text-size-sm items-center space-x-1 text-center leading-normal text-slate-500 lg:text-left'>
                  © {new Date().getFullYear()}, сделано с{' '}
                  <span className='transform transition duration-[2000ms] hover:text-red-600'>
                    ♥
                  </span>{' '}
                  командой
                  <Link
                    href='https://mirea.ninja'
                    className='pr-1 font-semibold text-slate-700 hover:text-slate-900'
                    target='_blank'
                  >
                    Mirea Ninja
                  </Link>
                  для РТУ МИРЭА.
                </div>
              </div>
              <div className='mt-0 w-full max-w-full shrink-0 px-3 lg:w-1/2 lg:flex-none'>
                <ul className='mb-0 flex list-none flex-wrap justify-center pl-0 lg:justify-end'>
                  {social.map((item, index) => (
                    <li className='nav-item' key={index}>
                      <a
                        rel='noreferrer'
                        href={item.href}
                        className='ease-soft-in-out text-size-sm block px-4 pb-1 pt-0 font-normal text-slate-500 transition-colors'
                        target='_blank'
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

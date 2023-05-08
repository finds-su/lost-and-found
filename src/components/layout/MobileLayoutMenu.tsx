import { Disclosure } from '@headlessui/react'
import { type Navigation, type UserNavigation } from '@/components/layout/Layout'
import classNames from 'classnames/dedupe'
import { type Session } from 'next-auth'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Avatar from '@/components/profile/Avatar'
import { BellIcon } from '@heroicons/react/24/outline'

interface MobileLayoutMenuProps {
  navigation: Navigation
  userNavigation: UserNavigation
  session: Session | null
}

export default function MobileLayoutMenu(props: MobileLayoutMenuProps) {
  const router = useRouter()
  const { session } = props

  return (
    <Disclosure.Panel className='md:hidden'>
      <div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
        {props.navigation.map((item) => (
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
              <Link className='flex items-center' href='/me'>
                <Avatar
                  size='sm'
                  placeholderInitials={session.user.nickname.slice(0, 2).toUpperCase()}
                  src={session.user.image}
                  rounded
                />
                <div className='ml-3'>
                  <div className='text-base font-medium text-white'>{session.user.name}</div>
                  <div className='text-sm font-medium text-gray-400'>{session.user.email}</div>
                </div>
              </Link>
              <Link
                href='/notifications'
                type='button'
                className='ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
              >
                <span className='sr-only'>Просмотреть уведомления</span>
                <BellIcon className='h-6 w-6' aria-hidden='true' />
              </Link>
            </div>
            <div className='mt-3 space-y-1 px-2'>
              {props.userNavigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as='a'
                  onClick={item.func}
                  className={classNames(
                    router.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-sm font-medium',
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </>
        )}
      </div>
    </Disclosure.Panel>
  )
}

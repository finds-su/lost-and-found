import { Disclosure } from '@headlessui/react'
import { type Navigation, type UserNavigation } from '@/components/layout/layout'
import classNames from 'classnames/dedupe'
import { type Session } from 'next-auth'
import { useRouter } from 'next/router'
import Avatar from '@/components/avatar/avatar'
import { BellIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import { isModeratorOrAdmin } from '@/lib/is-moderator-or-admin'

interface MobileLayoutMenuProps {
  navigation: Navigation
  userNavigation: UserNavigation
  session: Session | null
}

export default function MobileLayoutDropdown(props: MobileLayoutMenuProps) {
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
                : 'text-gray-700 hover:bg-gray-700 hover:text-white',
              'block rounded-md px-3 py-2 text-base font-medium',
            )}
            aria-current={router.pathname === item.href ? 'page' : undefined}
          >
            {item.name}
          </Disclosure.Button>
        ))}
      </div>
      {session && (
        <div className='border-t border-gray-300 pb-3 pt-4'>
          <div className='flex items-center justify-between px-5'>
            <Disclosure.Button
              as='a'
              className='flex items-center'
              href={`/u/${session.user.nickname}`}
            >
              <Avatar size='md' src={session.user.image} rounded resolution={50} />
              <div className='ml-3 flex flex-col truncate'>
                <span className='w-56 text-base font-medium leading-5 text-gray-700'>
                  {session.user.name}
                </span>
                <span className='w-56 text-sm font-medium leading-5 text-gray-500'>
                  {session.user.email}
                </span>
              </div>
            </Disclosure.Button>
            <div className='flex h-6 flex-row items-center'>
              {session && isModeratorOrAdmin(session) && (
                <Disclosure.Button
                  as='a'
                  href='/admin'
                  type='button'
                  className='ml-auto mr-2 flex-shrink-0 rounded-full bg-gray-800 p-1 text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                >
                  <span className='sr-only'>Просмотреть меню администратора</span>
                  <BriefcaseIcon className='h-6 w-6 p-0.5' aria-hidden='true' />
                </Disclosure.Button>
              )}
              <Disclosure.Button
                as='a'
                href='/notifications'
                type='button'
                className='ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
              >
                <span className='sr-only'>Просмотреть уведомления</span>
                <BellIcon className='h-6 w-6' aria-hidden='true' />
              </Disclosure.Button>
            </div>
          </div>
          <div className='mt-3 space-y-1 px-2'>
            {[...props.userNavigation.create, ...props.userNavigation.profile]
              .flat()
              .map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as='a'
                  onClick={item.func}
                  className={classNames(
                    router.pathname === item.href
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-700 hover:text-white',
                    'block cursor-pointer rounded-md px-3 py-2 text-sm font-medium',
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
          </div>
        </div>
      )}
    </Disclosure.Panel>
  )
}

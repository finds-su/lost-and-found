import { BellIcon, PlusIcon, BriefcaseIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { type UserNavigation } from '@/components/layout/layout'
import Link from 'next/link'
import LayoutDropdown, { type LayoutDropdownProps } from '@/components/layout/layout-dropdown'
import Avatar from '@/components/avatar/avatar'
import { Menu } from '@headlessui/react'
import useSessionStore from '@/lib/hooks/store/session-store'
import { isModeratorOrAdmin } from '@/lib/is-moderator-or-admin'

export interface LayoutUserProps {
  userNavigation: UserNavigation
}

export default function LayoutUser(props: LayoutUserProps) {
  const { session } = useSessionStore()
  const layoutDropdown: LayoutDropdownProps[] = session
    ? [
        {
          navigation: props.userNavigation.create,
          name: 'Открыть меню создания постов',
          head: (
            <div className='flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
              <span className='sr-only'>Открыть меню создания постов</span>
              <PlusIcon className='h-6 w-6' aria-hidden='true' />
            </div>
          ),
        },
        {
          navigation: props.userNavigation.profile,
          name: 'Открыть пользовательское меню',
          head: <Avatar size='sm' src={session.user.image} rounded resolution={50} />,
          beforeNavigation: (
            <Menu.Item>
              <div className='px-4 py-3'>
                <a href={`/u/${session.user.nickname}`}>
                  <p className='text-sm'>Вы вошли как</p>
                  <p className='w-40 truncate text-ellipsis text-sm font-semibold text-gray-900'>
                    {session.user.nickname}
                  </p>
                </a>
              </div>
            </Menu.Item>
          ),
        },
      ]
    : []

  return (
    <>
      <button
        type='button'
        className='rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 lg:hidden'
      >
        <span className='sr-only'>Быстрый поиск</span>
        <MagnifyingGlassIcon className='h-6 w-6' aria-hidden='true' />
      </button>
      <div className='hidden md:block'>
        <div className='flex items-center space-x-3'>
          <SidebarSearchInput />
          <div className='mt-1 h-6 w-[0.03rem] bg-gray-400' />
          {session && isModeratorOrAdmin(session) && (
            <Link
              href='/admin'
              className='rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
            >
              <span className='sr-only'>Открыть меню администратора</span>
              <BriefcaseIcon className='h-6 w-6' aria-hidden='true' />
            </Link>
          )}
          <Link
            href='/notifications'
            className='rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
          >
            <span className='sr-only'>Открыть уведомления</span>
            <BellIcon className='h-6 w-6' aria-hidden='true' />
          </Link>
          {layoutDropdown.map((menu, index) => (
            <LayoutDropdown key={index} {...menu} />
          ))}
        </div>
      </div>
    </>
  )
}

function SidebarSearchInput() {
  return (
    <div className='hidden lg:block lg:p-1'>
      <div className='relative mt-1 flex items-center text-gray-400'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <MagnifyingGlassIcon className='h-4 stroke-2' />
        </div>
        <input
          type='text'
          name='search'
          id='search'
          className='block h-7 w-full rounded-md border-gray-400 bg-transparent pl-8 pr-12 placeholder-gray-500 caret-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
          placeholder='Быстрый поиск'
        />
        <div className='absolute inset-y-0 right-0 flex py-1 pr-1.5'>
          <kbd className='inline-flex items-center rounded border border-gray-400 px-1 font-sans text-sm font-medium'>
            /
          </kbd>
        </div>
      </div>
    </div>
  )
}

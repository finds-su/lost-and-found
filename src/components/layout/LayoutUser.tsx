import { type Session } from 'next-auth'
import { BellIcon, PlusIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { type UserNavigation } from '@/components/layout/Layout'
import Link from 'next/link'
import LayoutDropdown, { type LayoutDropdownProps } from '@/components/layout/LayoutDropdown'
import Avatar from '@/components/avatar/Avatar'

export interface LayoutUserProps {
  session: Session
  userNavigation: UserNavigation
}

export default function LayoutUser(props: LayoutUserProps) {
  const layoutDropdown: Omit<LayoutDropdownProps, 'session'>[] = [
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
      head: (
        <Avatar
          size='sm'
          placeholderInitials={props.session.user.nickname.slice(0, 2).toUpperCase()}
          src={props.session.user.image}
          rounded
        />
      ),
      beforeNavigation: (
        <div className='px-4 py-3'>
          <Link href={`/u/${props.session.user.nickname}`}>
            <p className='text-sm'>Вы вошли как</p>
            <p className='w-40 truncate text-ellipsis text-sm font-semibold text-gray-900'>
              {props.session.user.nickname}
            </p>
          </Link>
        </div>
      ),
    },
  ]

  return (
    <div className='hidden md:block'>
      <div className='ml-4 flex items-center space-x-3 md:ml-6'>
        <Link
          href='/notifications'
          className='flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
        >
          <span className='sr-only'>Открыть уведомления</span>
          <BellIcon className='h-6 w-6' aria-hidden='true' />
        </Link>
        {layoutDropdown.map((menu, index) => (
          <LayoutDropdown key={index} session={props.session} {...menu} />
        ))}
      </div>
    </div>
  )
}

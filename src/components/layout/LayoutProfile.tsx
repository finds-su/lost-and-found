import { type Session } from 'next-auth'
import { BellIcon } from '@heroicons/react/24/outline'
import Avatar from '@/components/profile/Avatar'
import React from 'react'
import { type UserNavigation } from '@/components/layout/Layout'
import { Dropdown } from 'flowbite-react'
import Link from 'next/link'

export default function LayoutProfile(props: { session: Session; userNavigation: UserNavigation }) {
  return (
    <div className='hidden md:block'>
      <div className='ml-4 flex items-center md:ml-6'>
        <Link
          href='/notifications'
          className='flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
        >
          <span className='sr-only'>Просмотреть уведомления</span>
          <BellIcon className='h-6 w-6' aria-hidden='true' />
        </Link>

        {/* UserNickname dropdown */}
        <div className='ml-3'>
          <Dropdown
            inline
            arrowIcon={false}
            placement='bottom-end'
            label={
              <a
                href='#'
                className='flex max-w-xs items-center rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
              >
                <span className='sr-only'>Открыть пользовательское меню</span>
                <Avatar
                  size='sm'
                  placeholderInitials={props.session.user.nickname.slice(0, 2).toUpperCase()}
                  src={props.session.user.image}
                  rounded
                />
              </a>
            }
          >
            <Dropdown.Header>
              <Link href='/me'>
                <span className='block text-sm'>Вы вошли как</span>
                <span className='block truncate text-sm font-medium'>
                  {props.session.user.nickname}
                </span>
              </Link>
            </Dropdown.Header>
            {props.userNavigation.map((item, index) => (
              <React.Fragment key={index}>
                {index === props.userNavigation.length - 1 && <Dropdown.Divider />}
                <Dropdown.Item onClick={item.func}>{item.name}</Dropdown.Item>
              </React.Fragment>
            ))}
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

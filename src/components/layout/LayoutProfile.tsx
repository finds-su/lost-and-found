import { type Session } from 'next-auth'
import { BellIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import Avatar from '@/components/profile/Avatar'
import React, { Fragment } from 'react'
import { type UserNavigation } from '@/components/layout/Layout'
import classNames from '@/utils/classNames'
import Image from 'next/image'

export default function LayoutProfile(props: { session: Session; userNavigation: UserNavigation }) {
  return (
    <div className='hidden md:block'>
      <div className='ml-4 flex items-center md:ml-6'>
        <button
          type='button'
          className='rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
        >
          <span className='sr-only'>Просмотреть уведомления</span>
          <BellIcon className='h-6 w-6' aria-hidden='true' />
        </button>

        {/* UserNickname dropdown */}
        <Menu as='div' className='relative ml-3'>
          <div>
            <Menu.Button className='flex max-w-xs items-center rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
              <span className='sr-only'>Открыть пользовательское меню</span>
              <Avatar
                size='sm'
                placeholderInitials={props.session.user.nickname.slice(0, 2).toUpperCase()}
                src={props.session.user.image}
                rounded
              />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              {props.userNavigation.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <>
                      {item.href && (
                        <a
                          href={item.href}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700',
                          )}
                        >
                          {item.name}
                        </a>
                      )}
                      {item.func && (
                        <button
                          onClick={item.func}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700',
                          )}
                        >
                          {item.name}
                        </button>
                      )}
                    </>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

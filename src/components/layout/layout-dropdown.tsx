import { Menu, Transition } from '@headlessui/react'
import { type ReactNode, Fragment } from 'react'
import classNames from 'classnames/dedupe'
import { type UserNavigationDropdown } from '@/components/layout/layout'

export type LayoutDropdownProps = {
  navigation: UserNavigationDropdown
  name: string
  head: ReactNode
  beforeNavigation?: ReactNode
}

export default function LayoutDropdown(props: LayoutDropdownProps) {
  return (
    <Menu as='div' className='relative'>
      <div>
        <Menu.Button className='flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
          <span className='sr-only'>{props.name}</span>
          {props.head}
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
        <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          {props.beforeNavigation}
          {props.navigation.map((navigationChunk, index) => (
            <div className='py-1' key={index}>
              {navigationChunk.map((navigation) => (
                <Menu.Item key={navigation.name}>
                  {({ active }) => (
                    <a
                      onClick={navigation.func}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block cursor-pointer px-4 py-2 text-sm',
                      )}
                    >
                      {navigation.name}
                    </a>
                  )}
                </Menu.Item>
              ))}
            </div>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

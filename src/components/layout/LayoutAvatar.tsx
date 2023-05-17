import { type Session } from 'next-auth'
import { BellIcon } from '@heroicons/react/24/outline'
import React from 'react'
import { type UserNavigation } from '@/components/layout/Layout'
import Link from 'next/link'
import DynamicLayoutAvatarDropdown from '@/components/layout/DynamicLayoutAvatarDropdown'

export interface LayoutAvatarProps {
  session: Session
  userNavigation: UserNavigation
}

export default function LayoutAvatar(props: LayoutAvatarProps) {
  return (
    <div className='hidden md:block'>
      <div className='ml-4 flex items-center md:ml-6'>
        <Link
          href='/notifications'
          className='flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
        >
          <span className='sr-only'>Открыть уведомления</span>
          <BellIcon className='h-6 w-6' aria-hidden='true' />
        </Link>

        <DynamicLayoutAvatarDropdown {...props} />
      </div>
    </div>
  )
}

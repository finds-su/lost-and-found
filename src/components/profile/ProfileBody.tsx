import { type ReactNode } from 'react'
import { type Role } from '@prisma/client'
import Head from 'next/head'
import Window from '@/components/form/Window'
import Avatar from '@/components/avatar/Avatar'
import useEditProfileStore from '@/hooks/store/editProfileStore'
import DynamicEditProfileSlideOver from '@/components/profile/DynamicEditProfileSlideOver'

interface User {
  nickname: string
  name: string
  email?: string
  role: Role
  image?: string
  userInfo: string
  telegramLink?: string
  isBlocked?: boolean
}

export interface ProfileProps {
  isOwner: boolean
  user: User
}

export default function ProfileBody(props: ProfileProps) {
  const user = props.user
  const editProfile = useEditProfileStore()

  const profileInfo: { name: string; value: ReactNode }[] = [
    {
      name: 'Имя',
      value: user.name,
    },
    {
      name: 'Аватар',
      value: (
        <Avatar
          size='md'
          placeholderInitials={user.nickname.slice(0, 2).toUpperCase()}
          src={user.image}
          rounded
        />
      ),
    },
    { name: 'Никнейм', value: user.nickname },
    ...(user.email ? [{ name: 'Почта', value: user.email }] : []),
    ...(user.telegramLink ? [{ name: 'Telegram', value: user.telegramLink }] : []),
    { name: 'Роль', value: user.role },
    ...(user.isBlocked ? [{ name: 'Заблокирован', value: user.isBlocked ? 'да' : 'нет' }] : []),
    { name: 'Обо мне', value: user.userInfo },
  ]

  return (
    <>
      <Head>
        <title>{props.user.name}</title>
      </Head>
      <Window>
        <div className='flex flex-row justify-between'>
          <div>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Информация приложения</h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>Детализация личной информации.</p>
          </div>
          {props.isOwner && (
            <span className='ml-4 flex-shrink-0'>
              <button
                type='button'
                onClick={editProfile.open}
                className='rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                Редактировать
              </button>
            </span>
          )}
        </div>
        <div className='mt-5 border-t border-gray-200'>
          <dl className='divide-y divide-gray-200'>
            {profileInfo.map((rowInfo) => (
              <div key={rowInfo.name} className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
                <dt className='text-sm font-medium text-gray-500'>{rowInfo.name}</dt>
                <dd className='mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  <span className='flex-grow'>{rowInfo.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <DynamicEditProfileSlideOver />
      </Window>
    </>
  )
}

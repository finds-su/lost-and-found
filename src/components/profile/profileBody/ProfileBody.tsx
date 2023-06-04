import { type ReactNode } from 'react'
import Window from '@/components/form/Window'
import Avatar from '@/components/avatar/Avatar'
import useEditProfileStore from '@/lib/hooks/store/editProfileStore'
import { type User } from '@prisma/client'
import DynamicEditProfileSlideOver from '@/components/profile/editProfileSlideOver/DynamicEditProfileSlideOver'
import { NextSeo } from 'next-seo'
import { env } from '@/env.mjs'
import useSessionStore from '@/lib/hooks/store/sessionStore'

export interface ProfileProps {
  isOwner: boolean
  user: Partial<User> & { nickname: string }
}

export default function ProfileBody(props: ProfileProps) {
  const user = props.user
  const editProfile = useEditProfileStore()
  const { session } = useSessionStore()

  const profileInfo: { name: string; value: ReactNode }[] = [
    {
      name: 'Имя',
      value: user.name,
    },
    {
      name: 'Аватар',
      value: <Avatar size='md' src={user.image} rounded resolution={100} />,
    },
    { name: 'Никнейм', value: user.nickname },
    ...(user.email ? [{ name: 'Почта', value: user.email }] : []),
    { name: 'Роль', value: user.role },
    ...(user.isBlocked ? [{ name: 'Заблокирован', value: user.isBlocked ? 'да' : 'нет' }] : []),
    { name: 'Обо мне', value: user.userInfo },
  ]

  return (
    <>
      <NextSeo
        title={props.user.name ?? undefined}
        openGraph={{
          url: `${env.NEXT_PUBLIC_NEXTAUTH_URL}/u/${props.user.nickname}`,
          title: props.user.name ?? undefined,
          description: `@${props.user.nickname}`,
          ...(props.user.image && {
            images: [
              {
                url: props.user.image,
                width: 300,
                height: 300,
                alt: props.user.nickname,
              },
            ],
          }),
        }}
      />
      <Window>
        <div className='grid grid-cols-1 place-content-between justify-between md:grid-cols-2'>
          <div>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>Информация приложения</h3>
            <p className='mt-1 max-w-2xl text-sm text-gray-500'>Детализация личной информации.</p>
          </div>
          {props.isOwner && (
            <span className='text-right'>
              <button
                type='button'
                onClick={editProfile.open}
                className='mb:self-end rounded-md bg-white font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
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
        {props.isOwner && session?.user && <DynamicEditProfileSlideOver user={session.user} />}
      </Window>
    </>
  )
}
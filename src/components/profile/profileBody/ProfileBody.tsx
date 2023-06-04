import { type ReactNode, useState } from 'react'
import Window from '@/components/form/Window'
import Avatar from '@/components/avatar/Avatar'
import useEditProfileStore from '@/lib/hooks/store/editProfileStore'
import DynamicEditProfileSlideOver from '@/components/profile/editProfileSlideOver/DynamicEditProfileSlideOver'
import { NextSeo } from 'next-seo'
import { env } from '@/env.mjs'
import { api } from '@/lib/api'
import { useRouter } from 'next/router'
import { type RouterOutput } from '@/server/api/root'

export default function ProfileBody() {
  const router = useRouter()
  const userNickname = router.query.nickname as string
  const [profile, setProfile] = useState<RouterOutput['users']['getUser']>()
  const user = profile?.user
  const isOwner = profile?.isOwner
  const profileQuery = api.users.getUser.useQuery(
    { nickname: userNickname },
    { onSuccess: (data) => setProfile(data) },
  )
  const editProfile = useEditProfileStore()

  const profileInfo: { name: string; value: ReactNode }[] = user
    ? [
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
    : []

  if (!user || !profileQuery.data) {
    return <div />
  }

  return (
    <>
      <NextSeo
        title={user.name ?? undefined}
        openGraph={{
          url: `${env.NEXT_PUBLIC_NEXTAUTH_URL}/u/${user.nickname}`,
          title: user.name ?? undefined,
          description: `@${user.nickname}`,
          ...(user.image && {
            images: [
              {
                url: user.image,
                width: 300,
                height: 300,
                alt: user.nickname,
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
          {isOwner && (
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
        {isOwner && <DynamicEditProfileSlideOver user={user} />}
      </Window>
    </>
  )
}

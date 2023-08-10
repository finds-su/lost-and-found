import Image from 'next/image'
import Link from 'next/link'
import { Session } from 'next-auth'
import React from 'react'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { api, type RouterOutputs } from '@/lib/api'
import useSessionStore from '@/lib/hooks/store/session-store'
// import { type GetServerSideProps } from 'next'
// import { getServerAuthSession } from '@/server/auth'

export default function SocialNetworksConnectionBanner() {
  const { session } = useSessionStore()

  const getMySocialNetworks = api.users.getMySocialNetworks.useQuery<
    RouterOutputs['users']['getMySocialNetworks']
  >(undefined, {
    enabled: session != null,
  })

  // const generateVkAuthLink = api.users.generateVkAuthLink.useQuery<
  //   RouterOutputs['users']['generateVkAuthLink']
  // >(undefined, {
  //   enabled: session != null,
  // })

  return (
    (getMySocialNetworks.isFetched &&
      session !== null &&
      getMySocialNetworks.data?.socialNetworks.length === 0 && (
        <div className='mx-auto max-w-7xl rounded-lg bg-blue-500 px-3 py-3 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-7xl px-3 py-3 sm:px-6 lg:px-8'>
            <div className='flex flex-wrap items-center justify-between'>
              <div className='flex w-0 flex-1 items-center'>
                <span className='bg-primary-800 flex rounded-lg p-2'>
                  <ChatBubbleLeftIcon className='h-6 w-6 text-white' aria-hidden='true' />
                </span>
                <p className='ml-3 font-medium text-white'>
                  <span className='md:hidden'>Привяжите соцсети, прежде чем публиковать посты</span>
                  <span className='hidden md:inline'>
                    Собираетесь опубликовать пост? Обязательно{' '}
                    <Link
                      href={`/u/${session?.user?.nickname || ''}?open=socials`}
                      className='font-medium text-white underline'
                    >
                      привяжите соцсети
                    </Link>
                    , чтобы получать уведомления и с вами могли связаться
                  </span>
                </p>
              </div>
              <div className='flex-shrink-0 flex-col items-center justify-center space-y-1 sm:ml-3'>
                <Link
                  href={`/u/${session?.user?.nickname || ''}?open=socials`}
                  className='text-primary-900 flex items-center justify-center rounded-lg border border-transparent bg-white p-2 text-sm font-medium shadow-sm hover:bg-gray-50'
                >
                  Настройки
                </Link>
              </div>
            </div>
          </div>
        </div>
      )) || <></>
  )
}

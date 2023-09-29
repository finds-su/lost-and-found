import Window from '@/components/form/window'
import { Campus } from '@/lib/campus'
import { formatDate } from '@/lib/format-date'
import { api, type RouterOutputs } from '@/lib/api'
import { useRouter } from 'next/router'
import { type PostItemReason } from '@prisma/client'
import { useState } from 'react'
import errorToast from '@/components/toasts/error-toast'
import DynamicOverviewPostImage from '@/components/posts/overview/overview-post-image/dynamic-overview-post-image'
import PostStatusBadge from '@/components/posts/post-status-badge/post-status-badge'
import OverviewPostSkeleton from '@/components/posts/overview/overview-post/overview-post-skeleton'
import Image from 'next/image'
import Link from 'next/link'
import useSessionStore from '@/lib/hooks/store/session-store'
import { IsInStoragePlaceBanner } from '../../is-in-storage-place-banner'

interface OverviewPostProps {
  reason: PostItemReason
}

export default function OverviewPost(props: OverviewPostProps) {
  const slug = useRouter().query.slug as string
  const { session } = useSessionStore()
  const [post, setPost] = useState<RouterOutputs['posts']['getPostBySlug']>()
  const postQuery = api.posts.getPostBySlug.useQuery(
    { slug: slug, reason: props.reason },
    {
      onSuccess: (data) => {
        if (data) {
          setPost(data)
        }
      },
      onError: (error) => {
        errorToast(error.message)
      },
    },
  )

  const features = post
    ? [
        { name: 'Дата создания', description: formatDate(post.created.toString()) },
        {
          name: 'Опубликовано до',
          description: formatDate(post.expires.toString()),
        },
        { name: 'Кампус', description: Campus[post.campus] },
        {
          name: 'Автор',
          description: (
            <div>
              <p>{post.user.name}</p>
              <Link
                href={`/u/${post.user.nickname}`}
                className='font-medium text-blue-600 hover:underline dark:text-blue-500'
              >
                @{post.user.nickname}
              </Link>
            </div>
          ),
        },
      ]
    : []

  const getLinkForSocialNetwork = (socialNetwork: string, externalId: string, username: string) => {
    switch (socialNetwork) {
      case 'VK':
        return `https://vk.com/id${externalId}`
      case 'TELEGRAM':
        return `https://t.me/${username}`
      default:
        return ''
    }
  }

  const findSocialNetworkByName = (network: string, socialNetworks: Record<string, any>[]) => {
    return socialNetworks.find(
      (socialNetwork) =>
        socialNetwork.socialNetwork === network &&
        (socialNetwork.externalId || socialNetwork.username),
    ) as Record<string, string>
  }

  return (
    <Window>
      <div className='grid-cols-1 md:flex md:flex-col md:space-y-6 md:p-6'>
        {postQuery.isLoading ? (
          <OverviewPostSkeleton />
        ) : post ? (
          <>
            <div>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                <div className='flex items-center md:flex-row'>
                  <h2 className='pr-4 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl'>
                    {post.name}
                  </h2>
                  <PostStatusBadge status={post.status} />
                </div>
                {(post.user.id === session?.user.id ||
                  session?.user.role === 'ADMIN' ||
                  session?.user.role === 'MODERATOR') && (
                  <Link
                    className='text-sm font-medium text-blue-600 hover:underline dark:text-blue-500'
                    href={`/edit/${post.id}`}
                  >
                    Редактировать
                  </Link>
                )}
              </div>
              <p className='mt-4 overflow-hidden text-ellipsis text-gray-500'>{post.description}</p>
              <dl className='mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8'>
                {features.map((feature) => (
                  <div key={feature.name} className='border-t border-gray-200 pt-4'>
                    <dt className='font-medium text-gray-900'>{feature.name}</dt>
                    <dd className='mt-2 text-sm text-gray-500'>{feature.description}</dd>
                  </div>
                ))}
              </dl>
              <div className='mt-6'>{post.isInStoragePlace && <IsInStoragePlaceBanner />}</div>
            </div>
            <div className='mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3'>
              {post?.images.map((image, index) => (
                <DynamicOverviewPostImage key={index} src={image} />
              ))}
            </div>

            {post.user.socialNetworks.length > 0 && (
              <div className='mt-6 flex flex-col space-y-2'>
                <h3 className='text-xl font-medium text-gray-900'>Связаться с автором</h3>
                <div className='flex space-x-2'>
                  {findSocialNetworkByName('VK', post.user.socialNetworks) && (
                    <Link
                      className='flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 pl-1 pr-2 text-white hover:bg-blue-700'
                      href={getLinkForSocialNetwork(
                        'VK',
                        findSocialNetworkByName('VK', post.user.socialNetworks).externalId || '',
                        findSocialNetworkByName('VK', post.user.socialNetworks).username || '',
                      )}
                    >
                      <Image
                        src='/icons/vk.svg'
                        alt=''
                        width={20}
                        height={20}
                        className='mr-2'
                        style={{ filter: 'invert(1)' }}
                      />
                      ВКонтакте
                    </Link>
                  )}

                  {findSocialNetworkByName('TELEGRAM', post.user.socialNetworks) && (
                    <Link
                      className='flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 pl-1 pr-2 text-white hover:bg-blue-700'
                      href={getLinkForSocialNetwork(
                        'TELEGRAM',
                        findSocialNetworkByName('TELEGRAM', post.user.socialNetworks).externalId ||
                          '',
                        findSocialNetworkByName('TELEGRAM', post.user.socialNetworks).username ||
                          '',
                      )}
                    >
                      <Image
                        src='/icons/telegram.svg'
                        alt=''
                        width={20}
                        height={20}
                        className='mr-2'
                        style={{ filter: 'invert(1)' }}
                      />
                      Telegram
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className='flex h-110 flex-col items-center justify-center text-center font-medium text-gray-700 lg:h-130'>
            <Image
              src='/assets/illustrations/basket.png'
              alt=''
              width={200}
              height={200}
              priority={false}
            />
            Пост не найден
          </div>
        )}
      </div>
    </Window>
  )
}

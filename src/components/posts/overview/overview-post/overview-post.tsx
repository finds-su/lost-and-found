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

interface OverviewPostProps {
  reason: PostItemReason
}

export default function OverviewPost(props: OverviewPostProps) {
  const postId = useRouter().query.postId as string
  const [post, setPost] = useState<RouterOutputs['posts']['getPost']>()

  const postQuery = api.posts.getPost.useQuery(
    { postId: postId, reason: props.reason },
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
          name: 'Истекает',
          description: formatDate(post.expires.toString()),
        },
        { name: 'Кампус', description: Campus[post.campus] },
        {
          name: 'Автор',
          description: (
            <div>
              <p>{post.user.name}</p>
              <a
                href={`/u/${post.user.nickname}`}
                className='font-medium text-blue-600 hover:underline dark:text-blue-500'
              >
                @{post.user.nickname}
              </a>
            </div>
          ),
        },
      ]
    : []

  return (
    <Window>
      <div className='mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8'>
        {post && (
          <>
            <div>
              <div className='flex flex-row items-center space-x-4'>
                <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
                  {post.name}
                </h2>
                <PostStatusBadge status={post.status} />
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
            </div>
            <div className='grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8'>
              {post?.images.map((image, index) => (
                <DynamicOverviewPostImage key={index} src={image} />
              ))}
            </div>
          </>
        )}
      </div>
    </Window>
  )
}

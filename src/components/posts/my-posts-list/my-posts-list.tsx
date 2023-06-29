import { type PostItemReason } from '@prisma/client'
import Window from '@/components/form/window'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { api, type RouterOutputs } from '@/lib/api'
import { useState } from 'react'
import { formatDate } from '@/lib/format-date'
import Link from 'next/link'
import { Campus } from '@/lib/campus'

interface MyPostsListProps {
  reason: PostItemReason
}

function MyPostSkeleton() {
  return (
    <li className='flex animate-pulse justify-between gap-x-6 py-5'>
      <div className='min-w-0'>
        <div className='mb-4 h-2.5 w-48 rounded-full bg-gray-200' />
        <div className='mb-2.5 h-2 w-64 rounded-full bg-gray-200' />
      </div>
      <div className='hidden sm:flex sm:flex-row sm:items-center sm:gap-x-4'>
        <div className='flex flex-col items-end'>
          <div className='mb-3 h-2 w-32 rounded-full bg-gray-200' />
          <div className='mb-2.5 h-2 w-60 rounded-full bg-gray-200' />
        </div>
        <ChevronRightIcon className='h-5 w-5 text-gray-500' />
      </div>
    </li>
  )
}

export default function MyPostsList(props: MyPostsListProps) {
  const myPostsListQuery = api.posts.getMyPosts.useQuery(
    { reason: props.reason },
    { onSuccess: (data) => setMyPosts(data) },
  )

  const [myPosts, setMyPosts] = useState<RouterOutputs['posts']['getMyPosts']>([])
  return (
    <Window>
      <ul role='list' className='divide-y divide-gray-100'>
        {myPostsListQuery.isLoading &&
          Array.from(Array(5).keys()).map((index) => <MyPostSkeleton key={index} />)}
        {myPosts.map((myPost, index) => (
          <Link href={myPost.id} key={index}>
            <li className='flex justify-between gap-x-6 py-5'>
              <div className='min-w-0'>
                <p className='text-sm font-semibold leading-6 text-gray-900'>{myPost.name}</p>
                <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
                  {myPost.description}
                </p>
              </div>
              <div className='hidden sm:flex sm:flex-row sm:items-center sm:gap-x-4'>
                <div className='flex flex-col items-end'>
                  <p className='text-sm leading-6 text-gray-900'>{Campus[myPost.campus]}</p>
                  <p className='mt-1 text-xs leading-5 text-gray-500'>
                    {formatDate(myPost.created.toString())} —{' '}
                    {formatDate(myPost.expires.toString())}
                  </p>
                </div>
                <ChevronRightIcon className='h-5 w-5 text-gray-500' />
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </Window>
  )
}

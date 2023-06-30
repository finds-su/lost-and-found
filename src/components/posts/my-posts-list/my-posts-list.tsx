import { type PostItemReason } from '@prisma/client'
import Window from '@/components/form/window'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { api, type RouterInputs, type RouterOutputs } from '@/lib/api'
import { useState } from 'react'
import { formatDate } from '@/lib/format-date'
import Link from 'next/link'
import { Campus } from '@/lib/campus'
import Image from 'next/image'
import classNames from 'classnames/dedupe'

const pageSize = 5

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

export default function MyPostsList({ reason }: MyPostsListProps) {
  const [myPosts, setMyPosts] = useState<RouterOutputs['posts']['getMyPosts']['items']>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState<RouterOutputs['posts']['getMyPosts']['hasMore']>()
  const [previousCursor, setPreviousCursor] =
    useState<RouterInputs['posts']['getMyPosts']['cursor']>()

  const myPostsListQuery = api.posts.getMyPosts.useInfiniteQuery(
    { reason, limit: pageSize },
    {
      onSuccess: (data) => {
        const result = data.pages[page]
        setMyPosts(result?.items ?? [])
        setHasMore(result?.hasMore)
        setPreviousCursor(previousCursor)
      },
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      getPreviousPageParam: () => previousCursor,
    },
  )

  const [countPost, setCountPosts] = useState<number>()

  const countMyPostsQuery = api.posts.countMyPosts.useQuery(
    { reason },
    {
      onSuccess: (data) => {
        setCountPosts(data)
      },
    },
  )

  const previousPageButtonIsDisabled = page === 0
  const nextPageButtonIsDisabled = !hasMore

  const fetchNextPage = async () => {
    setPage(page + 1)
    await myPostsListQuery.fetchNextPage()
  }

  const fetchPreviousPage = async () => {
    setPage(page - 1)
    await myPostsListQuery.fetchPreviousPage()
  }

  return (
    <Window>
      <ul role='list' className='divide-y divide-gray-100'>
        {myPostsListQuery.isLoading &&
          Array.from(Array(5).keys()).map((index) => <MyPostSkeleton key={index} />)}
        {!myPostsListQuery.isLoading && myPosts.length === 0 && (
          <div className='flex h-110 flex-col items-center justify-center text-center font-medium text-gray-700 lg:h-130'>
            <Image
              src='/assets/illustrations/basket.png'
              alt=''
              width={200}
              height={200}
              priority={false}
            />
            Постов нет
          </div>
        )}
        {!myPostsListQuery.isLoading && myPosts.length > 0 && (
          <>
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
                        Дата создания: {formatDate(myPost.created.toString())}, истекает:{' '}
                        {formatDate(myPost.expires.toString())}
                      </p>
                    </div>
                    <ChevronRightIcon className='h-5 w-5 text-gray-500' />
                  </div>
                </li>
              </Link>
            ))}
            <nav
              className='flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6'
              aria-label='Pagination'
            >
              <div className='hidden sm:block'>
                <p className='text-sm text-gray-700'>
                  <span className='font-medium'>{page * pageSize + 1}</span>–
                  <span className='font-medium'>{page * pageSize + myPosts.length}</span> из{' '}
                </p>
              </div>
              <div className='flex flex-1 justify-between sm:justify-end'>
                <button
                  disabled={previousPageButtonIsDisabled}
                  onClick={() => void fetchPreviousPage()}
                  className={classNames(
                    'relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700',
                    previousPageButtonIsDisabled ? 'bg-gray-100' : 'bg-white hover:bg-gray-50',
                  )}
                >
                  Предыдущая
                </button>
                <button
                  disabled={nextPageButtonIsDisabled}
                  onClick={() => void fetchNextPage()}
                  className={classNames(
                    'relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700',
                    nextPageButtonIsDisabled ? 'bg-gray-100' : 'bg-white hover:bg-gray-50',
                  )}
                >
                  Следующая
                </button>
              </div>
            </nav>
          </>
        )}
      </ul>
    </Window>
  )
}

import { type ReactNode, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'
import { type PostItemReason } from '@prisma/client'
import { Campus } from '@/lib/campus'
import { api, type RouterOutputs } from '@/lib/api'
import { humanReadableDate } from '@/lib/human-readable-date'
import GridFilter from '@/components/posts/grid/grid-filter'
import useScrollGridStore from '@/lib/hooks/store/scroll-grids-store'
import Spinner from '@/components/spinner'

export default function InfiniteScrollGridWithFilter(props: {
  reason: PostItemReason
  endMessage: ReactNode
}) {
  const { enabledSortOption, checkedFilters } = useScrollGridStore((state) => state[props.reason])
  const postsQuery = api.posts.infinitePosts.useInfiniteQuery(
    {
      limit: 12,
      reason: props.reason,
      orderByCreationDate: enabledSortOption,
      filters: checkedFilters,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  )
  const [posts, setPosts] = useState<RouterOutputs['posts']['infinitePosts']['items']>([])
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (postsQuery.data) {
      setPosts(postsQuery.data.pages.map((query) => query.items).flat())
      setHasMore(postsQuery.data.pages.at(-1)?.nextCursor !== undefined)
    }
  }, [postsQuery.data])

  const fetchMoreData = () => {
    if (postsQuery.data && postsQuery.data.pages.length * 10 >= 500) {
      setHasMore(false)
      return
    }
    void postsQuery.fetchNextPage()
  }

  return (
    <div>
      <GridFilter reason={props.reason} />
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={
          <p className='col-span-2 flex justify-center py-5 text-center md:col-span-4'>
            <Spinner />
            <span className='sr-only'>Загрузка...</span>
          </p>
        }
        endMessage={
          <div className='col-span-2 flex justify-center text-center font-medium text-gray-700 md:col-span-4'>
            {props.endMessage}
          </div>
        }
        className='grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-1 lg:gap-x-8'
      >
        {posts.map((post) => (
          <div key={post.id} className='group relative'>
            <div className='h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80'>
              <Image
                src={post.images[0] ? post.images[0] : '/assets/placeholder.svg'}
                alt={''}
                width={800}
                height={800}
                className='h-full w-full object-cover object-center'
                priority
                aria-hidden='true'
              />
            </div>
            <h3 className='mt-4 overflow-hidden text-ellipsis text-sm text-gray-900'>
              <a href={`${props.reason === 'LOST' ? 'losses' : 'finds'}/${post.id}`}>
                <span className='absolute inset-0' />
                {post.name}
              </a>
            </h3>
            <p className='mt-1 text-sm font-medium text-gray-700'>{Campus[post.campus]}</p>
            <p className='mt-1 text-sm text-gray-500'>{post.user.nickname}</p>
            <p className='font-xs mt-1 text-xs text-gray-500'>{humanReadableDate(post.created)}</p>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}

import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'
import { type PublicUser } from '@/pages/u/[nickname]'
import { type Campus as DBCampus, type PostItemReason } from '@prisma/client'
import { Campus } from '@/utils/campus'
import { api } from '@/utils/api'
import { humanReadableDate } from '@/utils/humanReadableDate'

interface Item {
  id: string
  name: string
  campus: DBCampus
  reason: PostItemReason
  images: string[]
  created: Date
  user: PublicUser
}
export default function InfiniteScrollGrid(props: { reason: PostItemReason; endMessage: string }) {
  const itemsQuery = api.items.infiniteItems.useInfiniteQuery(
    { limit: 12, reason: props.reason },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  )
  const [items, setItems] = useState<Item[]>([])
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (itemsQuery.data) {
      setItems(itemsQuery.data.pages.map((query) => query.items).flat())
      setHasMore(itemsQuery.data.pages.at(-1)?.nextCursor !== undefined)
    }
  }, [itemsQuery.data])

  const fetchMoreData = () => {
    if (itemsQuery.data && itemsQuery.data.pages.length * 10 >= 500) {
      setHasMore(false)
      return
    }
    void itemsQuery.fetchNextPage()
  }

  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<p className='col-span-2 text-center md:col-span-4'>Загрузка...</p>}
      endMessage={<p className='col-span-2 text-center md:col-span-4'>{props.endMessage}</p>}
      className='grid min-h-screen grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-1 lg:gap-x-8'
    >
      {items.map((post) => (
        <div key={post.id} className='group relative'>
          <div className='h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80'>
            <Image
              src={post.images[0] ? post.images[0] : '/assets/placeholder.svg'}
              alt={''}
              width={150}
              height={350}
              className='h-full w-full object-cover object-center'
              priority
            />
          </div>
          <h3 className='mt-4 text-sm text-gray-900'>
            <a href={'#'}>
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
  )
}

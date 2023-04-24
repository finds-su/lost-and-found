import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'
import { type PublicUser } from '@/pages/u/[userNickname]'
import { type Campus as DBCampus, type PostItemReason } from '@prisma/client'
import { Campus } from '@/utils/campus'
import { api } from '@/utils/api'

interface Item {
  id: string
  name: string
  campus: DBCampus
  reason: PostItemReason
  images: string[]
  user: PublicUser
}
export default function InfiniteScrollGrid(props: { reason: PostItemReason }) {
  const itemsQuery = api.items.infiniteItems.useInfiniteQuery(
    { limit: 10, reason: props.reason },
    { getNextPageParam: (lastPage) => lastPage.nextCursor },
  )
  const [items, setItems] = useState<Item[]>(
    itemsQuery.data?.pages.map((query) => query.items).flat() ?? [],
  )
  const [hasMore, setHasMore] = useState(true)
  const fetchMoreData = async () => {
    if (itemsQuery.data && itemsQuery.data.pages.length * 10 >= 500) {
      setHasMore(false)
      return
    }
    await itemsQuery.fetchNextPage()
    setItems(itemsQuery.data?.pages.map((query) => query.items).flat() ?? [])
  }
  return (
    <InfiniteScroll
      dataLength={items.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p>
          <b>Yay! You have seen it all</b>
        </p>
      }
      className='grid h-screen min-h-screen grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-1 lg:gap-x-8'
    >
      {items.map((post, index) => (
        <div key={index} className='group relative'>
          <div className='h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80'>
            <Image
              src={post.images[0] ? post.images[0] : '/assets/placeholder.svg'}
              alt={''}
              width={150}
              height={350}
              className='h-full w-full object-cover object-center'
            />
          </div>
          <h3 className='mt-4 text-sm text-gray-700'>
            <a href={'#'}>
              <span className='absolute inset-0' />
              {post.name}
            </a>
          </h3>
          <p className='mt-1 text-sm text-gray-500'>{post.user.nickname}</p>
          <p className='mt-1 text-sm font-medium text-gray-900'>{Campus[post.campus]}</p>
        </div>
      ))}
    </InfiniteScroll>
  )
}

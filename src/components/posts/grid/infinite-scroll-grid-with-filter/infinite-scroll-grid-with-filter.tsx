import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'
import { PostItemReason } from '@prisma/client'
import { api, type RouterOutputs } from '@/lib/api'
import GridFilter from '@/components/posts/grid/grid-filter'
import useScrollGridStore from '@/lib/hooks/store/scroll-grids-store'
import Spinner from '@/components/spinner'
import { PostCard } from '../../post-card'

function ScrollGridLoader() {
  return (
    <p className='col-span-2 flex justify-center py-5 text-center md:col-span-4'>
      <Spinner />
      <span className='sr-only'>Загрузка...</span>
    </p>
  )
}

function ScrollGridEndMessage() {
  return (
    <div className='col-span-2 flex flex-col items-center text-sm text-gray-600 md:col-span-4'>
      <Image
        src='/assets/svg-illustrations/items-not-found.svg'
        alt=''
        width={200}
        height={200}
        priority={false}
      />
      <p className='mt-2'>Пока что тут ничего нет</p>
    </div>
  )
}

interface InfiniteScrollGridWithFilterProps {
  reason: PostItemReason
}

export default function InfiniteScrollGridWithFilter({
  reason,
}: InfiniteScrollGridWithFilterProps) {
  const { enabledSortOption, checkedFilters } = useScrollGridStore((state) => state[reason])
  const postsQuery = api.posts.infinitePosts.useInfiniteQuery(
    {
      limit: 12,
      reason,
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
    <>
      <GridFilter reason={reason} />
      {posts.length > 0 ? (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<ScrollGridLoader />}
          endMessage={ScrollGridEndMessage()}
          className='grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-1 lg:gap-x-8'
        >
          {posts.map((post) => (
            <div key={post.id.toString()} className='relative'>
              <PostCard post={post} displayReasonLabel={reason === 'ANY'} />
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        ScrollGridEndMessage()
      )}
    </>
  )
}

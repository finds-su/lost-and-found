import dynamic from 'next/dynamic'
import InfiniteScrollGridWithFilterSkeleton from '@/components/posts/grid/infiniteScrollGridWithFilter/InfiniteScrollGridWithFilterSkeleton'

const DynamicInfiniteScrollGridWithFilter = dynamic(
  () => import('@/components/posts/grid/infiniteScrollGridWithFilter/InfiniteScrollGridWithFilter'),
  {
    loading: () => <InfiniteScrollGridWithFilterSkeleton />,
    ssr: false,
  },
)

export default DynamicInfiniteScrollGridWithFilter

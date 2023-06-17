import dynamic from 'next/dynamic'
import InfiniteScrollGridWithFilterSkeleton from '@/components/posts/grid/infinite-scroll-grid-with-filter/InfiniteScrollGridWithFilterSkeleton'

const DynamicInfiniteScrollGridWithFilter = dynamic(
  () =>
    import('@/components/posts/grid/infinite-scroll-grid-with-filter/InfiniteScrollGridWithFilter'),
  {
    loading: () => <InfiniteScrollGridWithFilterSkeleton />,
    ssr: false,
  },
)

export default DynamicInfiniteScrollGridWithFilter

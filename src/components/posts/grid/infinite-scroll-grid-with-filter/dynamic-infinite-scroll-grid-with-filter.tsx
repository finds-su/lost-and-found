import dynamic from 'next/dynamic'
import InfiniteScrollGridWithFilterSkeleton from '@/components/posts/grid/infinite-scroll-grid-with-filter/infinite-scroll-grid-with-filter-skeleton'

const DynamicInfiniteScrollGridWithFilter = dynamic(
  () =>
    import(
      '@/components/posts/grid/infinite-scroll-grid-with-filter/infinite-scroll-grid-with-filter'
    ),
  {
    loading: () => <InfiniteScrollGridWithFilterSkeleton />,
    ssr: false,
  },
)

export default DynamicInfiniteScrollGridWithFilter

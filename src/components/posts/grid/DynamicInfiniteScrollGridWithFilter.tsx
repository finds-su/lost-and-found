import dynamic from 'next/dynamic'
import DefaultSkeleton from '@/components/DefaultSkeleton'

const DynamicInfiniteScrollGridWithFilter = dynamic(
  () => import('@/components/posts/grid/InfiniteScrollGridWithFilter'),
  {
    loading: () => <DefaultSkeleton />,
    ssr: false,
  },
)

export default DynamicInfiniteScrollGridWithFilter

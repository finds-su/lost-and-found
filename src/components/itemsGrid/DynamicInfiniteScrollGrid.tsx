import dynamic from 'next/dynamic'
import DefaultSkeleton from '@/components/DefaultSkeleton'

const DynamicInfiniteScrollGrid = dynamic(
  () => import('@/components/itemsGrid/InfiniteScrollGrid'),
  {
    loading: () => <DefaultSkeleton />,
    ssr: false,
  },
)

export default DynamicInfiniteScrollGrid

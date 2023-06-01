import dynamic from 'next/dynamic'
import OverviewPostSkeleton from '@/components/posts/overview/overviewPost/OverviewPostSkeleton'

const DynamicOverviewPost = dynamic(
  () => import('@/components/posts/overview/overviewPost/OverviewPost'),
  {
    ssr: false,
    loading: () => <OverviewPostSkeleton />,
  },
)

export default DynamicOverviewPost

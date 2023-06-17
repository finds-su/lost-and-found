import dynamic from 'next/dynamic'
import OverviewPostSkeleton from '@/components/posts/overview/overview-post/OverviewPostSkeleton'

const DynamicOverviewPost = dynamic(
  () => import('@/components/posts/overview/overview-post/OverviewPost'),
  {
    ssr: false,
    loading: () => <OverviewPostSkeleton />,
  },
)

export default DynamicOverviewPost

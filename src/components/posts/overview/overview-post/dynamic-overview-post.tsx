import dynamic from 'next/dynamic'
import OverviewPostSkeleton from '@/components/posts/overview/overview-post/overview-post-skeleton'

const DynamicOverviewPost = dynamic(
  () => import('@/components/posts/overview/overview-post/overview-post'),
  {
    ssr: false,
    loading: () => <OverviewPostSkeleton />,
  },
)

export default DynamicOverviewPost

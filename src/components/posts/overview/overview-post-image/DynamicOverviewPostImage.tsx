import dynamic from 'next/dynamic'
import OverviewPostImageSkeleton from '@/components/posts/overview/overview-post-image/OverviewPostImageSkeleton'

const DynamicOverviewPostImage = dynamic(
  () => import('@/components/posts/overview/overview-post-image/OverviewPostImage'),
  {
    ssr: false,
    loading: () => <OverviewPostImageSkeleton />,
  },
)

export default DynamicOverviewPostImage

import dynamic from 'next/dynamic'
import OverviewPostImageSkeleton from '@/components/posts/overview/overviewPostImage/OverviewPostImageSkeleton'

const DynamicOverviewPostImage = dynamic(
  () => import('@/components/posts/overview/overviewPostImage/OverviewPostImage'),
  {
    ssr: false,
    loading: () => <OverviewPostImageSkeleton />,
  },
)

export default DynamicOverviewPostImage

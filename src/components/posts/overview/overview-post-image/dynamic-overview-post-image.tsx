import dynamic from 'next/dynamic'
import OverviewPostImageSkeleton from '@/components/posts/overview/overview-post-image/overview-post-image-skeleton'

const DynamicOverviewPostImage = dynamic(
  () => import('@/components/posts/overview/overview-post-image/overview-post-image'),
  {
    ssr: false,
    loading: () => <OverviewPostImageSkeleton />,
  },
)

export default DynamicOverviewPostImage

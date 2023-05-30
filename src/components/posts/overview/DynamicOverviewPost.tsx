import dynamic from 'next/dynamic'
import OverviewPostSkeleton from '@/components/posts/overview/OverviewPostSkeleton'

const DynamicOverviewPost = dynamic(() => import('@/components/posts/overview/OverviewPost'), {
  ssr: false,
  loading: () => <OverviewPostSkeleton />,
})

export default DynamicOverviewPost

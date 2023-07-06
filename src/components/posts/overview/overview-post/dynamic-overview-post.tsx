import dynamic from 'next/dynamic'

const DynamicOverviewPost = dynamic(
  () => import('@/components/posts/overview/overview-post/overview-post'),
  {
    ssr: false,
  },
)

export default DynamicOverviewPost

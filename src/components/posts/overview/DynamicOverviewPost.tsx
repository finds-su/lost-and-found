import dynamic from 'next/dynamic'

const DynamicOverviewPost = dynamic(() => import('@/components/posts/overview/OverviewPost'), {
  ssr: false,
})

export default DynamicOverviewPost

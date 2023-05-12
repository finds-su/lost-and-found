import dynamic from 'next/dynamic'
import DefaultSkeleton from '@/components/DefaultSkeleton'

const DynamicProfileBody = dynamic(() => import('@/components/profile/ProfileBody'), {
  loading: () => <DefaultSkeleton />,
  ssr: false,
})

export default DynamicProfileBody

import dynamic from 'next/dynamic'
import ProfileBodySkeleton from '@/components/profile/profileBody/ProfileBodySkeleton'

const DynamicProfileBody = dynamic(() => import('@/components/profile/profileBody/ProfileBody'), {
  loading: () => <ProfileBodySkeleton />,
  ssr: true,
})

export default DynamicProfileBody

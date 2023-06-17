import dynamic from 'next/dynamic'
import ProfileBodySkeleton from '@/components/profile/profile-body/ProfileBodySkeleton'

const DynamicProfileBody = dynamic(() => import('@/components/profile/profile-body/ProfileBody'), {
  loading: () => <ProfileBodySkeleton />,
  ssr: false,
})

export default DynamicProfileBody

import dynamic from 'next/dynamic'
import ProfileBodySkeleton from '@/components/profile/profile-body/profile-body-skeleton'

const DynamicProfileBody = dynamic(() => import('@/components/profile/profile-body/profile-body'), {
  loading: () => <ProfileBodySkeleton />,
  ssr: false,
})

export default DynamicProfileBody

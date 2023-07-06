import dynamic from 'next/dynamic'

const DynamicProfileBody = dynamic(() => import('@/components/profile/profile-body/profile-body'), {
  ssr: false,
})

export default DynamicProfileBody

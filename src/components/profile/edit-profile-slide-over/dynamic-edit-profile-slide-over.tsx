import dynamic from 'next/dynamic'

const DynamicEditProfileSlideOver = dynamic(
  () => import('@/components/profile/edit-profile-slide-over/edit-profile-slide-over'),
  {
    ssr: false,
  },
)

export default DynamicEditProfileSlideOver

import dynamic from 'next/dynamic'

const DynamicEditProfileSlideOver = dynamic(
  () => import('@/components/profile/edit-profile-slide-over/EditProfileSlideOver'),
  {
    ssr: false,
  },
)

export default DynamicEditProfileSlideOver

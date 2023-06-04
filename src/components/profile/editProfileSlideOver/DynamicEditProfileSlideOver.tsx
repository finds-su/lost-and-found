import dynamic from 'next/dynamic'

const DynamicEditProfileSlideOver = dynamic(
  () => import('@/components/profile/editProfileSlideOver/EditProfileSlideOver'),
  {
    ssr: false,
  },
)

export default DynamicEditProfileSlideOver

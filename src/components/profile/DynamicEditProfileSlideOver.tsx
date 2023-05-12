import dynamic from 'next/dynamic'

const DynamicEditProfileSlideOver = dynamic(
  () => import('@/components/profile/EditProfileSlideOver'),
  {
    ssr: false,
  },
)

export default DynamicEditProfileSlideOver

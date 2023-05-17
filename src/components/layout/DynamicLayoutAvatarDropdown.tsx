import dynamic from 'next/dynamic'

const DynamicLayoutAvatarDropdown = dynamic(
  () => import('@/components/layout/LayoutAvatarDropdown'),
  {
    ssr: false,
  },
)

export default DynamicLayoutAvatarDropdown

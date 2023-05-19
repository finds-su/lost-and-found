import dynamic from 'next/dynamic'

const DynamicLayoutAvatarDropdown = dynamic(
  () => import('@/components/layout/LayoutAvatarDropdown'),
  {
    ssr: true,
  },
)

export default DynamicLayoutAvatarDropdown

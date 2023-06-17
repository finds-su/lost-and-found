import dynamic from 'next/dynamic'

const DynamicMobileLayoutMenu = dynamic(
  () => import('@/components/layout/mobile-layout-dropdown'),
  {
    ssr: false,
  },
)

export default DynamicMobileLayoutMenu

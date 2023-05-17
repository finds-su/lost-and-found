import dynamic from 'next/dynamic'

const DynamicMobileLayoutMenu = dynamic(() => import('@/components/layout/MobileLayoutDropdown'), {
  ssr: false,
})

export default DynamicMobileLayoutMenu

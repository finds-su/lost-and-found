import dynamic from 'next/dynamic'

const DynamicMobileLayoutMenu = dynamic(() => import('@/components/layout/MobileLayoutMenu'), {
  ssr: false,
})

export default DynamicMobileLayoutMenu

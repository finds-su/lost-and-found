import dynamic from 'next/dynamic'

const DynamicLayoutProfile = dynamic(() => import('@/components/layout/LayoutProfile'), {
  ssr: true,
})

export default DynamicLayoutProfile

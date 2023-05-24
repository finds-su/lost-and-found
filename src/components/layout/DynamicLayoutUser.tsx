import dynamic from 'next/dynamic'

const DynamicLayoutUser = dynamic(() => import('@/components/layout/LayoutUser'), {
  ssr: true,
})

export default DynamicLayoutUser

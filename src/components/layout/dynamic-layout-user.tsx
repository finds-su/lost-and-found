import dynamic from 'next/dynamic'

const DynamicLayoutUser = dynamic(() => import('@/components/layout/layout-user'), {
  ssr: true,
})

export default DynamicLayoutUser

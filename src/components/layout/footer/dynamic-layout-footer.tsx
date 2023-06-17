import dynamic from 'next/dynamic'

const DynamicLayoutFooter = dynamic(() => import('@/components/layout/footer/layout-footer'), {
  ssr: true,
})

export default DynamicLayoutFooter

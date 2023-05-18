import dynamic from 'next/dynamic'

const DynamicLayoutFooter = dynamic(() => import('@/components/layout/footer/LayoutFooter'), {
  ssr: true,
})

export default DynamicLayoutFooter

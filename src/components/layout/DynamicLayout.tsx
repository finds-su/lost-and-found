import dynamic from 'next/dynamic'

const DynamicLayout = dynamic(() => import('@/components/layout/Layout'), {
  ssr: true,
})

export default DynamicLayout

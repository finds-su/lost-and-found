import dynamic from 'next/dynamic'

const DynamicLayout = dynamic(() => import('@/components/layout/layout'), {
  ssr: true,
})

export default DynamicLayout

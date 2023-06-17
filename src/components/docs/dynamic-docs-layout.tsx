import dynamic from 'next/dynamic'

const DynamicDocsLayout = dynamic(() => import('@/components/docs/docs-layout'), {
  ssr: true,
})

export default DynamicDocsLayout

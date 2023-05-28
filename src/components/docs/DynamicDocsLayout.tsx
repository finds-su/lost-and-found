import dynamic from 'next/dynamic'

const DynamicDocsLayout = dynamic(() => import('@/components/docs/DocsLayout'), {
  ssr: true,
})

export default DynamicDocsLayout

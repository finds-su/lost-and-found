import dynamic from 'next/dynamic'

const DynamicError = dynamic(() => import('@/components/error/error'), {
  ssr: true,
})

export default DynamicError

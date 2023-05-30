import dynamic from 'next/dynamic'

const DynamicError = dynamic(() => import('@/components/error/Error'), {
  ssr: true,
})

export default DynamicError

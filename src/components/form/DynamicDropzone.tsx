import dynamic from 'next/dynamic'

const DynamicDropzone = dynamic(() => import('@/components/form/Dropzone'), {
  ssr: true,
})

export default DynamicDropzone

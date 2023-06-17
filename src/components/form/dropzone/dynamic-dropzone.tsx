import dynamic from 'next/dynamic'

const DynamicDropzone = dynamic(() => import('@/components/form/dropzone/dropzone'), {
  ssr: true,
})

export default DynamicDropzone

import dynamic from 'next/dynamic'

const DynamicDropzone = dynamic(() => import('@/components/form/dropzone/Dropzone'), {
  ssr: true,
})

export default DynamicDropzone

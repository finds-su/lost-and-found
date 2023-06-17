import dynamic from 'next/dynamic'

const DynamicCreatePost = dynamic(() => import('@/components/posts/create/create-post'), {
  ssr: false,
})

export default DynamicCreatePost

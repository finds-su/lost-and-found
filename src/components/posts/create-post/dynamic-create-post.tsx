import dynamic from 'next/dynamic'

const DynamicCreatePost = dynamic(() => import('@/components/posts/create-post/create-post'), {
  ssr: false,
})

export default DynamicCreatePost

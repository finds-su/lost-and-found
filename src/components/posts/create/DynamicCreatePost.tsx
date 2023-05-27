import dynamic from 'next/dynamic'

const DynamicCreatePost = dynamic(() => import('@/components/posts/create/CreatePost'), {
  ssr: false,
})

export default DynamicCreatePost

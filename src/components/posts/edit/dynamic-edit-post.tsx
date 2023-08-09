import dynamic from 'next/dynamic'

const DynamicEditPost = dynamic(() => import('@/components/posts/edit/edit-post'), {
  ssr: false,
})

export default DynamicEditPost

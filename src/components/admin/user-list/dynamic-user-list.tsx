import dynamic from 'next/dynamic'

const DynamicUserList = dynamic(() => import('@/components/admin/user-list/user-list'), {
  ssr: true,
})

export default DynamicUserList

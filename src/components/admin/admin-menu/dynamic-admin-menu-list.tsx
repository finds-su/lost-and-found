import dynamic from 'next/dynamic'

const DynamicMenuAdminList = dynamic(
  () => import('@/components/admin/admin-menu/admin-menu-list'),
  {
    ssr: true,
  },
)

export default DynamicMenuAdminList

import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import { isModeratorOrAdmin } from '@/lib/is-moderator-or-admin'
import DynamicAdminMenuList from '@/components/admin/admin-menu/dynamic-admin-menu-list'

const title = 'Меню администратора'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (session) {
    if (isModeratorOrAdmin(session)) {
      return { props: { session } }
    }
  }
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  }
}

const AdminMenu: NextPageWithLayout = () => {
  return <DynamicAdminMenuList />
}

AdminMenu.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default AdminMenu

import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import { isModeratorOrAdmin } from '@/lib/is-moderator-or-admin'
import DynamicUserList from '@/components/admin/user-list/dynamic-user-list'

const title = 'Список пользователей'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (session && isModeratorOrAdmin(session)) {
    return { props: { session } }
  }
  return {
    redirect: {
      permanent: false,
      destination: '/',
    },
  }
}

const Users: NextPageWithLayout = () => {
  return <DynamicUserList />
}

Users.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default Users

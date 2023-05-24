import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const Notifications: NextPageWithLayout = () => {
  return <div className='px-4 py-4 sm:px-0'>Уведомления</div>
}

Notifications.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout pageName='Уведомления' session={options.session}>
      {page}
    </DynamicLayout>
  )
}

export default Notifications

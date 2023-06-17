import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/finds',
      },
    }
  }
  return { props: { session } }
}

const MyFinds: NextPageWithLayout = () => {
  return <div className='px-4 py-4 sm:px-0'>Ваши находки</div>
}

MyFinds.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} pageName='Ваши находки'>
      {page}
    </DynamicLayout>
  )
}

export default MyFinds

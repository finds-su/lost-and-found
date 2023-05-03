import Layout from '@/components/layout/Layout'
import InfiniteScrollGrid from '@/components/InfiniteScrollGrid'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const Losses: NextPageWithLayout = () => {
  return (
    <div className='px-4 py-4 sm:px-0'>
      <InfiniteScrollGrid reason='LOST' endMessage='Пропаж больше нет.' />
    </div>
  )
}

Losses.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <Layout pageName='Объявления о потерянных вещах' session={options.session}>
      {page}
    </Layout>
  )
}

export default Losses

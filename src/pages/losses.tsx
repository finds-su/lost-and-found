import Layout from '@/components/layout/Layout'
import InfiniteScrollGrid from '@/components/InfiniteScrollGrid'
import { type Session } from 'next-auth'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'

function Losses() {
  return (
    <div className='px-4 py-4 sm:px-0'>
      <InfiniteScrollGrid reason='LOST' endMessage='Пропаж больше нет.' />
    </div>
  )
}

Losses.getLayout = function getLayout(page: JSX.Element, session: Session) {
  return (
    <Layout pageName='Объявления о потерянных вещах' session={session}>
      {page}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

export default Losses

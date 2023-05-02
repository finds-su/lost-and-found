import Layout from '@/components/layout/Layout'
import InfiniteScrollGrid from '@/components/InfiniteScrollGrid'
import { type Session } from 'next-auth'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'

function Finds() {
  return (
    <div className='px-4 py-4 sm:px-0'>
      <InfiniteScrollGrid reason='FOUND' endMessage='Вещей больше не найдено.' />
    </div>
  )
}

Finds.getLayout = function getLayout(page: JSX.Element, session: Session) {
  return (
    <Layout pageName='Объявления о найденных вещах' session={session}>
      {page}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

export default Finds

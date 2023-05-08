import Layout from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import Image from 'next/image'
import DynamicInfiniteScrollGrid from '@/components/itemsGrid/DynamicInfiniteScrollGrid'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const Losses: NextPageWithLayout = () => {
  return (
    <div className='px-4 py-4 sm:px-0'>
      <DynamicInfiniteScrollGrid
        reason='LOST'
        endMessage={
          <div>
            <Image src='/assets/illustrations/gift.png' alt='' width={250} height={250} />
            Пропаж больше нет
          </div>
        }
      />
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

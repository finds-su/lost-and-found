import Layout from '@/components/layout/Layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import Image from 'next/image'
import DynamicInfiniteScrollGridWithFilter from '@/components/itemsGrid/DynamicInfiniteScrollGridWithFilter'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const Losses: NextPageWithLayout = () => {
  return (
    <DynamicInfiniteScrollGridWithFilter
      reason='LOST'
      endMessage={
        <div>
          <Image
            src='/assets/illustrations/gift.png'
            alt=''
            width={200}
            height={200}
            priority={false}
          />
          Пропаж больше нет
        </div>
      }
    />
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

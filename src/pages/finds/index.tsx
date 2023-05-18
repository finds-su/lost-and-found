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

const Finds: NextPageWithLayout = () => {
  return (
    <DynamicInfiniteScrollGridWithFilter
      reason='FOUND'
      endMessage={
        <div>
          <Image src='/assets/illustrations/box.png' alt='' width={200} height={200} />
          Вещей больше не найдено
        </div>
      }
    />
  )
}

Finds.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <Layout pageName='Объявления о найденных вещах' session={options.session}>
      {page}
    </Layout>
  )
}

export default Finds

import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import Image from 'next/image'
import DynamicInfiniteScrollGridWithFilter from '@/components/posts/grid/infinite-scroll-grid-with-filter/dynamic-infinite-scroll-grid-with-filter'

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
    <DynamicLayout session={options.session} pageName='Объявления о потерянных вещах'>
      {page}
    </DynamicLayout>
  )
}

export default Losses

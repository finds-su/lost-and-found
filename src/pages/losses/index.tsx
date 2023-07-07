import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import Image from 'next/image'
import DynamicInfiniteScrollGridWithFilter from '@/components/posts/grid/infinite-scroll-grid-with-filter/dynamic-infinite-scroll-grid-with-filter'
import DefaultSeo from '@/components/seo/default-seo'

const title = 'Объявления о потерянных вещах'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const Losses: NextPageWithLayout = () => {
  return (
    <>
      <DefaultSeo title={title} />
      <DynamicInfiniteScrollGridWithFilter reason='LOST' />
    </>
  )
}

Losses.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default Losses

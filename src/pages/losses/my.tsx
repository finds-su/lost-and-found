import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DefaultSeo from '@/components/seo/default-seo'

const title = 'Ваши пропажи'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/losses',
      },
    }
  }
  return { props: { session } }
}

const MyLosses: NextPageWithLayout = () => {
  return (
    <>
      <DefaultSeo title={title} />
      <div className='px-4 py-4 sm:px-0'>{title}</div>
    </>
  )
}

MyLosses.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default MyLosses

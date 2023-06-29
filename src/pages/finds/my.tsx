import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DefaultSeo from '@/components/seo/default-seo'
import MyPostsList from '@/components/posts/my-posts-list/my-posts-list'

const title = 'Ваши находки'

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
  return (
    <>
      <DefaultSeo title={title} />
      <MyPostsList reason='FOUND' />
    </>
  )
}

MyFinds.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default MyFinds

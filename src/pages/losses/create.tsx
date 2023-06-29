import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicCreatePost from '@/components/posts/create-post/dynamic-create-post'
import { PostItemReason } from '@prisma/client'
import DefaultSeo from '@/components/seo/default-seo'

const title = 'Сообщить о пропаже'

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

const CreateLoss: NextPageWithLayout = () => {
  return (
    <>
      <DefaultSeo title={title} />
      <DynamicCreatePost
        name='Пропажа'
        description='Опишите вещь, которую потеряли, чтобы нашедший смог определить ее принадлежность'
        postItemReason={PostItemReason.LOST}
        routePushOnExit='/losses'
      />
    </>
  )
}

CreateLoss.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default CreateLoss

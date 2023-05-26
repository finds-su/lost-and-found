import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import CreatePost from '@/components/posts/create/CreatePost'
import { PostItemReason } from '@prisma/client'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const CreateFind: NextPageWithLayout = () => {
  return (
    <CreatePost
      name='Находка'
      description='Опишите найденную вещь, чтобы хозяин смог легко ее узнать'
      postItemReason={PostItemReason.FOUND}
      routePushOnSuccess='/finds'
    />
  )
}

CreateFind.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout pageName='Сообщить о находке' session={options.session}>
      {page}
    </DynamicLayout>
  )
}

export default CreateFind

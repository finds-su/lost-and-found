import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import CreatePost from '@/components/posts/create/CreatePost'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const CreateLoss: NextPageWithLayout = () => {
  return (
    <CreatePost
      name='Пропажа'
      description='Опишите вещь, которую потеряли, чтобы нашедший смог определить ее принадлежность'
    />
  )
}

CreateLoss.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout pageName='Сообщить о пропаже' session={options.session}>
      {page}
    </DynamicLayout>
  )
}

export default CreateLoss

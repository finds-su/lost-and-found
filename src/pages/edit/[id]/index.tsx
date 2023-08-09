import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicError from '@/components/error/dynamic-error'
import { prisma } from '@/server/db'
import { type ErrorProps } from '@/lib/types/error-props'
import DefaultSeo from '@/components/seo/default-seo'
import DynamicEditPost from '@/components/posts/edit/dynamic-edit-post'

const title = 'Редактирование публикации'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const id = Number(context.params?.id)
  const post = await prisma.lostAndFoundItem.findFirst({
    where: { id: id },
    select: { id: true },
  })
  if (post === null) {
    return {
      props: {
        error: {
          code: 404,
          name: 'Пост не найден',
          description: `Этот пост никогда не существовал или был удален.`,
        } as ErrorProps,
      },
    }
  }

  return { props: { session } }
}

const EditPost: NextPageWithLayout = () => {
  return (
    <>
      <DefaultSeo title={title} />
      <DynamicEditPost />
    </>
  )
}

EditPost.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  if (options.error) {
    return <DynamicError {...options.error} />
  }
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default EditPost

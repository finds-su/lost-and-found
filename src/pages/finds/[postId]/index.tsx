import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicOverviewPost from '@/components/posts/overview/DynamicOverviewPost'
import DynamicError from '@/components/error/DynamicError'
import { PostItemReason } from '@prisma/client'
import { prisma } from '@/server/db'
import { type ErrorProps } from '@/lib/types/ErrorProps'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const postId = context.params?.postId as string
  const post = await prisma.lostAndFoundItem.findFirst({
    where: { id: postId, reason: PostItemReason.FOUND },
    select: { id: true },
  })
  if (post === null) {
    return {
      props: {
        error: {
          code: 404,
          name: 'Пост о находке не найден',
          description: `Этот пост никогда не существовал или был удален.`,
        } as ErrorProps,
      },
    }
  }

  return { props: { session } }
}

const Post: NextPageWithLayout = () => {
  return <DynamicOverviewPost reason={PostItemReason.FOUND} />
}

Post.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  if (options.error) {
    return <DynamicError {...options.error} />
  }
  return (
    <DynamicLayout session={options.session} pageName='Находка'>
      {page}
    </DynamicLayout>
  )
}

export default Post

import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicOverviewPost from '@/components/posts/overview/overview-post/dynamic-overview-post'
import DynamicError from '@/components/error/dynamic-error'
import { PostItemReason } from '@prisma/client'
import { prisma } from '@/server/db'
import { type ErrorProps } from '@/lib/types/error-props'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const postId = context.params?.postId as string
  const post = await prisma.lostAndFoundItem.findFirst({
    where: { id: postId, reason: PostItemReason.LOST },
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
  return <DynamicOverviewPost reason={PostItemReason.LOST} />
}

Post.getLayout = (page: JSX.Element, options: NextPageOptions) => {
  if (options.error) {
    return <DynamicError {...options.error} />
  }
  return (
    <DynamicLayout session={options.session} pageName='Пропажа'>
      {page}
    </DynamicLayout>
  )
}

export default Post

import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicOverviewPost from '@/components/posts/overview/DynamicOverviewPost'
import { prisma } from '@/server/db'
import Error, { type ErrorProps } from '@/components/Error'
import { type OverviewPost } from '@/lib/types/OverviewPost'
import * as console from 'console'
import { PostItemReason } from '@prisma/client'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const postId = context.params?.postId as string
  const post: OverviewPost | null = await prisma.lostAndFoundItem.findFirst({
    where: { id: postId, reason: PostItemReason.LOST },
    select: {
      id: true,
      name: true,
      description: true,
      campus: true,
      images: true,
      created: true,
      expires: true,
      user: {
        select: {
          name: true,
          nickname: true,
          role: true,
          userInfo: true,
          image: true,
        },
      },
    },
  })
  console.log(post)
  if (post === null) {
    return {
      props: {
        error: {
          code: 404,
          name: 'Пост о пропаже не найден',
          description: `Этот пост никогда не существовал или был удален.`,
        } as ErrorProps,
      },
    }
  }

  return { props: { session, post: JSON.stringify(post) } }
}

const Post: NextPageWithLayout = ({ post }: { post: string }) => {
  return <DynamicOverviewPost post={JSON.parse(post) as OverviewPost} />
}

Post.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  if (options.error) {
    return <Error {...options.error} />
  }
  return (
    <DynamicLayout pageName='Пропажа' session={options.session}>
      {page}
    </DynamicLayout>
  )
}

export default Post

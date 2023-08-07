import DynamicLayout from '@/components/layout/dynamic-layout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'
import DynamicOverviewPost from '@/components/posts/overview/overview-post/dynamic-overview-post'
import DynamicError from '@/components/error/dynamic-error'
import { PostItemReason } from '@prisma/client'
import { prisma } from '@/server/db'
import { type ErrorProps } from '@/lib/types/error-props'
import DefaultSeo from '@/components/seo/default-seo'

const title = 'Находка'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  const slug = context.params?.slug as string
  const post = await prisma.lostAndFoundItem.findFirst({
    where: { slug: slug, reason: PostItemReason.FOUND },
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
  return (
    <>
      <DefaultSeo title={title} />
      <DynamicOverviewPost reason={PostItemReason.FOUND} />
    </>
  )
}

Post.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  if (options.error) {
    return <DynamicError {...options.error} />
  }
  return (
    <DynamicLayout session={options.session} title={title}>
      {page}
    </DynamicLayout>
  )
}

export default Post

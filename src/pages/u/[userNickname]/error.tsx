import Error from '@/components/Error'
import { type GetServerSideProps } from 'next'
import { prisma } from '@/server/db'

export default function SearchProfileError(props: { nickname: string }) {
  return (
    <Error
      name='Пользователь не найден.'
      description={`Пользователя с ником ${props.nickname} не существует.`}
    />
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const nickname = context.params?.userNickname as string
  const user = await prisma.user.findUnique({ where: { nickname }, select: { id: true } })
  if (user) {
    return {
      redirect: {
        destination: `/u/${nickname}/`,
        permanent: false,
      },
    }
  }
  return {
    props: { nickname },
  }
}

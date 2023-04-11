import Error from '@/components/Error'
import { useRouter } from 'next/router'

export default function SearchProfileError() {
  const router = useRouter()
  const userNickname = router.query.userNickname as string

  return (
    <Error
      name='Пользователь не найден.'
      description={`Пользователя с ником ${userNickname} не существует.`}
    />
  )
}

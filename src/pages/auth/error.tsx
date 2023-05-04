import Error from '@/components/Error'

export default function AuthError() {
  return (
    <Error
      code={401}
      name='Ошибка авторизации'
      description='Воспользуйтесь другим способом входа или повторите попытку позже.'
    />
  )
}

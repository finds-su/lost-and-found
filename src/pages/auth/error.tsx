import Error from '@/components/error/error'
import DefaultSeo from '@/components/seo/default-seo'

export default function AuthError() {
  return (
    <>
      <DefaultSeo />
      <Error
        code={401}
        name='Ошибка авторизации'
        description='Воспользуйтесь другим способом входа или повторите попытку позже.'
      />
    </>
  )
}

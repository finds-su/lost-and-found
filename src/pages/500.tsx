import Error from '@/components/error/error'
import DefaultSeo from '@/components/seo/default-seo'

export default function InternalServerError() {
  return (
    <>
      <DefaultSeo />
      <Error
        code={500}
        name='Ошибка сервера'
        description='Попытайтесь обратиться к приложению позже.'
        hideRecommendationLinks
      />
    </>
  )
}

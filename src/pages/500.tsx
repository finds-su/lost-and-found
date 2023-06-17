import Error from '@/components/error/error'

export default function InternalServerError() {
  return (
    <Error
      code={500}
      name='Ошибка сервера'
      description='Попытайтесь обратиться к приложению позже.'
      hideRecommendationLinks
    />
  )
}

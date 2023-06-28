import Error from '@/components/error/error'
import DefaultSeo from '@/components/seo/default-seo'

export default function NotFound() {
  return (
    <>
      <DefaultSeo />
      <Error
        code={404}
        name='Страница не существует'
        description='Страница, которую Вы ищите, не может быть найдена.'
      />
    </>
  )
}

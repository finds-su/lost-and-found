import Error from '@/components/error/error'

export default function NotFound() {
  return (
    <Error
      code={404}
      name='Страница не существует'
      description='Страница, которую Вы ищите, не может быть найдена.'
    />
  )
}

import Error from '@/components/Error'

export default function FourOhFour() {
  return (
    <Error
      code={404}
      name='Страница не существует.'
      description='Страница, которую Вы ищите, не может быть найдена.'
    />
  )
}

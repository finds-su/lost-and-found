import Error from '@/components/Error'
import Head from 'next/head'

export default function FourOhFour() {
  return (
    <>
      <Head>
        <title>404 Страница не существует</title>
        <meta name='description' content='Сайт Бюро находок РТУ МИРЭА.' />
      </Head>
      <Error
        code={404}
        name='Страница не существует.'
        description='Страница, которую Вы ищите, не может быть найдена.'
      />
    </>
  )
}

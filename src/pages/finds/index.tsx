import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageWithLayout } from '@/pages/_app'
import Image from 'next/image'
import DynamicInfiniteScrollGridWithFilter from '@/components/posts/grid/infiniteScrollGridWithFilter/DynamicInfiniteScrollGridWithFilter'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const Finds: NextPageWithLayout = () => {
  return (
    <DynamicInfiniteScrollGridWithFilter
      reason='FOUND'
      endMessage={
        <div>
          <Image
            src='/assets/illustrations/box.png'
            alt=''
            width={200}
            height={200}
            priority={false}
          />
          Вещей больше не найдено
        </div>
      }
    />
  )
}

Finds.getLayout = function getLayout(page: JSX.Element) {
  return <DynamicLayout pageName='Объявления о найденных вещах'>{page}</DynamicLayout>
}

export default Finds

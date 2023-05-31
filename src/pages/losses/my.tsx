import DynamicLayout from '@/components/layout/DynamicLayout'
import { getServerAuthSession } from '@/server/auth'
import { type GetServerSideProps } from 'next'
import { type NextPageOptions, type NextPageWithLayout } from '@/pages/_app'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context)
  return { props: { session } }
}

const MyLosses: NextPageWithLayout = () => {
  return <div className='px-4 py-4 sm:px-0'>Ваши пропажи</div>
}

MyLosses.getLayout = function getLayout(page: JSX.Element, options: NextPageOptions) {
  return (
    <DynamicLayout session={options.session} pageName='Ваши пропажи'>
      {page}
    </DynamicLayout>
  )
}

export default MyLosses

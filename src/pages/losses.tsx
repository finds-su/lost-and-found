import Layout from '@/components/layout/Layout'
import InfiniteScrollGrid from '@/components/InfiniteScrollGrid'

export default function Losses() {
  return (
    <div className='px-4 py-4 sm:px-0'>
      <InfiniteScrollGrid reason='LOST' endMessage='Пропаж больше нет.' />
    </div>
  )
}

Losses.getLayout = function getLayout(page: any) {
  return <Layout pageName='Объявления о потерянных вещах'>{page}</Layout>
}

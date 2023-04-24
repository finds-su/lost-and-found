import Layout from '@/components/layout/Layout'
import InfiniteScrollGrid from '@/components/InfiniteScrollGrid'

export default function Finds() {
  return (
    <div className='px-4 py-4 sm:px-0'>
      <InfiniteScrollGrid reason={'FOUND'} />
    </div>
  )
}

Finds.getLayout = function getLayout(page: any) {
  return <Layout pageName='Объявления о найденных вещах'>{page}</Layout>
}

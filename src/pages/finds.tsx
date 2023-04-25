import Layout from '@/components/layout/Layout'
import InfiniteScrollGrid from '@/components/InfiniteScrollGrid'

export default function Finds() {
  return <InfiniteScrollGrid reason='FOUND' endMessage='Вещей больше не найдено.' />
}

Finds.getLayout = function getLayout(page: any) {
  return <Layout pageName='Объявления о найденных вещах'>{page}</Layout>
}

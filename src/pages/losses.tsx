import Layout from '@/components/Layout'

export default function Losses() {
  return (
    <div className='px-4 py-4 sm:px-0'>
      <div className='h-96 rounded-lg border-4 border-dashed border-gray-200' />
    </div>
  )
}

Losses.getLayout = function getLayout(page: any) {
  return <Layout pageName='Объявления о потерянных вещах'>{page}</Layout>
}

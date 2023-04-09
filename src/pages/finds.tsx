import Layout from '@/components/Layout'

export default function Finds() {
  return (
    <div className='px-4 py-4 sm:px-0'>
      <div className='h-96 rounded-lg border-4 border-dashed border-gray-200' />
    </div>
  )
}

Finds.getLayout = function getLayout(page: any) {
  return <Layout pageName='Объявления о найденных вещах'>{page}</Layout>
}

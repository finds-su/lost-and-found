export default function OverviewPostSkeleton() {
  return (
    <div role='status' className='animate-pulse'>
      <div className='h-[45rem] w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-[40rem]' />
      <span className='sr-only'>Загрузка...</span>
    </div>
  )
}

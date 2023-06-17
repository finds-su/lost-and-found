export default function ProfileBodySkeleton() {
  return (
    <div role='status' className='animate-pulse'>
      <div className='h-110 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-130' />
      <span className='sr-only'>Загрузка...</span>
    </div>
  )
}

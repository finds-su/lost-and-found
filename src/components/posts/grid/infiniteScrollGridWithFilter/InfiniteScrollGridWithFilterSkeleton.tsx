export default function InfiniteScrollGridWithFilterSkeleton() {
  return (
    <div role='status' className='animate-pulse'>
      <div className='mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-1 lg:gap-x-8'>
        {[...Array(12).keys()].map((key) => (
          <div
            key={key}
            className='h-80 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-110'
          />
        ))}
      </div>
      <span className='sr-only'>Загрузка...</span>
    </div>
  )
}

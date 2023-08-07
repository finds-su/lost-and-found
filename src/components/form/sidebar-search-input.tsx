import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SidebarSearchInput({
  setOpenCommandPalette,
}: {
  setOpenCommandPalette: (state: boolean) => void
}) {
  return (
    <button
      type='button'
      onClick={() => setOpenCommandPalette(true)}
      className='hidden lg:block lg:p-1'
    >
      <div className='relative flex items-center text-gray-400'>
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
          <MagnifyingGlassIcon className='h-4 stroke-2' />
        </div>
        <input
          type='text'
          name='search'
          id='search'
          className='block w-full cursor-pointer rounded-md border-gray-400 bg-transparent py-2 pl-8 pr-12 placeholder-gray-500 caret-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
          placeholder='Быстрый поиск'
          disabled
        />
        <div className='absolute inset-y-0 right-0 flex items-center pr-1.5'>
          <kbd className='inline-flex max-h-6 items-center rounded border border-gray-400 px-1.5 font-sans text-sm font-medium'>
            /
          </kbd>
        </div>
      </div>
    </button>
  )
}

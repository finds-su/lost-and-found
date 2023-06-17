import { type Dispatch, Fragment, type SetStateAction } from 'react'
import { Dialog, Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { filters } from '@/components/posts/grid/grid-filter'
import classNames from 'classnames/dedupe'
import { type PostItemReason } from '@prisma/client'
import useScrollGridStore from '@/lib/hooks/store/scroll-grids-store'

interface MobileFilterDialogProps {
  mobileFiltersOpen: boolean
  setMobileFiltersOpen: Dispatch<SetStateAction<boolean>>
  reason: PostItemReason
}

export default function MobileFilterDialog(props: MobileFilterDialogProps) {
  const { mobileFiltersOpen, setMobileFiltersOpen } = props
  const { checkedFilters, addFilter, deleteFilter } = useScrollGridStore(
    (state) => state[props.reason],
  )

  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog as='div' className='relative z-40 sm:hidden' onClose={setMobileFiltersOpen}>
        <Transition.Child
          as={Fragment}
          enter='transition-opacity ease-linear duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-opacity ease-linear duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 z-40 flex'>
          <Transition.Child
            as={Fragment}
            enter='transition ease-in-out duration-300 transform'
            enterFrom='translate-x-full'
            enterTo='translate-x-0'
            leave='transition ease-in-out duration-300 transform'
            leaveFrom='translate-x-0'
            leaveTo='translate-x-full'
          >
            <Dialog.Panel className='relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl'>
              <div className='flex items-center justify-between px-4'>
                <h2 className='text-lg font-medium text-gray-900'>Фильтры</h2>
                <button
                  type='button'
                  className='-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className='sr-only'>Close menu</span>
                  <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                </button>
              </div>

              {/* Filters */}
              <form className='mt-4'>
                {filters.map((section) => (
                  <Disclosure
                    as='div'
                    key={section.name}
                    className='border-t border-gray-200 px-4 py-6'
                  >
                    {({ open }) => (
                      <>
                        <h3 className='-mx-2 -my-3 flow-root'>
                          <Disclosure.Button className='flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400'>
                            <span className='font-medium text-gray-900'>{section.name}</span>
                            <span className='ml-6 flex items-center'>
                              <ChevronDownIcon
                                className={classNames(
                                  open ? '-rotate-180' : 'rotate-0',
                                  'h-5 w-5 transform',
                                )}
                                aria-hidden='true'
                              />
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className='pt-6'>
                          <div className='space-y-6'>
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className='flex items-center'>
                                <input
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  defaultValue={option.value}
                                  type='checkbox'
                                  defaultChecked={checkedFilters.includes(option.value)}
                                  onChange={(e) => {
                                    if (e.currentTarget.checked) {
                                      addFilter(e.currentTarget.value)
                                    } else {
                                      deleteFilter(e.currentTarget.value)
                                    }
                                  }}
                                  className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                                />
                                <label
                                  htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                  className='ml-3 text-sm text-gray-500'
                                >
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

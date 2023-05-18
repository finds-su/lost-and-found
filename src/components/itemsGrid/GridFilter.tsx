import { Menu, Transition, Popover } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'
import classNames from 'classnames/dedupe'
import MobileFilterDialog from '@/components/itemsGrid/MobileFilterDialog'
import { Campus as PrismaCampus } from '@prisma/client'
import { Campus } from '@/lib/campus'

export const sortOptions = [
  { name: 'Сначала новые', href: '#' },
  { name: 'Сначала старые', href: '#' },
]

export const filters = [
  {
    id: 'institute',
    name: 'Институт',
    options: (Object.keys(PrismaCampus) as Array<keyof typeof PrismaCampus>).map((key) => {
      return { value: key, label: Campus[key], checked: true }
    }),
  },
]

export default function GridFilter() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className='mb-4'>
      <MobileFilterDialog
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
      />
      <section aria-labelledby='filter-heading'>
        <h2 id='filter-heading' className='sr-only'>
          Фильтры вещей
        </h2>

        <div className='flex items-center justify-between'>
          <Menu as='div' className='relative inline-block text-left'>
            <div>
              <Menu.Button className='group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900'>
                Сортировать
                <ChevronDownIcon
                  className='-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                  aria-hidden='true'
                />
              </Menu.Button>
            </div>

            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <div className='py-1'>
                  {sortOptions.map((option, index) => (
                    <Menu.Item key={index}>
                      {({ active }) => (
                        <a
                          href={option.href}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm font-medium text-gray-900',
                          )}
                        >
                          {option.name}
                        </a>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <button
            type='button'
            className='inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden'
            onClick={() => setMobileFiltersOpen(true)}
          >
            Фильтры
          </button>

          <Popover.Group className='hidden sm:flex sm:items-baseline sm:space-x-8'>
            {filters.map((section, sectionIdx) => (
              <Popover
                as='div'
                key={section.name}
                id='menu'
                className='relative inline-block text-left'
              >
                <div>
                  <Popover.Button className='group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900'>
                    <span>{section.name}</span>
                    {sectionIdx === 0 ? (
                      <span className='ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700'>
                        1
                      </span>
                    ) : null}
                    <ChevronDownIcon
                      className='-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500'
                      aria-hidden='true'
                    />
                  </Popover.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Popover.Panel className='absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <form className='space-y-4'>
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className='flex items-center'>
                          <input
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            defaultValue={option.value}
                            defaultChecked={option.checked}
                            type='checkbox'
                            className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                          />
                          <label
                            htmlFor={`filter-${section.id}-${optionIdx}`}
                            className='ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900'
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </form>
                  </Popover.Panel>
                </Transition>
              </Popover>
            ))}
          </Popover.Group>
        </div>
      </section>
    </div>
  )
}

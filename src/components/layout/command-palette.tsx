import { type ChangeEvent, Fragment, type KeyboardEventHandler, useCallback, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { FaceFrownIcon, GlobeAmericasIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames/dedupe'
import { api, type RouterOutputs } from '@/lib/api'
import errorToast from '@/components/toasts/error-toast'
import { useRouter } from 'next/router'
import { PostItemReason } from '@prisma/client'
import Highlighter from 'react-highlight-words'

interface CommandPaletteProps {
  open: boolean
  setOpen: (state: boolean) => void
}

function SearchHighlighter(props: {
  textToHighlight: string
  query: string
  isActiveOption: boolean
}) {
  return (
    <Highlighter
      highlightClassName={classNames(props.isActiveOption ? 'bg-yellow-300' : 'bg-yellow-200')}
      searchWords={props.query.split(' ')}
      autoEscape={true}
      textToHighlight={props.textToHighlight}
    />
  )
}

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [queryData, setQueryData] = useState<RouterOutputs['posts']['searchPosts'] | undefined>(
    undefined,
  )

  const setResults = useCallback(
    (data: RouterOutputs['posts']['searchPosts']) => setQueryData(data),
    [],
  )

  api.posts.searchPosts.useQuery(
    { query },
    {
      onSuccess: (data) => setResults(data),
      onError: (error) => {
        errorToast(error.message)
      },
      enabled: query !== '',
    },
  )

  const fetchPost = (postId: number, reason: PostItemReason) => {
    return () => {
      setOpen(false)
      void router.push(reason === PostItemReason.FOUND ? `/finds/${postId}` : `/losses/${postId}`)
    }
  }

  const closePalette = () => setOpen(false)

  const onSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)

  const onSelectedOptionEnter = (
    open: boolean,
    selectedOption: { id: number; reason: PostItemReason } | null,
  ) => {
    return (event: KeyboardEventHandler<HTMLInputElement>) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (open && selectedOption && event.key === 'Enter') {
        fetchPost(selectedOption.id, selectedOption.reason)()
      }
    }
  }

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')} appear>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel className='mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all'>
              <Combobox>
                {({ open, activeOption }) => (
                  <>
                    <div className='relative'>
                      <MagnifyingGlassIcon
                        className='pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400'
                        aria-hidden='true'
                      />
                      <Combobox.Input
                        className='h-12 w-full border-0 bg-transparent pl-11 pr-12 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm'
                        placeholder='Поиск...'
                        onChange={onSearchInputChange}
                        onKeyDown={(e: any) =>
                          onSelectedOptionEnter(
                            open,
                            activeOption as { id: number; reason: PostItemReason } | null,
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                          )(e)
                        }
                      />
                      <kbd
                        onClick={closePalette}
                        className='absolute right-4 top-3.5 cursor-pointer rounded-md border border-gray-200 p-1 text-[0.5rem] text-gray-800 hover:border-gray-300 hover:shadow-sm'
                      >
                        ESC
                      </kbd>
                    </div>
                    {query === '' && queryData === undefined && (
                      <div className='border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14'>
                        <GlobeAmericasIcon
                          className='mx-auto h-6 w-6 text-gray-400'
                          aria-hidden='true'
                        />
                        <p className='mt-4 font-semibold text-gray-900'>
                          Поиск объявлений о находках и пропажах
                        </p>
                        <p className='mt-2 text-gray-500'>Быстрый доступ к активным объявлениям.</p>
                      </div>
                    )}
                    {queryData && queryData.length > 0 && (
                      <Combobox.Options
                        static
                        className='max-h-80 scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2'
                      >
                        {queryData.map((category) => (
                          <li key={category.name}>
                            <h2 className='bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900'>
                              {category.name}
                            </h2>
                            <ul className='mt-2 text-sm text-gray-800'>
                              {category.posts.map((item) => (
                                <Combobox.Option
                                  key={item.id}
                                  value={item}
                                  onClick={fetchPost(item.id, item.reason)}
                                  className={({ active }) =>
                                    classNames(
                                      'cursor-default select-none px-4 py-2',
                                      active && 'bg-blue-600 text-white',
                                    )
                                  }
                                >
                                  {({ active }) => (
                                    <>
                                      <SearchHighlighter
                                        textToHighlight={item.name}
                                        query={query}
                                        isActiveOption={active}
                                      />
                                      <div className='text-xs'>
                                        <SearchHighlighter
                                          textToHighlight={item.description}
                                          query={query}
                                          isActiveOption={active}
                                        />
                                      </div>
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </Combobox.Options>
                    )}

                    {query !== '' && queryData && queryData.length === 0 && (
                      <div className='border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14'>
                        <FaceFrownIcon
                          className='mx-auto h-6 w-6 text-gray-400'
                          aria-hidden='true'
                        />
                        <p className='mt-4 font-semibold text-gray-900'>Результатов не найдено</p>
                        <p className='mt-2 text-gray-500'>
                          Мы не смогли найти ничего по этому запросу.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

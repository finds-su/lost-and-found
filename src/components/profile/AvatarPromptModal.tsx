import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useAvatarPromptStore from '@/lib/hooks/store/avatarPromptStore'
import Image from 'next/image'
import Input from '@/components/form/Input'

export default function AvatarPromptModal() {
  const { isAvatarPromptModalOpen, closeAvatarPromptModal, avatarPrompt, setAvatarPrompt } =
    useAvatarPromptStore()
  const [prompt, setPrompt] = useState(avatarPrompt)

  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={isAvatarPromptModalOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={closeAvatarPromptModal}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div>
                  <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100'>
                    <Image
                      src='/icons/robot.svg'
                      alt=''
                      width={10}
                      height={10}
                      className='h-6 w-6'
                    />
                  </div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                      Генерация аватара
                    </Dialog.Title>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>
                        Опишите аватар, который бы Вы хотели видеть у себя в профиле.
                      </p>
                    </div>
                    <div className='my-3'>
                      <Input
                        inputProps={{
                          type: 'text',
                          value: prompt ?? '',
                          onChange: (e) => setPrompt(e.currentTarget.value),
                          placeholder: 'кот в сапогах',
                        }}
                        label='prompt'
                        isOptional
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm'
                    onClick={() => {
                      setAvatarPrompt(prompt ?? '')
                      closeAvatarPromptModal()
                    }}
                  >
                    Применить
                  </button>
                  <button
                    type='button'
                    className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm'
                    onClick={closeAvatarPromptModal}
                    ref={cancelButtonRef}
                  >
                    Отменить
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useEditProfileStore from '@/lib/hooks/store/editProfileStore'
import errorToast from '@/components/toasts/ErrorToast'
import { api } from '@/lib/api'
import { useRouter } from 'next/router'
import successToast from '@/components/toasts/SuccessToast'
import { type EditableProfile } from '@/lib/types/EditableProfile'
import { FormProvider, useForm } from 'react-hook-form'
import EditProfileSlideOverAvatar from '@/components/profile/editProfileSlideOver/EditProfileSlideOverAvatar'
import EditProfileSlideOverBody from '@/components/profile/editProfileSlideOver/EditProfileSlideOverBody'

interface EditProfileSlideOverProps {
  user: EditableProfile
}

export default function EditProfileSlideOver(props: EditProfileSlideOverProps) {
  const router = useRouter()
  const { user } = props
  const editProfile = useEditProfileStore()
  const editProfileForm = useForm<EditableProfile>({
    values: user,
    // resolver: zodResolver(zodEditUserInput),
  })
  const mutateProfile = api.users.editUser.useMutation({
    onSuccess: async (data, variables) => {
      successToast('Профиль изменен')
      editProfile.close()
      await router.push(`/u/${variables.nickname}`)
    },
    onError: (error) => errorToast(error.message),
  })
  const cancelButtonRef = useRef(null)

  return (
    <>
      <Transition.Root show={editProfile.edit} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={editProfile.close}
          initialFocus={cancelButtonRef}
        >
          <Transition.Child
            as={Fragment}
            enter='ease-in-out duration-500'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in-out duration-500'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-hidden'>
            <div className='absolute inset-0 overflow-hidden'>
              <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16'>
                <Transition.Child
                  as={Fragment}
                  enter='transform transition ease-in-out duration-500 sm:duration-700'
                  enterFrom='translate-x-full'
                  enterTo='translate-x-0'
                  leave='transform transition ease-in-out duration-500 sm:duration-700'
                  leaveFrom='translate-x-0'
                  leaveTo='translate-x-full'
                >
                  <Dialog.Panel className='pointer-events-auto w-screen max-w-2xl'>
                    <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>
                      <div className='px-4 py-6 sm:px-6'>
                        <div className='flex items-start justify-between'>
                          <Dialog.Title className='text-lg font-medium text-gray-900'>
                            Редактировать профиль
                          </Dialog.Title>
                          <div className='ml-3 flex h-7 items-center'>
                            <button
                              type='button'
                              className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500'
                              onClick={editProfile.close}
                            >
                              <span className='sr-only'>Закрыть панель</span>
                              <XMarkIcon className='h-6 w-6' aria-hidden='true' />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* Main */}
                      <FormProvider {...editProfileForm}>
                        <div className='divide-y divide-gray-200'>
                          <div className='pb-6'>
                            <div className='h-24 bg-blue-700 sm:h-20 lg:h-28' />
                            <EditProfileSlideOverAvatar user={user} />
                          </div>
                          <EditProfileSlideOverBody />
                          <div className='flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6'>
                            <div className='flex justify-end space-x-3'>
                              <button
                                type='button'
                                className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                onClick={editProfile.close}
                                ref={cancelButtonRef}
                              >
                                Отменить
                              </button>
                              <button
                                onClick={() => mutateProfile.mutate(editProfileForm.getValues())}
                                type='submit'
                                className='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                              >
                                Сохранить
                              </button>
                            </div>
                          </div>
                        </div>
                      </FormProvider>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

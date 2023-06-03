import { XMarkIcon } from '@heroicons/react/24/outline'
import { Fragment, useEffect, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useEditProfileStore from '@/lib/hooks/store/editProfileStore'
import Avatar from '@/components/avatar/Avatar'
import { usePresignedUpload } from 'next-s3-upload'
import { uploadAvatarToS3Options } from '@/lib/uploadToS3Options'
import { env } from '@/env.mjs'
import errorToast from '@/components/toasts/ErrorToast'
import { api } from '@/lib/api'
import { useRouter } from 'next/router'
import successToast from '@/components/toasts/SuccessToast'
import { type EditedUser } from '@/lib/types/EditedUser'
import Image from 'next/image'
import useAvatarPromptStore from '@/lib/hooks/store/avatarPromptStore'
import AvatarPromptModal from '@/components/profile/AvatarPromptModal'
import loadingToast from '@/components/toasts/LoadingToast'
import { type PromiseToastMessages } from '@/lib/types/Toast'
import Input from '@/components/form/Input'
import TextArea from '@/components/form/TextArea'
import { useDropzone } from 'react-dropzone'
import mapFileError from '@/lib/mapFileError'
import { FormProvider, useForm } from 'react-hook-form'

const generateAIAvatarToastID = 'generateAIAvatarToastID'
const generateAIAvatarToastMessages: Pick<PromiseToastMessages, 'success' | 'loading'> = {
  success: 'Аватар сгенерирован',
  loading: 'Генерация аватара',
}

interface EditProfileSlideOverProps {
  user: EditedUser
}

export default function EditProfileSlideOver(props: EditProfileSlideOverProps) {
  const router = useRouter()
  const { user } = props
  const editProfile = useEditProfileStore()
  const editProfileForm = useForm<EditedUser>({ values: user })
  const mutateUser = api.users.editUser.useMutation({
    onSuccess: async (data, variables) => {
      successToast('Профиль изменен')
      editProfile.close()
      await router.push(`/u/${variables.nickname}`)
    },
    onError: (error) => errorToast(error.message),
  })
  const { openAvatarPromptModal, avatarPrompt, setAvatarPrompt } = useAvatarPromptStore()
  const generateAvatar = api.users.generateAIAvatar.useQuery(
    { prompt: avatarPrompt },
    {
      onSuccess: (data) => {
        if (data) {
          editProfileForm.setValue('image', data)
          setAvatarPrompt(undefined)
          successToast(generateAIAvatarToastMessages.success, { id: generateAIAvatarToastID })
        }
      },
      onError: (error) => errorToast(error.message, { id: generateAIAvatarToastID }),
      refetchOnWindowFocus: false,
      retry: false,
    },
  )
  useEffect(() => {
    if ((generateAvatar.isLoading || generateAvatar.isSuccess) && avatarPrompt !== undefined) {
      loadingToast(generateAIAvatarToastMessages.loading, { id: generateAIAvatarToastID })
    }
  }, [generateAvatar.isLoading, generateAvatar.isSuccess, avatarPrompt])

  const { getRootProps, getInputProps, open } = useDropzone({
    accept: {
      'image/*': env.NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS,
    },
    onDrop: (files) => void handlePhotoChange(files),
    onError: (error) => errorToast(error.message),
    onDropRejected: (rejects) =>
      rejects.map((reject) => reject.errors.map((error) => mapFileError(error))),
    maxSize: 10 * 1024 * 1024, // 10 MB
    noClick: true,
    noKeyboard: true,
  })
  const { uploadToS3 } = usePresignedUpload()
  async function handlePhotoChange(files: File[]) {
    const file = files.at(0)
    if (file) {
      const { key } = await uploadToS3(file, uploadAvatarToS3Options)
      editProfileForm.setValue('image', `${env.NEXT_PUBLIC_CDN_ENDPOINT_URL}/${key}`)
    }
  }

  const editableAttributes: {
    name: string
    register: ReturnType<typeof editProfileForm.register>
    type: 'input' | 'textArea'
  }[] = [
    {
      name: 'Имя',
      register: editProfileForm.register('name'),
      type: 'input',
    },
    {
      name: 'Никнейм',
      register: editProfileForm.register('nickname'),
      type: 'input',
    },
    {
      name: 'Почта',
      register: editProfileForm.register('email'),
      type: 'input',
    },
    {
      name: 'Обо мне',
      register: editProfileForm.register('userInfo'),
      type: 'textArea',
    },
  ]
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
                            <div className='lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6'>
                              <div>
                                <div className='-m-1 flex'>
                                  <div className='inline-flex overflow-hidden rounded-lg border-4 border-white'>
                                    <Avatar
                                      size='xl'
                                      className='h-32 w-32 flex-shrink-0 bg-white sm:h-36 sm:w-36'
                                      src={editProfileForm.getValues('image')}
                                      resolution={300}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='mt-6 sm:ml-6 sm:flex-1'>
                                <div>
                                  <h3 className='text-xl font-bold text-gray-900 sm:text-2xl'>
                                    {user.name}
                                  </h3>
                                  <p className='text-sm text-gray-500'>@{user.nickname}</p>
                                </div>
                                <div
                                  {...getRootProps()}
                                  className='mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0'
                                >
                                  <input {...getInputProps()} />
                                  <button
                                    onClick={open}
                                    type='button'
                                    className='inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-1'
                                  >
                                    Изменить фото
                                  </button>
                                  <button
                                    onClick={() => editProfileForm.setValue('image', null)}
                                    className='inline-flex w-full flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                  >
                                    Удалить фото
                                  </button>
                                  <div className='ml-3 inline-flex sm:ml-0'>
                                    <button
                                      className='inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                      onClick={openAvatarPromptModal}
                                      disabled={generateAvatar.isLoading}
                                    >
                                      <span className='sr-only'>Сгенерировать аватар</span>
                                      <Image
                                        src='/icons/magic-icon.svg'
                                        alt=''
                                        width={10}
                                        height={10}
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0'>
                            {/* Project name */}
                            {editableAttributes.map((attribute) => (
                              <div
                                key={attribute.name}
                                className='space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5'
                              >
                                <div>
                                  <label
                                    htmlFor={attribute.name}
                                    className='block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2'
                                  >
                                    {attribute.name}
                                  </label>
                                </div>
                                <div className='sm:col-span-2'>
                                  {attribute.type === 'input' && (
                                    <Input
                                      label={attribute.name}
                                      hideLabel
                                      inputProps={attribute.register}
                                    />
                                  )}
                                  {attribute.type === 'textArea' && (
                                    <TextArea textareaProps={attribute.register} />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
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
                                onClick={() => {
                                  mutateUser.mutate(editProfileForm.getValues())
                                }}
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
      <AvatarPromptModal />
    </>
  )
}

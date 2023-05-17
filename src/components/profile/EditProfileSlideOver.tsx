import { XMarkIcon } from '@heroicons/react/24/outline'
import { type FormEvent, Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import useEditProfileStore from '@/lib/hooks/store/editProfileStore'
import useSessionStore from '@/lib/hooks/store/sessionStore'
import Avatar from '@/components/avatar/Avatar'
import { usePresignedUpload } from 'next-s3-upload'
import { uploadAvatarToS3Options } from '@/lib/uploadAvatarToS3Options'
import { env } from '@/env.mjs'
import promiseToast from '@/components/toasts/PromiseToast'
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

const generateAIAvatarToastID = 'generateAIAvatarToastID'
const generateAIAvatarToastMessages: Pick<PromiseToastMessages, 'success' | 'loading'> = {
  success: 'Аватар сгенерирован',
  loading: 'Генерация аватара',
}

export default function EditProfileSlideOver() {
  const router = useRouter()
  const editProfile = useEditProfileStore()
  const { session } = useSessionStore()
  const [editedUser, setEditedUser] = useState<EditedUser | undefined>(session?.user)
  const mutateUser = api.users.editUser.useMutation({
    onSuccess: async () => {
      if (editedUser) {
        successToast('Профиль изменен')
        editProfile.close()
        await router.push(`/u/${editedUser.nickname}`)
      }
    },
    onError: (error) => errorToast(error.message),
  })
  const { openAvatarPromptModal, avatarPrompt, setAvatarPrompt } = useAvatarPromptStore()
  const generateAvatar = api.users.generateAIAvatar.useQuery(
    { prompt: avatarPrompt },
    {
      onSuccess: (data) => {
        if (editedUser && data) {
          setEditedUser({ ...editedUser, image: data })
          setAvatarPrompt(undefined)
          successToast(generateAIAvatarToastMessages.success, { id: generateAIAvatarToastID })
        }
      },
      onError: (error) => errorToast(error.message, { id: generateAIAvatarToastID }),
    },
  )
  useEffect(() => {
    if (generateAvatar.isLoading && avatarPrompt !== undefined) {
      loadingToast(generateAIAvatarToastMessages.loading, { id: generateAIAvatarToastID })
    }
  }, [generateAvatar.isLoading, avatarPrompt])

  const { FileInput, openFileDialog, uploadToS3 } = usePresignedUpload()
  async function handlePhotoChange(file: File) {
    const { url } = await uploadToS3(file, uploadAvatarToS3Options)
    if (editedUser) {
      setEditedUser({ ...editedUser, image: url })
    }
  }

  const editableAttributes: {
    name: string
    value?: string | null
    setInputValue?: (e: FormEvent<HTMLInputElement>) => void
    setTextAreaValue?: (e: FormEvent<HTMLTextAreaElement>) => void
    type: 'input' | 'textarea'
  }[] = [
    {
      name: 'Имя',
      value: editedUser?.name,
      setInputValue: (e: FormEvent<HTMLInputElement>) => {
        if (editedUser) {
          setEditedUser({ ...editedUser, name: e.currentTarget.value })
        }
      },
      type: 'input',
    },
    {
      name: 'Никнейм',
      value: editedUser?.nickname,
      setInputValue: (e: FormEvent<HTMLInputElement>) => {
        if (editedUser) {
          setEditedUser({ ...editedUser, nickname: e.currentTarget.value })
        }
      },
      type: 'input',
    },
    {
      name: 'Почта',
      value: editedUser?.email,
      setInputValue: (e: FormEvent<HTMLInputElement>) => {
        if (editedUser) {
          setEditedUser({ ...editedUser, email: e.currentTarget.value })
        }
      },
      type: 'input',
    },
    {
      name: 'Телеграм',
      value: editedUser?.telegramLink,
      setInputValue: (e: FormEvent<HTMLInputElement>) => {
        if (editedUser) {
          setEditedUser({ ...editedUser, telegramLink: e.currentTarget.value })
        }
      },
      type: 'input',
    },
    {
      name: 'Обо мне',
      value: editedUser?.userInfo,
      setTextAreaValue: (e: FormEvent<HTMLTextAreaElement>) => {
        if (editedUser) {
          setEditedUser({ ...editedUser, userInfo: e.currentTarget.value })
        }
      },
      type: 'textarea',
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
                      <div className='divide-y divide-gray-200'>
                        <div className='pb-6'>
                          <div className='h-24 bg-blue-700 sm:h-20 lg:h-28' />
                          <div className='lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6'>
                            <div>
                              <div className='-m-1 flex'>
                                <div className='inline-flex overflow-hidden rounded-lg border-4 border-white'>
                                  <Avatar
                                    size='xl'
                                    className='h-32 w-32 flex-shrink-0 sm:h-36 sm:w-36'
                                    placeholderInitials={session?.user.nickname
                                      .slice(0, 2)
                                      .toUpperCase()}
                                    src={editedUser?.image}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className='mt-6 sm:ml-6 sm:flex-1'>
                              <div>
                                <h3 className='text-xl font-bold text-gray-900 sm:text-2xl'>
                                  {session?.user.name}
                                </h3>
                                <p className='text-sm text-gray-500'>@{session?.user.nickname}</p>
                              </div>
                              <div className='mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0'>
                                <FileInput
                                  onChange={(file: File) => {
                                    if (
                                      env.NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS.some((suffix) =>
                                        file.name.endsWith(suffix),
                                      )
                                    ) {
                                      void promiseToast(handlePhotoChange(file), {
                                        loading: 'Загрузка...',
                                        success: 'Успешно загружено',
                                        error: 'Ошибка загрузки',
                                      })
                                    } else {
                                      errorToast(
                                        `Поддерживаются только форматы ${env.NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS.join(
                                          ', ',
                                        )}`,
                                      )
                                    }
                                  }}
                                />
                                <button
                                  onClick={openFileDialog}
                                  type='button'
                                  className='inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-1'
                                >
                                  Изменить фото
                                </button>
                                <button
                                  onClick={() => {
                                    if (editedUser) {
                                      setEditedUser({ ...editedUser, image: null })
                                    }
                                  }}
                                  type='button'
                                  className='inline-flex w-full flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                >
                                  Удалить фото
                                </button>
                                <div className='ml-3 inline-flex sm:ml-0'>
                                  <button
                                    className='inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
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
                                  <input
                                    type='text'
                                    name={attribute.name}
                                    id={attribute.name}
                                    defaultValue={attribute.value ?? ''}
                                    onChange={attribute.setInputValue}
                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                                  />
                                )}
                                {attribute.type === 'textarea' && (
                                  <textarea
                                    name={attribute.name}
                                    id={attribute.name}
                                    value={attribute.value ?? ''}
                                    onChange={attribute.setTextAreaValue}
                                    rows={3}
                                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                                  />
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
                                if (editedUser) {
                                  mutateUser.mutate(editedUser)
                                }
                              }}
                              type='submit'
                              className='inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                            >
                              Сохранить
                            </button>
                          </div>
                        </div>
                      </div>
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

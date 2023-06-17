import Avatar from '@/components/avatar/avatar'
import { useFormContext } from 'react-hook-form'
import useAvatarPromptStore from '@/lib/hooks/store/avatar-prompt-store'
import { api, type RouterInputs } from '@/lib/api'
import successToast from '@/components/toasts/success-toast'
import errorToast from '@/components/toasts/error-toast'
import { useEffect } from 'react'
import loadingToast from '@/components/toasts/loading-toast'
import { useDropzone } from 'react-dropzone'
import { env } from '@/env.mjs'
import mapFileError from '@/lib/map-file-error'
import { usePresignedUpload } from 'next-s3-upload'
import { s3UploadAvatarOptions } from '@/lib/s3-upload-options'
import { type PromiseToastMessages } from '@/lib/types/toast'
import Image from 'next/image'
import AvatarPromptModal from '@/components/profile/avatar-prompt-modal'

const generateAIAvatarToastID = 'generateAIAvatarToastID'
const generateAIAvatarToastMessages: Pick<PromiseToastMessages, 'success' | 'loading'> = {
  success: 'Аватар сгенерирован',
  loading: 'Генерация аватара',
}

interface EditProfileSlideOverAvatarProps {
  user: RouterInputs['users']['editUser']
}

export default function EditProfileSlideOverAvatar(props: EditProfileSlideOverAvatarProps) {
  const { user } = props
  const editProfileForm = useFormContext<RouterInputs['users']['editUser']>()
  const { openAvatarPromptModal, avatarPrompt, setAvatarPrompt } = useAvatarPromptStore()
  const generateAIAvatar = api.users.generateAIAvatar.useQuery(
    { prompt: avatarPrompt },
    {
      onSuccess: (data) => {
        if (data) {
          editProfileForm.setValue('image', data)
          setAvatarPrompt(undefined)
          successToast(generateAIAvatarToastMessages.success, { id: generateAIAvatarToastID })
        }
      },
      onError: (error) => {
        setAvatarPrompt(undefined)
        errorToast(error.message, { id: generateAIAvatarToastID })
      },
      refetchOnWindowFocus: false,
      retry: false,
      enabled: avatarPrompt !== undefined,
    },
  )
  useEffect(() => {
    if ((generateAIAvatar.isLoading || generateAIAvatar.isSuccess) && avatarPrompt !== undefined) {
      loadingToast(generateAIAvatarToastMessages.loading, { id: generateAIAvatarToastID })
    }
  }, [generateAIAvatar.isLoading, generateAIAvatar.isSuccess, avatarPrompt])
  const avatarDropzone = useDropzone({
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
      const { key } = await uploadToS3(file, s3UploadAvatarOptions)
      editProfileForm.setValue('image', `${env.NEXT_PUBLIC_CDN_ENDPOINT_URL}/${key}`)
    }
  }

  return (
    <>
      <AvatarPromptModal />
      <div className='lg:-mt-15 -mt-12 flow-root px-4 sm:-mt-8 sm:flex sm:items-end sm:px-6'>
        <div>
          <div className='-m-1 flex'>
            <div className='inline-flex overflow-hidden rounded-lg border-4 border-white'>
              <Avatar
                size='xl'
                className='h-32 w-32 flex-shrink-0 bg-white sm:h-36 sm:w-36'
                src={editProfileForm.watch('image')}
                resolution={300}
              />
            </div>
          </div>
        </div>
        <div className='mt-6 sm:ml-6 sm:flex-1'>
          <div>
            <h3 className='text-xl font-bold text-gray-900 sm:text-2xl'>{user.name}</h3>
            <p className='text-sm text-gray-500'>@{user.nickname}</p>
          </div>
          <div
            {...avatarDropzone.getRootProps()}
            className='mt-5 flex flex-wrap space-y-3 sm:space-x-3 sm:space-y-0'
          >
            <input {...avatarDropzone.getInputProps()} />
            <button
              onClick={(e) => {
                e.preventDefault()
                avatarDropzone.open()
              }}
              type='button'
              className='inline-flex w-full flex-shrink-0 items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:flex-1'
            >
              Изменить фото
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                editProfileForm.setValue('image', null)
              }}
              className='inline-flex w-full flex-1 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Удалить фото
            </button>
            <div className='ml-3 inline-flex sm:ml-0'>
              <button
                className='inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                onClick={(e) => {
                  e.preventDefault()
                  openAvatarPromptModal()
                }}
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
    </>
  )
}

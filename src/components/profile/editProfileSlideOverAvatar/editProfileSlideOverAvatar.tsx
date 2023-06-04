import Avatar from '@/components/avatar/Avatar'
import { useFormContext } from 'react-hook-form'
import { type EditedUser } from '@/lib/types/EditedUser'
import useAvatarPromptStore from '@/lib/hooks/store/avatarPromptStore'
import { api } from '@/lib/api'
import successToast from '@/components/toasts/SuccessToast'
import errorToast from '@/components/toasts/ErrorToast'
import { useEffect } from 'react'
import loadingToast from '@/components/toasts/LoadingToast'
import { useDropzone } from 'react-dropzone'
import { env } from '@/env.mjs'
import mapFileError from '@/lib/mapFileError'
import { usePresignedUpload } from 'next-s3-upload'
import { uploadAvatarToS3Options } from '@/lib/uploadToS3Options'
import { type PromiseToastMessages } from '@/lib/types/Toast'
import Image from 'next/image'

const generateAIAvatarToastID = 'generateAIAvatarToastID'
const generateAIAvatarToastMessages: Pick<PromiseToastMessages, 'success' | 'loading'> = {
  success: 'Аватар сгенерирован',
  loading: 'Генерация аватара',
}

interface EditProfileSlideOverAvatarProps {
  user: EditedUser
}

export default function EditProfileSlideOverAvatar(props: EditProfileSlideOverAvatarProps) {
  const { user } = props
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

  const editProfileForm = useFormContext<EditedUser>()
  return (
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
  )
}

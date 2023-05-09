import Avatar from '@/components/avatar/Avatar'
import { type Role } from '@prisma/client'
import { Dropdown } from 'flowbite-react'
import { PencilIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { usePresignedUpload } from 'next-s3-upload'
import { api } from '@/lib/api'
import { useRouter } from 'next/router'
import errorToast from '@/components/toasts/ErrorToast'
import promiseToast from '@/components/toasts/PromiseToast'
import { env } from '@/env.mjs'
import { uploadAvatarToS3Options } from '@/server/s3'

interface ProfileAvatarProps {
  imgSrc?: string | null
  role: Role
  placeholderInitials: string
  isOwner: boolean
}

export default function ProfileAvatar(props: ProfileAvatarProps) {
  const router = useRouter()
  const updateProfileImage = api.users.updateProfileImage.useMutation({
    onSuccess: () => void router.push(window.location.pathname),
    onError: (error) => errorToast(error.message),
  })
  const { FileInput, openFileDialog, uploadToS3 } = usePresignedUpload()

  async function handlePhotoChange(file: File) {
    const { url } = await uploadToS3(file, uploadAvatarToS3Options)
    updateProfileImage.mutate({ src: url })
  }

  return (
    <div className='relative'>
      <div className='rounded-full border-2 border-gray-200'>
        <Avatar
          size='xl'
          placeholderInitials={props.placeholderInitials}
          src={props.imgSrc}
          rounded
        />
      </div>
      {['ADMIN', 'MODERATOR'].includes(props.role) && (
        <span className='absolute bottom-0 left-1 m-2 h-6 w-6 rounded-full border-2 border-green-500 bg-green-500 text-black'>
          <ShieldCheckIcon />
        </span>
      )}
      {props.isOwner && (
        <div className='absolute -right-4 bottom-0'>
          <Dropdown
            label={
              <p className='-mx-3 -my-1 flex flex-row'>
                <PencilIcon className='mr-2 h-5 w-5' />
                Изм.
              </p>
            }
            arrowIcon={false}
            color='light'
            placement='right-end'
          >
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
            <Dropdown.Item onClick={openFileDialog}>Загрузить&nbsp;фото</Dropdown.Item>
            <Dropdown.Item onClick={() => void updateProfileImage.mutate({ src: null })}>
              Удалить&nbsp;фото
            </Dropdown.Item>
          </Dropdown>
        </div>
      )}
    </div>
  )
}

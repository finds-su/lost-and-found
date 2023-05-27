import { ErrorCode, useDropzone } from 'react-dropzone'
import { usePresignedUpload } from 'next-s3-upload'
import { uploadPostImageToS3Options } from '@/lib/uploadToS3Options'
import errorToast from '@/components/toasts/ErrorToast'
import { env } from '@/env.mjs'

interface DropzoneProps {
  images: string[]
  addImage: (image: string) => void
}

export default function Dropzone(props: DropzoneProps) {
  const { uploadToS3 } = usePresignedUpload()
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': env.NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS,
    },
    onDrop: (files) => void handleFilesChange(files),
    onError: (error) => errorToast(error.message),
    onDropRejected: (rejects) =>
      rejects.map((reject) => {
        if (reject.errors.length > 0) {
          reject.errors.map((error) => {
            switch (error.code) {
              case ErrorCode.FileInvalidType:
                errorToast('Неподдерживаемый тип файла')
                break
              case ErrorCode.FileTooLarge:
                errorToast('Файл слишком большой')
                break
              case ErrorCode.FileTooSmall:
                errorToast('Файл слишком маленький')
                break
              case ErrorCode.TooManyFiles:
                errorToast('Слишком много файлов')
                break
            }
          })
        }
      }),
    maxFiles: 10,
    maxSize: 10 * 1024 * 1024, // 10 MB
  })

  async function handleFilesChange(files: File[]) {
    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      if (file) {
        const { url } = await uploadToS3(file, uploadPostImageToS3Options)
        props.addImage(url)
      }
    }
    console.log(files)
  }

  return (
    <div
      {...getRootProps()}
      className='flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5'
    >
      <div className='space-y-1 text-center'>
        <svg
          className='mx-auto h-12 w-12 text-gray-400'
          stroke='currentColor'
          fill='none'
          viewBox='0 0 48 48'
          aria-hidden='true'
        >
          <path
            d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
        <div className='flex text-sm text-gray-600'>
          <label
            htmlFor='file-upload'
            className='relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500'
          >
            <span>Загрузите фотографии</span>
            <input
              {...getInputProps()}
              id='file-upload'
              multiple={true}
              name='file-upload'
              type='file'
              className='sr-only'
            />
          </label>
          <p className='pl-1'>или перетащите</p>
        </div>
        <p className='text-xs text-gray-500'>
          {env.NEXT_PUBLIC_S3_UPLOAD_RESOURCE_FORMATS.join(', ').replaceAll('.', '').toUpperCase()}{' '}
          до 10MB
        </p>
      </div>
    </div>
  )
}

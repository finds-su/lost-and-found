import Window from '@/components/form/window'
import { type LostAndFoundItem, type PostItemReason, Campus as PrismaCamus } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Campus } from '@/lib/campus'
import { api } from '@/lib/api'
import errorToast from '@/components/toasts/error-toast'
import DynamicDropzone from '@/components/form/dropzone/dynamic-dropzone'
import { XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { IsInStoragePlaceChecker } from '../is-in-storage-place-checker'

interface CreatePostProps {
  name: string
  description: string
  postItemReason: PostItemReason
  routePushOnExit: string
}

type Post = Pick<
  LostAndFoundItem,
  'name' | 'description' | 'campus' | 'images' | 'isInStoragePlace'
>

export default function CreatePost(props: CreatePostProps) {
  const router = useRouter()
  const createPost = api.posts.createPost.useMutation({
    onSuccess: async () => {
      await router.push(props.routePushOnExit)
    },
    onError: (error) => errorToast(error.message),
  })
  const [post, setPost] = useState<Post>({
    name: '',
    description: '',
    campus: PrismaCamus.V78,
    images: [],
    isInStoragePlace: null,
  })

  const generateImageCaption = api.posts.generateImageCaption.useMutation({
    onSuccess: (data) => {
      if (data) {
        setPost((current) => ({ ...current, name: data }))
      }
    },
    onError: (error) => errorToast(error.message),
  })

  useEffect(() => {
    if (post.campus !== PrismaCamus.V78) {
      setPost((current) => ({ ...current, isInStoragePlace: null }))
    }
  }, [post.campus])

  const inputs: { name: string; className: string; input: React.ReactNode }[] = [
    {
      name: 'Фотографии',
      className: 'sm:col-span-6',
      input: (
        <>
          <DynamicDropzone
            images={post.images}
            addImage={(img: string) =>
              setPost((current) => ({ ...current, images: [...current.images, img] }))
            }
          />
          <div className='mt-6 flow-root'>
            <ul role='list' className='-my-5 divide-y divide-gray-200'>
              {post.images.map((url, index) => (
                <li key={index} className='py-4'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex-shrink-0'>
                      <Image
                        className='h-8 w-8 rounded-full'
                        height={30}
                        width={30}
                        src={url}
                        alt=''
                      />
                    </div>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium text-gray-900'>
                        {url.split('/').at(-1)}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() =>
                          setPost({
                            ...post,
                            images: post.images.filter((currUrl, currIndex) => index !== currIndex),
                          })
                        }
                        className='inline-flex items-center rounded-full border border-gray-300 bg-white px-2.5 py-0.5 text-sm font-medium leading-5 text-gray-700 shadow-sm hover:bg-gray-50'
                      >
                        <XMarkIcon className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ),
    },
    {
      name: 'Название',
      className: 'sm:col-span-3',
      input: (
        <div className='flex flex-col sm:flex-row'>
          <input
            maxLength={100}
            value={post.name}
            onChange={(e) => setPost((value) => ({ ...value, name: e.target.value }))}
            type='text'
            name='name'
            id='name'
            className='w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
          />
          {post.images.length > 0 && (
            <button
              onClick={(e) => {
                e.preventDefault()
                void generateImageCaption.mutateAsync({ imageUrl: post.images[0] ?? '' })
              }}
              disabled={generateImageCaption.isLoading}
              className={`mt-2 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:mt-0 ${
                generateImageCaption.isLoading ? 'cursor-not-allowed' : ''
              }`}
            >
              {generateImageCaption.isLoading ? (
                <span>Загрузка...</span>
              ) : (
                <>
                  <Image
                    src='/icons/magic-icon.svg'
                    alt=''
                    width={10}
                    height={10}
                    className='mr-1 h-5 w-5'
                    style={{ filter: 'invert(1)' }}
                    aria-hidden='true'
                  />
                  Сгенерировать
                </>
              )}
            </button>
          )}
        </div>
      ),
    },
    {
      name: 'Описание',
      className: 'sm:col-span-6',
      input: (
        <textarea
          maxLength={512}
          value={post.description}
          onChange={(e) => setPost((value) => ({ ...value, description: e.target.value }))}
          id='description'
          name='description'
          rows={3}
          className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
          placeholder='Место нахождения или контактная информация'
        />
      ),
    },
    {
      name: 'Кампус',
      className: 'sm:col-span-3',
      input: (
        <select
          id='campus'
          name='campus'
          onChange={(e) => setPost({ ...post, campus: e.target.value as PrismaCamus })}
          className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
        >
          {Object.values(PrismaCamus).map((value, index) => (
            <option key={index} value={value}>
              {Campus[value]}
            </option>
          ))}
        </select>
      ),
    },
  ]
  return (
    <Window>
      <form className='space-y-8 divide-y divide-gray-200'>
        <div className='space-y-8 divide-y divide-gray-200'>
          <div>
            <div>
              <h3 className='text-lg font-medium leading-6 text-gray-900'>{props.name}</h3>
              <p className='mt-1 text-sm text-gray-500'>{props.description}</p>
            </div>

            <div className='mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6'>
              {inputs.map((field) => (
                <div key={field.name} className={field.className}>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                    {field.name}
                  </label>
                  <div className='mt-1'>{field.input}</div>
                </div>
              ))}
              {post.campus === PrismaCamus.V78 && (
                <IsInStoragePlaceChecker
                  checked={post.isInStoragePlace ?? false}
                  onChange={(checked) => setPost({ ...post, isInStoragePlace: checked })}
                />
              )}
            </div>
          </div>
        </div>

        <div className='pt-5'>
          <div className='flex justify-end'>
            <button
              onClick={() => void router.push(props.routePushOnExit)}
              type='button'
              className='rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Отменить
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                createPost.mutate({ ...post, reason: props.postItemReason })
              }}
              className='ml-3 inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Сохранить
            </button>
          </div>
        </div>
      </form>
    </Window>
  )
}

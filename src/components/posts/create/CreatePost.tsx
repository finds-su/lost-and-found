import Window from '@/components/form/Window'
import { type LostAndFoundItem, type PostItemReason, Campus as PrismaCamus } from '@prisma/client'
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Campus } from '@/lib/campus'
import { api } from '@/lib/api'
import errorToast from '@/components/toasts/ErrorToast'

interface CreatePostProps {
  name: string
  description: string
  postItemReason: PostItemReason
  routePushOnSuccess: string
}

type Post = Pick<LostAndFoundItem, 'name' | 'description' | 'campus' | 'images'>

export default function CreatePost(props: CreatePostProps) {
  const router = useRouter()
  const createPost = api.items.createPost.useMutation({
    onSuccess: async () => {
      await router.push(props.routePushOnSuccess)
    },
    onError: (error) => errorToast(error.message),
  })
  const [post, setPost] = useState<Post>({
    name: '',
    description: '',
    campus: PrismaCamus.V78,
    images: [],
  })

  const inputs: { name: string; className: string; input: React.ReactNode }[] = [
    {
      name: 'Название',
      className: 'sm:col-span-3',
      input: (
        <input
          maxLength={100}
          value={post.name}
          onChange={(e) => setPost((value) => ({ ...value, name: e.target.value }))}
          type='text'
          name='name'
          id='name'
          className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
        />
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
          className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
        >
          {Object.values(PrismaCamus).map((value, index) => (
            <option key={index} value={value}>
              {Campus[value]}
            </option>
          ))}
        </select>
      ),
    },
    {
      name: 'Фотографии',
      className: 'sm:col-span-6',
      input: (
        <div className='flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5'>
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
                <input id='file-upload' name='file-upload' type='file' className='sr-only' />
              </label>
              <p className='pl-1'>или перетащите</p>
            </div>
            <p className='text-xs text-gray-500'>PNG, JPG, GIF до 10MB</p>
          </div>
        </div>
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
            </div>
          </div>
        </div>

        <div className='pt-5'>
          <div className='flex justify-end'>
            <button
              onClick={() => router.back()}
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

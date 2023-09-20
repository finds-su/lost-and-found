import Window from '@/components/form/window'
import { Campus } from '@/lib/campus'
import { api } from '@/lib/api'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import successToast from '@/components/toasts/success-toast'
import errorToast from '@/components/toasts/error-toast'
import { LostAndFoundItem, PostItemReason } from '@prisma/client'
import { XMarkIcon } from '@heroicons/react/24/outline'
import DynamicDropzone from '@/components/form/dropzone/dynamic-dropzone'
import Image from 'next/image'
import { IsInStoragePlaceChecker } from '../is-in-storage-place-checker'

type Post = Pick<
  LostAndFoundItem,
  'id' | 'name' | 'description' | 'campus' | 'images' | 'reason' | 'slug' | 'isInStoragePlace'
>

export default function EditPost() {
  const router = useRouter()
  const [post, setPost] = useState<Post>()

  const [isInStoragePlace, setIsInStoragePlace] = useState<boolean | null>(null)

  const id = Number(router.query.id)
  const postQuery = api.posts.getPost.useQuery(
    { postId: id },
    {
      onSuccess: (data: Post) => {
        if (data) {
          setPost(data)
          setIsInStoragePlace(data.isInStoragePlace)
        }
      },
      onError: (error) => {
        errorToast(error.message)
      },
    },
  )

  const [images, setImages] = useState<string[]>(post?.images || [])

  const mutatePost = api.posts.updatePost.useMutation({
    onSuccess: (data) => {
      if (data) {
        setPost(data)
      }
    },
    onError: (error) => errorToast(error.message),
  })

  const deletePost = api.posts.deletePost.useMutation({
    onSuccess: () => async () => {
      successToast('Пост успешно удален!')
      await router.push('/')
    },
    onError: (error) => errorToast(error.message),
  })

  useEffect(() => {
    if (post) {
      setImages(post.images)
    }
  }, [post])

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const formData = new FormData(event.currentTarget)
      const name = formData.get('name') as string
      const description = formData.get('description') as string
      const campus = formData.get('campus') as string
      const inStoragePlace = campus === 'V78' ? isInStoragePlace : null

      if (!post) {
        errorToast('При обновлении поста произошла ошибка!')
        return
      }

      const newPost = await mutatePost.mutateAsync({
        postId: post?.id,
        reason: post?.reason,
        campus: campus as keyof typeof Campus,
        images,
        name,
        description,
        isInStoragePlace: inStoragePlace,
      })

      successToast('Пост успешно обновлен!')
      await router.push(`/${post.reason === 'LOST' ? 'losses' : 'finds'}/${newPost.slug}`)
    },
    [isInStoragePlace, post, images],
  )

  const handleDelete = async () => {
    if (!post) {
      errorToast('При удалении поста произошла ошибка!')
      return
    }

    if (confirm('Вы уверены, что хотите удалить этот пост?')) {
      await deletePost.mutateAsync({ postId: post.id })
      successToast('Пост успешно удален!')
      await router.push('/')
    }
  }

  return (
    <Window>
      <div className='mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8'>
        {postQuery.isLoading && <p>Загрузка...</p>}

        {post && (
          <>
            <form onSubmit={(event) => void handleSubmit(event)}>
              <div className='grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6'>
                <div className='sm:col-span-6'>
                  <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                    Название
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      name='name'
                      id='name'
                      defaultValue={post.name}
                      required
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    />
                  </div>
                </div>
                <div className='sm:col-span-6'>
                  <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                    Описание
                  </label>
                  <div className='mt-1'>
                    <textarea
                      id='description'
                      name='description'
                      rows={3}
                      defaultValue={post.description}
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    ></textarea>
                  </div>
                </div>
                <div className='sm:col-span-6'>
                  <label htmlFor='campus' className='block text-sm font-medium text-gray-700'>
                    Кампус
                  </label>
                  <div className='mt-1'>
                    <select
                      id='campus'
                      name='campus'
                      defaultValue={post.campus}
                      required
                      className='block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                    >
                      {Object.keys(Campus).map((campus) => (
                        <option key={campus} value={campus}>
                          {Campus[campus as keyof typeof Campus]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <IsInStoragePlaceChecker
                  checked={isInStoragePlace ?? false}
                  onChange={(checked) => setIsInStoragePlace(checked)}
                />

                <div className='sm:col-span-6'>
                  <label
                    htmlFor='currentImages'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Изображения
                  </label>
                  <div className='mt-1'>
                    <DynamicDropzone
                      images={images}
                      addImage={(img: string) => setImages((prevImages) => [...prevImages, img])}
                    />
                    <div className='mt-6 flow-root'>
                      <div className='mt-6 grid grid-cols-4 gap-4'>
                        {images.map((url, index) => (
                          <div className='relative' key={index}>
                            <Image
                              className='h-56 w-full rounded-lg border border-gray-300 bg-gray-100 object-cover object-center lg:h-72 xl:h-80'
                              src={url}
                              alt=''
                              height={800}
                              width={800}
                            />
                            <button
                              onClick={() =>
                                setImages({
                                  ...images.filter((currUrl, currIndex) => index !== currIndex),
                                })
                              }
                              className='absolute bottom-4 right-4 rounded-lg bg-red-500 p-1 text-white'
                            >
                              <XMarkIcon className='h-5 w-5' />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mt-8 flex justify-between space-x-4'>
                <button
                  type='submit'
                  className='ml-auto inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                  Сохранить
                </button>
                <button
                  type='button'
                  onClick={void handleDelete}
                  className='inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                  Удалить
                </button>
              </div>
            </form>
          </>
        )}

        {postQuery.isFetched && !post && (
          <div className='flex h-110 flex-col items-center justify-center text-center font-medium text-gray-700 lg:h-130'>
            Пост не найден
          </div>
        )}
      </div>
    </Window>
  )
}

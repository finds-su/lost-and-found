/*
  This example requires Tailwind CSS v2.0+

  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import Image from 'next/image'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/server/auth'

export default function SignIn() {
  const router = useRouter()
  const callbackUrl = router.query.callbackUrl ? (router.query.callbackUrl as string) : '/'

  return (
    <main className='h-screen bg-white'>
      <div className='flex min-h-full'>
        <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <div className='mx-auto w-full max-w-sm lg:w-96'>
            <div>
              <Image
                className='h-12 w-auto'
                src='/assets/ninja-logo-black.svg'
                alt='Mirea Ninja'
                width={100}
                height={100}
              />
              <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>
                Войти в систему
              </h2>
            </div>

            <div className='mt-8'>
              <div>
                <div>
                  <p className='text-sm font-medium text-gray-700'>Войти через</p>

                  <div className='mt-1 grid grid-cols-2 gap-3'>
                    <div>
                      <button
                        onClick={() => void signIn('mirea', { callbackUrl })}
                        className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50'
                      >
                        <span className='sr-only'>Войти через ЛКС</span>
                        <Image
                          src='/assets/mirea-emblem.svg'
                          alt=''
                          width={100}
                          height={100}
                          className='h-5 w-5'
                        />
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={() => void signIn('google', { callbackUrl })}
                        className='inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50'
                      >
                        <span className='sr-only'>Войти через Google</span>
                        <Image
                          src='/assets/google-logo.svg'
                          alt=''
                          width={100}
                          height={100}
                          className='h-5 w-5'
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className='relative mt-6'>
                  <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div className='w-full border-t border-gray-300' />
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='bg-white px-2 text-gray-500'>Или с помощью</span>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <form action='#' method='POST' className='space-y-6'>
                  <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                      Email адрес
                    </label>
                    <div className='mt-1'>
                      <input
                        id='email'
                        name='email'
                        type='email'
                        autoComplete='email'
                        required
                        className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div className='space-y-1'>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                      Пароль
                    </label>
                    <div className='mt-1'>
                      <input
                        id='password'
                        name='password'
                        type='password'
                        autoComplete='current-password'
                        required
                        className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type='submit'
                      className='flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    >
                      Войти
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className='relative hidden w-0 flex-1 lg:block'>
          <Image
            className='absolute inset-0 h-full w-full object-cover'
            src='https://www.mirea.ru/upload/medialibrary/1b3/01.jpg'
            alt=''
            fill
          />
        </div>
      </div>
    </main>
  )
}

export async function getServerSideProps(context: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
  const session = await getServerSession(context.req, context.res, authOptions)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  return { props: {} }
}

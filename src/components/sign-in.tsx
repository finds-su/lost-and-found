import Image from 'next/image'
import { signIn } from 'next-auth/react'
import Logo from '@/components/logo'
import { useRouter } from 'next/router'

export default function SignIn() {
  const router = useRouter()
  const callbackUrl = router.query.callbackUrl ? (router.query.callbackUrl as string) : '/'
  const error = router.query.error

  const providers: { id: string; name: string; image: string }[] = [
    {
      id: 'mirea',
      name: 'ЛКC',
      image: '/assets/providers/mirea.svg',
    },
    {
      id: 'google',
      name: 'Google',
      image: '/assets/providers/google.svg',
    },
    {
      id: 'github',
      name: 'GitHub',
      image: '/assets/providers/github.svg',
    },
  ]

  return (
    <main className='h-screen bg-white'>
      <div className='flex min-h-full'>
        <div className='flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <div className='mx-auto w-full max-w-sm lg:w-96'>
            <Logo />
            <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>Войти</h2>
            <div className='mt-8'>
              <p className='text-sm font-medium text-gray-700'>Войти через</p>

              <div className='mt-1'>
                {providers.map((item) => (
                  <div key={item.name}>
                    <button
                      onClick={() => void signIn(item.id, { callbackUrl })}
                      className='my-1 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50'
                    >
                      <Image src={item.image} alt='' width={100} height={100} className='h-5 w-5' />
                      <span className='ml-2'>{item.name}</span>
                    </button>
                  </div>
                ))}
              </div>
              {error && (
                <p className='mt-1 text-sm text-red-600'>
                  Ошибка авторизации. Воспользуйтесь другим способом
                </p>
              )}
            </div>
          </div>
        </div>
        <div className='relative hidden w-0 flex-1 lg:block'>
          <Image
            className='absolute inset-0 h-full w-full object-cover'
            src='https://www.mirea.ru/upload/medialibrary/1b3/01.jpg'
            alt=''
            fill
            aria-hidden='true'
          />
        </div>
      </div>
    </main>
  )
}

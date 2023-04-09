import Image from 'next/image'

export default function AuthError() {
  return (
    <div className='h-screen bg-white'>
      <main className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex-shrink-0 pt-16'>
          <Image
            className='mx-auto h-12 w-auto'
            src='/assets/ninja-logo-black.svg'
            alt='Mirea Ninja'
            width={100}
            height={100}
          />
        </div>
        <div className='mx-auto max-w-xl py-16 sm:py-24'>
          <div className='text-center'>
            <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
              Ошибка авторизации.
            </h1>
            <p className='mt-2 text-lg text-gray-500'>
              Воспользуйтесь другим способом входа или повторите попытку позже.
            </p>
          </div>
          <div className='mt-8'>
            <a href='/' className='text-base font-medium text-blue-700 hover:text-blue-600'>
              Перейдите на начальную страницу
              <span aria-hidden='true'> &rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

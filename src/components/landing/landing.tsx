import dynamic from 'next/dynamic'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import Logo from '@/components/logo'

const LandingCanvas = dynamic(() => import('@/components/landing/landing-canvas'), { ssr: false })

export default function Landing() {
  return (
    <div className='relative h-screen w-screen bg-gradient-to-t from-gray-300'>
      <LandingCanvas />
      <div className='absolute left-3 top-10 md:left-20'>
        <Logo />
      </div>
      <div className='absolute right-3 top-10 md:right-20'>
        <button
          type='button'
          onClick={() => void signIn()}
          className='mb-2 mr-2 rounded-lg bg-gray-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700'
        >
          Войти
        </button>
      </div>
      <div className='absolute left-1/2 right-0 top-1/2 flex -translate-x-1/2 transform flex-col items-center justify-center md:top-3/4 md:flex-row'>
        <Link
          href='/finds'
          type='button'
          className='mb-2 mr-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-l focus:outline-none focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-800'
        >
          Найденные вещи
        </Link>
        <Link
          href='/losses'
          type='button'
          className='mb-2 mr-2 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-pink-200 dark:focus:ring-pink-800'
        >
          Потерянные вещи
        </Link>
      </div>
    </div>
  )
}

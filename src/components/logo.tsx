import Link from 'next/link'
import Image from 'next/image'

export default function Logo() {
  return (
    <Link className='flex items-center space-x-3 text-lg' href='/'>
      <Image
        priority
        className='h-8 w-8'
        src='/assets/mirea.svg'
        alt='РТУ МИРЭА'
        width={10}
        height={10}
      />
      <span className='text-gray-600' aria-hidden='true'>
        /
      </span>
      <span className='font-semibold'>Бюро находок</span>
    </Link>
  )
}

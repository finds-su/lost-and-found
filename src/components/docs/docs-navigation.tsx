import { HomeIcon } from '@heroicons/react/20/solid'
import { useRouter } from 'next/router'
import React from 'react'
import Link from 'next/link'

const pageNames = new Map<string, string>([
  ['docs', 'Документы'],
  ['privacy-policy', 'Политика конфиденциальности'],
  ['terms-of-use', 'Пользовательское соглашение'],
])

export default function DocsNavigation() {
  const router = useRouter()
  const paths = router.pathname.split('/').slice(1)
  const pages = paths.map((page) => ({
    name: page,
    href: `/${paths.slice(0, paths.indexOf(page) + 1).join('/')}`,
  }))
  return (
    <nav className='flex' aria-label='Breadcrumb'>
      <ol role='list' className='flex items-center space-x-4'>
        <li>
          <div>
            <Link href='/' className='text-gray-400 hover:text-gray-500'>
              <HomeIcon className='h-5 w-5 flex-shrink-0' aria-hidden='true' />
              <span className='sr-only'>Бюро находок</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className='flex items-center'>
              <svg
                className='h-5 w-5 flex-shrink-0 text-gray-300'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 20 20'
                aria-hidden='true'
              >
                <path d='M5.555 17.776l8-16 .894.448-8 16-.894-.448z' />
              </svg>
              <Link
                href={page.href}
                className='ml-4 text-sm font-medium text-gray-500 hover:text-gray-700'
                aria-current={router.pathname === page.href ? 'page' : undefined}
              >
                {pageNames.get(page.name)}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

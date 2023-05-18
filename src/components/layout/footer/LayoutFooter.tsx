import Link from 'next/link'

const social = [
  {
    name: 'Саппорт',
    href: 'https://t.me/mirea_help_bot',
  },
]

export default function LayoutFooter() {
  return (
    <footer className='pt-4'>
      <div className='mx-auto w-full px-6'>
        <div className='-mx-3 flex flex-wrap items-center lg:justify-between'>
          <div className='mb-6 mt-0 w-full max-w-full shrink-0 px-3 lg:mb-0 lg:w-1/2 lg:flex-none'>
            <div className='text-size-sm items-center space-x-1 text-center leading-normal text-slate-500 lg:text-left'>
              © {new Date().getFullYear()}, сделано с{' '}
              <span className='transform transition duration-[10000ms] hover:text-red-600'>♥</span>{' '}
              командой
              <Link
                href='https://mirea.ninja'
                className='pr-1 font-semibold text-slate-700 hover:text-slate-900'
                target='_blank'
              >
                Mirea Ninja
              </Link>
              для студентов РТУ МИРЭА
            </div>
          </div>
          <div className='mt-0 w-full max-w-full shrink-0 px-3 lg:w-1/2 lg:flex-none'>
            <ul className='mb-0 flex list-none flex-wrap justify-center pl-0 lg:justify-end'>
              {social.map((item, index) => (
                <li className='nav-item' key={index}>
                  <a
                    rel='noreferrer'
                    href={item.href}
                    className='ease-soft-in-out text-size-sm block px-4 pb-1 pt-0 font-normal text-slate-700 transition-colors hover:text-slate-900'
                    target='_blank'
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

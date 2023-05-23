export const footerContent = [
  {
    name: 'Служба поддержки',
    href: 'https://t.me/mirea_help_bot',
  },
  {
    name: 'Документы',
    href: '/docs',
  },
]

export default function LayoutFooter() {
  return (
    <footer className='pt-4'>
      <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 md:flex md:items-center md:justify-between lg:px-8'>
        <div className='flex justify-center space-x-6 md:order-2'>
          {footerContent.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className='flex flex-row align-baseline text-gray-400 hover:text-gray-500'
              target='_blank'
            >
              <span className='pl-1'>{item.name}</span>
            </a>
          ))}
        </div>
        <div className='mt-8 md:order-1 md:mt-0'>
          <p className='text-center text-base text-gray-400'>
            &copy; {new Date().getFullYear()}, Mirea Ninja
          </p>
        </div>
      </div>
    </footer>
  )
}

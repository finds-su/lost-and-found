import Window from '@/components/form/window'
import Link from 'next/link'

const sections: { title: string; subsections: { name: string; href: string }[] }[] = [
  {
    title: 'Основное',
    subsections: [
      { name: 'test', href: '/test' },
      { name: 'test2', href: '/test2' },
      { name: 'test3', href: '/test3' },
    ],
  },
]
export default function AdminMenuList() {
  return (
    <Window>
      {sections.map((section) => (
        <div key={section.title}>
          <div className='border-b border-gray-200 bg-white px-4 py-5 sm:px-6'>
            <h3 className='text-lg font-medium leading-6 text-gray-900'>{section.title}</h3>
          </div>
          <ul className='mt-3 max-w-md list-inside list-disc space-y-1 text-gray-500 dark:text-gray-400'>
            {section.subsections.map((subsection) => (
              <li key={subsection.name} className='hover:underline'>
                <Link href={subsection.href}>{subsection.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Window>
  )
}

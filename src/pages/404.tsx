/* This example requires Tailwind CSS v2.0+ */
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { FlagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Error from '@/components/Error'

const links = [
  {
    title: 'Найденные вещи',
    description: 'Если нашли забытую вещь, воспользуйтесь этим разделом',
    href: '/finds',
    icon: FlagIcon,
  },
  {
    title: 'Потерянные вещи',
    description: 'Создайте запись здесь, если что-то потеряли',
    href: '/losses',
    icon: MagnifyingGlassIcon,
  },
]

export default function FourOhFour() {
  return (
    <Error
      code={404}
      name='Страница не существует.'
      description='Страница, которую Вы ищите, не может быть найдена.'
    />
  )
}

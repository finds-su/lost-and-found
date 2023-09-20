import { AiOutlineSafety, AiOutlineRight } from 'react-icons/ai'
import Link from 'next/link'

export const IsInStoragePlaceBanner: React.FC = () => {
  return (
    <div className='flex flex-row rounded-lg bg-blue-50 p-4 sm:col-span-6'>
      <div className='ml-3 text-sm'>
        <div className='flex items-start'>
          <div className='ml-3 text-sm'>
            <p className='text-lg font-bold text-gray-700'>Предмет находится в А-131</p>
            <p className='mt-1 text-gray-500'>
              А-131 - это аудитория, в которую можно отнести находки. Сотрудники студенческого союза
              заботятся о том, чтобы с предметом ничего не случилось! <br />
              <span className='font-bold'>Вы можете забрать предмет оттуда</span>
            </p>
            <Link
              target='_blank'
              href='https://map.mirea.ru/?object=2318:6159'
              className='mt-1 flex items-center text-blue-600 hover:text-blue-500'
            >
              Аудитория на карте <AiOutlineRight className='ml-1 h-4 w-4 text-blue-600' />
            </Link>
          </div>
        </div>
      </div>
      <AiOutlineSafety className='m-3 h-12 w-12 text-blue-600' aria-hidden='true' />
    </div>
  )
}

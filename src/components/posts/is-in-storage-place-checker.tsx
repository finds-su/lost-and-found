import Image from 'next/image'
import { Campus } from '@/lib/campus'
import { type RouterOutputs } from '@/lib/api'
import { humanReadableDate } from '@/lib/human-readable-date'
import { AiOutlineSafety, AiOutlineRight } from 'react-icons/ai'
import Link from 'next/link'

interface IsInStoragePlaceCheckerProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export const IsInStoragePlaceChecker: React.FC<IsInStoragePlaceCheckerProps> = ({
  checked,
  onChange,
}) => {
  return (
    <div className='flex flex-row rounded-lg bg-blue-50 p-4 sm:col-span-6'>
      <div className='ml-3 text-sm'>
        <div className='flex items-start'>
          <div className='flex h-5 items-center'>
            <input
              id='isInStoragePlace'
              name='isInStoragePlace'
              type='checkbox'
              className='h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
            />
          </div>
          <div className='ml-3 text-sm'>
            <label htmlFor='isInStoragePlace' className='font-bold text-gray-700'>
              Я отнес(ла) находку в А-131
            </label>
            <p className='mt-1 text-gray-500'>
              А-131 - это аудитория, в которую вы можете отнести находку. Сотрудники студенческого
              союза заберут её и позаботятся о том, чтобы с предметом ничего не случилось! <br />
              <span className='font-semibold'>Мы рекомендуем отнести найденный предмет туда</span>
            </p>
            <Link
              target='_blank'
              href='https://map.mirea.ru/?object=2318:6159'
              className='mt-1 flex items-center text-sm text-blue-600 hover:text-blue-500'
            >
              Аудитория на карте <AiOutlineRight className='ml-1 h-4 w-4 text-blue-600' />
            </Link>
          </div>
        </div>
      </div>
      <AiOutlineSafety className='m-3 hidden h-12 w-12 text-blue-600 sm:block' aria-hidden='true' />
    </div>
  )
}

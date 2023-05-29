import Window from '@/components/form/Window'
import { type OverviewPost } from '@/lib/types/OverviewPost'
import Image from 'next/image'
import { Campus } from '@/lib/campus'
import { formatDate } from '@/lib/formatDate'

interface OverviewPostProps {
  post: OverviewPost
}

export default function OverviewPost(props: OverviewPostProps) {
  const features = [
    { name: 'Дата создания', description: formatDate(props.post.created.toString()) },
    {
      name: 'Истекает',
      description: formatDate(props.post.expires.toString()),
    },
    { name: 'Кампус', description: Campus[props.post.campus] },
    {
      name: 'Автор',
      description: [props.post.user.name, `@${props.post.user.nickname}`].join(' '),
    },
  ]
  return (
    <Window>
      <div className='mx-auto grid max-w-2xl grid-cols-1 items-center gap-x-8 gap-y-16 px-4 py-24 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-2 lg:px-8'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            {props.post.name}
          </h2>
          <p className='mt-4 text-gray-500'>{props.post.description}</p>

          <dl className='mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:gap-x-8'>
            {features.map((feature) => (
              <div key={feature.name} className='border-t border-gray-200 pt-4'>
                <dt className='font-medium text-gray-900'>{feature.name}</dt>
                <dd className='mt-2 text-sm text-gray-500'>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className='grid grid-cols-2 grid-rows-2 gap-4 sm:gap-6 lg:gap-8'>
          {props.post.images.map((image, index) => (
            <Image
              key={index}
              src={image}
              alt=''
              height={500}
              width={500}
              className='rounded-lg bg-gray-100'
            />
          ))}
        </div>
      </div>
    </Window>
  )
}

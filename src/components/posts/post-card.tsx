import Image from 'next/image'
import { Campus } from '@/lib/campus'
import { type RouterOutputs } from '@/lib/api'
import { humanReadableDate } from '@/lib/human-readable-date'
import classNames from 'classnames'

interface PostCardProps {
  post: RouterOutputs['posts']['infinitePosts']['items'][0]
  displayReasonLabel?: boolean
}

export const PostCard: React.FC<PostCardProps> = ({ post, displayReasonLabel = false }) => {
  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200 transition duration-150 ease-in-out hover:border-gray-300 '>
      <div className='aspect-w-1 aspect-h-1'>
        <Image
          src={post.images[0] ?? '/assets/placeholder.svg'}
          alt=''
          width={800}
          height={800}
          className='h-full w-full object-cover object-center'
          priority
          aria-hidden='true'
        />
      </div>
      <div className='flex flex-col justify-between px-2 pb-2 pt-1'>
        <h3 className='mt-2 overflow-hidden text-ellipsis text-sm font-semibold text-gray-900'>
          <a href={`${post.reason === 'LOST' ? 'losses' : 'finds'}/${post.slug}`}>
            <span className='absolute inset-0' />
            {post.name}
          </a>
        </h3>

        <p className='mt-1 text-sm font-medium text-gray-700'>{Campus[post.campus]}</p>
        <div className='flex flex-row pt-2'>
          {displayReasonLabel && (
            <span
              className={classNames('mr-3 h-6 rounded-full px-2 py-1 text-xs', {
                'bg-red-100 text-red-800': post.reason === 'LOST',
                'bg-green-100 text-green-800': post.reason === 'FOUND',
              })}
            >
              {post.reason === 'LOST' ? 'Потеряно' : 'Найдено'}
            </span>
          )}
          <p className='font-xs mt-1 text-xs text-gray-500'>{humanReadableDate(post.created)}</p>
        </div>
      </div>
    </div>
  )
}

import { type LostAndFoundItemStatus } from '@prisma/client'

interface PostStatusBadgeProps {
  title?: string
  status: LostAndFoundItemStatus
}

export default function PostStatusBadge({ title, status }: PostStatusBadgeProps) {
  switch (status) {
    case 'ACTIVE':
      return (
        <div className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
          {title ?? 'Активен'}
        </div>
      )
    case 'EXPIRED':
      return (
        <div className='inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20'>
          {title ?? 'Просрочен'}
        </div>
      )
    case 'BLOCKED':
      return (
        <div className='inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10'>
          {title ?? 'Заблокирован'}
        </div>
      )
  }
}

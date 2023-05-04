import Avatar from '@/components/profile/Avatar'
import { type Role } from '@prisma/client'
import { Dropdown } from 'flowbite-react'
import { PencilIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

interface ProfileAvatarProps {
  imgSrc?: string | null
  role: Role
  placeholderInitials: string
  isOwner: boolean
}

export default function ProfileAvatar(props: ProfileAvatarProps) {
  return (
    <div className='relative'>
      <Avatar
        size='xl'
        placeholderInitials={props.placeholderInitials}
        src={props.imgSrc}
        rounded
      />
      {['ADMIN', 'MODERATOR'].includes(props.role) && (
        <span className='absolute bottom-0 left-1 m-2 h-6 w-6 rounded-full border-2 border-green-500 bg-green-500 text-black'>
          <ShieldCheckIcon />
        </span>
      )}
      {props.isOwner && (
        <div className='absolute -right-4 bottom-0'>
          <Dropdown
            label={
              <p className='-mx-3 -my-1 flex flex-row'>
                <PencilIcon className='mr-2 h-5 w-5' />
                Изм.
              </p>
            }
            arrowIcon={false}
            color='light'
            placement='right-end'
          >
            <Dropdown.Item>Загрузить&nbsp;фото</Dropdown.Item>
            <Dropdown.Item>Удалить&nbsp;фото</Dropdown.Item>
          </Dropdown>
        </div>
      )}
    </div>
  )
}

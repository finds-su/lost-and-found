import { type AvatarProps } from 'flowbite-react'
import Image from 'next/image'
import classNames from 'classnames/dedupe'
import { Avatar as FlowBiteAvatar } from 'flowbite-react'

export default function Avatar(
  props: Omit<AvatarProps, 'img' | 'placeholderInitials'> & {
    src?: string | null
    resolution: number
  },
) {
  if (props.src) {
    return (
      <FlowBiteAvatar
        img={({ className, ...imgProps }) => (
          <Image
            priority
            src={props.src ?? ''}
            className={classNames('bg-white object-cover', className)}
            alt=''
            width={props.resolution}
            height={props.resolution}
            placeholder='blur'
            blurDataURL='/assets/avatar-blur.png'
            aria-hidden='true'
            {...imgProps}
          />
        )}
        {...props}
      />
    )
  }
  return <FlowBiteAvatar {...props} />
}

import { type AvatarProps } from 'flowbite-react'
import Image from 'next/image'
import classNames from 'classnames/dedupe'
import { Avatar as FlowBiteAvatar } from 'flowbite-react'

export default function Avatar(props: Omit<AvatarProps, 'img'> & { src?: string | null }) {
  if (props.src) {
    return (
      <FlowBiteAvatar
        img={({ className, ...imgProps }) => (
          <Image
            priority
            src={props.src ?? ''}
            className={classNames('bg-white object-cover', className)}
            alt=''
            width={100}
            height={100}
            placeholder='blur'
            blurDataURL='/assets/avatar-blur.png'
            {...imgProps}
          />
        )}
        {...props}
      />
    )
  }
  return <FlowBiteAvatar {...props} />
}

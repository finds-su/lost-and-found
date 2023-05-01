import { type AvatarProps } from 'flowbite-react'
import Image from 'next/image'
import classNames from '@/utils/classNames'
import { Avatar as FlowBiteAvatar } from 'flowbite-react'

export default function Avatar(props: Omit<AvatarProps, 'img'> & { src?: string | null }) {
  if (props.src) {
    return (
      <FlowBiteAvatar
        img={({ className, ...imgProps }) => (
          <Image
            src={props.src as string}
            className={classNames('object-cover', className)}
            alt=''
            width={100}
            height={100}
            {...imgProps}
          />
        )}
        {...props}
      />
    )
  }
  return <FlowBiteAvatar {...props} />
}

import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Image from 'next/image'
import { type ComponentProps } from 'react'

type OverviewPostImageProps = Pick<ComponentProps<typeof Image>, 'src'>

export default function OverviewPostImage(props: OverviewPostImageProps) {
  return (
    <Zoom>
      <Image src={props.src} alt='' height={500} width={500} className='rounded-lg bg-white' />
    </Zoom>
  )
}

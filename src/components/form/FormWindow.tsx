import { type ReactNode } from 'react'
import Window from '@/components/form/Window'

interface FormWindowProps {
  name: string
  description: string
  children: ReactNode
}

export default function FormWindow(props: FormWindowProps) {
  return (
    <Window>
      <div className='md:grid md:grid-cols-3 md:gap-6'>
        <div className='md:col-span-1'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>{props.name}</h3>
          <p className='mt-1 text-sm text-gray-500'>{props.description}</p>
        </div>
        <div className='mt-5 space-y-6 md:col-span-2 md:mt-0'>{props.children}</div>
      </div>
    </Window>
  )
}

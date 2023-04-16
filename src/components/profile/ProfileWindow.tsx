import { type ReactNode } from 'react'

export default function ProfileWindow(props: { children: ReactNode }) {
  return (
    <div className='lg-max:mt-6 mb-4 w-full max-w-full px-3 xl:w-1/2'>
      <div className='shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border'>
        {props.children}
      </div>
    </div>
  )
}

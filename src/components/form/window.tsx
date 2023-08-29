import { type ReactNode } from 'react'

export default function Window({ children }: { children: ReactNode }) {
  return (
    <div className='rounded-lg border border-gray-100 bg-white px-4 py-5 sm:p-6'>{children}</div>
  )
}

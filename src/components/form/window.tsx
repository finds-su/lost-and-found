import { type ReactNode } from 'react'

export default function Window({ children }: { children: ReactNode }) {
  return (
    <div className='border border-gray-200 bg-white px-4 py-5 sm:rounded-lg sm:p-6'>{children}</div>
  )
}

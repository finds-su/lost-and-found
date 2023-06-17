import { type ReactNode } from 'react'

export default function Window({ children }: { children: ReactNode }) {
  return <div className='bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6'>{children}</div>
}

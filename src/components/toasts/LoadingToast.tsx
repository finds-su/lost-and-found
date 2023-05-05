import { Spinner, Toast as FlowbiteToast } from 'flowbite-react'
import { type ReactNode } from 'react'
import toast, { type Toast } from 'react-hot-toast'
import type AppToast from '@/components/toasts/Toast'

function LoadingToast(props: { toastOptions: Toast; message: string; icon?: ReactNode }) {
  return (
    <FlowbiteToast>
      <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500'>
        <div className='flex h-5 w-5 items-center justify-center'>
          {props.icon && props.icon}
          {!props.icon && <Spinner />}
        </div>
      </div>
      <div className='ml-3 text-sm font-normal'>{props.message}</div>
    </FlowbiteToast>
  )
}

const loadingToast: AppToast = (
  message: string,
  options?: { icon?: ReactNode; duration?: number; id?: string },
) => {
  return toast.custom(
    (t) => <LoadingToast toastOptions={t} message={message} icon={options?.icon} />,
    {
      duration: options && options.duration ? options.duration : 1000,
      id: options?.id,
    },
  )
}

export default loadingToast

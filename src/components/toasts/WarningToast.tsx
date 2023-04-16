import { Toast as FlowbiteToast } from 'flowbite-react'
import { type ReactNode } from 'react'
import toast, { type Toast } from 'react-hot-toast'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

function WarningToast(props: { toastOptions: Toast; message: string; icon?: ReactNode }) {
  return (
    <FlowbiteToast>
      <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500'>
        <div className='h-5 w-5'>
          {props.icon && props.icon}
          {!props.icon && <ExclamationTriangleIcon />}
        </div>
      </div>
      <div className='ml-3 text-sm font-normal'>{props.message}</div>
      <FlowbiteToast.Toggle onClick={() => toast.dismiss(props.toastOptions.id)} />
    </FlowbiteToast>
  )
}

export default function warningToast(message: string, icon?: ReactNode, duration?: number) {
  toast.custom((t) => <WarningToast toastOptions={t} message={message} icon={icon} />, {
    duration: duration ?? 1000,
  })
}

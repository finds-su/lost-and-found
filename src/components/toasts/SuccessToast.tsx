import { Toast as FlowbiteToast } from 'flowbite-react'
import { type ReactNode } from 'react'
import { CheckIcon } from '@heroicons/react/24/outline'
import toast, { type Toast } from 'react-hot-toast'
import type { AppToast, AppToastOptions } from '@/components/toasts/Toast'

function SuccessToast(props: { toastOptions: Toast; message: string; icon?: ReactNode }) {
  return (
    <FlowbiteToast>
      <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500'>
        <div className='h-5 w-5'>
          {props.icon && props.icon}
          {!props.icon && <CheckIcon />}
        </div>
      </div>
      <div className='ml-3 text-sm font-normal'>{props.message}</div>
      <FlowbiteToast.Toggle onClick={() => toast.dismiss(props.toastOptions.id)} />
    </FlowbiteToast>
  )
}

const successToast: AppToast = (message: string, options?: AppToastOptions) => {
  return toast.custom(
    (t) => <SuccessToast toastOptions={t} message={message} icon={options?.icon} />,
    {
      duration: options && options.duration ? options.duration : 3000,
      id: options?.id,
    },
  )
}

export default successToast

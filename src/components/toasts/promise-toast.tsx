import successToast from '@/components/toasts/success-toast'
import errorToast from '@/components/toasts/error-toast'
import loadingToast from '@/components/toasts/loading-toast'
import { type PromiseToastMessages } from '@/lib/types/toast'

export default function promiseToast<T>(promise: Promise<T>, messages: PromiseToastMessages) {
  const toastId = loadingToast(messages.loading)

  promise
    .then((p) => {
      successToast(messages.success, { id: toastId })
      return p
    })
    .catch(() => {
      errorToast(messages.error, { id: toastId })
    })

  return promise
}

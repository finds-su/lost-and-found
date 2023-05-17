import successToast from '@/components/toasts/SuccessToast'
import errorToast from '@/components/toasts/ErrorToast'
import loadingToast from '@/components/toasts/LoadingToast'
import { type PromiseToastMessages } from '@/lib/types/Toast'

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

import successToast from '@/components/toasts/SuccessToast'
import errorToast from '@/components/toasts/ErrorToast'
import loadingToast from '@/components/toasts/LoadingToast'

export default function promiseToast<T>(
  promise: Promise<T>,
  messages: {
    loading: string
    success: string
    error: string
  },
) {
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

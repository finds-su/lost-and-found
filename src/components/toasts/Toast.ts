import { type ReactNode } from 'react'

type AppToast = (
  message: string,
  options?: { icon?: ReactNode; duration?: number; id?: string },
) => string

export default AppToast

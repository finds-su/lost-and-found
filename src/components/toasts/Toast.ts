import { type ReactNode } from 'react'

export type AppToastOptions = { icon?: ReactNode; duration?: number; id?: string }

export type AppToast = (message: string, options?: AppToastOptions) => string

import { type ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { HotkeysProvider } from 'react-hotkeys-hook'
import { type NextPageOptions } from '@/pages/_app'

export default function Providers({
  children,
  session,
}: {
  children: ReactNode
  session: NextPageOptions['session']
}) {
  return (
    <SessionProvider session={session}>
      <HotkeysProvider initiallyActiveScopes={['app']}>{children}</HotkeysProvider>
    </SessionProvider>
  )
}

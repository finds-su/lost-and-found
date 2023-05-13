import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { type Session } from 'next-auth'

interface SessionState {
  session: Readonly<Session> | null
  setSession: (session: Session | null) => void
}

const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        session: null,
        setSession: (session) => set(() => ({ session })),
      }),
      {
        name: 'session-storage',
      },
    ),
  ),
)

export default useSessionStore

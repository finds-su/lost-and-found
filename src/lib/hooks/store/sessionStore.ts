import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type Session } from 'next-auth'

interface SessionState {
  session: Session | null
  setSession: (session: Session | null) => void
}

const useSessionStore = create<SessionState>()(
  devtools(
    (set) => ({
      session: null,
      setSession: (session) => set((state) => ({ ...state, session })),
    }),
    {
      name: 'session-storage',
    },
  ),
)

export default useSessionStore

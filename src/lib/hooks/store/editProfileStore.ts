import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface EditProfileState {
  edit: boolean
  close: () => void
  open: () => void
}

const useEditProfileStore = create<EditProfileState>()(
  devtools(
    persist(
      (set) => ({
        edit: false,
        close: () => set(() => ({ edit: false })),
        open: () => set(() => ({ edit: true })),
      }),
      {
        name: 'edit-profile-storage',
      },
    ),
  ),
)

export default useEditProfileStore

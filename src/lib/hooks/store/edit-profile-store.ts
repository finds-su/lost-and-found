import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface EditProfileState {
  edit: boolean
  close: () => void
  open: () => void
}

const useEditProfileStore = create<EditProfileState>()(
  devtools(
    (set) => ({
      edit: false,
      close: () => set(() => ({ edit: false })),
      open: () => set(() => ({ edit: true })),
    }),
    {
      name: 'edit-profile-storage',
    },
  ),
)

export default useEditProfileStore

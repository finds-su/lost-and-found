import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface AvatarPromptState {
  isAvatarPromptModalOpen: boolean
  closeAvatarPromptModal: () => void
  openAvatarPromptModal: () => void
  avatarPrompt: string | undefined
  setAvatarPrompt: (prompt: string | undefined) => void
}

const useAvatarPromptStore = create<AvatarPromptState>()(
  devtools(
    (set) => ({
      isAvatarPromptModalOpen: false,
      closeAvatarPromptModal: () => set((store) => ({ ...store, isAvatarPromptModalOpen: false })),
      openAvatarPromptModal: () => set((store) => ({ ...store, isAvatarPromptModalOpen: true })),
      avatarPrompt: undefined,
      setAvatarPrompt: (avatarPrompt) => set((store) => ({ ...store, avatarPrompt })),
    }),
    {
      name: 'avatar-prompt-storage',
    },
  ),
)

export default useAvatarPromptStore

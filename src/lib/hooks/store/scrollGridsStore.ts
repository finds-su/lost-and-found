import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SortOption } from '@/lib/types/SortOption'
import { Campus as PrismaCampus, PostItemReason } from '@prisma/client'
import { immer } from 'zustand/middleware/immer'

const reasons = Object.values(PostItemReason)
type reasonType = (typeof reasons)[number]

export interface ScrollGridOptions {
  enabledSortOption: SortOption
  checkedFilters: string[]
  setSortOption: (option: SortOption) => void
  addFilter: (newFilter: string) => void
  deleteFilter: (filterToDelete: string) => void
}

type ScrollGridsState = Record<reasonType, ScrollGridOptions>

const useScrollGridStore = create<ScrollGridsState>()(
  devtools(
    immer((set) => ({
      LOST: {
        enabledSortOption: SortOption.newFirst,
        checkedFilters: Object.values(PrismaCampus),
        setSortOption: (option) =>
          set((state) => {
            state.LOST.enabledSortOption = option
          }),
        addFilter: (filter) =>
          set((state) => {
            state.LOST.checkedFilters.push(filter)
          }),
        deleteFilter: (filterToDelete) =>
          set((state) => {
            state.LOST.checkedFilters = state.LOST.checkedFilters.filter(
              (value) => value !== filterToDelete,
            )
          }),
      },
      FOUND: {
        enabledSortOption: SortOption.newFirst,
        checkedFilters: Object.values(PrismaCampus),
        setSortOption: (option) =>
          set((state) => {
            state.FOUND.enabledSortOption = option
          }),
        addFilter: (filter) =>
          set((state) => {
            state.FOUND.checkedFilters.push(filter)
          }),
        deleteFilter: (filterToDelete) =>
          set((state) => {
            state.LOST.checkedFilters = state.LOST.checkedFilters.filter(
              (value) => value !== filterToDelete,
            )
          }),
      },
    })),
    {
      name: 'scroll-grids-storage',
    },
  ),
)

export default useScrollGridStore
